/**
 * Server-only OpenAI configuration.
 * Not a permanent production-model decision. The allowlist is intentionally small.
 */

export const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export const SUPPORTED_OPENAI_MODELS = Object.freeze([
  "gpt-5.6-luna",
  "gpt-5.6-terra",
]);

export const DEFAULT_OPENAI_MODEL = "gpt-5.6-luna";
export const DEFAULT_OPENAI_TIMEOUT_MS = 4000;
export const MIN_OPENAI_TIMEOUT_MS = 1000;
export const MAX_OPENAI_TIMEOUT_MS = 8000;

function readTimeoutMs(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_OPENAI_TIMEOUT_MS;
  return Math.min(MAX_OPENAI_TIMEOUT_MS, Math.max(MIN_OPENAI_TIMEOUT_MS, Math.trunc(parsed)));
}

export function isSupportedOpenAiModel(model) {
  return SUPPORTED_OPENAI_MODELS.includes(model);
}

export function resolveOpenAiConfig(env = {}) {
  const apiKey = String(env.OPENAI_API_KEY ?? "").trim();
  if (!apiKey) {
    return {
      ok: false,
      code: "provider-not-configured",
      message: "No generative provider is configured. FOINWI continues with deterministic guidance.",
      config: null,
    };
  }

  const requestedModel = String(env.OPENAI_MODEL ?? "").trim();
  const model = requestedModel || DEFAULT_OPENAI_MODEL;
  if (!isSupportedOpenAiModel(model)) {
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
      timeoutMs: readTimeoutMs(env.OPENAI_TIMEOUT_MS),
    },
  };
}
