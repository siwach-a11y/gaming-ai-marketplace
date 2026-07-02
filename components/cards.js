/**
 * cards.js — reusable HTML builders for the dashboard UI. Exposed on
 * window.Cards so every page shares the same markup.
 */
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function statusBadge(status) {
    var isLive = String(status).toLowerCase() === "live";
    return '<span class="badge ' + (isLive ? "status-live" : "status-beta") + '"><span class="badge-dot"></span>' + esc(status) + "</span>";
  }

  function rating(agent) {
    return '<span class="rating"><i data-lucide="star" class="star" style="width:14px;height:14px;fill:currentColor;"></i>' + esc(agent.rating) + "</span>";
  }

  function tagPills(tags, max) {
    return (tags || []).slice(0, max || (tags || []).length)
      .map(function (t) { return '<span class="badge">' + esc(t) + "</span>"; }).join("");
  }

  function iconTile(agent, size) {
    var px = size || 48, inner = Math.round(px * 0.42);
    return '<span class="icon-tile tile-' + esc(agent.color) + " accent-" + esc(agent.color) + '" style="width:' + px + "px;height:" + px + 'px;">' +
      '<i data-lucide="' + esc(agent.icon) + '" style="width:' + inner + "px;height:" + inner + 'px;"></i></span>';
  }

  // Featured-style card: icon, name, description, AI badge + rating, Launch.
  function agentCard(agent, root) {
    root = root || "";
    return (
      '<article class="card p-5 flex flex-col h-full" data-name="' + esc(agent.name.toLowerCase()) + '"' +
        ' data-category="' + esc(agent.category.toLowerCase()) + '"' +
        ' data-desc="' + esc(agent.description.toLowerCase()) + '"' +
        ' data-tags="' + esc((agent.tags || []).join(" ").toLowerCase()) + '">' +
        '<div class="flex items-start justify-between gap-3">' + iconTile(agent, 52) + statusBadge(agent.status) + "</div>" +
        '<h3 class="mt-4 font-bold tracking-tight">' + esc(agent.name) + "</h3>" +
        '<p class="mt-1.5 text-sm text-[var(--text-muted)] leading-relaxed flex-1">' + esc(agent.description) + "</p>" +
        '<div class="mt-3 flex items-center justify-between">' +
          '<span class="badge badge-ai"><i data-lucide="sparkles" style="width:12px;height:12px;"></i> AI</span>' +
          rating(agent) +
        "</div>" +
        '<a href="' + root + esc(agent.page) + '" class="btn btn-primary w-full mt-4 text-sm"><i data-lucide="rocket" style="width:15px;height:15px;"></i> Launch</a>' +
      "</article>"
    );
  }

  // All-agents list card: icon left, name + description, rating.
  function listCard(agent, root) {
    root = root || "";
    return (
      '<a href="' + root + esc(agent.page) + '" class="card p-4 flex items-start gap-4" data-name="' + esc(agent.name.toLowerCase()) + '"' +
        ' data-category="' + esc(agent.category.toLowerCase()) + '"' +
        ' data-desc="' + esc(agent.description.toLowerCase()) + '"' +
        ' data-tags="' + esc((agent.tags || []).join(" ").toLowerCase()) + '">' +
        iconTile(agent, 46) +
        '<span class="min-w-0 flex-1">' +
          '<span class="flex items-center gap-2"><span class="font-semibold truncate">' + esc(agent.name) + "</span>" +
            '<span class="badge badge-ai flex-none"><i data-lucide="sparkles" style="width:11px;height:11px;"></i> AI</span></span>' +
          '<span class="block text-sm text-[var(--text-muted)] mt-1 leading-relaxed">' + esc(agent.description) + "</span>" +
          '<span class="mt-2 inline-flex">' + rating(agent) + "</span>" +
        "</span>" +
        '<i data-lucide="arrow-up-right" class="text-[var(--text-muted)] flex-none" style="width:16px;height:16px;"></i>' +
      "</a>"
    );
  }

  function relatedCard(agent, root) {
    root = root || "";
    return (
      '<a href="' + root + esc(agent.page) + '" class="card p-4 flex items-center gap-3">' +
        iconTile(agent, 40) +
        '<span class="min-w-0"><span class="block font-semibold text-sm truncate">' + esc(agent.name) + "</span>" +
        '<span class="block text-xs text-[var(--text-muted)] truncate">' + esc(agent.category) + "</span></span>" +
        '<i data-lucide="arrow-right" class="ml-auto text-[var(--text-muted)]" style="width:16px;height:16px;"></i>' +
      "</a>"
    );
  }

  function featureCard(f) {
    return (
      '<div class="card p-4 flex items-start gap-3">' +
        '<span class="icon-tile tile-violet accent-violet flex-none" style="width:38px;height:38px;border-radius:0.65rem;"><i data-lucide="' + esc(f.icon) + '" style="width:17px;height:17px;"></i></span>' +
        '<span><span class="block font-semibold text-sm">' + esc(f.title) + "</span>" +
        '<span class="block text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">' + esc(f.text) + "</span></span>" +
      "</div>"
    );
  }

  window.Cards = { esc: esc, statusBadge: statusBadge, rating: rating, tagPills: tagPills, iconTile: iconTile, agentCard: agentCard, listCard: listCard, relatedCard: relatedCard, featureCard: featureCard };
})();
