import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import ChampMotDePasse from "../assets/Components/ChampMotDePasse";
import "../styles/auth.css";

export default function ReinitialiserMotDePasse() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const [mdp, setMdp] = useState({ nouveau: "", confirmation: "" });
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Lien invalide</h1>
          <p>Ce lien de réinitialisation est invalide ou incomplet.</p>
          <Link to="/mot-de-passe-oublie" className="btn btn-orange w-100">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    if (mdp.nouveau !== mdp.confirmation) {
      return setErreur("Les mots de passe ne correspondent pas");
    }
    setEnvoi(true);
    try {
      const data = await api("/users/reinitialiser-mot-de-passe", {
        method: "POST",
        body: { token, mot_de_passe: mdp.nouveau },
      });
      navigate("/connexion", { state: { message: data.message } });
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={soumettre}>
        <h1>Nouveau mot de passe</h1>
        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="mb-3">
          <label htmlFor="nouveau">Nouveau mot de passe</label>
          <ChampMotDePasse
            id="nouveau"
            name="nouveau"
            placeholder="Créez un mot de passe"
            autoComplete="new-password"
            value={mdp.nouveau}
            onChange={(e) => setMdp({ ...mdp, nouveau: e.target.value })}
          />
          <small>
            8 caractères minimum, avec au moins une lettre et un chiffre.
          </small>
        </div>
        <div className="mb-4">
          <label htmlFor="confirmation">Confirmer le mot de passe</label>
          <ChampMotDePasse
            id="confirmation"
            name="confirmation"
            placeholder="Confirmez le mot de passe"
            autoComplete="new-password"
            value={mdp.confirmation}
            onChange={(e) => setMdp({ ...mdp, confirmation: e.target.value })}
          />
        </div>

        <button className="btn btn-orange w-100 py-2" disabled={envoi}>
          {envoi ? "Enregistrement…" : "Réinitialiser le mot de passe"}
        </button>
      </form>
    </div>
  );
}
