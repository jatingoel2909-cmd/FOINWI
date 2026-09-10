/**
 * FOINWI educational HRA rules for tax year / FY 2026-27 (AY 2027-28).
 *
 * Product scope: educational monthly estimate of House Rent Allowance
 * exemption for a person who has opted out of the default tax regime
 * under section 202 of the Income-tax Act, 2025.
 *
 * Current statutory frame used for this estimator:
 * - Income-tax Act, 2025 — in force 1 April 2026
 * - Income-tax Rules, 2026 — notified 20 March 2026, in force 1 April 2026
 * - Rule 279 — limits for Schedule III [Table: Sl. No. 11]
 * - Section 202 — default tax regime does not allow this exemption
 *
 * Not modelled: tax payable, tax saved, employer TDS, parent/spouse rent
 * adjudication, ownership of some other property, genuineness of tenancy,
 * commission, or mid-year period splitting. Commission is a product-scope
 * limitation in this estimator, not a declaration that commission can never
 * legally be relevant.
 */

export const HRA_LEGAL_FRAMEWORK = "Income-tax Act, 2025";
export const HRA_RULE_FRAMEWORK = "Income-tax Rules, 2026, Rule 279";
export const HRA_REGIME_SECTION = "section 202";
export const HRA_TAX_YEAR = "2026-27";
export const HRA_ASSESSMENT_YEAR = "2027-28";
export const HRA_TAX_YEAR_LABEL = "FY / Tax year 2026-27";

export const HRA_CITY_CATEGORY_50 = "fifty-percent-cities";
export const HRA_CITY_CATEGORY_40 = "any-other-place";

export const HRA_FIFTY_PERCENT_CITIES = Object.freeze([
  "Mumbai",
  "Kolkata",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Bengaluru",
]);

export const HRA_FORTY_PERCENT_EXAMPLE_PLACES = Object.freeze(["Gurugram", "Noida"]);

export const HRA_RESIDENCE_OPTIONS = Object.freeze([
  {
    value: HRA_CITY_CATEGORY_50,
    label: "50% cities",
  },
  {
    value: HRA_CITY_CATEGORY_40,
    label: "Any other place (40%)",
  },
]);

export const HRA_BASIC_LABEL = "Monthly basic salary";
export const HRA_DA_LABEL = "Monthly qualifying DA";
export const HRA_RECEIVED_LABEL = "Monthly HRA received";
export const HRA_RENT_LABEL = "Monthly rent actually paid";
export const HRA_RESIDENCE_LABEL = "Residence category";
export const HRA_PRIMARY_RESULT_LABEL = "Estimated monthly HRA exemption";
export const HRA_TAXABLE_RESULT_LABEL = "Monthly taxable HRA";
export const HRA_TITLE = "HRA exemption — opt-out regime estimate";

export const HRA_INPUT_LIMITS = Object.freeze({
  monthlyBasicSalary: { min: 10000, max: 500000, step: 1000 },
  monthlyQualifyingDA: { min: 0, max: 200000, step: 1000 },
  monthlyHraReceived: { min: 0, max: 200000, step: 1000 },
  monthlyRentPaid: { min: 0, max: 200000, step: 1000 },
});

export const HRA_SCOPE_NOTE =
  "Educational monthly estimate of House Rent Allowance exemption for FY 2026-27 for a person who has opted out of the default tax regime under section 202. This is not tax advice, a tax-payable calculator, a tax-saving calculator, an employer TDS calculation, or an eligibility adjudicator.";

export const HRA_REGIME_NOTE =
  "This exemption is not available under the default tax regime under section 202. This calculator estimates the exemption only where the person has validly opted out of that default regime and otherwise meets the applicable conditions.";

export const HRA_SALARY_SCOPE_NOTE =
  "This simplified calculator uses Basic salary plus qualifying DA. Commission is not modelled.";

export const HRA_DA_HELPER_NOTE =
  "This simplified calculator uses Basic salary plus qualifying DA. Commission is not modelled. Include DA here only where it is provided for under the terms of employment. Other allowances and perquisites are not included in this simplified salary input.";

export const HRA_CITY_50_HELPER_NOTE =
  "50% cities: Mumbai, Kolkata, Delhi, Chennai, Hyderabad, Pune, Ahmedabad and Bengaluru.";

export const HRA_CITY_40_HELPER_NOTE =
  "Gurugram, Noida and all locations not in the eight-city list use 40%.";

export const HRA_OCCUPANCY_NOTE =
  "This estimate assumes you actually pay rent for the residential accommodation you occupy.";

export const HRA_OWN_HOUSE_NOTE =
  "If you pay no rent, or live in accommodation owned and occupied by you, HRA exemption is not available under this estimate.";

export const HRA_PERIOD_NOTE =
  "Rule 279 applies to the relevant period. If salary, HRA, rent or residence changes during the tax year, calculate the relevant periods separately.";

export const HRA_MONTHLY_RESULT_NOTE =
  "These results are monthly estimates for the labelled period. They are not an annual exemption.";

export const HRA_TAXABLE_MEANING_NOTE =
  "Monthly taxable HRA means monthly HRA received minus estimated exempt HRA for the scoped period. It is not total taxable income.";

export const HRA_FORM_124_NOTE =
  "For employer TDS/evidence purposes, current Form 124 requires landlord PAN where aggregate rent during the tax year exceeds ₹1,00,000, along with landlord details and relationship, if any. That is documentation/evidence, not a fourth mathematical limb of Rule 279.";

export const HRA_PROJECTION_METHOD_NOTE =
  "This simplified calculator uses Basic salary plus qualifying DA. Commission is not modelled. Estimated exemption is the smaller of monthly HRA received, rent paid minus 10% of that salary (not below zero), and 50% or 40% of that salary by residence category.";
