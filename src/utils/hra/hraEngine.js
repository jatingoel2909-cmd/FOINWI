/**
 * Educational monthly HRA exemption estimator for tax year 2026-27.
 *
 * Applies Rule 279 of the Income-tax Rules, 2026 for one consistent monthly
 * period, for a person who has opted out of the default tax regime under
 * section 202. Not tax advice, tax payable, tax saved, or employer TDS.
 */

import {
  HRA_CITY_CATEGORY_40,
  HRA_CITY_CATEGORY_50,
  HRA_CITY_50_HELPER_NOTE,
  HRA_DA_HELPER_NOTE,
  HRA_FIFTY_PERCENT_CITIES,
  HRA_FORM_124_NOTE,
  HRA_FORTY_PERCENT_EXAMPLE_PLACES,
  HRA_LEGAL_FRAMEWORK,
  HRA_OCCUPANCY_NOTE,
  HRA_OWN_HOUSE_NOTE,
  HRA_PERIOD_NOTE,
  HRA_PROJECTION_METHOD_NOTE,
  HRA_REGIME_NOTE,
  HRA_RULE_FRAMEWORK,
  HRA_SCOPE_NOTE,
  HRA_TAX_YEAR,
} from "./hraRules.js";

function asFiniteNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
}

export function normalizeMonthlyAmount(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null || numeric < 0) return 0;
  return numeric;
}

function normalizePlaceKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function isFiftyPercentCity(place) {
  const key = normalizePlaceKey(place);
  if (!key) return false;
  if (HRA_FORTY_PERCENT_EXAMPLE_PLACES.some((name) => name.toLowerCase() === key)) {
    return false;
  }
  return HRA_FIFTY_PERCENT_CITIES.some((name) => name.toLowerCase() === key);
}

export function resolveResidenceCategory(residenceCategory) {
  const key = normalizePlaceKey(residenceCategory);
  if (key === HRA_CITY_CATEGORY_50) return HRA_CITY_CATEGORY_50;
  if (key === HRA_CITY_CATEGORY_40) return HRA_CITY_CATEGORY_40;
  if (isFiftyPercentCity(key)) return HRA_CITY_CATEGORY_50;
  return HRA_CITY_CATEGORY_40;
}

export function calculateHraEstimate({
  monthlyBasicSalary,
  monthlyQualifyingDA = 0,
  monthlyHraReceived,
  monthlyRentPaid,
  residenceCategory = HRA_CITY_CATEGORY_50,
} = {}) {
  const basic = normalizeMonthlyAmount(monthlyBasicSalary);
  const qualifyingDA = normalizeMonthlyAmount(monthlyQualifyingDA);
  const hraReceived = normalizeMonthlyAmount(monthlyHraReceived);
  const rentPaid = normalizeMonthlyAmount(monthlyRentPaid);
  const resolvedCategory = resolveResidenceCategory(residenceCategory);
  const cityCategory50 = resolvedCategory === HRA_CITY_CATEGORY_50;

  const rule279Salary = basic + qualifyingDA;
  const rentLimb = Math.max(0, rentPaid - 0.1 * rule279Salary);
  const cityLimb = (cityCategory50 ? 0.5 : 0.4) * rule279Salary;
  const estimatedMonthlyExemption = Math.max(
    0,
    Math.min(hraReceived, rentLimb, cityLimb),
  );
  const monthlyTaxableHra = Math.max(0, hraReceived - estimatedMonthlyExemption);

  return {
    legalFramework: HRA_LEGAL_FRAMEWORK,
    ruleFramework: HRA_RULE_FRAMEWORK,
    taxYear: HRA_TAX_YEAR,
    scope: HRA_SCOPE_NOTE,
    regimeNote: HRA_REGIME_NOTE,
    occupancyNote: HRA_OCCUPANCY_NOTE,
    ownHouseNote: HRA_OWN_HOUSE_NOTE,
    periodNote: HRA_PERIOD_NOTE,
    daHelperNote: HRA_DA_HELPER_NOTE,
    cityHelperNote: HRA_CITY_50_HELPER_NOTE,
    form124Note: HRA_FORM_124_NOTE,
    projectionMethod: HRA_PROJECTION_METHOD_NOTE,
    monthlyBasicSalary: basic,
    monthlyQualifyingDA: qualifyingDA,
    monthlyHraReceived: hraReceived,
    monthlyRentPaid: rentPaid,
    residenceCategory: resolvedCategory,
    cityCategory50,
    rule279Salary,
    rentLimb,
    cityLimb,
    estimatedMonthlyExemption,
    monthlyTaxableHra,
  };
}
