import { useCallback, useEffect, useRef, useState } from "react";
import { HTML_LANG, LANGS, LANG_NAME, langDir, type Lang } from "../i18n";
import { useLang, useT } from "../i18n/context";
import { useEscape } from "../hooks/useEscape";
import { FormLink } from "./Dialogs";
import { LogoMark } from "./Logo";

/** Seletor de idioma (lista pendente). As ligações existem sempre no HTML (SEO); só ficam escondidas até abrir. */
export function LangSwitcher({ page = "" }: { page?: string }) {
  const t = useT();
  const current = useLang();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);
  const href = (l: Lang): string => {
    if (l === current) return `./${page}`;
    return `${current === "pt" ? "" : "../"}${langDir(l)}${page}`;
  };
  return (
    <div className="idiomas" ref={box}>
      <button type="button" className="idioma-btn" aria-haspopup="true" aria-expanded={open} aria-label={`${t("Idioma")}: ${LANG_NAME[current]}`} onClick={() => setOpen((o) => !o)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>
        <span>{current.toUpperCase()}</span>
        <svg className="seta-idioma" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <ul className="idioma-menu" hidden={!open}>
        {LANGS.map((l) => (
          <li key={l}>
            <a href={href(l)} hrefLang={HTML_LANG[l]} lang={l} aria-current={l === current ? "true" : undefined}>{LANG_NAME[l]}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Botão claro/escuro. Os dois ícones existem sempre; o CSS mostra o certo conforme `data-theme` (sem diferenças na hidratação). */
export function ThemeToggle() {
  const t = useT();
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("bagatela-theme", next); } catch { /* sem armazenamento: só vale nesta visita */ }
  }
  return (
    <button type="button" className="tema-btn" onClick={toggle} aria-label={t("Alterar entre modo claro e escuro")} title={t("Alterar entre modo claro e escuro")}>
      <svg className="lua" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" /></svg>
      <svg className="sol" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </button>
  );
}

export function Header() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEscape(open, close);

  return (
    <header>
      <nav className="wrap nav" aria-label={t("Navegação principal")}>
        <a className="logo" href="./" aria-label={t("Bagatela, página inicial")}>
          <LogoMark size={32} />
          Bagatela
        </a>
        <ul className={`nav-links${open ? " aberto" : ""}`} id="nav-links" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) close(); }}>
          <li><a href="#servicos">{t("Serviços")}</a></li>
          <li><a href="#exemplos">{t("Exemplos")}</a></li>
          <li><a href="#precos">{t("Preços")}</a></li>
          <li><a href="#quem-somos">{t("Quem somos")}</a></li>
          <li><a href="#faq">{t("Perguntas")}</a></li>
        </ul>
        <LangSwitcher />
        <ThemeToggle />
        <FormLink className="btn btn-damasco seta" href="#contacto">{t("Vamos falar")}</FormLink>
        <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={t("Abrir menu")} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </nav>
    </header>
  );
}
