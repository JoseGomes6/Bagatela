import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { App } from "./App";
import { NotFoundPage } from "./pages/NotFound";
import { PrivacyPage } from "./pages/Privacy";
import type { Lang } from "./i18n";

export const renderHome = (lang: Lang): string => renderToString(<App lang={lang} />);
export const renderPrivacy = (lang: Lang): string => renderToStaticMarkup(<PrivacyPage lang={lang} />);
export const renderNotFound = (): string => renderToStaticMarkup(<NotFoundPage />);
