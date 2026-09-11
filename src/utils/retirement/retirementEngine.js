/**
 * Educational retirement-duration cash-flow estimator.
 *
 * Primary result: corpus required at retirement so that a monthly
 * beginning-of-month withdrawal model reaches approximately zero after
 * the selected retirement duration, with monthly post-retirement growth
 * and retirement-period inflation.
 *
 * Withdrawal timing (beginning of month):
 *   1. withdraw that month’s modelled living expense
 *   2. grow the remaining corpus for one month
 *   3. inflate the next month’s expense
 *
 * Closed form: let n = retirement months, R = 1 + monthly return,
 * G = 1 + monthly retirement inflation, q = G / R, E1 = first retirement
 * month expense. Required opening corpus is
 *   C0 = E1 * n                         when |q − 1| is negligible
 *   C0 = E1 * (1 − q^n) / (1 − q)       otherwise
 *
 * Pre-retirement expense growth and existing-savings projection use
 * annual compounding. Monthly contributions that fund a shortfall use
 * a beginning-of-month (annuity-due) identity. 25× annual retirement-age
 * expense is a secondary educational comparison only.
 *
 * Not a pension quote, adequacy certificate, or savings recommendation.
 */

import {
  RETIREMENT_CLOSED_FORM_Q_EQUAL_EPSILON,
  RETIREMENT_DEFAULTS,
  RETIREMENT_DEPLETION_ABS_TOLERANCE,
  RETIREMENT_DEPLETION_REL_TOLERANCE,
  RETIREMENT_INVALID_AGE,
  RETIREMENT_INVALID_DURATION,
  RETIREMENT_INVALID_INPUT,
  RETIREMENT_INVALID_AGE_NOTE,
  RETIREMENT_NUMERICAL_OVERFLOW,
  RETIREMENT_SIMPLE_25X_MULTIPLIER,
} from "./retirementRules.js";

function asFiniteNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
}

export function normalizeNonNegative(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null || numeric < 0) return 0;
  return numeric;
}

export function annualCompound(principal, annualRatePercent, years) {
  const amount = normalizeNonNegative(principal);
  const ratePercent = normalizeNonNegative(annualRatePercent);
  const yearCount = asFiniteNumber(years);
  const safeYears = yearCount === null || yearCount < 0 ? 0 : yearCount;
  return amount * (1 + ratePercent / 100) ** safeYears;
}

export function geometricSum(q, n) {
  if (n <= 0) return 0;
  if (Math.abs(q - 1) < RETIREMENT_CLOSED_FORM_Q_EQUAL_EPSILON) return n;
  return (1 - q ** n) / (1 - q);
}

/**
 * Corpus at retirement such that beginning-of-month withdrawals deplete
 * the modelled corpus to approximately zero after `months` periods.
 */
export function solveRequiredRetirementCorpus({
  firstMonthlyExpense,
  monthlyReturn,
  monthlyInflation,
  months,
}) {
  const expense = normalizeNonNegative(firstMonthlyExpense);
  const r = normalizeNonNegative(monthlyReturn);
  const g = normalizeNonNegative(monthlyInflation);
  const monthCount = asFiniteNumber(months);
  const n = monthCount === null || monthCount <= 0 ? 0 : monthCount;
  if (n === 0 || expense === 0) return 0;

  const growthFactor = 1 + r;
  const inflationFactor = 1 + g;
  const q = inflationFactor / growthFactor;
  return expense * geometricSum(q, n);
}

/**
 * Independent verification helper. Not a second production solver.
 * Walks the same beginning-of-month convention from a starting corpus.
 */
export function simulateBeginningOfMonthDepletion({
  startingCorpus,
  firstMonthlyExpense,
  monthlyReturn,
  monthlyInflation,
  months,
}) {
  let corpus = normalizeNonNegative(startingCorpus);
  let expense = normalizeNonNegative(firstMonthlyExpense);
  const r = normalizeNonNegative(monthlyReturn);
  const g = normalizeNonNegative(monthlyInflation);
  const monthCount = asFiniteNumber(months);
  const n = monthCount === null || monthCount <= 0 ? 0 : monthCount;

  for (let month = 0; month < n; month += 1) {
    corpus -= expense;
    corpus *= 1 + r;
    expense *= 1 + g;
  }

  return corpus;
}

export function depletionTolerance(requiredCorpus) {
  return Math.max(
    RETIREMENT_DEPLETION_ABS_TOLERANCE,
    Math.abs(requiredCorpus) * RETIREMENT_DEPLETION_REL_TOLERANCE,
  );
}

export function calculateBeginningOfMonthContribution(
  shortfall,
  annualRatePercent,
  years,
) {
  const gap = normalizeNonNegative(shortfall);
  const ratePercent = normalizeNonNegative(annualRatePercent);
  const yearCount = asFiniteNumber(years);
  const safeYears = yearCount === null || yearCount <= 0 ? 0 : yearCount;
  const months = safeYears * 12;
  if (gap === 0 || months === 0) return 0;

  const monthlyRate = ratePercent / 12 / 100;
  if (monthlyRate === 0) return gap / months;

  return (
    gap /
    ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate))
  );
}

function emptyNumericResult() {
  return {
    yearsToRetirement: 0,
    monthsToRetirement: 0,
    monthlyExpenseAtRetirement: 0,
    retirementYears: 0,
    monthsInRetirement: 0,
    primaryRequiredCorpus: 0,
    projectedExistingCorpus: 0,
    shortfall: 0,
    surplus: 0,
    monthlyContributionRequired: 0,
    simple25xComparison: 0,
  };
}

