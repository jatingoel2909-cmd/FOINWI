/**
 * Server-only provider composition. Vendor details stay out of the API file.
 * One language-provider call maximum per shadow request. No retries.
 * No vendor is hard-coded. Default complete() stays fail-closed.
 */

import { complete as defaultComplete, createProviderFailure } from "../../../src/intelligence/ai/aiProviderAdapter.js";
import { isExternalProviderEnabled } from "../../../src/intelligence/shadow/shadowPolicy.js";

export const MAX_SHADOW_PROVIDER_CALLS = 1;

export function createShadowProvider({ env = {}, adapter } = {}) {
  const resolvedAdapter = adapter && typeof adapter.complete === "function"
    ? adapter
    : { complete: defaultComplete };
  let calls = 0;

  return {
    complete(request) {
      if (!isExternalProviderEnabled(env)) {
        return createProviderFailure(
          "provider-not-configured",
          "No generative provider is enabled. FOINWI continues with deterministic guidance.",
        );
      }
      calls += 1;
      if (calls > MAX_SHADOW_PROVIDER_CALLS) {
        return createProviderFailure(
          "schema-failure",
          "FOINWI allows one language-provider call per shadow request.",
        );
      }
      return resolvedAdapter.complete(request);
    },
  };
}
