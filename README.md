# Gaming AI Marketplace

A fully static marketplace of specialized AI agents built for gamers — game discovery, esports schedules, play-to-earn analysis, free games, vouchers, reviews and SEA gaming news. Inspired by the ChatGPT Store, HuggingFace Spaces, and Poe.

No backend, no build step, no framework. Open `index.html` and it runs.

## Tech

- HTML5 + semantic markup
- [Tailwind CSS](https://tailwindcss.com) via CDN
- Vanilla JavaScript (ES6) — modular components
- [Lucide](https://lucide.dev) icons
- Google Fonts (Inter)

Dark mode by default, mobile responsive, SEO-friendly (meta + Open Graph + Twitter Card + JSON-LD structured data), accessible (semantic HTML, ARIA, keyboard navigation), and animated.

## Structure

```
gaming-ai-marketplace/
├── index.html                 # Landing page: hero, search, categories, featured, grid
├── pages/                     # One detail page per agent
│   ├── game-discovery.html
│   ├── play-to-earn.html
│   ├── mobile-ranking.html
│   ├── sea-news.html
│   ├── free-games.html
│   ├── esports.html
│   ├── voucher.html
│   └── game-review.html
├── components/                # Reusable UI rendered with vanilla JS
│   ├── navbar.js
│   ├── footer.js
│   └── cards.js
├── assets/
│   ├── css/styles.css         # Design tokens, glassmorphism, animations
│   ├── js/main.js             # Homepage: render + live search + scroll reveal
│   ├── js/agent-detail.js     # Detail page renderer + demo modal + FAQ accordion
│   └── images/og.svg          # Social share image
└── data/
    ├── agents.js              # Runtime catalog (loads under file://)
    └── agents.json            # Canonical catalog (for tooling / a future API)
```

## Run locally

Just open the file:

```bash
open index.html
```

Or serve it (recommended so relative paths and icons load cleanly):

```bash
npx serve .        # or: python3 -m http.server
```

> The site reads its catalog from `data/agents.js` (a plain `<script>`) rather than
> fetching `data/agents.json`, so it works when opened directly from the filesystem —
> browsers block `fetch()` of local JSON over `file://`. The two files hold identical
> data; `agents.json` is kept as the canonical source for tooling and a future real API.

## Deploy to GitHub Pages

1. Push this folder to a repository.
2. In **Settings → Pages**, set the source to the branch and `/` (or `/gaming-ai-marketplace`) folder.
3. A `.nojekyll` file is included so asset folders are served as-is.

## Editing the catalog

Edit `data/agents.js` (the runtime source), then regenerate the JSON mirror:

```bash
node -e "global.window={}; require('./data/agents.js'); require('fs').writeFileSync('./data/agents.json', JSON.stringify(window.AGENTS,null,2)+'\n')"
```

Each agent supports: `id`, `name`, `category`, `description`, `icon` (Lucide name),
`status`, `tags`, `featured`, `page`, `color`, plus the detail-page content
(`tagline`, `capabilities`, `features`, `prompts`, `examples`, `useCases`, `faq`).

## Live AI (bring-your-own-key)

The "Launch AI" button and prompt cards open an interactive chat backed by the
[Anthropic Messages API](https://docs.anthropic.com/en/api/messages) (model
`claude-opus-4-5`). Because the site is fully static with no backend, it uses a
**bring-your-own-key** model:

- The visitor pastes their own Anthropic API key once. It is stored only in their
  browser's `localStorage` (`gaming_ai_anthropic_key`) and sent **directly** to
  `api.anthropic.com` — never to any other server. A "Forget key" control clears it.
- Browser calls are made with the `anthropic-dangerous-direct-browser-access: true`
  header, which enables CORS for client-side requests.
- Each agent answers in character via a system prompt generated from its catalog
  metadata (name, tagline, description, capabilities) in `assets/js/ai-client.js`.
- Without a key, the chat shows the agent's canned example response as an offline
  preview, so the site is still useful to browse.

The integration lives in [`assets/js/ai-client.js`](assets/js/ai-client.js) (API
client + key storage) and the modal in
[`assets/js/agent-detail.js`](assets/js/agent-detail.js).

> **Note on keys:** a client-side key is visible to the user who entered it (it's
> theirs) but should never be a key you don't want a browser to hold. For a
> shared/production key, put a small serverless proxy (Cloudflare Workers, Vercel)
> in front of the API and point `ENDPOINT` in `ai-client.js` at it instead.
