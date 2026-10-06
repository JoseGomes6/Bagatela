import fs from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { BOT_QA, EXTRAS, FAQS, MAINTENANCE_FEATURES, NICHES, PLANS_DATA, PROJECTS, SERVICES } from "../src/data/site";
import { TRANSLATIONS } from "../src/i18n/translations";
import { PRIVACY } from "../src/i18n/privacy";
import { translate } from "../src/i18n";

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? sourceFiles(path.join(dir, e.name)) : /\.(tsx?|ts)$/.test(e.name) ? [path.join(dir, e.name)] : []));
}

/** Textos passados a t("...") nos componentes + textos dos dados (listas de serviços, planos, FAQ...). */
function usedKeys(): Set<string> {
  const keys = new Set<string>();
  for (const f of sourceFiles(path.resolve(__dirname, "../src"))) {
    if (f.includes("i18n/")) continue;
    const src = fs.readFileSync(f, "utf8");
    for (const m of src.matchAll(/\bt\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g)) keys.add(JSON.parse(`"${m[1]}"`));
  }
  for (const s of SERVICES) { keys.add(s.title); keys.add(s.text); }
  for (const n of NICHES) keys.add(n);
  for (const p of PROJECTS) { keys.add(p.category); keys.add(p.description); }
  for (const p of PLANS_DATA) {
    for (const k of [p.name, p.description, p.summary, p.delivery, p.cta, p.tag, p.badge]) if (k) keys.add(k);
    p.features.forEach((f) => keys.add(f));
  }
  MAINTENANCE_FEATURES.forEach((f) => keys.add(f));
  for (const [a, b] of EXTRAS) { keys.add(a); if (/[a-zA-Zç]/.test(b)) keys.add(b); }
  [...FAQS, ...BOT_QA].forEach((x) => { keys.add(x.q); keys.add(x.a); });
  return keys;
}

// Textos que são iguais em todos os idiomas (nomes, preços ou exemplos em português) e por isso não têm tradução.
const SAME_EVERYWHERE = new Set(["Google Maps", "E-commerce", "FAQ", "Hero", "40€", "79€", "49€"]);

test("todos os textos usados no site têm tradução em EN, FR e ES", () => {
  const missing = [...usedKeys()].filter((k) => !TRANSLATIONS[k] && !SAME_EVERYWHERE.has(k));
  expect(missing).toEqual([]);
});

test("nenhuma tradução está vazia e as chaves do dicionário não são lixo", () => {
  for (const [pt, tr] of Object.entries(TRANSLATIONS)) {
    expect(pt.length).toBeGreaterThan(0);
    for (const v of tr) expect(v.trim().length, pt).toBeGreaterThan(0);
  }
});

test("translate: PT devolve o original; sem tradução devolve o original", () => {
  expect(translate("pt", "Quero o meu site")).toBe("Quero o meu site");
  expect(translate("en", "Quero o meu site")).toBe("I want my website");
  expect(translate("fr", "texto sem tradução")).toBe("texto sem tradução");
});

test("política de privacidade existe nos 4 idiomas com as mesmas secções", () => {
  const n = PRIVACY.pt.sections.length;
  for (const l of ["en", "fr", "es"] as const) expect(PRIVACY[l].sections.length).toBe(n);
});
