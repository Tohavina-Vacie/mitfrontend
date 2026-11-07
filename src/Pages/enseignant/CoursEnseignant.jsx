import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import CarteStat from "../../assets/Components/CarteStat";

export default function CoursEnseignant() {
  const { user } = useAuth();
  const [cours, setCours] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/cours", { params: { enseignant: user.id } }).then(setCours).catch((e) => setErreur(e.message));
  }, [user.id]);

  return (
    <>
      <h1 className="dash-titre">Mes cours</h1>
      <p className="dash-sous">Les modules dont vous êtes responsable.</p>
      {erreur && <div className="alert alert-danger">{erreur}</div>}
      {!cours && !erreur && <p className="dash-sous">Chargement…</p>}
      {cours && cours.length === 0 && <div className="dash-carte"><p className="dash-vide">Aucun cours ne vous est attribué pour le moment. L'administration peut vous en affecter depuis la page « Cours ».</p></div>}

      {cours && cours.length > 0 && (
        <>
          <div className="dash-stats">
            <CarteStat titre="Modules" valeur={cours.length} sous="Attribués" />
            <CarteStat titre="Crédits ECTS" valeur={cours.reduce((s, c) => s + c.ects, 0)} sous="Total des modules" />
            <CarteStat titre="Heures par semaine" valeur={cours.reduce((s, c) => s + (c.heures_semaine || 0), 0)} sous="De cours" />
          </div>
          <div className="dash-grille-cours">
            {cours.map((c) => (
              <article className="dash-carte" key={c._id}>
                <span className="dash-tag orange">{c.ects} ECTS</span>
                <h3>{c.titre}</h3>
                <small>{[c.formation?.titre, c.niveau, c.semestre].filter(Boolean).join(" · ")}</small>
                <dl className="dash-infos mt-3 mb-3">
                  <div><dt>Coefficient</dt><dd>{c.coefficient}</dd></div>
                  <div><dt>Heures par semaine</dt><dd>{c.heures_semaine || 0}</dd></div>
                </dl>
                <Link to={`/enseignant/notes?cours=${c._id}`} className="dash-btn principal">Saisir les notes</Link>
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
