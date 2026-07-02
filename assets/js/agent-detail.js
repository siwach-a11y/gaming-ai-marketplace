/**
 * agent-detail.js — renders a full agent detail page (dashboard layout) from
 * window.AGENTS into #agent-detail: breadcrumb, header with rating + launch,
 * a metadata sidebar, a scroll-linked tab bar, and stacked sections. The
 * "Launch AI Agent" button opens the live Claude chat modal (BYO key).
 */
(function () {
  var C = window.Cards;

  function render() {
    var agents = window.AGENTS || [];
    var id = document.body.getAttribute("data-agent-id");
    var agent = agents.filter(function (a) { return a.id === id; })[0];
    var mount = document.getElementById("agent-detail");
    if (!agent || !mount) return;

    document.title = agent.name + " · Gaming AI Marketplace";

    var TABS = [
      { key: "overview", label: "Overview" },
      { key: "capabilities", label: "Capabilities" },
      { key: "prompts", label: "Sample Prompts" },
      { key: "examples", label: "Example Output" },
      { key: "usecases", label: "Use Cases" },
      { key: "faq", label: "FAQ" }
    ];

    var related = agents
      .filter(function (a) { return a.id !== agent.id; })
      .map(function (a) {
        var score = (a.category === agent.category ? 2 : 0) +
          (a.tags || []).filter(function (t) { return (agent.tags || []).indexOf(t) !== -1; }).length;
        return { a: a, score: score };
      })
      .sort(function (x, y) { return y.score - x.score; })
      .slice(0, 3).map(function (o) { return o.a; });

    mount.innerHTML =
      // Breadcrumb
      '<nav class="flex items-center gap-2 text-sm text-[var(--text-muted)]" aria-label="Breadcrumb">' +
        '<a href="../index.html" class="hover:text-white transition">Home</a><span>/</span>' +
        '<a href="../index.html#agents" class="hover:text-white transition">Agents</a><span>/</span>' +
        '<span class="text-[var(--text)]">' + C.esc(agent.name) + "</span>" +
      "</nav>" +

      '<div class="grid lg:grid-cols-[1fr_300px] gap-6 mt-4 items-start">' +
        // ---------- Main column ----------
        '<div class="min-w-0">' +
          // Header
          '<div class="panel p-5 sm:p-6">' +
            '<div class="flex flex-col sm:flex-row sm:items-start gap-4">' +
              C.iconTile(agent, 72) +
              '<div class="min-w-0 flex-1">' +
                '<div class="flex items-center gap-2 flex-wrap">' +
                  '<h1 class="text-2xl font-extrabold tracking-tight">' + C.esc(agent.name) + "</h1>" +
                  '<span class="badge badge-ai"><i data-lucide="sparkles" style="width:12px;height:12px;"></i> AI</span>' +
                "</div>" +
                '<div class="mt-1.5 flex items-center gap-2 text-sm">' + C.rating(agent) +
                  '<span class="text-[var(--text-muted)]">(' + C.esc(agent.reviews) + " reviews)</span></div>" +
                '<p class="mt-3 text-[var(--text-muted)] leading-relaxed">' + C.esc(agent.description) + "</p>" +
                '<div class="mt-4 flex flex-wrap gap-2">' +
                  '<button id="launch-btn" class="btn btn-primary"><i data-lucide="rocket" style="width:16px;height:16px;"></i> Launch AI Agent</button>' +
                  '<button id="fav-btn" class="btn btn-ghost p-2.5" aria-label="Favorite" aria-pressed="false"><i data-lucide="heart" style="width:17px;height:17px;"></i></button>' +
                "</div>" +
              "</div>" +
            "</div>" +
            // Tabs
            '<div class="tabs mt-5" role="tablist">' +
              TABS.map(function (t, i) {
                return '<button class="tab' + (i === 0 ? " active" : "") + '" data-target="sec-' + t.key + '">' + t.label + "</button>";
              }).join("") +
            "</div>" +
          "</div>" +

          // Capabilities
          section("sec-capabilities", "Capabilities",
            '<div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">' +
              agent.features.map(function (f) { return C.featureCard(f); }).join("") + "</div>") +

          // Sample prompts
          section("sec-prompts", "Sample Prompts",
            '<p class="text-sm text-[var(--text-muted)] -mt-2 mb-3">Try these examples or create your own.</p>' +
            '<div id="prompt-list" class="grid sm:grid-cols-2 gap-3">' +
              agent.prompts.map(function (p) {
                return '<button type="button" class="prompt-card card p-4 text-left flex items-start gap-3" data-prompt="' + C.esc(p) + '">' +
                  '<i data-lucide="message-square-text" class="accent-' + C.esc(agent.color) + ' mt-0.5 flex-none" style="width:16px;height:16px;"></i>' +
                  '<span class="text-sm">' + C.esc(p) + "</span></button>";
              }).join("") + "</div>") +

          // Example output
          section("sec-examples", "Example Output",
            '<div class="grid sm:grid-cols-2 gap-4">' +
              agent.examples.map(function (e) {
                return '<div class="card p-4">' +
                  '<div class="flex items-center gap-2 text-sm font-semibold"><i data-lucide="user" style="width:14px;height:14px;"></i> Prompt</div>' +
                  '<p class="mt-1 text-sm text-[var(--text-muted)]">' + C.esc(e.prompt) + "</p>" +
                  '<div class="divider my-3"></div>' +
                  '<div class="flex items-center gap-2 text-sm font-semibold accent-' + C.esc(agent.color) + '"><i data-lucide="sparkles" style="width:14px;height:14px;"></i> AI response</div>' +
                  '<p class="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">' + C.esc(e.output) + "</p></div>";
              }).join("") + "</div>") +

          // Use cases
          section("sec-usecases", "Use Cases",
            '<div class="grid sm:grid-cols-3 gap-3">' +
              agent.useCases.map(function (u, i) {
                return '<div class="card p-4 flex items-start gap-3">' +
                  '<span class="icon-tile tile-' + C.esc(agent.color) + " accent-" + C.esc(agent.color) + '" style="width:30px;height:30px;border-radius:0.55rem;font-weight:700;font-size:0.8rem;">' + (i + 1) + "</span>" +
                  '<p class="text-sm text-[var(--text-muted)] leading-relaxed">' + C.esc(u) + "</p></div>";
              }).join("") + "</div>") +

          // FAQ
          section("sec-faq", "FAQ",
            '<div id="faq-list" class="panel px-5">' +
              agent.faq.map(function (f, i) {
                return '<div class="faq-item"><button class="faq-trigger" aria-expanded="false"><span>' + C.esc(f.q) + "</span>" +
                  '<i data-lucide="chevron-down" class="chevron text-[var(--text-muted)]" style="width:18px;height:18px;"></i></button>' +
                  '<div class="faq-panel"><div class="faq-inner text-sm leading-relaxed">' + C.esc(f.a) + "</div></div></div>";
              }).join("") + "</div>") +

          // Related
          section("sec-related", "Related Agents",
            '<div class="grid sm:grid-cols-3 gap-3">' + related.map(function (a) { return C.relatedCard(a, "../"); }).join("") + "</div>") +
        "</div>" +

        // ---------- Metadata sidebar ----------
        '<aside class="panel p-5 lg:sticky lg:top-20 space-y-4" id="sec-overview">' +
          meta("Category", '<span class="inline-flex items-center gap-1 accent-' + C.esc(agent.color) + '">' + C.esc(agent.category) + "</span>") +
          meta("Status", C.statusBadge(agent.status)) +
          meta("Created", C.esc(agent.created)) +
          meta("Developer", C.esc(agent.developer)) +
          '<div><div class="text-xs uppercase tracking-wide text-[var(--text-faint)] mb-2">Tags</div>' +
            '<div class="flex flex-wrap gap-1.5">' + (agent.tags || []).map(function (t) { return '<span class="badge">#' + C.esc(t) + "</span>"; }).join("") + "</div></div>" +
        "</aside>" +
      "</div>";

    // ---- Tab behaviour: highlight + smooth scroll to section ----
    mount.querySelectorAll(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        mount.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        var target = document.getElementById(tab.getAttribute("data-target"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // ---- Favorite toggle ----
    var fav = document.getElementById("fav-btn");
    if (fav) fav.addEventListener("click", function () {
      var on = fav.getAttribute("aria-pressed") === "true";
      fav.setAttribute("aria-pressed", String(!on));
      var icon = fav.querySelector("i");
      if (icon) icon.style.color = on ? "" : "#fb7185";
    });

    // ---- Prompt cards + launch ----
    mount.querySelectorAll(".prompt-card").forEach(function (b) {
      b.addEventListener("click", function () { openModal(agent, b.getAttribute("data-prompt")); });
    });
    var launch = document.getElementById("launch-btn");
    if (launch) launch.addEventListener("click", function () { openModal(agent, agent.prompts[0]); });

    // ---- FAQ accordion ----
    mount.querySelectorAll(".faq-trigger").forEach(function (t) {
      t.addEventListener("click", function () {
        var panel = t.nextElementSibling;
        var open = t.getAttribute("aria-expanded") === "true";
        t.setAttribute("aria-expanded", String(!open));
        panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
      });
    });

    if (window.lucide) window.lucide.createIcons();
    initReveal();
  }

  function section(id, title, inner) {
    return '<section id="' + id + '" class="mt-8 scroll-mt-24 reveal">' +
      '<h2 class="section-title text-xl mb-4">' + C.esc(title) + "</h2>" + inner + "</section>";
  }
  function meta(label, valueHtml) {
    return '<div><div class="text-xs uppercase tracking-wide text-[var(--text-faint)] mb-1">' + C.esc(label) + "</div>" +
      '<div class="text-sm font-medium">' + valueHtml + "</div></div>";
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.06 });
    items.forEach(function (i) { io.observe(i); });
  }

  // ---- Live Claude chat modal (bring-your-own-key + web search) ----
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
            '<div class="text-xs text-[var(--text-muted)]">Powered by Claude · ' + C.esc(window.AIClient ? window.AIClient.MODEL : "claude") + "</div></div>" +
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
      return '<div class="rounded-xl bg-white/5 border border-white/10 p-3 text-sm mb-3 whitespace-pre-wrap"><span class="' +
        (cls || "text-[var(--text-faint)]") + '">' + C.esc(who) + "</span><br>" + C.esc(text) + "</div>";
    }
    function aiBubble(text, sources) {
      var accent = "accent-" + C.esc(agent.color);
      var html = '<div class="rounded-xl bg-white/5 border border-white/10 p-3 text-sm mb-3"><span class="' + accent + '">' +
        C.esc(agent.name) + '</span><div class="mt-1 whitespace-pre-wrap">' + C.esc(text) + "</div>";
      if (sources && sources.length) {
        html += '<div class="mt-3 pt-3 border-t border-white/10"><div class="text-[11px] uppercase tracking-wide text-[var(--text-faint)] mb-1.5">Sources</div><div class="space-y-1">' +
          sources.map(function (s) {
            return '<a href="' + C.esc(s.url) + '" target="_blank" rel="noopener" class="flex items-start gap-1.5 text-xs ' + accent + ' hover:underline break-words">' +
              '<i data-lucide="external-link" class="mt-0.5 flex-none" style="width:12px;height:12px;"></i><span>' + C.esc(s.title || s.url) + "</span></a>";
          }).join("") + "</div></div>";
      }
      return html + "</div>";
    }

    function renderKeyForm() {
      body.innerHTML =
        '<div class="rounded-xl border border-white/10 bg-white/5 p-4">' +
          '<div class="flex items-center gap-2 font-semibold text-sm"><i data-lucide="key-round" class="accent-' + C.esc(agent.color) + '" style="width:16px;height:16px;"></i> Connect your Anthropic API key</div>' +
          '<p class="mt-2 text-xs text-[var(--text-muted)] leading-relaxed">This static site has no backend, so it uses <strong>your own</strong> key to talk to Claude. The key is stored only in this browser and sent directly to the Anthropic API.</p>' +
          '<input id="ai-key" type="password" autocomplete="off" placeholder="sk-ant-..." class="mt-3 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30" />' +
          '<div class="mt-3 flex items-center gap-2">' +
            '<button id="ai-save" class="btn btn-primary text-sm flex-1"><i data-lucide="plug" style="width:15px;height:15px;"></i> Save & connect</button>' +
            '<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener" class="btn btn-ghost text-sm">Get a key</a>' +
          "</div></div>" +
        '<div class="mt-4 text-xs text-[var(--text-faint)]">Example response (offline preview):</div>' +
        '<div class="mt-2">' + bubble(agent.name, (agent.examples[0] && agent.examples[0].output) || "", "accent-" + C.esc(agent.color)) + "</div>";
      footer.innerHTML = "";
      if (window.lucide) window.lucide.createIcons();
      var input = wrap.querySelector("#ai-key");
      function doSave() { var v = (input.value || "").trim(); if (!v) { input.focus(); return; } window.AIClient.setKey(v); renderChat(); }
      wrap.querySelector("#ai-save").addEventListener("click", doSave);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") doSave(); });
      input.focus();
    }

    function renderChat() {
      body.innerHTML = "";
      footer.innerHTML =
        '<form id="ai-form" class="flex items-end gap-2">' +
          '<textarea id="ai-input" rows="1" placeholder="Ask ' + C.esc(agent.name) + '…" class="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-white/30 resize-none"></textarea>' +
          '<button type="submit" id="ai-send" class="btn btn-primary text-sm"><i data-lucide="send" style="width:15px;height:15px;"></i></button>' +
        "</form>" +
        '<div class="mt-2 flex items-center justify-between text-[11px] text-[var(--text-faint)]">' +
          '<span class="inline-flex items-center gap-1"><i data-lucide="shield-check" style="width:12px;height:12px;"></i> Key stored in your browser only</span>' +
          '<button id="ai-forget" class="hover:text-white underline-offset-2 hover:underline">Forget key</button></div>';
      if (window.lucide) window.lucide.createIcons();
      var form = wrap.querySelector("#ai-form"), input = wrap.querySelector("#ai-input"), send = wrap.querySelector("#ai-send");
      wrap.querySelector("#ai-forget").addEventListener("click", function () { window.AIClient.clearKey(); renderKeyForm(); });
      input.value = prompt || ""; input.focus();
      function append(html) { body.insertAdjacentHTML("beforeend", html); body.scrollTop = body.scrollHeight; }
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = (input.value || "").trim(); if (!text) return;
        input.value = ""; send.disabled = true;
        append(bubble("You", text));
        var tid = "t" + body.children.length;
        append('<div id="' + tid + '" class="rounded-xl bg-white/5 border border-white/10 p-3 text-sm mb-3 text-[var(--text-muted)]"><span class="accent-' + C.esc(agent.color) + '">' + C.esc(agent.name) + "</span><br><span class='opacity-70'>Searching the web…</span></div>");
        window.AIClient.complete(agent, text).then(function (reply) {
          var el = document.getElementById(tid); if (el) el.outerHTML = aiBubble(reply.text, reply.sources);
          if (window.lucide) window.lucide.createIcons(); body.scrollTop = body.scrollHeight;
        }).catch(function (err) {
          var el = document.getElementById(tid), msg;
          if (err.status === 401) msg = "That API key was rejected (401). Use “Forget key” and try again.";
          else if (err.status === 429) msg = "Rate limited (429). Wait a moment and retry.";
          else msg = "Error: " + (err.message || "request failed") + ".";
          if (el) el.outerHTML = '<div class="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm mb-3 text-rose-200">' + C.esc(msg) + "</div>";
          body.scrollTop = body.scrollHeight;
        }).then(function () { send.disabled = false; input.focus(); });
      });
    }

    if (window.AIClient && window.AIClient.hasKey()) renderChat(); else renderKeyForm();
    if (window.lucide) window.lucide.createIcons();

    function close() { wrap.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    wrap.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", close); });
    document.addEventListener("keydown", onKey);
  }

  if (document.readyState !== "loading") setTimeout(render, 0);
  else document.addEventListener("DOMContentLoaded", function () { setTimeout(render, 0); });
})();
