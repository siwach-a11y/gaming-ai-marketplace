/**
 * main.js — homepage behavior: render featured + grid, category chips,
 * live search filtering, and scroll-reveal animations.
 */
(function () {
  var agents = window.AGENTS || [];

  var CATEGORIES = [
    { name: "Gaming", icon: "gamepad-2", match: ["Discovery", "Mobile"] },
    { name: "Esports", icon: "trophy", match: ["Esports"] },
    { name: "Blockchain", icon: "coins", match: ["Blockchain"] },
    { name: "Reviews", icon: "star", match: ["Reviews"] },
    { name: "News", icon: "newspaper", match: ["News"] },
    { name: "Mobile", icon: "smartphone", match: ["Mobile"] },
    { name: "Rewards", icon: "gift", match: ["Rewards"] },
    { name: "Discovery", icon: "compass", match: ["Discovery"] }
  ];

  function renderCategories() {
    var el = document.getElementById("category-grid");
    if (!el) return;
    el.innerHTML = CATEGORIES.map(function (c) {
      var count = agents.filter(function (a) {
        return c.match.indexOf(a.category) !== -1;
      }).length;
      return (
        '<button type="button" class="card p-5 text-left category-chip" data-category="' +
        c.match.join("|").toLowerCase() +
        '">' +
        '<span class="icon-tile tile-violet accent-violet" style="width:42px;height:42px;border-radius:0.7rem;">' +
        '<i data-lucide="' + c.icon + '" style="width:19px;height:19px;"></i></span>' +
        '<h3 class="mt-3 font-semibold">' + c.name + "</h3>" +
        '<p class="text-xs text-[var(--text-muted)] mt-0.5">' + count + " agent" + (count === 1 ? "" : "s") + "</p>" +
        "</button>"
      );
    }).join("");

    el.querySelectorAll(".category-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var input = document.getElementById("search-input");
        if (input) {
          // Filter the grid by the first category keyword.
          input.value = chip.getAttribute("data-category").split("|")[0];
          applyFilter();
          document.getElementById("agents").scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  function renderFeatured() {
    var el = document.getElementById("featured-grid");
    if (!el) return;
    var featured = agents.filter(function (a) { return a.featured; });
    el.innerHTML = featured.map(function (a) { return window.Cards.agentCard(a, ""); }).join("");
  }

  function renderGrid() {
    var el = document.getElementById("agent-grid");
    if (!el) return;
    el.innerHTML = agents.map(function (a) { return window.Cards.agentCard(a, ""); }).join("");
  }

  function applyFilter() {
    var input = document.getElementById("search-input");
    var empty = document.getElementById("search-empty");
    var grid = document.getElementById("agent-grid");
    if (!input || !grid) return;
    var q = input.value.trim().toLowerCase();
    var shown = 0;

    grid.querySelectorAll("[data-name]").forEach(function (card) {
      var hay =
        card.getAttribute("data-name") + " " +
        card.getAttribute("data-category") + " " +
        card.getAttribute("data-desc") + " " +
        card.getAttribute("data-tags");
      var hit = q === "" || hay.indexOf(q) !== -1;
      card.style.display = hit ? "" : "none";
      if (hit) shown++;
    });

    if (empty) empty.classList.toggle("hidden", shown !== 0);
    var counter = document.getElementById("result-count");
    if (counter) counter.textContent = shown + " of " + agents.length;
  }

  function initSearch() {
    var input = document.getElementById("search-input");
    if (!input) return;
    input.addEventListener("input", applyFilter);
    var clear = document.getElementById("search-clear");
    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        applyFilter();
        input.focus();
      });
    }
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (i) { io.observe(i); });
  }

  function init() {
    renderCategories();
    renderFeatured();
    renderGrid();
    initSearch();
    applyFilter();
    initReveal();
    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
