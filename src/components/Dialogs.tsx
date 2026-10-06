import { createContext, useCallback, useContext, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useLang, useT } from "../i18n/context";
import { CONTACT } from "../config";
import { submitToFormSubmit } from "../lib/forms";
import { Modal } from "./Modal";

interface DialogsApi { openContact: (servico?: string) => void }
const Ctx = createContext<DialogsApi>({ openContact: () => undefined });
export const useDialogs = (): DialogsApi => useContext(Ctx);

/** Opções do formulário: o valor é sempre em português (é o que chega ao e-mail da equipa). */
const SERVICE_OPTIONS = ["Essencial (179€)", "Negócio (299€)", "Loja Online (599€)", "Manutenção mensal (50€/mês)", "Outro / Não sei ainda"] as const;
const FROM_PLAN: Record<string, string> = { "Essencial": "Essencial (179€)", "Negócio": "Negócio (299€)", "Loja Online": "Loja Online (599€)" };

export function DialogsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState("");
  const openContact = useCallback((s?: string) => { setService(FROM_PLAN[s ?? ""] ?? ""); setOpen(true); }, []);
  const api = useMemo(() => ({ openContact }), [openContact]);
  return (
    <Ctx.Provider value={api}>
      {children}
      <ContactDialog open={open} onClose={() => setOpen(false)} service={service} setService={setService} />
    </Ctx.Provider>
  );
}

/** Ligação que abre o formulário de contacto (com o plano já escolhido, se existir). */
export function FormLink({ servico, onClick, children, ...rest }: { servico?: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { openContact } = useDialogs();
  return (
    <a {...rest} onClick={(e) => { onClick?.(e); e.preventDefault(); openContact(servico); }}>
      {children}
    </a>
  );
}

type Status = { kind: "idle" | "sending" | "ok" | "error" | "invalid"; };

function ContactDialog({ open, onClose, service, setService }: { open: boolean; onClose: () => void; service: string; setService: (v: string) => void }) {
  const t = useT();
  const lang = useLang();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const bad: Record<string, boolean> = {};
    for (const name of ["nome", "contacto", "servico", "mensagem"]) if (!String(data.get(name) ?? "").trim()) bad[name] = true;
    setInvalid(bad);
    if (Object.keys(bad).length) { setStatus({ kind: "invalid" }); return; }
    setStatus({ kind: "sending" });
    const ok = await submitToFormSubmit(data);
    if (ok) {
      setStatus({ kind: "ok" });
      form.reset(); setService("");
      setTimeout(() => { onClose(); setStatus({ kind: "idle" }); }, 2800);
    } else setStatus({ kind: "error" });
  }

  const cls = (n: string) => (invalid[n] ? "invalido" : undefined);
  return (
    <Modal id="form-dlg" open={open} onClose={onClose} labelledBy="form-tit">
      <form className="dlg-form" id="form-contacto" method="post" noValidate onSubmit={onSubmit}>
        <button type="button" className="fechar-dlg" aria-label={t("Fechar")} onClick={onClose}>×</button>
        <h2 id="form-tit">{t("Conta-nos o que precisas")}</h2>
        <p className="sub">{t("Preenche e entramos em contacto contigo.")}</p>
        <label>{t("Nome")}<input name="nome" required autoComplete="name" className={cls("nome")} /></label>
        <label>{t("Empresa")}<input name="empresa" autoComplete="organization" /></label>
        <label>{t("E-mail ou telefone")}<input name="contacto" required autoComplete="email" className={cls("contacto")} /></label>
        <label>
          {t("Tipo de serviço")}
          <select name="servico" id="f-servico" required value={service} onChange={(e) => setService(e.target.value)} className={cls("servico")}>
            <option value="">{t("Escolhe uma opção")}</option>
            {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{t(o)}</option>)}
          </select>
        </label>
        <label>{t("Mensagem")}<textarea name="mensagem" rows={4} required placeholder={t("O que gostavas de fazer?")} className={cls("mensagem")} /></label>
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="mel" aria-hidden="true" />
        <input type="hidden" name="_subject" value="Novo contacto pelo site Bagatela" readOnly />
        <input type="hidden" name="_captcha" value="false" readOnly />
        <input type="hidden" name="idioma" value={lang} readOnly />
        <input type="hidden" name="_template" value="table" readOnly />
        <p className="aviso">{t("Ao enviar aceitas a nossa")} <a href="privacidade.html" target="_blank" rel="noreferrer">{t("política de privacidade")}</a>.</p>
        <p className={`estado${status.kind === "ok" ? " ok" : status.kind === "error" || status.kind === "invalid" ? " erro" : ""}`} role="status" aria-live="polite">
          {status.kind === "sending" && t("A enviar...")}
          {status.kind === "ok" && t("Mensagem enviada. Entramos em contacto contigo em breve!")}
          {status.kind === "invalid" && t("Preenche os campos obrigatórios.")}
          {status.kind === "error" && (<>{t("Não foi possível enviar. Escreve-nos para")} <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>{/* TELEFONE/WHATSAPP (desativado): aqui ia a frase "ou liga <telefone>." (ver comentários em translations.ts) */}</>)}
        </p>
        <button className="btn btn-damasco" type="submit" disabled={status.kind === "sending"}>{t("Enviar mensagem")}</button>
      </form>
    </Modal>
  );
}
