import { useState } from "react";
import useEntreprise from "../../services/useEntreprise";

function ChoixEntreprise({ liste, onChoisir, erreur }) {
  const [valeur, setValeur] = useState("");
  return (
    <>
      <h1 className="dash-titre">Bienvenue</h1>
      <p className="dash-sous">Sélectionnez votre entreprise pour accéder à vos offres et à vos candidatures.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      <section className="dash-carte" style={{ maxWidth: 520 }}>
        <form onSubmit={(e) => { e.preventDefault(); onChoisir(valeur); }}>
          <label htmlFor="ch-ent">Votre entreprise</label>
          <select id="ch-ent" className="form-select mb-3" required value={valeur} onChange={(e) => setValeur(e.target.value)}>
            <option value="" disabled>Choisissez votre entreprise</option>
            {liste.map((e) => <option key={e._id} value={e._id}>{e.nom}</option>)}
          </select>
          {liste.length === 0 && <p className="dash-sous">Aucune entreprise n'est enregistrée : contactez l'administration.</p>}
          <button className="dash-btn principal" disabled={!valeur}>Continuer</button>
        </form>
      </section>
    </>
  );
}

// Affiche son contenu quand l'entreprise est choisie : <AvecEntreprise>{(entreprise, choisir) => …}</AvecEntreprise>
export default function AvecEntreprise({ children }) {
  const e = useEntreprise();
  if (!e.pret) return <p className="dash-sous">Chargement…</p>;
  if (!e.entreprise) return <ChoixEntreprise liste={e.liste} onChoisir={e.choisir} erreur={e.erreur} />;
  return children(e.entreprise, e.choisir);
}
