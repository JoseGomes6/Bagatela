import type { SVGProps } from "react";

const base = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function CheckIcon({ size = 16, width = 2.6, ...p }: SVGProps<SVGSVGElement> & { size?: number; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={width} {...base} {...p}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={2.6} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/** Ícone desenhado com um ou mais elementos SVG (24x24, traço 1.8). */
export function LineIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" strokeWidth={1.8} {...base}>
      {children}
    </svg>
  );
}
