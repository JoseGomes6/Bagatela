import { useRef } from "react";
import { useT } from "../i18n/context";
import { useCountUp, useTyped } from "../hooks/useAnimatedNumber";
import { useParallax } from "../hooks/useParallax";
import { FormLink } from "./Dialogs";

export function Hero() {
  const t = useT();
  const palco = useRef<HTMLDivElement>(null);
  useParallax(palco);
  const score = useCountUp(98);
  const url = useTyped("cafeaurora.pt");
  return (
    <section className="hero" aria-labelledby="h1">
      <div className="wrap hero-grid">
        <div className="hero-texto">
          <p className="pill">
            <b className="tag">{t("Desde 179€")}</b> {t("Sites online em poucos dias")}
          </p>
          <h1 id="h1">
            {t("Websites profissionais.")} <span className="tipo">{t("A preços de bagatela.")}</span>
          </h1>
          <p className="lead">{t("Sites à medida para pequenos negócios: rápidos, bonitos no telemóvel e prontos para o Google. Sem jargão técnico, sem agência cara e sem surpresas na fatura.")}</p>
          <div className="acoes">
            <FormLink className="btn btn-damasco seta" href="#contacto">{t("Quero o meu site")}</FormLink>
            <a className="btn btn-linha seta" href="#precos">{t("Quanto custa esta bagatela?")}</a>
          </div>
          <ul className="garantias">
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {t("Sem mensalidades obrigatórias")}
            </li>
            <li>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {t("Domínio .pt incluído")}
            </li>
          </ul>
        </div>
        <div className="palco" aria-hidden="true" ref={palco}>
          <div className="carimbo">
            <div>
              <b>€</b>
              <span>{t("Preço fechado")}</span>
            </div>
          </div>
          <div className="selo-pagespeed">
            <div className="anel">
              <span id="score">{score}</span>
            </div>
            <div>
              <strong>{t("Velocidade")}</strong>
              <small>Google PageSpeed</small>
            </div>
          </div>
          <div className="browser">
            <div className="barra">
              <i />
              <i />
              <i />
              <em className="url">
                <span id="url-txt">{url}</span>
                <span className="cursor" />
              </em>
            </div>
            <div className="site-ex">
              <div className="topo">
                <span>Café Aurora</span>
                <span className="menu">
                  <span>Menu</span>
                  <span>Horário</span>
                  <span>Contacto</span>
                </span>
              </div>
              <div className="ban">
                <div>
                  <h4>Pastelaria fresca todas as manhãs</h4>
                  <p>Pequenos-almoços, bolos por encomenda e o melhor galão do bairro.</p>
                  <span className="cta">Ver menu</span>
                </div>
                <div className="foto" />
              </div>
              <div className="cartoes">
                <div>Pequeno-almoço</div>
                <div>Bolos</div>
                <div>Encomendas</div>
              </div>
            </div>
          </div>
          <div className="telemovel">
            <div className="ecra">
              <b>Café Aurora</b>
              <div className="foto" />
              <div className="l" />
              <div className="l c" />
              <div className="bt" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
