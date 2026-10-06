import { useEffect, useState } from "react";

/** Conta de 0 até `target` (ease-out). Começa com o valor final para o HTML pré-renderizado já ter o número certo. */
export function useCountUp(target: number, duration = 1600, delay = 600): number {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let timer = 0;
    setValue(0);
    timer = window.setTimeout(() => {
      let t0: number | null = null;
      const step = (t: number) => {
        if (t0 === null) t0 = t;
        const k = 1 - Math.pow(1 - Math.min((t - t0) / duration, 1), 3);
        setValue(Math.round(target * k));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return value;
}

/** Escreve `text` letra a letra. Começa com o texto completo (SEO/HTML estático) e anima depois de carregar. */
export function useTyped(text: string, delay = 900): string {
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let timer = 0;
    setShown("");
    const step = () => {
      i += 1;
      setShown(text.slice(0, i));
      if (i < text.length) timer = window.setTimeout(step, 70 + Math.random() * 60);
    };
    timer = window.setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);
  return shown;
}
