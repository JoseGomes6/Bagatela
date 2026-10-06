// Metadados de SEO por página e idioma (título, descrição, hreflang, Open Graph e dados estruturados).
import { CONTACT } from "../src/config";
import { FAQS } from "../src/data/site";
import { HTML_LANG, LANGS, OG_LOCALE, SITE, absoluteUrl, translate, type Lang } from "../src/i18n";
import { PRIVACY } from "../src/i18n/privacy";
import { PLANS_DATA } from "../src/data/site";

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const TITLE = "Criação de Websites Low Cost em Portugal | Desde 179€ | Bagatela";
const DESCRIPTION = "Criamos websites profissionais, rápidos e otimizados para o Google para pequenos negócios em Portugal. Sites desde 179€, design à medida e online em poucos dias.";
const SHORT = "Sites à medida para pequenos negócios: rápidos, bonitos e prontos para o Google.";
const OG_ALT = "Bagatela, websites profissionais a preço de bagatela";
const ORG_DESC = "Criação de websites profissionais e low cost para pequenos negócios em Portugal.";

function hreflangs(page: string): string {
  const lines = LANGS.map((l) => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${absoluteUrl(l, page)}">`);
  lines.push(`<link rel="alternate" hreflang="x-default" href="${absoluteUrl("pt", page)}">`);
  return lines.join("\n");
}

function jsonLd(lang: Lang): string {
  const t = (s: string) => translate(lang, s);
  const langs = ["pt", "en", "fr", "es"];
  const org = {
    "@context": "https://schema.org", "@type": "ProfessionalService", name: "Bagatela", url: `${SITE}/`,
    logo: `${SITE}/favicon.svg`, image: `${SITE}/og-image.png`, description: t(ORG_DESC), areaServed: "PT",
    email: CONTACT.email, telephone: CONTACT.phone1Intl, priceRange: "179€ - 599€",
    address: { "@type": "PostalAddress", addressCountry: "PT" }, availableLanguage: langs,
    contactPoint: [CONTACT.phone1Intl, CONTACT.phone2Intl].map((telephone) => ({ "@type": "ContactPoint", telephone, contactType: "customer service", availableLanguage: langs })),
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Websites",
      itemListElement: [
        ...PLANS_DATA.map((p) => ({ "@type": "Offer", priceCurrency: "EUR", price: String(p.price), itemOffered: { "@type": "Service", name: t(p.name), description: t(p.summary) } })),
        { "@type": "Offer", priceCurrency: "EUR", price: "50", itemOffered: { "@type": "Service", name: t("Manutenção mensal"), description: t("Até 1 hora de alterações por mês (textos, fotos, preços)") } },
      ],
    },
  };
  const site = { "@context": "https://schema.org", "@type": "WebSite", name: "Bagatela", url: `${SITE}/`, inLanguage: ["pt-PT", "en", "fr", "es"] };
  const faq = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: t(f.q), acceptedAnswer: { "@type": "Answer", text: t(f.a) } })),
  };
  // "</" nunca aparece nos nossos textos, mas evitamos qualquer fecho de <script> por segurança
  return [org, site, faq].map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n");
}

/** <head> da página principal de um idioma. `prefix` leva à raiz do site ("" ou "../"). */
export function homeHead(lang: Lang, prefix: string): string {
  const t = (s: string) => translate(lang, s);
  const title = esc(t(TITLE));
  const alts = LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`).join("\n");
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${esc(t(DESCRIPTION))}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`,
    `<meta name="author" content="Bagatela">`,
    `<link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg">`,
    `<link rel="canonical" href="${absoluteUrl(lang)}">`,
    hreflangs(""),
    `<meta name="theme-color" content="#14101F">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
    alts,
    `<meta property="og:site_name" content="Bagatela">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${esc(t(SHORT))}">`,
    `<meta property="og:url" content="${absoluteUrl(lang)}">`,
    `<meta property="og:image" content="${SITE}/og-image.png">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(t(OG_ALT))}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${esc(t(SHORT))}">`,
    `<meta name="twitter:image" content="${SITE}/og-image.png">`,
    jsonLd(lang),
  ].join("\n");
}

export function privacyHead(lang: Lang, prefix: string): string {
  const P = PRIVACY[lang];
  return [
    `<title>${esc(P.title)} | Bagatela</title>`,
    `<meta name="robots" content="index, follow">`,
    `<link rel="canonical" href="${absoluteUrl(lang, "privacidade.html")}">`,
    hreflangs("privacidade.html"),
    `<link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg">`,
  ].join("\n");
}

export function sitemap(): string {
  const rows: string[] = [];
  for (const page of ["", "privacidade.html"]) {
    for (const l of LANGS) {
      const alts = LANGS.map((a) => `\n    <xhtml:link rel="alternate" hreflang="${HTML_LANG[a]}" href="${absoluteUrl(a, page)}"/>`).join("")
        + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl("pt", page)}"/>`;
      rows.push(`  <url>\n    <loc>${absoluteUrl(l, page)}</loc>${alts}\n  </url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${rows.join("\n")}\n</urlset>\n`;
}
