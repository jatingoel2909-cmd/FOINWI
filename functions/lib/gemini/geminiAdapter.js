/**
 * Server-only Gemini adapter. Implements the provider-independent complete() contract.
 * Never imported by UI or by functions/api/intelligence.js.
 */

import { createAiProviderAdapter, createProviderFailure } from "../../../src/intelligence/ai/aiProviderAdapter.js";
import { createModelDraft, FORBIDDEN_DRAFT_KEYS } from "../../../src/intelligence/ai/aiDraftTypes.js";
import { isApprovedAiTask } from "../../../src/intelligence/ai/aiTaskTypes.js";
import { validateModelDraft } from "../../../src/intelligence/ai/aiOutputValidator.js";
import { isExternalProviderEnabled } from "../../../src/intelligence/shadow/shadowPolicy.js";
import {
  GEMINI_API_REVISION,
  GEMINI_INTERACTIONS_URL,
  resolveGeminiConfig,
} from "./geminiConfig.js";
import { getGeminiResponseFormat } from "./geminiJsonSchema.js";

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
      providerErrorType: typeof telemetry?.providerErrorType === "string" ? telemetry.providerErrorType : null,
      providerErrorCode: typeof telemetry?.providerErrorCode === "string" ? telemetry.providerErrorCode : null,
    },
  };
}

function fail(code, message, telemetry) {
  return withTelemetry(createProviderFailure(code, message), telemetry);
}

function errorCodeFromHttpStatus(status) {
  if (status === 400) return "provider-request-invalid";
  if (status === 401) return "provider-auth-failed";
  if (status === 403) return "provider-permission-denied";
  if (status === 404) return "provider-not-found";
  if (status === 429) return "provider-rate-limited";
  if (Number.isInteger(status) && status >= 500 && status <= 599) return "provider-server-error";
  return "provider-unavailable";
}

function readSafeProviderErrorField(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return readSafeProviderErrorField(String(value));
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 80) return null;
  if (!/^[a-zA-Z0-9_.:-]+$/u.test(trimmed)) return null;
  if (/sk-|bearer|AIza/iu.test(trimmed)) return null;
  return trimmed;
}

async function extractProviderErrorClass(response) {
  try {
    const parsed = await response.json();
    const error = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed.error
      : null;
    return {
      providerErrorType: readSafeProviderErrorField(error?.status ?? error?.type),
      providerErrorCode: readSafeProviderErrorField(error?.code),
    };
  } catch {
    return { providerErrorType: null, providerErrorCode: null };
  }
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

export function serializeApprovedGeminiPayload({ task, userQuery, approvedContext, constraints } = {}) {
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

export function extractGeminiModelOutputText(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, completed: false, text: "" };
  }
  const completed = raw.status === "completed";
  const steps = Array.isArray(raw.steps) ? raw.steps : [];
  const texts = [];
  for (const step of steps) {
    if (step?.type !== "model_output") continue;
    const parts = Array.isArray(step.content) ? step.content : [];
    for (const part of parts) {
      if (part?.type === "text" && typeof part.text === "string") {
        texts.push(part.text);
      }
    }
  }
  const text = texts.join("");
  if (!completed) {
    return { ok: false, completed: false, text };
  }
  if (!text.trim()) {
    return { ok: false, completed: true, text: "" };
  }
  return { ok: true, completed: true, text };
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

export async function completeGemini(request = {}, options = {}) {
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
    if (!isExternalProviderEnabled(options.env)) {
      return fail(
        "provider-not-configured",
        "No generative provider is enabled. FOINWI continues with deterministic guidance.",
        telemetry(),
      );
    }

    const resolved = resolveGeminiConfig(options.env, options);
    if (!resolved.ok) {
      return fail(resolved.code, resolved.message, telemetry());
    }

    const payload = serializeApprovedGeminiPayload(request);
    const fetchFn = typeof options.fetchImpl === "function" ? options.fetchImpl : globalThis.fetch;
    if (typeof fetchFn !== "function") {
      return fail("provider-unavailable", "The language provider is temporarily unavailable.", telemetry());
    }

    let response;
    try {
      response = await fetchWithTimeout(fetchFn, GEMINI_INTERACTIONS_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-goog-api-key": resolved.config.apiKey,
          "Api-Revision": GEMINI_API_REVISION,
        },
        body: JSON.stringify({
          model: resolved.config.model,
          system_instruction: SYSTEM_PROMPT,
          input: JSON.stringify(payload),
          store: false,
          response_format: getGeminiResponseFormat(),
          generation_config: {
            thinking_level: "minimal",
            max_output_tokens: 1200,
          },
        }),
      }, resolved.config.timeoutMs);
    } catch (error) {
      const timedOut = error?.name === "AbortError";
      return fail(
        timedOut ? "provider-timeout" : "provider-network-error",
        timedOut
          ? "The language provider timed out. FOINWI continues with deterministic guidance."
          : "The language provider is temporarily unavailable.",
        { ...telemetry(), timedOut },
      );
    }

    if (!response.ok) {
      const providerErrorClass = await extractProviderErrorClass(response);
      return fail(
        errorCodeFromHttpStatus(response.status),
        "The language provider is temporarily unavailable.",
        {
          ...telemetry(),
          requestId: readRequestId(response, null),
          providerErrorType: providerErrorClass.providerErrorType,
          providerErrorCode: providerErrorClass.providerErrorCode,
        },
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
    const extracted = extractGeminiModelOutputText(raw);
    if (!extracted.completed) {
      return fail("provider-unavailable", "The language provider did not complete the interaction.", {
        ...telemetry(),
        requestId,
      });
    }
    if (!extracted.ok || !extracted.text.trim()) {
      return fail("malformed-output", "The language provider returned an empty draft.", {
        ...telemetry(),
        requestId,
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(extracted.text);
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

export function createGeminiAdapter(options = {}) {
  return createAiProviderAdapter({
    complete(request) {
      return completeGemini(request, options);
    },
  });
}
