/**
 * Amortization schedule engine.
 * Builds month-by-month EMI split using shared emiFormula helpers.
 * Does not duplicate EMI calculation or modify the prepayment engine.
 */

import { calculateEmiFromMonths } from "./emiFormula.js";

export const AMORTIZATION_MAX_MONTHS = 360;
export const AMORTIZATION_MAX_YEARS = 30;

export const AMORTIZATION_ASSUMPTIONS = [
  "Constant interest rate",
  "Constant EMI",
  "No missed payments",
  "No lender-specific adjustments",
  "Educational estimate only",
];

function roundMoney(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) / 100;
}

/**
 * Build a full amortization schedule.
 * If `emi` is omitted, it is derived via calculateEmiFromMonths.
 */
export function buildAmortizationSchedule({
  principal,
  annualInterestRate,
  tenureMonths,
  emi,
} = {}) {
  const p = Number(principal);
  const rate = Number(annualInterestRate);
  const n = Math.round(Number(tenureMonths));

  const empty = {
    valid: false,
    rows: [],
    totals: {
      totalPrincipal: 0,
      totalInterest: 0,
      totalRepayment: 0,
    },
    principal: Number.isFinite(p) ? p : 0,
    annualInterestRate: Number.isFinite(rate) ? rate : 0,
    tenureMonths: Number.isFinite(n) ? n : 0,
    emi: 0,
  };

  if (
    !Number.isFinite(p) ||
    p <= 0 ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    !Number.isFinite(n) ||
    n <= 0
  ) {
    return empty;
  }

  const cappedMonths = Math.min(n, AMORTIZATION_MAX_MONTHS);
  let monthlyEmi = Number(emi);
  if (!Number.isFinite(monthlyEmi) || monthlyEmi <= 0) {
    monthlyEmi = calculateEmiFromMonths(p, rate, n);
  }
  if (!Number.isFinite(monthlyEmi) || monthlyEmi <= 0) {
    return empty;
  }

  const monthlyRate = rate / 12 / 100;
  let balance = p;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalRepayment = 0;
  const rows = [];

  for (let month = 1; month <= cappedMonths && balance > 0.5; month += 1) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;

    if (monthlyEmi <= interest + 1e-9 && balance > 0.5) {
      return empty;
    }

    let principalPart = monthlyEmi - interest;
    let payment = monthlyEmi;

    if (principalPart > balance) {
      principalPart = balance;
      payment = principalPart + interest;
    }

    balance = Math.max(0, balance - principalPart);

    // Absorb residual paise on the final scheduled month
    if (month === cappedMonths && balance > 0 && balance <= 1) {
      principalPart += balance;
      payment += balance;
      balance = 0;
    }

    totalInterest += interest;
    totalPrincipal += principalPart;
    totalRepayment += payment;

    rows.push({
      month,
      year: Math.ceil(month / 12),
      emi: roundMoney(payment),
      interest: roundMoney(interest),
      principal: roundMoney(principalPart),
      remainingBalance: roundMoney(balance),
    });
  }

  if (balance > 0 && balance <= 1 && rows.length) {
    const last = rows[rows.length - 1];
    last.principal = roundMoney(last.principal + balance);
    last.emi = roundMoney(last.emi + balance);
    last.remainingBalance = 0;
    totalPrincipal += balance;
    totalRepayment += balance;
    balance = 0;
  }

  return {
    valid: rows.length > 0 && balance <= 1,
    rows,
    totals: {
      totalPrincipal: roundMoney(totalPrincipal),
      totalInterest: roundMoney(totalInterest),
      totalRepayment: roundMoney(totalRepayment),
    },
    principal: p,
    annualInterestRate: rate,
    tenureMonths: cappedMonths,
    emi: roundMoney(monthlyEmi),
    remainingBalance: roundMoney(balance),
  };
}

/**
 * Aggregate monthly rows into yearly summary rows (max 30 years).
 */
