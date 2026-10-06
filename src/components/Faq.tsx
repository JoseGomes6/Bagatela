import { useT } from "../i18n/context";
import { FAQS } from "../data/site";
import { FormLink } from "./Dialogs";
import { PlusIcon } from "./icons";

export function Faq() {
  const t = useT();
  return (
    <section className="sec" id="faq" aria-labelledby="h-faq">
      <div className="wrap faq-grid rv">
        <div className="lado">
          <h2 id="h-faq"><span className="tag lilas">{t("Perguntas frequentes")}</span>{t("Antes de perguntar…")}</h2>
          <p>{t("Não encontras a resposta?")} <FormLink href="#contacto">{t("Fala connosco")}</FormLink>{t(", respondemos rapidamente.")}</p>
        </div>
        <div>
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>{t(f.q)}<span className="mais" aria-hidden="true"><PlusIcon /></span></summary>
              <p>{t(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
