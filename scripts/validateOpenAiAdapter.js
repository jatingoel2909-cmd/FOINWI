/* global process */
import { readFile } from "node:fs/promises";
import { createAiProviderAdapter } from "../src/intelligence/ai/aiProviderAdapter.js";
import { createModelDraft } from "../src/intelligence/ai/aiDraftTypes.js";
import { buildApprovedAiContext, getApprovedIntentIds } from "../src/intelligence/ai/aiApprovedContext.js";
import { routeAiTask } from "../src/intelligence/ai/aiTaskRouter.js";
import { runIntelligence } from "../src/intelligence/engine/runIntelligence.js";
import { onRequestPost } from "../functions/api/intelligence.js";
import { runShadowIntelligence } from "../src/intelligence/shadow/shadowRuntime.js";
import {
  DEFAULT_OPENAI_MODEL,
  OPENAI_RESPONSES_URL,
  SUPPORTED_OPENAI_MODELS,
  isSupportedOpenAiModel,
  resolveOpenAiConfig,
} from "../functions/lib/openai/openaiConfig.js";
import { createOpenAiAdapter, serializeApprovedOpenAiPayload } from "../functions/lib/openai/openaiAdapter.js";

const failures = [];
let checks = 0;
const TEST_KEY = "test-placeholder-key";
const messyQuery = "I have some leftover cash each month and want a starting point on this website for learning how regular investing works for a beginner";

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function containsSecret(value) {
  const serialized = JSON.stringify(value);
  return serialized.includes(TEST_KEY) || /Bearer /u.test(serialized) || /sk-[a-zA-Z0-9]{8,}/u.test(serialized);
}

const SYSTEM_PROMPT_FRAGMENT = "You assist FOINWI, an educational finance platform.";

function jsonResponse(payload, { status = 200, requestId = "req_test_1" } = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "x-request-id": requestId,
    },
  });
}

function providerPayload(draft) {
  const text = typeof draft === "string" ? draft : JSON.stringify(draft);
  return {
    id: "resp_test",
    output: [
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text }],
      },
    ],
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

const ids = getApprovedIntentIds();
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

