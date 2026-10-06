import { createContext, useContext, useMemo, type ReactNode } from "react";
import { baseFor, makeT, type Lang, type TFunction } from "./index";

interface I18n { lang: Lang; t: TFunction; base: string }
const Ctx = createContext<I18n>({ lang: "pt", t: (s) => s, base: "" });

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<I18n>(() => ({ lang, t: makeT(lang), base: baseFor(lang) }), [lang]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useI18n = (): I18n => useContext(Ctx);
export const useT = (): TFunction => useContext(Ctx).t;
export const useLang = (): Lang => useContext(Ctx).lang;
/** Prefixo para chegar à raiz do site a partir da página atual ("" ou "../"). */
export const useBase = (): string => useContext(Ctx).base;
