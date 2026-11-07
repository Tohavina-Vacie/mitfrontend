import { useCallback, useEffect, useState } from "react";
import { api } from "../../services/api";
import { CATALOGUE, CONTENUS_PAR_DEFAUT } from "../../services/contenusParDefaut";
import { fusionner } from "../../services/useContenu";
import EditeurContenu from "../../assets/Components/EditeurContenu";
import Modale, { Champ } from "../../assets/Components/Modale";
import { dateFr, heure, nomPersonne } from "../../services/format";

const SLUG = /^[a-z0-9-]{1,50}$/;
const TAILLE_MAX = 50000;
const copie = (o) => JSON.parse(JSON.stringify(o));

export default function ContenuSite() {
  const [existants, setExistants] = useState({});
  const [choix, setChoix] = useState(null);
  const [brouillon, setBrouillon] = useState({});
  const [base, setBase] = useState("");
  const [ordre, setOrdre] = useState(0);
  const [publie, setPublie] = useState(true);
  const [onglet, setOnglet] = useState("formulaire");
  const [texteJson, setTexteJson] = useState("");
  const [erreurJson, setErreurJson] = useState("");
  const [nouvelle, setNouvelle] = useState(null);
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const chargerExistants = useCallback(async () => {
    const liste = await api("/contenus");
    const carte = Object.fromEntries(liste.map((c) => [`${c.page}/${c.section}`, c]));
    setExistants(carte);
    return carte;
  }, []);
  useEffect(() => { chargerExistants().catch((e) => setErreur(e.message)); }, [chargerExistants]);

  const ouvrir = (page, section, liste) => {
    const defaut = CONTENUS_PAR_DEFAUT[page]?.[section] || {};
    const enregistre = liste[`${page}/${section}`];
    const donnees = copie(fusionner(defaut, enregistre?.donnees));
    const o = enregistre?.ordre ?? 0;
    const p = enregistre?.publie ?? true;
    setChoix({ page, section });
    setBrouillon(donnees);
    setOrdre(o);
    setPublie(p);
    setBase(JSON.stringify({ donnees, ordre: o, publie: p }));
    setTexteJson(JSON.stringify(donnees, null, 2));
    setErreurJson("");
    setOnglet(Object.keys(donnees).length ? "formulaire" : "json");
    setMessage("");
    setErreur("");
  };

  const actuel = JSON.stringify({ donnees: brouillon, ordre: Number(ordre), publie });
  const modifie = choix && actuel !== base;
  const taille = JSON.stringify(brouillon).length;
  const enregistre = choix ? existants[`${choix.page}/${choix.section}`] : null;
  const defautChoix = choix ? CONTENUS_PAR_DEFAUT[choix.page]?.[choix.section] : null;

  const selectionner = (page, section) => {
    if (modifie && !window.confirm("Abandonner les modifications non enregistrées ?")) return;
    ouvrir(page, section, existants);
  };

  const versJson = () => { setTexteJson(JSON.stringify(brouillon, null, 2)); setErreurJson(""); setOnglet("json"); };
  const changerJson = (t) => {
    setTexteJson(t);
    try {
      const v = JSON.parse(t);
      if (!v || typeof v !== "object" || Array.isArray(v)) throw new Error("Le contenu doit être un objet JSON : { … }");
      setBrouillon(v);
      setErreurJson("");
    } catch (e) {
      setErreurJson(e.message);
    }
  };
  const changerFormulaire = (v) => { setBrouillon(v); setTexteJson(JSON.stringify(v, null, 2)); };

  const sauver = async () => {
    setEnvoi(true); setErreur(""); setMessage("");
    try {
      await api(`/contenus/${choix.page}/${choix.section}`, { method: "PUT", body: { donnees: brouillon, ordre: Number(ordre), publie } });
      const liste = await chargerExistants();
      ouvrir(choix.page, choix.section, liste);
      setMessage("Enregistré. Le site affiche déjà cette version (rechargez la page du site pour la voir).");
    } catch (err) {
      setErreur(err.message);
    } finally {
      setEnvoi(false);
    }
  };

  const supprimer = async () => {
    if (!window.confirm("Supprimer la version enregistrée ? Le site reviendra au texte d'origine de cette section.")) return;
    setErreur(""); setMessage("");
    try {
      await api(`/contenus/${choix.page}/${choix.section}`, { method: "DELETE" });
      const liste = await chargerExistants();
      ouvrir(choix.page, choix.section, liste);
      setMessage("Version enregistrée supprimée : le texte d'origine est de nouveau affiché sur le site.");
    } catch (err) {
      setErreur(err.message);
    }
  };

  const remplirOriginal = () => {
    if (!defautChoix) return;
    const d = copie(defautChoix);
    setBrouillon(d);
    setTexteJson(JSON.stringify(d, null, 2));
    setErreurJson("");
  };

  const catalogue = CATALOGUE;
  const connu = (c) => catalogue.some((p) => p.page === c.page && p.sections.some(([s]) => s === c.section));
  const autres = Object.values(existants).filter((c) => !connu(c));
  const etat = (page, section) => {
    const c = existants[`${page}/${section}`];
    return !c ? ["gris", "Original"] : c.publie ? ["vert", "Modifié"] : ["orange", "Non publié"];
  };
  const pageChoisie = choix && catalogue.find((p) => p.page === choix.page);
  const libelleSection = pageChoisie?.sections.find(([s]) => s === choix.section)?.[1] || choix?.section;

  const creer = (e) => {
    e.preventDefault();
    if (!SLUG.test(nouvelle.page) || !SLUG.test(nouvelle.section)) return setNouvelle({ ...nouvelle, erreur: "Utilisez uniquement des minuscules, des chiffres et des tirets (50 caractères maximum)." });
    const { page, section } = nouvelle;
    setNouvelle(null);
    ouvrir(page, section, existants);
  };

  return (
    <>
      <div className="dash-entete-page">
        <div>
          <h1 className="dash-titre">Contenu du site</h1>
          <p className="dash-sous">Modifiez les textes et les images du site sans toucher au code. Tant qu'une section n'est pas modifiée, le site affiche son texte d'origine.</p>
        </div>
        <button type="button" className="dash-btn" onClick={() => setNouvelle({ page: "", section: "", erreur: "" })}>Nouvelle section</button>
      </div>

      <div className="dash-colonnes" style={{ gridTemplateColumns: "300px 1fr" }}>
        <aside className="dash-carte">
          {catalogue.map((p) => (
            <div key={p.page} className="mb-3">
              <h2 style={{ fontSize: ".9rem", marginBottom: 8 }}>{p.libelle}</h2>
              {p.sections.map(([s, libelle]) => {
                const [couleur, texte] = etat(p.page, s);
                const actif = choix?.page === p.page && choix?.section === s;
                return (
                  <button type="button" key={s} className={`dash-conv${actif ? " actif" : ""}`} style={{ marginBottom: 6, padding: "9px 12px" }} onClick={() => selectionner(p.page, s)}>
                    <span className="texte"><strong style={{ fontSize: ".85rem" }}>{libelle}</strong></span>
                    <span className={`dash-tag ${couleur}`}>{texte}</span>
                  </button>
                );
              })}
            </div>
          ))}
          {autres.length > 0 && (
            <div className="mb-2">
              <h2 style={{ fontSize: ".9rem", marginBottom: 8 }}>Autres sections</h2>
              {autres.map((c) => (
                <button type="button" key={`${c.page}/${c.section}`} className={`dash-conv${choix?.page === c.page && choix?.section === c.section ? " actif" : ""}`} style={{ marginBottom: 6, padding: "9px 12px" }} onClick={() => selectionner(c.page, c.section)}>
                  <span className="texte"><strong style={{ fontSize: ".85rem" }}>{c.page} / {c.section}</strong></span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="dash-carte dash-editeur">
          {!choix && <p className="dash-vide">Choisissez une section dans la liste pour la modifier.</p>}
          {choix && (
            <>
              <h2 style={{ marginBottom: 4 }}>{pageChoisie?.libelle || choix.page} › {libelleSection}</h2>
              <p className="dash-sous" style={{ fontSize: ".8rem" }}>
                {enregistre ? `Dernière modification le ${dateFr(enregistre.updatedAt)} à ${heure(enregistre.updatedAt)}${enregistre.modifie_par ? ` par ${nomPersonne(enregistre.modifie_par)}` : ""}.` : "Cette section affiche encore son texte d'origine."}
                {" "}<a href={pageChoisie?.url || "/"} target="_blank" rel="noreferrer" style={{ color: "#e8761f" }}>Voir le site</a>
              </p>

              {message && <div className="alert alert-success">{message}</div>}
              {erreur && <div className="alert alert-danger">{erreur}</div>}

              <div className="dash-onglets" role="tablist">
                <button type="button" className={onglet === "formulaire" ? "actif" : ""} onClick={() => !erreurJson && setOnglet("formulaire")}>Formulaire</button>
                <button type="button" className={onglet === "json" ? "actif" : ""} onClick={versJson}>JSON (avancé)</button>
              </div>

              {onglet === "formulaire" && <EditeurContenu valeur={brouillon} onChange={changerFormulaire} />}
              {onglet === "json" && (
                <div className="mb-3">
                  <textarea className="form-control" rows="16" spellCheck="false" aria-label="Contenu au format JSON" style={{ fontFamily: "ui-monospace, monospace", fontSize: ".82rem" }} value={texteJson} onChange={(e) => changerJson(e.target.value)} />
                  {erreurJson && <div className="alert alert-danger mt-2 mb-0">{erreurJson}</div>}
                </div>
              )}

              <div className="dash-filtres mt-3" style={{ gridTemplateColumns: "160px 1fr" }}>
                <div><label htmlFor="cs-ordre">Ordre</label><input id="cs-ordre" type="number" className="form-control" value={ordre} onChange={(e) => setOrdre(e.target.value === "" ? 0 : Number(e.target.value))} /></div>
                <div className="d-flex align-items-end">
                  <div className="form-check mb-2">
                    <input id="cs-publie" type="checkbox" className="form-check-input" checked={publie} onChange={(e) => setPublie(e.target.checked)} />
                    <label htmlFor="cs-publie" className="form-check-label">Publié (si décoché, le site affiche le texte d'origine)</label>
                  </div>
                </div>
              </div>

              <p className="dash-sous" style={{ fontSize: ".78rem", color: taille > TAILLE_MAX ? "#f87171" : undefined }}>Taille : {taille.toLocaleString("fr-FR")} / {TAILLE_MAX.toLocaleString("fr-FR")} caractères</p>

              <div className="dash-barre-actions">
                <button type="button" className="dash-btn principal" disabled={!modifie || !!erreurJson || taille > TAILLE_MAX || envoi} onClick={sauver}>{envoi ? "Enregistrement…" : "Enregistrer"}</button>
                {defautChoix && <button type="button" className="dash-btn" onClick={remplirOriginal}>Remplir avec le texte d'origine</button>}
                {enregistre && <button type="button" className="dash-btn" style={{ color: "#f87171" }} onClick={supprimer}>Supprimer la version enregistrée</button>}
                {modifie && <span className="dash-tag orange align-self-center">Modifications non enregistrées</span>}
              </div>
            </>
          )}
        </section>
      </div>

      {nouvelle && (
        <Modale titre="Nouvelle section" envoi="Ouvrir" onSubmit={creer} onClose={() => setNouvelle(null)} erreur={nouvelle.erreur}>
          <p style={{ color: "#c9d6f5", fontSize: ".9rem" }}>Crée un contenu libre, que vous pourrez ensuite afficher sur une page. Utilisez des minuscules, des chiffres et des tirets.</p>
          <Champ id="ns-page" label="Page"><input id="ns-page" className="form-control" required placeholder="ex : accueil" value={nouvelle.page} onChange={(e) => setNouvelle({ ...nouvelle, page: e.target.value.toLowerCase() })} /></Champ>
          <Champ id="ns-section" label="Section" className="mb-4"><input id="ns-section" className="form-control" required placeholder="ex : annonce" value={nouvelle.section} onChange={(e) => setNouvelle({ ...nouvelle, section: e.target.value.toLowerCase() })} /></Champ>
        </Modale>
      )}
    </>
  );
}
