
import { useEffect, useState } from "react";
import { api, urlFichier } from "../../services/api";


const ONGLETS = [
  "Profil",
  "Notes",
  "Absences",
  "Inscriptions",
  "Candidatures",
  "Stages",
  "Paiements",
  "Documents",
];

const valeur = (v) => v ?? "—";
const date = (v) =>
  v ? new Date(v).toLocaleDateString("fr-FR") : "—";
const argent = (v) =>
  `${Number(v || 0).toLocaleString("fr-FR")} Ar`;

export default function DossierEtudiant({ etudiant, onClose }) {
  const [dossier, setDossier] = useState(null);
  const [onglet, setOnglet] = useState("Profil");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let actif = true;

    api(`/users/${etudiant.id}/dossier`)
      .then((data) => {
        if (actif) setDossier(data);
      })
      .catch((e) => {
        if (actif) setErreur(e.message);
      })
      .finally(() => {
        if (actif) setChargement(false);
      });

    return () => {
      actif = false;
    };
  }, [etudiant.id]);

  const profil = dossier?.profil;

  const tableau = (entetes, lignes, rendu) => (
    <div className="dash-table-zone">
      <table className="dash-table">
        <thead>
          <tr>{entetes.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {lignes.length ? lignes.map((item, i) => (
            <tr key={item._id || item.id || i}>
              {rendu(item)}
            </tr>
          )) : (
            <tr>
              <td colSpan={entetes.length} className="dash-vide">
                Aucune donnée disponible.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const contenu = () => {
    if (!dossier) return null;

    switch (onglet) {
      case "Profil":
        return (
          <div className="dos-profil">
            <div className="dos-identite">
              {profil.photo ? (
                <img src={urlFichier(profil.photo)} alt="" />
              ) : (
                <div className="dos-avatar">
                  {profil.prenom?.[0]}{profil.nom?.[0]}
                </div>
              )}
              <div>
                <h2>{profil.prenom} {profil.nom}</h2>
                <p>{profil.numero_etudiant || "Sans numéro étudiant"}</p>
                <span className={`dash-tag ${profil.statut === "actif" ? "vert" : "gris"}`}>
                  {profil.statut}
                </span>
              </div>
            </div>

            <div className="dos-infos">
              {[
                ["Email", profil.email],
                ["Téléphone", profil.telephone],
                ["Adresse", profil.adresse],
                ["Date de naissance", date(profil.date_naissance)],
                ["Formation", profil.formation?.titre],
                ["Niveau", profil.niveau],
                ["Date d'inscription", date(profil.date_inscription)],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>{valeur(value)}</strong>
                </div>
              ))}
            </div>
          </div>
        );

      case "Notes":
        return (
          <>
            <div className="dos-stats">
              <div><small>Moyenne générale</small><strong>{valeur(dossier.notes.moyenne_generale)}</strong></div>
              <div><small>Rang</small><strong>{dossier.notes.rang ? `${dossier.notes.rang}/${dossier.notes.effectif_promotion}` : "—"}</strong></div>
              <div><small>ECTS total</small><strong>{valeur(dossier.notes.ects_total)}</strong></div>
            </div>
            {tableau(
              ["Matière", "CC1", "CC2", "Examen", "Moyenne", "ECTS", "Statut"],
              dossier.notes.matieres || [],
              (n) => <>
                <td>{n.cours?.titre}</td>
                <td>{valeur(n.cc1)}</td>
                <td>{valeur(n.cc2)}</td>
                <td>{valeur(n.examen)}</td>
                <td>{valeur(n.moyenne)}</td>
                <td>{valeur(n.ects)}</td>
                <td>{valeur(n.statut)}</td>
              </>
            )}
          </>
        );

      case "Absences":
        return (
          <>
            <div className="dos-stats">
              <div><small>Total</small><strong>{dossier.absences.total}</strong></div>
              <div><small>Justifiées</small><strong>{dossier.absences.justifiees}</strong></div>
              <div><small>Non justifiées</small><strong>{dossier.absences.non_justifiees}</strong></div>
            </div>
            {tableau(
              ["Date", "Cours", "Justification"],
              dossier.absences.liste || [],
              (a) => <>
                <td>{date(a.date || a.seance?.date)}</td>
                <td>{valeur(a.seance?.cours?.titre)}</td>
                <td>{a.justifiee ? "Justifiée" : "Non justifiée"}</td>
              </>
            )}
          </>
        );

      case "Inscriptions":
        return tableau(
          ["Formation", "Date", "Statut"],
          dossier.inscriptions || [],
          (i) => <>
            <td>{valeur(i.formation?.titre)}</td>
            <td>{date(i.date_inscription)}</td>
            <td>{valeur(i.statut)}</td>
          </>
        );

      case "Candidatures":
        return tableau(
          ["Offre", "Entreprise", "Date", "Statut"],
          dossier.candidatures || [],
          (c) => <>
            <td>{valeur(c.offre?.titre)}</td>
            <td>{valeur(c.offre?.entreprise?.nom)}</td>
            <td>{date(c.date_candidature)}</td>
            <td>{valeur(c.statut)}</td>
          </>
        );

      case "Stages":
        return tableau(
          ["Entreprise", "Tuteur", "Début", "Fin", "Statut"],
          dossier.conventions || [],
          (c) => <>
            <td>{valeur(c.entreprise?.nom)}</td>
            <td>{c.tuteur ? `${c.tuteur.prenom || ""} ${c.tuteur.nom || ""}` : "—"}</td>
            <td>{date(c.date_debut)}</td>
            <td>{date(c.date_fin)}</td>
            <td>{valeur(c.statut)}</td>
          </>
        );

      case "Paiements":
        return (
          <>
            <div className="dos-stats">
              <div><small>Total payé</small><strong>{argent(dossier.paiements.total_paye)}</strong></div>
              <div><small>Reste à payer</small><strong>{argent(dossier.paiements.total_restant)}</strong></div>
            </div>
            {tableau(
              ["Montant", "Échéance", "Statut"],
              dossier.paiements.liste || [],
              (p) => <>
                <td>{argent(p.montant)}</td>
                <td>{date(p.echeance)}</td>
                <td>{valeur(p.statut_effectif)}</td>
              </>
            )}
          </>
        );

      case "Documents":
        return tableau(
          ["Nom", "Type", "Date d'ajout", "Fichier"],
          dossier.documents || [],
          (d) => <>
            <td>{valeur(d.nom || d.titre)}</td>
            <td>{valeur(d.type)}</td>
            <td>{date(d.date_ajout)}</td>
            <td>
              {d.fichier ? (
                <a href={urlFichier(d.fichier)} target="_blank" rel="noreferrer">
                  Ouvrir
                </a>
              ) : "—"}
            </td>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dos-overlay" onClick={onClose}>
      <section
        className="dos-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Dossier étudiant"
      >
        <header className="dos-entete">
          <div>
            <h2>Dossier étudiant</h2>
            <p>{etudiant.prenom} {etudiant.nom}</p>
          </div>
          <button className="dash-mini-btn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>

        {chargement ? (
          <p className="dos-message">Chargement du dossier...</p>
        ) : erreur ? (
          <p className="alert alert-danger">{erreur}</p>
        ) : (
          <>
            <nav className="dos-onglets">
              {ONGLETS.map((o) => (
                <button
                  key={o}
                  className={onglet === o ? "actif" : ""}
                  onClick={() => setOnglet(o)}
                >
                  {o}
                </button>
              ))}
            </nav>
            <div className="dos-corps">
              {contenu()}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
