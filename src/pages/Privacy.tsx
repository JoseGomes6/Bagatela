import { HTML_LANG, LANGS, langDir, type Lang } from "../i18n";
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
          <div className="sw">
            {LANGS.map((l) => <a key={l} href={href(l)} hrefLang={HTML_LANG[l]} lang={l} aria-current={l === lang ? "true" : undefined}>{l.toUpperCase()}</a>)}
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
