/* Gerador de conceitos Bagatela (frontend).
 * Fluxo: ideia -> /api/generate-concept -> conceito apresentado em "ficha" -> pedido de contacto.
 * - Nunca há chave de IA aqui: a chamada à IA é feita pelo servidor (api/generate-concept.js).
 * - O resultado é sempre escrito com textContent (nunca innerHTML), por isso conteúdo
 *   inesperado não consegue injetar HTML.
 * - Os textos da interface vêm do bloco .cg-dados do HTML (já traduzido por idioma).
 * Modos (meta bagatela-api): "local" = conceito gerado no browser por regras (conceito-local.js), sem servidor nem custos;
 * "" ou URL = IA no servidor (api/generate-concept.js), com as regras locais como plano B; "off" = secção escondida. */
(function () {
  "use strict";
  var raiz = document.getElementById("conceito");
  if (!raiz) return;

  var meta = document.querySelector('meta[name="bagatela-api"]');
  var cfg = typeof window.BAGATELA_API === "string" ? window.BAGATELA_API : meta ? meta.getAttribute("content") : "off";
  if (cfg === null || cfg === "off") return;
  raiz.hidden = false;
  var LOCAL = cfg === "local";
  var BASE = LOCAL ? "" : cfg.replace(/\/+$/, ""); // "" = mesmo domínio

  var MIN = 50, MAX = 1000;
  var PLANOS = { "Essencial": 179, "Negócio": 299, "Loja Online": 599 };
  var LANG = (document.documentElement.lang || "pt").slice(0, 2);
  if (["pt", "en", "fr", "es"].indexOf(LANG) < 0) LANG = "pt";

  var $ = function (s, r) { return (r || raiz).querySelector(s); };
  var dados = $(".cg-dados");
  var S = function (k) { var e = dados.querySelector('[data-k="' + k + '"]'); return e ? e.textContent.trim() : ""; };
  var frases = [].map.call(dados.querySelectorAll("[data-fr]"), function (e) { return e.textContent.trim(); });
  var exemplos = {};
  [].forEach.call(dados.querySelectorAll("[data-ex]"), function (e) { exemplos[e.getAttribute("data-ex")] = e.textContent.trim(); });
  var nomePlano = {};
  [].forEach.call(dados.querySelectorAll("[data-plano]"), function (e) { nomePlano[e.getAttribute("data-plano")] = e.textContent.trim(); });

  var painelIntro = $("#cg-intro"), painelLoad = $("#cg-loading"), painelRes = $("#cg-resultado");
  var form = $("#cg-form"), txt = $("#cg-texto"), cont = $("#cg-contador"), ajuda = $("#cg-ajuda");
  var btn = $("#cg-enviar"), erro = $("#cg-erro"), fraseEl = $("#cg-frase"), hp = $("#cg-hp");
  var leadDlg = document.getElementById("lead-dlg");

  var estadoAtual = "intro", timerFrases = null, ultimo = null, ctrl = null;

  function estado(nome) {
    estadoAtual = nome;
    painelIntro.hidden = nome !== "intro";
    painelLoad.hidden = nome !== "loading";
    painelRes.hidden = nome !== "resultado";
    $(".cg").setAttribute("aria-busy", nome === "loading" ? "true" : "false");
    var p = nome === "intro" ? painelIntro : nome === "loading" ? painelLoad : painelRes;
    p.classList.remove("cg-entra"); void p.offsetWidth; p.classList.add("cg-entra");
    if (nome === "intro" && typeof atualizaContador === "function") atualizaContador(); // volta a ativar o botão
  }

  /* ---------- Estado 1: introdução ---------- */
  function atualizaContador() {
    var n = txt.value.trim().length;
    cont.textContent = txt.value.length + " / " + MAX;
    var falta = MIN - n;
    if (falta > 0) {
      ajuda.textContent = n === 0 ? S("min") : S("faltam").replace("{n}", falta);
      ajuda.className = "cg-ajuda";
    } else {
      ajuda.textContent = S("ok");
      ajuda.className = "cg-ajuda ok";
    }
    btn.disabled = n < MIN;
    cont.classList.toggle("cheio", txt.value.length >= MAX - 40);
  }
  txt.addEventListener("input", function () { erro.hidden = true; atualizaContador(); });
  [].forEach.call(raiz.querySelectorAll("[data-ex-btn]"), function (b) {
    b.addEventListener("click", function () {
      txt.value = exemplos[b.getAttribute("data-ex-btn")] || "";
      atualizaContador(); txt.focus();
      txt.setSelectionRange(txt.value.length, txt.value.length);
    });
  });
  atualizaContador();

  function mostraErro(msg) { erro.textContent = msg; erro.hidden = false; }

  /* ---------- Estado 2: loading ---------- */
  function iniciaFrases() {
    var i = 0;
    var troca = function () { fraseEl.textContent = frases[i % frases.length] || ""; fraseEl.classList.remove("cg-fade"); void fraseEl.offsetWidth; fraseEl.classList.add("cg-fade"); i++; };
    troca(); timerFrases = setInterval(troca, 2400);
  }
  function paraFrases() { clearInterval(timerFrases); timerFrases = null; }

  /* ---------- pedido à API ---------- */
  function pedido(descricao) {
    ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 55000);
    return fetch(BASE + "/api/generate-concept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ descricao: descricao, lang: LANG, hp: hp.value }),
      signal: ctrl ? ctrl.signal : undefined,
    }).then(function (r) {
      clearTimeout(t);
      return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, json: j }; });
    }, function (e) { clearTimeout(t); throw e; });
  }

  // Validação do que chega do servidor: nunca assumimos a forma dos dados.
  function texto(v, max) { return typeof v === "string" ? v.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : ""; }
  function valida(res) {
    if (!res || typeof res !== "object" || !res.concept || typeof res.concept !== "object") return null;
    var c = res.concept;
    var secoes = Array.isArray(c.sections) ? c.sections.map(function (s) {
      return s && typeof s === "object" ? { title: texto(s.title, 80), description: texto(s.description, 260) } : null;
    }).filter(function (s) { return s && s.title; }).slice(0, 10) : [];
    var plano = Object.prototype.hasOwnProperty.call(PLANOS, c.recommendedPlan) ? c.recommendedPlan : null;
    var out = {
      businessName: texto(c.businessName, 90) || "Nome do negócio",
      businessType: texto(c.businessType, 70),
      summary: texto(c.summary, 450),
      objective: texto(c.objective, 450),
      targetAudience: texto(c.targetAudience, 350),
      sections: secoes,
      features: Array.isArray(c.features) ? c.features.map(function (f) { return texto(f, 100); }).filter(Boolean).slice(0, 10) : [],
      visualDirection: texto(c.visualDirection, 450),
      headline: texto(c.headline, 140),
      cta: texto(c.cta, 50),
      recommendedPlan: plano,
      planReason: texto(c.planReason, 360),
    };
    if (!plano || secoes.length < 2 || !out.objective || !out.headline) return null;
    return out;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var descricao = txt.value.trim();
    if (descricao.length < MIN) { mostraErro(S("erroCurto")); txt.focus(); return; }
    erro.hidden = true;
    btn.disabled = true;
    estado("loading"); iniciaFrases();
    var inicio = Date.now();
    var gera = LOCAL
      ? Promise.resolve().then(function () {
          var c = valida({ concept: window.BagatelaLocal ? window.BagatelaLocal.gerar(descricao, LANG) : null });
          if (!c) throw { codigo: "negocio" };
          return c;
        })
      : pedido(descricao).then(function (r) {
          var c = r.status === 200 ? valida(r.json) : null;
          if (c) return c;
          var cod = r.json && r.json.error;
          throw { codigo: r.status === 429 ? "rate" : (cod === "not_business" || cod === "too_short") ? "negocio" : "pausa" };
        }).catch(function (err) {
          // plano B: se a IA falhar, usa as regras locais em vez de mostrar um erro
          if (err && err.codigo === "pausa" || !(err && err.codigo)) {
            var c = valida({ concept: window.BagatelaLocal ? window.BagatelaLocal.gerar(descricao, LANG) : null });
            if (c) return c;
          }
          throw err;
        });
    gera.then(function (c) {
      // mantém o loading o tempo mínimo para a animação não "piscar"
      var resta = Math.max(0, 1600 - (Date.now() - inicio));
      return new Promise(function (ok) { setTimeout(function () { ok(c); }, resta); });
    }).then(function (c) {
      paraFrases(); ultimo = { descricao: descricao, concept: c };
      desenhaResultado(c, descricao);
      estado("resultado");
      painelRes.focus({ preventScroll: true });
      painelRes.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }).catch(function (err) {
      paraFrases(); estado("intro"); atualizaContador();
      var k = err && err.codigo;
      mostraErro(k === "rate" ? S("erroRate") : k === "negocio" ? S("erroNegocio") : S("erroPausa"));
      txt.focus();
    });
  });

  /* ---------- Estado 3: resultado ---------- */
  var seq = 0;
  function proximoNumero() {
    var n = 1;
    try { n = (parseInt(sessionStorage.getItem("bagatela_conceito_n"), 10) || 0) + 1; sessionStorage.setItem("bagatela_conceito_n", String(n)); } catch (e) { n = ++seq; }
    return ("00" + n).slice(-3);
  }
  function el(tag, cls, t) { var e = document.createElement(tag); if (cls) e.className = cls; if (t != null) e.textContent = t; return e; }
  function bloco(titulo, cls, i) {
    var b = el("section", "cg-bloco" + (cls ? " " + cls : "")); b.style.setProperty("--i", i);
    b.appendChild(el("h4", null, titulo)); return b;
  }

  function desenhaResultado(c, descricao) {
    var nome = c.businessName === "Nome do negócio" ? S("semNome") : c.businessName;
    var plano = c.recommendedPlan, preco = PLANOS[plano];
    painelRes.textContent = "";
    var ficha = el("article", "cg-ficha");

    var cab = el("div", "cg-cab");
    cab.appendChild(el("span", "tag lilas", "✦ " + S("conceito") + " #" + proximoNumero()));
    var h = el("h3", "cg-nome", nome); cab.appendChild(h);
    if (c.businessType) cab.appendChild(el("p", "cg-tipo", c.businessType));
    if (c.summary) cab.appendChild(el("p", "cg-resumo", c.summary));
    ficha.appendChild(cab);

    var g = el("div", "cg-grelha"), i = 0;
    var b1 = bloco(S("objetivo"), "", i++); b1.appendChild(el("p", null, c.objective)); g.appendChild(b1);
    if (c.targetAudience) { var b2 = bloco(S("publico"), "", i++); b2.appendChild(el("p", null, c.targetAudience)); g.appendChild(b2); }

    var b3 = bloco(S("estrutura"), "cg-estrutura", i++);
    var ol = el("ol", "cg-lista-sec");
    c.sections.forEach(function (s, k) {
      var li = el("li"); li.appendChild(el("b", null, ("0" + (k + 1)).slice(-2)));
      var w = el("span"); w.appendChild(el("strong", null, s.title)); if (s.description) w.appendChild(el("small", null, s.description));
      li.appendChild(w); ol.appendChild(li);
    });
    b3.appendChild(ol); g.appendChild(b3);

    if (c.features.length) {
      var b4 = bloco(S("funcionalidades"), "", i++), ul = el("ul", "cg-lista-fn");
      c.features.forEach(function (f) { ul.appendChild(el("li", null, f)); });
      b4.appendChild(ul); g.appendChild(b4);
    }
    if (c.visualDirection) { var b5 = bloco(S("direcao"), "", i++); b5.appendChild(el("p", null, c.visualDirection)); g.appendChild(b5); }

    var b6 = bloco(S("headline"), "cg-headline", i++);
    b6.appendChild(el("blockquote", null, "“" + c.headline + "”"));
    if (c.cta) b6.appendChild(el("span", "cg-cta-mock", c.cta));
    g.appendChild(b6);
    ficha.appendChild(g);

    var pl = el("div", "cg-plano"); pl.style.setProperty("--i", i++);
    var esq = el("div", "cg-plano-esq");
    esq.appendChild(el("span", "tag", S("recomenda")));
    esq.appendChild(el("h4", null, S("plano") + " " + (nomePlano[plano] || plano)));
    esq.appendChild(el("p", "cg-preco", preco + "€"));
    var dir = el("div", "cg-plano-dir");
    dir.appendChild(el("p", "cg-motivo", c.planReason || S("motivoPadrao")));
    dir.appendChild(el("p", "cg-gostaste", S("gostaste")));
    var avancar = el("button", "btn btn-damasco seta", S("avancar")); avancar.type = "button";
    avancar.addEventListener("click", abreLead);
    dir.appendChild(avancar);
    pl.appendChild(esq); pl.appendChild(dir); ficha.appendChild(pl);

    var rod = el("div", "cg-rodape");
    rod.appendChild(el("p", null, S("pontoPartida")));
    var acoes = el("div", "cg-rodape-acoes");
    var ir = el("a", "btn btn-escuro seta", S("transformar")); ir.href = "#contacto";
    var outro = el("button", "cg-link", S("refazer")); outro.type = "button";
    outro.addEventListener("click", function () { estado("intro"); txt.focus(); raiz.scrollIntoView({ block: "start" }); });
    acoes.appendChild(ir); acoes.appendChild(outro);
    rod.appendChild(acoes); ficha.appendChild(rod);

    painelRes.appendChild(ficha);
  }

  /* ---------- pedido de contacto (lead) ---------- */
  var lf = leadDlg && leadDlg.querySelector("form");
  function abreLead() {
    if (!leadDlg || !leadDlg.showModal) { location.href = "#contacto"; return; }
    var s = leadDlg.querySelector(".estado"); s.textContent = ""; s.className = "estado";
    leadDlg.showModal();
  }
  function briefing(l, d) {
    var c = ultimo.concept, linhas = [];
    linhas.push("NOVO LEAD — BAGATELA AI", "");
    linhas.push("Nome: " + d.nome, "Email: " + d.email, "Telefone: " + (d.telefone || "-"), "Empresa: " + (d.empresa || "-"), "Idioma do site: " + LANG, "");
    linhas.push("Descrição original:", ultimo.descricao, "");
    linhas.push("Conceito gerado:");
    linhas.push("Negócio: " + c.businessName + (c.businessType ? " (" + c.businessType + ")" : ""));
    linhas.push("Objetivo: " + c.objective);
    if (c.targetAudience) linhas.push("Público: " + c.targetAudience);
    linhas.push("Estrutura:");
    c.sections.forEach(function (s, k) { linhas.push("  " + ("0" + (k + 1)).slice(-2) + " — " + s.title + (s.description ? ": " + s.description : "")); });
    if (c.features.length) { linhas.push("Funcionalidades:"); c.features.forEach(function (f) { linhas.push("  • " + f); }); }
    linhas.push("Direção visual: " + c.visualDirection, "Headline: " + c.headline, "CTA: " + c.cta, "");
    linhas.push("Plano recomendado:", c.recommendedPlan + " — " + PLANOS[c.recommendedPlan] + "€", "Motivo: " + c.planReason);
    return linhas.join("\n");
  }
  if (lf) {
    lf.addEventListener("submit", function (e) {
      e.preventDefault();
      var st = lf.querySelector(".estado"), b = lf.querySelector('button[type="submit"]');
      var d = { nome: lf.nome.value.trim(), email: lf.email.value.trim(), telefone: lf.telefone.value.trim(), empresa: lf.empresa.value.trim() };
      var okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email);
      lf.nome.classList.toggle("invalido", !d.nome); lf.email.classList.toggle("invalido", !okEmail);
      if (!d.nome || !okEmail || !ultimo) { st.className = "estado erro"; st.textContent = S("leadInvalido"); return; }
      b.disabled = true; st.className = "estado"; st.textContent = S("aEnviar");
      var fd = new FormData();
      fd.append("_subject", "NOVO LEAD — BAGATELA AI");
      fd.append("_captcha", "false"); fd.append("_template", "table");
      fd.append("_honey", lf._honey.value);
      fd.append("nome", d.nome); fd.append("email", d.email);
      fd.append("telefone", d.telefone || "-"); fd.append("empresa", d.empresa || "-");
      fd.append("plano_recomendado", ultimo.concept.recommendedPlan + " — " + PLANOS[ultimo.concept.recommendedPlan] + "€");
      fd.append("briefing", briefing(lf, d));
      fetch("https://formsubmit.co/ajax/geral@bagatela.pt", { method: "POST", headers: { Accept: "application/json" }, body: fd })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (String(j.success) !== "true") throw new Error();
          st.className = "estado ok"; st.textContent = S("leadOk");
          lf.reset(); setTimeout(function () { leadDlg.close(); }, 3200);
        })
        .catch(function () { st.className = "estado erro"; st.textContent = S("leadErro"); })
        .finally(function () { b.disabled = false; });
    });
    leadDlg.querySelector(".fechar-dlg").addEventListener("click", function () { leadDlg.close(); });
    leadDlg.addEventListener("click", function (e) { if (e.target === leadDlg) leadDlg.close(); });
  }
})();
