import { useState } from "react";
import { Link } from "react-router-dom";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./Documentation.css";

/* Textes, images et fichiers : valeurs d'origine (services/contenusMenus.js), remplacées par celles
   saisies dans « Contenu du site » (dashboard admin). */

/* ---------------------------- Petits composants ---------------------------- */

function Chevron() {
  return (
    <svg className="doc-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g className="doc-arrow">
        <path d="M12 3v12" />
        <path d="m8 11 4 4 4-4" />
      </g>
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

function Heading({ title, subtitle }) {
  return (
    <div className="doc-heading">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Documentation() {
  const { hero, brochures, faq, actualite, ressources, appel } = useContenuPage("documentation");

  // Toutes les questions sont ouvertes au départ (comme sur la maquette) : on retient seulement celles que le visiteur ferme
  const [fermees, setFermees] = useState(() => new Set());

  const toggle = (i) =>
    setFermees((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const lienExterne = /^https?:/i.test(actualite.lien || "");

  return (
    <div className="doc">
      {/* 1. Hero */}
      <header className="doc-section doc-hero">
        <div className="container">
          <h1>{hero.titre}</h1>
          <p className="doc-lead">{hero.texte}</p>
        </div>
      </header>

      {/* 2. Brochures & guides */}
      <section className="doc-section">
        <div className="container">
          <Heading title={brochures.titre} />
          <div className="row g-3">
            {brochures.documents.map((b, i) => (
              <div className="col-12 col-md-6" key={i}>
                <a href={urlImage(b.fichier)} download className="doc-card h-100">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <span className="doc-icon"><DownloadIcon /></span>
                    <span className="doc-mono doc-size">{b.taille}</span>
                  </div>
                  <h3>{b.titre}</h3>
                  <p className="doc-text mb-0">{b.texte}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FAQ */}
      <section className="doc-section doc-dark">
        <div className="container">
          <Heading title={faq.titre} subtitle={faq.sous_titre} />
          <div className="d-flex flex-column gap-3">
            {faq.questions.map((f, i) => {
              const isOpen = !fermees.has(i);
              return (
                <article className={`doc-faq ${isOpen ? "is-open" : ""}`} key={i}>
                  <h3>
                    <button
                      type="button"
                      className="doc-faq-q"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span>{f.question}</span>
                      <Chevron />
                    </button>
                  </h3>
                  <div className="doc-faq-a" id={`faq-${i}`} role="region">
                    <div>
                      <p>{f.reponse}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Actualités */}
      <section className="doc-section">
        <div className="container">
          <Heading title={actualite.titre} />
          <article className="doc-news">
            <div className="doc-news-img">
              <img src={urlImage(actualite.image)} alt={actualite.image_alt || ""} />
              <span className="doc-news-more" aria-hidden="true">Lire la suite →</span>
            </div>
            <div className="doc-news-body">
              <p className="doc-mono doc-tag">{actualite.etiquette}</p>
              <h3>
                {lienExterne ? (
                  <a href={actualite.lien} className="stretched-link" target="_blank" rel="noopener noreferrer">{actualite.titre_article}</a>
                ) : (
                  <Link to={actualite.lien || "/"} className="stretched-link">{actualite.titre_article}</Link>
                )}
              </h3>
              <p className="doc-text mb-0">{actualite.texte}</p>
            </div>
          </article>
        </div>
      </section>

      {/* 5. Ressources pédagogiques */}
      <section className="doc-section doc-dark">
        <div className="container">
          <Heading title={ressources.titre} subtitle={ressources.sous_titre} />
          <div className="row g-3">
            {ressources.liens.map((r, i) => (
              <div className={ressources.liens.length === 1 ? "col-12" : "col-12 col-md-6"} key={i}>
                <article className="doc-res h-100">
                  <h3>{r.titre}</h3>
                  <p className="doc-text">{r.texte}</p>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="doc-res-link stretched-link">
                    Se connecter <span aria-hidden="true">→</span>
                  </a>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Appel à l'action */}
      <section className="doc-section doc-cta text-center">
        <div className="container">
          <p className="doc-mono doc-label">{appel.etiquette}</p>
          <h2>{appel.titre}</h2>
          <p className="doc-lead mx-auto">{appel.texte}</p>
          <a href={appel.lien} className="btn btn-doc">{appel.bouton}</a>
        </div>
      </section>
    </div>
  );
}