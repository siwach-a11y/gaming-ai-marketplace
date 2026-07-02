/**
 * main.js — homepage: stats, categories, featured grid, all-agents list,
 * live search filtering, and scroll-reveal.
 */
(function () {
  var agents = window.AGENTS || [];
  var C = window.Cards;

  var STATS = [
    { icon: "bot", value: "8", label: "AI Agents", color: "violet" },
    { icon: "users", value: "50K+", label: "Happy Gamers", color: "emerald" },
    { icon: "bar-chart-3", value: "100K+", label: "Queries Processed", color: "sky" },
    { icon: "zap", value: "24/7", label: "AI Assistance", color: "amber" }
  ];

  var CATEGORIES = [
    { name: "Gaming", icon: "gamepad-2", color: "violet", match: ["Discovery", "Mobile"] },
    { name: "Esports", icon: "trophy", color: "amber", match: ["Esports"] },
    { name: "Blockchain", icon: "boxes", color: "emerald", match: ["Blockchain"] },
    { name: "Reviews", icon: "star", color: "teal", match: ["Reviews"] },
    { name: "News", icon: "newspaper", color: "sky", match: ["News"] },
    { name: "Mobile", icon: "smartphone", color: "indigo", match: ["Mobile"] },
    { name: "Rewards", icon: "gift", color: "rose", match: ["Rewards"] },
    { name: "Discovery", icon: "compass", color: "fuchsia", match: ["Discovery"] }
  ];

  function renderStats() {
    var el = document.getElementById("stats-grid");
    if (!el) return;
    el.innerHTML = STATS.map(function (s) {
      return '<div class="stat">' +
        '<span class="icon-tile tile-' + s.color + " accent-" + s.color + '" style="width:44px;height:44px;"><i data-lucide="' + s.icon + '" style="width:20px;height:20px;"></i></span>' +
        '<span><span class="block text-xl font-extrabold">' + s.value + "</span>" +
        '<span class="block text-xs text-[var(--text-muted)]">' + s.label + "</span></span></div>";
    }).join("");
  }

  function renderCategories() {
    var el = document.getElementById("category-grid");
    if (!el) return;
    el.innerHTML = CATEGORIES.map(function (c) {
      return '<button type="button" class="cat-tile" data-cat="' + c.match[0].toLowerCase() + '">' +
        '<span class="icon-tile tile-' + c.color + " accent-" + c.color + '" style="width:46px;height:46px;"><i data-lucide="' + c.icon + '" style="width:22px;height:22px;"></i></span>' +
        '<span class="text-sm font-semibold">' + c.name + "</span></button>";
    }).join("");
    el.querySelectorAll(".cat-tile").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var input = document.getElementById("search-input");
        if (input) { input.value = chip.getAttribute("data-cat"); applyFilter(); }
        var t = document.getElementById("agents"); if (t) t.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function renderFeatured() {
    var el = document.getElementById("featured-grid");
    if (!el) return;
    el.innerHTML = agents.filter(function (a) { return a.featured; })
      .map(function (a) { return C.agentCard(a, ""); }).join("");
  }

  function renderGrid() {
    var el = document.getElementById("agent-grid");
    if (!el) return;
    el.innerHTML = agents.map(function (a) { return C.listCard(a, ""); }).join("");
  }

  function applyFilter() {
    var input = document.getElementById("search-input");
    if (!input) return;
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    document.querySelectorAll("#agent-grid [data-name]").forEach(function (card) {
      var hay = card.getAttribute("data-name") + " " + card.getAttribute("data-category") + " " +
        card.getAttribute("data-desc") + " " + card.getAttribute("data-tags");
      var hit = q === "" || hay.indexOf(q) !== -1;
      card.style.display = hit ? "" : "none";
      if (hit) shown++;
    });
    var empty = document.getElementById("search-empty");
    if (empty) empty.classList.toggle("hidden", shown !== 0);
  }

  function initSearch() {
    var input = document.getElementById("search-input");
    if (input) input.addEventListener("input", applyFilter);
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    items.forEach(function (i) { io.observe(i); });
  }

  function init() {
    renderStats();
    renderCategories();
    renderFeatured();
    renderGrid();
    initSearch();
    applyFilter();
    initReveal();
    if (window.lucide) window.lucide.createIcons();
  }

  // The topbar (with #search-input) is injected by navbar.js; run after it.
  if (document.readyState !== "loading") setTimeout(init, 0);
  else document.addEventListener("DOMContentLoaded", function () { setTimeout(init, 0); });
})();
