import { useT } from "../i18n/context";
import { LogoMark } from "./Logo";

export function QuemSomos() {
  const t = useT();
  return (
    <section className="sec quem" id="quem-somos" aria-labelledby="h-quem">
      <div className="wrap quem-grid">
        <div className="quem-marca rv" aria-hidden="true">
          <LogoMark size={32} tag="#14101F" className="" />
          <div className="carimbo">
            <div>
              <b>€</b>
              <span>{t("Preço fechado")}</span>
            </div>
          </div>
        </div>
        <div className="rv">
          <h2 id="h-quem">
            <span className="tag lilas" aria-hidden="true">#05</span>
            {t("Quem está por trás da Bagatela?")}
          </h2>
          <p>{t("Somos uma equipa pequena, o que significa que cada projeto recebe atenção pessoal. Falas diretamente com quem faz o teu site, sem intermediários nem jargão técnico.")}</p>
          <ul className="cadeia">
            <li>
              <span>{t("Equipa pequena")}</span>
            </li>
            <li>
              <span>{t("Contacto direto")}</span>
            </li>
            <li>
              <span>{t("Menos burocracia")}</span>
            </li>
            <li>
              <span>{t("Preços mais acessíveis")}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
