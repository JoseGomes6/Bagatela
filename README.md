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
- `conceito.js`, `conceito-local.js`: gerador de conceitos (ver abaixo). `package.json`, `vercel.json`, `.env.example`, `api/`: modo opcional com IA.
- `favicon.svg`, `og-image.png`, `robots.txt`, `sitemap.xml` (com `hreflang`).

## Identidade visual

- As cores da marca estão no início do CSS do `index.html` (`:root`, secção "Marca Bagatela"): `--lilas-forte` (ação), `--lilas`, `--creme`, `--preto` e `--accent` (amarelo, usar pontualmente). Para mudar a cor principal basta alterar essas variáveis.
- Elemento gráfico próprio: **a Etiqueta** (classe `.tag`, logótipo com furo de etiqueta, carimbo "Preço fechado"). Aparece no logótipo, nos números das secções, nos planos, nos projetos (BAGATELA #00X), no carimbo do hero e no rodapé.
- Tipografia: Familjen Grotesk (títulos) e Geist (texto).
- `404.html`: página de erro com a voz da marca.

## Gerador de conceitos ("Conta-nos a tua ideia")

O visitante descreve o negócio e o site apresenta um conceito (estrutura, funcionalidades, direção visual, headline, CTA e plano recomendado) numa "ficha" com o design da Bagatela. Nunca gera HTML nem código.

**Modo atual: local (grátis).** O conceito é montado no próprio browser por regras (`conceito-local.js`): reconhece o tipo de negócio e o que o cliente pede (palavras-chave em PT/EN/FR/ES) e preenche modelos escritos pela Bagatela. Não há servidor, chaves nem custos, e o texto nunca sai do browser. Só usa factos que o cliente escreveu (nome e local); o resto são sugestões. Cobre 9 tipos de negócio (alojamento, restauração, loja, beleza/saúde, serviços técnicos, desporto, profissionais, criativos e genérico). Regras dos planos: Loja Online só com necessidade explícita de vender online; Negócio quando há 2 ou mais necessidades (galeria, reservas, formulário, mapa, várias secções…); Essencial nos restantes casos.
- Para acrescentar um tipo de negócio ou ajustar textos: editar `conceito-local.js` (tabelas `KEYWORDS`, `CAT`, `SEC`, `FN`). `npm test` verifica as regras.

**Ficheiros:** `conceito.js` (interface e estados), `conceito-local.js` (regras), `tests/` (testes).

**Meta `bagatela-api` no `index.html`** (depois correr `python3 build.py`):
- `content="local"`: modo local (atual).
- `content="off"`: secção escondida.
- `content=""` ou `content="https://o-teu-projeto.vercel.app"`: IA no servidor (opcional, ver abaixo). Se a IA falhar, o site usa as regras locais em vez de mostrar um erro.

**Opcional: IA a sério (Claude).** `api/generate-concept.js` é uma função serverless (Vercel) que usa Structured Outputs e valida a resposta; `api/_lib/` tem o prompt, o esquema, a validação e o limite de pedidos. Requer `AI_API_KEY` (chave da Anthropic, paga por uso) nas variáveis de ambiente do Vercel; ver `.env.example`. Se se ativar, atualizar a política de privacidade (o texto passaria a ser enviado a um fornecedor de IA).

**Pedido de contacto:** "Quero avançar" abre um formulário (nome e e-mail obrigatórios; telefone e empresa opcionais) que reutiliza o envio já existente (FormSubmit para `geral@bagatela.pt`) com o assunto "NOVO LEAD — BAGATELA AI", a descrição original, o conceito e o plano recomendado.

## Formulário de contacto

Envia para `geral@bagatela.pt` através do [FormSubmit](https://formsubmit.co). No primeiro envio chega um e-mail de ativação a esse endereço: é preciso confirmá-lo uma vez.

## Publicar com GitHub Pages

1. Settings › Pages
2. Source: **Deploy from a branch**
3. Branch: `main`, pasta `/ (root)` › Save
