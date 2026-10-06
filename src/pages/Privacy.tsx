import { HTML_LANG, LANGS, LANG_NAME, langDir, type Lang } from "../i18n";
import { PRIVACY } from "../i18n/privacy";

/** Política de privacidade (página estática, sem JavaScript). O texto é nosso e fixo, por isso pode conter ligações em HTML. */
export function PrivacyPage({ lang }: { lang: Lang }) {
  const P = PRIVACY[lang];
  const href = (l: Lang) => (l === lang ? "privacidade.html" : `${lang === "pt" ? "" : "../"}${langDir(l)}privacidade.html`);
  return (
    <>
      <header>
        <div className="w">
          <a href="./">{P.back}</a>
          <div className="ferr">
            <details className="sw">
              <summary aria-label={`${P.langLabel}: ${LANG_NAME[lang]}`}>{lang.toUpperCase()}</summary>
              <ul>
                {LANGS.map((l) => <li key={l}><a href={href(l)} hrefLang={HTML_LANG[l]} lang={l} aria-current={l === lang ? "true" : undefined}>{LANG_NAME[l]}</a></li>)}
              </ul>
            </details>
            <button type="button" id="tema" className="tema" aria-label={P.themeLabel} title={P.themeLabel}>
              <svg className="lua" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" /></svg>
              <svg className="sol" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            </button>
          </div>
        </div>
      </header>
      <main className="w">
        <h1>{P.title}</h1>
        <p className="d">{P.updated}</p>
        {P.sections.map(([title, html]) => (
          <div key={title}>
            <h2>{title}</h2>
            <p dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        ))}
      </main>
    </>
  );
}
