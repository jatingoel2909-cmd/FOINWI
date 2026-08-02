/**
 * Shared EMI formula helpers.
 * Single source of truth for EMI calculators and tenure comparison.
 */

/**
 * Calculate monthly EMI from principal, annual rate (%), and tenure in months.
 * Returns null for invalid inputs. Handles zero interest safely.
 */
export function calculateEmiFromMonths(principal, annualRate, months) {
  const p = Number(principal);
  const rate = Number(annualRate);
  const n = Number(months);

  if (!Number.isFinite(p) || !Number.isFinite(rate) || !Number.isFinite(n)) {
    return null;
  }
  if (p <= 0 || n <= 0 || rate < 0) {
    return null;
  }

  const monthlyRate = rate / 12 / 100;

  if (monthlyRate === 0) {
    return p / n;
  }

  const factor = Math.pow(1 + monthlyRate, n);
  if (!Number.isFinite(factor) || factor === 1) {
    return null;
  }

  const emi = (p * monthlyRate * factor) / (factor - 1);
  return Number.isFinite(emi) ? emi : null;
}

/**
 * Calculate monthly EMI from principal, annual rate (%), and tenure in years.
 * Matches the existing EMI calculator formula.
 */
export function calculateEmi(principal, annualRate, years) {
  const y = Number(years);
  if (!Number.isFinite(y) || y <= 0) return null;
  return calculateEmiFromMonths(principal, annualRate, y * 12);
}

/**
 * Build a full EMI summary for a given tenure in months.
 */
export function buildEmiSummary(principal, annualRate, months) {
  const p = Number(principal);
  const n = Number(months);
  const emi = calculateEmiFromMonths(p, annualRate, n);

  if (emi === null) {
    return null;
  }

  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - p;

  return {
    principal: p,
    months: n,
    monthlyEmi: emi,
    totalInterest: Math.max(0, totalInterest),
    totalRepayment: Math.max(0, totalRepayment),
  };
}
