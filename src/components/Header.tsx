import { useCallback, useState } from "react";
import { HTML_LANG, LANGS, langDir, type Lang } from "../i18n";
import { useLang, useT } from "../i18n/context";
import { useEscape } from "../hooks/useEscape";
import { FormLink } from "./Dialogs";
import { LogoMark } from "./Logo";

/** Ligações PT | EN | FR | ES relativas à página atual. */
export function LangSwitcher({ page = "" }: { page?: string }) {
  const t = useT();
  const current = useLang();
  const href = (l: Lang): string => {
    if (l === current) return `./${page}`;
    return `${current === "pt" ? "" : "../"}${langDir(l)}${page}`;
  };
  return (
    <div className="idiomas" role="group" aria-label={t("Idioma")}>
      {LANGS.map((l) => (
        <a key={l} href={href(l)} hrefLang={HTML_LANG[l]} lang={l} aria-current={l === current ? "true" : undefined}>{l.toUpperCase()}</a>
      ))}
    </div>
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
        <FormLink className="btn btn-damasco seta" href="#contacto">{t("Vamos falar")}</FormLink>
        <button type="button" className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={t("Abrir menu")} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </nav>
    </header>
  );
}
