import type { ThemeName } from "../../shared/types";

export interface Theme { bg: string; ink: string; acc: string; soft: string }

/** Paleta do layout de exemplo, por tipo de negócio. */
export const THEMES: Record<ThemeName, Theme> = {
  alojamento: { bg: "#F7F3EA", ink: "#2D2A24", acc: "#7C8F5A", soft: "#E9E1CF" },
  restauracao: { bg: "#FFF7EE", ink: "#3A2418", acc: "#C2512B", soft: "#F3DFC8" },
  loja: { bg: "#FAFAF7", ink: "#1B1B1B", acc: "#D1495B", soft: "#EFEDE6" },
  beleza_saude: { bg: "#FFF6F4", ink: "#4A2B33", acc: "#C97B84", soft: "#F6E1DE" },
  servicos: { bg: "#F2F6FA", ink: "#0F2A44", acc: "#E27D00", soft: "#DCE7F2" },
  ginasio: { bg: "#141414", ink: "#FFFFFF", acc: "#C6FF3D", soft: "#262626" },
  profissional: { bg: "#F6F7F9", ink: "#1C2430", acc: "#2F5D8C", soft: "#E5E9EF" },
  criativo: { bg: "#FFFFFF", ink: "#111111", acc: "#FF5C39", soft: "#F0F0F0" },
  generico: { bg: "#F7F2E9", ink: "#14101F", acc: "#6B46E5", soft: "#ECE6FF" },
};