function invalidResult(code, message, assumptions) {
  return {
    valid: false,
    validationErrors: [{ code, message }],
    ...emptyNumericResult(),
    assumptions,
  };
}

export function calculateRetirementEstimate({
  currentAge = RETIREMENT_DEFAULTS.currentAge,
  retirementAge = RETIREMENT_DEFAULTS.retirementAge,
  currentMonthlyExpense = RETIREMENT_DEFAULTS.currentMonthlyExpense,
  preRetirementInflationRate = RETIREMENT_DEFAULTS.preRetirementInflationRate,
  currentRetirementCorpus = RETIREMENT_DEFAULTS.currentRetirementCorpus,
  preRetirementReturnRate = RETIREMENT_DEFAULTS.preRetirementReturnRate,
  retirementYears = RETIREMENT_DEFAULTS.retirementYears,
  retirementInflationRate = RETIREMENT_DEFAULTS.retirementInflationRate,
  postRetirementReturnRate = RETIREMENT_DEFAULTS.postRetirementReturnRate,
} = {}) {
  const current = asFiniteNumber(currentAge);
  const retireAt = asFiniteNumber(retirementAge);
  const durationYears = asFiniteNumber(retirementYears);
  const expense = normalizeNonNegative(currentMonthlyExpense);
  const preInflation = normalizeNonNegative(preRetirementInflationRate);
  const existingCorpus = normalizeNonNegative(currentRetirementCorpus);
  const preReturn = normalizeNonNegative(preRetirementReturnRate);
  const retirementInflation = normalizeNonNegative(retirementInflationRate);
  const postReturn = normalizeNonNegative(postRetirementReturnRate);

  const assumptions = {
    currentAge: current,
    retirementAge: retireAt,
    currentMonthlyExpense: expense,
    preRetirementInflationRate: preInflation,
    currentRetirementCorpus: existingCorpus,
    preRetirementReturnRate: preReturn,
    retirementYears: durationYears,
    retirementInflationRate: retirementInflation,
    postRetirementReturnRate: postReturn,
    withdrawalTiming: "beginning-of-month",
    contributionTiming: "beginning-of-month",
    existingSavingsCompounding: "annual",
    preRetirementExpenseCompounding: "annual",
    simple25xMultiplier: RETIREMENT_SIMPLE_25X_MULTIPLIER,
  };

  if (current === null || retireAt === null) {
    return invalidResult(
      RETIREMENT_INVALID_INPUT,
      RETIREMENT_INVALID_AGE_NOTE,
      assumptions,
    );
  }

  if (retireAt <= current) {
    return invalidResult(
      RETIREMENT_INVALID_AGE,
      RETIREMENT_INVALID_AGE_NOTE,
      assumptions,
    );
  }

  if (durationYears === null || durationYears < 1) {
    return invalidResult(
      RETIREMENT_INVALID_DURATION,
      "Illustrated years in retirement must be at least 1 for this estimate to run.",
      assumptions,
    );
  }

  const yearsToRetirement = retireAt - current;
  const monthsToRetirement = yearsToRetirement * 12;
  const monthsInRetirement = durationYears * 12;
  const monthlyExpenseAtRetirement = annualCompound(
    expense,
    preInflation,
    yearsToRetirement,
  );
  const projectedExistingCorpus = annualCompound(
    existingCorpus,
    preReturn,
    yearsToRetirement,
  );
  const monthlyReturn = postReturn / 12 / 100;
  const monthlyInflation = retirementInflation / 12 / 100;
  const primaryRequiredCorpus = solveRequiredRetirementCorpus({
    firstMonthlyExpense: monthlyExpenseAtRetirement,
    monthlyReturn,
    monthlyInflation,
    months: monthsInRetirement,
  });
  const simple25xComparison =
    monthlyExpenseAtRetirement * 12 * RETIREMENT_SIMPLE_25X_MULTIPLIER;
  const shortfall = Math.max(primaryRequiredCorpus - projectedExistingCorpus, 0);
  const surplus = Math.max(projectedExistingCorpus - primaryRequiredCorpus, 0);
  const monthlyContributionRequired = calculateBeginningOfMonthContribution(
    shortfall,
    preReturn,
    yearsToRetirement,
  );

  const outputs = [
    yearsToRetirement,
    monthsToRetirement,
    monthlyExpenseAtRetirement,
    durationYears,
    monthsInRetirement,
    primaryRequiredCorpus,
    projectedExistingCorpus,
    shortfall,
    surplus,
    monthlyContributionRequired,
    simple25xComparison,
  ];

  if (outputs.some((value) => !Number.isFinite(value))) {
    return invalidResult(
      RETIREMENT_NUMERICAL_OVERFLOW,
      "This combination of assumptions produced a non-finite estimate. Try a shorter duration or a lower rate.",
      assumptions,
    );
  }

  return {
    valid: true,
    validationErrors: [],
    yearsToRetirement,
    monthsToRetirement,
    monthlyExpenseAtRetirement,
    retirementYears: durationYears,
    monthsInRetirement,
    primaryRequiredCorpus,
    projectedExistingCorpus,
    shortfall,
    surplus,
    monthlyContributionRequired,
    simple25xComparison,
    assumptions,
  };
}
