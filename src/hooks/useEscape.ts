import { useEffect } from "react";

/** Chama `handler` quando se carrega em Esc (só enquanto `active`). */
export function useEscape(active: boolean, handler: () => void): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handler(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, handler]);
}
