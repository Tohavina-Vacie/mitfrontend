import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../Context/AuthContext";
import "../styles/contact.css";

// Les créneaux sont définis en heure de Madagascar, quel que soit le fuseau du visiteur
const FUSEAU = "Indian/Antananarivo";
const heureMg = (d) => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: FUSEAU });
const dateMg = (d) => new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: FUSEAU });
const aujourdhui = () => new Date().toLocaleDateString("fr-CA", { timeZone: FUSEAU }); // AAAA-MM-JJ
const plusJours = (jour, n) => {
  const d = new Date(`${jour}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const jourOuvre = (jour) => {
  let j = jour;
  for (let i = 0; i < 3; i += 1) {
    const semaine = new Date(`${j}T12:00:00Z`).getUTCDay();
    if (semaine === 0 || semaine === 6) j = plusJours(j, 1);
  }
  return j;
};

export default function RendezVous() {
  const { user } = useAuth();
  const min = aujourdhui();
  const max = plusJours(min, 90);
  const [jour, setJour] = useState(jourOuvre(min));
  const [creneaux, setCreneaux] = useState(null);
  const [choisi, setChoisi] = useState(null);
  const [form, setForm] = useState({ nom: user?.nom || "", prenom: user?.prenom || "", email: user?.email || "", telephone: user?.telephone || "", motif: "" });
  const [etat, setEtat] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(null);

  const charger = useCallback(() => {
    setCreneaux(null);
    api("/rendez-vous/creneaux", { params: { date: jour } })
      .then((r) => setCreneaux(r.creneaux))
      .catch((e) => { setCreneaux([]); setEtat({ type: "ko", texte: e.message }); });
  }, [jour]);
  useEffect(() => { setChoisi(null); charger(); }, [charger]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const soumettre = async (e) => {
    e.preventDefault();
    if (!choisi) return setEtat({ type: "ko", texte: "Choisissez d'abord un créneau." });
    setEtat(null);
    setEnvoi(true);
    try {
      const corps = { ...Object.fromEntries(Object.entries(form).filter(([, v]) => v.trim() !== "")), debut: choisi.debut };
      const r = await api("/rendez-vous", { method: "POST", body: corps });
      setEnvoye(r.debut);
      setForm({ ...form, motif: "" });
      setChoisi(null);
      charger();
    } catch (err) {
      setEtat({ type: "ko", texte: err.status === 400 ? `Veuillez vérifier les informations saisies. ${err.message}` : err.message });
      if (err.status === 409) { setChoisi(null); charger(); } // créneau pris entre-temps
    } finally {
      setEnvoi(false);
    }
  };

  const matin = (creneaux || []).filter((c) => Number(heureMg(c.debut).slice(0, 2)) < 12);
  const apresMidi = (creneaux || []).filter((c) => Number(heureMg(c.debut).slice(0, 2)) >= 12);
  const libres = (creneaux || []).filter((c) => c.disponible).length;

  const grille = (liste) => (
    <div className="rv-creneaux">
      {liste.map((c) => (
        <button type="button" key={c.debut} className="rv-creneau" disabled={!c.disponible} aria-pressed={choisi?.debut === c.debut}
          aria-label={`${heureMg(c.debut)}${c.disponible ? "" : ", indisponible"}`} onClick={() => setChoisi(c)}>
          {heureMg(c.debut)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="ct">
      <header className="ct-hero">
        <div className="ct-interieur">
          <h1>Prendre rendez-vous en ligne</h1>
          <p>Planifiez un échange de 15 minutes en visioconférence avec un conseiller d'orientation pour structurer vos démarches et valider votre dossier d'alternance.</p>
        </div>
      </header>

      <main className="ct-principal">
        <div className="ct-interieur ct-grille">
          <section className="ct-formulaire">
            <p className="rv-etape">Étape 1</p>
            <h2>Choisissez un créneau</h2>
            <div className="ct-champ">
              <label htmlFor="rv-date">Date</label>
              <input id="rv-date" type="date" min={min} max={max} value={jour} onChange={(e) => e.target.value && setJour(e.target.value)} />
            </div>
            <p className="rv-fuseau">Heures de Madagascar (UTC+3) · du lundi au vendredi, de 08h00 à 17h30</p>

            {!creneaux && <p style={{ color: "#9fb0d6" }}>Chargement des créneaux…</p>}
            {creneaux && creneaux.length === 0 && <div className="ct-message ko">Aucun créneau ce jour-là : les rendez-vous se prennent du lundi au vendredi.</div>}
            {creneaux && creneaux.length > 0 && (
              <>
                {libres === 0 && <div className="ct-message ko">Tous les créneaux de cette journée sont pris ou passés. Essayez un autre jour.</div>}
                <p className="rv-groupe">Matin</p>
                {grille(matin)}
                <p className="rv-groupe">Après-midi</p>
                {grille(apresMidi)}
              </>
            )}
          </section>

          <section className="ct-formulaire">
            {envoye ? (
              <div className="rv-succes" aria-live="polite">
                <h2>Demande envoyée</h2>
                <p>Votre demande pour le <strong>{dateMg(envoye)} à {heureMg(envoye)}</strong> (heure de Madagascar) a bien été enregistrée.</p>
                <p>Vous recevrez un e-mail de confirmation, avec le lien de la visioconférence, dès qu'elle aura été validée par notre équipe.</p>
                <button type="button" className="ct-bouton" onClick={() => setEnvoye(null)}>Faire une autre demande</button>
              </div>
            ) : (
              <form onSubmit={soumettre}>
                <p className="rv-etape">Étape 2</p>
                <h2>Vos informations</h2>
                <div aria-live="polite">{etat && <div className={`ct-message ${etat.type}`}>{etat.texte}</div>}</div>

                <div className="rv-resume">
                  {choisi ? <><span>Créneau choisi</span><strong>{dateMg(choisi.debut)} à {heureMg(choisi.debut)}</strong></> : <span>Aucun créneau choisi pour l'instant.</span>}
                </div>

                <div className="ct-champs">
                  <div className="ct-champ"><label htmlFor="rv-nom">Nom</label><input id="rv-nom" name="nom" required placeholder="Votre nom" autoComplete="family-name" value={form.nom} onChange={change} /></div>
                  <div className="ct-champ"><label htmlFor="rv-prenom">Prénom</label><input id="rv-prenom" name="prenom" placeholder="Votre prénom" autoComplete="given-name" value={form.prenom} onChange={change} /></div>
                  <div className="ct-champ"><label htmlFor="rv-email">Email</label><input id="rv-email" name="email" type="email" required placeholder="adresse@email.mg" autoComplete="email" value={form.email} onChange={change} /></div>
                  <div className="ct-champ"><label htmlFor="rv-tel">Téléphone</label><input id="rv-tel" name="telephone" type="tel" placeholder="+261 33 00 000 00" autoComplete="tel" value={form.telephone} onChange={change} /></div>
                  <div className="ct-champ large">
                    <label htmlFor="rv-motif">Motif du rendez-vous</label>
                    <textarea id="rv-motif" name="motif" required maxLength={1000} placeholder="Ex : je souhaite m'informer sur l'alternance en développement full-stack." value={form.motif} onChange={change} />
                  </div>
                </div>
                <button className="ct-envoyer" disabled={envoi || !choisi}>{envoi ? "Envoi…" : "Demander ce rendez-vous"}</button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
