import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import CarteStat from "../../assets/Components/CarteStat";
import AvecEntreprise from "./AvecEntreprise";
import { dateFr, nomPersonne } from "../../services/format";

const STATUTS = { en_attente: ["orange", "En attente"], acceptee: ["vert", "Acceptée"], refusee: ["rouge", "Refusée"] };

function Contenu({ entreprise }) {
  const { user } = useAuth();
  const [offres, setOffres] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/offres").then((l) => setOffres(l.filter((o) => o.entreprise?._id === entreprise._id))).catch((e) => setErreur(e.message));
    api("/candidatures").then(setCandidatures).catch((e) => setErreur(e.message));
  }, [entreprise._id]);

  const ids = new Set((offres || []).map((o) => o._id));
  const miennes = candidatures.filter((c) => ids.has(c.offre?._id));
  const parStatut = (s) => miennes.filter((c) => c.statut === s).length;

  return (
    <>
      <h1 className="dash-titre">Bonjour, {user.prenom} !</h1>
      <p className="dash-sous">Espace de {entreprise.nom} : suivez vos offres d'alternance et les candidatures reçues.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-stats">
        <CarteStat titre="Offres ouvertes" valeur={offres ? offres.filter((o) => o.statut === "ouverte").length : "…"} sous={`${offres ? offres.length : 0} offre(s) au total`} />
        <CarteStat titre="Candidatures reçues" valeur={miennes.length} sous="Sur vos offres" />
        <CarteStat titre="À traiter" valeur={parStatut("en_attente")} sous="En attente de réponse" />
        <CarteStat titre="Acceptées" valeur={parStatut("acceptee")} sous="Candidatures retenues" />
      </div>

      <div className="dash-colonnes">
        <section className="dash-carte">
          <h2>Dernières candidatures <Link to="/entreprise/candidatures">Tout voir</Link></h2>
          {miennes.length === 0 && <p className="dash-vide">Aucune candidature reçue pour le moment.</p>}
          {[...miennes].sort((a, b) => new Date(b.date_candidature) - new Date(a.date_candidature)).slice(0, 6).map((c) => {
            const [couleur, libelle] = STATUTS[c.statut] || ["gris", c.statut];
            return (
              <div className="dash-ligne" key={c._id}>
                <div><strong>{nomPersonne(c.utilisateur) || "Candidat"}</strong><small>{c.offre?.titre} · {dateFr(c.date_candidature)}</small></div>
                <span className={`dash-tag ${couleur}`}>{libelle}</span>
              </div>
            );
          })}
        </section>

        <section className="dash-carte">
          <h2>Mes offres <Link to="/entreprise/offres">Gérer</Link></h2>
          {offres && offres.length === 0 && <p className="dash-vide">Vous n'avez publié aucune offre.</p>}
          {(offres || []).slice(0, 6).map((o) => (
            <div className="dash-ligne" key={o._id}>
              <div><strong>{o.titre}</strong><small>Publiée le {dateFr(o.date_publication)}</small></div>
              <span className={`dash-tag ${o.statut === "ouverte" ? "vert" : "gris"}`}>{o.statut === "ouverte" ? "Ouverte" : "Fermée"}</span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export default function AccueilEntreprise() {
  return <AvecEntreprise>{(entreprise) => <Contenu entreprise={entreprise} />}</AvecEntreprise>;
}
