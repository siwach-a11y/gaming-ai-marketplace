/**
 * App shell: left sidebar + top bar. Renders into #sidebar and #topbar.
 * Link prefixes derive from document.body[data-root] so it works from the
 * homepage and from /pages/*. Also wires the dark/light toggle, the mobile
 * drawer, and (on the homepage) leaves the search input for main.js to filter.
 */
(function () {
  var NAV = [
    { label: "Home", icon: "home", href: "index.html" },
    { label: "All Agents", icon: "layout-grid", href: "index.html#agents" },
    { label: "Categories", icon: "shapes", href: "index.html#categories" },
    { label: "Featured", icon: "star", href: "index.html#featured" },
    { label: "Trending", icon: "trending-up", href: "index.html#agents" },
    { label: "New Agents", icon: "sparkles", href: "index.html#agents" },
    { label: "About Us", icon: "info", href: "#" }
  ];

  function render() {
    var root = document.body.getAttribute("data-root") || "";
    var active = document.body.getAttribute("data-nav") || "Home";
    var sidebar = document.getElementById("sidebar");
    var topbar = document.getElementById("topbar");

    if (sidebar) {
      sidebar.className = "sidebar";
      sidebar.innerHTML =
        '<a href="' + root + 'index.html" class="flex items-center gap-2.5 px-2 pb-4 font-extrabold tracking-tight">' +
          '<span class="icon-tile tile-violet accent-violet" style="width:2.25rem;height:2.25rem;border-radius:0.7rem;"><i data-lucide="gamepad-2" style="width:18px;height:18px;"></i></span>' +
          '<span class="leading-tight">GAMING<br><span class="text-[0.62rem] tracking-[0.2em] text-[var(--text-faint)] font-semibold">AI MARKETPLACE</span></span>' +
        "</a>" +
        '<nav class="flex-1 space-y-1 mt-2" aria-label="Primary">' +
          NAV.map(function (n) {
            return '<a href="' + root + n.href + '" class="nav-link' + (n.label === active ? " active" : "") + '">' +
              '<i data-lucide="' + n.icon + '" style="width:18px;height:18px;"></i> ' + n.label + "</a>";
          }).join("") +
        "</nav>" +
        '<div class="mt-4 rounded-xl p-4" style="background:linear-gradient(135deg,rgba(124,92,255,0.18),rgba(34,211,238,0.10));border:1px solid rgba(124,92,255,0.3);">' +
          '<div class="font-semibold text-sm">Become a Creator</div>' +
          '<p class="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">Build your own AI agent and publish to millions of gamers.</p>' +
          '<a href="#" class="btn btn-primary w-full mt-3 text-xs">Learn More</a>' +
        "</div>" +
        '<button id="theme-toggle" class="flex items-center justify-between gap-2 mt-4 px-2 py-2 rounded-lg hover:bg-[var(--surface-strong)] transition" aria-label="Toggle dark mode">' +
          '<span class="flex items-center gap-2 text-sm text-[var(--text-muted)]"><i data-lucide="moon" style="width:16px;height:16px;"></i> Dark Mode</span>' +
          '<span class="switch" role="switch"></span>' +
        "</button>";
    }

    if (topbar) {
      topbar.className = "topbar";
      topbar.innerHTML =
        '<button id="menu-toggle" class="btn btn-ghost p-2 lg:hidden" aria-label="Open menu"><i data-lucide="menu" style="width:18px;height:18px;"></i></button>' +
        '<label class="searchbar" for="search-input">' +
          '<i data-lucide="search" style="width:17px;height:17px;" class="text-[var(--text-muted)]"></i>' +
          '<input id="search-input" type="search" autocomplete="off" placeholder="Search agents..." />' +
          '<span class="sr-only">Search agents</span>' +
        "</label>" +
        '<button class="relative btn btn-ghost p-2" aria-label="Notifications">' +
          '<i data-lucide="bell" style="width:18px;height:18px;"></i>' +
          '<span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-400"></span>' +
        "</button>";
    }

    // Mobile drawer
    var menuToggle = document.getElementById("menu-toggle");
    if (menuToggle && sidebar) {
      menuToggle.addEventListener("click", function () {
        sidebar.classList.add("open");
        var scrim = document.createElement("div");
        scrim.className = "sidebar-scrim";
        scrim.addEventListener("click", function () { sidebar.classList.remove("open"); scrim.remove(); });
        document.body.appendChild(scrim);
      });
    }

    // Theme toggle (persisted)
    var themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var el = document.documentElement;
        var toLight = el.classList.contains("dark");
        el.classList.toggle("dark", !toLight);
        el.classList.toggle("light", toLight);
        try { localStorage.setItem("gaming_ai_theme", toLight ? "light" : "dark"); } catch (e) {}
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Apply saved theme ASAP.
  try {
    var saved = localStorage.getItem("gaming_ai_theme");
    if (saved === "light") { document.documentElement.classList.remove("dark"); document.documentElement.classList.add("light"); }
  } catch (e) {}

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
