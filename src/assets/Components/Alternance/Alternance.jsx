import { Link } from "react-router-dom";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./Alternance.css";

/* Textes et images : valeurs d'origine (services/contenusMenus.js), remplacées par celles
   saisies dans « Contenu du site » (dashboard admin). */

const initials = (name) =>
  (name || "").replace(".", "").split(" ").map((w) => w[0]).slice(0, 2).join("");

// Un jour dont le lieu commence par « École » est mis en avant
const estEcole = (lieu) => /^[ée]cole/i.test((lieu || "").trim());

/* ---------------------------- Petit composant ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="alt-heading text-center">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Alternance() {
  const { hero, etapes, rythme, avantages, temoignages, appel } = useContenuPage("alternance");

  return (
    <div className="alt">
      {/* 1. Hero */}
      <header className="alt-section alt-hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <h1>{hero.titre}</h1>
              <p className="alt-lead">{hero.texte}</p>
              <a href="#processus" className="btn btn-alt">{hero.bouton}</a>
            </div>
            <div className="col-12 col-lg-6">
              <img src={urlImage(hero.image)} alt={hero.image_alt} className="alt-hero-img" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Comment ça marche */}
      <section className="alt-section" id="processus">
        <div className="container">
          <SectionHeading title={etapes.titre} subtitle={etapes.sous_titre} />
          <div className="row g-3">
            {etapes.etapes.map((s, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="alt-step h-100">
                  <p className="alt-num">{s.numero}</p>
                  <h3>{s.titre}</h3>
                  <p className="alt-text mb-0">{s.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Rythme */}
      <section className="alt-section">
        <div className="container">
          <SectionHeading title={rythme.titre} subtitle={rythme.sous_titre} />
          <div className="alt-week">
            <div className="alt-days">
              {rythme.jours.map((d, i) => (
                <article className={`alt-day ${estEcole(d.lieu) ? "is-school" : ""}`} key={i}>
                  <h3>{d.jour}</h3>
                  <p className="alt-mono alt-place">{d.lieu}</p>
                  <p className="alt-desc mb-0">{d.texte}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Avantages */}
      <section className="alt-section">
        <div className="container">
          <SectionHeading title={avantages.titre} subtitle={avantages.sous_titre} />
          <div className="row g-3">
            {avantages.avantages.map((p, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="alt-perk h-100">
                  <p className="alt-mono alt-stat">{p.valeur}</p>
                  <h3>{p.titre}</h3>
                  <p className="alt-text mb-0">{p.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Témoignages */}
      <section className="alt-section">
        <div className="container">
          <SectionHeading title={temoignages.titre} subtitle={temoignages.sous_titre} />
          <div className="row g-3">
            {temoignages.temoignages.map((t, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <figure className="alt-quote h-100">
                  <blockquote>“{t.citation}”</blockquote>
                  <figcaption className="d-flex align-items-center gap-3">
                    <span className="alt-avatar" aria-hidden="true">{initials(t.nom)}</span>
                    <span>
                      <strong>{t.nom}</strong>
                      <span className="alt-mono alt-promo">{t.promo}</span>
                    </span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Appel à l'action */}
      <section className="alt-section alt-cta text-center">
        <div className="container">
          <p className="alt-mono alt-label">{appel.etiquette}</p>
          <h2>{appel.titre}</h2>
          <p className="alt-lead mx-auto">{appel.texte}</p>
          <Link to="/inscription" className="btn btn-alt">{appel.bouton}</Link>
        </div>
      </section>
    </div>
  );
}