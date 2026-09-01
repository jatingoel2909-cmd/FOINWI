/**
 * Shadow Runtime policy.
 * Shadow Mode defaults ON. Public AI cannot be enabled in Phase 4B.1.
 * There is no environment flag that can serve model output to users.
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

export function canUseAiForUserResponse() {
  return false;
}

export function resolveShadowPolicy(env = {}) {
  return {
    shadowMode: isShadowModeEnabled(env),
    usedForUserResponse: false,
  };
}
