/**
 * Educational loan-eligibility estimator.
 * Uses inverse EMI (principal-from-EMI) from emiFormula.js.
 * Results are illustrative estimates — never an approval or credit decision.
 */

import { getLoanTypeById, formatTenureLabel } from "../data/loanTypes.js";
import {
  buildEmiSummary,
  calculateEmiFromMonths,
  calculatePrincipalFromEmi,
} from "./emiFormula.js";

export const DEFAULT_FOIR_PERCENT = 50;
export const FOIR_MIN = 20;
export const FOIR_MAX = 70;

export const FOIR_HELPER_TEXT =
  "FOIR is an illustrative assumption used to estimate how much of monthly income may be available for total debt obligations. Actual lender policies vary.";

export const ELIGIBILITY_ASSUMPTIONS = [
  "Income remains stable.",
  "Interest rate remains unchanged.",
  "Existing monthly obligations are accurately entered.",
  "FOIR is an illustrative user-editable assumption.",
  "Taxes, living expenses, credit history, property valuation, lender policy and documentation are not assessed.",
  "Results are educational estimates only.",
];

export const CAPACITY_INDICATOR_NOTE =
  "This indicator is based only on entered income, obligations and the selected FOIR assumption. It is not a lender assessment or credit decision.";

function toNumber(value, fallback = NaN) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clampFoir(foirPercent) {
  const foir = toNumber(foirPercent, DEFAULT_FOIR_PERCENT);
  return Math.min(FOIR_MAX, Math.max(FOIR_MIN, foir));
}

/**
 * Factual capacity wording from available EMI vs assumed FOIR obligation capacity.
 * Does not judge creditworthiness or lender outcomes.
 *
 * availableEmiCapacityPercent =
 *   estimatedAvailableEmi / maximumPermittedObligations × 100
 */
export function resolveCapacityStatus(
  estimatedAvailableEmi,
  maximumPermittedObligations,
) {
  const available = Math.max(0, toNumber(estimatedAvailableEmi, 0));
  const maxObligations = Math.max(0, toNumber(maximumPermittedObligations, 0));

  if (!(maxObligations > 0)) {
    return {
      status: "invalid",
      label: "No estimated EMI capacity available",
      availableEmiCapacityPercent: 0,
      capacityDetail:
        "0% of the assumed obligation capacity remains available for an illustrative new EMI.",
    };
  }

  const availableEmiCapacityPercent = (available / maxObligations) * 100;
  const roundedPercent = Math.round(availableEmiCapacityPercent * 10) / 10;
  const percentLabel = Number.isInteger(roundedPercent)
    ? String(roundedPercent)
    : roundedPercent.toFixed(1);

  const capacityDetail = `${percentLabel}% of the assumed obligation capacity remains available for an illustrative new EMI.`;

  if (available <= 0 || availableEmiCapacityPercent <= 0) {
    return {
      status: "none",
      label: "No estimated EMI capacity available",
      availableEmiCapacityPercent: 0,
      capacityDetail:
        "0% of the assumed obligation capacity remains available for an illustrative new EMI.",
    };
  }

  if (availableEmiCapacityPercent < 50) {
    return {
      status: "part",
      label: "Part of assumed EMI capacity available",
      availableEmiCapacityPercent,
      capacityDetail,
    };
  }

  return {
    status: "most",
    label: "Most assumed EMI capacity available",
    availableEmiCapacityPercent,
    capacityDetail,
  };
}

/**
 * Core eligibility calculation for a single tenure.
 */
