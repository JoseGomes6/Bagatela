import { useState, type CSSProperties, type ReactNode } from "react";
import type { Concept, ConceptSection } from "../../shared/types";
import { useT } from "../i18n/context";
import { BLOCOS, sectionKind } from "./validate";
import { THEMES } from "./themes";

const Lines = ({ n, cls = "" }: { n: number; cls?: string }) => <>{Array.from({ length: n }, (_, i) => <span key={i} className={`pv-l${cls ? " " + cls : ""}`} />)}</>;
const Img = ({ cls = "" }: { cls?: string }) => <div className={`pv-img${cls ? " " + cls : ""}`} />;

function Cards({ n, title, cls = "", price = false }: { n: number; title: string; cls?: string; price?: boolean }) {
  return (
    <div className={`pv-cartoes${cls ? " " + cls : ""}`}>
      {Array.from({ length: n }, (_, i) => (
        <div className="pv-cartao" key={i}>
          <Img />
          <b>{title}</b>
          <Lines n={2} cls={i % 2 ? "curta" : ""} />
          {price && <em>€</em>}
        </div>
      ))}
    </div>
  );
}

function Block({ sec, c }: { sec: ConceptSection; c: Concept }) {
  const type = BLOCOS[sectionKind(sec.kind, sec.title)] ?? "split";
  if (type === "hero") {
    return (
      <section className="pv-sec pv-hero">
        <div className="pv-hero-texto">
          <small>{c.businessType}</small>
          <h5>{c.headline}</h5>
          <Lines n={2} cls="pv-claro" />
          {c.cta && <span className="pv-botao">{c.cta}</span>}
        </div>
        <Img cls="pv-img-grande" />
      </section>
    );
  }
  let body: ReactNode;
  switch (type) {
    case "split": body = <div className="pv-duas"><div><Lines n={4} /></div><Img /></div>; break;
    case "cards": body = <Cards n={3} title={sec.title} />; break;
    case "produtos": body = <Cards n={4} title={sec.title} cls="pv-4" price />; break;
    case "pessoas": body = <div className="pv-pessoas">{[0, 1, 2].map((i) => <div key={i}><i /><Lines n={1} cls="curta" /></div>)}</div>; break;
    case "grid": body = <div className="pv-grelha">{[0, 1, 2, 3, 4, 5].map((i) => <Img key={i} cls={i === 0 ? "pv-largo" : ""} />)}</div>; break;
    case "lista": body = <div className="pv-lista">{[0, 1, 2, 3].map((i) => <div key={i}><span className="pv-l" /><i /><b>€</b></div>)}</div>; break;
    case "mapa": body = <div className="pv-duas"><div className="pv-mapa" /><div><Lines n={3} /></div></div>; break;
    case "citacoes": body = <div className="pv-citacoes">{[0, 1].map((i) => <div key={i}><b>★★★★★</b><Lines n={2} /></div>)}</div>; break;
    case "faq": body = <div className="pv-faq">{[0, 1, 2].map((i) => <div key={i}><span className="pv-l" /><b>+</b></div>)}</div>; break;
    case "passos": body = <div className="pv-passos">{[1, 2, 3].map((i) => <div key={i}><b>{i}</b><Lines n={2} cls="curta" /></div>)}</div>; break;
    case "etiquetas": body = <div className="pv-etiquetas">{[0, 1, 2, 3, 4].map((i) => <span key={i} />)}</div>; break;
    default: body = <div className="pv-form"><span className="pv-campo" /><span className="pv-campo" /><span className="pv-campo" /><span className="pv-botao">{c.cta || "→"}</span></div>;
  }
  return (
    <section className={`pv-sec pv-${type}`}>
      <h6>{sec.title}</h6>
      {body}
    </section>
  );
}

/** Mockup do site sugerido, desenhado só com os dados do conceito (sem IA e sem imagens). */
export function LayoutPreview({ concept, name }: { concept: Concept; name: string }) {
  const t = useT();
  const [mobile, setMobile] = useState(false);
  const theme = THEMES[concept.theme ?? "generico"] ?? THEMES.generico;
  const vars = { "--pv-bg": theme.bg, "--pv-ink": theme.ink, "--pv-acc": theme.acc, "--pv-soft": theme.soft } as CSSProperties;
  const note = t("Ilustração do conceito. O design final é criado à medida para o teu negócio.");
  const hasHero = concept.sections[0]?.kind === "hero";

  return (
    <div className="pv-bloco">
      <div className="pv-controlos">
        <button type="button" className={`pv-modo${mobile ? "" : " ativo"}`} aria-pressed={!mobile} onClick={() => setMobile(false)}>{t("Computador")}</button>
        <button type="button" className={`pv-modo${mobile ? " ativo" : ""}`} aria-pressed={mobile} onClick={() => setMobile(true)}>{t("Telemóvel")}</button>
      </div>
      <div className={`pv-janela${mobile ? " movel" : ""}`} style={vars}>
        <div className="pv-barra"><i /><i /><i /><span className="pv-url">exemplo.pt</span></div>
        <div className="pv-pagina" role="img" aria-label={note} tabIndex={0}>
          <div className="pv">
            <div className="pv-nav">
              <b>{name}</b>
              <div className="pv-links">{concept.sections.slice(1, 5).map((s, i) => <span key={i}>{s.title}</span>)}</div>
              {concept.cta && <span className="pv-botao pv-mini">{concept.cta}</span>}
            </div>
            {!hasHero && <Block sec={{ kind: "hero", title: "Hero", description: "" }} c={concept} />}
            {concept.sections.map((s, i) => <Block key={i} sec={s} c={concept} />)}
            <div className="pv-rodape"><b>{name}</b><Lines n={1} cls="curta pv-claro" /></div>
          </div>
        </div>
      </div>
      <p className="pv-nota">{note}</p>
    </div>
  );
}
