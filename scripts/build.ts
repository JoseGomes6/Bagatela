// Gera o site estático: bundle (Vite) + HTML pré-renderizado por idioma (SEO) + sitemap.
//   npm run build        -> dist/
//   npm run build:site   -> dist/ e copia para a raiz do repositório (GitHub Pages "Deploy from a branch")
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import { LANGS, HTML_LANG, baseFor, langDir, type Lang } from "../src/i18n";
import { homeHead, privacyHead, sitemap } from "./seo";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const publish = process.argv.includes("--publish");

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600;700&family=Geist:wght@400;500;600&display=swap" rel="stylesheet">`;

async function main() {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.rmSync(ssrDir, { recursive: true, force: true });

  // 1) bundle do browser
  await build({
    root, configFile: false, base: "./", plugins: [react()], logLevel: "warn",
    build: { outDir: dist, emptyOutDir: true, manifest: true, rollupOptions: { input: path.join(root, "src/main.tsx") } },
  });
  // 2) bundle para pré-renderizar (Node)
  await build({
    root, configFile: false, plugins: [react()], logLevel: "warn",
    build: { ssr: path.join(root, "src/entry-server.tsx"), outDir: ssrDir, emptyOutDir: true, rollupOptions: { output: { entryFileNames: "entry-server.mjs", format: "es" } } },
  });
  const server = (await import(pathToFileURL(path.join(ssrDir, "entry-server.mjs")).href)) as {
    renderHome: (l: Lang) => string; renderPrivacy: (l: Lang) => string; renderNotFound: () => string;
  };

  const manifest = JSON.parse(fs.readFileSync(path.join(dist, ".vite/manifest.json"), "utf8")) as Record<string, { file: string; css?: string[] }>;
  const entry = manifest["src/main.tsx"];
  const write = (rel: string, html: string) => {
    const file = path.join(dist, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  };

  // 3) páginas principais (4 idiomas)
  for (const lang of LANGS) {
    const prefix = baseFor(lang);
    const css = (entry.css ?? []).map((c) => `<link rel="stylesheet" href="${prefix}${c}">`).join("\n");
    const html = `<!doctype html>
<html lang="${HTML_LANG[lang]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${homeHead(lang, prefix)}
${FONTS}
${css}
</head>
<body>
<div id="root" data-lang="${lang}">${server.renderHome(lang)}</div>
<script type="module" src="${prefix}${entry.file}"></script>
</body>
</html>
`;
    write(`${langDir(lang)}index.html`, html);
  }

  // 4) política de privacidade (estática, 4 idiomas)
  const privacyCss = fs.readFileSync(path.join(root, "src/styles/privacy.css"), "utf8");
  for (const lang of LANGS) {
    const prefix = baseFor(lang);
    write(`${langDir(lang)}privacidade.html`, `<!doctype html>
<html lang="${HTML_LANG[lang]}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${privacyHead(lang, prefix)}
<style>
${privacyCss}</style></head><body>
${server.renderPrivacy(lang)}
</body></html>
`);
  }

  // 5) 404 (só PT) e sitemap
  const nfCss = fs.readFileSync(path.join(root, "src/styles/notfound.css"), "utf8");
  write("404.html", `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 | Esta página saiu de bagatela | Bagatela</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#14101F">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
${FONTS}
<style>
${nfCss}</style>
</head>
<body>
${server.renderNotFound()}
<script>var b=location.pathname.indexOf("/LowCost-Website/")===0?"/LowCost-Website/":"/";document.getElementById("home").href=b;document.querySelector("link[rel=icon]").href=b+"favicon.svg";</script>
</body>
</html>
`);
  write("sitemap.xml", sitemap());
  fs.rmSync(path.join(dist, ".vite"), { recursive: true, force: true });
  fs.rmSync(ssrDir, { recursive: true, force: true });
  console.log(`OK: ${LANGS.length} idiomas + privacidade + 404 em dist/`);

  // 6) opcional: copiar para a raiz do repositório (publicação no GitHub Pages)
  if (publish) {
    for (const old of ["assets", "en", "fr", "es", "exemplos", "index.html", "privacidade.html", "404.html", "sitemap.xml", "robots.txt", "favicon.svg", "favicon.ico", "favicon-48x48.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "og-image.png"]) {
      fs.rmSync(path.join(root, old), { recursive: true, force: true });
    }
    fs.cpSync(dist, root, { recursive: true });
    console.log("Publicado na raiz do repositório (faz commit dos ficheiros gerados).");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
