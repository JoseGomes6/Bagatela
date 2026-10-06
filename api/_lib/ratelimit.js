// Limite de pedidos simples, em memória.
// Numa plataforma serverless cada instância tem a sua memória, por isso isto trava
// abusos básicos mas não é um limite global rigoroso. Para um limite forte,
// trocar este módulo por Vercel KV / Upstash Redis (a interface mantém-se).

const hits = new Map(); // chave -> [timestamps]
let day = { key: "", count: 0 };

export function createLimiter({ perWindow = 5, windowMs = 60 * 60 * 1000, perDay = 400, now = () => Date.now() } = {}) {
  return {
    /** @returns {{ok:boolean, retryAfter?:number}} */
    check(key) {
      const t = now();
      const today = new Date(t).toISOString().slice(0, 10);
      if (day.key !== today) day = { key: today, count: 0 };
      if (day.count >= perDay) return { ok: false, retryAfter: 3600 };

      const list = (hits.get(key) || []).filter((x) => t - x < windowMs);
      if (list.length >= perWindow) {
        hits.set(key, list);
        return { ok: false, retryAfter: Math.ceil((windowMs - (t - list[0])) / 1000) };
      }
      list.push(t);
      hits.set(key, list);
      day.count += 1;

      // limpeza ocasional para a memória não crescer
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (!v.some((x) => t - x < windowMs)) hits.delete(k);
      }
      return { ok: true };
    },
    reset() {
      hits.clear();
      day = { key: "", count: 0 };
    },
  };
}
