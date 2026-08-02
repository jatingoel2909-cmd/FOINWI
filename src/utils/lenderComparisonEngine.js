/**
 * Lender comparison engine for illustrative EMI scenarios.
 * Reuses emiFormula.js — no duplicated EMI math.
 */

import {
  getLoanTypeRateKey,
  ILLUSTRATIVE_RATE_DISCLAIMER,
} from "../data/lenders/indianLenders.js";
import { buildEmiSummary } from "./emiFormula.js";
import { formatCurrency } from "./calculatorFormat.js";

export { ILLUSTRATIVE_RATE_DISCLAIMER };

/**
 * Resolve a single illustrative annual rate from a min/max band.
 * Returns null when rates are missing.
 */
export function resolveIllustrativeRate(rateBand) {
  if (!rateBand || typeof rateBand !== "object") return null;
  const min = rateBand.min;
  const max = rateBand.max;

  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);

  if (!hasMin && !hasMax) return null;
  if (hasMin && hasMax) {
    if (min < 0 || max < 0 || max < min) return null;
    return (min + max) / 2;
  }
  if (hasMin && min >= 0) return min;
  if (hasMax && max >= 0) return max;
  return null;
}

export function filterLendersByLoanType(lenders = [], loanType) {
  if (!Array.isArray(lenders) || !loanType) return [];
  return lenders.filter(
    (lender) =>
      Array.isArray(lender.loanTypes) && lender.loanTypes.includes(loanType),
  );
}

function getRateBand(lender, loanType) {
  const key = getLoanTypeRateKey(loanType);
  if (!key || !lender?.illustrativeRates) return null;
  return lender.illustrativeRates[key] ?? null;
}

/**
 * Build lender EMI comparisons for a principal + tenure + loan type.
 */
export function buildLenderComparisons({
  principal,
  tenureMonths,
  loanType,
  lenders = [],
} = {}) {
  const empty = {
    valid: false,
    loanType: loanType ?? null,
    tenureMonths: Number(tenureMonths) || 0,
    principal: Number(principal) || 0,
    comparisons: [],
    lowestRateEntry: null,
    skipped: [],
  };

  const p = Number(principal);
  const months = Number(tenureMonths);

  if (!loanType || !Number.isFinite(p) || p <= 0 || !Number.isFinite(months) || months <= 0) {
    return empty;
  }

  if (!Array.isArray(lenders) || lenders.length === 0) {
    return { ...empty, loanType, principal: p, tenureMonths: months };
  }

  const eligible = filterLendersByLoanType(lenders, loanType);
  const skipped = [];
  const comparisons = [];

  eligible.forEach((lender) => {
    const rateBand = getRateBand(lender, loanType);
    const annualRate = resolveIllustrativeRate(rateBand);

    if (annualRate === null) {
      skipped.push({
        id: lender.id,
        name: lender.name,
        reason: "missing-rate",
      });
      return;
    }

    const summary = buildEmiSummary(p, annualRate, months);
    if (!summary) {
      skipped.push({
        id: lender.id,
        name: lender.name,
        reason: "invalid-calculation",
      });
      return;
    }

    comparisons.push({
      id: lender.id,
      name: lender.name,
      lenderType: lender.lenderType,
      processingStyle: lender.processingStyle,
      digitalApplication: Boolean(lender.digitalApplication),
      notes: lender.notes ?? "",
      sourceLabel: lender.sourceLabel ?? "",
      isDevelopmentPlaceholder: Boolean(lender.isDevelopmentPlaceholder),
      rateBand,
      annualRate,
      monthlyEmi: summary.monthlyEmi,
      totalInterest: summary.totalInterest,
      totalRepayment: summary.totalRepayment,
      principal: summary.principal,
      tenureMonths: summary.months,
      disclaimer: ILLUSTRATIVE_RATE_DISCLAIMER,
      // filled after lowest-rate baseline is known
      emiDifferenceFromLowest: 0,
      interestDifferenceFromLowest: 0,
      isLowestRate: false,
    });
  });

  if (!comparisons.length) {
    return {
      ...empty,
      loanType,
      principal: p,
      tenureMonths: months,
      skipped,
    };
  }

  comparisons.sort((a, b) => {
    if (a.annualRate !== b.annualRate) return a.annualRate - b.annualRate;
    return a.name.localeCompare(b.name);
  });

  const lowestRateEntry = comparisons[0];
  const lowestRate = lowestRateEntry.annualRate;

  const enriched = comparisons.map((entry) => ({
    ...entry,
    isLowestRate: entry.annualRate === lowestRate,
    emiDifferenceFromLowest: entry.monthlyEmi - lowestRateEntry.monthlyEmi,
    interestDifferenceFromLowest: entry.totalInterest - lowestRateEntry.totalInterest,
  }));

  return {
    valid: true,
    loanType,
    principal: p,
    tenureMonths: months,
    comparisons: enriched,
    lowestRateEntry: enriched[0],
    skipped,
  };
}

/**
 * Build a factual savings insight from the lowest vs highest rate scenarios.
 */
export function buildLenderSavingsSummary(comparisonsOrResult) {
  const list = Array.isArray(comparisonsOrResult)
    ? comparisonsOrResult
    : comparisonsOrResult?.comparisons;

  if (!Array.isArray(list) || list.length < 2) {
    return null;
  }

  const lowest = list.reduce((min, item) =>
    item.annualRate < min.annualRate ? item : min,
  );
  const highest = list.reduce((max, item) =>
    item.annualRate > max.annualRate ? item : max,
  );

  const rateDiffPoints = highest.annualRate - lowest.annualRate;
  const emiDiff = highest.monthlyEmi - lowest.monthlyEmi;
  const interestDiff = highest.totalInterest - lowest.totalInterest;

  if (rateDiffPoints <= 0) {
    return {
      rateDiffPoints: 0,
      emiDiff: 0,
      interestDiff: 0,
      lowest,
      highest,
      statement:
        "In this illustrative set, lender rates are equal, so estimated EMI and total interest do not differ.",
      secondary:
        "Small differences in rates can create significant long-term repayment differences.",
    };
  }

  return {
    rateDiffPoints,
    emiDiff,
    interestDiff,
    lowest,
    highest,
    statement: `A rate difference of ${rateDiffPoints.toFixed(2)} percentage points changes the estimated EMI by ${formatCurrency(emiDiff)} per month and estimated total interest by ${formatCurrency(interestDiff)} over this tenure.`,
    secondary:
      "Small differences in rates can create significant long-term repayment differences.",
  };
}
