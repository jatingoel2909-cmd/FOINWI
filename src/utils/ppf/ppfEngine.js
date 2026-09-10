/**
 * Educational PPF accumulation estimator.
 *
 * Year-by-year running balance under a constant illustrative annual rate,
 * with the full yearly contribution treated as deposited on or before
 * 5 April. Not an official PPF passbook or a prediction of future
 * notified rates.
 */

import {
  PPF_CONTRIBUTION_STEP,
  PPF_DEPOSIT_TIMING_NOTE,
  PPF_ILLUSTRATIVE_INTEREST_RATE,
  PPF_ILLUSTRATIVE_RATE_PERIOD,
  PPF_INTEREST_METHOD_NOTE,
  PPF_LEGAL_FRAMEWORK,
  PPF_MAX_ANNUAL_CONTRIBUTION,
  PPF_MIN_ANNUAL_CONTRIBUTION,
  PPF_PROJECTION_METHOD_NOTE,
  PPF_STANDARD_CONTRIBUTION_YEARS,
} from "./ppfRules.js";

function asFiniteNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
}

export function normalizeAnnualContribution(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null || numeric <= 0) return 0;
  const clamped = Math.min(
    PPF_MAX_ANNUAL_CONTRIBUTION,
    Math.max(PPF_MIN_ANNUAL_CONTRIBUTION, numeric),
  );
  return Math.round(clamped / PPF_CONTRIBUTION_STEP) * PPF_CONTRIBUTION_STEP;
}

export function normalizeIllustrativeRate(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null || numeric < 0) return 0;
  return numeric;
}

export function normalizeContributionYears(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null || numeric <= 0) return 0;
  return Math.trunc(numeric);
}

export function projectPpfBalance({
  annualContribution = 0,
  illustrativeAnnualRate = PPF_ILLUSTRATIVE_INTEREST_RATE,
  contributionYears = PPF_STANDARD_CONTRIBUTION_YEARS,
} = {}) {
  const yearly = normalizeAnnualContribution(annualContribution);
  const ratePercent = normalizeIllustrativeRate(illustrativeAnnualRate);
  const years = normalizeContributionYears(contributionYears);
  const rate = ratePercent / 100;

  let balance = 0;
  for (let year = 0; year < years; year += 1) {
    balance += yearly;
    if (rate > 0) {
      balance += balance * rate;
    }
  }

  const totalContributed = yearly * years;
  const interestEarned = Math.max(0, balance - totalContributed);

  return {
    annualContribution: yearly,
    illustrativeAnnualRate: ratePercent,
    contributionYears: years,
    totalContributed,
    interestEarned,
    estimatedBalance: balance,
  };
}

export function calculatePpfEstimate({
  annualContribution,
  illustrativeAnnualRate = PPF_ILLUSTRATIVE_INTEREST_RATE,
  contributionYears = PPF_STANDARD_CONTRIBUTION_YEARS,
} = {}) {
  const projection = projectPpfBalance({
    annualContribution,
    illustrativeAnnualRate,
    contributionYears,
  });

  return {
    legalFramework: PPF_LEGAL_FRAMEWORK,
    illustrativeRatePeriod: PPF_ILLUSTRATIVE_RATE_PERIOD,
    depositTimingAssumption: PPF_DEPOSIT_TIMING_NOTE,
    interestMethod: PPF_INTEREST_METHOD_NOTE,
    projectionMethod: PPF_PROJECTION_METHOD_NOTE,
    ...projection,
  };
}
