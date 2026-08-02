/**
 * EMI tenure comparison engine.
 * Uses shared emiFormula — no duplicated EMI math.
 */

import { getLoanTypeById, formatTenureLabel } from "../data/loanTypes.js";
import { buildEmiSummary } from "./emiFormula.js";
import { formatCurrency } from "./calculatorFormat.js";

function normalize(value, min, max) {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return 0;
  }
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function tenureToMonths(value, unit) {
  return unit === "months" ? value : value * 12;
}

/**
 * Deterministic Balanced Option:
 * Normalize EMI and total-interest burden (0–1, lower is better),
 * pick the tenure with the lowest combined score.
 */
export function selectBalancedOption(options) {
  if (!options?.length) return null;
  if (options.length === 1) return options[0];

  const emis = options.map((item) => item.monthlyEmi);
  const interests = options.map((item) => item.totalInterest);
  const minEmi = Math.min(...emis);
  const maxEmi = Math.max(...emis);
  const minInterest = Math.min(...interests);
  const maxInterest = Math.max(...interests);

  let best = options[0];
  let bestScore = Number.POSITIVE_INFINITY;

  options.forEach((option) => {
    const score =
      normalize(option.monthlyEmi, minEmi, maxEmi) +
      normalize(option.totalInterest, minInterest, maxInterest);

    if (
      score < bestScore ||
      (score === bestScore && option.months < best.months)
    ) {
      bestScore = score;
      best = option;
    }
  });

  return best;
}

export function buildTenureComparison({ principal, annualRate, loanTypeId }) {
  const loanType = getLoanTypeById(loanTypeId);
  const empty = {
    valid: false,
    loanType: loanType ?? null,
    options: [],
    highlights: null,
    longest: null,
    decisionPoints: [],
  };

  if (!loanType) return empty;

  const p = Number(principal);
  const rate = Number(annualRate);

  if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(rate) || rate < 0) {
    return empty;
  }

  const options = loanType.comparisonTenures
    .map((tenureValue) => {
      const months = tenureToMonths(tenureValue, loanType.tenureUnit);
      const summary = buildEmiSummary(p, rate, months);
      if (!summary) return null;

      return {
        id: `${loanType.id}-${tenureValue}-${loanType.tenureUnit}`,
        tenureValue,
        tenureUnit: loanType.tenureUnit,
        tenureLabel: formatTenureLabel(tenureValue, loanType.tenureUnit),
        months: summary.months,
        principal: summary.principal,
        monthlyEmi: summary.monthlyEmi,
        totalInterest: summary.totalInterest,
        totalRepayment: summary.totalRepayment,
        completionLabel: formatTenureLabel(tenureValue, loanType.tenureUnit),
      };
    })
    .filter(Boolean);

  if (!options.length) return empty;

  const longest = options.reduce((max, item) =>
    item.months > max.months ? item : max,
  );
  const lowestEmi = options.reduce((min, item) =>
    item.monthlyEmi < min.monthlyEmi ? item : min,
  );
  const lowestInterest = options.reduce((min, item) =>
    item.totalInterest < min.totalInterest ? item : min,
  );
  const fastest = options.reduce((min, item) =>
    item.months < min.months ? item : min,
  );
  const balanced = selectBalancedOption(options);

  const optionsWithMeta = options.map((option) => {
    const interestSaved = Math.max(0, longest.totalInterest - option.totalInterest);
    const emiDelta = option.monthlyEmi - longest.monthlyEmi;
    const isLongest = option.id === longest.id;

    let interestSavedNote = null;
    if (!isLongest && interestSaved > 0) {
      const emiPhrase =
        emiDelta > 0
          ? `while increasing EMI by ${formatCurrency(emiDelta)} per month`
          : emiDelta < 0
            ? `while reducing EMI by ${formatCurrency(Math.abs(emiDelta))} per month`
            : "with a similar monthly EMI";

      interestSavedNote = `Choosing ${option.tenureLabel} instead of ${longest.tenureLabel} may reduce estimated interest by ${formatCurrency(interestSaved)}, ${emiPhrase}.`;
    }

    return {
      ...option,
      interestSaved,
      emiDelta,
      interestSavedNote,
      badges: [],
    };
  });

  const badgeMap = new Map();
  const assignBadge = (option, badge) => {
    if (!option) return;
    const list = badgeMap.get(option.id) ?? [];
    if (!list.includes(badge)) list.push(badge);
    badgeMap.set(option.id, list);
  };

  assignBadge(lowestEmi, "Lowest EMI");
  assignBadge(lowestInterest, "Lowest Total Interest");
  assignBadge(fastest, "Fastest Payoff");
  assignBadge(balanced, "Balanced Option");

  const enriched = optionsWithMeta.map((option) => ({
    ...option,
    badges: badgeMap.get(option.id) ?? [],
    isBalanced: balanced?.id === option.id,
    isLowestEmi: lowestEmi?.id === option.id,
    isLowestInterest: lowestInterest?.id === option.id,
    isFastest: fastest?.id === option.id,
  }));

  return {
    valid: true,
    loanType,
    options: enriched,
    longest,
    highlights: {
      lowestEmi,
      lowestInterest,
      fastest,
      balanced,
    },
    decisionPoints: [
      "Longer tenure lowers monthly EMI but increases total interest.",
      "Shorter tenure increases EMI but reduces borrowing cost.",
      "The Balanced Option represents a middle ground in this comparison.",
    ],
  };
}
