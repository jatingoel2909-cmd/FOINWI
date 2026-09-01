/* global process */
/**
 * Opt-in real OpenAI shadow smoke test.
 * Default: skipped. Never part of npm run validate:* or build.
 * Does not print keys, Authorization headers, or raw provider payloads.
 */

import { isRealShadowSmokeTestEnabled } from "../functions/lib/intelligence/realSmokePolicy.js";
import { runConfiguredShadowIntelligence } from "../functions/lib/intelligence/shadowHook.js";

const SMOKE_QUERY = "I want a starting point on this website for learning how regular investing works for a beginner";

function readSmokeEnv() {
  return {
    FOINWI_AI_REAL_SMOKE_TEST: process.env.FOINWI_AI_REAL_SMOKE_TEST,
    FOINWI_AI_SHADOW_MODE: process.env.FOINWI_AI_SHADOW_MODE,
    // Smoke-script only. Production API never treats the smoke switch as traffic activation.
    FOINWI_AI_PROVIDER_ENABLED: "true",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENAI_TIMEOUT_MS: process.env.OPENAI_TIMEOUT_MS,
  };
}

function hasKey(env) {
  return typeof env.OPENAI_API_KEY === "string" && env.OPENAI_API_KEY.trim().length > 0;
}

if (!isRealShadowSmokeTestEnabled(readSmokeEnv())) {
  console.log("OpenAI shadow smoke test skipped (FOINWI_AI_REAL_SMOKE_TEST is not true).");
  process.exit(0);
}

const env = readSmokeEnv();
if (!hasKey(env)) {
  console.error("Smoke test enabled but the server key is not configured.");
  process.exit(1);
}

const result = await runConfiguredShadowIntelligence(
  { query: SMOKE_QUERY, surface: "api" },
  { env },
);

const review = result.review ?? {};
console.log(JSON.stringify({
  skipped: false,
  usedForUserResponse: review.usedForUserResponse === true,
  usedModel: result.response?.usedModel === true,
  decision: review.decision ?? null,
  task: review.task ?? null,
  candidateOk: review.candidate?.ok === true,
  validationOk: review.candidate?.validationOk === true,
  errorCode: review.candidate?.errorCode ?? null,
  timedOut: review.candidate?.timedOut === true,
  latencyMs: Number.isFinite(review.candidate?.latencyMs) ? review.candidate.latencyMs : null,
}));
