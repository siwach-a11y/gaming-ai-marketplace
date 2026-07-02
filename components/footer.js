/**
 * Footer component. Renders into <div id="footer"></div>.
 * Column links are decorative (#) except the marketplace/GitHub links.
 */
(function () {
  function render() {
    var mount = document.getElementById("footer");
    if (!mount) return;
    var root = document.body.getAttribute("data-root") || "";
    var year = document.body.getAttribute("data-year") || "2026";

    mount.innerHTML =
      '<footer class="mt-16 border-t border-[var(--border)]">' +
        '<div class="px-4 sm:px-6 lg:px-8 py-10 max-w-[1200px] mx-auto">' +
          '<div class="grid gap-8 md:grid-cols-4">' +
            '<div>' +
              '<a href="' + root + 'index.html" class="flex items-center gap-2.5 font-extrabold tracking-tight">' +
                '<span class="icon-tile tile-violet accent-violet" style="width:2rem;height:2rem;border-radius:0.6rem;"><i data-lucide="gamepad-2" style="width:16px;height:16px;"></i></span>' +
                '<span>GAMING<span class="text-gradient"> AI</span></span></a>' +
              '<p class="mt-3 text-sm text-[var(--text-muted)] max-w-xs">The ultimate marketplace for AI agents built specifically for gamers. Discover, explore, and level up your gaming experience with AI.</p>' +
              '<div class="mt-4 flex items-center gap-3 text-[var(--text-muted)]">' +
                '<a href="#" class="hover:text-white transition" aria-label="Discord"><i data-lucide="message-circle" style="width:18px;height:18px;"></i></a>' +
                '<a href="#" class="hover:text-white transition" aria-label="X"><i data-lucide="twitter" style="width:18px;height:18px;"></i></a>' +
                '<a href="https://github.com" target="_blank" rel="noopener" class="hover:text-white transition" aria-label="GitHub"><i data-lucide="github" style="width:18px;height:18px;"></i></a>' +
                '<a href="#" class="hover:text-white transition" aria-label="YouTube"><i data-lucide="youtube" style="width:18px;height:18px;"></i></a>' +
              "</div>" +
            "</div>" +
            col("Marketplace", [["All Agents", root + "index.html#agents"], ["Categories", root + "index.html#categories"], ["Featured", root + "index.html#featured"], ["Trending", root + "index.html#agents"], ["New Agents", root + "index.html#agents"]]) +
            col("Resources", [["Guides", "#"], ["Blog", "#"], ["Help Center", "#"], ["API Docs", "#"], ["Community", "#"]]) +
            col("Legal", [["Privacy Policy", "#"], ["Terms of Service", "#"], ["Cookie Policy", "#"], ["Disclaimer", "#"]]) +
          "</div>" +
          '<div class="divider my-8"></div>' +
          '<p class="text-sm text-[var(--text-faint)]">© ' + year + " Gaming AI Marketplace. All rights reserved.</p>" +
        "</div>" +
      "</footer>";

    if (window.lucide) window.lucide.createIcons();
  }

  function col(title, links) {
    return '<nav aria-label="' + title + '"><h3 class="text-sm font-semibold mb-3">' + title + "</h3>" +
      '<ul class="space-y-2 text-sm text-[var(--text-muted)]">' +
      links.map(function (l) { return '<li><a class="hover:text-white transition" href="' + l[1] + '">' + l[0] + "</a></li>"; }).join("") +
      "</ul></nav>";
  }

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
