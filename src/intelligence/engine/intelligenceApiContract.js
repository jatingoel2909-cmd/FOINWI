/**
 * Same-origin Intelligence API request parsing.
 * Used by the Pages Function. Does not run the engine.
 */

import {
  INTELLIGENCE_SURFACES,
  MAX_INTELLIGENCE_QUERY_LENGTH,
} from "./intelligenceTypes.js";

const REJECTED_REQUEST_FIELDS = Object.freeze([
  "conversationHistory",
  "messages",
  "history",
  "healthAnswers",
  "healthScoreAnswers",
  "answers",
  "pan",
  "aadhaar",
  "accountNumber",
  "bankAccount",
  "account",
  "apiKey",
  "provider",
  "model",
  "prompt",
  "systemPrompt",
  "suggestedActions",
  "actions",
]);

const REJECTED_CONTEXT_FIELDS = Object.freeze([
  "answers",
  "healthAnswers",
  "healthScoreAnswers",
  "pan",
  "aadhaar",
  "accountNumber",
  "suggestedActions",
  "actions",
  "provider",
  "model",
]);

const CONTEXT_FIELDS = Object.freeze([
  "pathname",
  "conceptId",
  "calculatorPath",
  "lessonSlug",
  "journeySlug",
  "healthTopic",
]);

function invalid(code, message) {
  return { ok: false, code, message };
}

export function parseIntelligenceApiRequest(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return invalid("invalid-request", "Request body must be a JSON object.");
  }

  const rejected = REJECTED_REQUEST_FIELDS.find((field) => Object.hasOwn(body, field));
  if (rejected) {
    return invalid("invalid-request", "This endpoint does not accept conversation history, account data, or model configuration.");
  }

  if (!Object.hasOwn(body, "query") || typeof body.query !== "string") {
    return invalid("invalid-request", "Query must be a string.");
  }

  const query = body.query.replace(/\s+/gu, " ").trim();
  if (!query) {
    return invalid("empty-query", "Query is required.");
  }
  if (body.query.length > MAX_INTELLIGENCE_QUERY_LENGTH || query.length > MAX_INTELLIGENCE_QUERY_LENGTH) {
    return invalid("query-too-long", "Query is too long.");
  }

  if (Object.hasOwn(body, "locale") && body.locale !== "en-IN") {
    return invalid("invalid-locale", "Locale is not supported.");
  }

  if (Object.hasOwn(body, "surface") && !INTELLIGENCE_SURFACES.includes(body.surface)) {
    return invalid("invalid-surface", "Surface is not supported.");
  }

  let context;
  if (Object.hasOwn(body, "context")) {
    if (body.context === null || typeof body.context !== "object" || Array.isArray(body.context)) {
      return invalid("invalid-request", "Context must be an object.");
    }
    const rejectedContext = REJECTED_CONTEXT_FIELDS.find((field) => Object.hasOwn(body.context, field));
    if (rejectedContext) {
      return invalid("invalid-request", "Context contains unsupported fields.");
    }
    context = {};
    CONTEXT_FIELDS.forEach((field) => {
      if (typeof body.context[field] === "string" && body.context[field].trim()) {
        context[field] = body.context[field].trim();
      }
    });
  }

  return {
    ok: true,
    request: {
      query,
      locale: "en-IN",
      surface: INTELLIGENCE_SURFACES.includes(body.surface) ? body.surface : "api",
      ...(context ? { context } : {}),
    },
  };
}
