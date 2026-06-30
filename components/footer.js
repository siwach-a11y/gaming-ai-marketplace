/**
 * Footer component. Renders into <div id="footer"></div>.
 * Link prefixes derive from document.body[data-root].
 */
(function () {
  function render() {
    const mount = document.getElementById("footer");
    if (!mount) return;
    const root = document.body.getAttribute("data-root") || "";
    const year = document.body.getAttribute("data-year") || "2026";

    mount.innerHTML = `
      <footer class="mt-24 border-t border-white/10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid gap-10 md:grid-cols-4">
            <div class="md:col-span-1">
              <a href="${root}index.html" class="flex items-center gap-2.5 font-extrabold tracking-tight">
                <span class="icon-tile tile-violet" style="width:2.25rem;height:2.25rem;border-radius:0.7rem;">
                  <i data-lucide="gamepad-2" class="accent-violet" style="width:18px;height:18px;"></i>
                </span>
                <span>Gaming<span class="text-gradient">AI</span></span>
              </a>
              <p class="mt-4 text-sm text-[var(--text-muted)] max-w-xs">
                A marketplace of specialized AI agents built for gamers — discovery, esports, rewards, reviews and more.
              </p>
            </div>

            <nav aria-label="Marketplace">
              <h3 class="text-sm font-semibold text-white mb-3">Marketplace</h3>
              <ul class="space-y-2 text-sm text-[var(--text-muted)]">
                <li><a class="hover:text-white transition" href="${root}index.html#agents">All Agents</a></li>
                <li><a class="hover:text-white transition" href="${root}index.html#featured">Featured</a></li>
                <li><a class="hover:text-white transition" href="${root}index.html#categories">Categories</a></li>
              </ul>
            </nav>

            <nav aria-label="Company">
              <h3 class="text-sm font-semibold text-white mb-3">Company</h3>
              <ul class="space-y-2 text-sm text-[var(--text-muted)]">
                <li><a class="hover:text-white transition" href="#">About</a></li>
                <li><a class="hover:text-white transition" href="#">Privacy</a></li>
                <li><a class="hover:text-white transition" href="#">Terms</a></li>
              </ul>
            </nav>

            <nav aria-label="Resources">
              <h3 class="text-sm font-semibold text-white mb-3">Resources</h3>
              <ul class="space-y-2 text-sm text-[var(--text-muted)]">
                <li><a class="hover:text-white transition inline-flex items-center gap-1.5" href="https://github.com" target="_blank" rel="noopener"><i data-lucide="github" style="width:14px;height:14px;"></i> GitHub</a></li>
                <li><a class="hover:text-white transition" href="#">Documentation</a></li>
                <li><a class="hover:text-white transition" href="#">Status</a></li>
              </ul>
            </nav>
          </div>

          <div class="divider my-8"></div>
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-faint)]">
            <p>© ${year} GamingAI Marketplace. Built as a static demo.</p>
            <div class="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener" class="hover:text-white transition" aria-label="GitHub"><i data-lucide="github" style="width:18px;height:18px;"></i></a>
              <a href="#" class="hover:text-white transition" aria-label="Discord"><i data-lucide="message-circle" style="width:18px;height:18px;"></i></a>
              <a href="#" class="hover:text-white transition" aria-label="X"><i data-lucide="twitter" style="width:18px;height:18px;"></i></a>
            </div>
          </div>
        </div>
      </footer>
    `;

    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
