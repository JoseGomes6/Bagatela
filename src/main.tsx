import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { isLang, type Lang } from "./i18n";
import "./styles/site.css";

const root = document.getElementById("root");
if (root) {
  const attr = root.getAttribute("data-lang");
  const lang: Lang = isLang(attr) ? attr : "pt";
  // Em produção o HTML já vem pré-renderizado (hidratar); em desenvolvimento a raiz está vazia (renderizar).
  if (root.hasChildNodes()) hydrateRoot(root, <App lang={lang} />);
  else createRoot(root).render(<App lang={lang} />);
}
