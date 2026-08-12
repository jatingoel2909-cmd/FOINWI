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

const SAFETY_PATTERNS = [
  /\b(which|what)\s+(stock|share|mutual fund|fund|crypto)\s+(should|must|can)\s+i\s+(buy|sell|choose)\b/u,
  /\b(best|top)\s+(mutual fund|fund|stock|bank|lender)\b/u,
  /\b(will|can)\s+.{0,28}\b(double|triple|guarantee|assure)\b/u,
  /\bguarantee\s+(me\s+)?\d+(%| percent)?\b/u,
  /\bwhich\s+bank\s+(will|can)\s+approve\b/u,
  /\bavoid\s+(paying\s+)?tax\b/u,
  /\bexactly\s+where\s+to\s+invest\b/u,
  /\b(what|where)\s+should\s+i\s+invest(\s+in)?\b/u,
];

export function isGuideSafetyRequest(normalizedQuery) {
  return SAFETY_PATTERNS.some((pattern) => pattern.test(normalizedQuery));
}
