/* global process */
import { readFile } from "node:fs/promises";
import { createModelDraft } from "../src/intelligence/ai/aiDraftTypes.js";
import { buildApprovedAiContext } from "../src/intelligence/ai/aiApprovedContext.js";
import { runIntelligence } from "../src/intelligence/engine/runIntelligence.js";
import { onRequestPost } from "../functions/api/intelligence.js";
import { runShadowIntelligence } from "../src/intelligence/shadow/shadowRuntime.js";
import { createShadowProvider } from "../functions/lib/intelligence/createShadowProvider.js";
import { runConfiguredShadowIntelligence } from "../functions/lib/intelligence/shadowHook.js";
import {
  DEFAULT_GEMINI_MODEL,
  GEMINI_API_REVISION,
  GEMINI_INTERACTIONS_URL,
  SUPPORTED_GEMINI_MODELS,
  isSupportedGeminiModel,
  resolveGeminiConfig,
} from "../functions/lib/gemini/geminiConfig.js";
import {
  createGeminiAdapter,
  extractGeminiModelOutputText,
  serializeApprovedGeminiPayload,
} from "../functions/lib/gemini/geminiAdapter.js";

const failures = [];
let checks = 0;
const TEST_KEY = "test-placeholder-key";
const messyQuery = "I have some leftover cash each month and want a starting point on this website for learning how regular investing works for a beginner";

function enabledEnv(extra = {}) {
  return {
    FOINWI_AI_PROVIDER_ENABLED: "true",
    GEMINI_API_KEY: TEST_KEY,
    ...extra,
  };
}

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function containsSecret(value) {
  const serialized = JSON.stringify(value);
  return serialized.includes(TEST_KEY) || /AIza[0-9A-Za-z_-]{8,}/u.test(serialized);
}

function jsonResponse(payload, { status = 200, requestId = "req_gemini_1" } = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "x-request-id": requestId,
    },
  });
}

function geminiPayload(draftOrText, extra = {}) {
  const text = typeof draftOrText === "string" ? draftOrText : JSON.stringify(draftOrText);
  return {
    id: "int_test",
    status: "completed",
    model: DEFAULT_GEMINI_MODEL,
    object: "interaction",
    steps: [
      { type: "thought", content: [{ type: "text", text: "internal-reasoning" }] },
      { type: "model_output", content: [{ type: "text", text }] },
    ],
    ...extra,
  };
}

function createFetchSpy(handler) {
  const spy = { calls: [] };
  spy.fetchImpl = async (url, init) => {
    spy.calls.push({ url, init });
    return handler(url, init, spy.calls.length);
  };
  return spy;
}

