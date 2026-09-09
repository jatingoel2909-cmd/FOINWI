/**
 * FOINWI educational income-tax rules.
 * Assessment Year AY 2026-27 · Financial Year FY 2025-26.
 * Centralized statutory-looking constants. Do not duplicate these elsewhere.
 *
 * Scope (this estimator only):
 * - Salary income for a resident individual
 * - Salary standard deduction under Section 16(ia): ₹50,000 old regime,
 *   ₹75,000 new regime, each limited to salary
 * - Old regime: individual below 60 years
 * - Surcharge is not modelled
 * - Special-rate income (for example capital gains) is not modelled
 * - Educational 87A rebate is modelled only for eligible normal-rate income
 *   up to the stated taxable-income threshold
 * - New-regime 87A marginal relief is modelled only for eligible normal-rate
 *   income just above ₹12,00,000
 */

export const INCOME_TAX_PERIOD = Object.freeze({
  assessmentYear: "AY 2026-27",
  financialYear: "FY 2025-26",
  label: "FY 2025-26 · AY 2026-27",
});

export const INCOME_TAX_REGIMES = Object.freeze({
  NEW: "new",
  OLD: "old",
});

/**
 * Section 16(ia) salary standard deduction.
 * Applied only because this estimator is scoped to Annual Salary Income.
 * Amount is limited to salary: min(annualSalaryIncome, regime cap).
 */
export const OLD_STANDARD_DEDUCTION = 50000;
export const NEW_STANDARD_DEDUCTION = 75000;
export const OLD_REGIME_STANDARD_DEDUCTION = OLD_STANDARD_DEDUCTION;
export const NEW_REGIME_STANDARD_DEDUCTION = NEW_STANDARD_DEDUCTION;

export const HEALTH_AND_EDUCATION_CESS_RATE = 0.04;

/** Educational estimator does not model surcharge. Supported salary/taxable income cap. */
export const INCOME_TAX_EDUCATIONAL_INCOME_CAP = 5000000;

/** This calculator does not model special-rate income such as capital gains. */
export const INCOME_TAX_SPECIAL_RATE_INCOME_MODELLED = false;

export const INCOME_TAX_INPUT_LIMITS = Object.freeze({
  annualSalaryIncome: { min: 100000, max: INCOME_TAX_EDUCATIONAL_INCOME_CAP, step: 10000 },
  eligibleDeductions: { min: 0, max: INCOME_TAX_EDUCATIONAL_INCOME_CAP, step: 10000 },
});

/**
 * New tax regime slabs for AY 2026-27.
 * Bands are exclusive of `from` and inclusive of `to`, except the first band
 * which includes ₹0.
 */
export const NEW_REGIME_SLABS = Object.freeze([
  Object.freeze({ from: 0, to: 400000, rate: 0 }),
  Object.freeze({ from: 400000, to: 800000, rate: 0.05 }),
  Object.freeze({ from: 800000, to: 1200000, rate: 0.1 }),
  Object.freeze({ from: 1200000, to: 1600000, rate: 0.15 }),
  Object.freeze({ from: 1600000, to: 2000000, rate: 0.2 }),
  Object.freeze({ from: 2000000, to: 2400000, rate: 0.25 }),
  Object.freeze({ from: 2400000, to: Number.POSITIVE_INFINITY, rate: 0.3 }),
]);

/**
 * Old tax regime slabs for an individual below 60 years.
 * Senior-citizen basic exemption is not modelled.
 */
export const OLD_REGIME_SLABS_BELOW_60 = Object.freeze([
  Object.freeze({ from: 0, to: 250000, rate: 0 }),
  Object.freeze({ from: 250000, to: 500000, rate: 0.05 }),
  Object.freeze({ from: 500000, to: 1000000, rate: 0.2 }),
  Object.freeze({ from: 1000000, to: Number.POSITIVE_INFINITY, rate: 0.3 }),
]);

/**
 * Section 87A educational parameters for an eligible resident individual.
 * Eligibility is not independently verified by this estimator.
 * Ordinary rebate applies at or below maxTaxableIncome.
 * New-regime marginal relief may apply above ₹12,00,000 for eligible
 * normal-rate income only. Special-rate income is outside calculator scope.
 */
export const SECTION_87A = Object.freeze({
  new: Object.freeze({
    maxTaxableIncome: 1200000,
    maxRebate: 60000,
  }),
  old: Object.freeze({
    maxTaxableIncome: 500000,
    maxRebate: 12500,
  }),
});

export const SECTION_87A_MARGINAL_RELIEF_IMPLEMENTED = true;

export const SECTION_87A_EDUCATIONAL_SCOPE_NOTE =
  "Section 87A rebate and Section 87A marginal relief in this estimate apply only to simplified normal-rate salary income for an eligible resident individual. Special-rate income such as capital gains is outside this calculator's scope.";

export function getSalaryStandardDeductionCap(regime) {
  return regime === INCOME_TAX_REGIMES.OLD
    ? OLD_STANDARD_DEDUCTION
    : NEW_STANDARD_DEDUCTION;
}

export function getSlabsForRegime(regime) {
  return regime === INCOME_TAX_REGIMES.OLD ? OLD_REGIME_SLABS_BELOW_60 : NEW_REGIME_SLABS;
}

export function getSection87ARule(regime) {
  return regime === INCOME_TAX_REGIMES.OLD ? SECTION_87A.old : SECTION_87A.new;
}
