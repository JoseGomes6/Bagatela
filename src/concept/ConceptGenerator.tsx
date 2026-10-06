import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Concept } from "../../shared/types";
import { useLang, useT } from "../i18n/context";
import { ConceptError, generateLocal, generateWithApi } from "./generate";
import { ConceptResult } from "./ConceptResult";
import { LeadDialog } from "./LeadDialog";
import { useConceptMode } from "./useConceptMode";

const MIN = 50;
const MAX = 1000;
const MIN_LOADING_MS = 1600;

const EXAMPLES = {
  alojamento: { label: "Alojamento local", text: "Tenho um pequeno alojamento local com quatro quartos e piscina. Queremos mostrar o espaço, as fotografias e permitir que os clientes entrem em contacto para reservar." },
  restaurante: { label: "Restaurante", text: "Tenho um restaurante. Queremos mostrar o menu, o horário e a localização, e deixar as pessoas reservar mesa pelo site." },
  loja: { label: "Loja de roupa", text: "Tenho uma loja de roupa feminina e quero começar a vender online. Preciso de mostrar o catálogo, ter carrinho de compras e aceitar pagamentos por MB WAY e cartão." },
} as const;
type ExampleKey = keyof typeof EXAMPLES;

const PHRASES = ["A ler a tua ideia…", "A desenhar a estrutura do site…", "A escolher o plano certo…", "A dar-lhe um toque de bagatela…"];

type Phase = "intro" | "loading" | "result";

function nextNumber(): string {
  let n = 1;
  try {
    n = (parseInt(sessionStorage.getItem("bagatela_conceito_n") ?? "", 10) || 0) + 1;
    sessionStorage.setItem("bagatela_conceito_n", String(n));
  } catch { /* sem sessionStorage */ }
  return String(n).padStart(3, "0");
}

