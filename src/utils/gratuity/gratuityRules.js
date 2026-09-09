/**
 * FOINWI educational gratuity rules.
 * Current basis: Code on Social Security, 2020, modelled as effective from
 * 21 November 2025. Simplified estimate for a monthly-rated employee in an
 * ordinary retirement / resignation / superannuation scenario.
 *
 * The monthly-rated 15/26 formula and >6-month qualifying-year rule continue
 * from the earlier Payment of Gratuity Act, 1972 framework. That earlier Act
 * is historical context only and is not the current governing basis here.
 *
 * Not modelled: seasonal employees, piece-rated workers, fixed-term
 * employment, contract-specific enhanced gratuity, forfeiture,
 * nomination/heir logic, payroll wage reconstruction, or full
 * continuous-service adjudication.
 */

export const GRATUITY_LEGAL_FRAMEWORK = "Code on Social Security, 2020";
export const GRATUITY_FRAMEWORK_EFFECTIVE_DATE = "21 November 2025";
export const GRATUITY_FRAMEWORK_EFFECTIVE_DATE_SHORT = "21.11.2025";

export const GRATUITY_WAGE_BASIS_LABEL = "Last drawn statutory wages";

export const GRATUITY_DAYS_NUMERATOR = 15;
export const GRATUITY_DAYS_DENOMINATOR = 26;

/** Qualifying service adds a year only when additional months are greater than this. */
export const GRATUITY_ADDITIONAL_MONTH_THRESHOLD = 6;

export const GRATUITY_MIN_CONTINUOUS_SERVICE_YEARS = 5;

/**
 * Ceiling used in this simplified estimate: ₹20,00,000.
 *
 * Legal notes for maintainers (not visitor-facing):
 * - Section 53(3), Code on Social Security, 2020: gratuity shall not exceed
 *   such amount as may be notified by the Central Government.
 * - Section 164(2)(a) contains savings for notifications under repealed
 *   enactments, subject to its terms.
 * - S.O. 1420(E), 29 March 2018 notified ₹20 lakh under the earlier
 *   Payment of Gratuity Act, 1972.
 * - Ministry of Labour post-implementation FAQ describes the maximum as
 *   currently ₹20 lakh.
 * - No fresh Gazette notification under section 53(3) specifically
 *   re-notifying ₹20 lakh was located. This amount is time-sensitive.
 */
export const GRATUITY_STATUTORY_CEILING = 2000000;
export const GRATUITY_CEILING_TIME_SENSITIVE = true;
export const GRATUITY_CEILING_LABEL = "Ceiling used in this estimate";

export const GRATUITY_INPUT_LIMITS = Object.freeze({
  lastDrawnStatutoryWages: { min: 5000, max: 500000, step: 1000 },
  completedYears: { min: 0, max: 40, step: 1 },
  additionalMonths: { min: 0, max: 11, step: 1 },
});

export const GRATUITY_WAGE_HELPER_NOTE =
  "For this simplified estimate, enter the monthly wage amount applicable for gratuity purposes under the current labour-code wage definition. This may differ from Basic + DA where the statutory allowance-add-back rules apply.";

export const GRATUITY_FIVE_YEAR_NOTE =
  "Under the general rule for this ordinary permanent-employee estimate under the current labour-code framework, five years of continuous service is required. The five-year condition does not apply in certain cases such as death or disablement. This calculator does not adjudicate those exceptions.";

export const GRATUITY_FIXED_TERM_NOTE =
  "Fixed-term employment can have different gratuity eligibility rules and is not modelled by this calculator.";

export const GRATUITY_BETTER_TERMS_NOTE =
  "Better gratuity terms may apply under an award, agreement or employment contract.";

export const GRATUITY_SCOPE_NOTE =
  "This is a simplified statutory estimate under the Code on Social Security, 2020, for a monthly-rated employee in an ordinary retirement, resignation, or superannuation scenario. The current labour-code framework is modelled as effective from 21 November 2025. Estimated gratuity may differ based on employment terms and eligibility facts.";

export const GRATUITY_CEILING_SUPPORTING_NOTE =
  "This simplified estimate currently uses ₹20 lakh as the gratuity ceiling. The amount is time-sensitive and should be rechecked if Government notifications change.";

export const GRATUITY_CEILING_LEGAL_NOTE =
  "The Code on Social Security, 2020 provides that gratuity is subject to an amount notified by the Central Government. This calculator currently models ₹20 lakh, consistent with the earlier notified ceiling and current Ministry guidance.";

export const GRATUITY_CEILING_APPLIED_NOTE =
  "This estimate has been limited to the ₹20 lakh ceiling used here.";
