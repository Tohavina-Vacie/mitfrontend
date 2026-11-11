import { useState } from "react";
import { urlImage, useContenuPage } from "../../../services/useContenu";
import "./Entreprises.css";

/* Textes et images : valeurs d'origine (services/contenusMenus.js), remplacées par celles
   saisies dans « Contenu du site » (dashboard admin). Les libellés des champs du formulaire
   restent dans le code, car ils sont liés à la validation. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------------------- Petit composant ---------------------------- */

function SectionHeading({ title, subtitle }) {
  return (
    <div className="ent-heading text-center">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

/* --------------------------------- Page --------------------------------- */

export default function Entreprises() {
  const { hero, raisons, profils, processus, chiffres, formulaire } = useContenuPage("entreprises");

  const [form, setForm] = useState({ company: "", contact: "", email: "", need: "" });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
    setSent(false);
  };

  const validate = () => {
    const er = {};
    if (!form.company.trim()) er.company = "Indiquez le nom de l’entreprise.";
    if (!form.contact.trim()) er.contact = "Indiquez le nom du contact.";
    if (!EMAIL_RE.test(form.email)) er.email = "Entrez une adresse e-mail valide.";
    if (form.need.trim().length < 10) er.need = "Décrivez votre besoin en quelques mots.";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setSending(true);
    try {
      // TODO : envoyer la demande à votre backend, par exemple :
      // await apiFetch("/api/messages", { method: "POST", body: form });
      // (adaptez les noms de champs à votre modèle Mongoose)
      console.log("Demande de recrutement :", form);
      setSent(true);
      setForm({ company: "", contact: "", email: "", need: "" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ent">
      {/* 1. Hero */}
      <header className="ent-section ent-hero">
        <div className="container">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-12 col-lg-6">
              <h1>{hero.titre}</h1>
              <p className="ent-lead">{hero.texte}</p>
              <a href="#contact" className="btn btn-ent">{hero.bouton}</a>
            </div>
            <div className="col-12 col-lg-6">
              <img src={urlImage(hero.image)} alt={hero.image_alt} className="ent-hero-img" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Pourquoi recruter */}
      <section className="ent-section">
        <div className="container">
          <SectionHeading title={raisons.titre} subtitle={raisons.sous_titre} />
          <div className="row g-3">
            {raisons.raisons.map((r, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="ent-why h-100">
                  <p className="ent-num">{r.numero}</p>
                  <h3>{r.titre}</h3>
                  <p className="ent-text mb-0">{r.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Profils */}
      <section className="ent-section">
        <div className="container">
          <SectionHeading title={profils.titre} subtitle={profils.sous_titre} />
          <div className="row g-3">
            {profils.profils.map((p, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="ent-profile h-100">
                  <h3>{p.titre}</h3>
                  <span className="ent-tag">{p.nombre}</span>
                  <p className="ent-text mb-0">{p.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Processus */}
      <section className="ent-section">
        <div className="container">
          <SectionHeading title={processus.titre} subtitle={processus.sous_titre} />
          <div className="row g-3">
            {processus.etapes.map((s, i) => (
              <div className="col-12 col-sm-6 col-lg-3" key={i}>
                <article className="ent-proc h-100">
                  <span className="ent-circle">{s.numero}</span>
                  <h3>{s.titre}</h3>
                  <p className="ent-text mb-0">{s.texte}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Chiffres : valeur = nombre entier du compteur animé, suffixe = symbole affiché après */}
      <section className="ent-stats">
        <div className="container">
          <div className="row g-4 text-center">
            {chiffres.chiffres.map((s, i) => (
              <div className="col-12 col-md-4 ent-stat-box" key={i}>
                <p
                  className="ent-mono ent-stat"
                  style={{ "--to": s.valeur, "--suffix": `"${s.suffixe ?? ""}"` }}
                >
                  <span className="ent-stat-fallback">{s.valeur}{s.suffixe}</span>
                </p>
                <p className="ent-stat-label">{s.libelle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Formulaire */}
      <section className="ent-section" id="contact">
        <div className="container">
          <SectionHeading title={formulaire.titre} subtitle={formulaire.sous_titre} />

          <form className="ent-form mx-auto" onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <Field id="company" label="Nom de l’entreprise" placeholder="Ex: Orange Madagascar" value={form.company} error={errors.company} onChange={handleChange} />
              </div>
              <div className="col-12 col-md-6">
                <Field id="contact" label="Nom du contact principal" placeholder="Ex: Mme. Sarah Ranivo" value={form.contact} error={errors.contact} onChange={handleChange} />
              </div>
            </div>

            <div className="mb-3">
              <Field id="email" type="email" label="Adresse e-mail professionnelle" placeholder="Ex: rh@entreprise.mg" value={form.email} error={errors.email} onChange={handleChange} />
            </div>

            <div className="mb-4">
              <Field
                id="need"
                as="textarea"
                label="Décrivez votre besoin en recrutement (profil, compétences clés...)"
                placeholder="Ex: Recherche d’un développeur Fullstack Node/React disponible en alternance dès mars 2026..."
                value={form.need}
                error={errors.need}
                onChange={handleChange}
              />
            </div>

            {sent && (
              <p className="ent-success" role="status">{formulaire.message_succes}</p>
            )}

            <button type="submit" className="btn btn-ent btn-ent-block" disabled={sending}>
              {sending ? "Envoi…" : formulaire.bouton}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

/* Champ de formulaire (input ou textarea) avec label et message d'erreur */
function Field({ id, label, as = "input", type = "text", error, ...props }) {
  const Tag = as;
  return (
    <div className="ent-field">
      <label htmlFor={id}>{label}</label>
      <div className="ent-input-wrap">
        <Tag
          id={id}
          name={id}
          type={as === "input" ? type : undefined}
          rows={as === "textarea" ? 4 : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && <p className="ent-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}