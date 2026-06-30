/**
 * Navbar component.
 * Renders into <div id="navbar"></div>. Computes link prefixes from the
 * page's data-root attribute so it works from index.html and from /pages/*.
 */
(function () {
  function render() {
    const mount = document.getElementById("navbar");
    if (!mount) return;
    const root = document.body.getAttribute("data-root") || "";

    mount.innerHTML = `
      <header class="sticky top-0 z-50">
        <nav class="glass-strong border-b border-white/10" aria-label="Primary">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between gap-4">
              <a href="${root}index.html" class="flex items-center gap-2.5 font-extrabold tracking-tight">
                <span class="icon-tile tile-violet" style="width:2.25rem;height:2.25rem;border-radius:0.7rem;">
                  <i data-lucide="gamepad-2" class="accent-violet" style="width:18px;height:18px;"></i>
                </span>
                <span class="text-[1.05rem]">Gaming<span class="text-gradient">AI</span></span>
              </a>

              <div class="hidden md:flex items-center gap-1">
                <a href="${root}index.html#agents" class="px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition">Agents</a>
                <a href="${root}index.html#categories" class="px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition">Categories</a>
                <a href="${root}index.html#featured" class="px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition">Featured</a>
                <a href="https://github.com" target="_blank" rel="noopener" class="px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition inline-flex items-center gap-1.5">
                  <i data-lucide="github" style="width:15px;height:15px;"></i> GitHub
                </a>
              </div>

              <div class="flex items-center gap-2">
                <a href="${root}index.html#agents" class="btn btn-primary text-sm hidden sm:inline-flex">
                  <i data-lucide="sparkles" style="width:15px;height:15px;"></i> Explore Agents
                </a>
                <button id="nav-toggle" class="btn btn-ghost md:hidden p-2" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-mobile">
                  <i data-lucide="menu" style="width:18px;height:18px;"></i>
                </button>
              </div>
            </div>
          </div>

          <div id="nav-mobile" class="md:hidden hidden border-t border-white/10 px-4 py-3 space-y-1">
            <a href="${root}index.html#agents" class="block px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5">Agents</a>
            <a href="${root}index.html#categories" class="block px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5">Categories</a>
            <a href="${root}index.html#featured" class="block px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5">Featured</a>
            <a href="https://github.com" target="_blank" rel="noopener" class="block px-3 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5">GitHub</a>
          </div>
        </nav>
      </header>
    `;

    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-mobile");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        const open = menu.classList.toggle("hidden") === false;
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
