import type { CSSProperties, ReactNode } from "react";
import { DEFAULT_BUSINESS_NAME, PLANS, type Concept } from "../../shared/types";
import { useT } from "../i18n/context";
import { LayoutPreview } from "./LayoutPreview";

const idx = (i: number) => ({ "--i": i }) as CSSProperties;

function Block({ title, i, cls, children }: { title: string; i: number; cls?: string; children: ReactNode }) {
  return (
    <section className={`cg-bloco${cls ? " " + cls : ""}`} style={idx(i)}>
      <h4>{title}</h4>
      {children}
    </section>
  );
}

/** A "ficha" do conceito: mini apresentação do projeto, layout de exemplo e plano recomendado. */
export function ConceptResult({ concept: c, number, onAdvance, onRestart }: { concept: Concept; number: string; onAdvance: () => void; onRestart: () => void }) {
  const t = useT();
  const name = c.businessName === DEFAULT_BUSINESS_NAME ? t("Nome do negócio") : c.businessName;
  const plan = c.recommendedPlan;
  let i = 0;

  return (
    <article className="cg-ficha">
      <div className="cg-cab">
        <span className="tag lilas">✦ {t("Conceito Bagatela")} #{number}</span>
        <h3 className="cg-nome">{name}</h3>
        {c.businessType && <p className="cg-tipo">{c.businessType}</p>}
        {c.summary && <p className="cg-resumo">{c.summary}</p>}
      </div>

      <div className="cg-grelha">
        <Block title={t("O objetivo")} i={i++}><p>{c.objective}</p></Block>
        {c.targetAudience && <Block title={t("Para quem")} i={i++}><p>{c.targetAudience}</p></Block>}
        <Block title={t("Estrutura sugerida")} i={i++} cls="cg-estrutura">
          <ol className="cg-lista-sec">
            {c.sections.map((s, k) => (
              <li key={k}>
                <b>{String(k + 1).padStart(2, "0")}</b>
                <span><strong>{s.title}</strong>{s.description && <small>{s.description}</small>}</span>
              </li>
            ))}
          </ol>
        </Block>
        {c.features.length > 0 && (
          <Block title={t("Funcionalidades")} i={i++}>
            <ul className="cg-lista-fn">{c.features.map((f, k) => <li key={k}>{f}</li>)}</ul>
          </Block>
        )}
        {c.visualDirection && <Block title={t("Direção visual")} i={i++}><p>{c.visualDirection}</p></Block>}
        <Block title={t("Headline sugerida")} i={i++} cls="cg-headline">
          <blockquote>“{c.headline}”</blockquote>
          {c.cta && <span className="cg-cta-mock">{c.cta}</span>}
        </Block>
      </div>

      <section className="cg-layout" style={idx(i++)}>
        <h4>{t("Layout de exemplo")}</h4>
        <LayoutPreview concept={c} name={name} />
      </section>

      <div className="cg-plano" style={idx(i++)}>
        <div className="cg-plano-esq">
          <span className="tag">{t("A Bagatela recomenda")}</span>
          <h4>{t("Plano")} {t(plan)}</h4>
          <p className="cg-preco">{PLANS[plan]}€</p>
        </div>
        <div className="cg-plano-dir">
          <p className="cg-motivo">{c.planReason || t("Este plano é o mais indicado para o que descreveste.")}</p>
          <p className="cg-gostaste">{t("Gostaste do conceito?")}</p>
          <button type="button" className="btn btn-damasco seta" onClick={onAdvance}>{t("Quero avançar")}</button>
        </div>
      </div>

      <div className="cg-rodape">
        <p>{t("Este é apenas o ponto de partida. A equipa Bagatela transforma este conceito num website real.")}</p>
        <div className="cg-rodape-acoes">
          <a className="btn btn-escuro seta" href="#contacto">{t("Quero transformar isto num site")}</a>
          <button type="button" className="cg-link" onClick={onRestart}>{t("Criar outro conceito")}</button>
        </div>
      </div>
    </article>
  );
}
