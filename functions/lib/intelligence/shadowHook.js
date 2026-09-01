/**
 * Generic Shadow hook for the Intelligence API.
 * Public HTTP bodies stay deterministic. Provider names stay out of the API file.
 */

import { runShadowIntelligence } from "../../../src/intelligence/shadow/shadowRuntime.js";
import { createShadowProvider } from "./createShadowProvider.js";

export async function runConfiguredShadowIntelligence(intelligenceRequest, options = {}) {
  const env = options.env ?? {};
  const adapter = options.adapter && typeof options.adapter.complete === "function"
    ? options.adapter
    : createShadowProvider({ env, fetchImpl: options.fetchImpl });

  return runShadowIntelligence(intelligenceRequest, {
    env,
    adapter,
    sink: options.sink,
  });
}

function swallow(job) {
  return Promise.resolve()
    .then(() => job)
    .catch(() => null);
}

export function scheduleShadowIntelligence({
  intelligenceRequest,
  env,
  waitUntil,
  fetchImpl,
  sink,
  adapter,
} = {}) {
  // Production Shadow stays on Cloudflare waitUntil. Without it, skip automatic
  // background work so the public response never depends on a dangling Promise.
  if (typeof waitUntil !== "function") {
    return Promise.resolve(null);
  }

  const job = swallow(runConfiguredShadowIntelligence(intelligenceRequest, {
    env,
    fetchImpl,
    sink,
    adapter,
  }));

  try {
    waitUntil(job);
  } catch {
    return Promise.resolve(null);
  }

  return job;
}
