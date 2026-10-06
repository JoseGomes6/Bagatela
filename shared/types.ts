// Tipos e constantes partilhados entre o site (src/) e as funções serverless (api/).

export type PlanName = "Essencial" | "Negócio" | "Loja Online";
export const PLANS: Record<PlanName, number> = { "Essencial": 179, "Negócio": 299, "Loja Online": 599 };
export const PLAN_NAMES = Object.keys(PLANS) as PlanName[];

export type ThemeName =
  | "alojamento" | "restauracao" | "loja" | "beleza_saude" | "servicos"
  | "ginasio" | "profissional" | "criativo" | "generico";

/** Uma secção do site sugerido. `kind` indica o desenho no layout de exemplo. */
export interface ConceptSection {
  title: string;
  description: string;
  kind?: string;
}

/** Conceito de website: é só dados, nunca HTML nem código. */
export interface Concept {
  businessName: string;
  businessType: string;
  summary: string;
  objective: string;
  targetAudience: string;
  sections: ConceptSection[];
  features: string[];
  visualDirection: string;
  headline: string;
  cta: string;
  recommendedPlan: PlanName;
  planReason: string;
  /** Só para o layout de exemplo (paleta). */
  theme?: ThemeName;
}

export const DEFAULT_BUSINESS_NAME = "Nome do negócio";