export function calculateLoanEligibility({
  monthlyIncome,
  existingMonthlyObligations = 0,
  annualInterestRate,
  tenureMonths,
  foirPercent = DEFAULT_FOIR_PERCENT,
  downPayment = 0,
  coApplicantMonthlyIncome = 0,
} = {}) {
  const income = toNumber(monthlyIncome, NaN);
  const coIncome = Math.max(0, toNumber(coApplicantMonthlyIncome, 0));
  const obligations = Math.max(0, toNumber(existingMonthlyObligations, 0));
  const rate = toNumber(annualInterestRate, NaN);
  const months = Math.round(toNumber(tenureMonths, NaN));
  const foir = clampFoir(foirPercent);
  const down = Math.max(0, toNumber(downPayment, 0));

  const assumptions = [...ELIGIBILITY_ASSUMPTIONS];

  if (
    !Number.isFinite(income) ||
    income <= 0 ||
    !Number.isFinite(rate) ||
    rate < 0 ||
    !Number.isFinite(months) ||
    months <= 0
  ) {
    return {
      valid: false,
      combinedMonthlyIncome: Math.max(0, (Number.isFinite(income) ? income : 0) + coIncome),
      maximumPermittedObligations: 0,
      estimatedAvailableEmi: 0,
      estimatedEligibleLoan: 0,
      estimatedPropertyBudget: null,
      existingObligationRatio: 0,
      estimatedFoirUsed: 0,
      foirPercent: foir,
      assumptions,
      status: "invalid",
      capacityLabel: "No estimated EMI capacity available",
      availableEmiCapacityPercent: 0,
      capacityDetail: null,
      capacityNote: CAPACITY_INDICATOR_NOTE,
    };
  }

  const combinedMonthlyIncome = income + coIncome;
  const maximumPermittedObligations = combinedMonthlyIncome * (foir / 100);
  const estimatedAvailableEmi = Math.max(
    0,
    maximumPermittedObligations - obligations,
  );

  const estimatedEligibleLoan =
    calculatePrincipalFromEmi(estimatedAvailableEmi, rate, months) ?? 0;

  const estimatedPropertyBudget =
    down > 0 ? estimatedEligibleLoan + down : null;

  const existingObligationRatio =
    combinedMonthlyIncome > 0 ? (obligations / combinedMonthlyIncome) * 100 : 0;

  const totalObligationsIfFullyUsed = obligations + estimatedAvailableEmi;
  const estimatedFoirUsed =
    combinedMonthlyIncome > 0
      ? (totalObligationsIfFullyUsed / combinedMonthlyIncome) * 100
      : 0;

  const capacity = resolveCapacityStatus(
    estimatedAvailableEmi,
    maximumPermittedObligations,
  );

  return {
    valid: true,
    monthlyIncome: income,
    coApplicantMonthlyIncome: coIncome,
    existingMonthlyObligations: obligations,
    annualInterestRate: rate,
    tenureMonths: months,
    downPayment: down,
    combinedMonthlyIncome,
    maximumPermittedObligations,
    estimatedAvailableEmi,
    estimatedEligibleLoan,
    estimatedPropertyBudget,
    existingObligationRatio,
    estimatedFoirUsed,
    foirPercent: foir,
    assumptions,
    status: capacity.status,
    capacityLabel: capacity.label,
    availableEmiCapacityPercent: capacity.availableEmiCapacityPercent,
    capacityDetail: capacity.capacityDetail,
    capacityNote: CAPACITY_INDICATOR_NOTE,
  };
}

/**
 * Tenure comparison for a loan type using the same income / FOIR inputs.
 */