const adapterFiles = [
  "functions/lib/openai/openaiAdapter.js",
  "functions/lib/openai/openaiConfig.js",
  "functions/lib/openai/openaiJsonSchema.js",
];
const adapterSource = (await Promise.all(
  adapterFiles.map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")),
)).join("\n");
const forbiddenLocations = await Promise.all([
  readFile(new URL("../src/intelligence/ai/aiProviderAdapter.js", import.meta.url), "utf8"),
  readFile(new URL("../src/intelligence/ai/aiTaskRouter.js", import.meta.url), "utf8"),
  readFile(new URL("../src/intelligence/engine/runIntelligence.js", import.meta.url), "utf8"),
  readFile(new URL("../src/intelligence/guide/guideEngine.js", import.meta.url), "utf8"),
  readFile(new URL("../src/services/intelligenceClient.js", import.meta.url), "utf8"),
  readFile(new URL("../functions/api/intelligence.js", import.meta.url), "utf8"),
  readFile(new URL("../src/pages/AiToolsPage.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/pages/Home.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/guide-trial/GuideTrialPage.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
]);
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const forbiddenJoined = forbiddenLocations.join("\n");

assert(typeof createAiProviderAdapter === "function", "Adapter must reuse createAiProviderAdapter");
assert(SUPPORTED_OPENAI_MODELS.includes(DEFAULT_OPENAI_MODEL), "Default model must be on the FOINWI allowlist");
assert(DEFAULT_OPENAI_MODEL === "gpt-5.6-luna", "Default trial model must be gpt-5.6-luna");
assert(SUPPORTED_OPENAI_MODELS.join(",") === "gpt-5.6-luna,gpt-5.6-terra", "Allowlist must be gpt-5.6-luna and gpt-5.6-terra only");
assert(isSupportedOpenAiModel("gpt-5.6-luna"), "gpt-5.6-luna must be allowed");
assert(isSupportedOpenAiModel("gpt-5.6-terra"), "gpt-5.6-terra must be allowed");
assert(!isSupportedOpenAiModel("gpt-5.6-sol"), "gpt-5.6-sol must not be allowlisted yet");
assert(!isSupportedOpenAiModel("gpt-not-allowed"), "Unknown model IDs must not be supported");
assert(resolveOpenAiConfig({ OPENAI_API_KEY: TEST_KEY }).ok === true, "Approved default model config must resolve");
assert(resolveOpenAiConfig({ OPENAI_API_KEY: TEST_KEY }).config.model === DEFAULT_OPENAI_MODEL, "Missing OPENAI_MODEL must use the approved default");
assert(resolveOpenAiConfig({ OPENAI_API_KEY: TEST_KEY, OPENAI_MODEL: "gpt-5.6-terra" }).ok === true, "Allowlisted OPENAI_MODEL must be accepted");
assert(resolveOpenAiConfig({ OPENAI_API_KEY: TEST_KEY, OPENAI_MODEL: "gpt-5.6-sol" }).ok === false, "Unsupported model must fail closed");
assert(resolveOpenAiConfig({ OPENAI_API_KEY: TEST_KEY, OPENAI_MODEL: "gpt-not-allowed" }).ok === false, "Unapproved model must fail closed");

assert(!/from\s+['"]openai['"]/u.test(adapterSource), "Adapter must not import the OpenAI SDK");
assert(!/\bopenai\b/iu.test(JSON.stringify({
  dependencies: packageJson.dependencies,
  devDependencies: packageJson.devDependencies,
})), "package.json must not add an OpenAI SDK");
assert(!/\bn8n\b/iu.test(adapterSource), "OpenAI adapter must not include n8n");
assert(!/\bVITE_/u.test(adapterSource), "OpenAI adapter must not use VITE_ environment variables");
assert(!/\bimport\.meta\.env\b/u.test(adapterSource), "OpenAI adapter must not read client env");
assert(adapterSource.includes("OPENAI_API_KEY"), "Adapter may read OPENAI_API_KEY from server env");
assert(adapterSource.includes("OPENAI_MODEL"), "Adapter may read OPENAI_MODEL from server env");
assert(adapterSource.includes("OPENAI_TIMEOUT_MS"), "Adapter may read OPENAI_TIMEOUT_MS from server env");
assert(adapterSource.includes("/v1/responses"), "Adapter must use the Responses API endpoint");
assert(!adapterSource.includes("/v1/chat/completions"), "Adapter must not use Chat Completions");
assert(!/\bresponse_format\b/u.test(adapterSource), "Adapter must not use Chat Completions response_format");
assert(!/\bmax_tokens\b/u.test(adapterSource), "Adapter must not use Chat Completions max_tokens");
assert(!/\bmessages:\s*\[/u.test(adapterSource), "Adapter must not send Chat Completions messages");
assert(!/\b(openai|api\.openai|OPENAI_API_KEY|OPENAI_MODEL)\b/iu.test(forbiddenJoined), "OpenAI code must not leave the server adapter location");
assert(!forbiddenJoined.includes("functions/lib/openai"), "Browser/API/engine code must not import the OpenAI adapter");

const missingKeySpy = createFetchSpy(() => jsonResponse(providerPayload(createModelDraft({
  task: "CLASSIFY",
  candidateIntentIds: [ids[0]],
  confidenceScore: 70,
}))));
const missingKey = await createOpenAiAdapter({ env: {}, fetchImpl: missingKeySpy.fetchImpl }).complete(classifyRequest);
assert(missingKey.ok === false && missingKey.error.code === "provider-not-configured", "Missing key must fail as provider-not-configured");
assert(missingKeySpy.calls.length === 0, "Missing key must not call fetch");
assert(missingKey.draft === null, "Missing key must not return a draft");
assert(!containsSecret(missingKey), "Missing-key failure telemetry must not include secrets");

const noEnvSpy = createFetchSpy(() => jsonResponse({}));
const noEnv = await createOpenAiAdapter({ fetchImpl: noEnvSpy.fetchImpl }).complete(classifyRequest);
assert(noEnv.error.code === "provider-not-configured" && noEnvSpy.calls.length === 0, "Adapter without env must not network");

const unapprovedSpy = createFetchSpy(() => jsonResponse({}));
const unapproved = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY, OPENAI_MODEL: "gpt-not-allowed" },
  fetchImpl: unapprovedSpy.fetchImpl,
}).complete(classifyRequest);
assert(unapproved.ok === false, "Unapproved model must fail closed");
assert(unapprovedSpy.calls.length === 0, "Unapproved model must not call fetch");

const solSpy = createFetchSpy(() => jsonResponse({}));
const sol = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY, OPENAI_MODEL: "gpt-5.6-sol" },
  fetchImpl: solSpy.fetchImpl,
}).complete(classifyRequest);
assert(sol.ok === false && solSpy.calls.length === 0, "gpt-5.6-sol must fail closed with zero fetch");

