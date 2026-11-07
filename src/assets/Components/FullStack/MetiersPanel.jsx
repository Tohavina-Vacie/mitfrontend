import { useState } from "react";
import PanneauDeroulant, { anim } from "./PanneauDeroulant";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./MetiersPanel.css";

// <MetiersPanel ouvert={ouvert} onFermer={() => setOuvert(false)} />
// Textes et image : modifiables dans le dashboard admin (« Contenu du site »)
export default function MetiersPanel({ ouvert, onFermer }) {
  const { contenu: c } = useContenuPage("metiers-informatique");
  const [imageOk, setImageOk] = useState(true);
  const avecImage = imageOk && !!c.image;

  return (
    <PanneauDeroulant ouvert={ouvert} onFermer={onFermer} titre={c.titre_page} theme="metiers">
      <h2 {...anim(0, "mt-titre")}>{c.titre}</h2>

      <div {...anim(1, `mt-intro${avecImage ? "" : " sans-image"}`)}>
        {avecImage && <img src={urlImage(c.image)} alt={c.image_alt} onError={() => setImageOk(false)} />}
        <p>{c.texte}</p>
      </div>

      <div className="mt-listes">
        <section {...anim(2, "mt-liste")}>
          <h2>{c.competences_titre}</h2>
          <ul>{c.competences.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
        <section {...anim(3, "mt-liste")}>
          <h2>{c.avantages_titre}</h2>
          <ul>{c.avantages.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </section>
      </div>

      <section {...anim(4, "mt-liste mt-domaines")}>
        <h2>{c.domaines_titre}</h2>
        <ul>{c.domaines.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </section>
    </PanneauDeroulant>
  );
}
