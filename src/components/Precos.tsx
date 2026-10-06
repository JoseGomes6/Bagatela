import { useT } from "../i18n/context";
import { EXTRAS, MAINTENANCE_FEATURES, PLANS_DATA, type Plan } from "../data/site";
import { FormLink } from "./Dialogs";
import { CheckIcon, PlusIcon } from "./icons";

function PlanCard({ plan }: { plan: Plan }) {
  const t = useT();
  return (
    <details className={`rv plano${plan.top ? " top" : ""}`}>
      <summary>
        {plan.badge && <span className="etq tag">{t(plan.badge)}</span>}
        {plan.tag && <span className="tag creme">{t(plan.tag)}</span>}
        <h3>{t(plan.name)}</h3>
        <p className="desc">{t(plan.description)}</p>
        <p className="valor">{`${plan.price}€`}<small>{t("pagamento único")}</small></p>
        <p className="resumo">{t(plan.summary)}</p>
        <span className="ver">
          <span><span className="abrir">{t("Ver o que está incluído")}</span><span className="fechar">{t("Esconder detalhes")}</span></span>
          <span className="mais" aria-hidden="true"><PlusIcon /></span>
        </span>
      </summary>
      <div className="conteudo">
        <ul>{plan.features.map((f) => <li key={f}><CheckIcon />{t(f)}</li>)}</ul>
        <p className="prazo">{t("Entrega:")} <b>{t(plan.delivery)}</b></p>
        <FormLink className={`btn ${plan.top ? "btn-damasco" : "btn-contorno"} seta`} href="#contacto" servico={plan.id}>{t(plan.cta)}</FormLink>
      </div>
    </details>
  );
}

export function Precos() {
  const t = useT();
  return (
    <section className="sec precos" id="precos" aria-labelledby="h-precos">
      <div className="wrap">
        <div className="sec-cab rv">
          <h2 id="h-precos"><span className="tag lilas" aria-hidden="true">#04</span>{t("Preços claros, sem letras pequenas.")}</h2>
          <p>{t("Pagamento único pelo site. Toca num plano para ver tudo o que está incluído.")}</p>
        </div>
        <div className="planos">{PLANS_DATA.map((p) => <PlanCard key={p.id} plan={p} />)}</div>
        <p className="dica">{t("Domínio e alojamento incluídos no 1.º ano em todos os planos.")}</p>

        <div className="manutencao rv">
          <div>
            <span className="opc">{t("Opcional")}</span>
            <h3>{t("Manutenção mensal")}</h3>
            <p className="valor">{"50€"}<small>{t("/mês")}</small></p>
            <p>{t("Para quem quer o site sempre atualizado sem se preocupar com nada. Sem fidelização, cancelas quando quiseres.")}</p>
          </div>
          <ul>{MAINTENANCE_FEATURES.map((f) => <li key={f}><CheckIcon />{t(f)}</li>)}</ul>
        </div>

        <div className="extras rv">
          <h3>{t("Extras e renovações")}</h3>
          <p>{t("Acrescenta só o que precisas, quando precisares.")}</p>
          <div className="tabela-wrap">
            <table>
              <thead><tr><th scope="col">{t("Serviço")}</th><th scope="col">{t("Preço")}</th></tr></thead>
              <tbody>{EXTRAS.map(([name, price]) => <tr key={name}><td>{t(name)}</td><td>{t(price)}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
