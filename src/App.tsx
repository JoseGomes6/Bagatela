import { Bot } from "./components/Bot";
import { Contacto } from "./components/Contacto";
import { DialogsProvider } from "./components/Dialogs";
import { Faixa } from "./components/Faixa";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Precos } from "./components/Precos";
import { Processo } from "./components/Processo";
import { Projetos } from "./components/Projetos";
import { QuemSomos } from "./components/QuemSomos";
import { Servicos } from "./components/Servicos";
import { ConceptGenerator } from "./concept/ConceptGenerator";
import { useScrollEffects } from "./hooks/useScrollEffects";
import { I18nProvider } from "./i18n/context";
import type { Lang } from "./i18n";

function HomePage() {
  useScrollEffects();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Faixa />
        <Servicos />
        <Projetos />
        <Processo />
        <ConceptGenerator />
        <Precos />
        <QuemSomos />
        <Faq />
        <Contacto />
      </main>
      <Footer />
      <Bot />
    </>
  );
}

/** Página principal (um idioma). O mesmo componente é pré-renderizado no build e "hidratado" no browser. */
export function App({ lang }: { lang: Lang }) {
  return (
    <I18nProvider lang={lang}>
      <DialogsProvider>
        <HomePage />
      </DialogsProvider>
    </I18nProvider>
  );
}
