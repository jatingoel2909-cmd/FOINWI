/**
 * Provider-independent adapter. Phase 4A never calls a network or vendor SDK.
 * A later adapter may implement complete() without changing this contract.
 */

import { isApprovedAiTask } from "./aiTaskTypes.js";

export const AI_PROVIDER_ERROR_CODES = Object.freeze([
  "provider-not-configured",
  "provider-timeout",
  "provider-unavailable",
  "malformed-output",
  "schema-failure",
  "safety-failure",
  "unknown-intent",
  "injection-detected",
]);

export function createProviderFailure(code, message) {
  return {
    ok: false,
    draft: null,
    error: {
      code: AI_PROVIDER_ERROR_CODES.includes(code) ? code : "provider-unavailable",
      message,
    },
  };
}

export async function complete({ task, userQuery, approvedContext, constraints } = {}) {
  if (!isApprovedAiTask(task) || !approvedContext || !userQuery) {
    return createProviderFailure("schema-failure", "The AI task request is not valid.");
  }
  if (constraints && constraints.noAdvice !== true) {
    return createProviderFailure("safety-failure", "AI tasks must keep FOINWI advice constraints.");
  }
  return createProviderFailure(
    "provider-not-configured",
    "No generative provider is configured. FOINWI continues with deterministic guidance.",
  );
}

export function createAiProviderAdapter(implementation) {
  return {
    complete(request) {
      if (!implementation || typeof implementation.complete !== "function") {
        return complete(request);
      }
      return implementation.complete(request);
    },
  };
}
