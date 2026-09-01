/**
 * Server-only OpenAI adapter. Implements the provider-independent complete() contract.
 * Never imported by UI, runIntelligence, or POST /api/intelligence in this phase.
 */

import { createAiProviderAdapter, createProviderFailure } from "../../../src/intelligence/ai/aiProviderAdapter.js";
import { createModelDraft, FORBIDDEN_DRAFT_KEYS } from "../../../src/intelligence/ai/aiDraftTypes.js";
import { isApprovedAiTask } from "../../../src/intelligence/ai/aiTaskTypes.js";
import { validateModelDraft } from "../../../src/intelligence/ai/aiOutputValidator.js";
import { OPENAI_RESPONSES_URL, resolveOpenAiConfig } from "./openaiConfig.js";
import { getOpenAiTextFormat } from "./openaiJsonSchema.js";

const DRAFT_KEYS = Object.freeze([
  "schemaVersion",
  "task",
  "candidateIntentIds",
  "text",
  "confidenceScore",
  "flags",
]);

const SYSTEM_PROMPT = [
  "You assist FOINWI, an educational finance platform.",
  "FOINWI owns calculations, financial rules, trusted facts, safety, verification, and actions.",
  "Return only JSON that matches the provided schema. Do not write markdown.",
  "CLASSIFY: choose only from allowedIntentIds. Do not create new IDs or actions.",
  "SIMPLIFY: rewrite approvedCopy only. Do not add claims, calculations, products, or advice.",
  "CLARIFY: ask one short clarification question. Do not answer the financial question.",
  "Never include URLs, routes, calculator results, product or lender recommendations, return assurances, secrets, or suggested actions.",
].join(" ");

function withTelemetry(result, telemetry) {
  return {
    ...result,
    telemetry: {
      latencyMs: Number.isFinite(telemetry?.latencyMs) ? Math.max(0, telemetry.latencyMs) : 0,
      timedOut: telemetry?.timedOut === true,
      requestId: typeof telemetry?.requestId === "string" && telemetry.requestId.trim()
        ? telemetry.requestId.trim()
        : null,
    },
  };
}

function fail(code, message, telemetry) {
  return withTelemetry(createProviderFailure(code, message), telemetry);
}

function constraintSet(constraints = {}) {
  return {
    noAdvice: constraints.noAdvice === true,
    noUrls: constraints.noUrls === true,
    noNewIntents: constraints.noNewIntents === true,
    noCalculatorResults: constraints.noCalculatorResults === true,
    noProductRecommendations: constraints.noProductRecommendations === true,
    sourceCopyIsAuthoritative: constraints.sourceCopyIsAuthoritative === true,
  };
}

export function serializeApprovedOpenAiPayload({ task, userQuery, approvedContext, constraints } = {}) {
  const context = approvedContext && typeof approvedContext === "object" ? approvedContext : {};
  const copy = Array.isArray(context.approvedCopy)
    ? context.approvedCopy
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => ({
        intentId: typeof entry.intentId === "string" ? entry.intentId : "",
        simpleAnswer: typeof entry.simpleAnswer === "string" ? entry.simpleAnswer : "",
        deeperExplanation: typeof entry.deeperExplanation === "string" ? entry.deeperExplanation : "",
      }))
    : [];

  return {
    task,
    userQuery: typeof context.userQuery === "string" ? context.userQuery : String(userQuery ?? ""),
    candidateIntentIds: Array.isArray(context.candidateIntentIds) ? context.candidateIntentIds.filter((id) => typeof id === "string") : [],
    allowedIntentIds: Array.isArray(context.allowedIntentIds) ? context.allowedIntentIds.filter((id) => typeof id === "string") : [],
    approvedCopy: copy,
    conceptNames: Array.isArray(context.conceptNames) ? context.conceptNames.filter((name) => typeof name === "string") : [],
    surface: typeof context.surface === "string" ? context.surface : "api",
    constraints: constraintSet(constraints ?? context.constraints),
  };
}

function errorFromValidation(reason) {
  if (reason === "unknown-intent") return "unknown-intent";
  if ([
    "product-recommendation",
    "guaranteed-return",
    "lender-approval",
    "illegal-tax",
    "arbitrary-url",
    "authoritative-finance",
    "bypass-attempt",
    "provider-leak",
  ].includes(reason)) {
    return "safety-failure";
  }
  if (reason === "malformed-draft") return "malformed-output";
  return "schema-failure";
}

function mapParsedContent(parsed) {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, code: "malformed-output", draft: null };
  }
  if (Object.keys(parsed).some((key) => !DRAFT_KEYS.includes(key))) {
    return { ok: false, code: "schema-failure", draft: null };
  }
  if (FORBIDDEN_DRAFT_KEYS.some((key) => Object.hasOwn(parsed, key))) {
    return { ok: false, code: "schema-failure", draft: null };
  }
  return { ok: true, code: null, draft: createModelDraft(parsed) };
}

