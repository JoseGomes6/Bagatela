import { useState, type FormEvent } from "react";
import { PLANS, type Concept } from "../../shared/types";
import { useLang, useT } from "../i18n/context";
import { submitToFormSubmit } from "../lib/forms";
import { Modal } from "../components/Modal";

/** Texto do e-mail para a equipa (sempre em português). */
export function buildBriefing(d: { nome: string; email: string; telefone: string; empresa: string }, description: string, c: Concept, lang: string): string {
  const L: string[] = ["NOVO LEAD — BAGATELA AI", ""];
  L.push(`Nome: ${d.nome}`, `Email: ${d.email}`, `Telefone: ${d.telefone || "-"}`, `Empresa: ${d.empresa || "-"}`, `Idioma do site: ${lang}`, "");
  L.push("Descrição original:", description, "", "Conceito gerado:");
  L.push(`Negócio: ${c.businessName}${c.businessType ? ` (${c.businessType})` : ""}`, `Objetivo: ${c.objective}`);
  if (c.targetAudience) L.push(`Público: ${c.targetAudience}`);
  L.push("Estrutura:");
  c.sections.forEach((s, k) => L.push(`  ${String(k + 1).padStart(2, "0")} — ${s.title}${s.description ? `: ${s.description}` : ""}`));
  if (c.features.length) { L.push("Funcionalidades:"); c.features.forEach((f) => L.push(`  • ${f}`)); }
  L.push(`Direção visual: ${c.visualDirection}`, `Headline: ${c.headline}`, `CTA: ${c.cta}`, "");
  L.push("Plano recomendado:", `${c.recommendedPlan} — ${PLANS[c.recommendedPlan]}€`, `Motivo: ${c.planReason}`);
  return L.join("\n");
}

type Status = "idle" | "sending" | "ok" | "error" | "invalid";

export function LeadDialog({ open, onClose, concept, description }: { open: boolean; onClose: () => void; concept: Concept | null; description: string }) {
  const t = useT();
  const lang = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const [bad, setBad] = useState<{ nome?: boolean; email?: boolean }>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const d = { nome: String(f.get("nome") ?? "").trim(), email: String(f.get("email") ?? "").trim(), telefone: String(f.get("telefone") ?? "").trim(), empresa: String(f.get("empresa") ?? "").trim() };
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email);
    setBad({ nome: !d.nome, email: !okEmail });
    if (!d.nome || !okEmail || !concept) { setStatus("invalid"); return; }
    setStatus("sending");
    const out = new FormData();
    out.append("_subject", "NOVO LEAD — BAGATELA AI");
    out.append("_captcha", "false"); out.append("_template", "table");
    out.append("_honey", String(f.get("_honey") ?? ""));
    out.append("nome", d.nome); out.append("email", d.email);
    out.append("telefone", d.telefone || "-"); out.append("empresa", d.empresa || "-");
    out.append("plano_recomendado", `${concept.recommendedPlan} — ${PLANS[concept.recommendedPlan]}€`);
    out.append("briefing", buildBriefing(d, description, concept, lang));
    if (await submitToFormSubmit(out)) {
      setStatus("ok"); form.reset();
      setTimeout(() => { onClose(); setStatus("idle"); }, 3200);
    } else setStatus("error");
  }

  return (
    <Modal id="lead-dlg" open={open} onClose={() => { onClose(); setStatus("idle"); }} labelledBy="lead-tit">
      <form className="dlg-form" method="dialog" noValidate onSubmit={onSubmit} id="lead-form">
        <button type="button" className="fechar-dlg" aria-label={t("Fechar")} onClick={onClose}>×</button>
        <h2 id="lead-tit">{t("Gostaste do conceito?")}</h2>
        <p className="sub">{t("Deixa-nos os teus dados e a equipa Bagatela entra em contacto contigo. O conceito vai incluído no pedido.")}</p>
        <label>{t("Nome")}<input name="nome" required autoComplete="name" className={bad.nome ? "invalido" : undefined} /></label>
        <label>{t("E-mail")}<input name="email" type="email" required autoComplete="email" className={bad.email ? "invalido" : undefined} /></label>
        <label>{t("Telefone (opcional)")}<input name="telefone" type="tel" autoComplete="tel" /></label>
        <label>{t("Empresa / negócio (opcional)")}<input name="empresa" autoComplete="organization" /></label>
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="mel" aria-hidden="true" />
        <p className="aviso">{t("Ao enviar aceitas a nossa")} <a href="privacidade.html" target="_blank" rel="noreferrer">{t("política de privacidade")}</a>.</p>
        <p className={`estado${status === "ok" ? " ok" : status === "error" || status === "invalid" ? " erro" : ""}`} role="status" aria-live="polite">
          {status === "sending" && t("A enviar...")}
          {status === "ok" && t("Pedido enviado! Entramos em contacto contigo em breve.")}
          {status === "invalid" && t("Preenche o nome e um e-mail válido.")}
          {status === "error" && t("Não foi possível enviar agora. Escreve-nos para geral@bagatela.pt ou liga 917 385 546.")}
        </p>
        <button className="btn btn-damasco seta" type="submit" disabled={status === "sending"}>{t("Enviar pedido")}</button>
      </form>
    </Modal>
  );
}
