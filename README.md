# Bagatela — website

Site da Bagatela (websites low-cost para pequenos negócios em Portugal), em **React 19 + TypeScript + Vite**, com 4 idiomas (PT, EN, FR, ES), assistente, formulários e gerador de conceitos.

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | instala dependências |
| `npm run dev` | servidor local com recarregamento (abre `/dev/index.html`; muda `data-lang` para ver outro idioma) |
| `npm run build` | gera o site estático em `dist/` (HTML pré-renderizado por idioma + sitemap + 404) |
| `npm run build:site` | `build` + copia o resultado para a raiz do repositório (é o que o GitHub Pages serve) |
| `npm test` | testes (Vitest) |
| `npm run typecheck` | verificação de tipos |

**Antes de fazer commit de alterações ao site, corre `npm run build:site`** e inclui os ficheiros gerados (`index.html`, `en/`, `fr/`, `es/`, `assets/`, …).

## Estrutura

- `src/` — código do site: `components/`, `data/site.tsx`, `i18n/`, `concept/` (gerador), `styles/`, `pages/`.
- `src/i18n/translations.ts` — o texto em português é a chave: `TRANSLATIONS["texto PT"] = [en, fr, es]`. Para traduzir uma frase nova, usa `useT()` no componente e acrescenta a entrada.
- `src/config.ts` — contactos, `FORM_EMAIL` e `CONCEPT_API`.
- `scripts/` — build (SSG) e SEO (title, hreflang, JSON-LD, sitemap).
- `public/` — ficheiros estáticos (favicon, og-image, robots, `exemplos/`).
- `api/` + `vercel.json` — API opcional com IA (Vercel). A chave `AI_API_KEY` fica **só no servidor** (ver `.env.example`).

## Gerador de conceitos

`CONCEPT_API` em `src/config.ts`: `"local"` (regras no browser, grátis, por omissão), `"off"` (desligado) ou o URL da API com IA (com fallback para o modo local).

## Antes do lançamento

- `FORM_EMAIL` em `src/config.ts` é `geral@bagatela.pt`. O FormSubmit pede confirmação por email no primeiro envio.
- Não pôr nomes nem fotos de pessoas no site (anonimato).
