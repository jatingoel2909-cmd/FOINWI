/**
 * Opt-in real OpenAI shadow smoke test. Default off.
 * Never imported by the production Intelligence API.
 */

export function isRealShadowSmokeTestEnabled(env = {}) {
  const value = String(env.FOINWI_AI_REAL_SMOKE_TEST ?? "").trim().toLowerCase();
  return value === "true" || value === "1";
}
