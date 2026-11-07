import { useCallback, useEffect, useRef, useState } from "react";
import { api, urlFichier } from "../../services/api";
import { useAuth } from "../../Context/AuthContext";
import Icone from "../../assets/Components/Icone";
import Modale, { Champ } from "../../assets/Components/Modale";
import { dateFr, heure } from "../../services/format";

const ROLES = { etudiant: "Étudiant", enseignant: "Enseignant", admin: "Administration", super_admin: "Administration", entreprise: "Entreprise" };
const nom = (p) => (p ? `${p.prenom || ""} ${p.nom || ""}`.trim() : "");
const initiales = (p) => `${p?.prenom?.[0] || ""}${p?.nom?.[0] || ""}`.toUpperCase() || "?";
const memeId = (a, b) => String(a) === String(b);

function Avatar({ p }) {
  return p?.photo
    ? <img className="dash-avatar petit" src={urlFichier(p.photo)} alt="" />
    : <div className="dash-avatar petit">{p ? initiales(p) : <Icone nom="users" taille={16} />}</div>;
}

const quand = (d) => {
  const jour = new Date(d);
  return jour.toDateString() === new Date().toDateString() ? heure(d) : dateFr(d, { day: "2-digit", month: "short" });
};

export default function Messagerie() {
  const { user } = useAuth();
  const estAdmin = ["admin", "super_admin"].includes(user.role);
  const [conversations, setConversations] = useState(null);
  const [choisie, setChoisie] = useState(null);
  const [messages, setMessages] = useState([]);
  const [texte, setTexte] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [nouvelle, setNouvelle] = useState(null);
  const [erreur, setErreur] = useState("");
  const bas = useRef(null);
  const dejaChoisi = useRef(false);

  const autre = (c) => (c.type === "groupe" ? null : c.participants.find((p) => !memeId(p._id, user.id)) || c.participants[0]);
  const titre = (c) => (c.type === "groupe" ? c.nom : nom(autre(c)));

  const chargerListe = useCallback(() => api("/conversations").then(setConversations).catch((e) => setErreur(e.message)), []);

  // Charge les messages, puis marque comme lus ceux des autres
  const chargerMessages = useCallback(async (id) => {
    try {
      const liste = await api(`/conversations/${id}/messages`);
      setMessages(liste);
      const nonLu = liste.some((m) => !memeId(m.auteur?._id, user.id) && !(m.lu_par || []).some((u) => memeId(u, user.id)));
      if (nonLu) {
        await api(`/conversations/${id}/lu`, { method: "PUT" });
        chargerListe();
      }
    } catch (err) {
      setErreur(err.message);
    }
  }, [user.id, chargerListe]);

  useEffect(() => {
    chargerListe();
    const t = setInterval(chargerListe, 10000);
    return () => clearInterval(t);
  }, [chargerListe]);

  // Ouvre la première conversation au premier chargement
  useEffect(() => {
    if (conversations?.length && !dejaChoisi.current) {
      dejaChoisi.current = true;
      setChoisie(conversations[0]._id);
    }
  }, [conversations]);

  useEffect(() => {
    if (!choisie) return undefined;
    setMessages([]);
    chargerMessages(choisie);
    const t = setInterval(() => chargerMessages(choisie), 8000);
    return () => clearInterval(t);
  }, [choisie, chargerMessages]);

  useEffect(() => { bas.current?.scrollIntoView({ block: "end" }); }, [messages.length, choisie]);

  const envoyer = async (e) => {
    e.preventDefault();
    const contenu = texte.trim();
    if (!contenu || !choisie) return;
    setEnvoi(true);
    setErreur("");
    try {
      const m = await api(`/conversations/${choisie}/messages`, { method: "POST", body: { contenu } });
      setMessages((l) => [...l, m]);
      setTexte("");
      chargerListe();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  const supprimer = async (m) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await api(`/conversations/messages/${m._id}`, { method: "DELETE" });
      setMessages((l) => l.filter((x) => x._id !== m._id));
      chargerListe();
    } catch (err) {
      setErreur(err.message);
    }
  };

  // ----- Nouvelle conversation -----
  const ouvrirNouvelle = () => setNouvelle({ q: "", role: "", contacts: [], choix: [], nom: "", erreur: "" });

  useEffect(() => {
    if (!nouvelle) return undefined;
    const t = setTimeout(() => {
      api("/conversations/contacts", { params: { q: nouvelle.q, role: nouvelle.role } })
        .then((contacts) => setNouvelle((n) => n && { ...n, contacts }))
        .catch((err) => setNouvelle((n) => n && { ...n, erreur: err.message }));
    }, 250);
    return () => clearTimeout(t);
  }, [nouvelle?.q, nouvelle?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  const basculer = (id) => setNouvelle((n) => ({ ...n, choix: n.choix.includes(id) ? n.choix.filter((x) => x !== id) : [...n.choix, id] }));

  const creer = async (e) => {
    e.preventDefault();
    const groupe = nouvelle.choix.length > 1;
    try {
      const c = await api("/conversations", { method: "POST", body: { type: groupe ? "groupe" : "direct", nom: groupe ? nouvelle.nom : undefined, participants: nouvelle.choix } });
      await chargerListe();
      setChoisie(c._id);
      setNouvelle(null);
    } catch (err) {
      setNouvelle((n) => ({ ...n, erreur: err.message }));
    }
  };

  const visibles = (conversations || []).filter((c) => `${titre(c)} ${c.dernier_message?.contenu || ""}`.toLowerCase().includes(recherche.toLowerCase()));
  const active = (conversations || []).find((c) => c._id === choisie);
  let jourPrecedent = "";

  return (
    <>
      <h1 className="dash-titre">Messagerie</h1>
      <p className="dash-sous">Échangez avec les enseignants, l'administration et vos camarades.</p>
      {erreur && <div className="alert alert-danger" role="alert">{erreur}</div>}

      <div className="dash-msg">
        <section className="dash-msg-liste">
          <h2>Messages <button type="button" className="dash-btn petit" onClick={ouvrirNouvelle}><Icone nom="plus" taille={14} /> Nouveau</button></h2>
          <input className="form-control" placeholder="Rechercher une conversation…" aria-label="Rechercher une conversation" value={recherche} onChange={(e) => setRecherche(e.target.value)} />
          <div className="dash-conv-liste">
            {conversations === null && <p className="dash-vide">Chargement…</p>}
            {conversations && visibles.length === 0 && <p className="dash-vide">{conversations.length ? "Aucun résultat." : "Aucune conversation. Cliquez sur « Nouveau » pour commencer."}</p>}
            {visibles.map((c) => (
              <button type="button" key={c._id} className={`dash-conv${c._id === choisie ? " actif" : ""}`} onClick={() => setChoisie(c._id)}>
                <Avatar p={autre(c)} />
                <span className="texte">
                  <strong>{titre(c)}</strong>
                  <small>{c.dernier_message ? c.dernier_message.contenu : "Aucun message"}</small>
                </span>
                <span className="meta">
                  <span>{c.dernier_message ? quand(c.dernier_message.createdAt) : ""}</span>
                  {c.non_lus > 0 && <span className="dash-pastille-nb">{c.non_lus}</span>}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="dash-msg-chat">
          {!active && <p className="dash-vide" style={{ margin: "auto" }}>Sélectionnez une conversation.</p>}
          {active && (
            <>
              <div className="dash-msg-tete">
                <Avatar p={autre(active)} />
                <div>
                  <strong>{titre(active)}</strong>
                  <small>{active.type === "groupe" ? `${active.participants.length} participants` : ROLES[autre(active)?.role] || ""}</small>
                </div>
              </div>

              <div className="dash-msg-corps">
                {messages.length === 0 && <p className="dash-vide">Aucun message. Écrivez le premier !</p>}
                {messages.map((m) => {
                  const moi = memeId(m.auteur?._id, user.id);
                  const jour = new Date(m.createdAt).toDateString();
                  const separateur = jour !== jourPrecedent;
                  jourPrecedent = jour;
                  return (
                    <div key={m._id} style={{ display: "contents" }}>
                      {separateur && <div className="dash-jour-sep">{dateFr(m.createdAt, { weekday: "long", day: "numeric", month: "long" })}</div>}
                      <div className={`dash-bulle${moi ? " moi" : ""}`}>
                        <span className="auteur">{nom(m.auteur)}</span>
                        {m.contenu}
                        <small>
                          <span>{heure(m.createdAt)}</span>
                          {(moi || estAdmin) && <button type="button" onClick={() => supprimer(m)}>Supprimer</button>}
                        </small>
                      </div>
                    </div>
                  );
                })}
                <div ref={bas} />
              </div>

              <form className="dash-msg-saisie" onSubmit={envoyer}>
                <textarea className="form-control" rows="1" maxLength={2000} placeholder="Écrivez votre message…" aria-label="Votre message"
                  value={texte} onChange={(e) => setTexte(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) envoyer(e); }} />
                <button className="dash-btn principal" disabled={envoi || !texte.trim()}>Envoyer</button>
              </form>
            </>
          )}
        </section>
      </div>

      {nouvelle && (
        <Modale titre="Nouvelle conversation" envoi="Démarrer" onSubmit={creer} onClose={() => setNouvelle(null)} erreur={nouvelle.erreur}>
          <div className="row">
            <Champ id="nc-q" label="Rechercher une personne" className="col-sm-7 mb-0">
              <input id="nc-q" className="form-control" placeholder="Nom ou prénom" value={nouvelle.q} onChange={(e) => setNouvelle({ ...nouvelle, q: e.target.value })} />
            </Champ>
            <Champ id="nc-role" label="Rôle" className="col-sm-5 mb-0">
              <select id="nc-role" className="form-select" value={nouvelle.role} onChange={(e) => setNouvelle({ ...nouvelle, role: e.target.value })}>
                <option value="">Tous</option>
                <option value="enseignant">Enseignants</option>
                <option value="etudiant">Étudiants</option>
                <option value="admin">Administration</option>
              </select>
            </Champ>
          </div>
          <div className="dash-liste-contacts">
            {nouvelle.contacts.length === 0 && <p className="dash-vide">Aucune personne trouvée.</p>}
            {nouvelle.contacts.map((c) => (
              <label key={c._id}>
                <input type="checkbox" checked={nouvelle.choix.includes(c._id)} onChange={() => basculer(c._id)} />
                <span>{nom(c)} <small style={{ color: "#8c9bbd" }}>· {ROLES[c.role] || c.role}</small></span>
              </label>
            ))}
          </div>
          {nouvelle.choix.length > 1 && (
            <Champ id="nc-nom" label="Nom du groupe">
              <input id="nc-nom" className="form-control" required placeholder="Ex : Projet tuteuré" value={nouvelle.nom} onChange={(e) => setNouvelle({ ...nouvelle, nom: e.target.value })} />
            </Champ>
          )}
          <p style={{ color: "#8c9bbd", fontSize: ".8rem" }}>{nouvelle.choix.length === 0 ? "Cochez une personne pour une conversation directe, ou plusieurs pour créer un groupe." : nouvelle.choix.length === 1 ? "Conversation directe." : `Groupe de ${nouvelle.choix.length + 1} personnes (vous compris).`}</p>
        </Modale>
      )}
    </>
  );
}
