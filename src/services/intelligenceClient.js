import { isApprovedIntelligencePath } from "../intelligence/engine/intelligenceAllowlist.js";
import { isValidIntelligenceResponse } from "../intelligence/engine/intelligenceTypes.js";

const API_PATH = "/api/intelligence";
const REQUEST_TIMEOUT_MS = 8_000;

async function requestJson(body, signal) {
  const response = await fetch(API_PATH, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("invalid-response");
  }

  if (!response.ok) {
    throw new Error(payload?.error?.code || "server-error");
  }

  if (!isValidIntelligenceResponse(payload, isApprovedIntelligencePath)) {
    throw new Error("invalid-response");
  }

  return payload;
}

function withTimeout(callback) {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  return callback(controller.signal).finally(() => globalThis.clearTimeout(timeout));
}

export function requestIntelligence(input) {
  return withTimeout((signal) => requestJson(input, signal));
}

export function getIntelligenceErrorMessage(error) {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return "You appear to be offline. Connect to the internet and try again.";
  }
  if (error?.name === "AbortError") return "The request timed out. Please try again.";
  if (error?.message === "empty-query" || error?.message === "invalid-request") {
    return "That request could not be processed. Try a shorter educational question.";
  }
  if (error?.message === "query-too-long") return "That question is too long. Please shorten it and try again.";
  if (error?.message === "invalid-surface" || error?.message === "invalid-locale") {
    return "That request could not be processed.";
  }
  return "Intelligence is temporarily unavailable.";
}
