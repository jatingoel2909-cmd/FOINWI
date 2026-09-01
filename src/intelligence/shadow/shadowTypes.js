/**
 * Production Shadow Record: privacy-minimized metadata and hashes only.
 *
 * Founder Tester Review is a separate future concept. It may expose an explicit
 * TEST prompt and candidate text only when a later tester mode is enabled.
 * That mode is not implemented here and must not be conflated with this record.
 */

import { INTELLIGENCE_SURFACES } from "../engine/intelligenceTypes.js";
import { isApprovedAiTask } from "../ai/aiTaskTypes.js";

export const SHADOW_REVIEW_SCHEMA_VERSION = "1.0.0";
export const SHADOW_RECORD_KIND = "production-shadow-record";

export const SHADOW_DECISIONS = Object.freeze([
  "blocked-pre-model",
  "deterministic-only",
  "shadow-disabled",
  "provider-not-configured",
  "provider-timeout",
  "provider-unavailable",
  "validation-failed",
  "recorded-candidate",
]);

export const FORBIDDEN_SHADOW_REVIEW_KEYS = Object.freeze([
  "apiKey",
  "pan",
  "aadhaar",
  "account",
  "accountNumber",
  "bankAccount",
  "answers",
  "healthAnswers",
  "healthScoreAnswers",
  "conversationHistory",
  "messages",
  "history",
  "amount",
  "exchangeAmount",
  "rawProviderPayload",
  "systemPrompt",
  "prompt",
  "suggestedActions",
  "draft",
  "text",
  "userQuery",
  "queryText",
  "explanation",
]);

export async function hashShadowValue(value) {
  const encoded = new TextEncoder().encode(String(value ?? ""));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hasForbiddenKey(value) {
  if (!value || typeof value !== "object") return false;
  if (FORBIDDEN_SHADOW_REVIEW_KEYS.some((key) => Object.hasOwn(value, key))) return true;
  return Object.values(value).some((entry) => (
    entry
    && typeof entry === "object"
    && !Array.isArray(entry)
    && hasForbiddenKey(entry)
  ));
}

export function isValidShadowReview(review) {
  if (!review || typeof review !== "object" || Array.isArray(review)) return false;
  if (review.schemaVersion !== SHADOW_REVIEW_SCHEMA_VERSION) return false;
  if (review.recordKind !== SHADOW_RECORD_KIND) return false;
  if (typeof review.createdAt !== "string" || !review.createdAt) return false;
  if (review.shadowMode !== true && review.shadowMode !== false) return false;
  if (review.usedForUserResponse !== false) return false;
  if (!INTELLIGENCE_SURFACES.includes(review.surface)) return false;
  if (review.task !== null && !isApprovedAiTask(review.task)) return false;
  if (typeof review.routeReason !== "string") return false;
  if (!SHADOW_DECISIONS.includes(review.decision)) return false;
  if (!review.safety || review.safety.educationalOnly !== true) return false;
  if (review.safety.preModelBlockReason !== null && typeof review.safety.preModelBlockReason !== "string") {
    return false;
  }
  if (!review.query || !Number.isInteger(review.query.length) || review.query.length < 0) return false;
  if (typeof review.query.hash !== "string" || review.query.hash.length !== 64) return false;
  if (!review.deterministic || review.deterministic.usedModel !== false) return false;
  if (typeof review.deterministic.explanationHash !== "string") return false;
  if (!review.candidate || typeof review.candidate !== "object") return false;
  if (review.candidate.ok !== true && review.candidate.ok !== false) return false;
  if (review.candidate.timedOut !== true && review.candidate.timedOut !== false) return false;
  if (review.candidate.latencyMs !== null && !Number.isFinite(review.candidate.latencyMs)) return false;
  if (review.decision === "recorded-candidate") {
    if (review.candidate.ok !== true || review.candidate.validationOk !== true) return false;
    if (typeof review.candidate.draftHash !== "string" || review.candidate.draftHash.length !== 64) return false;
  }
  if (hasForbiddenKey(review)) return false;
  return true;
}

export function createShadowReview(partial = {}) {
  return {
    schemaVersion: SHADOW_REVIEW_SCHEMA_VERSION,
    recordKind: SHADOW_RECORD_KIND,
    createdAt: typeof partial.createdAt === "string" ? partial.createdAt : new Date().toISOString(),
    shadowMode: partial.shadowMode === false ? false : true,
    usedForUserResponse: false,
    surface: INTELLIGENCE_SURFACES.includes(partial.surface) ? partial.surface : "api",
    task: isApprovedAiTask(partial.task) ? partial.task : null,
    routeReason: typeof partial.routeReason === "string" ? partial.routeReason : "unknown",
    decision: SHADOW_DECISIONS.includes(partial.decision) ? partial.decision : "deterministic-only",
    safety: {
      educationalOnly: true,
      preModelBlockReason: typeof partial.safety?.preModelBlockReason === "string"
        ? partial.safety.preModelBlockReason
        : null,
    },
    query: {
      length: Number.isInteger(partial.query?.length) ? partial.query.length : 0,
      hash: typeof partial.query?.hash === "string" ? partial.query.hash : "",
    },
    deterministic: {
      responseType: partial.deterministic?.responseType ?? null,
      intent: partial.deterministic?.intent ?? null,
      confidence: partial.deterministic?.confidence ?? null,
      sourceType: partial.deterministic?.sourceType ?? null,
      explanationHash: typeof partial.deterministic?.explanationHash === "string"
        ? partial.deterministic.explanationHash
        : "",
      usedModel: false,
    },
    candidate: {
      ok: partial.candidate?.ok === true,
      draftHash: typeof partial.candidate?.draftHash === "string" ? partial.candidate.draftHash : null,
      validationOk: partial.candidate?.validationOk === true,
      validationReason: typeof partial.candidate?.validationReason === "string"
        ? partial.candidate.validationReason
        : null,
      errorCode: typeof partial.candidate?.errorCode === "string" ? partial.candidate.errorCode : null,
      latencyMs: Number.isFinite(partial.candidate?.latencyMs) ? partial.candidate.latencyMs : null,
      timedOut: partial.candidate?.timedOut === true,
    },
  };
}
