import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { App } from "../src/App";
import { LANGS, type Lang } from "../src/i18n";
import { gerar } from "../src/concept/engine";
import { validateConcept, sectionKind } from "../src/concept/validate";

const html = (lang: Lang) => renderToString(<App lang={lang} />);

test("a página principal renderiza em todos os idiomas (SEO) com o conteúdo traduzido", () => {
  const h1: Record<Lang, string> = { pt: "Websites profissionais.", en: "Professional websites.", fr: "Des sites web professionnels.", es: "Sitios web profesionales." };
  for (const lang of LANGS) {
    const out = html(lang);
    expect(out, lang).toContain(h1[lang]);
    expect(out).toContain('id="servicos"');
    expect(out).toContain('id="conceito"');
    expect(out).toContain('id="precos"');
    expect(out).toContain("299€");
    expect(out).toContain('id="bot"');
    if (lang !== "pt") expect(out, lang).not.toContain("Websites profissionais.");
  }
});

test("os 3 planos e os preços aparecem e o plano Negócio é o recomendado", () => {
  const out = html("pt");
  for (const price of ["179€", "299€", "599€", "50€"]) expect(out).toContain(price);
  expect(out).toMatch(/plano top/);
});

test("o seletor de idioma aponta para as outras versões", () => {
  expect(html("pt")).toContain('href="en/"');
  expect(html("fr")).toContain('href="../es/"');
});

test("o layout de exemplo usa só os dados do conceito", () => {
  const c = validateConcept({ concept: gerar("Tenho um restaurante chamado Sabor da Terra em Faro e quero mostrar o menu e reservas.", "pt") });
  expect(c).not.toBeNull();
  expect(c?.businessName).toBe("Sabor da Terra");
  expect(c?.theme).toBe("restauracao");
});

test("validateConcept: rejeita lixo e plano inválido; infere o tipo de secção pelo título", () => {
  expect(validateConcept(null)).toBeNull();
  expect(validateConcept({ concept: { recommendedPlan: "VIP" } })).toBeNull();
  expect(sectionKind(undefined, "Galeria")).toBe("galeria");
  expect(sectionKind(undefined, "Gallery")).toBe("galeria");
  expect(sectionKind("hero", "qualquer")).toBe("hero");
  expect(sectionKind(undefined, "???")).toBe("sobre");
});
