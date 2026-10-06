import type { Concept } from "../../shared/types";
import type { Lang } from "../i18n";
import { gerar } from "./engine";
import { validateConcept } from "./validate";

export type ConceptErrorCode = "negocio" | "rate" | "pausa";
export class ConceptError extends Error {
  constructor(public code: ConceptErrorCode) { super(code); }
}

/** Modo local: regras no browser. Lança ConceptError("negocio") se o texto não parecer um negócio. */
export function generateLocal(description: string, lang: Lang): Concept {
  const c = validateConcept({ concept: gerar(description, lang) });
  if (!c) throw new ConceptError("negocio");
  return c;
}

/** Modo IA: pede ao servidor; se o servidor falhar, usa as regras locais (plano B). */
export async function generateWithApi(base: string, description: string, lang: Lang, hp: string, signal?: AbortSignal): Promise<Concept> {
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/api/generate-concept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descricao: description, lang, hp }),
      signal,
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    const c = res.status === 200 ? validateConcept(json) : null;
    if (c) return c;
    if (res.status === 429) throw new ConceptError("rate");
    if (json.error === "not_business" || json.error === "too_short") throw new ConceptError("negocio");
    throw new ConceptError("pausa");
  } catch (err) {
    if (err instanceof ConceptError && err.code !== "pausa") throw err;
    return generateLocal(description, lang); // plano B
  }
}
