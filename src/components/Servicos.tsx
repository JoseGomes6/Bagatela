import { useT } from "../i18n/context";
import { SERVICES } from "../data/site";
import { LineIcon } from "./icons";

export function Servicos() {
  const t = useT();
  return (
    <section className="sec" id="servicos" aria-labelledby="h-servicos">
      <div className="wrap">
        <div className="sec-cab rv">
          <h2 id="h-servicos"><span className="tag lilas" aria-hidden="true">#01</span>{t("Tudo o que um bom site precisa.")}</h2>
          <p>{t("Tratamos da parte técnica do início ao fim. Fica com um site que trabalha por ti, mesmo quando a porta está fechada.")}</p>
        </div>
        <div className="servicos-grid">
          {SERVICES.map((s) => (
            <article className="servico rv" key={s.title}>
              <div className="ico"><LineIcon>{s.icon}</LineIcon></div>
              <h3>{t(s.title)}</h3>
              <p>{t(s.text)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
