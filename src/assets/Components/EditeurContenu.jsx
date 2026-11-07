import { useState } from "react";
import { api } from "../../services/api";
import { urlImage } from "../../services/useContenu";

const LIBELLES = {
  titre: "Titre", titre_page: "Titre de la page", sous_titre: "Sous-titre", texte: "Texte", intro: "Introduction", paragraphe: "Paragraphe",
  bouton: "Texte du bouton", lien: "Texte du lien", etiquette: "Étiquette (petit texte au-dessus du titre)", image: "Image", image_alt: "Description de l'image",
  badge: "Niveau", duree: "Durée", mise_en_avant: "Point fort", page_detail: "Page de détail (fullstack, cyber ou metiers ; vide = page Formations)",
  valeur: "Valeur", libelle: "Libellé", numero: "Numéro", source: "Source", date: "Date", points: "Points", cartes: "Cartes", boites: "Encadrés",
  atouts: "Atouts", atouts_titre: "Titre des atouts", valeurs: "Valeurs", chiffres: "Chiffres", raisons: "Raisons", histoires: "Histoires", articles: "Articles",
  programmes: "Formations", objets: "Objets proposés dans la liste", liens: "Liens", nom: "Nom", sigle: "Sigle", url: "Adresse (URL)",
  adresse_titre: "Titre de l'adresse", adresse: "Adresse", contact_titre: "Titre du contact", telephone: "Téléphone", email: "E-mail",
  horaires_titre: "Titre des horaires", horaires: "Horaires", competences_titre: "Titre des compétences", competences: "Compétences",
  avantages_titre: "Titre des avantages", avantages: "Avantages", domaines_titre: "Titre des domaines", domaines: "Domaines",
};
const humaniser = (cle) => LIBELLES[cle] || (cle.charAt(0).toUpperCase() + cle.slice(1).replace(/_/g, " "));
const estImage = (cle) => /^(image|img|logo|photo)$/.test(cle);
const vider = (v) => (Array.isArray(v) ? [] : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, vider(x)])) : typeof v === "number" ? 0 : typeof v === "boolean" ? false : "");

function ChampImage({ id, valeur, onChange }) {
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  // Le fichier est envoyé comme document public ; son chemin (/uploads/…) est repris dans le champ
  const televerser = async (e) => {
    const fichier = e.target.files[0];
    if (!fichier) return;
    setEnvoi(true);
    setErreur("");
    const fd = new FormData();
    fd.append("titre", `Image du site — ${fichier.name}`);
    fd.append("type", "Image");
    fd.append("categorie", "Contenu du site");
    fd.append("visibilite", "public");
    fd.append("fichier", fichier);
    try {
      const doc = await api("/documents", { method: "POST", body: fd });
      onChange(doc.fichier);
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      {valeur && <img src={urlImage(valeur)} alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} onLoad={(e) => { e.currentTarget.style.display = "block"; }}
        style={{ maxHeight: 90, maxWidth: "100%", borderRadius: 8, marginBottom: 8, display: "block" }} />}
      <input id={id} className="form-control mb-2" placeholder="/chemin/vers/image.jpg" value={valeur || ""} onChange={(e) => onChange(e.target.value)} />
      <label className="dash-btn petit" style={{ cursor: envoi ? "wait" : "pointer", marginBottom: 0 }}>
        {envoi ? "Envoi…" : "Téléverser une image"}
        <input type="file" accept=".jpg,.jpeg,.png,.webp" hidden disabled={envoi} onChange={televerser} />
      </label>
      <small style={{ color: "#8c9bbd", marginLeft: 10 }}>JPG, PNG ou WEBP — 5 Mo maximum</small>
      {erreur && <div className="alert alert-danger mt-2 mb-0">{erreur}</div>}
    </div>
  );
}

function Boutons({ i, total, deplacer, retirer }) {
  return (
    <span className="d-flex gap-1">
      <button type="button" className="dash-mini-btn" disabled={i === 0} aria-label="Monter" onClick={() => deplacer(i, -1)}>↑</button>
      <button type="button" className="dash-mini-btn" disabled={i === total - 1} aria-label="Descendre" onClick={() => deplacer(i, 1)}>↓</button>
      <button type="button" className="dash-mini-btn" aria-label="Retirer" onClick={() => retirer(i)}>✕</button>
    </span>
  );
}

