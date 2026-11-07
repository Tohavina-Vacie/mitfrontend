import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import CarteStat from "../../assets/Components/CarteStat";
import { JOURS, dateFr, heure, lundiDe, nomPersonne, plusJours } from "../../services/format";

const jour = (d) => JOURS[(new Date(d).getDay() + 6) % 7];

export default function AccueilEnseignant() {
  const { user } = useAuth();
  const [cours, setCours] = useState(null);
  const [semaine, setSemaine] = useState(null);
  const [prochaine, setProchaine] = useState(null);
  const [conventions, setConventions] = useState([]);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const lundi = lundiDe();
    api("/cours", { params: { enseignant: user.id } }).then(setCours).catch((e) => setErreur(e.message));
    api("/seances/mon-planning", { params: { du: lundi.toISOString(), au: plusJours(lundi, 7).toISOString() } }).then(setSemaine).catch((e) => setErreur(e.message));
    api("/seances/mon-planning", { params: { du: new Date().toISOString() } }).then((l) => setProchaine(l[0] || null)).catch(() => {});
    api("/conventions/mes-conventions").then(setConventions).catch(() => {});
  }, [user.id]);

  const actives = conventions.filter((c) => c.statut === "active");

  return (
    <>
      <h1 className="dash-titre">Bonjour, {user.prenom} !</h1>
      <p className="dash-sous">Voici un résumé de votre activité d'enseignement.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="dash-stats">
        <CarteStat titre="Mes cours" valeur={cours ? cours.length : "…"} sous={user.specialite || "Matières enseignées"} />
        <CarteStat titre="Heures par semaine" valeur={cours ? cours.reduce((s, c) => s + (c.heures_semaine || 0), 0) : "…"} sous="Volume hebdomadaire prévu" />
        <CarteStat titre="Séances cette semaine" valeur={semaine ? semaine.length : "…"} sous="Séances publiées" />
        <CarteStat titre="Alternants suivis" valeur={actives.length} sous="En tant que tuteur pédagogique" />
      </div>

      <div className="dash-colonnes">
        <section className="dash-carte">
          <h2>Mon emploi du temps <Link to="/enseignant/emploi-du-temps">Voir la semaine</Link></h2>
          {semaine && semaine.length === 0 && <p className="dash-vide">Aucune séance publiée cette semaine.</p>}
          {(semaine || []).map((s) => (
            <div className="dash-ligne" key={s._id}>
              <div className="gauche">
                <span className="dash-jour">{jour(s.debut)}</span>
                <div>
                  <strong>{s.cours?.titre || "Cours"}</strong>
                  <small>{[s.formation?.titre, s.niveau, s.salle?.nom].filter(Boolean).join(" · ")}</small>
                </div>
              </div>
              <span style={{ color: "#8c9bbd", whiteSpace: "nowrap" }}>{heure(s.debut)} - {heure(s.fin)}</span>
            </div>
          ))}
        </section>

        <div className="dash-colonne">
          <section className="dash-carte">
            <h2>Prochaine séance</h2>
            {!prochaine && <p className="dash-vide">Aucune séance à venir.</p>}
            {prochaine && (
              <div className="dash-ligne" style={{ display: "block" }}>
                <strong>{prochaine.cours?.titre}</strong>
                <small>{jour(prochaine.debut)} {dateFr(prochaine.debut)} · {heure(prochaine.debut)} - {heure(prochaine.fin)}</small>
                <small>{[prochaine.formation?.titre, prochaine.niveau, prochaine.salle?.nom].filter(Boolean).join(" · ")}</small>
              </div>
            )}
          </section>

          <section className="dash-carte">
            <h2>Alternants suivis <Link to="/enseignant/alternants">Tout voir</Link></h2>
            {actives.length === 0 && <p className="dash-vide">Aucun alternant suivi pour le moment.</p>}
            {actives.slice(0, 4).map((c) => (
              <div className="dash-ligne" key={c._id}>
                <div><strong>{nomPersonne(c.etudiant)}</strong><small>{c.entreprise?.nom} · {c.poste}</small></div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
