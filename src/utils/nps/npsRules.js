/**
 * FOINWI educational NPS rules for a locked P1 product scope.
 *
 * Product scope: educational Tier-I accumulation and normal-exit
 * illustration for a non-Government All Citizen Model subscriber under
 * Common Scheme, with illustrated exit age of 60 or later, and with the
 * 20%/80% exit split applied only when projected corpus is above ₹12 lakh.
 *
 * Current statutory frame used for this estimator:
 * - PFRDA Act, 2013
 * - PFRDA (Exits and Withdrawals under the National Pension System)
 *   Regulations, 2015, consolidated through 20 July 2026
 * - material Amendment Regulations effective 16 December 2025
 *
 * Not modelled: Government-sector NPS, Government-company corporate cases,
 * NPS-Lite / Swavalamban, NPS Vatsalya, Multiple Scheme Framework,
 * premature exit, death, corpus of ₹12 lakh or less, deferment or
 * continuation to age 85, existing PRAN balance, employer contributions,
 * charges/fees, tax computation, or an Annuity Service Provider quote.
 */

export const NPS_LEGAL_FRAMEWORK = "PFRDA Act, 2013";
export const NPS_EXIT_FRAMEWORK =
  "PFRDA (Exits and Withdrawals under the National Pension System) Regulations, 2015, last amended 20 July 2026";
export const NPS_AMENDMENT_EFFECTIVE = "16 December 2025";

export const NPS_SUBSCRIBER_SCOPE = "non-Government All Citizen Model";
export const NPS_SCHEME_SCOPE = "Common Scheme";
export const NPS_ACCOUNT_SCOPE = "Tier-I";
export const NPS_EXIT_SCOPE = "normal-exit illustration";

export const NPS_TITLE = "NPS accumulation and normal-exit illustration";
export const NPS_PRIMARY_RESULT_LABEL = "Estimated projected NPS corpus";
export const NPS_CONTRIBUTED_LABEL = "Total illustrated contributions";
export const NPS_LUMP_SUM_LABEL = "Illustrative non-annuity portion";
export const NPS_ANNUITY_AMOUNT_LABEL = "Illustrative amount allocated to annuity";
export const NPS_MONTHLY_ANNUITY_LABEL = "Illustrative monthly annuity income";
export const NPS_CONTRIBUTION_LABEL = "Monthly contribution";
export const NPS_RETURN_LABEL = "Illustrative market-linked return assumption (%)";
export const NPS_CURRENT_AGE_LABEL = "Current age";
export const NPS_EXIT_AGE_LABEL = "Illustrated exit age";
export const NPS_ANNUITY_ALLOCATION_LABEL = "Illustrative annuity allocation (%)";
export const NPS_ANNUITY_RATE_LABEL = "Illustrative annuity-rate assumption (%)";

export const NPS_MIN_ANNUITY_ALLOCATION_PERCENT = 20;
export const NPS_MAX_ANNUITY_ALLOCATION_PERCENT = 100;
export const NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT = 20;
export const NPS_DEFAULT_ANNUITY_RATE_PERCENT = 6;
export const NPS_DEFAULT_ILLUSTRATIVE_RETURN_PERCENT = 10;
export const NPS_MIN_ILLUSTRATED_EXIT_AGE = 60;
export const NPS_EXIT_SPLIT_CORPUS_THRESHOLD = 1200000;

export const NPS_INPUT_LIMITS = Object.freeze({
  monthlyContribution: { min: 500, max: 200000, step: 500 },
  illustrativeAnnualReturnPercent: { min: 5, max: 14, step: 0.5 },
  currentAge: { min: 18, max: 59, step: 1 },
  exitAge: { min: 60, max: 70, step: 1 },
  annuityAllocationPercent: { min: 20, max: 100, step: 1 },
  illustrativeAnnuityRatePercent: { min: 0, max: 12, step: 0.5 },
});

export const NPS_SCOPE_NOTE =
  "Educational NPS accumulation and normal-exit illustration for a non-Government All Citizen Model subscriber under Common Scheme, Tier-I, with an illustrated exit age of 60 or later. The 20%/80% exit split is shown only when the projected corpus is above ₹12 lakh.";

export const NPS_RETURN_HELPER_NOTE =
  "NPS returns are market-linked. The return used here is an illustrative assumption for projection only and is not guaranteed.";

export const NPS_ANNUITY_ALLOCATION_HELPER_NOTE =
  "For this calculator's scoped non-Government normal-exit case with projected corpus above ₹12 lakh, current PFRDA rules require at least 20% to be used to purchase an annuity. You may illustrate a higher allocation.";

export const NPS_ANNUITY_RATE_HELPER_NOTE =
  "This is an illustrative assumption only, not an NPS statutory rate and not a quote from an Annuity Service Provider. Actual annuity income depends on the provider, age, annuity option and prevailing pricing.";

export const NPS_PROJECTION_METHOD_NOTE =
  "This projection assumes level beginning-of-month contributions, a constant illustrative market-linked return, and a zero opening balance. Employer contributions, charges/fees and the actual NAV path are not modelled. Actual results can differ.";

export const NPS_CONTRIBUTION_LIMIT_NOTE =
  "Calculator input limits are for this illustration and are not NPS statutory contribution limits.";

export const NPS_AGE_SCOPE_NOTE =
  "These age inputs are for this illustration. They are not the full statutory NPS entry or continuation age window.";

export const NPS_CORPUS_BAND_NOTE =
  "Current NPS exit options differ for corpus up to ₹12 lakh. This simplified exit illustration models only projected corpus above ₹12 lakh.";

export const NPS_TAX_NOTE =
  "This calculator does not compute tax. NPS contribution deductions and exit treatment depend on the applicable tax year and tax regime.";

export const NPS_SPECIAL_CASE_NOTE =
  "Different rules apply to Government-sector subscribers, premature exit, death, smaller corpus bands, MSF and certain other NPS cases. They are outside this simplified illustration.";

export const NPS_INVALID_AGE_NOTE =
  "This illustration needs a current age below the illustrated exit age, and an illustrated exit age of 60 or later. No financial projection is shown for an invalid age combination.";

export const NPS_MINIMUM_ANNUITY_NOTE =
  "20% is the current statutory minimum annuity allocation for this scoped non-Government normal-exit case when projected corpus is above ₹12 lakh. It is not a recommendation and not the only allocation a subscriber may choose.";
