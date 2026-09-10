/**
 * FOINWI educational PPF rules.
 *
 * Product scope: educational PPF accumulation estimate using an annual
 * contribution assumed deposited on or before 5 April of each financial
 * year and a constant illustrative interest-rate assumption.
 *
 * Current statutory frame used for this estimator (not a passbook engine):
 * - Public Provident Fund Scheme, 2019 — G.S.R. 915(E), 12 December 2019
 * - Amended by G.S.R. 290(E), 5 May 2020 (para 7(1A))
 * - Deposit limits: para 4 — ₹500 to ₹1,50,000 per financial year,
 *   in multiples of ₹50; own + minor-account deposits can share the cap
 * - Interest method: para 7 — lowest balance between close of the 5th day
 *   and month-end; credited at the end of each year
 * - Maturity: para 11(1) — after 15 complete financial years from the end
 *   of the financial year in which the account was opened
 *
 * Latest verified notified rate used only as the default illustrative
 * assumption: 7.1% for 1 July–30 September 2026 (DEA F.No.1/4/2019-NS
 * dated 30.06.2026, unchanged from the prior quarter; NSI scheme-wise
 * table). Government-notified PPF rates can change, including quarterly.
 *
 * Not modelled: official passbook, personal maturity date, loans,
 * withdrawals, premature closure, missed years, discontinued-account
 * revival, extension-block eligibility, family/account aggregation, or tax.
 */

export const PPF_LEGAL_FRAMEWORK = "Public Provident Fund Scheme, 2019";

export const PPF_MIN_ANNUAL_CONTRIBUTION = 500;
export const PPF_MAX_ANNUAL_CONTRIBUTION = 150000;
export const PPF_CONTRIBUTION_STEP = 50;

export const PPF_ILLUSTRATIVE_INTEREST_RATE = 7.1;
export const PPF_ILLUSTRATIVE_RATE_PERIOD = "1 July–30 September 2026";

export const PPF_STANDARD_CONTRIBUTION_YEARS = 15;

export const PPF_CONTRIBUTION_LABEL = "Annual contribution";
export const PPF_YEARS_LABEL = "Contribution years";
export const PPF_INTEREST_INPUT_LABEL = "Illustrative interest rate assumption";
export const PPF_PRIMARY_RESULT_LABEL = "Estimated PPF balance";

export const PPF_INPUT_LIMITS = Object.freeze({
  annualContribution: {
    min: PPF_MIN_ANNUAL_CONTRIBUTION,
    max: PPF_MAX_ANNUAL_CONTRIBUTION,
    step: PPF_CONTRIBUTION_STEP,
  },
  illustrativeAnnualRate: { min: 5, max: 10, step: 0.1 },
});

export const PPF_SCOPE_NOTE =
  "Educational PPF accumulation estimate using an annual contribution assumed deposited on or before 5 April of each financial year and a constant illustrative interest-rate assumption. This is not an official PPF passbook, an exact statutory maturity calculation, a promise of future returns, or tax advice.";

export const PPF_INTEREST_HELPER_NOTE =
  "7.1% is the latest rate verified for 1 July–30 September 2026. Government-notified PPF rates can change, including quarter by quarter. This calculator applies the selected rate unchanged throughout the projection only for illustration.";

export const PPF_DEPOSIT_TIMING_NOTE =
  "The full yearly contribution is deposited on or before 5 April of each financial year.";

export const PPF_INTEREST_METHOD_NOTE =
  "PPF interest is based on the lowest balance between the close of the 5th day and month-end and is credited annually. Depositing later can reduce the interest earned.";

export const PPF_PROJECTION_METHOD_NOTE =
  "Each modelled year adds the annual contribution, then applies the selected illustrative annual rate once. That matches the official 5th-day lowest-balance method when the full yearly amount is in by 5 April and the selected rate is held constant. Interest is credited once a year in this model; the calculator does not add interest to the balance month by month, and it does not model arbitrary deposit dates.";

export const PPF_LIMIT_AGGREGATION_NOTE =
  "The ₹1.5 lakh annual limit can include deposits made in your own PPF account and accounts opened by you on behalf of a minor, where applicable.";

export const PPF_MATURITY_DISCLOSURE =
  "PPF maturity is not simply 15 calendar years from the opening date. Under the current scheme, closure becomes available after 15 complete financial years from the end of the financial year in which the account was opened.";

export const PPF_YEARS_HELPER_NOTE =
  "This estimate models 15 contribution years as the standard scenario. It does not calculate a personal maturity date and does not treat extra years as ordinary statutory continuation.";

export const PPF_EXTENSION_NOTE =
  "Actual continuation with contributions after maturity operates in 5-year blocks and is subject to the applicable extension rules. This calculator does not determine eligibility and does not model extension blocks.";

export const PPF_SCOPE_LIMITATIONS_NOTE =
  "This estimate assumes no loans, withdrawals, premature closure or missed annual contributions.";

export const PPF_TAX_NOTE =
  "Tax treatment can depend on the applicable income-tax rules and tax regime. This calculator does not estimate tax benefits.";

export const PPF_SECTION_80C_NOTE =
  "Eligible PPF contributions may qualify under section 80C where the applicable tax regime/rules permit.";
