/**
 * FOINWI Intelligence Engine — request/response contract (Phase 2).
 * Deterministic educational routing only. No model. No persistence.
 */

export const INTELLIGENCE_SCHEMA_VERSION = "1.0.0";

export const INTELLIGENCE_SURFACES = Object.freeze([
  "guide",
  "command-center",
  "ai-tools",
  "api",
]);

export const INTELLIGENCE_RESPONSE_TYPES = Object.freeze([
  "SUPPORTED",
  "CLARIFY",
  "FALLBACK",
  "UNSUPPORTED",
  "SAFETY",
]);

export const INTELLIGENCE_CONFIDENCE = Object.freeze([
  "high",
  "medium",
  "low",
  "safety",
]);

export const INTELLIGENCE_SOURCE_TYPES = Object.freeze([
  "deterministic-intent",
  "deterministic-search",
  "clarification",
  "fallback",
  "safety",
]);

export const INTELLIGENCE_ACTION_TYPES = Object.freeze([
  "CALCULATE",
  "LEARN",
  "PLAN",
  "CHECK",
  "EXPLORE",
]);

export const MAX_INTELLIGENCE_QUERY_LENGTH = 400;

export const DEFAULT_INTELLIGENCE_SAFETY = Object.freeze({
  educationalOnly: true,
  disclaimer:
    "Educational guidance only. FOINWI does not provide personalised investment, tax, loan, legal, or financial advice.",
});

export function createEmptyIntelligenceContext() {
  return {
    pathname: undefined,
    conceptId: undefined,
    calculatorPath: undefined,
    lessonSlug: undefined,
    journeySlug: undefined,
    healthTopic: undefined,
  };
}

export function createIntelligenceAction({ type, label, path, resourceId }) {
  return {
    type,
    label,
    path,
    resourceId,
  };
}

export function createResourceRef(resource) {
  if (!resource?.path) return null;
  return {
    path: resource.path,
    title: resource.title ?? "",
  };
}

export function createIntelligenceResponse(partial = {}) {
  return {
    schemaVersion: INTELLIGENCE_SCHEMA_VERSION,
    responseType: partial.responseType ?? "FALLBACK",
    intent: partial.intent ?? null,
    topic: partial.topic ?? null,
    confidence: partial.confidence ?? "low",
    confidenceScore: Number.isFinite(partial.confidenceScore) ? partial.confidenceScore : 20,
    explanation: partial.explanation ?? "",
    keyPoints: Array.isArray(partial.keyPoints) ? partial.keyPoints : [],
    suggestedActions: Array.isArray(partial.suggestedActions) ? partial.suggestedActions : [],
    calculator: partial.calculator ?? null,
    learn: partial.learn ?? null,
    journey: partial.journey ?? null,
    healthScore: partial.healthScore ?? null,
    exchangeRates: partial.exchangeRates ?? null,
    clarification: partial.clarification ?? null,
    safety: {
      ...DEFAULT_INTELLIGENCE_SAFETY,
      ...(partial.safety ?? {}),
    },
    sourceType: partial.sourceType ?? "fallback",
    usedModel: false,
  };
}
