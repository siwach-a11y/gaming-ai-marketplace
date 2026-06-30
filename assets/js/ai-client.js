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
  // agent answers in character.
  function systemPromptFor(agent) {
    var caps = (agent.capabilities || []).map(function (c) { return "- " + c; }).join("\n");
    return (
      "You are " + agent.name + ", a specialized gaming AI agent in the Gaming AI Marketplace. " +
      (agent.tagline ? agent.tagline + " " : "") +
      agent.description + "\n\n" +
      "Your capabilities:\n" + caps + "\n\n" +
      "Answer the user's gaming question directly, concisely, and in a friendly, expert tone. " +
      "Use short paragraphs or compact lists. Stay within your domain (" + agent.category + "). " +
      "When a question asks for live data you cannot truly know in real time — today's exact rankings, " +
      "current prices, or whether a specific code still works — give a clear, plausible, well-reasoned " +
      "answer and briefly note that it may not reflect the latest live data."
    );
  }

  /**
   * Send a single-turn message to Claude.
   * @returns {Promise<string>} the assistant's text reply
   */
  function complete(agent, userText) {
    var key = getKey().trim();
    if (!key) return Promise.reject(new Error("NO_KEY"));

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
        max_tokens: 1024,
        system: systemPromptFor(agent),
        messages: [{ role: "user", content: userText }]
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
        // content is an array of blocks; concatenate the text blocks.
        var text = (data.content || [])
          .filter(function (b) { return b.type === "text"; })
          .map(function (b) { return b.text; })
          .join("\n")
          .trim();
        return text || "(No text response.)";
      });
    });
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
