import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { dateFr, nomPersonne } from "../../services/format";

const STATUTS = { active: ["vert", "Active"], validation: ["orange", "En validation"], terminee: ["gris", "Terminée"], annulee: ["gris", "Annulée"] };

export default function AlternantsEnseignant() {
  const [conventions, setConventions] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/conventions/mes-conventions").then(setConventions).catch((e) => setErreur(e.message));
  }, []);

  return (
    <>
      <h1 className="dash-titre">Alternants</h1>
      <p className="dash-sous">Les étudiants dont vous êtes le tuteur pédagogique.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Étudiant</th><th>Entreprise</th><th>Poste</th><th>Période</th><th>Statut</th></tr></thead>
            <tbody>
              {(conventions || []).map((c) => {
                const [couleur, libelle] = STATUTS[c.statut] || ["gris", c.statut];
                return (
                  <tr key={c._id}>
                    <td><strong>{nomPersonne(c.etudiant) || "—"}</strong><small className="d-block" style={{ color: "#8c9bbd" }}>{c.etudiant?.numero_etudiant}</small></td>
                    <td>{c.entreprise?.nom || "—"}</td>
                    <td>{c.poste}<small className="d-block" style={{ color: "#8c9bbd" }}>{c.type === "stage" ? "Stage" : "Alternance"}</small></td>
                    <td style={{ whiteSpace: "nowrap" }}>{dateFr(c.date_debut)} → {dateFr(c.date_fin)}</td>
                    <td><span className={`dash-tag ${couleur}`}>{libelle}</span></td>
                  </tr>
                );
              })}
              {conventions && conventions.length === 0 && <tr><td colSpan="5" className="dash-vide">Vous n'êtes tuteur d'aucune convention pour le moment.</td></tr>}
              {!conventions && !erreur && <tr><td colSpan="5" className="dash-vide">Chargement…</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
