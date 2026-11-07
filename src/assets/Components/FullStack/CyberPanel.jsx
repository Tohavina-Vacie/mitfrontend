import { useState } from "react";
import PanneauDeroulant, { anim } from "./PanneauDeroulant";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./CyberPanel.css";

// <CyberPanel ouvert={ouvert} onFermer={() => setOuvert(false)} />
// Textes et image : modifiables dans le dashboard admin (« Contenu du site »)
export default function CyberPanel({ ouvert, onFermer }) {
  const { contenu: c } = useContenuPage("cybersecurite");
  const [imageOk, setImageOk] = useState(true);
  const avecImage = imageOk && !!c.image;

  return (
    <PanneauDeroulant ouvert={ouvert} onFermer={onFermer} titre={c.titre_page} theme="cyber">
      <h2 {...anim(0, "cy-titre")}>{c.titre}</h2>

      <div {...anim(1, `cy-intro${avecImage ? "" : " sans-image"}`)}>
        {avecImage && <img src={urlImage(c.image)} alt={c.image_alt} onError={() => setImageOk(false)} />}
        <p>{c.texte}</p>
      </div>

      <div className="cy-boites">
        {c.boites.map((b, i) => (
          <section key={i} {...anim(2 + i, "cy-boite")}>
            <h2>{b.titre}</h2>
            <ul>{b.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
          </section>
        ))}
      </div>
    </PanneauDeroulant>
  );
}
