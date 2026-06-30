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

  // Interactive chat modal. With a saved Anthropic API key it sends the prompt
  // to Claude (via AIClient) and renders the real reply; without a key it shows
  // a key-entry panel plus the canned example so the agent is still useful to
  // browse offline.
  function openModal(agent, prompt) {
    var existing = document.getElementById("demo-modal");
    if (existing) existing.remove();

    var wrap = document.createElement("div");
    wrap.id = "demo-modal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", agent.name + " chat");
    wrap.className = "fixed inset-0 z-[100] flex items-center justify-center p-4";

    wrap.innerHTML =
      '<div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-close></div>' +
      '<div class="glass-strong relative w-full max-w-lg rounded-2xl p-6 max-h-[90vh] flex flex-col">' +
        '<div class="flex items-center justify-between gap-3">' +
          '<div class="flex items-center gap-3">' + C.iconTile(agent, 40) +
            '<div><div class="font-bold">' + C.esc(agent.name) + '</div>' +
            '<div class="text-xs text-[var(--text-muted)]">Powered by Claude · ' + C.esc(window.AIClient ? window.AIClient.MODEL : "claude") + '</div></div>' +
          "</div>" +
          '<button class="btn btn-ghost p-2" data-close aria-label="Close"><i data-lucide="x" style="width:16px;height:16px;"></i></button>' +
        "</div>" +
        '<div id="ai-body" class="mt-5 overflow-y-auto flex-1"></div>' +
        '<div id="ai-footer" class="mt-3"></div>' +
      "</div>";

    document.body.appendChild(wrap);

    var body = wrap.querySelector("#ai-body");
    var footer = wrap.querySelector("#ai-footer");

    function bubble(who, text, cls) {
      return '<div class="rounded-xl bg-white/5 border border-white/10 p-3 text-sm mb-3 whitespace-pre-wrap">' +
        '<span class="' + (cls || "text-[var(--text-faint)]") + '">' + C.esc(who) + "</span><br>" + C.esc(text) + "</div>";
    }

    // ---- Key-entry view ----
    function renderKeyForm() {
      body.innerHTML =
        '<div class="rounded-xl border border-white/10 bg-white/5 p-4">' +
          '<div class="flex items-center gap-2 font-semibold text-sm"><i data-lucide="key-round" class="accent-' + C.esc(agent.color) + '" style="width:16px;height:16px;"></i> Connect your Anthropic API key</div>' +
          '<p class="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">This static site has no backend, so it uses <strong>your own</strong> key to talk to Claude. ' +
          'The key is stored only in this browser (localStorage) and sent directly to the Anthropic API — never to any other server.</p>' +
          '<label for="ai-key" class="sr-only">Anthropic API key</label>' +
          '<input id="ai-key" type="password" autocomplete="off" placeholder="sk-ant-..." ' +
            'class="mt-3 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30" />' +
          '<div class="mt-3 flex items-center gap-2">' +
            '<button id="ai-save" class="btn btn-primary text-sm flex-1"><i data-lucide="plug" style="width:15px;height:15px;"></i> Save & connect</button>' +
            '<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener" class="btn btn-ghost text-sm">Get a key</a>' +
          "</div>" +
        "</div>" +
        '<div class="mt-4 text-xs text-[var(--text-faint)]">Example response (offline preview):</div>' +
        '<div class="mt-2">' + bubble(agent.name, (agent.examples[0] && agent.examples[0].output) || "", "accent-" + C.esc(agent.color)) + "</div>";

      footer.innerHTML = "";
      if (window.lucide) window.lucide.createIcons();

      var input = wrap.querySelector("#ai-key");
      var save = wrap.querySelector("#ai-save");
      function doSave() {
        var v = (input.value || "").trim();
        if (!v) { input.focus(); return; }
        window.AIClient.setKey(v);
        renderChat();
      }
      save.addEventListener("click", doSave);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") doSave(); });
      input.focus();
    }

    // ---- Chat view ----
    function renderChat() {
      body.innerHTML = "";
      footer.innerHTML =
        '<form id="ai-form" class="flex items-end gap-2">' +
          '<textarea id="ai-input" rows="1" placeholder="Ask ' + C.esc(agent.name) + '…" ' +
            'class="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30 resize-none"></textarea>' +
          '<button type="submit" id="ai-send" class="btn btn-primary text-sm"><i data-lucide="send" style="width:15px;height:15px;"></i></button>' +
        "</form>" +
        '<div class="mt-2 flex items-center justify-between text-[11px] text-[var(--text-faint)]">' +
          '<span class="inline-flex items-center gap-1"><i data-lucide="shield-check" style="width:12px;height:12px;"></i> Key stored in your browser only</span>' +
          '<button id="ai-forget" class="hover:text-white underline-offset-2 hover:underline">Forget key</button>' +
        "</div>";
      if (window.lucide) window.lucide.createIcons();

      var form = wrap.querySelector("#ai-form");
      var input = wrap.querySelector("#ai-input");
      var send = wrap.querySelector("#ai-send");
      wrap.querySelector("#ai-forget").addEventListener("click", function () {
        window.AIClient.clearKey();
        renderKeyForm();
      });

      input.value = prompt || "";
      input.focus();

      function append(html) {
        body.insertAdjacentHTML("beforeend", html);
        body.scrollTop = body.scrollHeight;
      }

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = (input.value || "").trim();
        if (!text) return;
        input.value = "";
        send.disabled = true;
        append(bubble("You", text));
        var thinkingId = "t" + body.children.length;
        append('<div id="' + thinkingId + '" class="rounded-xl bg-white/5 border border-white/10 p-3 text-sm mb-3 text-[var(--text-muted)]">' +
          '<span class="accent-' + C.esc(agent.color) + '">' + C.esc(agent.name) + "</span><br><span class='opacity-70'>Thinking…</span></div>");

        window.AIClient.complete(agent, text).then(function (reply) {
          var el = document.getElementById(thinkingId);
          if (el) el.outerHTML = bubble(agent.name, reply, "accent-" + C.esc(agent.color));
          body.scrollTop = body.scrollHeight;
        }).catch(function (err) {
          var el = document.getElementById(thinkingId);
          var msg;
          if (err.status === 401) msg = "That API key was rejected (401). Use “Forget key” and try again.";
          else if (err.status === 429) msg = "Rate limited (429). Wait a moment and retry.";
          else msg = "Error: " + (err.message || "request failed") + ".";
          if (el) el.outerHTML = '<div class="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm mb-3 text-rose-200">' + C.esc(msg) + "</div>";
          body.scrollTop = body.scrollHeight;
        }).then(function () { send.disabled = false; input.focus(); });
      });
    }

    if (window.AIClient && window.AIClient.hasKey()) renderChat();
    else renderKeyForm();

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
