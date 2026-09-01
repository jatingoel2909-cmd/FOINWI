/**
 * Shadow Runtime policy.
 * Shadow Mode defaults ON. External provider calls default OFF.
 * There is no environment flag that can serve model output to users.
 * FOINWI_AI_PROVIDER_ENABLED is a server-only network gate, not a public-AI flag.
 */

function readBoolean(value, defaultValue) {
  if (value === undefined || value === null || value === "") return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  return defaultValue;
}

export function isShadowModeEnabled(env = {}) {
  return readBoolean(env?.FOINWI_AI_SHADOW_MODE, true);
}

export function isExternalProviderEnabled(env = {}) {
  return readBoolean(env?.FOINWI_AI_PROVIDER_ENABLED, false);
}

export function canUseAiForUserResponse() {
  return false;
}

export function resolveShadowPolicy(env = {}) {
  return {
    shadowMode: isShadowModeEnabled(env),
    providerEnabled: isExternalProviderEnabled(env),
    usedForUserResponse: false,
  };
}
