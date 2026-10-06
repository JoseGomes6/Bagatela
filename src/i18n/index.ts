import { TRANSLATIONS } from "./translations";

export type Lang = "pt" | "en" | "fr" | "es";
export const LANGS: readonly Lang[] = ["pt", "en", "fr", "es"] as const;
export const LANG_INDEX: Record<Exclude<Lang, "pt">, 0 | 1 | 2> = { en: 0, fr: 1, es: 2 };
export const HTML_LANG: Record<Lang, string> = { pt: "pt-PT", en: "en", fr: "fr", es: "es" };
export const OG_LOCALE: Record<Lang, string> = { pt: "pt_PT", en: "en_GB", fr: "fr_FR", es: "es_ES" };
export const SITE = "https://www.bagatela.pt";

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANGS as readonly string[]).includes(v);
}

/** Traduz um texto escrito em português. Em PT (ou se faltar tradução) devolve o próprio texto. */
export function translate(lang: Lang, pt: string): string {
  if (lang === "pt") return pt;
  const row = TRANSLATIONS[pt];
  return row ? row[LANG_INDEX[lang]] : pt;
}

export type TFunction = (pt: string) => string;
export const makeT = (lang: Lang): TFunction => (pt) => translate(lang, pt);

/** Caminho relativo de uma página (ex.: "es/", "") para a raiz do site. */
export const langDir = (lang: Lang): string => (lang === "pt" ? "" : `${lang}/`);
export const baseFor = (lang: Lang): string => (lang === "pt" ? "" : "../");
export const absoluteUrl = (lang: Lang, page = ""): string => `${SITE}/${langDir(lang)}${page}`;
