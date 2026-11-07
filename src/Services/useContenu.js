import { useEffect, useState } from "react";
import { api, ORIGINE } from "./api";
import { CONTENUS_PAR_DEFAUT } from "./contenusParDefaut";

// Fusion : les valeurs enregistrées remplacent les valeurs d'origine ; une liste est remplacée en entier
export const fusionner = (defaut, valeur) => {
  if (valeur === undefined || valeur === null) return defaut;
  if (Array.isArray(defaut) || Array.isArray(valeur)) return Array.isArray(valeur) ? valeur : defaut;
  if (defaut && typeof defaut === "object" && typeof valeur === "object") {
    const sortie = { ...defaut };
    Object.keys(valeur).forEach((k) => { sortie[k] = fusionner(defaut[k], valeur[k]); });
    return sortie;
  }
  return valeur;
};

// Les images téléversées sont servies par l'API ; les autres sont dans le dossier public du site
export const urlImage = (chemin) => (!chemin ? "" : chemin.startsWith("/uploads/") ? `${ORIGINE}${chemin}` : chemin);

// Contenus d'une page : texte d'origine, remplacé par ce que l'administrateur a enregistré
export function useContenuPage(page) {
  const defauts = CONTENUS_PAR_DEFAUT[page] || {};
  const [contenus, setContenus] = useState(defauts);

  useEffect(() => {
    let actif = true;
    api(`/contenus/${page}`)
      .then((r) => {
        if (!actif) return;
        const fusion = { ...defauts };
        Object.keys(r.sections || {}).forEach((s) => { fusion[s] = fusionner(defauts[s], r.sections[s]); });
        setContenus(fusion);
      })
      .catch(() => {}); // en cas d'erreur, le texte d'origine reste affiché
    return () => { actif = false; };
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  return contenus;
}
