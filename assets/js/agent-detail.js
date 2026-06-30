/**
 * agent-detail.js — renders a full agent detail page from window.AGENTS.
 * Each detail page sets <body data-agent-id="..."> and provides mount points;
 * this script fills them, wires the FAQ accordion and the "Launch" demo modal.
 */
(function () {
  var C = window.Cards;

  function byId(id) { return document.getElementById(id); }

  function render() {
    var agents = window.AGENTS || [];
    var id = document.body.getAttribute("data-agent-id");
    var agent = agents.filter(function (a) { return a.id === id; })[0];
    if (!agent) return;

    // ---- Document metadata ----
    document.title = agent.name + " · Gaming AI Marketplace";

    // ---- Hero ----
    var hero = byId("agent-hero");
    if (hero) {
      hero.innerHTML =
        '<div class="flex flex-col items-start gap-5">' +
          '<a href="../index.html#agents" class="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-white transition">' +
            '<i data-lucide="arrow-left" style="width:15px;height:15px;"></i> Back to all agents</a>' +
          '<div class="flex items-center gap-4">' +
            C.iconTile(agent, 64) +
            '<div>' +
              '<div class="flex items-center gap-2 flex-wrap">' +
                '<span class="badge accent-' + C.esc(agent.color) + '">' + C.esc(agent.category) + "</span>" +
                C.statusBadge(agent.status) +
              "</div>" +
            "</div>" +
          "</div>" +
          '<h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">' + C.esc(agent.name) + "</h1>" +
          '<p class="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">' + C.esc(agent.tagline || agent.description) + "</p>" +
          '<p class="text-[var(--text-muted)] max-w-2xl leading-relaxed">' + C.esc(agent.description) + "</p>" +
          '<div class="flex flex-wrap gap-2">' + C.tagPills(agent.tags) + "</div>" +
          '<div class="flex flex-wrap gap-3 pt-1">' +
            '<button id="launch-btn" class="btn btn-primary"><i data-lucide="rocket" style="width:16px;height:16px;"></i> Launch AI</button>' +
            '<a href="../index.html#agents" class="btn btn-ghost"><i data-lucide="layout-grid" style="width:16px;height:16px;"></i> Browse agents</a>' +
          "</div>" +
        "</div>";
    }

    // ---- Capabilities ----
    var cap = byId("agent-capabilities");
    if (cap) {
      cap.innerHTML = agent.capabilities.map(function (c) {
        return '<li class="flex items-start gap-3"><i data-lucide="check-circle-2" class="accent-' + C.esc(agent.color) +
          ' mt-0.5 flex-none" style="width:18px;height:18px;"></i><span class="text-[var(--text-muted)]">' + C.esc(c) + "</span></li>";
      }).join("");
    }

    // ---- Feature cards ----
    var feat = byId("agent-features");
    if (feat) feat.innerHTML = agent.features.map(function (f) { return C.featureCard(f); }).join("");

    // ---- Sample prompts ----
    var prompts = byId("agent-prompts");
    if (prompts) {
      prompts.innerHTML = agent.prompts.map(function (p) {
        return '<button type="button" class="prompt-card card p-4 text-left w-full flex items-start gap-3" data-prompt="' + C.esc(p) + '">' +
          '<i data-lucide="message-square-text" class="accent-' + C.esc(agent.color) + ' mt-0.5 flex-none" style="width:17px;height:17px;"></i>' +
          '<span class="text-sm">' + C.esc(p) + "</span>" +
          '<i data-lucide="copy" class="ml-auto text-[var(--text-faint)] flex-none" style="width:15px;height:15px;"></i>' +
          "</button>";
      }).join("");
      prompts.querySelectorAll(".prompt-card").forEach(function (b) {
        b.addEventListener("click", function () {
          openModal(agent, b.getAttribute("data-prompt"));
        });
      });
    }

    // ---- Example outputs ----
    var ex = byId("agent-examples");
    if (ex) {
      ex.innerHTML = agent.examples.map(function (e) {
        return '<div class="card p-5">' +
          '<div class="flex items-center gap-2 text-sm font-semibold"><i data-lucide="user" style="width:15px;height:15px;"></i> Prompt</div>' +
          '<p class="mt-1.5 text-sm text-[var(--text-muted)]">' + C.esc(e.prompt) + "</p>" +
          '<div class="divider my-4"></div>' +
          '<div class="flex items-center gap-2 text-sm font-semibold accent-' + C.esc(agent.color) + '"><i data-lucide="sparkles" style="width:15px;height:15px;"></i> AI response</div>' +
          '<p class="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed">' + C.esc(e.output) + "</p>" +
          "</div>";
      }).join("");
    }

    // ---- Use cases ----
    var uc = byId("agent-usecases");
    if (uc) {
      uc.innerHTML = agent.useCases.map(function (u, i) {
        return '<div class="card p-5 flex items-start gap-3">' +
          '<span class="icon-tile tile-' + C.esc(agent.color) + ' accent-' + C.esc(agent.color) + '" style="width:34px;height:34px;border-radius:0.6rem;font-weight:700;">' + (i + 1) + "</span>" +
          '<p class="text-sm text-[var(--text-muted)] leading-relaxed">' + C.esc(u) + "</p></div>";
      }).join("");
    }

    // ---- FAQ ----
    var faq = byId("agent-faq");
    if (faq) {
      faq.innerHTML = agent.faq.map(function (f, i) {
        return '<div class="faq-item">' +
          '<button class="faq-trigger" aria-expanded="false" aria-controls="faq-panel-' + i + '">' +
            "<span>" + C.esc(f.q) + "</span>" +
            '<i data-lucide="chevron-down" class="chevron text-[var(--text-muted)]" style="width:18px;height:18px;"></i>' +
          "</button>" +
          '<div id="faq-panel-' + i + '" class="faq-panel" role="region"><div class="faq-inner text-sm leading-relaxed">' + C.esc(f.a) + "</div></div>" +
          "</div>";
      }).join("");
      faq.querySelectorAll(".faq-trigger").forEach(function (t) {
        t.addEventListener("click", function () {
          var panel = t.nextElementSibling;
          var open = t.getAttribute("aria-expanded") === "true";
          t.setAttribute("aria-expanded", String(!open));
          panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
        });
      });
    }

    // ---- Related agents ----
    var rel = byId("agent-related");
    if (rel) {
      var related = agents
        .filter(function (a) { return a.id !== agent.id; })
        .map(function (a) {
          var score = a.category === agent.category ? 2 : 0;
          score += (a.tags || []).filter(function (t) { return (agent.tags || []).indexOf(t) !== -1; }).length;
          return { a: a, score: score };
        })
        .sort(function (x, y) { return y.score - x.score; })
        .slice(0, 3)
        .map(function (o) { return o.a; });
      rel.innerHTML = related.map(function (a) { return C.relatedCard(a, "../"); }).join("");
    }

    // ---- Launch demo modal ----
    var launch = byId("launch-btn");
    if (launch) launch.addEventListener("click", function () { openModal(agent, agent.prompts[0]); });

    if (window.lucide) window.lucide.createIcons();
    initReveal();
  }

  // Scroll-reveal for the .reveal sections on detail pages (the homepage
  // handles its own in main.js).
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  }

  // A lightweight, non-functional demo modal — the static site has no backend,
  // so it shows a canned "this is where a live AI response would appear" panel.
  function openModal(agent, prompt) {
    var existing = document.getElementById("demo-modal");
    if (existing) existing.remove();
    var example = (agent.examples.filter(function (e) { return e.prompt === prompt; })[0]) || agent.examples[0];
    var answer = example ? example.output : "In the live product, " + agent.name + " would answer here in real time.";

    var wrap = document.createElement("div");
    wrap.id = "demo-modal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", agent.name + " demo");
    wrap.className = "fixed inset-0 z-[100] flex items-center justify-center p-4";
    wrap.innerHTML =
      '<div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-close></div>' +
      '<div class="glass-strong relative w-full max-w-lg rounded-2xl p-6">' +
        '<div class="flex items-center justify-between gap-3">' +
          '<div class="flex items-center gap-3">' + C.iconTile(agent, 40) +
            '<div><div class="font-bold">' + C.esc(agent.name) + '</div><div class="text-xs text-[var(--text-muted)]">Interactive demo</div></div>' +
          "</div>" +
          '<button class="btn btn-ghost p-2" data-close aria-label="Close"><i data-lucide="x" style="width:16px;height:16px;"></i></button>' +
        "</div>" +
        '<div class="mt-5 rounded-xl bg-white/5 border border-white/10 p-3 text-sm"><span class="text-[var(--text-faint)]">You</span><br>' + C.esc(prompt) + "</div>" +
        '<div class="mt-3 rounded-xl bg-white/5 border border-white/10 p-3 text-sm"><span class="accent-' + C.esc(agent.color) + '">' + C.esc(agent.name) + "</span><br>" + C.esc(answer) + "</div>" +
        '<p class="mt-4 text-xs text-[var(--text-faint)] flex items-center gap-1.5"><i data-lucide="info" style="width:13px;height:13px;"></i> Demo only — connect a real AI API to make this live.</p>' +
      "</div>";

    document.body.appendChild(wrap);
    if (window.lucide) window.lucide.createIcons();

    function close() {
      wrap.remove();
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    wrap.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", close); });
    document.addEventListener("keydown", onKey);
  }

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
