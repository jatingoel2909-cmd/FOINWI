/**
 * Pure educational income-tax estimator for AY 2026-27 / FY 2025-26.
 * Surcharge and special-rate income are not implemented.
 * New-regime Section 87A ordinary rebate and marginal relief apply only to
 * this calculator's simplified salary / normal slab-rate model.
 */

import {
  HEALTH_AND_EDUCATION_CESS_RATE,
  INCOME_TAX_EDUCATIONAL_INCOME_CAP,
  INCOME_TAX_PERIOD,
  INCOME_TAX_REGIMES,
  SECTION_87A,
  SECTION_87A_MARGINAL_RELIEF_IMPLEMENTED,
  getSalaryStandardDeductionCap,
  getSection87ARule,
  getSlabsForRegime,
} from "./incomeTaxRules.js";

function asNonNegativeNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return numeric;
}

export function calculateSlabTax(taxableIncome, regime = INCOME_TAX_REGIMES.NEW) {
  const income = asNonNegativeNumber(taxableIncome);
  if (income <= 0) return 0;

  let tax = 0;
  for (const { from, to, rate } of getSlabsForRegime(regime)) {
    if (income <= from) break;
    const amountInBand = Math.min(income, to) - from;
    if (amountInBand > 0) tax += amountInBand * rate;
  }

  return Number.isFinite(tax) ? tax : 0;
}

export function calculateSection87ARebate({
  regime = INCOME_TAX_REGIMES.NEW,
  taxableIncome,
  slabTax,
} = {}) {
  const income = asNonNegativeNumber(taxableIncome);
  const taxBeforeRebate = asNonNegativeNumber(slabTax);
  const rule = getSection87ARule(regime);

  if (income <= 0 || taxBeforeRebate <= 0) return 0;
  if (income > rule.maxTaxableIncome) return 0;

  return Math.min(rule.maxRebate, taxBeforeRebate);
}

/**
 * New-regime Section 87A marginal relief for eligible normal-rate income.
 * If taxable income > ₹12,00,000 and slab tax > excess income:
 *   excessIncome = taxableIncome - 12,00,000
 *   marginalRelief = slabTax - excessIncome
 * Tax before cess after relief therefore cannot exceed excess income.
 * Not applied to old regime or to special-rate income (outside scope).
 */
export function calculateSection87AMarginalRelief({
  regime = INCOME_TAX_REGIMES.NEW,
  taxableIncome,
  slabTax,
} = {}) {
  if (regime !== INCOME_TAX_REGIMES.NEW) return 0;

  const income = asNonNegativeNumber(taxableIncome);
  const tax = asNonNegativeNumber(slabTax);
  const threshold = SECTION_87A.new.maxTaxableIncome;

  if (income <= threshold || tax <= 0) return 0;

  const excessIncome = income - threshold;
  if (tax <= excessIncome) return 0;

  return tax - excessIncome;
}

export function calculateHealthAndEducationCess(taxAfterRebateOrRelief) {
  const base = asNonNegativeNumber(taxAfterRebateOrRelief);
  return base * HEALTH_AND_EDUCATION_CESS_RATE;
}

/** Salary standard deduction cannot exceed salary and cannot go negative. */
export function calculateApplicableSalaryStandardDeduction(
  annualSalaryIncome,
  regime = INCOME_TAX_REGIMES.NEW,
) {
  const income = asNonNegativeNumber(annualSalaryIncome);
  const cap = getSalaryStandardDeductionCap(regime);
  return Math.min(income, cap);
}

export function calculateIncomeTaxEstimate({
  annualSalaryIncome,
  regime = INCOME_TAX_REGIMES.NEW,
  eligibleDeductions = 0,
} = {}) {
  const selectedRegime = regime === INCOME_TAX_REGIMES.OLD
    ? INCOME_TAX_REGIMES.OLD
    : INCOME_TAX_REGIMES.NEW;

  const incomeConsidered = asNonNegativeNumber(annualSalaryIncome);
  const standardDeduction = calculateApplicableSalaryStandardDeduction(
    incomeConsidered,
    selectedRegime,
  );
  const otherDeductions = selectedRegime === INCOME_TAX_REGIMES.OLD
    ? asNonNegativeNumber(eligibleDeductions)
    : 0;
  const incomeAfterStandardDeduction = Math.max(0, incomeConsidered - standardDeduction);
  const taxableIncome = Math.max(0, incomeAfterStandardDeduction - otherDeductions);
  const slabTax = calculateSlabTax(taxableIncome, selectedRegime);
  const rebate = calculateSection87ARebate({
    regime: selectedRegime,
    taxableIncome,
    slabTax,
  });
  const marginalRelief = calculateSection87AMarginalRelief({
    regime: selectedRegime,
    taxableIncome,
    slabTax,
  });
  const taxAfterRebate = Math.max(0, slabTax - rebate - marginalRelief);
  const cess = calculateHealthAndEducationCess(taxAfterRebate);
  const estimatedTax = taxAfterRebate + cess;
  const withinEducationalScope =
    incomeConsidered <= INCOME_TAX_EDUCATIONAL_INCOME_CAP
    && taxableIncome <= INCOME_TAX_EDUCATIONAL_INCOME_CAP;

  return {
    period: INCOME_TAX_PERIOD,
    regime: selectedRegime,
    incomeConsidered,
    standardDeduction,
    otherDeductions,
    taxableIncome,
    slabTax,
    rebate,
    marginalRelief,
    taxAfterRebate,
    cess,
    surcharge: 0,
    surchargeModelled: false,
    section87AMarginalReliefImplemented: SECTION_87A_MARGINAL_RELIEF_IMPLEMENTED,
    completeEstimate: true,
    estimatedTax,
    withinEducationalScope,
  };
}

export function compareRegimeEstimates({
  annualSalaryIncome,
  eligibleDeductions = 0,
} = {}) {
  const newRegime = calculateIncomeTaxEstimate({
    annualSalaryIncome,
    regime: INCOME_TAX_REGIMES.NEW,
  });
  const oldRegime = calculateIncomeTaxEstimate({
    annualSalaryIncome,
    regime: INCOME_TAX_REGIMES.OLD,
    eligibleDeductions,
  });

  let lowerEstimatedRegime = null;
  if (newRegime.completeEstimate && oldRegime.completeEstimate) {
    if (newRegime.estimatedTax < oldRegime.estimatedTax) {
      lowerEstimatedRegime = INCOME_TAX_REGIMES.NEW;
    } else if (oldRegime.estimatedTax < newRegime.estimatedTax) {
      lowerEstimatedRegime = INCOME_TAX_REGIMES.OLD;
    }
  }

  return { newRegime, oldRegime, lowerEstimatedRegime };
}
