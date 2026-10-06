# Bagatela

Site da Bagatela: criação de websites profissionais low cost para pequenos negócios em Portugal.

## Planos

| Plano | Preço |
|---|---|
| Essencial | 179€ |
| Negócio | 299€ |
| Loja Online | 599€ |
| Manutenção mensal (opcional) | 50€/mês |

## Estrutura

- `index.html`: página principal em português (HTML, CSS e JavaScript num só ficheiro). É a fonte: edite aqui.
- `en/`, `fr/`, `es/`: versões em inglês, francês e espanhol. **Geradas** por `build.py`, não editar à mão.
- `build.py`: `python3 build.py` regenera as versões traduzidas, as páginas de privacidade e o `sitemap.xml`. Ao acrescentar texto novo no `index.html`, junte a tradução à tabela `T` do script.
- `exemplos/`: 3 sites de exemplo (restaurante, beleza, serviços técnicos).
- `privacidade.html` (e `en/`, `fr/`, `es/`): política de privacidade.
- `package.json`, `vercel.json`, `.env.example`: funções serverless do gerador de conceitos (ver abaixo).
- `favicon.svg`, `og-image.png`, `robots.txt`, `sitemap.xml` (com `hreflang`).

## Identidade visual

- As cores da marca estão no início do CSS do `index.html` (`:root`, secção "Marca Bagatela"): `--lilas-forte` (ação), `--lilas`, `--creme`, `--preto` e `--accent` (amarelo, usar pontualmente). Para mudar a cor principal basta alterar essas variáveis.
- Elemento gráfico próprio: **a Etiqueta** (classe `.tag`, logótipo com furo de etiqueta, carimbo "Preço fechado"). Aparece no logótipo, nos números das secções, nos planos, nos projetos (BAGATELA #00X), no carimbo do hero e no rodapé.
- Tipografia: Familjen Grotesk (títulos) e Geist (texto).
- `404.html`: página de erro com a voz da marca.

## Gerador de conceitos com IA ("Conta-nos a tua ideia")

O visitante descreve o negócio e a IA devolve **só dados estruturados (JSON)**; o site apresenta-os numa "ficha" com o design da Bagatela. A IA nunca gera HTML, CSS nem código.

**Ficheiros**
- `conceito.js`: frontend (estados: ideia, a pensar, resultado, pedido de contacto). Escreve tudo com `textContent`.
- `api/generate-concept.js`: função serverless (compatível com Vercel). É a única que fala com a IA.
- `api/_lib/concept.js`: esquema JSON, prompt do consultor, validação do pedido e validação/limpeza da resposta. `api/_lib/ratelimit.js`: limite de pedidos.
- `tests/`: testes (`npm install && npm test`), sem rede nem chave.

**Porque está escondido por defeito:** o GitHub Pages só serve ficheiros estáticos e não corre código de servidor. A secção só aparece quando existe uma API. No `index.html` (e depois `python3 build.py`) a meta `bagatela-api` controla isto:
- `content="off"`: secção escondida (estado atual).
- `content=""`: API no mesmo domínio (site e `/api` publicados juntos, por exemplo tudo no Vercel).
- `content="https://o-teu-projeto.vercel.app"`: API noutro domínio (o site continua no GitHub Pages).

**Ativar (Vercel)**
1. Importar o repositório no Vercel (plano gratuito chega).
2. Em Settings > Environment Variables definir `AI_API_KEY` (chave da API da Anthropic). Opcionais: `AI_MODEL`, `ALLOWED_ORIGINS`, `RATE_LIMIT_PER_HOUR`, `RATE_LIMIT_PER_DAY` (ver `.env.example`).
3. Se o site continuar noutro sítio, pôr o endereço do Vercel na meta e acrescentar o domínio do site a `ALLOWED_ORIGINS`.

**Segurança:** a chave só existe no servidor (nunca no frontend nem no bundle); resposta pedida com Structured Outputs (JSON Schema) e validada outra vez no servidor e no browser; o preço do plano vem sempre da Bagatela, nunca do modelo; o texto do cliente vai delimitado como dados no prompt; limite de 50-1000 caracteres, de 8 KB por pedido, CORS por origem, honeypot e limite por IP (em memória: trava abusos básicos, mas não é global entre instâncias; para um limite rígido trocar `ratelimit.js` por Upstash/Vercel KV). Os erros técnicos nunca chegam ao visitante (mostra-se a mensagem "pausa para café").

**Pedido de contacto:** "Quero avançar" abre um formulário (nome, e-mail, telefone e empresa opcionais) que reutiliza o envio já existente (FormSubmit para `geral@bagatela.pt`) com o assunto "NOVO LEAD — BAGATELA AI", a descrição original, o conceito e o plano recomendado. Nenhuma credencial fica no frontend. Para trocar por Resend no futuro, criar `api/send-lead.js` (com `RESEND_API_KEY` só no servidor) e apontar o `fetch` do `conceito.js` para lá.

## Formulário de contacto

Envia para `geral@bagatela.pt` através do [FormSubmit](https://formsubmit.co). No primeiro envio chega um e-mail de ativação a esse endereço: é preciso confirmá-lo uma vez.

## Publicar com GitHub Pages

1. Settings › Pages
2. Source: **Deploy from a branch**
3. Branch: `main`, pasta `/ (root)` › Save
