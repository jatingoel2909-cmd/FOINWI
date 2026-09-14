/**
 * Server-only Gemini configuration.
 * The allowlist is intentionally small for this Shadow experiment.
 */

export const GEMINI_INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
export const GEMINI_API_REVISION = "2026-05-20";

export const SUPPORTED_GEMINI_MODELS = Object.freeze([
  "gemini-3.6-flash",
]);

export const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";
export const DEFAULT_GEMINI_TIMEOUT_MS = 4000;
export const MIN_GEMINI_TIMEOUT_MS = 1000;
export const MAX_GEMINI_TIMEOUT_MS = 8000;

function readTimeoutMs(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_GEMINI_TIMEOUT_MS;
  return Math.min(MAX_GEMINI_TIMEOUT_MS, Math.max(MIN_GEMINI_TIMEOUT_MS, Math.trunc(parsed)));
}

export function isSupportedGeminiModel(model) {
  return SUPPORTED_GEMINI_MODELS.includes(model);
}

export function resolveGeminiConfig(env = {}, options = {}) {
  const apiKey = String(env.GEMINI_API_KEY ?? "").trim();
  if (!apiKey) {
    return {
      ok: false,
      code: "provider-not-configured",
      message: "No generative provider is configured. FOINWI continues with deterministic guidance.",
      config: null,
    };
  }

  const requestedModel = typeof options.model === "string" ? options.model.trim() : "";
  const model = requestedModel || DEFAULT_GEMINI_MODEL;
  if (!isSupportedGeminiModel(model)) {
    return {
      ok: false,
      code: "schema-failure",
      message: "That language-model ID is not on FOINWI's approved list.",
      config: null,
    };
  }

  return {
    ok: true,
    code: null,
    message: null,
    config: {
      apiKey,
      model,
      timeoutMs: readTimeoutMs(options.timeoutMs),
    },
  };
}
