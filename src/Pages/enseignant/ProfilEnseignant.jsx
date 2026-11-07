import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { urlFichier } from "../../services/api";
import { dateFr } from "../../services/format";

const CONTRATS = { temps_plein: "Temps plein", vacataire: "Vacataire" };

export default function ProfilEnseignant() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="dash-titre">Mon profil</h1>
      <p className="dash-sous">Consultez vos informations personnelles et professionnelles.</p>

      <div className="dash-profil">
        <section className="dash-carte dash-profil-carte">
          {user.photo ? <img className="dash-avatar" src={urlFichier(user.photo)} alt="Photo de profil" /> : <div className="dash-avatar">{user.prenom?.[0]}{user.nom?.[0]}</div>}
          <h2 style={{ justifyContent: "center", marginBottom: 4 }}>{user.prenom} {user.nom}</h2>
          <p style={{ color: "#8c9bbd", fontSize: ".9rem" }}>{user.email}</p>
          {user.type_contrat && <span className="dash-pastille">{CONTRATS[user.type_contrat] || user.type_contrat}</span>}
        </section>

        <section className="dash-carte">
          <h2>Informations professionnelles &amp; personnelles</h2>
          <dl className="dash-infos mb-0">
            <div><dt>Spécialité</dt><dd>{user.specialite || "Non renseignée"}</dd></div>
            <div><dt>Type de contrat</dt><dd>{CONTRATS[user.type_contrat] || "Non renseigné"}</dd></div>
            <div><dt>Date de naissance</dt><dd>{dateFr(user.date_naissance)}</dd></div>
            <div><dt>Téléphone</dt><dd>{user.telephone || "—"}</dd></div>
            <div className="large"><dt>Adresse</dt><dd>{user.adresse || "—"}</dd></div>
          </dl>
        </section>
      </div>

      <div className="text-end mt-3"><Link to="/enseignant/parametres" className="btn btn-orange">Modifier mon profil</Link></div>
    </>
  );
}
