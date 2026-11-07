import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import AvecEntreprise from "./AvecEntreprise";
import { dateFr } from "../../services/format";

const VIDE = { titre: "", description: "", statut: "ouverte" };

function Contenu({ entreprise }) {
  const [offres, setOffres] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [edition, setEdition] = useState(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api("/offres").then((l) => setOffres(l.filter((o) => o.entreprise?._id === entreprise._id))).catch((e) => setErreur(e.message));
    api("/candidatures").then(setCandidatures).catch(() => {});
  }, [entreprise._id]);
  useEffect(() => { charger(); }, [charger]);

  const fermer = () => { setEdition(null); setErreur(""); };
  const maj = (n) => (e) => setEdition({ ...edition, [n]: e.target.value });
  const nb = (id) => candidatures.filter((c) => c.offre?._id === id).length;

  const enregistrer = async (e) => {
    e.preventDefault();
    setErreur("");
    const body = { titre: edition.titre, description: edition.description, statut: edition.statut, entreprise: entreprise._id };
    try {
      if (edition.id) await api(`/offres/${edition.id}`, { method: "PUT", body });
      else await api("/offres", { method: "POST", body });
      fermer();
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };
  const supprimer = async (o) => {
    if (!window.confirm(`Supprimer l'offre « ${o.titre} » ?`)) return;
    try {
      await api(`/offres/${o._id}`, { method: "DELETE" });
      charger();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Offres d'alternance</h1>
          <p className="dash-sous">Publiez et gérez les offres de {entreprise.nom}.</p>
        </div>
        <button type="button" className="dash-btn principal" onClick={() => setEdition({ ...VIDE })}><Icone nom="plus" /> Nouvelle offre</button>
      </div>
      {erreur && !edition && <div className="alert alert-danger">{erreur}</div>}

      <section className="dash-carte">
        <div className="dash-table-zone">
          <table className="dash-table">
            <thead><tr><th>Offre</th><th>Publiée le</th><th>Candidatures</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {(offres || []).map((o) => (
                <tr key={o._id}>
                  <td><strong>{o.titre}</strong><small className="d-block" style={{ color: "#8c9bbd", maxWidth: 380, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.description}</small></td>
                  <td>{dateFr(o.date_publication)}</td>
                  <td>{nb(o._id)}</td>
                  <td><span className={`dash-tag ${o.statut === "ouverte" ? "vert" : "gris"}`}>{o.statut === "ouverte" ? "Ouverte" : "Fermée"}</span></td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" className="dash-mini-btn" aria-label={`Modifier ${o.titre}`} onClick={() => setEdition({ id: o._id, titre: o.titre, description: o.description, statut: o.statut })}><Icone nom="edit" taille={15} /></button>
                    <button type="button" className="dash-mini-btn" aria-label={`Supprimer ${o.titre}`} onClick={() => supprimer(o)}><Icone nom="trash" taille={15} /></button>
                  </td>
                </tr>
              ))}
              {offres && offres.length === 0 && <tr><td colSpan="5" className="dash-vide">Aucune offre publiée.</td></tr>}
              {!offres && !erreur && <tr><td colSpan="5" className="dash-vide">Chargement…</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {edition && (
        <Modale large titre={edition.id ? "Modifier l'offre" : "Nouvelle offre"} onSubmit={enregistrer} onClose={fermer} erreur={erreur}>
          <Champ id="oe-titre" label="Titre"><input id="oe-titre" className="form-control" required placeholder="Ex : Alternant développeur web" value={edition.titre} onChange={maj("titre")} /></Champ>
          <Champ id="oe-statut" label="Statut"><select id="oe-statut" className="form-select" value={edition.statut} onChange={maj("statut")}><option value="ouverte">Ouverte</option><option value="fermee">Fermée</option></select></Champ>
          <Champ id="oe-desc" label="Description" className="mb-4"><textarea id="oe-desc" rows="6" className="form-control" required placeholder="Missions, profil recherché, durée, lieu…" value={edition.description} onChange={maj("description")} /></Champ>
        </Modale>
      )}
    </>
  );
}

export default function OffresEntreprise() {
  return <AvecEntreprise>{(entreprise) => <Contenu entreprise={entreprise} />}</AvecEntreprise>;
}