export function buildYearlySummary(scheduleOrRows) {
  const rows = Array.isArray(scheduleOrRows)
    ? scheduleOrRows
    : scheduleOrRows?.rows;

  if (!Array.isArray(rows) || !rows.length) {
    return [];
  }

  const byYear = new Map();

  rows.forEach((row) => {
    const year = row.year;
    if (!byYear.has(year)) {
      byYear.set(year, {
        year,
        emiPaid: 0,
        principalPaid: 0,
        interestPaid: 0,
        remainingBalance: row.remainingBalance,
      });
    }
    const entry = byYear.get(year);
    entry.emiPaid += row.emi;
    entry.principalPaid += row.principal;
    entry.interestPaid += row.interest;
    entry.remainingBalance = row.remainingBalance;
  });

  return Array.from(byYear.values())
    .sort((a, b) => a.year - b.year)
    .slice(0, AMORTIZATION_MAX_YEARS)
    .map((entry) => ({
      year: entry.year,
      emiPaid: roundMoney(entry.emiPaid),
      principalPaid: roundMoney(entry.principalPaid),
      interestPaid: roundMoney(entry.interestPaid),
      remainingBalance: roundMoney(entry.remainingBalance),
    }));
}

/**
 * Build a schedule for a prepayment analysis result without recalculating
 * interest-saved logic — only reuses the scenario outputs + schedule builder.
 */
export function buildAmortizationFromPrepaymentScenario({
  principal,
  annualInterestRate,
  tenureMonths,
  prepaymentResult,
} = {}) {
  if (!prepaymentResult?.valid) {
    return buildAmortizationSchedule({
      principal,
      annualInterestRate,
      tenureMonths,
    });
  }

  if (prepaymentResult.mode === "monthly") {
    return buildAmortizationSchedule({
      principal,
      annualInterestRate,
      tenureMonths: prepaymentResult.newPayoffMonths,
      emi: prepaymentResult.newMonthlyPayment,
    });
  }

  // Lump-sum: amortize with original EMI, apply lump after afterMonths, continue.
  return buildAmortizationScheduleWithLumpSum({
    principal,
    annualInterestRate,
    tenureMonths,
    emi: prepaymentResult.monthlyEmi,
    lumpSum: prepaymentResult.appliedLump ?? prepaymentResult.prepaymentAmount,
    afterMonths: prepaymentResult.afterMonths,
  });
}

/**
 * Month-by-month schedule with a one-time principal reduction.
 * Schedule generation only — does not reimplement prepayment savings math.
 */
export function buildAmortizationScheduleWithLumpSum({
  principal,
  annualInterestRate,
  tenureMonths,
  emi,
  lumpSum = 0,
  afterMonths = 0,
} = {}) {
  const p = Number(principal);
  const rate = Number(annualInterestRate);
  const n = Math.round(Number(tenureMonths));
  const lump = Math.max(0, Number(lumpSum) || 0);
  const applyAt = Math.max(0, Math.round(Number(afterMonths) || 0));

  let monthlyEmi = Number(emi);
  if (!Number.isFinite(monthlyEmi) || monthlyEmi <= 0) {
    monthlyEmi = calculateEmiFromMonths(p, rate, n);
  }

  if (
    !Number.isFinite(p) ||
    p <= 0 ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    !Number.isFinite(n) ||
    n <= 0 ||
    !Number.isFinite(monthlyEmi) ||
    monthlyEmi <= 0
  ) {
    return buildAmortizationSchedule({
      principal,
      annualInterestRate,
      tenureMonths,
      emi,
    });
  }

  const monthlyRate = rate / 12 / 100;
  let balance = p;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalRepayment = 0;
  const rows = [];
  const limit = Math.min(n + 2, AMORTIZATION_MAX_MONTHS);

  for (let month = 1; month <= limit && balance > 0.5; month += 1) {
    if (month === applyAt + 1 && lump > 0 && balance > 0) {
      const applied = Math.min(lump, balance);
      balance = Math.max(0, balance - applied);
      totalPrincipal += applied;
      // Lump is not an EMI row — tracked via principal only
    }

    if (balance <= 0.5) {
      balance = 0;
      break;
    }

    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    if (monthlyEmi <= interest + 1e-9) {
      break;
    }

    let principalPart = monthlyEmi - interest;
    let payment = monthlyEmi;
    if (principalPart > balance) {
      principalPart = balance;
      payment = principalPart + interest;
    }

    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    totalPrincipal += principalPart;
    totalRepayment += payment;

    rows.push({
      month,
      year: Math.ceil(month / 12),
      emi: roundMoney(payment),
      interest: roundMoney(interest),
      principal: roundMoney(principalPart),
      remainingBalance: roundMoney(balance),
    });
  }

  if (balance > 0 && balance <= 1 && rows.length) {
    const last = rows[rows.length - 1];
    last.principal = roundMoney(last.principal + balance);
    last.emi = roundMoney(last.emi + balance);
    last.remainingBalance = 0;
    totalPrincipal += balance;
    totalRepayment += balance;
    balance = 0;
  }

  return {
    valid: rows.length > 0 && balance <= 1,
    rows,
    totals: {
      totalPrincipal: roundMoney(Math.min(totalPrincipal, p)),
      totalInterest: roundMoney(totalInterest),
      totalRepayment: roundMoney(totalRepayment),
    },
    principal: p,
    annualInterestRate: rate,
    tenureMonths: rows.length,
    emi: roundMoney(monthlyEmi),
    remainingBalance: roundMoney(balance),
    lumpSumApplied: lump,
    lumpAppliedAfterMonths: applyAt,
  };
}