const terraSpy = createFetchSpy(() => jsonResponse(providerPayload(createModelDraft({
  task: "CLASSIFY",
  candidateIntentIds: [ids[0]],
  text: "",
  confidenceScore: 70,
}))));
const terra = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY, OPENAI_MODEL: "gpt-5.6-terra" },
  fetchImpl: terraSpy.fetchImpl,
}).complete(classifyRequest);
assert(terra.ok === true, "gpt-5.6-terra must be selectable");
assert(JSON.parse(terraSpy.calls[0].init.body).model === "gpt-5.6-terra", "Allowlisted terra model must be sent to Responses API");

const timeoutSpy = createFetchSpy(async () => {
  const error = new Error("Aborted");
  error.name = "AbortError";
  throw error;
});
const timeout = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: timeoutSpy.fetchImpl,
}).complete(classifyRequest);
assert(timeout.error.code === "provider-timeout", "Timeout must map to provider-timeout");
assert(timeout.telemetry.timedOut === true, "Timeout telemetry must set timedOut");
assert(!containsSecret(timeout), "Timeout telemetry must not include secrets");

const throwSpy = createFetchSpy(() => {
  throw new Error("unexpected-adapter-failure");
});
const thrown = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: throwSpy.fetchImpl,
}).complete(classifyRequest);
assert(thrown.error.code === "provider-unavailable", "Adapter throw must be contained");
assert(!JSON.stringify(thrown).includes("unexpected-adapter-failure"), "Adapter throw must not leak internal errors");

const httpSpy = createFetchSpy(() => jsonResponse({ error: { message: "secret-provider-detail" } }, { status: 500 }));
const httpError = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: httpSpy.fetchImpl,
}).complete(classifyRequest);
assert(httpError.error.code === "provider-unavailable", "Non-2xx must map to provider-unavailable");
assert(!JSON.stringify(httpError).includes("secret-provider-detail"), "Provider error bodies must not leak into adapter output");
assert(httpSpy.calls[0].url === OPENAI_RESPONSES_URL, "Configured adapter must call the OpenAI Responses API");
assert(!String(httpSpy.calls[0].url).includes("/v1/chat/completions"), "Configured adapter must not call Chat Completions");

const malformedSpy = createFetchSpy(() => jsonResponse({
  output: [{ type: "message", content: [{ type: "output_text", text: "{not-json" }] }],
}));
const malformed = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: malformedSpy.fetchImpl,
}).complete(classifyRequest);
assert(malformed.error.code === "malformed-output", "Malformed JSON must map to malformed-output");

