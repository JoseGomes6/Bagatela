import { useT } from "../i18n/context";
import { NICHES } from "../data/site";

export function Faixa() {
  const t = useT();
  return (
    <div className="faixa">
      <div className="wrap faixa-in">
        <p>{t("Fazemos sites para")}</p>
        <div className="marquee">
          <ul className="pista">{NICHES.map((n) => <li key={n}>{t(n)}</li>)}</ul>
          <ul className="pista" aria-hidden="true">{NICHES.map((n) => <li key={n}>{t(n)}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
