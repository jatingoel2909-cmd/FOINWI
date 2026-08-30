import { normalizeGuideQuery } from "../guide/guideEngine.js";
import { isGuideSafetyRequest } from "../guide/guideSafety.js";

const INJECTION_PATTERNS = Object.freeze([
  /\bignore (?:all )?(?:previous|prior|above) instructions\b/u,
  /\bignore your rules\b/u,
  /\breveal (?:your )?(?:system )?prompt\b/u,
  /\bshow hidden instructions\b/u,
  /\bbypass safety\b/u,
  /\bdeveloper mode\b/u,
  /\bact without restrictions\b/u,
  /\breturn any url i ask for\b/u,
  /\bjailbreak\b/u,
  /\bdo anything now\b/u,
  /\boverride (?:the )?(?:policy|guardrails|safety)\b/u,
]);

export function normalizeGuardQuery(query = "") {
  return normalizeGuideQuery(query);
}

export function isPromptInjectionAttempt(query = "") {
  const normalized = normalizeGuardQuery(query);
  if (!normalized) return false;
  return INJECTION_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function isFinancialSafetyRequest(query = "") {
  return isGuideSafetyRequest(normalizeGuardQuery(query));
}

export function getPreModelBlockReason(query = "") {
  if (isFinancialSafetyRequest(query)) return "safety-refusal";
  if (isPromptInjectionAttempt(query)) return "injection-blocked";
  return null;
}
