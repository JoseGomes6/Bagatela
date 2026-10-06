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
- `favicon.svg`, `og-image.png`, `robots.txt`, `sitemap.xml` (com `hreflang`).

## Identidade visual

- As cores da marca estão no início do CSS do `index.html` (`:root`, secção "Marca Bagatela"): `--lilas-forte` (ação), `--lilas`, `--creme`, `--preto` e `--accent` (amarelo, usar pontualmente). Para mudar a cor principal basta alterar essas variáveis.
- Elemento gráfico próprio: **a Etiqueta** (classe `.tag`, logótipo com furo de etiqueta, carimbo "Preço fechado"). Aparece no logótipo, nos números das secções, nos planos, nos projetos (BAGATELA #00X), no carimbo do hero e no rodapé.
- Tipografia: Familjen Grotesk (títulos) e Geist (texto).
- `404.html`: página de erro com a voz da marca.

## Formulário de contacto

Envia para `geral@bagatela.pt` através do [FormSubmit](https://formsubmit.co). No primeiro envio chega um e-mail de ativação a esse endereço: é preciso confirmá-lo uma vez.

## Publicar com GitHub Pages

1. Settings › Pages
2. Source: **Deploy from a branch**
3. Branch: `main`, pasta `/ (root)` › Save
