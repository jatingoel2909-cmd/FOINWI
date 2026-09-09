/**
 * FOINWI educational EPF rules.
 *
 * Scope: standard already-enrolled EPF/EPS member in a general 12%
 * establishment. 12% is the general operational rate being modelled,
 * consistent with current EPFO operational treatment. It is not described
 * here as a freshly notified rate under EPF Scheme, 2026.
 *
 * Current statutory frame for this estimator:
 * - Code on Social Security, 2020, section 16 (10% default; 12% by
 *   notification / operational general treatment)
 * - Chapter III wage ceiling: S.O. 2702(E), 29 May 2026 — ₹15,000
 * - EPS diversion: 8.33% of contribution wage, residual employer share
 *   enters EPF
 *
 * Maintainer notes (not visitor-facing claims):
 * - G.S.R. 525(E), 29 June 2026 issued the Employees' Provident Fund
 *   Scheme, 2026. This calculator does not quote unread Scheme clauses.
 * - S.O. 320(E), 9 April 1997 is the historic 12%/10% class instrument
 *   still cited in EPFO material. 10% classes stay outside this scope.
 * - FY 2024-25 interest 8.25% was Government-approved under para 60(1).
 * - FY 2025-26 was CBT-recommended at 8.25%; final Government
 *   notification was not located in the FOINWI audit.
 *
 * Not modelled: 10% establishments/classes, new joiner above ₹15,000
 * who is not an EPS member, higher-wage contribution, VPF, higher-pension
 * joint option, EPS after age-related exit, EDLI, administrative charges,
 * payroll wage reconstruction, tax treatment, or withdrawal rules.
 */

export const EPF_LEGAL_FRAMEWORK = "Code on Social Security, 2020";

export const EPF_WAGE_CEILING = 15000;
export const EPF_WAGE_CEILING_NOTIFICATION = "S.O. 2702(E), 29 May 2026";

export const EPF_GENERAL_EMPLOYEE_RATE = 0.12;
export const EPF_GENERAL_EMPLOYER_RATE = 0.12;
export const EPF_EPS_RATE = 0.0833;

export const EPF_EMPLOYEE_RATE_NUMERATOR = 12;
export const EPF_EMPLOYEE_RATE_DENOMINATOR = 100;
export const EPF_EPS_RATE_NUMERATOR = 833;
export const EPF_EPS_RATE_DENOMINATOR = 10000;

export const EPF_ILLUSTRATIVE_INTEREST_RATE = 8.25;
export const EPF_ILLUSTRATIVE_INTEREST_YEAR = "FY 2024-25";

export const EPF_WAGE_BASIS_LABEL = "Monthly PF wages";
export const EPF_CEILING_LABEL = "Statutory wage ceiling";
export const EPF_CONTRIBUTION_WAGE_LABEL = "Contribution wage used";
export const EPF_INTEREST_INPUT_LABEL = "Illustrative EPF interest assumption";

export const EPF_INPUT_LIMITS = Object.freeze({
  monthlyPFWages: { min: 5000, max: 150000, step: 1000 },
  currentBalance: { min: 0, max: 50000000, step: 10000 },
  annualInterestRate: { min: 5, max: 12, step: 0.05 },
  years: { min: 1, max: 40, step: 1 },
});

export const EPF_WAGE_HELPER_NOTE =
  "Enter the monthly wage amount applicable for provident-fund contribution purposes. PF wages may differ from Basic salary alone.";

export const EPF_RATE_OPERATIONAL_NOTE =
  "This estimate uses the general 12% employee and employer contribution rates consistent with current EPFO operational treatment.";

export const EPF_TEN_PERCENT_SCOPE_NOTE =
  "Specified establishments or classes can have different contribution rates, including 10%, and are outside this calculator scope.";

export const EPF_HIGHER_WAGE_SCOPE_NOTE =
  "Higher-wage contribution and voluntary provident-fund top-ups are outside this default estimate.";

export const EPF_NEW_JOINER_SCOPE_NOTE =
  "A new joiner with PF wages above ₹15,000 who is not an EPS member is outside this default estimate.";

export const EPF_INTEREST_HELPER_NOTE =
  "8.25% is the last Government-approved/notified rate verified for FY 2024-25. This is an illustrative assumption, not a guaranteed or future EPF rate.";

export const EPF_PROJECTION_METHOD_NOTE =
  "Simplified projection using a monthly running-balance approximation and a constant illustrative annual interest assumption.";

export const EPF_SCHEME_FRAMEWORK_NOTE =
  "The Employees' Provident Fund Scheme, 2026 has been issued under the current framework. This simplified calculator uses the standard contribution assumptions described here and does not model every membership or payroll case.";

export const EPF_SCOPE_NOTE =
  "Educational EPF accumulation estimate for a standard already-enrolled EPF/EPS member using statutory contribution assumptions. Employer contributes 12% in this model. Part is diverted to EPS and is not added to the projected EPF balance. Only the residual employer EPF amount enters the projected corpus.";

export const EPF_CEILING_NOTE =
  "Statutory contributions in this estimate use wages up to ₹15,000, consistent with S.O. 2702(E), 29 May 2026. Amounts above that ceiling are not used for the default contribution calculation.";
