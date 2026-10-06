import { useEffect, useState } from "react";
import { CONCEPT_API } from "../config";

declare global { interface Window { BAGATELA_API?: string } }

/** "local" | "off" | URL da API ("" = mesmo domínio). Pode ser sobreposto no browser com window.BAGATELA_API (testes). */
export function useConceptMode(): string {
  const [mode, setMode] = useState(CONCEPT_API);
  useEffect(() => { if (typeof window.BAGATELA_API === "string") setMode(window.BAGATELA_API); }, []);
  return mode;
}
