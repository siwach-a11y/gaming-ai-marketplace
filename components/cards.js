/**
 * cards.js — reusable HTML builders for agent cards, badges and tags.
 * Exposed on window.Cards so every page can share the same markup.
 */
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function statusBadge(status) {
    const isLive = String(status).toLowerCase() === "live";
    const cls = isLive ? "status-live" : "status-beta";
    return `<span class="badge ${cls}"><span class="badge-dot"></span>${esc(status)}</span>`;
  }

  function tagPills(tags, max) {
    const list = (tags || []).slice(0, max || tags.length);
    return list
      .map(function (t) {
        return `<span class="badge">${esc(t)}</span>`;
      })
      .join("");
  }

  function iconTile(agent, size) {
    const px = size || 48;
    const inner = Math.round(px * 0.42);
    return `<span class="icon-tile tile-${esc(agent.color)} accent-${esc(agent.color)}" style="width:${px}px;height:${px}px;">
      <i data-lucide="${esc(agent.icon)}" style="width:${inner}px;height:${inner}px;"></i>
    </span>`;
  }

  /**
   * Full agent card used in the grid and featured rail.
   * @param {object} agent
   * @param {string} root - path prefix to project root ("" or "../")
   */
  function agentCard(agent, root) {
    root = root || "";
    return `
      <article class="card group p-5 flex flex-col h-full" data-name="${esc(agent.name.toLowerCase())}"
               data-category="${esc(agent.category.toLowerCase())}"
               data-desc="${esc(agent.description.toLowerCase())}"
               data-tags="${esc((agent.tags || []).join(" ").toLowerCase())}">
        <div class="flex items-start justify-between gap-3">
          ${iconTile(agent, 48)}
          ${statusBadge(agent.status)}
        </div>
        <h3 class="mt-4 text-lg font-bold tracking-tight">${esc(agent.name)}</h3>
        <p class="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed flex-1">${esc(agent.description)}</p>
        <div class="mt-4 flex flex-wrap gap-1.5">
          <span class="badge accent-${esc(agent.color)}">${esc(agent.category)}</span>
          ${tagPills(agent.tags, 3)}
        </div>
        <div class="mt-5 flex items-center gap-2">
          <a href="${root}${esc(agent.page)}" class="btn btn-primary text-sm flex-1">
            <i data-lucide="rocket" style="width:15px;height:15px;"></i> Launch
          </a>
          <a href="${root}${esc(agent.page)}" class="btn btn-ghost text-sm" aria-label="View details for ${esc(agent.name)}">
            <i data-lucide="arrow-up-right" style="width:15px;height:15px;"></i>
          </a>
        </div>
      </article>
    `;
  }

  /** Compact related-agent card for detail pages. */
  function relatedCard(agent, root) {
    root = root || "";
    return `
      <a href="${root}${esc(agent.page)}" class="card p-4 flex items-center gap-3">
        ${iconTile(agent, 40)}
        <span class="min-w-0">
          <span class="block font-semibold text-sm truncate">${esc(agent.name)}</span>
          <span class="block text-xs text-[var(--text-muted)] truncate">${esc(agent.category)}</span>
        </span>
        <i data-lucide="arrow-right" class="ml-auto text-[var(--text-muted)]" style="width:16px;height:16px;"></i>
      </a>
    `;
  }

  function featureCard(f) {
    return `
      <div class="card p-5">
        <span class="icon-tile tile-violet accent-violet" style="width:40px;height:40px;border-radius:0.7rem;">
          <i data-lucide="${esc(f.icon)}" style="width:18px;height:18px;"></i>
        </span>
        <h4 class="mt-3 font-semibold">${esc(f.title)}</h4>
        <p class="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">${esc(f.text)}</p>
      </div>
    `;
  }

  window.Cards = { esc: esc, statusBadge: statusBadge, tagPills: tagPills, iconTile: iconTile, agentCard: agentCard, relatedCard: relatedCard, featureCard: featureCard };
})();
