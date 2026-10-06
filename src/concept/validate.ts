import { PLANS, type Concept, type PlanName, type ThemeName } from "../../shared/types";
import { THEMES } from "./themes";

/** Tipo de bloco desenhado no layout de exemplo para cada tipo de secção. */
export type BlockKind =
  | "hero" | "split" | "cards" | "grid" | "mapa" | "contacto" | "lista" | "reserva"
  | "pessoas" | "citacoes" | "produtos" | "faq" | "passos" | "etiquetas";

export const BLOCOS: Record<string, BlockKind> = {
  hero: "hero", sobre: "split", quartos: "cards", galeria: "grid", experiencias: "cards", localizacao: "mapa", contactos: "contacto",
  menu: "lista", reservas: "reserva", servicos: "cards", precos: "lista", equipa: "pessoas", avaliacoes: "citacoes", catalogo: "produtos",
  destaques: "produtos", faq: "faq", portfolio: "grid", processo: "passos", marcacoes: "reserva", horarios: "lista", planos: "lista", zonas: "etiquetas",
};

const INFERE: Array<[RegExp, string]> = [
  [/^(hero|inicio|home|accueil|portada)/, "hero"], [/galer|gallery|foto/, "galeria"], [/portf/, "portfolio"], [/quarto|aloj|accommod|hebergement|room/, "quartos"],
  [/experi/, "experiencias"], [/localiz|location|ubicac|mapa|onde/, "localizacao"], [/contact/, "contactos"], [/menu|carta|ementa/, "menu"],
  [/reserv|booking|marcac|agend|cita|appoint|rendez/, "reservas"], [/horari|hours|horaires/, "horarios"], [/preco|pric|tarif|precio/, "precos"],
  [/plano|plan|abonn|member/, "planos"], [/equipa|team|equipe|equipo/, "equipa"], [/opini|review|avis|testemun/, "avaliacoes"],
  [/catalog|produt|product|shop|loja/, "catalogo"], [/destaq|highlight|nouveau|novedad/, "destaques"], [/faq|pergunt|question|preguntas/, "faq"],
  [/process|como trabalh|how we|etapa|step|travaillons|trabajamos/, "processo"], [/zona|area|zone/, "zonas"], [/servi/, "servicos"], [/sobre|about|propos|nosotros|histor|quem/, "sobre"],
];

/** Descobre o tipo de secção: usa `kind` se for conhecido, senão adivinha pelo título (modo IA). */
export function sectionKind(kind: unknown, title: unknown): string {
  if (typeof kind === "string" && Object.prototype.hasOwnProperty.call(BLOCOS, kind)) return kind;
  const t = String(title ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const [re, k] of INFERE) if (re.test(t)) return k;
  return "sobre";
}

const text = (v: unknown, max: number): string =>
  typeof v === "string" ? v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

/** Valida (outra vez, no browser) o que chega do motor local ou do servidor. Devolve null se for inválido. */
export function validateConcept(res: unknown): Concept | null {
  const c = (res as { concept?: Record<string, unknown> } | null)?.concept;
  if (!c || typeof c !== "object") return null;
  const raw = Array.isArray(c.sections) ? (c.sections as unknown[]) : [];
  const sections = raw
    .map((s) => (s && typeof s === "object" ? { title: text((s as Record<string, unknown>).title, 80), description: text((s as Record<string, unknown>).description, 260), kind: sectionKind((s as Record<string, unknown>).kind, (s as Record<string, unknown>).title) } : null))
    .filter((s): s is { title: string; description: string; kind: string } => !!s && !!s.title)
    .slice(0, 10);
  const plan = Object.prototype.hasOwnProperty.call(PLANS, c.recommendedPlan as string) ? (c.recommendedPlan as PlanName) : null;
  const out: Concept = {
    businessName: text(c.businessName, 90) || "Nome do negócio",
    businessType: text(c.businessType, 70),
    summary: text(c.summary, 450),
    objective: text(c.objective, 450),
    targetAudience: text(c.targetAudience, 350),
    sections,
    features: Array.isArray(c.features) ? (c.features as unknown[]).map((f) => text(f, 100)).filter(Boolean).slice(0, 10) : [],
    visualDirection: text(c.visualDirection, 450),
    headline: text(c.headline, 140),
    cta: text(c.cta, 50),
    recommendedPlan: plan ?? "Essencial",
    planReason: text(c.planReason, 360),
    theme: (Object.prototype.hasOwnProperty.call(THEMES, c.theme as string) ? c.theme : "generico") as ThemeName,
  };
  if (!plan || sections.length < 2 || !out.objective || !out.headline) return null;
  return out;
}
