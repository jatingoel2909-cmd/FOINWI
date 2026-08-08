export const GUIDANCE_BOUNDARIES = Object.freeze({
  educationalOnly: true,
  estimatesAndIllustrations: true,
  noGuaranteedReturns: true,
  noReturnAssurances: true,
  noLoanApprovalClaims: true,
  noPersonalizedInvestmentAdvice: true,
  noTaxOrLegalAdvice: true,
  noBankOrProductRecommendations: true,
});

export const RESTRICTED_CLAIM_TYPES = Object.freeze([
  "return-assurance",
  "loan-approval",
  "personalized-investment-advice",
  "tax-advice",
  "legal-advice",
  "bank-recommendation",
  "product-recommendation",
]);

export function isSupportedEducationalDomain(domain) {
  return domain === "emi" || domain === "sip";
}

export function getGuidanceScope(context) {
  return isSupportedEducationalDomain(context?.domain)
    ? "educational-explanation"
    : "unsupported-domain";
}

export function canProvideEducationalGuidance(context) {
  return getGuidanceScope(context) === "educational-explanation";
}
