/**
 * Educational NPS accumulation and scoped normal-exit estimator.
 *
 * Uses a simplified beginning-of-month monthly contribution projection
 * and, only when projected corpus is above ₹12 lakh, an illustrative
 * 20%–100% annuity allocation for a non-Government All Citizen
 * Common Scheme Tier-I normal-exit case. Not an official PRAN statement,
 * ASP quote, tax computation, or prediction of market-linked returns.
 */

import {
  NPS_AMENDMENT_EFFECTIVE,
  NPS_CORPUS_BAND_NOTE,
  NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT,
  NPS_DEFAULT_ANNUITY_RATE_PERCENT,
  NPS_DEFAULT_ILLUSTRATIVE_RETURN_PERCENT,
  NPS_EXIT_FRAMEWORK,
  NPS_EXIT_SPLIT_CORPUS_THRESHOLD,
  NPS_INVALID_AGE_NOTE,
  NPS_LEGAL_FRAMEWORK,
  NPS_MAX_ANNUITY_ALLOCATION_PERCENT,
  NPS_MIN_ANNUITY_ALLOCATION_PERCENT,
  NPS_MIN_ILLUSTRATED_EXIT_AGE,
  NPS_PROJECTION_METHOD_NOTE,
  NPS_SCOPE_NOTE,
} from "./npsRules.js";

export const NPS_INVALID_INVERTED_AGES = "inverted-ages";
export const NPS_INVALID_EXIT_AGE_BELOW_60 = "exit-age-below-60";
export const NPS_INVALID_AGE_INPUT = "invalid-age-input";

function asFiniteNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
}

export function normalizeNonNegativeAmount(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null || numeric < 0) return 0;
  return numeric;
}

export function normalizeAnnuityAllocationPercent(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null) return NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT;
  return Math.min(
    NPS_MAX_ANNUITY_ALLOCATION_PERCENT,
    Math.max(NPS_MIN_ANNUITY_ALLOCATION_PERCENT, numeric),
  );
}

export function resolveAgeValidation(currentAge, exitAge) {
  const current = asFiniteNumber(currentAge);
  const exit = asFiniteNumber(exitAge);
  if (current === null || exit === null) {
    return { valid: false, reason: NPS_INVALID_AGE_INPUT, contributionYears: 0 };
  }
  if (current >= exit) {
    return { valid: false, reason: NPS_INVALID_INVERTED_AGES, contributionYears: 0 };
  }
  if (exit < NPS_MIN_ILLUSTRATED_EXIT_AGE) {
    return { valid: false, reason: NPS_INVALID_EXIT_AGE_BELOW_60, contributionYears: 0 };
  }
  return {
    valid: true,
    reason: null,
    contributionYears: exit - current,
  };
}

export function projectBeginningOfMonthCorpus(
  monthlyContribution,
  illustrativeAnnualReturnPercent,
  years,
) {
  const monthly = normalizeNonNegativeAmount(monthlyContribution);
  const ratePercent = normalizeNonNegativeAmount(illustrativeAnnualReturnPercent);
  const yearCount = asFiniteNumber(years);
  const safeYears = yearCount === null || yearCount <= 0 ? 0 : yearCount;
  const months = safeYears * 12;
  const monthlyRate = ratePercent / 12 / 100;

  if (monthlyRate === 0) return monthly * months;

  return (
    monthly *
    (((1 + monthlyRate) ** months - 1) / monthlyRate) *
    (1 + monthlyRate)
  );
}

function emptyExitIllustration() {
  return {
    exitIllustrationApplies: false,
    annuityAllocationPercent: null,
    annuityAllocation: null,
    illustrativeLumpSum: null,
    illustrativeAnnuityRatePercent: null,
    illustrativeMonthlyAnnuity: null,
  };
}

export function calculateNpsEstimate({
  monthlyContribution = 0,
  illustrativeAnnualReturnPercent = NPS_DEFAULT_ILLUSTRATIVE_RETURN_PERCENT,
  currentAge,
  exitAge,
  annuityAllocationPercent = NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT,
  illustrativeAnnuityRatePercent = NPS_DEFAULT_ANNUITY_RATE_PERCENT,
} = {}) {
  const ageCheck = resolveAgeValidation(currentAge, exitAge);
  const monthly = normalizeNonNegativeAmount(monthlyContribution);
  const returnPercent = normalizeNonNegativeAmount(illustrativeAnnualReturnPercent);
  const allocationPercent = normalizeAnnuityAllocationPercent(annuityAllocationPercent);
  const annuityRatePercent = normalizeNonNegativeAmount(illustrativeAnnuityRatePercent);

  if (!ageCheck.valid) {
    return {
      valid: false,
      reason: ageCheck.reason,
      legalFramework: NPS_LEGAL_FRAMEWORK,
      exitFramework: NPS_EXIT_FRAMEWORK,
      amendmentEffective: NPS_AMENDMENT_EFFECTIVE,
      scope: NPS_SCOPE_NOTE,
      projectionMethod: NPS_PROJECTION_METHOD_NOTE,
      currentAge: asFiniteNumber(currentAge),
      exitAge: asFiniteNumber(exitAge),
      contributionYears: 0,
      monthlyContribution: monthly,
      illustrativeAnnualReturnPercent: returnPercent,
      projectedCorpus: null,
      totalContributed: null,
      ...emptyExitIllustration(),
      message: NPS_INVALID_AGE_NOTE,
    };
  }

  const projectedCorpus = projectBeginningOfMonthCorpus(
    monthly,
    returnPercent,
    ageCheck.contributionYears,
  );
  const totalContributed = monthly * ageCheck.contributionYears * 12;
  const exitIllustrationApplies = projectedCorpus > NPS_EXIT_SPLIT_CORPUS_THRESHOLD;

  const exitIllustration = exitIllustrationApplies
    ? {
        exitIllustrationApplies: true,
        annuityAllocationPercent: allocationPercent,
        annuityAllocation: projectedCorpus * (allocationPercent / 100),
        illustrativeLumpSum: projectedCorpus * (1 - allocationPercent / 100),
        illustrativeAnnuityRatePercent: annuityRatePercent,
        illustrativeMonthlyAnnuity:
          (projectedCorpus * (allocationPercent / 100) * annuityRatePercent) / 100 / 12,
      }
    : emptyExitIllustration();

  return {
    valid: true,
    reason: null,
    legalFramework: NPS_LEGAL_FRAMEWORK,
    exitFramework: NPS_EXIT_FRAMEWORK,
    amendmentEffective: NPS_AMENDMENT_EFFECTIVE,
    scope: NPS_SCOPE_NOTE,
    projectionMethod: NPS_PROJECTION_METHOD_NOTE,
    currentAge: asFiniteNumber(currentAge),
    exitAge: asFiniteNumber(exitAge),
    contributionYears: ageCheck.contributionYears,
    monthlyContribution: monthly,
    illustrativeAnnualReturnPercent: returnPercent,
    projectedCorpus,
    totalContributed,
    ...exitIllustration,
    message: exitIllustrationApplies ? null : NPS_CORPUS_BAND_NOTE,
  };
}
