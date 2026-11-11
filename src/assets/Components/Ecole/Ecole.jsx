import { useState } from "react";
import { Link } from "react-router-dom";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./Ecole.css";

/* Textes et images : valeurs d'origine (services/contenusMenus.js), remplacées par celles
   saisies dans « Contenu du site » (dashboard admin). */

/* ---------------------------- Petits composants ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="ecole-heading text-center">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

// Affiche la photo, ou les initiales si l'image est absente ou introuvable
function Avatar({ name, photo }) {
  const [failed, setFailed] = useState(false);
  const initials = (name || "")
    .replace(/^(M\.|Mme|Dr\.)\s+/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return failed || !photo ? (
    <span className="ecole-avatar ecole-avatar-fallback" aria-hidden="true">{initials}</span>
  ) : (
    <img src={photo} alt={name} className="ecole-avatar" onError={() => setFailed(true)} />
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Ecole() {
  const { hero, histoire, campus, equipe, partenaires, valeurs, appel } = useContenuPage("ecole");

  return (
    <div className="ecole">
      {/* 1. Hero */}
      <header className="ecole-section ecole-hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <h1>{hero.titre}</h1>
              <p className="ecole-lead">{hero.texte}</p>
              <Link to="/inscription" className="btn btn-ecole">{hero.bouton}</Link>
            </div>
            <div className="col-12 col-lg-6">
              <img src={urlImage(hero.image)} alt={hero.image_alt} className="ecole-img" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Histoire & jalons */}
      <section className="ecole-section">
        <div className="container">
          <SectionHeading title={histoire.titre} subtitle={histoire.sous_titre} />
          <div className="row g-3">
            {histoire.jalons.map((m, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="ecole-card h-100">
                  <p className="ecole-year">{m.annee}</p>
                  <h3>{m.titre}</h3>
                  <p>{m.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Campus */}
      <section className="ecole-section">
        <div className="container">
          <SectionHeading title={campus.titre} subtitle={campus.sous_titre} />
          <div className="row g-4">
            {campus.lieux.map((c, i) => (
              <div className="col-12 col-md-6" key={i}>
                <img src={urlImage(c.image)} alt={c.titre} className="ecole-img ecole-img-campus" />
                <h3 className="ecole-campus-title">{c.titre}</h3>
                <p className="ecole-muted">{c.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Équipe */}
      <section className="ecole-section">
        <div className="container">
          <SectionHeading title={equipe.titre} subtitle={equipe.sous_titre} />
          <div className="row g-3">
            {equipe.membres.map((p, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <article className="ecole-card ecole-team-card h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Avatar name={p.nom} photo={urlImage(p.image)} />
                    <div>
                      <h3 className="mb-1">{p.nom}</h3>
                      <p className="ecole-mono ecole-role mb-0">{p.role}</p>
                    </div>
                  </div>
                  <p className="mb-0">{p.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Partenaires + valeurs */}
      <section className="ecole-section ecole-partners">
        <div className="container text-center">
          <p className="ecole-mono ecole-label">{partenaires.etiquette}</p>
          <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 gap-md-5 mb-0">
            {partenaires.noms.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ecole-section">
        <div className="container">
          <SectionHeading title={valeurs.titre} subtitle={valeurs.sous_titre} />
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-3">
            {valeurs.valeurs.map((v, i) => (
              <div className="col" key={i}>
                <article className="ecole-card ecole-value h-100">
                  <span className="ecole-dot" aria-hidden="true" />
                  <div>
                    <h3>{v.titre}</h3>
                    <p className="mb-0">{v.texte}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Appel à l'action */}
      <section className="ecole-section ecole-cta text-center">
        <div className="container">
          <p className="ecole-mono ecole-label">{appel.etiquette}</p>
          <h2>{appel.titre}</h2>
          <p className="ecole-lead mx-auto">{appel.texte}</p>
          <Link to="/inscription" className="btn btn-ecole">{appel.bouton}</Link>
        </div>
      </section>
    </div>
  );
}