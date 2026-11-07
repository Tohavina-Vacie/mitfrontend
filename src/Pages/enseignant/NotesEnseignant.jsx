import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";

const arrondi = (n) => Math.round(n * 100) / 100;
const versNombre = (v) => (v === "" || v === null || v === undefined ? null : Number(v));
// Pondération identique au serveur : CC1 20 %, CC2 30 %, examen 50 %
const moyenneLocale = (l) => {
  const [a, b, c] = [l.cc1, l.cc2, l.examen].map(versNombre);
  return a === null || b === null || c === null ? null : arrondi(a * 0.2 + b * 0.3 + c * 0.5);
};
const TRANCHES = [["[16 - 20] Excellent", "excellent"], ["[12 - 16] Bien", "bien"], ["[10 - 12] Passable", "passable"], ["[0 - 10] Insuffisant", "insuffisant"]];

export default function NotesEnseignant() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [cours, setCours] = useState(null);
  const [coursId, setCoursId] = useState("");
  const [data, setData] = useState(null);
  const [lignes, setLignes] = useState([]);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/cours", { params: { enseignant: user.id } }).then((c) => {
      setCours(c);
      const voulu = params.get("cours");
      setCoursId(c.some((x) => x._id === voulu) ? voulu : c[0]?._id || "");
    }).catch((e) => setErreur(e.message));
  }, [user.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const charger = useCallback(() => {
    if (!coursId) { setData(null); setLignes([]); return; }
    api(`/notes/cours/${coursId}`).then((d) => {
      setData(d);
      setLignes(d.notes.map((n) => ({ ...n, cc1: n.cc1 ?? "", cc2: n.cc2 ?? "", examen: n.examen ?? "", modifie: false })));
    }).catch((e) => setErreur(e.message));
  }, [coursId]);
  useEffect(() => { setMessage(""); setErreur(""); charger(); }, [charger]);

  const change = (i, champ, valeur) => setLignes((l) => l.map((x, j) => (j === i ? { ...x, [champ]: valeur, modifie: true } : x)));
  const modifiees = lignes.filter((l) => l.modifie);

  const enregistrer = async () => {
    setMessage(""); setErreur("");
    if (!modifiees.length) return setMessage("Aucune modification à enregistrer.");
    try {
      await api("/notes/saisie", { method: "POST", body: { cours: coursId, notes: modifiees.map((l) => ({ etudiant: l.etudiant._id, cc1: versNombre(l.cc1), cc2: versNombre(l.cc2), examen: versNombre(l.examen) })) } });
      setMessage("Notes enregistrées.");
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const st = data?.statistiques;
  const cible = (cours || []).find((c) => c._id === coursId);

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Saisie des évaluations</h1>
          <p className="dash-sous">Encodez les notes de vos modules. La validation finale est faite par l'administration.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={enregistrer} disabled={!modifiees.length}>Enregistrer ({modifiees.length})</button>
      </div>

      {cours && cours.length === 0 && <div className="dash-carte"><p className="dash-vide">Aucun cours ne vous est attribué : il n'y a pas de notes à saisir.</p></div>}
      {cours && cours.length > 0 && (
        <div className="dash-filtres">
          <div>
            <label htmlFor="ne-cours">Matière / module</label>
            <select id="ne-cours" className="form-select" value={coursId} onChange={(e) => setCoursId(e.target.value)}>
              {cours.map((c) => <option key={c._id} value={c._id}>{c.titre} — {c.niveau}, {c.semestre}</option>)}
            </select>
          </div>
          {cible && <div><label>Formation</label><input className="form-control" disabled value={cible.formation?.titre || "—"} /></div>}
        </div>
      )}

      {message && <div className="alert alert-success">{message}</div>}
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      {data && (
        <div className="dash-colonnes">
          <section className="dash-carte">
            <div className="dash-table-zone">
              <table className="dash-table">
                <thead><tr><th>Étudiant</th><th>CC1 (20%)</th><th>CC2 (30%)</th><th>Examen (50%)</th><th>Moyenne</th></tr></thead>
                <tbody>
                  {lignes.map((l, i) => {
                    const m = l.modifie ? moyenneLocale(l) : l.moyenne;
                    return (
                      <tr key={l.etudiant._id}>
                        <td><strong>{l.etudiant.prenom} {l.etudiant.nom}</strong>
                          {l.validee && <span className="dash-tag vert ms-2">Validée</span>}
                          <small className="d-block" style={{ color: "#8c9bbd" }}>{l.etudiant.numero_etudiant}</small></td>
                        {["cc1", "cc2", "examen"].map((c) => (
                          <td key={c}>
                            <input type="number" min="0" max="20" step="0.25" className="form-control dash-note-input" disabled={l.validee}
                              aria-label={`${c} de ${l.etudiant.nom}`} value={l[c]} onChange={(e) => change(i, c, e.target.value)} />
                          </td>
                        ))}
                        <td><strong className="dash-note">{m == null ? "—" : m}</strong>{l.modifie && <small className="d-block" style={{ color: "#8c9bbd" }}>non enregistrée</small>}</td>
                      </tr>
                    );
                  })}
                  {lignes.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucun étudiant actif dans cette formation et ce niveau.</td></tr>}
                </tbody>
              </table>
            </div>
            {lignes.some((l) => l.validee) && <p className="dash-sous mt-3 mb-0" style={{ fontSize: ".8rem" }}>Les notes validées sont verrouillées : seule l'administration peut les modifier.</p>}
          </section>

          <div className="dash-colonne">
            <div className="dash-carte dash-stat"><div className="titre">Taux de réussite</div><div className="valeur">{st?.taux_reussite == null ? "—" : `${st.taux_reussite}%`}</div><div className="sous">Moyenne ≥ 10/20 · {st?.notes_completes ?? 0} note(s) complète(s) sur {st?.effectif ?? 0}</div></div>
            <div className="dash-carte dash-stat"><div className="titre">Moyenne de la classe</div><div className="valeur">{st?.moyenne_classe == null ? "—" : st.moyenne_classe}</div><div className="sous">Sur les notes complètes</div></div>
            <section className="dash-carte">
              <h2>Distribution des notes</h2>
              {TRANCHES.map(([label, cle]) => {
                const pct = st?.distribution?.[cle] ?? 0;
                return <div key={cle}><div className="dash-barre-ligne"><span>{label}</span><span>{pct}%</span></div><div className="dash-progres"><span style={{ width: `${pct}%` }} /></div></div>;
              })}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