async function postQuery(query, context = {}) {
  const pending = [];
  const response = await onRequestPost({
    request: new Request("https://foinwi.com/api/intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }),
    waitUntil(job) {
      pending.push(job);
    },
    ...context,
  });
  const payload = await response.json();
  await Promise.all(pending);
  return { payload, pending };
}

const classifyContext = buildApprovedAiContext({
  task: "CLASSIFY",
  userQuery: messyQuery,
  candidateIntentIds: ["invest-sip"],
});
const classifyRequest = {
  task: "CLASSIFY",
  userQuery: messyQuery,
  approvedContext: classifyContext,
  constraints: classifyContext.constraints,
};
const validClassifyDraft = createModelDraft({
  task: "CLASSIFY",
  candidateIntentIds: ["invest-sip"],
  text: "",
  confidenceScore: 70,
  flags: [],
});
const validClarifyDraft = {
  schemaVersion: "1.0.0",
  task: "CLARIFY",
  candidateIntentIds: ["invest-sip"],
  text: "Are you looking for a starting point on regular investing?",
  confidenceScore: 70,
  flags: [],
};

const adapterFiles = [
  "functions/lib/gemini/geminiAdapter.js",
  "functions/lib/gemini/geminiConfig.js",
  "functions/lib/gemini/geminiJsonSchema.js",
];
const adapterSource = (await Promise.all(
  adapterFiles.map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")),
)).join("\n");
const forbiddenLocations = await Promise.all([
  readFile(new URL("../src/intelligence/ai/aiProviderAdapter.js", import.meta.url), "utf8"),
  readFile(new URL("../src/intelligence/ai/aiTaskRouter.js", import.meta.url), "utf8"),
  readFile(new URL("../src/intelligence/ai/guardedIntelligence.js", import.meta.url), "utf8"),
  readFile(new URL("../src/intelligence/engine/runIntelligence.js", import.meta.url), "utf8"),
  readFile(new URL("../src/intelligence/shadow/shadowRuntime.js", import.meta.url), "utf8"),
  readFile(new URL("../src/services/intelligenceClient.js", import.meta.url), "utf8"),
  readFile(new URL("../functions/api/intelligence.js", import.meta.url), "utf8"),
  readFile(new URL("../src/pages/AiToolsPage.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/guide-trial/GuideTrialPage.jsx", import.meta.url), "utf8"),
]);
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const forbiddenJoined = forbiddenLocations.join("\n");

assert(SUPPORTED_GEMINI_MODELS.includes(DEFAULT_GEMINI_MODEL), "Default model must be on the FOINWI allowlist");
assert(DEFAULT_GEMINI_MODEL === "gemini-3.6-flash", "Default Shadow model must be gemini-3.6-flash");
assert(isSupportedGeminiModel("gemini-3.6-flash"), "gemini-3.6-flash must be allowed");
assert(!isSupportedGeminiModel("gemini-2.5-flash"), "Unlisted Gemini models must fail closed");
assert(resolveGeminiConfig({ GEMINI_API_KEY: TEST_KEY }).ok === true, "Approved default model config must resolve");
assert(resolveGeminiConfig({ GEMINI_API_KEY: TEST_KEY }).config.model === DEFAULT_GEMINI_MODEL, "Missing model option must use the approved default");
assert(resolveGeminiConfig({ GEMINI_API_KEY: TEST_KEY }, { model: "gemini-3.6-flash" }).ok === true, "Allowlisted internal model option must be accepted");
assert(resolveGeminiConfig({ GEMINI_API_KEY: TEST_KEY }, { model: "gemini-not-allowed" }).ok === false, "Unsupported model must fail closed");
assert(resolveGeminiConfig({}).ok === false, "Missing GEMINI_API_KEY must fail closed");
assert(GEMINI_INTERACTIONS_URL === "https://generativelanguage.googleapis.com/v1beta/interactions", "Adapter must use the Interactions API endpoint");

assert(!/from\s+['"]@google\/(?:genai|generative-ai)['"]/u.test(adapterSource), "Adapter must not import a Gemini SDK");
assert(!/\bconsole\.(?:log|info|debug|error|warn)\b/u.test(adapterSource), "Adapter must not log, including API keys");
assert(!adapterSource.includes("?key="), "Adapter must not place GEMINI_API_KEY in the URL");
assert(adapterSource.includes("x-goog-api-key"), "Adapter must authenticate with x-goog-api-key");
assert(adapterSource.includes("/v1beta/interactions"), "Adapter must use the Interactions API endpoint");
assert(adapterSource.includes("store: false"), "Adapter must not store Gemini interactions");
assert(adapterSource.includes("thinking_level: \"minimal\""), "Adapter must set thinking_level to minimal");
assert(adapterSource.includes("max_output_tokens: 1200"), "Adapter must set max_output_tokens to 1200");
assert(!adapterSource.includes("max_output_tokens: 400"), "Adapter must not keep the 400-token output cap");
assert(!/\bwhile\s*\(/u.test(adapterSource) && !adapterSource.includes("retries"), "Adapter must not retry provider calls");
assert(!adapterSource.includes("FOINWI_AI_PUBLIC_ENABLED"), "Adapter must not introduce a public AI flag");
assert(!/\b(openai|OPENAI_API_KEY|api\.openai)\b/u.test(adapterSource), "Gemini adapter must not retain OpenAI runtime details");
assert(!/\bGEMINI_API_KEY\b/u.test(forbiddenJoined), "GEMINI_API_KEY must stay in the server adapter location");
assert(!forbiddenJoined.includes("functions/lib/gemini"), "Browser/API/engine/runtime code must not import the Gemini adapter");
assert(!/\b(gemini-3\.6-flash|v1beta\/interactions)\b/u.test(forbiddenJoined), "Gemini endpoint details must not leave the server adapter");
assert(!packageJson.dependencies?.["@google/genai"] && !packageJson.devDependencies?.["@google/genai"], "package.json must not add a Gemini SDK");
assert(packageJson.scripts["validate:gemini-adapter"], "package.json must include the Gemini adapter validator");

const serialized = serializeApprovedGeminiPayload(classifyRequest);
assert(serialized.task === "CLASSIFY", "Approved payload must include the FOINWI task");
assert(serialized.userQuery === classifyContext.userQuery, "Approved payload may include the sanitized query");
assert(!Object.hasOwn(serialized, "apiKey") && !Object.hasOwn(serialized, "env"), "Approved payload must not include secrets or env");
assert(!JSON.stringify(serialized).includes("GEMINI_API_KEY"), "Approved payload must not include env var names");
assert(serialized.constraints.noAdvice === true, "Approved payload must keep noAdvice");

assert(extractGeminiModelOutputText(geminiPayload("FOINWI Gemini ready")).ok === true, "Completed model_output text must be extracted");
assert(extractGeminiModelOutputText(geminiPayload("ready", { status: "in_progress" })).ok === false, "Non-completed interactions must fail closed");
assert(extractGeminiModelOutputText({ status: "completed", steps: [{ type: "thought", content: [{ type: "text", text: "x" }] }] }).ok === false, "Missing model_output must fail closed");

const disabledSpy = createFetchSpy(() => {
  throw new Error("must-not-fetch");
});
const disabled = await createGeminiAdapter({
  env: { GEMINI_API_KEY: TEST_KEY, FOINWI_AI_PROVIDER_ENABLED: "false" },
  fetchImpl: disabledSpy.fetchImpl,
}).complete(classifyRequest);
assert(disabled.ok === false && disabled.error.code === "provider-not-configured", "Disabled provider must fail closed");
assert(disabledSpy.calls.length === 0, "Disabled provider must create zero network calls");

const missingKeySpy = createFetchSpy(() => {
  throw new Error("must-not-fetch");
});
const missingKey = await createGeminiAdapter({
  env: { FOINWI_AI_PROVIDER_ENABLED: "true" },
  fetchImpl: missingKeySpy.fetchImpl,
}).complete(classifyRequest);
assert(missingKey.ok === false && missingKey.error.code === "provider-not-configured", "Missing GEMINI_API_KEY must fail closed");
assert(missingKeySpy.calls.length === 0, "Missing GEMINI_API_KEY must create zero network calls");
assert(!containsSecret(missingKey), "Missing-key failure must not leak GEMINI_API_KEY");

const unapprovedSpy = createFetchSpy(() => {
  throw new Error("must-not-fetch");
});
const unapproved = await createGeminiAdapter({
  env: enabledEnv(),
  model: "gemini-not-allowed",
  fetchImpl: unapprovedSpy.fetchImpl,
}).complete(classifyRequest);
assert(unapproved.ok === false && unapprovedSpy.calls.length === 0, "Unsupported model must fail closed with zero fetch");

async function completeWithStatus(status, body) {
  const spy = createFetchSpy(() => jsonResponse(body ?? {
    error: { code: status, message: `provider-debug ${TEST_KEY}`, status: "PROVIDER_ERROR" },
  }, { status }));
  const result = await createGeminiAdapter({
    env: enabledEnv(),
    fetchImpl: spy.fetchImpl,
  }).complete(classifyRequest);
  return { result, spy };
}

const http400 = await completeWithStatus(400);
assert(http400.result.ok === false && http400.result.error.code === "provider-request-invalid", "HTTP 400 must map to provider-request-invalid");
assert(!containsSecret(http400.result), "HTTP 400 must not leak GEMINI_API_KEY or Google error bodies");

const http401 = await completeWithStatus(401);
assert(http401.result.ok === false && http401.result.error.code === "provider-auth-failed", "HTTP 401 must map to provider-auth-failed");

const http403 = await completeWithStatus(403, {
  error: { code: 403, message: `blocked ${TEST_KEY}`, status: "PERMISSION_DENIED" },
});
assert(http403.result.ok === false && http403.result.error.code === "provider-permission-denied", "HTTP 403 must fail closed");
assert(http403.result.telemetry.providerErrorType === "PERMISSION_DENIED", "Safe Google status may be retained internally");
assert(!String(http403.result.error.message).includes(TEST_KEY), "HTTP 403 must not expose Google error bodies");

const http429 = await completeWithStatus(429);
assert(http429.result.ok === false && http429.result.error.code === "provider-rate-limited", "HTTP 429 must fail closed");

const http500 = await completeWithStatus(500);
assert(http500.result.ok === false && http500.result.error.code === "provider-server-error", "HTTP 500 must fail closed");
assert(http500.spy.calls[0].url === GEMINI_INTERACTIONS_URL, "Configured adapter must call the Gemini Interactions API");
assert(http500.spy.calls[0].init.headers["Api-Revision"] === GEMINI_API_REVISION, "Adapter may send the current Interactions API revision");
assert(http500.spy.calls.length === 1, "HTTP failures must not retry");

const http503 = await completeWithStatus(503);
assert(http503.result.ok === false && http503.result.error.code === "provider-server-error", "HTTP 503 must fail closed");

const timeoutSpy = createFetchSpy(async () => {
  const error = new Error("aborted");
  error.name = "AbortError";
  throw error;
});
const timeout = await createGeminiAdapter({
  env: enabledEnv(),
  timeoutMs: 1000,
  fetchImpl: timeoutSpy.fetchImpl,
}).complete(classifyRequest);
assert(timeout.ok === false && timeout.error.code === "provider-timeout", "Timeouts must fail closed");
assert(timeout.telemetry.timedOut === true, "Timeout telemetry must stay internal");

const networkSpy = createFetchSpy(async () => {
  throw new Error("ECONNRESET");
});
const network = await createGeminiAdapter({
  env: enabledEnv(),
  fetchImpl: networkSpy.fetchImpl,
}).complete(classifyRequest);
assert(network.ok === false && network.error.code === "provider-network-error", "Network failures must fail closed");

const malformedJson = await createGeminiAdapter({
  env: enabledEnv(),
  fetchImpl: createFetchSpy(() => new Response("not-json", { status: 200 })).fetchImpl,
}).complete(classifyRequest);
assert(malformedJson.ok === false && malformedJson.error.code === "malformed-output", "Unreadable JSON must fail closed");

const missingOutput = await createGeminiAdapter({
  env: enabledEnv(),
  fetchImpl: createFetchSpy(() => jsonResponse({
    status: "completed",
    steps: [{ type: "thought", content: [{ type: "text", text: "x" }] }],
  })).fetchImpl,
}).complete(classifyRequest);
assert(missingOutput.ok === false && missingOutput.error.code === "malformed-output", "Missing model_output must fail closed");

const incomplete = await createGeminiAdapter({
  env: enabledEnv(),
  fetchImpl: createFetchSpy(() => jsonResponse(geminiPayload(validClassifyDraft, { status: "in_progress" }))).fetchImpl,
}).complete(classifyRequest);
assert(incomplete.ok === false && incomplete.error.code === "provider-unavailable", "Non-completed interactions must fail closed");

const badJsonText = await createGeminiAdapter({
  env: enabledEnv(),
  fetchImpl: createFetchSpy(() => jsonResponse(geminiPayload("FOINWI Gemini ready"))).fetchImpl,
}).complete(classifyRequest);
assert(badJsonText.ok === false && badJsonText.error.code === "malformed-output", "Non-JSON model_output must fail closed");

const successSpy = createFetchSpy(() => jsonResponse(geminiPayload(validClassifyDraft)));
const success = await createGeminiAdapter({
  env: enabledEnv(),
  fetchImpl: successSpy.fetchImpl,
}).complete(classifyRequest);
assert(success.ok === true, "A valid Gemini draft may be captured internally");
assert(success.draft.task === "CLASSIFY", "Captured draft must remain a FOINWI model draft");
assert(successSpy.calls.length === 1, "A successful adapter call must fetch once");
const fetchBody = JSON.parse(successSpy.calls[0].init.body);
assert(fetchBody.model === "gemini-3.6-flash", "Request must use gemini-3.6-flash");
assert(fetchBody.store === false, "Request must disable Gemini storage");
assert(fetchBody.generation_config?.thinking_level === "minimal", "Request must set thinking_level to minimal");
assert(fetchBody.generation_config?.max_output_tokens === 1200, "Request must allow 1200 output tokens");
assert(typeof fetchBody.input === "string", "Approved context must be sent as Interactions input");
assert(!JSON.stringify(fetchBody).includes(TEST_KEY), "Request body must not include GEMINI_API_KEY");
assert(successSpy.calls[0].init.headers["x-goog-api-key"] === TEST_KEY, "Request must send x-goog-api-key");
assert(!containsSecret(success.draft) && !containsSecret(success.error), "Successful result must not leak GEMINI_API_KEY");

const onceProvider = createShadowProvider({
  env: enabledEnv(),
  fetchImpl: createFetchSpy(() => jsonResponse(geminiPayload(validClassifyDraft))).fetchImpl,
});
const first = await onceProvider.complete(classifyRequest);
const second = await onceProvider.complete(classifyRequest);
assert(first.ok === true, "The first Gemini provider call may proceed");
assert(second.ok === false, "A second provider call must be blocked");

const shadow = await runShadowIntelligence({ query: messyQuery }, {
  env: enabledEnv(),
  adapter: createGeminiAdapter({
    env: enabledEnv(),
    fetchImpl: createFetchSpy(() => jsonResponse(geminiPayload(validClarifyDraft))).fetchImpl,
  }),
});
assert(shadow.review.usedForUserResponse === false, "usedForUserResponse must remain false");
assert(shadow.response.usedModel === false, "Shadow Gemini output must not set usedModel");
assert(shadow.review.decision === "recorded-candidate" || shadow.review.decision === "validation-failed", "Gemini output must stay a Shadow candidate");
assert(JSON.stringify(shadow.response) === JSON.stringify(runIntelligence({ query: messyQuery })), "Shadow Gemini must preserve the deterministic response");

const publicCall = await postQuery(messyQuery, {
  env: enabledEnv(),
  fetchImpl: createFetchSpy(() => jsonResponse(geminiPayload(validClarifyDraft))).fetchImpl,
});
assert(JSON.stringify(publicCall.payload) === JSON.stringify(runIntelligence({ query: messyQuery })), "Public Intelligence JSON must remain deterministic");
assert(publicCall.payload.usedModel === false, "Public usedModel must remain false");
assert(!Object.hasOwn(publicCall.payload, "candidate") && !Object.hasOwn(publicCall.payload, "review"), "Gemini candidate must not enter public JSON");
assert(!JSON.stringify(publicCall.payload).includes("gemini"), "Public JSON must not mention Gemini");
assert(!JSON.stringify(publicCall.payload).includes(TEST_KEY), "Public JSON must not leak GEMINI_API_KEY");
assert(!JSON.stringify(publicCall.payload).includes("PERMISSION_DENIED"), "Public JSON must not expose provider errors");

const forbiddenSpy = createFetchSpy(() => jsonResponse({
  error: { code: 403, message: `blocked ${TEST_KEY}`, status: "PERMISSION_DENIED" },
}, { status: 403 }));
const forbiddenPublic = await postQuery(messyQuery, {
  env: enabledEnv(),
  fetchImpl: forbiddenSpy.fetchImpl,
});
assert(JSON.stringify(forbiddenPublic.payload) === JSON.stringify(runIntelligence({ query: messyQuery })), "Provider 403 must not change visitor JSON");
assert(forbiddenPublic.payload.usedModel === false, "Provider 403 must keep usedModel false");
assert(!JSON.stringify(forbiddenPublic.payload).includes("PERMISSION_DENIED"), "Visitor JSON must not include Google error status");
assert(!JSON.stringify(forbiddenPublic.payload).includes(TEST_KEY), "Visitor JSON must not leak GEMINI_API_KEY");

const injected = await runConfiguredShadowIntelligence({ query: messyQuery }, {
  env: enabledEnv(),
  adapter: {
    async complete() {
      return { ok: true, draft: validClassifyDraft, error: null };
    },
  },
});
assert(injected.review.usedForUserResponse === false, "Injected adapters must still keep usedForUserResponse false");
assert(JSON.stringify(injected.response) === JSON.stringify(runIntelligence({ query: messyQuery })), "Injected adapters must not replace visitor JSON");

const fallback = await createShadowProvider({ env: { FOINWI_AI_PROVIDER_ENABLED: "true" } }).complete(classifyRequest);
assert(fallback.ok === false && fallback.error.code === "provider-not-configured", "Vendor-neutral fail-closed behavior must remain when the key is missing");

if (failures.length) {
  console.error(`Gemini adapter validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Gemini adapter validation passed: ${checks} checks.`);
