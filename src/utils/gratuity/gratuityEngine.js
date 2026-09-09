/**
 * Pure educational gratuity estimator for a monthly-rated employee.
 * Current basis: Code on Social Security, 2020 (effective 21 November 2025).
 * Qualifying service uses the continuing >6-month rule.
 * Ordinary five-year eligibility is not adjudicated for death, disablement,
 * or fixed-term employment.
 */

import {
  GRATUITY_ADDITIONAL_MONTH_THRESHOLD,
  GRATUITY_CEILING_TIME_SENSITIVE,
  GRATUITY_DAYS_DENOMINATOR,
  GRATUITY_DAYS_NUMERATOR,
  GRATUITY_FRAMEWORK_EFFECTIVE_DATE,
  GRATUITY_LEGAL_FRAMEWORK,
  GRATUITY_MIN_CONTINUOUS_SERVICE_YEARS,
  GRATUITY_STATUTORY_CEILING,
  GRATUITY_WAGE_BASIS_LABEL,
} from "./gratuityRules.js";

function asNonNegativeNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return numeric;
}

function asIntegerInRange(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return min;
  return Math.min(max, Math.max(min, Math.trunc(numeric)));
}

export function calculateQualifyingYears(completedYears, additionalMonths) {
  const years = asIntegerInRange(completedYears, 0, Number.MAX_SAFE_INTEGER);
  const months = asIntegerInRange(additionalMonths, 0, 11);
  return years + (months > GRATUITY_ADDITIONAL_MONTH_THRESHOLD ? 1 : 0);
}

export function calculateUncappedGratuity(lastDrawnStatutoryWages, qualifyingYears) {
  const wages = asNonNegativeNumber(lastDrawnStatutoryWages);
  const years = asNonNegativeNumber(qualifyingYears);
  if (wages <= 0 || years <= 0) return 0;
  return (wages * GRATUITY_DAYS_NUMERATOR * years) / GRATUITY_DAYS_DENOMINATOR;
}

export function calculateGratuityEstimate({
  lastDrawnStatutoryWages,
  completedYears,
  additionalMonths = 0,
} = {}) {
  const wages = asNonNegativeNumber(lastDrawnStatutoryWages);
  const years = asIntegerInRange(completedYears, 0, Number.MAX_SAFE_INTEGER);
  const months = asIntegerInRange(additionalMonths, 0, 11);
  const qualifyingYears = calculateQualifyingYears(years, months);
  const uncappedGratuity = calculateUncappedGratuity(wages, qualifyingYears);
  const statutoryGratuity = Math.min(uncappedGratuity, GRATUITY_STATUTORY_CEILING);
  const eligibleUnderGeneralRule = years >= GRATUITY_MIN_CONTINUOUS_SERVICE_YEARS;
  const ceilingApplied = eligibleUnderGeneralRule && uncappedGratuity > GRATUITY_STATUTORY_CEILING;
  const estimatedGratuity = eligibleUnderGeneralRule ? statutoryGratuity : null;

  return {
    legalFramework: GRATUITY_LEGAL_FRAMEWORK,
    frameworkEffectiveDate: GRATUITY_FRAMEWORK_EFFECTIVE_DATE,
    wageBasis: GRATUITY_WAGE_BASIS_LABEL,
    lastDrawnStatutoryWages: wages,
    completedYears: years,
    additionalMonths: months,
    qualifyingYears,
    uncappedGratuity,
    statutoryCeiling: GRATUITY_STATUTORY_CEILING,
    ceilingTimeSensitive: GRATUITY_CEILING_TIME_SENSITIVE,
    statutoryGratuity,
    ceilingApplied,
    eligibleUnderGeneralRule,
    estimatedGratuity,
  };
}
