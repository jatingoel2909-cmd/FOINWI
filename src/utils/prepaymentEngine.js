/**
 * EMI prepayment intelligence engine (Phase 1).
 * Reuses emiFormula.js — does not duplicate EMI calculation.
 */

import { buildEmiSummary, calculateEmiFromMonths } from "./emiFormula.js";
import { formatCurrency } from "./calculatorFormat.js";

const MAX_SIMULATION_MONTHS = 1200;

function isValidLoanBase(principal, annualRate, tenureMonths) {
  const p = Number(principal);
  const rate = Number(annualRate);
  const n = Number(tenureMonths);
  return (
    Number.isFinite(p) &&
    p > 0 &&
    Number.isFinite(rate) &&
    rate >= 0 &&
    Number.isFinite(n) &&
    n > 0 &&
    Number.isInteger(n)
  );
}

/**
 * Simulate amortization with a fixed monthly payment until payoff.
 * Returns null if payment cannot service interest (balance grows).
 */
export function simulateAmortization({
  principal,
  annualRate,
  monthlyPayment,
  maxMonths = MAX_SIMULATION_MONTHS,
} = {}) {
  const p = Number(principal);
  const rate = Number(annualRate);
  const payment = Number(monthlyPayment);
  const limit = Number(maxMonths);

  if (
    !Number.isFinite(p) ||
    p < 0 ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    !Number.isFinite(payment) ||
    payment < 0 ||
    !Number.isFinite(limit) ||
    limit <= 0
  ) {
    return null;
  }

  if (p === 0) {
    return {
      monthsPaid: 0,
      totalInterest: 0,
      totalPaid: 0,
      remainingPrincipal: 0,
      paidOff: true,
    };
  }

  const monthlyRate = rate / 12 / 100;
  let balance = p;
  let totalInterest = 0;
  let totalPaid = 0;
  let monthsPaid = 0;

  while (balance > 0.5 && monthsPaid < limit) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;

    // Payment cannot cover interest — never pays off
    if (payment <= interest + 1e-9 && balance > 0.5) {
      return null;
    }

    const principalPart = Math.min(balance, payment - interest);
    const actualPayment = principalPart + interest;

    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    totalPaid += actualPayment;
    monthsPaid += 1;
  }

  // Absorb residual paise left by floating-point amortization
  if (balance > 0 && balance <= 0.5) {
    totalPaid += balance;
    balance = 0;
  }

  return {
    monthsPaid,
    totalInterest: Math.max(0, totalInterest),
    totalPaid: Math.max(0, totalPaid),
    remainingPrincipal: Math.max(0, balance),
    paidOff: balance <= 0.5,
  };
}

/**
 * Remaining principal after `elapsedMonths` of scheduled EMI payments.
 */
export function getRemainingPrincipalAfterMonths(
  principal,
  annualRate,
  tenureMonths,
  elapsedMonths,
) {
  const baseline = buildEmiSummary(principal, annualRate, tenureMonths);
  if (!baseline) return null;

  const elapsed = Math.max(0, Math.min(Number(elapsedMonths) || 0, tenureMonths));
  if (elapsed === 0) {
    return {
      remainingPrincipal: Number(principal),
      interestPaid: 0,
      monthsElapsed: 0,
      monthlyEmi: baseline.monthlyEmi,
    };
  }

  const sim = simulateAmortization({
    principal,
    annualRate,
    monthlyPayment: baseline.monthlyEmi,
    maxMonths: elapsed,
  });

  if (!sim) return null;

  return {
    remainingPrincipal: sim.remainingPrincipal,
    interestPaid: sim.totalInterest,
    monthsElapsed: sim.monthsPaid,
    monthlyEmi: baseline.monthlyEmi,
  };
}

/**
 * Months needed to clear a balance with a fixed monthly payment (same EMI).
 */
