import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "../Context/AuthContext";

export default function useEntreprise() {
  const { user } = useAuth();
  const cle = `entreprise_${user.id}`;
  const [id, setId] = useState(() => localStorage.getItem(cle) || "");
  const [liste, setListe] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api("/entreprises").then(setListe).catch((e) => { setErreur(e.message); setListe([]); });
  }, []);

  const choisir = useCallback((nouvelId) => {
    if (nouvelId) localStorage.setItem(cle, nouvelId); else localStorage.removeItem(cle);
    setId(nouvelId);
  }, [cle]);

  return { liste: liste || [], pret: liste !== null, entreprise: (liste || []).find((e) => e._id === id) || null, choisir, erreur };
}
