import { useContenuPage } from "../../../services/useContenu";
import "./Formations.css";

/* Textes : valeurs d'origine (services/contenusMenus.js), remplacées par celles
   saisies dans « Contenu du site » (dashboard admin). */

/* ---------------------------- Petits composants ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="fmt-heading">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function FormationCard({ f }) {
  return (
    <article className="fmt-card">
      <div className="d-flex justify-content-between align-items-center gap-3 mb-3">
        <span className="fmt-badge fmt-mono">{f.duree}</span>
        <span className="fmt-mono fmt-access">{f.acces}</span>
      </div>

      <h3>{f.titre}</h3>
      {f.prerequis && <p className="fmt-muted">{f.prerequis}</p>}

      <p className="fmt-mono fmt-label">{f.etiquette}</p>
      <ul className="fmt-chips list-unstyled mb-0">
        {(f.modules || []).map((m, i) => (
          <li key={i} className="fmt-chip" style={{ "--c": i }}>{m}</li>
        ))}
      </ul>
    </article>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Formations() {
  const { hero, bachelors, masters, debouches, calendrier } = useContenuPage("formations");

  return (
    <div className="fmt">
      {/* 1. Hero */}
      <header className="fmt-section fmt-hero">
        <div className="container">
          <h1>{hero.titre}</h1>
          <p className="fmt-lead">{hero.texte}</p>
        </div>
      </header>

      {/* 2. Bachelors */}
      <section className="fmt-section">
        <div className="container">
          <SectionHeading title={bachelors.titre} subtitle={bachelors.sous_titre} />
          <div className="d-flex flex-column gap-3">
            {bachelors.formations.map((f, i) => (
              <FormationCard key={i} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Masters */}
      <section className="fmt-section">
        <div className="container">
          <SectionHeading title={masters.titre} subtitle={masters.sous_titre} />
          <div className="d-flex flex-column gap-3">
            {masters.formations.map((f, i) => (
              <FormationCard key={i} f={f} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Débouchés */}
      <section className="fmt-section fmt-dark">
        <div className="container">
          <SectionHeading title={debouches.titre} subtitle={debouches.sous_titre} />
          <div className="row g-3">
            {debouches.metiers.map((c, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <article className="fmt-job h-100">
                  <h3>{c.metier}</h3>
                  <p className="fmt-mono fmt-salary mb-0">
                    <span className="fmt-dot" aria-hidden="true" />
                    {c.salaire}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Calendrier d'admission */}
      <section className="fmt-section">
        <div className="container">
          <SectionHeading title={calendrier.titre} subtitle={calendrier.sous_titre} />
          <div className="row g-3">
            {calendrier.etapes.map((s, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="fmt-step h-100">
                  <div className="d-flex justify-content-between gap-2 mb-3 fmt-mono fmt-step-top">
                    <span className="fmt-step-num">Étape {s.numero}</span>
                    <span className="fmt-muted">{s.periode}</span>
                  </div>
                  <h3>{s.titre}</h3>
                  <p className="mb-0">{s.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}