export function monthsToPayOff(principal, annualRate, monthlyPayment) {
  const p = Number(principal);
  const rate = Number(annualRate);
  const payment = Number(monthlyPayment);

  if (!Number.isFinite(p) || p <= 0) return 0;
  if (!Number.isFinite(payment) || payment <= 0) return null;
  if (!Number.isFinite(rate) || rate < 0) return null;

  const monthlyRate = rate / 12 / 100;

  if (monthlyRate === 0) {
    return Math.ceil(p / payment);
  }

  if (payment <= p * monthlyRate) {
    return null;
  }

  const months =
    Math.log(payment / (payment - p * monthlyRate)) / Math.log(1 + monthlyRate);

  if (!Number.isFinite(months) || months <= 0) return null;
  return Math.ceil(months - 1e-9);
}

function buildEducationalSummary({ interestSaved, monthsSaved, mode }) {
  const statements = [];

  if (interestSaved > 0.5) {
    statements.push(
      `You may save approximately ${formatCurrency(interestSaved)} in interest.`,
    );
  } else if (interestSaved <= 0.5 && monthsSaved === 0) {
    statements.push(
      "With these inputs, estimated interest and tenure are unchanged versus the original schedule.",
    );
  }

  if (monthsSaved > 0) {
    statements.push(
      `Your loan may finish approximately ${monthsSaved} ${monthsSaved === 1 ? "month" : "months"} earlier.`,
    );
  }

  if (mode === "monthly" && interestSaved > 0) {
    statements.push(
      "Extra monthly payments reduce principal faster, which can lower total interest over the loan life.",
    );
  }

  if (mode === "lumpSum" && interestSaved > 0) {
    statements.push(
      "A lump-sum prepayment reduces remaining principal, which can shorten tenure when EMI stays the same.",
    );
  }

  statements.push(
    "Educational estimate only. Actual prepayment terms, charges and revised schedules depend on your lender.",
  );

  return statements;
}

/**
 * Analyze adding a fixed extra amount to each EMI (tenure reduction).
 */
export function analyzeMonthlyPrepayment({
  principal,
  annualRate,
  tenureMonths,
  extraMonthly = 0,
} = {}) {
  const empty = {
    valid: false,
    mode: "monthly",
    principal: Number(principal) || 0,
    annualRate: Number(annualRate) || 0,
    tenureMonths: Number(tenureMonths) || 0,
    extraMonthly: Number(extraMonthly) || 0,
  };

  if (!isValidLoanBase(principal, annualRate, tenureMonths)) {
    return empty;
  }

  const extra = Number(extraMonthly);
  if (!Number.isFinite(extra) || extra < 0) {
    return empty;
  }

  const baseline = buildEmiSummary(principal, annualRate, tenureMonths);
  if (!baseline) return empty;

  // Zero extra matches the original schedule exactly (avoids float residue in simulation).
  if (extra === 0) {
    const timeline = buildPrepaymentTimeline({
      originalMonths: tenureMonths,
      newMonths: tenureMonths,
    });
    return {
      valid: true,
      mode: "monthly",
      principal: baseline.principal,
      annualRate: Number(annualRate),
      tenureMonths,
      extraMonthly: 0,
      originalMonthlyEmi: baseline.monthlyEmi,
      newMonthlyPayment: baseline.monthlyEmi,
      originalPayoffMonths: tenureMonths,
      newPayoffMonths: tenureMonths,
      monthsSaved: 0,
      yearsSaved: 0,
      originalTotalInterest: baseline.totalInterest,
      newTotalInterest: baseline.totalInterest,
      interestSaved: 0,
      originalTotalRepayment: baseline.totalRepayment,
      newTotalRepayment: baseline.totalRepayment,
      totalRepaymentDifference: 0,
      timeline,
      summaryStatements: buildEducationalSummary({
        interestSaved: 0,
        monthsSaved: 0,
        mode: "monthly",
      }),
    };
  }

  const monthlyPayment = baseline.monthlyEmi + extra;
  const prepaid = simulateAmortization({
    principal,
    annualRate,
    monthlyPayment,
    maxMonths: tenureMonths + 2,
  });

  if (!prepaid || !prepaid.paidOff) {
    return {
      ...empty,
      valid: false,
      reason: "cannot-payoff",
      baseline,
    };
  }

  const monthsSaved = Math.max(0, tenureMonths - prepaid.monthsPaid);
  const interestSaved = Math.max(0, baseline.totalInterest - prepaid.totalInterest);
  const totalRepaymentDifference = Math.max(
    0,
    baseline.totalRepayment - prepaid.totalPaid,
  );

  const timeline = buildPrepaymentTimeline({
    originalMonths: tenureMonths,
    newMonths: prepaid.monthsPaid,
  });

  return {
    valid: true,
    mode: "monthly",
    principal: baseline.principal,
    annualRate: Number(annualRate),
    tenureMonths,
    extraMonthly: extra,
    originalMonthlyEmi: baseline.monthlyEmi,
    newMonthlyPayment: monthlyPayment,
    originalPayoffMonths: tenureMonths,
    newPayoffMonths: prepaid.monthsPaid,
    monthsSaved,
    yearsSaved: monthsSaved / 12,
    originalTotalInterest: baseline.totalInterest,
    newTotalInterest: prepaid.totalInterest,
    interestSaved,
    originalTotalRepayment: baseline.totalRepayment,
    newTotalRepayment: prepaid.totalPaid,
    totalRepaymentDifference,
    timeline,
    summaryStatements: buildEducationalSummary({
      interestSaved,
      monthsSaved,
      mode: "monthly",
    }),
  };
}

