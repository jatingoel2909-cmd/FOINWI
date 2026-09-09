/**
 * Educational EPF estimator for a standard already-enrolled EPF/EPS member
 * in a general 12% establishment.
 *
 * Contributions use the statutory wage ceiling. EPS is diverted from the
 * employer share and is not added to the projected EPF balance.
 * Projection is a simplified monthly running-balance approximation, not an
 * EPFO passbook recreation.
 */

import {
  EPF_CEILING_NOTE,
  EPF_EMPLOYEE_RATE_DENOMINATOR,
  EPF_EMPLOYEE_RATE_NUMERATOR,
  EPF_EPS_RATE,
  EPF_EPS_RATE_DENOMINATOR,
  EPF_EPS_RATE_NUMERATOR,
  EPF_GENERAL_EMPLOYEE_RATE,
  EPF_GENERAL_EMPLOYER_RATE,
  EPF_ILLUSTRATIVE_INTEREST_RATE,
  EPF_ILLUSTRATIVE_INTEREST_YEAR,
  EPF_LEGAL_FRAMEWORK,
  EPF_PROJECTION_METHOD_NOTE,
  EPF_WAGE_CEILING,
  EPF_WAGE_CEILING_NOTIFICATION,
} from "./epfRules.js";

const HALF_RUPEE = 0.5;
const ROUNDING_TOLERANCE = 1e-9;

function asNonNegativeNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return numeric;
}

function asNonNegativeInteger(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return Math.trunc(numeric);
}

/**
 * Nearest rupee; ₹0.50 or more rounds upward.
 * Uses a small tolerance so values such as 1249.4999999998 from binary
 * fractions of 8.33% still follow the statutory half-up rule.
 */
export function roundContribution(amount) {
  const numeric = Number(amount);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  const rupees = Math.trunc(numeric);
  const remainder = numeric - rupees;
  if (remainder + ROUNDING_TOLERANCE >= HALF_RUPEE) return rupees + 1;
  return rupees;
}

export function applyContributionRate(wage, numerator, denominator) {
  const safeWage = asNonNegativeNumber(wage);
  const safeNumerator = asNonNegativeNumber(numerator);
  const safeDenominator = asNonNegativeNumber(denominator);
  if (safeWage <= 0 || safeNumerator <= 0 || safeDenominator <= 0) return 0;
  return roundContribution((safeWage * safeNumerator) / safeDenominator);
}

export function calculateContributionWage(monthlyPFWages) {
  return Math.min(asNonNegativeNumber(monthlyPFWages), EPF_WAGE_CEILING);
}

export function calculateStatutoryContributions(monthlyPFWages) {
  const monthlyPFWagesUsed = asNonNegativeNumber(monthlyPFWages);
  const contributionWage = calculateContributionWage(monthlyPFWagesUsed);
  const employeeEPF = applyContributionRate(
    contributionWage,
    EPF_EMPLOYEE_RATE_NUMERATOR,
    EPF_EMPLOYEE_RATE_DENOMINATOR,
  );
  const employerTotal = applyContributionRate(
    contributionWage,
    EPF_EMPLOYEE_RATE_NUMERATOR,
    EPF_EMPLOYEE_RATE_DENOMINATOR,
  );
  const employerEPS = applyContributionRate(
    contributionWage,
    EPF_EPS_RATE_NUMERATOR,
    EPF_EPS_RATE_DENOMINATOR,
  );
  const employerEPF = Math.max(0, employerTotal - employerEPS);
  const monthlyEpfEnteringCorpus = employeeEPF + employerEPF;

  return {
    monthlyPFWages: monthlyPFWagesUsed,
    contributionWage,
    statutoryCeiling: EPF_WAGE_CEILING,
    ceilingApplied: monthlyPFWagesUsed > EPF_WAGE_CEILING,
    employeeRate: EPF_GENERAL_EMPLOYEE_RATE,
    employerRate: EPF_GENERAL_EMPLOYER_RATE,
    epsRate: EPF_EPS_RATE,
    employeeEPF,
    employerTotal,
    employerEPS,
    employerEPF,
    monthlyEpfEnteringCorpus,
  };
}

export function projectEpfBalance({
  currentBalance = 0,
  monthlyEpfEnteringCorpus = 0,
  annualInterestRate = EPF_ILLUSTRATIVE_INTEREST_RATE,
  years = 0,
} = {}) {
  const openingBalance = asNonNegativeNumber(currentBalance);
  const monthlyContribution = asNonNegativeNumber(monthlyEpfEnteringCorpus);
  const rate = asNonNegativeNumber(annualInterestRate);
  const months = asNonNegativeInteger(years) * 12;
  const monthlyRate = rate / 12 / 100;

  if (months === 0) {
    return {
      months,
      projectedBalance: openingBalance,
      totalEpfContributions: 0,
      interestEarned: 0,
    };
  }

  let balance = openingBalance;
  for (let month = 0; month < months; month += 1) {
    balance += monthlyContribution;
    if (monthlyRate > 0) {
      balance += balance * monthlyRate;
    }
  }

  const totalEpfContributions = monthlyContribution * months;
  const interestEarned = Math.max(0, balance - openingBalance - totalEpfContributions);

  return {
    months,
    projectedBalance: balance,
    totalEpfContributions,
    interestEarned,
  };
}

export function calculateEpfEstimate({
  monthlyPFWages,
  currentBalance = 0,
  annualInterestRate = EPF_ILLUSTRATIVE_INTEREST_RATE,
  years = 0,
} = {}) {
  const contributions = calculateStatutoryContributions(monthlyPFWages);
  const openingBalance = asNonNegativeNumber(currentBalance);
  const rate = asNonNegativeNumber(annualInterestRate);
  const remainingYears = asNonNegativeInteger(years);
  const projection = projectEpfBalance({
    currentBalance: openingBalance,
    monthlyEpfEnteringCorpus: contributions.monthlyEpfEnteringCorpus,
    annualInterestRate: rate,
    years: remainingYears,
  });

  return {
    legalFramework: EPF_LEGAL_FRAMEWORK,
    wageCeilingNotification: EPF_WAGE_CEILING_NOTIFICATION,
    illustrativeInterestYear: EPF_ILLUSTRATIVE_INTEREST_YEAR,
    projectionMethod: EPF_PROJECTION_METHOD_NOTE,
    ceilingNote: EPF_CEILING_NOTE,
    ...contributions,
    currentBalance: openingBalance,
    annualInterestRate: rate,
    years: remainingYears,
    months: projection.months,
    totalEpfContributions: projection.totalEpfContributions,
    interestEarned: projection.interestEarned,
    projectedBalance: projection.projectedBalance,
  };
}