export function buildEligibilityTenureComparison({
  monthlyIncome,
  existingMonthlyObligations = 0,
  annualInterestRate,
  foirPercent = DEFAULT_FOIR_PERCENT,
  downPayment = 0,
  coApplicantMonthlyIncome = 0,
  loanTypeId,
} = {}) {
  const loanType = getLoanTypeById(loanTypeId);
  if (!loanType) {
    return { valid: false, options: [], highlights: null };
  }

  const options = loanType.comparisonTenures.map((tenureValue) => {
    const tenureMonths =
      loanType.tenureUnit === "months" ? tenureValue : tenureValue * 12;
    const eligibility = calculateLoanEligibility({
      monthlyIncome,
      existingMonthlyObligations,
      annualInterestRate,
      tenureMonths,
      foirPercent,
      downPayment,
      coApplicantMonthlyIncome,
    });

    const loanAmount = eligibility.estimatedEligibleLoan;
    const summary =
      loanAmount > 0
        ? buildEmiSummary(loanAmount, annualInterestRate, tenureMonths)
        : {
            monthlyEmi: eligibility.estimatedAvailableEmi,
            totalInterest: 0,
            totalRepayment: 0,
          };

    return {
      id: `${loanType.id}-${tenureValue}`,
      tenureValue,
      tenureUnit: loanType.tenureUnit,
      tenureLabel: formatTenureLabel(tenureValue, loanType.tenureUnit),
      tenureMonths,
      estimatedAvailableEmi: eligibility.estimatedAvailableEmi,
      estimatedEligibleLoan: loanAmount,
      estimatedTotalInterest: summary?.totalInterest ?? 0,
      estimatedTotalRepayment: summary?.totalRepayment ?? 0,
      isShortestTenure: false,
      isHighestEligibility: false,
      isLowestTotalInterest: false,
    };
  });

  if (!options.length || !Number.isFinite(Number(monthlyIncome)) || Number(monthlyIncome) <= 0) {
    return { valid: false, options: [], highlights: null, loanTypeId };
  }

  const shortest = options.reduce((min, item) =>
    item.tenureMonths < min.tenureMonths ? item : min,
  );
  const highestEligibility = options.reduce((max, item) =>
    item.estimatedEligibleLoan > max.estimatedEligibleLoan ? item : max,
  );

  const withLoan = options.filter((o) => o.estimatedEligibleLoan > 0);
  const lowestInterest =
    withLoan.length > 0
      ? withLoan.reduce((min, item) =>
          item.estimatedTotalInterest < min.estimatedTotalInterest ? item : min,
        )
      : null;

  const enriched = options.map((option) => ({
    ...option,
    isShortestTenure: option.id === shortest.id,
    isHighestEligibility: option.id === highestEligibility.id,
    isLowestTotalInterest: lowestInterest ? option.id === lowestInterest.id : false,
    markers: [
      option.id === highestEligibility.id ? "Highest calculated eligibility" : null,
      option.id === shortest.id ? "Shortest displayed tenure" : null,
      lowestInterest && option.id === lowestInterest.id
        ? "Lowest calculated total interest"
        : null,
    ].filter(Boolean),
  }));

  return {
    valid: true,
    loanTypeId,
    options: enriched,
    highlights: {
      highestEligibility: enriched.find((o) => o.isHighestEligibility) ?? null,
      shortestTenure: enriched.find((o) => o.isShortestTenure) ?? null,
      lowestTotalInterest: enriched.find((o) => o.isLowestTotalInterest) ?? null,
    },
  };
}

/**
 * Deterministic educational insights — no approval language.
 */
export function buildEligibilityInsights(result, { hasCoApplicant, hasDownPayment } = {}) {
  const statements = [];

  if (!result?.valid) {
    statements.push(
      "Enter a valid monthly income, illustrative rate and tenure to estimate borrowing capacity.",
    );
    return statements;
  }

  if (result.existingMonthlyObligations > 0) {
    statements.push(
      "Existing obligations reduce the EMI amount available for a new loan.",
    );
  } else {
    statements.push(
      "With no existing monthly obligations entered, more of the FOIR capacity may be available for a new EMI estimate.",
    );
  }

  statements.push(
    "A longer tenure may increase estimated eligibility but can increase total interest.",
  );

  if (hasCoApplicant || result.coApplicantMonthlyIncome > 0) {
    statements.push(
      "Adding verified co-applicant income may increase estimated borrowing capacity.",
    );
  } else {
    statements.push(
      "Including optional co-applicant income, when applicable, may change the estimated available EMI.",
    );
  }

  if (hasDownPayment || result.downPayment > 0) {
    statements.push(
      "A larger down payment may reduce the loan amount required for a purchase.",
    );
  } else {
    statements.push(
      "Entering an optional down payment can illustrate an estimated property or purchase budget.",
    );
  }

  if (result.estimatedAvailableEmi <= 0) {
    statements.push(
      "Entered obligations appear to use or exceed the selected FOIR capacity, so estimated available EMI is zero in this scenario.",
    );
  }

  statements.push(
    "Changing these inputs does not guarantee lender approval. Outcomes typically depend on credit assessment, documentation and lender policy.",
  );

  return statements;
}

/**
 * Round-trip helper for validators: EMI(principal) ↔ principal(EMI).
 */
export function verifyPrincipalEmiRoundTrip(principal, annualRate, months) {
  const emi = calculateEmiFromMonths(principal, annualRate, months);
  if (emi == null) return null;
  const recovered = calculatePrincipalFromEmi(emi, annualRate, months);
  return { emi, recovered };
}
