import { useEffect } from "react";

const prefersReducedMotion = (): boolean => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Entrada suave dos elementos `.rv` ao fazer scroll + contador dos preços (`.valor`).
 * É só um efeito visual: se falhar, o conteúdo continua visível (a classe `js` só esconde depois de ativa).
 */
export function useScrollEffects(): void {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    root.classList.add("js");

    // atraso em cascata para elementos lado a lado
    for (const sel of [".servicos-grid", ".galeria", ".planos"]) {
      const g = document.querySelector(sel);
      if (!g) continue;
      Array.from(g.children).forEach((el, i) => (el as HTMLElement).style.setProperty("--d", `${(i % 3) * 0.12}s`));
    }

    function countUp(el: Element) {
      const node = el.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      const target = parseInt(node.nodeValue ?? "", 10);
      if (Number.isNaN(target)) return;
      let t0: number | null = null;
      const step = (t: number) => {
        if (t0 === null) t0 = t;
        const k = 1 - Math.pow(1 - Math.min((t - t0) / 1100, 1), 3);
        node.nodeValue = `${Math.round(target * k)}€`;
        if (k < 1) requestAnimationFrame(step);
      };
      node.nodeValue = "0€";
      requestAnimationFrame(step);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("visivel");
          e.target.querySelectorAll(".valor").forEach(countUp);
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => { io.disconnect(); root.classList.remove("js"); };
  }, []);
}
