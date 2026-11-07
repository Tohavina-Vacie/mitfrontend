import { useState } from "react";
import PanneauDeroulant, { anim } from "./PanneauDeroulant";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./FullStackPanel.css";

// <FullStackPanel ouvert={ouvert} onFermer={() => setOuvert(false)} />
// Textes et image : modifiables dans le dashboard admin (« Contenu du site »)
export default function FullStackPanel({ ouvert, onFermer }) {
  const { contenu: c } = useContenuPage("fullstack");
  const [imageOk, setImageOk] = useState(true);

  return (
    <PanneauDeroulant ouvert={ouvert} onFermer={onFermer} titre={c.titre_page} theme="fullstack">
      <h2 {...anim(0, "fs-titre-section")}>{c.titre}</h2>

      <div {...anim(1, "fs-intro")}>
        {imageOk && c.image && <img src={urlImage(c.image)} alt={c.image_alt} onError={() => setImageOk(false)} />}
        <div className="fs-texte">
          <p style={{ whiteSpace: "pre-line" }}>{c.intro}</p>
          <p>{c.paragraphe}</p>
        </div>
      </div>

      <div className="fs-cartes">
        {c.cartes.map((carte, i) => (
          <section key={i} {...anim(2 + i, "fs-carte")}>
            <h3>{carte.titre}</h3>
            <p>{carte.texte}</p>
            <ul>{carte.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
          </section>
        ))}
      </div>

      <h2 {...anim(5, "fs-titre-section")}>{c.atouts_titre}</h2>
      <ul {...anim(6, "fs-atouts")}>{c.atouts.map((a, i) => <li key={i}>{a}</li>)}</ul>
    </PanneauDeroulant>
  );
}
