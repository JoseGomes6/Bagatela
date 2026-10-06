import { useT } from "../i18n/context";
import { LogoMark } from "./Logo";

export function Footer() {
  const t = useT();
  return (
    <footer>
      <div className="wrap">
        <p className="assinatura">{t("Porque ter um bom site não devia ser um luxo.")}</p>
        <a className="logo" href="./" aria-label={t("Bagatela, página inicial")}>
          <LogoMark size={28} />
          Bagatela
        </a>
        <nav aria-label={t("Rodapé")}>
          <a href="#servicos">{t("Serviços")}</a>
          <a href="#precos">{t("Preços")}</a>
          <a href="#quem-somos">{t("Quem somos")}</a>
          <a href="privacidade.html">{t("Privacidade")}</a>
          {/* LIVRO DE RECLAMAÇÕES (desativado: ainda sem empresa registada): <a href="https://www.livroreclamacoes.pt" rel="noopener" target="_blank">{t("Livro de Reclamações")}</a> */}
        </nav>
        <p>{t("© 2026 Bagatela. Criação de websites em Portugal.")}</p>
      </div>
    </footer>
  );
}
