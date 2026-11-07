import { useState } from "react";
import { Link } from "react-router-dom";
import FullStackPanel from "../FullStack/FullStackPanel";
import CyberPanel from "../FullStack/CyberPanel";
import MetiersPanel from "../FullStack/MetiersPanel";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./Home.css";

/* ---------------------------- Petits composants ---------------------------- */

function SectionHead({ label, title, subtitle, sans = false }) {
  return (
    <div className="hm-head text-center">
      {label && <p className={`hm-label ${sans ? "hm-label-sans" : "hm-mono"}`}>{label}</p>}
      <h2>{title}</h2>
      {subtitle && <p className="hm-sub">{subtitle}</p>}
    </div>
  );
}

function Thumb({ img, title }) {
  return (
    <div className="hm-thumb">
      <img src={img} alt={title} />
      {/* TODO : brancher la lecture de la vidéo / du podcast */}
      <button type="button" className="hm-play" aria-label={`Lire : ${title}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      </button>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Home() {
  const [panneau, setPanneau] = useState(null); // "fullstack" | "cyber" | "metiers" | null
  // Textes et images : valeurs d'origine, remplacées par celles saisies dans « Contenu du site » (dashboard admin)
  const { hero, formations, valeurs, chiffres, raisons, pedagogie, rencontres, presse, appel } = useContenuPage("accueil");

  return (
    <div className="hm">
      {/* 1. Hero */}
      <header className="hm-section hm-hero">
        <div className="container-fluid px-3 px-md-4 px-xl-5">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-7">
              <h1>{hero.titre}</h1>
              <p className="hm-lead">{hero.texte}</p>
              <a href="#formations" className="btn btn-hm">{hero.bouton}</a>
            </div>
            <div className="col-12 col-md-8 col-lg-5 mx-auto">
              <img src={urlImage(hero.image)} alt={hero.image_alt} className="hm-hero-img" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Formations en alternance */}
      <section className="hm-section" id="formations">
        <div className="container">
          <SectionHead title={formations.titre} subtitle={formations.sous_titre} />
          <div className="row g-3 hm-prog-row">
            {formations.programmes.map((p, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <article className="hm-prog h-100">
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
                    <span className="hm-badge hm-mono">{p.badge}</span>
                    <span className="hm-mono hm-duration">{p.duree}</span>
                  </div>
                  <h3>{p.titre}</h3>
                  <p className="hm-text">{p.texte}</p>
                  <p className="hm-highlight">{p.mise_en_avant}</p>
                  {p.page_detail ? (
                    <a href={`#${p.page_detail}`} className="hm-more" onClick={(e) => { e.preventDefault(); setPanneau(p.page_detail); }}>
                      {formations.lien} <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link to="/formations" className="hm-more">
                      {formations.lien} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Valeurs + chiffres */}
      <section className="hm-values">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <p className="hm-label hm-mono hm-label-left">{valeurs.etiquette}</p>
              <h2 className="hm-values-title">{valeurs.titre}</h2>
              <p className="hm-text hm-text-lg mb-0">{valeurs.texte}</p>
            </div>
            <div className="col-12 col-lg-6">
              <ul className="list-unstyled d-flex flex-wrap gap-3 mb-0">
                {valeurs.valeurs.map((v, i) => (
                  <li className="hm-chip" key={i}>
                    <span className="hm-chip-dot" aria-hidden="true" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="hm-stats">
        <div className="container">
          <div className="row g-4 text-center">
            {chiffres.chiffres.map((s, i) => (
              <div className="col-6 col-lg-3 hm-stat-item" key={i}>
                <p className="hm-mono hm-stat-val">{s.valeur}</p>
                <p className="hm-stat-label">{s.libelle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quatre raisons */}
      <section className="hm-section">
        <div className="container">
          <SectionHead label={raisons.etiquette} title={raisons.titre} />
          <div className="row g-3">
            {raisons.raisons.map((r, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="hm-reason h-100">
                  <p className="hm-mono hm-num">{r.numero}</p>
                  <h3>{r.titre}</h3>
                  <p className="hm-text mb-0">{r.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pédagogie par projet */}
      <section className="hm-section">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-5">
              <div className="hm-frame">
                <img src={urlImage(pedagogie.image)} alt={pedagogie.image_alt} />
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <p className="hm-label hm-mono hm-label-left">{pedagogie.etiquette}</p>
              <h2 className="hm-values-title">{pedagogie.titre}</h2>
              <p className="hm-text hm-text-lg">{pedagogie.texte}</p>
              <div className="d-flex gap-4">
                {pedagogie.chiffres.map((s, i) => (
                  <div className="hm-mini" key={i}>
                    <p className="hm-mono hm-mini-val">{s.valeur}</p>
                    <p className="hm-mini-label">{s.libelle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Rencontres */}
      <section className="hm-section">
        <div className="container">
          <SectionHead label={rencontres.etiquette} title={rencontres.titre} sans />
          <div className="d-flex flex-column gap-5">
            {rencontres.histoires.map((s, i) => (
              <div className={`row align-items-center g-4 g-lg-5 ${i % 2 === 1 ? "flex-lg-row-reverse" : ""}`} key={i}>
                <div className="col-12 col-lg-6 hm-story-text">
                  <h3 className="hm-story-title"><span aria-hidden="true">/</span> {s.titre}</h3>
                  <p className="hm-text hm-text-lg mb-0">{s.texte}</p>
                </div>
                <div className="col-12 col-lg-6">
                  <Thumb img={urlImage(s.image)} title={s.titre} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Presse */}
      <section className="hm-section">
        <div className="container">
          <SectionHead label={presse.etiquette} title={presse.titre} />
          <div className="row g-3">
            {presse.articles.map((p, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <article className="hm-press h-100">
                  <div className="d-flex justify-content-between gap-2 mb-3">
                    <span className="hm-mono hm-press-src">{p.source}</span>
                    <span className="hm-press-date">{p.date}</span>
                  </div>
                  <h3>{p.titre}</h3>
                  <p className="hm-text mb-0">“{p.texte}”</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Appel à l'action */}
      <section className="hm-cta text-center">
        <div className="container">
          <p className="hm-label hm-mono">{appel.etiquette}</p>
          <h2>{appel.titre}</h2>
          <p className="hm-sub mx-auto">{appel.texte}</p>
          <Link to="/inscription" className="btn btn-hm-dark">{appel.bouton}</Link>
        </div>
      </section>

      {/* Pages de description des filières (se déroulent depuis le haut) */}
      <FullStackPanel ouvert={panneau === "fullstack"} onFermer={() => setPanneau(null)} />
      <CyberPanel ouvert={panneau === "cyber"} onFermer={() => setPanneau(null)} />
      <MetiersPanel ouvert={panneau === "metiers"} onFermer={() => setPanneau(null)} />
    </div>
  );
}