/**
 * Analyze a one-time lump-sum prepayment after X years, keeping EMI and reducing tenure.
 */
export function analyzeLumpSumPrepayment({
  principal,
  annualRate,
  tenureMonths,
  prepaymentAmount = 0,
  afterYears = 0,
} = {}) {
  const empty = {
    valid: false,
    mode: "lumpSum",
    principal: Number(principal) || 0,
    annualRate: Number(annualRate) || 0,
    tenureMonths: Number(tenureMonths) || 0,
    prepaymentAmount: Number(prepaymentAmount) || 0,
    afterYears: Number(afterYears) || 0,
  };

  if (!isValidLoanBase(principal, annualRate, tenureMonths)) {
    return empty;
  }

  const lump = Number(prepaymentAmount);
  const afterY = Number(afterYears);
  if (!Number.isFinite(lump) || lump < 0 || !Number.isFinite(afterY) || afterY < 0) {
    return empty;
  }

  const afterMonths = Math.round(afterY * 12);
  if (afterMonths >= tenureMonths) {
    return {
      ...empty,
      valid: false,
      reason: "prepayment-after-loan-end",
    };
  }

  const baseline = buildEmiSummary(principal, annualRate, tenureMonths);
  if (!baseline) return empty;

  const before = getRemainingPrincipalAfterMonths(
    principal,
    annualRate,
    tenureMonths,
    afterMonths,
  );
  if (!before) return empty;

  const remainingBeforeLump = before.remainingPrincipal;
  const appliedLump = Math.min(lump, remainingBeforeLump);
  const remainingAfterLump = Math.max(0, remainingBeforeLump - appliedLump);

  let monthsAfterLump = 0;
  let interestAfterLump = 0;
  let paidAfterLump = 0;

  if (remainingAfterLump > 0.01) {
    const remainingMonthsCap = tenureMonths - afterMonths;
    const afterSim = simulateAmortization({
      principal: remainingAfterLump,
      annualRate,
      monthlyPayment: baseline.monthlyEmi,
      maxMonths: remainingMonthsCap + 1,
    });

    if (!afterSim || !afterSim.paidOff) {
      // Fallback: closed-form months, then resimulate
      const closedMonths = monthsToPayOff(
        remainingAfterLump,
        annualRate,
        baseline.monthlyEmi,
      );
      if (closedMonths == null) {
        return { ...empty, valid: false, reason: "cannot-payoff", baseline };
      }
      const retry = simulateAmortization({
        principal: remainingAfterLump,
        annualRate,
        monthlyPayment: baseline.monthlyEmi,
        maxMonths: closedMonths,
      });
      if (!retry || !retry.paidOff) {
        return { ...empty, valid: false, reason: "cannot-payoff", baseline };
      }
      monthsAfterLump = retry.monthsPaid;
      interestAfterLump = retry.totalInterest;
      paidAfterLump = retry.totalPaid;
    } else {
      monthsAfterLump = afterSim.monthsPaid;
      interestAfterLump = afterSim.totalInterest;
      paidAfterLump = afterSim.totalPaid;
    }
  }

  const newPayoffMonths = afterMonths + monthsAfterLump;
  const monthsSaved = Math.max(0, tenureMonths - newPayoffMonths);
  const newTotalInterest = before.interestPaid + interestAfterLump;
  const interestSaved = Math.max(0, baseline.totalInterest - newTotalInterest);
  const remainingInterest = Math.max(0, interestAfterLump);

  // Total paid = scheduled payments before lump + lump amount + payments after
  const beforeSim = simulateAmortization({
    principal,
    annualRate,
    monthlyPayment: baseline.monthlyEmi,
    maxMonths: afterMonths,
  });
  const totalPaidBefore = beforeSim ? beforeSim.totalPaid : 0;
  const newTotalRepayment = totalPaidBefore + appliedLump + paidAfterLump;
  const totalRepaymentDifference = Math.max(
    0,
    baseline.totalRepayment - newTotalRepayment,
  );

  const timeline = buildPrepaymentTimeline({
    originalMonths: tenureMonths,
    newMonths: newPayoffMonths,
  });

  return {
    valid: true,
    mode: "lumpSum",
    principal: baseline.principal,
    annualRate: Number(annualRate),
    tenureMonths,
    prepaymentAmount: lump,
    appliedLump,
    afterYears: afterY,
    afterMonths,
    monthlyEmi: baseline.monthlyEmi,
    remainingPrincipalBeforePrepayment: remainingBeforeLump,
    remainingPrincipal: remainingAfterLump,
    originalPayoffMonths: tenureMonths,
    newPayoffMonths,
    newTenureMonths: monthsAfterLump,
    monthsSaved,
    yearsSaved: monthsSaved / 12,
    originalTotalInterest: baseline.totalInterest,
    newTotalInterest,
    interestSaved,
    remainingInterest,
    originalTotalRepayment: baseline.totalRepayment,
    newTotalRepayment,
    totalRepaymentDifference,
    timeline,
    summaryStatements: buildEducationalSummary({
      interestSaved,
      monthsSaved,
      mode: "lumpSum",
    }),
  };
}