const chatDraft = { schemaVersion: "1.0.0", task: "CHAT", candidateIntentIds: [ids[0]], text: "", confidenceScore: 40, flags: [] };
const invalidSpy = createFetchSpy(() => jsonResponse(providerPayload(chatDraft)));
const invalidDraft = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: invalidSpy.fetchImpl,
}).complete(classifyRequest);
assert(invalidDraft.ok === false, "Invalid draft must be rejected");
assert(["schema-failure", "malformed-output"].includes(invalidDraft.error.code), "Invalid draft must fail closed");

const unknownDraft = createModelDraft({
  task: "CLASSIFY",
  candidateIntentIds: ["made-up-intent"],
  confidenceScore: 70,
});
const unknownSpy = createFetchSpy(() => jsonResponse(providerPayload(unknownDraft)));
const unknown = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: unknownSpy.fetchImpl,
}).complete(classifyRequest);
assert(unknown.error.code === "unknown-intent", "Unknown intent IDs must be rejected through the existing validator");

const actionDraft = {
  schemaVersion: "1.0.0",
  task: "CLASSIFY",
  candidateIntentIds: [ids[0]],
  text: "",
  confidenceScore: 70,
  flags: [],
  suggestedActions: [{ type: "CALCULATE", path: "/sip-calculator" }],
};
const actionSpy = createFetchSpy(() => jsonResponse(providerPayload(actionDraft)));
const action = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: actionSpy.fetchImpl,
}).complete(classifyRequest);
assert(action.ok === false, "Model actions must not pass through");

const urlDraft = createModelDraft({
  task: "CLARIFY",
  candidateIntentIds: [ids[0]],
  text: "Can you open https://evil.example for this?",
  confidenceScore: 40,
});
const urlSpy = createFetchSpy(() => jsonResponse(providerPayload(urlDraft)));
const urlResult = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: urlSpy.fetchImpl,
}).complete({
  ...classifyRequest,
  task: "CLARIFY",
  approvedContext: { ...classifyContext, task: "CLARIFY" },
  constraints: classifyContext.constraints,
});
assert(urlResult.ok === false, "Model URLs must be rejected");

const calcDraft = createModelDraft({
  task: "CLASSIFY",
  candidateIntentIds: [ids[0]],
  text: "Your EMI is 12000 based on this loan.",
  confidenceScore: 70,
});
const calcSpy = createFetchSpy(() => jsonResponse(providerPayload(calcDraft)));
const calc = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY },
  fetchImpl: calcSpy.fetchImpl,
}).complete(classifyRequest);
assert(calc.ok === false, "Calculator results from the model must be rejected");

const dirtyContext = {
  ...classifyContext,
  pan: "ABCDE1234F",
  aadhaar: "123412341234",
  healthAnswers: { q1: "yes" },
  conversationHistory: [{ role: "user", text: "hi" }],
  amount: 5000,
  exchangeAmount: 82.1,
  apiKey: TEST_KEY,
  stack: "Error: boom",
};
const dirtyPayload = JSON.stringify(serializeApprovedOpenAiPayload({
  task: "CLASSIFY",
  userQuery: messyQuery,
  approvedContext: dirtyContext,
  constraints: classifyContext.constraints,
}));
assert(!/ABCDE1234F|123412341234|healthAnswers|conversationHistory|"amount"|exchangeAmount|test-placeholder-key|Error: boom/u.test(dirtyPayload), "Sensitive context must not be serialized");

const successDraft = createModelDraft({
  task: "CLASSIFY",
  candidateIntentIds: [ids[0]],
  text: "",
  confidenceScore: 70,
});
const successSpy = createFetchSpy(() => jsonResponse(providerPayload(successDraft)));
const success = await createOpenAiAdapter({
  env: { OPENAI_API_KEY: TEST_KEY, OPENAI_MODEL: "gpt-5.6-luna", OPENAI_TIMEOUT_MS: "4000" },
  fetchImpl: successSpy.fetchImpl,
}).complete(classifyRequest);
assert(success.ok === true && success.draft.task === "CLASSIFY", "Valid mapped draft should pass");
assert(success.telemetry.requestId === "req_test_1", "Safe request ID may be captured");
assert(Number.isFinite(success.telemetry.latencyMs), "latencyMs must be present");
assert(success.telemetry.timedOut === false, "Successful calls are not timed out");
assert(!containsSecret(success), "Telemetry must not include secrets");
assert(!Object.hasOwn(success, "raw") && !JSON.stringify(success).includes(SYSTEM_PROMPT_FRAGMENT), "Raw provider payload and system prompt must stay out of adapter output");

