import { useBase, useT } from "../i18n/context";
import { PROJECTS } from "../data/site";

export function Projetos() {
  const t = useT();
  const base = useBase();
  return (
    <section className="sec exemplos" id="exemplos" aria-labelledby="h-exemplos">
      <div className="wrap">
        <div className="sec-cab rv">
          <h2 id="h-exemplos"><span className="tag lilas" aria-hidden="true">#02</span>{t("Um estilo para cada negócio.")}</h2>
          <p>{t("Nada de modelos iguais para todos. Abre os exemplos e vê como cada site é desenhado à volta do negócio. São projetos conceito, criados por nós para mostrar o que fazemos.")}</p>
        </div>
        <div className="galeria">
          {PROJECTS.map((p, i) => (
            <article className="ex rv" key={p.slug}>
              <div className={`mini ${p.mini}`} aria-hidden="true">
                <span className="t">{p.name}</span>
                <span className="l" /><span className="l c" /><span className="b" />
                <div className="blocos"><span /><span /><span /></div>
              </div>
              <p className="ex-id"><span>BAGATELA #{String(i + 1).padStart(3, "0")}</span><i>{t("Conceito")}</i></p>
              <h3>{p.name}</h3>
              <p className="ex-meta"><span>{t(p.category)}</span> · Website / Design</p>
              <p>{t(p.description)}</p>
              <a className="ver-ex" href={`${base}exemplos/${p.slug}.html`}>{t("Ver exemplo")}</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
