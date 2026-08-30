import { AI_DRAFT_SCHEMA_VERSION } from "./aiTaskTypes.js";

/**
 * Intermediate model output. Never an IntelligenceResponse.
 * Must not carry routes, rates, calculator results, or safety authority.
 */

export function createModelDraft({
  task,
  candidateIntentIds = [],
  text = "",
  confidenceScore = 0,
  flags = [],
} = {}) {
  return {
    schemaVersion: AI_DRAFT_SCHEMA_VERSION,
    task,
    candidateIntentIds: [...candidateIntentIds],
    text: String(text ?? ""),
    confidenceScore: Number(confidenceScore),
    flags: [...flags],
  };
}

export const FORBIDDEN_DRAFT_KEYS = Object.freeze([
  "suggestedActions",
  "calculator",
  "learn",
  "journey",
  "healthScore",
  "exchangeRates",
  "safety",
  "rate",
  "emi",
  "taxDue",
  "provider",
  "model",
  "apiKey",
]);
