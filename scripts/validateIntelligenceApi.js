/* global process */
import { readFile } from "node:fs/promises";
import { onRequest, onRequestPost } from "../functions/api/intelligence.js";
import { parseIntelligenceApiRequest } from "../src/intelligence/engine/intelligenceApiContract.js";
import { runIntelligence } from "../src/intelligence/engine/runIntelligence.js";
import { isApprovedIntelligencePath } from "../src/intelligence/engine/intelligenceAllowlist.js";
import { isValidIntelligenceResponse } from "../src/intelligence/engine/intelligenceTypes.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

async function post(body, { raw = false, method = "POST" } = {}) {
  const request = new Request("https://foinwi.com/api/intelligence", {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: raw ? body : JSON.stringify(body),
  });
  return onRequestPost({ request });
}

async function readError(response) {
  const payload = await response.json();
  return payload?.error ?? {};
}

const functionSource = await readFile(new URL("../functions/api/intelligence.js", import.meta.url), "utf8");
const clientSource = await readFile(new URL("../src/services/intelligenceClient.js", import.meta.url), "utf8");
const contractSource = await readFile(new URL("../src/intelligence/engine/intelligenceApiContract.js", import.meta.url), "utf8");

assert(functionSource.includes("onRequestPost"), "API function must handle POST");
assert(functionSource.includes("../../src/intelligence/engine/runIntelligence.js"), "API must import the shared engine");
assert(!/GUIDE_INTENTS|createIntent\(|simpleAnswer:/u.test(functionSource), "API must not duplicate intent catalogs");
assert(!/GUIDE_RESOURCE_CATALOG\s*=/u.test(functionSource), "API must not duplicate the resource catalog");
assert(!/\b(openai|anthropic|claude|gemini|groq|n8n)\b/iu.test(`${functionSource}\n${clientSource}\n${contractSource}`), "API/client must not reference AI providers or n8n");
assert(!/api\.openai|generativelanguage\.googleapis|api\.anthropic/iu.test(`${functionSource}\n${clientSource}`), "API/client must not include provider URLs");
assert(!/\bconsole\.log\b/u.test(functionSource), "API must not log in production");
assert(!/\b(localStorage|sessionStorage|document\.cookie|indexedDB)\b/u.test(`${functionSource}\n${clientSource}`), "API/client must not persist prompts");
assert(clientSource.includes('"/api/intelligence"'), "Client must call the same-origin Intelligence API");
assert(!/https?:\/\//u.test(clientSource), "Client must not include an absolute provider URL");
assert(!/\bstack\b|\berror\.message\b|\berror\.stack\b/u.test(functionSource), "API must not leak raw errors");

const valid = await post({ query: "How does SIP work?" });
const validPayload = await valid.json();
assert(valid.status === 200, `Valid request should return 200, got ${valid.status}`);
assert(isValidIntelligenceResponse(validPayload, isApprovedIntelligencePath), "Valid request must return an IntelligenceResponse");
assert(validPayload.usedModel === false, "API usedModel must remain false");
assert(validPayload.responseType === "SUPPORTED", "SIP query should be SUPPORTED");
assert(validPayload.intent === "invest-sip", `Expected invest-sip, got ${validPayload.intent}`);
validPayload.suggestedActions.forEach((action) => {
  assert(isApprovedIntelligencePath(action.path), `API returned unapproved path ${action.path}`);
});

const local = runIntelligence({ query: "How does SIP work?" });
assert(JSON.stringify(validPayload) === JSON.stringify(local), "API must wrap the same deterministic engine result");

const safety = await post({ query: "Which stock should I buy?" });
const safetyPayload = await safety.json();
assert(safety.status === 200 && safetyPayload.responseType === "SAFETY", "SAFETY is a successful Intelligence response, not a server error");

const empty = await post({ query: "   " });
const emptyError = await readError(empty);
assert(empty.status === 400 && emptyError.code === "empty-query", "Empty query must be rejected");

const overlength = await post({ query: "a".repeat(401) });
const overlengthError = await readError(overlength);
assert(overlength.status === 400 && overlengthError.code === "query-too-long", "Overlength query must be rejected");

const malformed = await post("{", { raw: true });
const malformedError = await readError(malformed);
assert(malformed.status === 400 && malformedError.code === "invalid-request", "Malformed JSON must be rejected");

const surface = await post({ query: "SIP", surface: "admin-panel" });
const surfaceError = await readError(surface);
assert(surface.status === 400 && surfaceError.code === "invalid-surface", "Unsupported surface must be rejected");

const history = await post({ query: "SIP", conversationHistory: [{ role: "user", text: "hi" }] });
const historyError = await readError(history);
assert(history.status === 400 && historyError.code === "invalid-request", "Conversation history must be rejected");

const getResponse = await onRequest({
  request: new Request("https://foinwi.com/api/intelligence", { method: "GET" }),
});
const getError = await readError(getResponse);
assert(getResponse.status === 405 && getError.code === "method-not-allowed", "GET must return 405");
assert(!/\bstack\b|intelligence\\\\engine|D:\\\\/u.test(JSON.stringify(getError)), "Error payload must not leak internals");

const parsed = parseIntelligenceApiRequest({ query: "Explain inflation simply." });
assert(parsed.ok && parsed.request.query === "Explain inflation simply.", "Contract parser must accept a valid query");
assert(!parseIntelligenceApiRequest({ query: 12 }).ok, "Non-string query must be rejected");

if (failures.length) {
  console.error(`Intelligence API validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Intelligence API validation passed: ${checks} checks.`);
