import { useCallback, useEffect, useRef, useState } from "react";
// import { CONTACT } from "../config"; // TELEFONE/WHATSAPP (desativado)
import { BOT_QA } from "../data/site";
import { useEscape } from "../hooks/useEscape";
import { useT } from "../i18n/context";
import { useDialogs } from "./Dialogs";

interface Msg { who: "b" | "u"; text: string }

/** Assistente com respostas pré-definidas (sem IA, sem custos). */
export function Bot() {
  const t = useT();
  const { openContact } = useDialogs();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [current, setCurrent] = useState(-1);
  const started = useRef(false);
  const timers = useRef<number[]>([]);
  const msgsEl = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => { setOpen(false); toggleBtn.current?.focus(); }, []);
  useEscape(open, close);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { msgsEl.current?.scrollTo({ top: msgsEl.current.scrollHeight }); }, [msgs]);

  function toggle() {
    if (open) { close(); return; }
    setOpen(true);
    if (!started.current) { started.current = true; setMsgs([{ who: "b", text: t("Olá! Sou o assistente da Bagatela. Em que posso ajudar?") }]); }
    setTimeout(() => closeBtn.current?.focus(), 0);
  }

  function ask(i: number) {
    setCurrent(i);
    setMsgs((m) => [...m, { who: "u", text: t(BOT_QA[i].q) }]);
    timers.current.push(window.setTimeout(() => setMsgs((m) => [...m, { who: "b", text: t(BOT_QA[i].a) }]), 350));
  }

  return (
    <aside className="bot" id="bot" aria-label={t("Assistente")}>
      <button type="button" className="bot-btn" aria-expanded={open} aria-controls="bot-painel" aria-label={t("Abrir assistente")} ref={toggleBtn} onClick={toggle}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
          <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
        </svg>
      </button>
      <div className="bot-painel" id="bot-painel" role="dialog" aria-labelledby="bot-tit" hidden={!open}>
        <div className="bot-cab">
          <b id="bot-tit">{t("Assistente Bagatela")}</b>
          <button type="button" className="bot-x" aria-label={t("Fechar")} ref={closeBtn} onClick={close}>×</button>
        </div>
        <div className="bot-msgs" aria-live="polite" ref={msgsEl}>
          {msgs.map((m, i) => <p key={i} className={m.who}>{m.text}</p>)}
        </div>
        <p className="bot-etq">{t("Escolhe uma pergunta")}</p>
        <div className="bot-opcoes">
          {started.current && BOT_QA.map((qa, i) => (i === current ? null : <button type="button" key={qa.q} onClick={() => ask(i)}>{t(qa.q)}</button>))}
        </div>
        <div className="bot-acoes">
          {started.current && (
            <>
              <span className="sep">{t("Preferes falar com uma pessoa?")}</span>
              <button type="button" className="acao" onClick={() => { setOpen(false); openContact(); }}>{t("Preencher formulário")}</button>
              {/* TELEFONE/WHATSAPP (desativado): <button type="button" className="acao" onClick={() => window.open(CONTACT.whatsapp, "_blank", "noopener")}>{t("Falar no WhatsApp")}</button> */}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
