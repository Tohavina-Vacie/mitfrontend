import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../Context/AuthContext";
import { useContenuPage } from "../services/useContenu";
import Icone from "../assets/Components/Icone";
import "../styles/contact.css";

// Textes de la page : modifiables dans le dashboard admin (« Contenu du site »)
export default function Contact() {
  const { user } = useAuth();
  const { entete, formulaire: formu, coordonnees, reseaux, ...autres } = useContenuPage("contact");
  const rdv = autres["rendez-vous"];
  const formulaire = useRef(null);
  const [form, setForm] = useState({
    nom: user?.nom || "", prenom: user?.prenom || "", email: user?.email || "", telephone: user?.telephone || "",
    sujet: "", entreprise: "", message: "",
  });
  const [etat, setEtat] = useState(null); // { type: "ok" | "ko", texte }
  const [envoi, setEnvoi] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const partenariat = form.sujet.toLowerCase().includes("partenariat");

  const soumettre = async (e) => {
    e.preventDefault();
    setEtat(null);
    setEnvoi(true);
    try {
      // Seuls les champs remplis sont envoyés ; « entreprise » n'a de sens que pour un partenariat
      const corps = Object.fromEntries(Object.entries(form).filter(([k, v]) => v.trim() !== "" && (k !== "entreprise" || partenariat)));
      await api("/messages", { method: "POST", body: corps });
      setEtat({ type: "ok", texte: "Merci, votre message a bien été envoyé. Notre équipe vous répondra rapidement." });
      setForm({ ...form, sujet: "", entreprise: "", message: "" });
    } catch (err) {
      setEtat({ type: "ko", texte: err.status === 400 ? "Veuillez vérifier les informations saisies (adresse e-mail valide, objet et message renseignés)." : err.message });
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="ct">
      <header className="ct-hero">
        <div className="ct-interieur">
          <h1>{entete.titre}</h1>
          <p>{entete.texte}</p>
        </div>
      </header>

      <main className="ct-principal">
        <div className="ct-interieur ct-grille">
          <form className="ct-formulaire" ref={formulaire} onSubmit={soumettre}>
            <h2>{formu.titre}</h2>
            <div aria-live="polite">{etat && <div className={`ct-message ${etat.type}`}>{etat.texte}</div>}</div>

            <div className="ct-champs">
              <div className="ct-champ"><label htmlFor="ct-nom">Nom</label><input id="ct-nom" name="nom" required placeholder="Votre nom" autoComplete="family-name" value={form.nom} onChange={change} /></div>
              <div className="ct-champ"><label htmlFor="ct-prenom">Prénom</label><input id="ct-prenom" name="prenom" placeholder="Votre prénom" autoComplete="given-name" value={form.prenom} onChange={change} /></div>
              <div className="ct-champ"><label htmlFor="ct-email">Email</label><input id="ct-email" name="email" type="email" required placeholder="adresse@email.mg" autoComplete="email" value={form.email} onChange={change} /></div>
              <div className="ct-champ"><label htmlFor="ct-tel">Téléphone</label><input id="ct-tel" name="telephone" type="tel" placeholder="+261 33 00 000 00" autoComplete="tel" value={form.telephone} onChange={change} /></div>

              <div className="ct-champ large">
                <label htmlFor="ct-sujet">Objet</label>
                <select id="ct-sujet" name="sujet" required value={form.sujet} onChange={change}>
                  <option value="" disabled>Sélectionnez l'objet de votre demande (Ex : Inscription, Partenariat)</option>
                  {formu.objets.map((o, i) => <option key={i}>{o}</option>)}
                </select>
              </div>

              {partenariat && (
                <div className="ct-champ large"><label htmlFor="ct-entreprise">Entreprise</label><input id="ct-entreprise" name="entreprise" placeholder="Nom de votre entreprise" value={form.entreprise} onChange={change} /></div>
              )}

              <div className="ct-champ large">
                <label htmlFor="ct-message">Message</label>
                <textarea id="ct-message" name="message" required maxLength={5000} placeholder="Écrivez votre message ici…" value={form.message} onChange={change} />
              </div>
            </div>

            <button className="ct-envoyer" disabled={envoi}>{envoi ? "Envoi…" : "Envoyer"}</button>
          </form>

          <aside className="ct-coordonnees">
            <h2>{coordonnees.titre}</h2>
            <div className="ct-info"><div className="ct-icone"><Icone nom="pin" /></div><div><strong>{coordonnees.adresse_titre}</strong><span>{coordonnees.adresse}</span></div></div>
            <div className="ct-info"><div className="ct-icone"><Icone nom="phone" /></div><div><strong>{coordonnees.contact_titre}</strong><span>{coordonnees.telephone} &nbsp;|&nbsp; {coordonnees.email}</span></div></div>
            <div className="ct-info"><div className="ct-icone"><Icone nom="clock" /></div><div><strong>{coordonnees.horaires_titre}</strong><span>{coordonnees.horaires}</span></div></div>

            {/* Placez une capture du plan dans public/images/carte-antananarivo.png pour l'afficher à la place du fond */}
            <a className="ct-plan" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordonnees.adresse)}`} target="_blank" rel="noreferrer" aria-label="Ouvrir le campus dans Google Maps">
              <img src="/images/carte-antananarivo.png" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              <span className="ct-pin"><Icone nom="pin" taille={16} /> MIT Madagascar</span>
              <small>Antananarivo<br />Madagascar</small>
            </a>
          </aside>
        </div>
      </main>

      <section className="ct-rdv">
        <div className="ct-interieur">
          <div>
            <h2>{rdv.titre}</h2>
            <p>{rdv.texte}</p>
          </div>
          <Link to="/rendez-vous" className="ct-bouton" style={{ textDecoration: "none", display: "inline-block" }}>{rdv.bouton}</Link>
        </div>
      </section>

      <section className="ct-reseaux">
        <p>{reseaux.titre}</p>
        <div className="ct-liste">
          {reseaux.liens.map((l, i) => <a key={i} href={l.url} target="_blank" rel="noreferrer"><b aria-hidden="true">{l.sigle}</b> {l.nom}</a>)}
        </div>
      </section>
    </div>
  );
}
