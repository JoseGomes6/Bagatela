import { CONTACT } from "../config";
import { useT } from "../i18n/context";
import { FormLink } from "./Dialogs";

export function Contacto() {
  const t = useT();
  return (
    <section className="cta-final" id="contacto" aria-labelledby="h-contacto">
      <div className="wrap">
        <div className="cta-caixa rv">
          <div>
            <h2 id="h-contacto">{t("Vamos pôr o teu negócio online.")}</h2>
            <p>{t("Conta-nos o que precisas e entramos em contacto contigo. Sem compromisso.")}</p>
            <p className="contactos">
              {/* TELEFONE/WHATSAPP (desativado): <a href={`tel:${CONTACT.phone1Intl}`}>{CONTACT.phone1}</a> · <a href={`tel:${CONTACT.phone2Intl}`}>{CONTACT.phone2}</a><br /> */}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
          </div>
          <div className="acoes">
            <FormLink className="btn btn-damasco seta" href={`mailto:${CONTACT.email}`}>{t("Vamos fazer negócio")}</FormLink>
            {/* TELEFONE/WHATSAPP (desativado):
            <a className="btn btn-linha" href={CONTACT.whatsapp} rel="noopener">{t("Falar no WhatsApp")}</a>
            <a className="btn btn-linha" href={`tel:${CONTACT.phone1Intl}`}>{t("Ligar agora")}</a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
