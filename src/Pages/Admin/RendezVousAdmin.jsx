import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import { nomPersonne } from "../../services/format";

const FUSEAU = "Indian/Antananarivo";
const STATUTS = { en_attente: ["orange", "En attente"], confirme: ["vert", "Confirmé"], refuse: ["rouge", "Refusé"], annule: ["gris", "Annulé"] };
const quand = (d) => new Date(d).toLocaleString("fr-FR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: FUSEAU });

export default function RendezVousAdmin() {
  const [liste, setListe] = useState(null);
  const [statut, setStatut] = useState("");
  const [periode, setPeriode] = useState("avenir");
  const [modale, setModale] = useState(null); // { type: "confirmer" | "refuser", rdv, lien_visio, raison }
  const [info, setInfo] = useState(null); // { type, texte, mailto? }
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/rendez-vous", { params: { statut } }).then(setListe).catch((e) => setErreur(e.message));
  }, [statut]);
  useEffect(() => { charger(); }, [charger]);

  const maintenant = Date.now();
  const visibles = (liste || []).filter((r) => periode === "tous" || (periode === "avenir" ? new Date(r.fin).getTime() >= maintenant : new Date(r.fin).getTime() < maintenant));
  const enAttente = (liste || []).filter((r) => r.statut === "en_attente" && new Date(r.fin).getTime() >= maintenant).length;
  const confirmes = (liste || []).filter((r) => r.statut === "confirme" && new Date(r.fin).getTime() >= maintenant).length;

  const fermer = () => { setModale(null); setErreur(""); };

  const valider = async (e) => {
    e.preventDefault();
    setErreur("");
    const { type, rdv } = modale;
    const corps = type === "confirmer" ? (modale.lien_visio.trim() ? { lien_visio: modale.lien_visio.trim() } : {}) : (modale.raison.trim() ? { raison: modale.raison.trim() } : {});
    try {
      const r = await api(`/rendez-vous/${rdv._id}/${type === "confirmer" ? "confirmer" : "refuser"}`, { method: "PUT", body: corps });
      const verbe = type === "confirmer" ? "confirmé" : rdv.statut === "confirme" ? "annulé" : "refusé";
      setInfo(r.email_envoye
        ? { type: "success", texte: `Rendez-vous ${verbe} : un e-mail a été envoyé au demandeur.` }
        : { type: "warning", texte: `Rendez-vous ${verbe}, mais l'e-mail n'a pas pu être envoyé (vérifiez la configuration SMTP). Écrivez au demandeur vous-même :`, mailto: rdv.email });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const supprimer = async (r) => {
    if (!window.confirm("Supprimer définitivement ce rendez-vous ?")) return;
    setErreur(""); setInfo(null);
    try {
      await api(`/rendez-vous/${r._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <>
      <h1 className="dash-titre">Rendez-vous</h1>
      <p className="dash-sous">Demandes de rendez-vous en visioconférence (15 minutes) prises depuis le site.</p>

      <div className="dash-stats">
        <div className="dash-carte dash-stat"><div className="titre">À traiter</div><div className="valeur">{liste ? enAttente : "…"}</div><div className="sous">Demandes en attente à venir</div></div>
        <div className="dash-carte dash-stat"><div className="titre">Confirmés</div><div className="valeur">{liste ? confirmes : "…"}</div><div className="sous">Rendez-vous à venir</div></div>
      </div>

      <div className="dash-filtres">
        <div>
          <label htmlFor="rv-statut">Statut</label>
          <select id="rv-statut" className="form-select" value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(STATUTS).map(([v, [, l]]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rv-periode">Période</label>
          <select id="rv-periode" className="form-select" value={periode} onChange={(e) => setPeriode(e.target.value)}>
            <option value="avenir">À venir</option><option value="passes">Passés</option><option value="tous">Tous</option>
          </select>
        </div>
      </div>

      {info && <div className={`alert alert-${info.type}`}>{info.texte} {info.mailto && <a href={`mailto:${info.mailto}`}>{info.mailto}</a>}</div>}
      {erreur && !modale && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Date (Madagascar)</th><th>Demandeur</th><th>Motif</th><th>Statut</th><th>Traité par</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {visibles.map((r) => {
                const [couleur, libelle] = STATUTS[r.statut] || ["gris", r.statut];
                const actif = r.statut === "en_attente" || r.statut === "confirme";
                return (
                  <tr key={r._id}>
                    <td style={{ whiteSpace: "nowrap" }}><strong>{quand(r.debut)}</strong></td>
                    <td>
                      <strong>{[r.prenom, r.nom].filter(Boolean).join(" ")}</strong>
                      <small className="d-block" style={{ color: "#8c9bbd" }}>{r.email}{r.telephone ? ` · ${r.telephone}` : ""}</small>
                    </td>
                    <td style={{ maxWidth: 280, wordBreak: "break-word" }}>
                      {r.motif}
                      {r.lien_visio && <small className="d-block"><a href={r.lien_visio} target="_blank" rel="noreferrer" style={{ color: "#e8761f" }}>Lien de visioconférence</a></small>}
                      {r.raison && <small className="d-block" style={{ color: "#8c9bbd" }}>Raison : {r.raison}</small>}
                    </td>
                    <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                    <td>{nomPersonne(r.traite_par) || "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="d-flex gap-1 justify-content-end flex-wrap">
                        {r.statut === "en_attente" && <button type="button" className="dash-btn petit" onClick={() => { setInfo(null); setModale({ type: "confirmer", rdv: r, lien_visio: "" }); }}>Confirmer</button>}
                        {actif && <button type="button" className="dash-btn petit" onClick={() => { setInfo(null); setModale({ type: "refuser", rdv: r, raison: "" }); }}>{r.statut === "confirme" ? "Annuler" : "Refuser"}</button>}
                        <button type="button" className="dash-mini-btn" aria-label="Supprimer le rendez-vous" onClick={() => supprimer(r)}><Icone nom="trash" taille={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {liste && visibles.length === 0 && <tr><td colSpan="6" className="dash-vide">Aucun rendez-vous.</td></tr>}
              {!liste && !erreur && <tr><td colSpan="6" className="dash-vide">Chargement…</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {modale?.type === "confirmer" && (
        <Modale titre="Confirmer le rendez-vous" envoi="Confirmer et prévenir" onSubmit={valider} onClose={fermer} erreur={erreur}>
          <p style={{ color: "#c9d6f5" }}>{[modale.rdv.prenom, modale.rdv.nom].filter(Boolean).join(" ")} · {quand(modale.rdv.debut)}. Un e-mail de confirmation lui sera envoyé.</p>
          <Champ id="rv-lien" label="Lien de la visioconférence (optionnel)" className="mb-4">
            <input id="rv-lien" type="url" className="form-control" placeholder="https://meet.google.com/…" value={modale.lien_visio} onChange={(e) => setModale({ ...modale, lien_visio: e.target.value })} />
          </Champ>
        </Modale>
      )}

      {modale?.type === "refuser" && (
        <Modale titre={modale.rdv.statut === "confirme" ? "Annuler le rendez-vous" : "Refuser la demande"} envoi={modale.rdv.statut === "confirme" ? "Annuler et prévenir" : "Refuser et prévenir"} onSubmit={valider} onClose={fermer} erreur={erreur}>
          <p style={{ color: "#c9d6f5" }}>{[modale.rdv.prenom, modale.rdv.nom].filter(Boolean).join(" ")} · {quand(modale.rdv.debut)}. Un e-mail lui sera envoyé et le créneau redeviendra disponible.</p>
          <Champ id="rv-raison" label="Raison (optionnel, ajoutée à l'e-mail)" className="mb-4">
            <textarea id="rv-raison" rows="3" className="form-control" value={modale.raison} onChange={(e) => setModale({ ...modale, raison: e.target.value })} />
          </Champ>
        </Modale>
      )}
    </>
  );
}
