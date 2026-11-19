import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import "../styles/auth.css";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    setMessage("");
    setEnvoi(true);
    try {
      const data = await api("/users/mot-de-passe-oublie", {
        method: "POST",
        body: { email },
      });
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={soumettre}>
        <h1>Mot de passe oublié</h1>
        <p>
          Saisissez l'adresse e-mail de votre compte. Nous vous enverrons un
          lien pour choisir un nouveau mot de passe.
        </p>
        {message && <div className="alert alert-success">{message}</div>}
        {erreur && <div className="alert alert-danger">{erreur}</div>}

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="exemple@email.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-orange w-100 py-2" disabled={envoi}>
          {envoi ? "Envoi…" : "Envoyer le lien"}
        </button>

        <p className="text-center mt-4 mb-0">
          <Link to="/connexion">Retour à la connexion</Link>
        </p>
      </form>
    </div>
  );
}