/**
 * Progress metrics for accessible summary bars.
 */
export function buildAmortizationProgress(schedule) {
  if (!schedule?.valid || !schedule.rows?.length) {
    return {
      principalPercent: 0,
      interestPercent: 0,
      repaidPercent: 0,
      remainingPercent: 100,
    };
  }

  const { totalPrincipal, totalInterest, totalRepayment } = schedule.totals;
  const original = schedule.principal;
  const remaining = schedule.remainingBalance ?? 0;
  const repaidPrincipal = Math.max(0, original - remaining);
  const denom = totalRepayment > 0 ? totalRepayment : 1;

  return {
    principalPercent: Math.min(100, (totalPrincipal / denom) * 100),
    interestPercent: Math.min(100, (totalInterest / denom) * 100),
    repaidPercent: original > 0 ? Math.min(100, (repaidPrincipal / original) * 100) : 0,
    remainingPercent: original > 0 ? Math.min(100, (remaining / original) * 100) : 0,
    repaidPrincipal: roundMoney(repaidPrincipal),
    remainingBalance: roundMoney(remaining),
  };
}

/**
 * Convert schedule rows to CSV text.
 */
export function amortizationToCsv(schedule) {
  const header = "Month,Year,EMI,Interest,Principal,Remaining Balance";
  if (!schedule?.rows?.length) {
    return `${header}\n`;
  }

  const lines = schedule.rows.map((row) =>
    [
      row.month,
      row.year,
      row.emi.toFixed(2),
      row.interest.toFixed(2),
      row.principal.toFixed(2),
      row.remainingBalance.toFixed(2),
    ].join(","),
  );

  return `${header}\n${lines.join("\n")}\n`;
}

export function yearlySummaryToCsv(yearlyRows) {
  const header = "Year,EMI Paid,Principal Paid,Interest Paid,Remaining Balance";
  if (!Array.isArray(yearlyRows) || !yearlyRows.length) {
    return `${header}\n`;
  }

  const lines = yearlyRows.map((row) =>
    [
      row.year,
      row.emiPaid.toFixed(2),
      row.principalPaid.toFixed(2),
      row.interestPaid.toFixed(2),
      row.remainingBalance.toFixed(2),
    ].join(","),
  );

  return `${header}\n${lines.join("\n")}\n`;
}

export function countCsvDataRows(csvText) {
  if (!csvText) return 0;
  const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
  return Math.max(0, lines.length - 1);
}
