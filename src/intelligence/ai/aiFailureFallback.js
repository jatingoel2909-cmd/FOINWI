/**
 * Model failures must never replace FOINWI's deterministic answer.
 */

import { runIntelligence } from "../engine/runIntelligence.js";

export function resolveAiFailure(request, deterministicResponse, error) {
  const fallback = deterministicResponse ?? runIntelligence(request);
  return {
    response: fallback,
    usedModel: false,
    aiError: error?.code ?? "provider-unavailable",
  };
}
