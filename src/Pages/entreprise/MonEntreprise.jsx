import { urlFichier } from "../../services/api";
import AvecEntreprise from "./AvecEntreprise";

const initiales = (nom = "") => nom.split(" ").filter(Boolean).slice(0, 2).map((m) => m[0].toUpperCase()).join("");

function Contenu({ entreprise, choisir }) {
  return (
    <>
      <h1 className="dash-titre">Mon entreprise</h1>
      <p className="dash-sous">Fiche de votre entreprise telle qu'elle apparaît sur le site.</p>
      <div className="dash-profil">
        <section className="dash-carte dash-profil-carte">
          {entreprise.logo
            ? <img src={urlFichier(entreprise.logo)} alt={`Logo ${entreprise.nom}`} style={{ maxWidth: "100%", maxHeight: 120, objectFit: "contain", background: "#fff", borderRadius: 12, padding: 10, marginBottom: 14 }} />
            : <div className="dash-avatar">{initiales(entreprise.nom)}</div>}
          <h2 style={{ justifyContent: "center", marginBottom: 8 }}>{entreprise.nom}</h2>
          <span className="dash-pastille">{entreprise.secteur_activite}</span>
        </section>
        <section className="dash-carte">
          <h2>Informations</h2>
          <dl className="dash-infos mb-3">
            <div><dt>Nom</dt><dd>{entreprise.nom}</dd></div>
            <div><dt>Secteur d'activité</dt><dd>{entreprise.secteur_activite}</dd></div>
            <div className="large"><dt>Adresse</dt><dd>{entreprise.adresse}</dd></div>
          </dl>
          <p className="dash-sous mb-3" style={{ fontSize: ".85rem" }}>Pour modifier ces informations ou le logo, contactez l'administration.</p>
          <button type="button" className="dash-btn" onClick={() => choisir("")}>Ce n'est pas mon entreprise</button>
        </section>
      </div>
    </>
  );
}

export default function MonEntreprise() {
  return <AvecEntreprise>{(entreprise, choisir) => <Contenu entreprise={entreprise} choisir={choisir} />}</AvecEntreprise>;
}
