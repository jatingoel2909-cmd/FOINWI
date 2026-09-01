/**
 * Allowlisted payload a future model may receive.
 * Never pass raw request objects, secrets, or application state.
 */

import { GUIDE_INTENTS } from "../guide/guideIntents.js";
import {
  AI_DRAFT_SCHEMA_VERSION,
  MAX_APPROVED_QUERY_LENGTH,
  MAX_CANDIDATE_INTENTS,
  isApprovedAiTask,
} from "./aiTaskTypes.js";

const BLOCKED_CONTEXT_KEYS = Object.freeze([
  "answers",
  "healthAnswers",
  "healthScoreAnswers",
  "pan",
  "aadhaar",
  "accountNumber",
  "bankAccount",
  "account",
  "conversationHistory",
  "messages",
  "history",
  "amount",
  "exchangeAmount",
  "apiKey",
  "provider",
  "model",
  "env",
  "sourceCode",
  "html",
  "stack",
]);

export function getApprovedIntentIds() {
  return GUIDE_INTENTS.map((intent) => intent.id);
}

export function getApprovedIntent(intentId) {
  return GUIDE_INTENTS.find((intent) => intent.id === intentId) ?? null;
}

function sanitizeQuery(query = "") {
  return String(query).replace(/\s+/gu, " ").trim().slice(0, MAX_APPROVED_QUERY_LENGTH);
}

export function buildApprovedAiContext({
  task,
  userQuery,
  candidateIntentIds = [],
  surface,
  conceptNames = [],
} = {}) {
  if (!isApprovedAiTask(task)) return null;

  const approvedIds = new Set(getApprovedIntentIds());
  const intents = [...new Set(candidateIntentIds)]
    .filter((id) => approvedIds.has(id))
    .slice(0, MAX_CANDIDATE_INTENTS);

  const approvedCopy = intents
    .map((id) => getApprovedIntent(id))
    .filter(Boolean)
    .map((intent) => ({
      intentId: intent.id,
      simpleAnswer: intent.simpleAnswer,
      deeperExplanation: intent.deeperExplanation,
    }));

  return {
    schemaVersion: AI_DRAFT_SCHEMA_VERSION,
    task,
    userQuery: sanitizeQuery(userQuery),
    candidateIntentIds: intents,
    allowedIntentIds: task === "CLASSIFY" ? getApprovedIntentIds() : [],
    approvedCopy: task === "SIMPLIFY" ? approvedCopy : [],
    conceptNames: conceptNames.filter((name) => typeof name === "string").slice(0, 6),
    surface: surface === "guide" || surface === "command-center" || surface === "ai-tools" || surface === "api"
      ? surface
      : "api",
    constraints: {
      noAdvice: true,
      noUrls: true,
      noNewIntents: true,
      noCalculatorResults: true,
      noProductRecommendations: true,
      sourceCopyIsAuthoritative: task === "SIMPLIFY",
    },
  };
}

export function approvedContextHasBlockedFields(context) {
  if (!context || typeof context !== "object") return true;
  return BLOCKED_CONTEXT_KEYS.some((key) => Object.hasOwn(context, key));
}
