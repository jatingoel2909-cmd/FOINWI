import { getEducationalDisclaimer, EDUCATIONAL_COPY } from "../knowledge/educationalCopy.js";
import { getEmiEducationalInsights } from "../rules/emiRules.js";
import { getSipEducationalInsights } from "../rules/sipRules.js";
import { canProvideEducationalGuidance, getGuidanceScope } from "../safety/guardrails.js";
import { buildCalculatorContext } from "./contextBuilder.js";

const DOMAIN_RULES = Object.freeze({
  emi: getEmiEducationalInsights,
  sip: getSipEducationalInsights,
});

/**
 * Produces deterministic educational explanations from structured calculator context.
 * The caller owns context creation and rendering; this function does not persist data.
 */
export function getEducationalExplanation(rawContext = {}) {
  const context = buildCalculatorContext(rawContext);
  const scope = getGuidanceScope(context);

  if (!canProvideEducationalGuidance(context)) {
    return {
      domain: context.domain,
      scope,
      insights: [],
      disclaimer: EDUCATIONAL_COPY.unsupportedDomain,
    };
  }

  return {
    domain: context.domain,
    scope,
    insights: DOMAIN_RULES[context.domain](context),
    disclaimer: getEducationalDisclaimer(),
  };
}