const fetchBody = JSON.parse(successSpy.calls[0].init.body);
assert(fetchBody.model === "gpt-5.6-luna", "Request must use the approved default trial model");
assert(typeof fetchBody.input === "string", "Responses API input must carry the allowlisted payload");
assert(typeof fetchBody.instructions === "string", "Responses API instructions must carry FOINWI constraints");
assert(fetchBody.text?.format?.type === "json_schema", "Structured output must use Responses text.format");
assert(fetchBody.text.format.name === "foinwi_normalized_model_draft", "Structured output must name the FOINWI draft schema");
assert(fetchBody.text.format.strict === true, "Structured output must remain strict");
assert(fetchBody.max_output_tokens === 400, "Responses API must use max_output_tokens");
assert(!Object.hasOwn(fetchBody, "messages"), "Request must not use Chat Completions messages");
assert(!Object.hasOwn(fetchBody, "response_format"), "Request must not use Chat Completions response_format");
assert(!Object.hasOwn(fetchBody, "max_tokens"), "Request must not use Chat Completions max_tokens");
assert(JSON.parse(fetchBody.input).allowedIntentIds.includes("invest-sip"), "CLASSIFY payload must include allowed intent IDs");
assert(!JSON.stringify(fetchBody.input).includes("ABCDE1234F"), "User payload must stay allowlisted");

const shadowSpy = createFetchSpy(() => jsonResponse(providerPayload((() => {
  const task = routeAiTask(messyQuery).task;
  return createModelDraft({
    task,
    candidateIntentIds: [ids[0]],
    text: task === "CLARIFY" ? "Which FOINWI topic should we explore?" : "",
    confidenceScore: 70,
  });
})())));
const shadow = await runShadowIntelligence({ query: messyQuery }, {
  adapter: createOpenAiAdapter({
    env: { OPENAI_API_KEY: TEST_KEY },
    fetchImpl: shadowSpy.fetchImpl,
  }),
});
assert(shadow.review.usedForUserResponse === false, "Shadow candidate must keep usedForUserResponse false");
assert(shadow.response.usedModel === false, "Shadow must keep public usedModel false");
assert(JSON.stringify(shadow.response) === JSON.stringify(runIntelligence({ query: messyQuery })), "Shadow must not alter IntelligenceResponse");
assert(shadow.review.decision === "recorded-candidate" || shadow.review.decision === "validation-failed", "Injected adapter may only create a shadow record");

const noKeyShadowSpy = createFetchSpy(() => jsonResponse({}));
const noKeyShadow = await runShadowIntelligence({ query: messyQuery }, {
  adapter: createOpenAiAdapter({ env: {}, fetchImpl: noKeyShadowSpy.fetchImpl }),
});
assert(noKeyShadow.review.decision === "provider-not-configured", "Shadow with no key must stay fail-closed");
assert(noKeyShadowSpy.calls.length === 0, "Shadow with no key must not call fetch");
assert(noKeyShadow.review.usedForUserResponse === false, "Unconfigured adapter must not serve AI");

const apiResponse = await onRequestPost({
  request: new Request("https://foinwi.com/api/intelligence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "How does SIP work?" }),
  }),
});
const apiPayload = await apiResponse.json();
assert(apiPayload.usedModel === false, "Production API usedModel must remain false");
assert(JSON.stringify(apiPayload) === JSON.stringify(runIntelligence({ query: "How does SIP work?" })), "Production API must remain unchanged");

if (failures.length) {
  console.error(`OpenAI adapter validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`OpenAI adapter validation passed: ${checks} checks.`);
