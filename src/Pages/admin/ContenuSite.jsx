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

/* Panneau de gauche : reste visible quand on fait défiler la page et défile seul s'il est trop long.
   Si le tableau de bord a son propre conteneur de défilement, diminuez "top" (ex. 16). */
const PANNEAU = {
  position: "sticky",
  top: 90,
  alignSelf: "start",
  maxHeight: "calc(100vh - 110px)",
  overflowY: "auto",
  overscrollBehavior: "contain",
};

const ENTETE_PAGE = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  padding: "10px 4px",
  background: "transparent",
  border: 0,
  borderBottom: "1px solid rgba(255,255,255,.08)",
  color: "inherit",
  textAlign: "left",
  cursor: "pointer",
};

const LISTE_SECTIONS = {
  margin: "8px 0 4px 6px",
  paddingLeft: 10,
  borderLeft: "2px solid rgba(232,118,31,.4)",
};

const SOUS_TITRE = { fontSize: ".76rem", fontWeight: 600, margin: "10px 0 6px" };

/* Menus du site, dans l'ordre de la barre de navigation (Navbar.jsx).
   "pages" = clés de page (celles de CATALOGUE dans contenusParDefaut.js) rangées sous ce menu.
   Quand vous branchez une nouvelle page (ex. "ecole"), ajoutez sa clé dans la liste du menu correspondant. */
