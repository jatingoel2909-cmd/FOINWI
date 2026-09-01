/**
 * Provider-independent Shadow Runtime.
 * Never replaces IntelligenceResponse. Never enables public AI.
 */

import { complete as defaultComplete } from "../ai/aiProviderAdapter.js";
import { getPreModelBlockReason } from "../ai/aiGuardrails.js";
import { validateModelDraft } from "../ai/aiOutputValidator.js";
import { planGuardedIntelligence } from "../ai/guardedIntelligence.js";
import { INTELLIGENCE_SURFACES } from "../engine/intelligenceTypes.js";
import { canUseAiForUserResponse, resolveShadowPolicy } from "./shadowPolicy.js";
import { createShadowSink, resolveShadowSinkKind } from "./shadowSink.js";
import { createShadowReview, hashShadowValue, isValidShadowReview } from "./shadowTypes.js";

function decisionFromError(code) {
  if (code === "provider-not-configured") return "provider-not-configured";
  if (code === "provider-timeout") return "provider-timeout";
  if (code === "injection-detected" || code === "safety-failure") return "blocked-pre-model";
  if (code === "malformed-output" || code === "schema-failure" || code === "unknown-intent") {
    return "validation-failed";
  }
  return "provider-unavailable";
}

function sourceContentFrom(planned) {
  return planned.approvedContext?.approvedCopy?.[0]?.simpleAnswer ?? "";
}

async function writeSafely(sink, review) {
  try {
    sink.write(review);
  } catch {
    // Shadow persistence must never affect the public response.
  }
}

export async function runShadowIntelligence(request = {}, options = {}) {
  const policy = resolveShadowPolicy(options.env);
  const planned = planGuardedIntelligence(request);
  const query = typeof request.query === "string" ? request.query.replace(/\s+/gu, " ").trim() : "";
  const blockReason = getPreModelBlockReason(query);
  const adapter = options.adapter && typeof options.adapter.complete === "function"
    ? options.adapter
    : { complete: defaultComplete };
  const sink = options.sink ?? createShadowSink(resolveShadowSinkKind(options.env));

  const base = {
    createdAt: typeof options.now === "string" ? options.now : new Date().toISOString(),
    shadowMode: policy.shadowMode,
    usedForUserResponse: canUseAiForUserResponse(),
    surface: INTELLIGENCE_SURFACES.includes(request.surface) ? request.surface : "api",
    task: planned.aiPlan.task,
    routeReason: planned.aiPlan.reason,
    safety: { educationalOnly: true, preModelBlockReason: blockReason },
    query: {
      length: query.length,
      hash: await hashShadowValue(query),
    },
    deterministic: {
      responseType: planned.response.responseType,
      intent: planned.response.intent,
      confidence: planned.response.confidence,
      sourceType: planned.response.sourceType,
      explanationHash: await hashShadowValue(planned.response.explanation),
      usedModel: false,
    },
    candidate: {
      ok: false,
      draftHash: null,
      validationOk: false,
      validationReason: null,
      errorCode: null,
      latencyMs: null,
      timedOut: false,
    },
  };

  let decision;
  if (!policy.shadowMode) {
    decision = "shadow-disabled";
  } else if (blockReason) {
    decision = "blocked-pre-model";
  } else if (!planned.aiPlan.useAi) {
    decision = "deterministic-only";
  } else if (!policy.providerEnabled) {
    decision = "provider-not-configured";
    base.candidate = {
      ...base.candidate,
      errorCode: "provider-not-configured",
    };
  } else {
    const started = Date.now();
    let provider;
    try {
      provider = await adapter.complete({
        task: planned.aiPlan.task,
        userQuery: query,
        approvedContext: planned.approvedContext,
        constraints: planned.approvedContext?.constraints,
      });
    } catch {
      provider = {
        ok: false,
        draft: null,
        error: { code: "provider-unavailable", message: "The provider failed." },
      };
    }
    const latencyMs = Math.max(0, Date.now() - started);
    const errorCode = provider?.error?.code ?? null;
    const timedOut = errorCode === "provider-timeout";

    if (!provider?.ok || !provider.draft) {
      decision = decisionFromError(errorCode);
      base.candidate = {
        ...base.candidate,
        errorCode,
        latencyMs,
        timedOut,
      };
    } else {
      const validation = validateModelDraft(provider.draft, { sourceContent: sourceContentFrom(planned) });
      base.candidate = {
        ok: validation.ok,
        draftHash: validation.ok ? await hashShadowValue(JSON.stringify(provider.draft)) : null,
        validationOk: validation.ok,
        validationReason: validation.ok ? null : validation.reason,
        errorCode: validation.ok ? null : (validation.reason ?? "validation-failed"),
        latencyMs,
        timedOut,
      };
      decision = validation.ok ? "recorded-candidate" : "validation-failed";
    }
  }

  const review = createShadowReview({
    ...base,
    decision,
    usedForUserResponse: false,
  });

  if (!isValidShadowReview(review)) {
    const fallback = createShadowReview({
      ...base,
      decision: "provider-unavailable",
      usedForUserResponse: false,
    });
    await writeSafely(sink, fallback);
    return {
      response: planned.response,
      review: fallback,
    };
  }

  await writeSafely(sink, review);
  return {
    response: planned.response,
    review,
  };
}