/** Secção "Conta-nos a tua ideia": descrição -> conceito de website (ideia, a pensar, resultado). */
export function ConceptGenerator() {
  const t = useT();
  const lang = useLang();
  const mode = useConceptMode();
  const [phase, setPhase] = useState<Phase>("intro");
  const [text, setText] = useState("");
  const [hp, setHp] = useState("");
  const [error, setError] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [result, setResult] = useState<{ concept: Concept; description: string; number: string } | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const trimmed = text.trim().length;
  const missing = MIN - trimmed;

  useEffect(() => {
    if (phase !== "loading") return;
    setPhraseIdx(0);
    const id = window.setInterval(() => setPhraseIdx((i) => i + 1), 2400);
    return () => clearInterval(id);
  }, [phase]);

  const submit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    const description = text.trim();
    if (description.length < MIN) { setError(t("Escreve pelo menos 50 caracteres para a Bagatela perceber o teu negócio.")); textRef.current?.focus(); return; }
    setError("");
    setPhase("loading");
    const started = Date.now();
    try {
      const concept = mode === "local" ? generateLocal(description, lang) : await generateWithApi(mode, description, lang, hp);
      await new Promise((r) => setTimeout(r, Math.max(0, MIN_LOADING_MS - (Date.now() - started)))); // a animação não "pisca"
      setResult({ concept, description, number: nextNumber() });
      setPhase("result");
    } catch (err) {
      const code = err instanceof ConceptError ? err.code : "pausa";
      setError(code === "rate" ? t("Calma, estás a ir depressa demais! Espera um pouco e tenta outra vez.")
        : code === "negocio" ? t("Não conseguimos perceber o negócio a partir deste texto. Conta-nos um pouco mais sobre o que fazes.")
        : t("Parece que a Bagatela está a fazer uma pausa para café ☕. Tenta novamente daqui a pouco."));
      setPhase("intro");
    }
  }, [text, mode, lang, hp, t]);

  // foco e scroll quando muda de estado
  useEffect(() => {
    if (phase === "result") {
      resultRef.current?.focus({ preventScroll: true });
      resultRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }, [phase]);
  useEffect(() => { if (phase === "intro" && error) textRef.current?.focus(); }, [phase, error]);

  const restart = () => { setPhase("intro"); setTimeout(() => { textRef.current?.focus(); sectionRef.current?.scrollIntoView({ block: "start" }); }, 0); };
  const fillExample = (k: ExampleKey) => {
    const v = t(EXAMPLES[k].text);
    setText(v); setError("");
    setTimeout(() => { textRef.current?.focus(); textRef.current?.setSelectionRange(v.length, v.length); }, 0);
  };

  const enter = (p: Phase) => (phase === p ? "cg-entra" : undefined);
  const helpClass = missing > 0 ? "cg-ajuda" : "cg-ajuda ok";
  const help = missing > 0 ? (trimmed === 0 ? t("Escreve pelo menos 50 caracteres para a Bagatela perceber o teu negócio.") : t("Faltam {n} caracteres").replace("{n}", String(missing))) : t("Já dá para trabalhar!");

  return (
    <section className="sec conceito" id="conceito" aria-labelledby="h-conceito" hidden={mode === "off"} ref={sectionRef}>
      <div className="wrap">
        <div className="cg rv" aria-busy={phase === "loading"}>
          {phase === "intro" && (
            <div className={`cg-intro ${enter("intro") ?? ""}`} id="cg-intro">
              <div className="cg-texto-intro">
                <span className="tag lilas">{t("Não sabes por onde começar?")}</span>
                <h2 id="h-conceito">{t("Conta-nos a tua ideia.")}</h2>
                <p>{t("Descreve o teu negócio e deixa a Bagatela imaginar o website ideal para ti.")}</p>
                <p className="cg-nota">{t("A Bagatela transforma-a num conceito de website.")}</p>
                <div className="cg-ex">
                  <small>{t("Precisas de inspiração?")}</small>
                  {(Object.keys(EXAMPLES) as ExampleKey[]).map((k) => (
                    <button type="button" key={k} data-ex-btn={k} onClick={() => fillExample(k)}>{t(EXAMPLES[k].label)}</button>
                  ))}
                </div>
                <span className="cg-estrela e1" aria-hidden="true">✦</span>
                <span className="cg-estrela e2" aria-hidden="true">✦</span>
              </div>
              <form className="cg-form" id="cg-form" noValidate onSubmit={submit}>
                <div className="cg-form-topo">
                  <label className="cg-label" htmlFor="cg-texto">{t("O teu negócio")}</label>
                  <textarea id="cg-texto" name="descricao" maxLength={MAX} rows={7} ref={textRef} value={text}
                    placeholder={t("Ex: Tenho um restaurante e quero mostrar o menu e receber reservas…")} aria-describedby="cg-ajuda cg-contador"
                    onChange={(e) => { setText(e.target.value); setError(""); }} />
                  <input type="text" id="cg-hp" name="website" tabIndex={-1} autoComplete="off" className="mel" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
                </div>
                <div className="cg-furo" aria-hidden="true" />
                <div className="cg-form-base">
                  {error && <p className="cg-erro" id="cg-erro" role="alert">{error}</p>}
                  <div className="cg-meta">
                    <span className={helpClass} id="cg-ajuda">{help}</span>
                    <span className={`cg-contador${text.length >= MAX - 40 ? " cheio" : ""}`} id="cg-contador">{text.length} / {MAX}</span>
                  </div>
                  <button className="btn btn-damasco" id="cg-enviar" type="submit" disabled={trimmed < MIN}>{t("Criar o meu conceito ✦")}</button>
                </div>
              </form>
            </div>
          )}

          {phase === "loading" && (
            <div className={`cg-loading ${enter("loading") ?? ""}`} id="cg-loading" role="status" aria-live="polite">
              <div className="cg-anim" aria-hidden="true">
                <span className="cg-estrela l1">✦</span><span className="cg-estrela l2">✦</span><span className="cg-estrela l3">✦</span>
                <svg className="cg-etiq" viewBox="0 0 80 110" width="120" height="165">
                  <path d="M40 0v22" stroke="#14101F" strokeWidth="2.5" fill="none" />
                  <path fillRule="evenodd" d="M22 22h22l22 20v52a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8V30a8 8 0 0 1 8-8zM44 26a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fill="#6B46E5" />
                  <rect x="26" y="50" width="6" height="30" rx="3" fill="#F7F2E9" />
                  <circle cx="42" cy="72" r="8" fill="none" stroke="#FFD84D" strokeWidth="6" />
                </svg>
              </div>
              <p className="cg-titulo-loading">{t("A Bagatela está a pensar…")}</p>
              <p className="cg-frase cg-fade" id="cg-frase" key={phraseIdx}>{t(PHRASES[phraseIdx % PHRASES.length])}</p>
            </div>
          )}

          {phase === "result" && result && (
            <div className={`cg-resultado ${enter("result") ?? ""}`} id="cg-resultado" tabIndex={-1} ref={resultRef}>
              <ConceptResult concept={result.concept} number={result.number} onAdvance={() => setLeadOpen(true)} onRestart={restart} />
            </div>
          )}
        </div>
      </div>
      <LeadDialog open={leadOpen} onClose={() => setLeadOpen(false)} concept={result?.concept ?? null} description={result?.description ?? ""} />
    </section>
  );
}