const MENUS = [
  { cle: "accueil", libelle: "Accueil", pages: ["accueil"] },
  { cle: "ecole", libelle: "École", pages: ["ecole"] },
  { cle: "formations", libelle: "Formations", pages: ["fullstack", "cybersecurite", "metiers-informatique"] },
  { cle: "alternance", libelle: "Alternance", pages: ["alternance"] },
  { cle: "entreprises", libelle: "Entreprises", pages: ["entreprises"] },
  { cle: "documentation", libelle: "Documentation", pages: ["documentation"] },
  { cle: "contact", libelle: "Nous contacter", pages: ["contact"] },
];
const menuDe = (page) => MENUS.find((m) => m.pages.includes(page))?.cle || "autres";

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
  // Menus dépliés dans le panneau de gauche (le premier est ouvert au départ)
  const [ouverts, setOuverts] = useState({ [MENUS[0].cle]: true });

  const basculer = (page) => setOuverts((o) => ({ ...o, [page]: !o[page] }));

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
    setOuverts((x) => ({ ...x, [menuDe(page)]: true }));
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

  // Sections créées par l'admin (absentes du catalogue). Une section « Nouvelle » encore non enregistrée y figure aussi.
  const virtuelle = choix && !connu(choix) && !existants[`${choix.page}/${choix.section}`]
    ? [{ page: choix.page, section: choix.section, virtuelle: true }]
    : [];
  const autres = [...Object.values(existants).filter((c) => !connu(c)), ...virtuelle];
  // Pages qui ne figurent dans aucun menu (créées par l'admin) : rangées dans « Autres pages »
  const pagesHorsMenu = [...new Set(autres.map((c) => c.page).filter((pg) => !MENUS.some((m) => m.pages.includes(pg))))];

  // Une page avec ses sections du catalogue, ses sections ajoutées et ses compteurs
  const decrirePage = (pg) => {
    const p = catalogue.find((x) => x.page === pg);
    const sections = p?.sections || [];
    const extras = autres.filter((c) => c.page === pg);
    const nbModifies = sections.filter(([s]) => existants[`${pg}/${s}`]).length + extras.filter((c) => existants[`${c.page}/${c.section}`]).length;
    return { page: pg, libelle: p?.libelle || pg, sections, extras, total: sections.length + extras.length, nbModifies };
  };

  const etat = (page, section) => {
    const c = existants[`${page}/${section}`];
    return !c ? ["gris", "Original"] : c.publie ? ["vert", "Modifié"] : ["orange", "Non publié"];
  };
  const etatAutre = (c) => (c.virtuelle ? ["orange", "Nouveau"] : etat(c.page, c.section));

  const pageChoisie = choix && catalogue.find((p) => p.page === choix.page);
  const libelleSection = pageChoisie?.sections.find(([s]) => s === choix.section)?.[1] || choix?.section;

  const creer = (e) => {
    e.preventDefault();
    if (!SLUG.test(nouvelle.page) || !SLUG.test(nouvelle.section)) return setNouvelle({ ...nouvelle, erreur: "Utilisez uniquement des minuscules, des chiffres et des tirets (50 caractères maximum)." });
    const { page, section } = nouvelle;
    setNouvelle(null);
    ouvrir(page, section, existants);
  };

  /* Une ligne de section dans le panneau */
  const ligne = (page, section, libelle, [couleur, texte]) => {
    const actif = choix?.page === page && choix?.section === section;
    return (
      <button
        type="button"
        key={`${page}/${section}`}
        className={`dash-conv${actif ? " actif" : ""}`}
        style={{ marginBottom: 6, padding: "9px 12px" }}
        aria-current={actif ? "true" : undefined}
        onClick={() => selectionner(page, section)}
      >
        <span className="texte"><strong style={{ fontSize: ".85rem" }}>{libelle}</strong></span>
        <span className={`dash-tag ${couleur}`}>{texte}</span>
      </button>
    );
  };

  /* Les sections d'une page ; le nom de la page n'est affiché que si le menu en regroupe plusieurs */
  const bloc = (p, avecTitre) => (
    <div key={p.page}>
      {avecTitre && <p className="dash-sous" style={SOUS_TITRE}>{p.libelle}</p>}
      {p.sections.map(([s, libelle]) => ligne(p.page, s, libelle, etat(p.page, s)))}
      {p.extras.map((c) => ligne(c.page, c.section, c.section, etatAutre(c)))}
    </div>
  );

  /* Un groupe = un menu du site, repliable, avec toutes ses sections en dessous */
  const groupe = (cle, libelle, total, nbModifies, contientChoix, enfants) => {
    const ouvert = !!ouverts[cle];
    return (
      <div key={cle} className="mb-2">
        <button
          type="button"
          style={ENTETE_PAGE}
          aria-expanded={ouvert}
          aria-controls={`groupe-${cle}`}
          onClick={() => basculer(cle)}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span aria-hidden="true" style={{ display: "inline-block", transition: "transform .15s", transform: ouvert ? "rotate(90deg)" : "none", color: "#e8761f" }}>›</span>
            <strong style={{ fontSize: ".92rem", color: contientChoix ? "#e8761f" : undefined }}>{libelle}</strong>
          </span>
          <span className="dash-sous" style={{ fontSize: ".75rem", whiteSpace: "nowrap", margin: 0 }}>{total ? `${nbModifies}/${total} modifiée${nbModifies > 1 ? "s" : ""}` : "à venir"}</span>
        </button>
        {ouvert && <div id={`groupe-${cle}`} style={LISTE_SECTIONS}>{enfants}</div>}
      </div>
    );
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
        <aside className="dash-carte" style={PANNEAU} aria-label="Pages et sections du site">
          {MENUS.map((m) => {
            const pages = m.pages.map(decrirePage);
            const total = pages.reduce((n, p) => n + p.total, 0);
            const nbModifies = pages.reduce((n, p) => n + p.nbModifies, 0);
            return groupe(
              m.cle,
              m.libelle,
              total,
              nbModifies,
              !!choix && m.pages.includes(choix.page),
              total === 0
                ? <p className="dash-sous" style={{ fontSize: ".78rem" }}>Aucune section modifiable pour le moment.</p>
                : pages.map((p) => bloc(p, m.pages.length > 1))
            );
          })}

          {pagesHorsMenu.length > 0 && (() => {
            const pages = pagesHorsMenu.map(decrirePage);
            return groupe(
              "autres",
              "Autres pages",
              pages.reduce((n, p) => n + p.total, 0),
              pages.reduce((n, p) => n + p.nbModifies, 0),
              !!choix && pagesHorsMenu.includes(choix.page),
              pages.map((p) => bloc(p, true))
            );
          })()}
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