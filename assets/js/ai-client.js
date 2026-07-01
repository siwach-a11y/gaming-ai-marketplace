/**
 * ai-client.js — bring-your-own-key Claude integration for the static site.
 *
 * The marketplace is hosted on GitHub Pages with no backend, so there is
 * nowhere to keep a secret API key. Instead each visitor supplies their own
 * Anthropic API key, which is stored only in their browser's localStorage and
 * sent directly to the Anthropic API from the page.
 *
 * Calls go straight to the Messages API using the documented
 * `anthropic-dangerous-direct-browser-access` header, which enables CORS for
 * browser-originated requests. Model: claude-opus-4-8. Responses are short
 * gaming-assistant replies, so we use a small max_tokens and skip extended
 * thinking to keep latency low.
 */
(function () {
  var STORAGE_KEY = "gaming_ai_anthropic_key";
  var ENDPOINT = "https://api.anthropic.com/v1/messages";
  var MODEL = "claude-opus-4-8";
  var API_VERSION = "2023-06-01";

  function getKey() {
    try { return localStorage.getItem(STORAGE_KEY) || ""; } catch (e) { return ""; }
  }
  function setKey(k) {
    try { localStorage.setItem(STORAGE_KEY, k); } catch (e) {}
  }
  function clearKey() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }
  function hasKey() {
    return getKey().trim().length > 0;
  }

  // Build a focused system prompt from the agent's catalog metadata so each
  // agent answers in character — and instruct it to use web search + cite links.
  function systemPromptFor(agent) {
    var caps = (agent.capabilities || []).map(function (c) { return "- " + c; }).join("\n");
    return (
      "You are " + agent.name + ", a specialized gaming AI agent in the Gaming AI Marketplace. " +
      (agent.tagline ? agent.tagline + " " : "") +
      agent.description + "\n\n" +
      "Your capabilities:\n" + caps + "\n\n" +
      "Answer the user's gaming question directly, concisely, and in a friendly, expert tone. " +
      "Use short paragraphs or compact lists. Stay within your domain (" + agent.category + ").\n\n" +
      "You have a web_search tool. Whenever the answer depends on current information — news, today's " +
      "rankings, prices, giveaways, redeem codes, patch notes, release dates, esports schedules, or reviews " +
      "— search the web first and base your answer on what you find. Cite the specific sources you used, " +
      "and prefer recent, reputable ones."
    );
  }

  // Collect the answer text and cited source links from all assistant turns.
  function collectResult(messages) {
    var text = "";
    var sources = [];
    var seen = {};
    function addSource(url, title) {
      if (!url || seen[url]) return;
      seen[url] = true;
      sources.push({ url: url, title: title || url });
    }
    messages.forEach(function (m) {
      if (m.role !== "assistant" || !Array.isArray(m.content)) return;
      m.content.forEach(function (b) {
        if (b.type === "text") {
          text += b.text;
          (b.citations || []).forEach(function (c) { addSource(c.url, c.title); });
        } else if (b.type === "web_search_tool_result") {
          // Fallback: if the model didn't attach inline citations, surface the results.
          (Array.isArray(b.content) ? b.content : []).forEach(function (r) {
            if (r && r.type === "web_search_result") addSource(r.url, r.title);
          });
        }
      });
    });
    return { text: text.trim() || "(No text response.)", sources: sources };
  }

  /**
   * Send a message to Claude with web search enabled. Handles the server-side
   * tool loop (`pause_turn`) transparently.
   * @returns {Promise<{text:string, sources:{url:string,title:string}[]}>}
   */
  function complete(agent, userText) {
    var key = getKey().trim();
    if (!key) return Promise.reject(new Error("NO_KEY"));

    var messages = [{ role: "user", content: userText }];
    var MAX_ROUNDS = 4;

    function round(n) {
      return fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": API_VERSION,
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 2048,
          system: systemPromptFor(agent),
          messages: messages,
          tools: [{ type: "web_search_20260209", name: "web_search" }]
        })
      }).then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) {
            var msg = (data && data.error && data.error.message) || ("HTTP " + res.status);
            var err = new Error(msg);
            err.status = res.status;
            throw err;
          }
          if (data.stop_reason === "refusal") {
            throw new Error("The request was declined by the model's safety system. Try rephrasing.");
          }
          messages.push({ role: "assistant", content: data.content });
          // Server-side tool loop hit its iteration cap — resume.
          if (data.stop_reason === "pause_turn" && n < MAX_ROUNDS) {
            return round(n + 1);
          }
          return collectResult(messages);
        });
      });
    }

    return round(0);
  }

  window.AIClient = {
    getKey: getKey,
    setKey: setKey,
    clearKey: clearKey,
    hasKey: hasKey,
    complete: complete,
    MODEL: MODEL
  };
})();
