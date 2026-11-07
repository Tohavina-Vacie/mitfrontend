import { useCallback, useEffect, useState } from "react";
import { api, urlFichier } from "../../services/api";
import AvecEntreprise from "./AvecEntreprise";
import { dateFr, nomPersonne } from "../../services/format";

const STATUTS = { en_attente: "En attente", acceptee: "Acceptée", refusee: "Refusée" };

function Contenu({ entreprise }) {
  const [offres, setOffres] = useState([]);
  const [candidatures, setCandidatures] = useState(null);
  const [filtres, setFiltres] = useState({ offre: "", statut: "" });
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/offres").then((l) => setOffres(l.filter((o) => o.entreprise?._id === entreprise._id))).catch((e) => setErreur(e.message));
    api("/candidatures").then(setCandidatures).catch((e) => setErreur(e.message));
  }, [entreprise._id]);
  useEffect(() => { charger(); }, [charger]);

  const ids = new Set(offres.map((o) => o._id));
  const visibles = (candidatures || [])
    .filter((c) => ids.has(c.offre?._id))
    .filter((c) => (!filtres.offre || c.offre?._id === filtres.offre) && (!filtres.statut || c.statut === filtres.statut))
    .sort((a, b) => new Date(b.date_candidature) - new Date(a.date_candidature));

  const changer = async (c, statut) => {
    setErreur("");
    try {
      await api(`/candidatures/${c._id}`, { method: "PUT", body: { statut } });
      setCandidatures((l) => l.map((x) => (x._id === c._id ? { ...x, statut } : x)));
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <>
      <h1 className="dash-titre">Candidatures</h1>
      <p className="dash-sous">Candidatures reçues sur les offres de {entreprise.nom}.</p>

      <div className="dash-filtres">
        <div>
          <label htmlFor="ce-offre">Offre</label>
          <select id="ce-offre" className="form-select" value={filtres.offre} onChange={(e) => setFiltres({ ...filtres, offre: e.target.value })}>
            <option value="">Toutes les offres</option>
            {offres.map((o) => <option key={o._id} value={o._id}>{o.titre}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ce-statut">Statut</label>
          <select id="ce-statut" className="form-select" value={filtres.statut} onChange={(e) => setFiltres({ ...filtres, statut: e.target.value })}>
            <option value="">Tous</option>
            {Object.entries(STATUTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Candidat</th><th>Offre</th><th>Date</th><th>CV</th><th>Décision</th></tr></thead>
            <tbody>
              {visibles.map((c) => (
                <tr key={c._id}>
                  <td><strong>{nomPersonne(c.utilisateur) || "Compte supprimé"}</strong><small className="d-block" style={{ color: "#8c9bbd" }}>{c.utilisateur?.email}</small></td>
                  <td>{c.offre?.titre}</td>
                  <td>{dateFr(c.date_candidature)}</td>
                  <td><a href={urlFichier(c.cv)} target="_blank" rel="noreferrer" style={{ color: "#e8761f" }}>Voir le CV</a></td>
                  <td>
                    <select className="form-select form-select-sm w-auto" aria-label={`Décision pour ${nomPersonne(c.utilisateur)}`} value={c.statut} onChange={(e) => changer(c, e.target.value)}>
                      {Object.entries(STATUTS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {candidatures && visibles.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucune candidature.</td></tr>}
              {!candidatures && !erreur && <tr><td colSpan="5" className="dash-vide">Chargement…</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default function CandidaturesEntreprise() {
  return <AvecEntreprise>{(entreprise) => <Contenu entreprise={entreprise} />}</AvecEntreprise>;
}
