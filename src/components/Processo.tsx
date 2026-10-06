import { useT } from "../i18n/context";

export function Processo() {
  const t = useT();
  return (
    <section className="sec" aria-labelledby="h-processo">
      <div className="wrap">
        <div className="sec-cab rv">
          <h2 id="h-processo">
            <span className="tag lilas" aria-hidden="true">#03</span>
            {t("Simples, do início ao fim.")}
          </h2>
          <p>{t("Três passos e o teu negócio está online. Acompanhamos tudo pessoalmente.")}</p>
        </div>
        <ol className="passos rv">
          <li>
            <h3>{t("Conversamos")}</h3>
            <p>{t("Conta-nos o que fazes e o que precisas. Uma chamada curta chega.")}</p>
          </li>
          <li>
            <h3>{t("Desenhamos")}</h3>
            <p>{t("Preparamos a primeira versão e ajustamos até ficar como queres.")}</p>
          </li>
          <li>
            <h3>{t("Publicamos")}</h3>
            <p>{t("O site fica online no teu domínio, registado no Google.")}</p>
          </li>
        </ol>
      </div>
    </section>
  );
}