function Liste({ cle, valeur, onChange, id }) {
  const deplacer = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= valeur.length) return;
    const copie = [...valeur];
    [copie[i], copie[j]] = [copie[j], copie[i]];
    onChange(copie);
  };
  const retirer = (i) => onChange(valeur.filter((_, j) => j !== i));
  const ajouter = () => onChange([...valeur, valeur.length ? vider(valeur[valeur.length - 1]) : ""]);
  const modifier = (i, v) => onChange(valeur.map((x, j) => (j === i ? v : x)));

  return (
    <div className="mb-3">
      <label style={{ fontWeight: 600 }}>{humaniser(cle)} <small style={{ color: "#8c9bbd" }}>({valeur.length})</small></label>
      {valeur.map((el, i) => (
        el && typeof el === "object" && !Array.isArray(el) ? (
          <div className="dash-element" key={i}>
            <div className="dash-element-tete"><strong>{i + 1}</strong><Boutons i={i} total={valeur.length} deplacer={deplacer} retirer={retirer} /></div>
            {Object.keys(el).map((k) => <Noeud key={k} cle={k} id={`${id}-${i}-${k}`} valeur={el[k]} onChange={(v) => modifier(i, { ...el, [k]: v })} />)}
          </div>
        ) : (
          <div className="dash-element-simple" key={i}>
            <input className="form-control" aria-label={`${humaniser(cle)} ${i + 1}`} value={el ?? ""} onChange={(e) => modifier(i, e.target.value)} />
            <Boutons i={i} total={valeur.length} deplacer={deplacer} retirer={retirer} />
          </div>
        )
      ))}
      <button type="button" className="dash-btn petit" onClick={ajouter}>+ Ajouter</button>
    </div>
  );
}

function Noeud({ cle, valeur, onChange, id }) {
  if (Array.isArray(valeur)) return <Liste cle={cle} valeur={valeur} onChange={onChange} id={id} />;

  if (valeur && typeof valeur === "object") {
    return (
      <fieldset className="dash-groupe">
        <legend>{humaniser(cle)}</legend>
        {Object.keys(valeur).map((k) => <Noeud key={k} cle={k} id={`${id}-${k}`} valeur={valeur[k]} onChange={(v) => onChange({ ...valeur, [k]: v })} />)}
      </fieldset>
    );
  }

  if (typeof valeur === "boolean") {
    return (
      <div className="form-check mb-3">
        <input id={id} type="checkbox" className="form-check-input" checked={valeur} onChange={(e) => onChange(e.target.checked)} />
        <label htmlFor={id} className="form-check-label">{humaniser(cle)}</label>
      </div>
    );
  }

  if (typeof valeur === "number") {
    return (
      <div className="mb-3"><label htmlFor={id}>{humaniser(cle)}</label>
        <input id={id} type="number" className="form-control" value={valeur} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} /></div>
    );
  }

  const texte = valeur ?? "";
  return (
    <div className="mb-3">
      <label htmlFor={id}>{humaniser(cle)}</label>
      {estImage(cle) ? <ChampImage id={id} valeur={texte} onChange={onChange} />
        : texte.length > 80 || texte.includes("\n")
          ? <textarea id={id} className="form-control" rows={Math.min(8, Math.max(3, Math.ceil(texte.length / 80)))} value={texte} onChange={(e) => onChange(e.target.value)} />
          : <input id={id} className="form-control" value={texte} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

// Formulaire généré à partir de la structure du contenu (objet JSON)
export default function EditeurContenu({ valeur, onChange }) {
  return (
    <div>
      {Object.keys(valeur).map((k) => <Noeud key={k} cle={k} id={`champ-${k}`} valeur={valeur[k]} onChange={(v) => onChange({ ...valeur, [k]: v })} />)}
      {Object.keys(valeur).length === 0 && <p className="dash-vide">Cette section est vide. Utilisez l'onglet « JSON » pour définir sa structure.</p>}
    </div>
  );
}
