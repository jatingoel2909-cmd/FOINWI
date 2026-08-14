export const GUIDE_SAFETY_RESPONSE = Object.freeze({
  id: "safety-boundary",
  topic: "Safety boundary",
  responseType: "SAFETY",
  confidence: "safety",
  simpleAnswer:
    "I can help you understand investment concepts and explore FOINWI planning tools, but I do not choose specific investments, lenders, or tax actions for you and I cannot guarantee outcomes.",
  deeperExplanation:
    "FOINWI Guide — Trial provides reviewed educational content only. It does not assess your personal financial situation, select a product, predict approval, or replace qualified financial, tax, legal, or investment support.",
  resourceIds: ["fundamentals", "sip", "goal"],
  actions: ["Understand it", "Calculate it", "Plan it"],
});

const INVESTMENT_OBJECTS = /\b(stock|share|mutual fund|fund|crypto)\b/u;
const ADVISORY_ACTIONS = /\b(which|recommend|exact|right|best|top|choose|buy|sell)\b/u;
const INVESTMENT_DIRECTION = /\b(where|what|which|recommend|exact|right|best|top)\b.*\binvest\b|\binvest\b.*\b(where|what|which|recommend|exact|right|best|top)\b/u;
const GUARANTEE_PATTERN = /\b(guarantee|assure|certain)\b.*\b\d+(?:\s*(?:%|percent|return))?\b|\b\d+\s*(?:%|percent)\b.*\b(guarantee|assure|certain)\b/u;
const LENDER_APPROVAL_PATTERN = /\b(which|what|recommend|best|top)\b.*\b(bank|lender)\b.*\b(approve|approval|sanction)\b/u;
const TAX_AVOIDANCE_PATTERN = /\b(avoid|escape|hide)\b.*\btax\b/u;

export function isGuideSafetyRequest(normalizedQuery) {
  const asksForProductChoice = INVESTMENT_OBJECTS.test(normalizedQuery) && ADVISORY_ACTIONS.test(normalizedQuery);
  return asksForProductChoice
    || INVESTMENT_DIRECTION.test(normalizedQuery)
    || GUARANTEE_PATTERN.test(normalizedQuery)
    || LENDER_APPROVAL_PATTERN.test(normalizedQuery)
    || TAX_AVOIDANCE_PATTERN.test(normalizedQuery);
}