function extractOutputText(raw) {
  const items = Array.isArray(raw?.output) ? raw.output : [];
  const texts = [];
  for (const item of items) {
    const parts = Array.isArray(item?.content) ? item.content : [];
    for (const part of parts) {
      if (part?.type === "refusal" || item?.type === "refusal") {
        return { ok: false, refused: true, text: "" };
      }
      if (part?.type === "output_text" && typeof part.text === "string") {
        texts.push(part.text);
      }
    }
  }
  if (texts.length) {
    return { ok: true, refused: false, text: texts.join("") };
  }
  if (typeof raw?.output_text === "string" && raw.output_text.trim()) {
    return { ok: true, refused: false, text: raw.output_text };
  }
  return { ok: false, refused: false, text: "" };
}

function readRequestId(response, payload) {
  const headerId = response.headers?.get?.("x-request-id") || response.headers?.get?.("X-Request-Id");
  if (typeof headerId === "string" && headerId.trim()) return headerId.trim();
  if (typeof payload?.id === "string" && payload.id.trim()) return payload.id.trim();
  return null;
}

async function fetchWithTimeout(fetchFn, url, init, timeoutMs) {
  const controller = new AbortController();
  const timeoutError = new Error("provider-timeout");
  timeoutError.name = "AbortError";
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = globalThis.setTimeout(() => {
      controller.abort();
      reject(timeoutError);
    }, timeoutMs);
  });
  try {
    return await Promise.race([
      fetchFn(url, { ...init, signal: controller.signal }),
      timeoutPromise,
    ]);
  } finally {
    globalThis.clearTimeout(timer);
  }
}

export async function completeOpenAi(request = {}, options = {}) {
  const started = Date.now();
  const telemetry = () => ({ latencyMs: Math.max(0, Date.now() - started), timedOut: false, requestId: null });

  try {
    const { task, userQuery, approvedContext, constraints } = request;
    if (!isApprovedAiTask(task) || !approvedContext || !userQuery) {
      return fail("schema-failure", "The AI task request is not valid.", telemetry());
    }
    if (constraints && constraints.noAdvice !== true) {
      return fail("safety-failure", "AI tasks must keep FOINWI advice constraints.", telemetry());
    }

    const resolved = resolveOpenAiConfig(options.env);
    if (!resolved.ok) {
      return fail(resolved.code, resolved.message, telemetry());
    }

    const payload = serializeApprovedOpenAiPayload(request);
    const fetchFn = typeof options.fetchImpl === "function" ? options.fetchImpl : globalThis.fetch;
    if (typeof fetchFn !== "function") {
      return fail("provider-unavailable", "The language provider is temporarily unavailable.", telemetry());
    }

    let response;
    try {
      response = await fetchWithTimeout(fetchFn, OPENAI_RESPONSES_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${resolved.config.apiKey}`,
        },
        body: JSON.stringify({
          model: resolved.config.model,
          instructions: SYSTEM_PROMPT,
          input: JSON.stringify(payload),
          temperature: 0,
          max_output_tokens: 400,
          store: false,
          text: getOpenAiTextFormat(),
        }),
      }, resolved.config.timeoutMs);
    } catch (error) {
      const timedOut = error?.name === "AbortError";
      return fail(
        timedOut ? "provider-timeout" : "provider-unavailable",
        timedOut
          ? "The language provider timed out. FOINWI continues with deterministic guidance."
          : "The language provider is temporarily unavailable.",
        { ...telemetry(), timedOut },
      );
    }

    let raw;
    try {
      raw = await response.json();
    } catch {
      return fail("malformed-output", "The language provider returned an unreadable response.", {
        ...telemetry(),
        requestId: readRequestId(response, null),
      });
    }

    const requestId = readRequestId(response, raw);
    if (!response.ok) {
      return fail("provider-unavailable", "The language provider is temporarily unavailable.", {
        ...telemetry(),
        requestId,
      });
    }

    const extracted = extractOutputText(raw);
    if (extracted.refused) {
      return fail("safety-failure", "The language provider declined to produce a draft FOINWI can use.", {
        ...telemetry(),
        requestId,
      });
    }
    const content = extracted.text;
    if (!extracted.ok || typeof content !== "string" || !content.trim()) {
      return fail("malformed-output", "The language provider returned an empty draft.", {
        ...telemetry(),
        requestId,
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return fail("malformed-output", "The language provider returned malformed JSON.", {
        ...telemetry(),
        requestId,
      });
    }

    const mapped = mapParsedContent(parsed);
    if (!mapped.ok) {
      return fail(mapped.code, "The language provider returned a draft FOINWI cannot use.", {
        ...telemetry(),
        requestId,
      });
    }

    const sourceContent = payload.approvedCopy?.[0]?.simpleAnswer ?? "";
    const validation = validateModelDraft(mapped.draft, { sourceContent });
    if (!validation.ok) {
      return fail(
        errorFromValidation(validation.reason),
        "The language provider returned a draft FOINWI cannot use.",
        { ...telemetry(), requestId },
      );
    }

    return withTelemetry({
      ok: true,
      draft: mapped.draft,
      error: null,
    }, { ...telemetry(), requestId });
  } catch {
    return fail(
      "provider-unavailable",
      "The language provider is temporarily unavailable.",
      { ...telemetry(), timedOut: false },
    );
  }
}

export function createOpenAiAdapter(options = {}) {
  return createAiProviderAdapter({
    complete(request) {
      return completeOpenAi(request, options);
    },
  });
}
