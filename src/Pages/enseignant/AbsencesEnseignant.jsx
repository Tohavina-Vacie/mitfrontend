import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import { dateFr, heure, nomPersonne, plusJours } from "../../services/format";

export default function AbsencesEnseignant() {
  const [seances, setSeances] = useState(null);
  const [seanceId, setSeanceId] = useState("");
  const [etudiants, setEtudiants] = useState([]);
  const [absents, setAbsents] = useState({});
  const [motif, setMotif] = useState("");
  const [absences, setAbsences] = useState([]);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  // Séances des 30 derniers jours (et celles de demain)
  useEffect(() => {
    api("/seances/mon-planning", { params: { du: plusJours(new Date(), -30).toISOString(), au: plusJours(new Date(), 1).toISOString() } })
      .then((l) => {
        const recentes = [...l].reverse();
        setSeances(recentes);
        setSeanceId((recentes.find((s) => new Date(s.debut) <= new Date()) || recentes[0])?._id || "");
      }).catch((e) => setErreur(e.message));
  }, []);

  const chargerAbsences = useCallback(() => {
    api("/absences").then(setAbsences).catch((e) => setErreur(e.message));
  }, []);
  useEffect(() => { chargerAbsences(); }, [chargerAbsences]);

  const seance = (seances || []).find((s) => s._id === seanceId);

  // Étudiants de la promotion : fournis par la route des notes du cours
  useEffect(() => {
    setAbsents({});
    setEtudiants([]);
    if (!seance?.cours?._id) return;
    api(`/notes/cours/${seance.cours._id}`).then((d) => setEtudiants(d.notes.map((n) => n.etudiant))).catch((e) => setErreur(e.message));
  }, [seance?.cours?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const dejaEnregistres = useMemo(() => new Set(absences.filter((a) => a.seance?._id === seanceId).map((a) => a.etudiant?._id)), [absences, seanceId]);
  const mesCours = useMemo(() => new Set((seances || []).map((s) => s.cours?._id)), [seances]);
  const recentes = absences.filter((a) => mesCours.has(a.seance?.cours?._id)).slice(0, 15);
  const aEnregistrer = etudiants.filter((e) => absents[e._id] && !dejaEnregistres.has(e._id));

  const enregistrer = async () => {
    setMessage(""); setErreur("");
    const resultats = await Promise.allSettled(aEnregistrer.map((e) => api("/absences", { method: "POST", body: { etudiant: e._id, seance: seanceId, date: new Date(seance.debut).toISOString(), ...(motif.trim() ? { motif: motif.trim() } : {}) } })));
    const ok = resultats.filter((r) => r.status === "fulfilled").length;
    const echecs = resultats.filter((r) => r.status === "rejected");
    setMessage(ok ? `${ok} absence(s) enregistrée(s).` : "");
    if (echecs.length) setErreur(`${echecs.length} absence(s) non enregistrée(s) : ${echecs[0].reason.message}`);
    setAbsents({});
    setMotif("");
    chargerAbsences();
  };

  return (
    <>
      <h1 className="dash-titre">Absences</h1>
      <p className="dash-sous">Enregistrez les absences de vos étudiants pour une séance. L'administration gère ensuite leur justification.</p>
      {message && <div className="alert alert-success">{message}</div>}
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {seances && seances.length === 0 && <div className="dash-carte"><p className="dash-vide">Aucune séance publiée sur les 30 derniers jours.</p></div>}

      {seances && seances.length > 0 && (
        <section className="dash-carte mb-3">
          <div className="dash-filtres" style={{ marginBottom: 12 }}>
            <div>
              <label htmlFor="ae-seance">Séance</label>
              <select id="ae-seance" className="form-select" value={seanceId} onChange={(e) => setSeanceId(e.target.value)}>
                {seances.map((s) => <option key={s._id} value={s._id}>{s.cours?.titre} — {dateFr(s.debut)} {heure(s.debut)} ({s.niveau})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ae-motif">Motif (optionnel, appliqué aux absences cochées)</label>
              <input id="ae-motif" className="form-control" placeholder="Ex : non excusée" value={motif} onChange={(e) => setMotif(e.target.value)} />
            </div>
          </div>

          <div className="dash-table-zone">
            <table className="dash-table">
              <thead><tr><th style={{ width: 90 }}>Absent</th><th>Étudiant</th><th>N° étudiant</th></tr></thead>
              <tbody>
                {etudiants.map((e) => {
                  const deja = dejaEnregistres.has(e._id);
                  return (
                    <tr key={e._id}>
                      <td><input type="checkbox" className="form-check-input" aria-label={`${nomPersonne(e)} absent`} disabled={deja} checked={deja || !!absents[e._id]} onChange={(ev) => setAbsents({ ...absents, [e._id]: ev.target.checked })} /></td>
                      <td><strong>{nomPersonne(e)}</strong>{deja && <span className="dash-tag rouge ms-2">Déjà enregistrée</span>}</td>
                      <td>{e.numero_etudiant || "—"}</td>
                    </tr>
                  );
                })}
                {etudiants.length === 0 && <tr><td colSpan="3" className="dash-vide">Aucun étudiant actif dans cette promotion.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-3"><button type="button" className="dash-btn principal" disabled={!aEnregistrer.length} onClick={enregistrer}>Enregistrer les absences ({aEnregistrer.length})</button></div>
        </section>
      )}

      <section className="dash-carte">
        <h2>Absences récentes de mes cours</h2>
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Étudiant</th><th>Cours</th><th>Date</th><th>Motif</th><th>Statut</th></tr></thead>
            <tbody>
              {recentes.map((a) => (
                <tr key={a._id}>
                  <td><strong>{nomPersonne(a.etudiant) || "Compte supprimé"}</strong></td>
                  <td>{a.seance?.cours?.titre || "—"}</td>
                  <td>{dateFr(a.date)}</td>
                  <td>{a.motif || "—"}</td>
                  <td><span className={`dash-tag ${a.justifiee ? "vert" : "rouge"}`}>{a.justifiee ? "Justifiée" : "Non justifiée"}</span></td>
                </tr>
              ))}
              {recentes.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucune absence enregistrée.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