/**
 * Simple original vs new tenure bar metrics for timeline UI.
 */
export function buildPrepaymentTimeline({ originalMonths, newMonths } = {}) {
  const original = Math.max(0, Number(originalMonths) || 0);
  const next = Math.max(0, Number(newMonths) || 0);
  const monthsReduced = Math.max(0, original - next);
  const yearsReduced = monthsReduced / 12;
  const maxMonths = Math.max(original, next, 1);

  return {
    originalMonths: original,
    newMonths: next,
    monthsReduced,
    yearsReduced,
    originalBarPercent: (original / maxMonths) * 100,
    newBarPercent: (next / maxMonths) * 100,
    originalYearsLabel: formatMonthsAsYears(original),
    newYearsLabel: formatMonthsAsYears(next),
    yearsReducedLabel:
      monthsReduced === 0
        ? "No tenure reduction in this estimate"
        : `About ${formatMonthsAsYears(monthsReduced)} reduced`,
  };
}

export function formatMonthsAsYears(months) {
  const m = Math.max(0, Math.round(Number(months) || 0));
  if (m === 0) return "0 months";
  const years = Math.floor(m / 12);
  const rem = m % 12;
  if (years === 0) return `${rem} ${rem === 1 ? "month" : "months"}`;
  if (rem === 0) return `${years} ${years === 1 ? "year" : "years"}`;
  return `${years} ${years === 1 ? "year" : "years"} ${rem} ${rem === 1 ? "month" : "months"}`;
}

/**
 * Convenience: ensure EMI base matches shared formula (for validators).
 */
export function getBaselineEmi(principal, annualRate, tenureMonths) {
  return calculateEmiFromMonths(principal, annualRate, tenureMonths);
}
