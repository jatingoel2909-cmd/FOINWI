/**
 * EMI loan types and sensible comparison tenures.
 * Gold Loan uses months; all other types use years.
 */

export const LOAN_TYPES = [
  {
    id: "home",
    label: "Home Loan",
    tenureUnit: "years",
    comparisonTenures: [5, 10, 15, 20, 25, 30],
    defaultRate: 8.5,
    illustrativeMinRate: 8.0,
    illustrativeMaxRate: 10.0,
    rateGuidance:
      "Home loan illustrative ranges often sit lower than unsecured credit, but final offers depend on profile and property.",
  },
  {
    id: "personal",
    label: "Personal Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5],
    defaultRate: 12,
    illustrativeMinRate: 10.5,
    illustrativeMaxRate: 18.0,
    rateGuidance:
      "Personal loan rates are typically higher than secured loans and vary widely by credit profile.",
  },
  {
    id: "car",
    label: "Car Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5, 6, 7],
    defaultRate: 9,
    illustrativeMinRate: 8.5,
    illustrativeMaxRate: 12.0,
    rateGuidance:
      "Car loan rates depend on vehicle type, down payment, tenure and lender policies.",
  },
  {
    id: "two-wheeler",
    label: "Two-Wheeler Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5],
    defaultRate: 11,
    illustrativeMinRate: 10.0,
    illustrativeMaxRate: 16.0,
    rateGuidance:
      "Two-wheeler loans are usually short-tenure products with lender-specific pricing bands.",
  },
  {
    id: "education",
    label: "Education Loan",
    tenureUnit: "years",
    comparisonTenures: [5, 7, 10, 12, 15],
    defaultRate: 10,
    illustrativeMinRate: 8.5,
    illustrativeMaxRate: 13.5,
    rateGuidance:
      "Education loan pricing can vary by course, institute, co-borrower and collateral.",
  },
  {
    id: "lap",
    label: "Loan Against Property",
    tenureUnit: "years",
    comparisonTenures: [5, 10, 15, 20],
    defaultRate: 11,
    illustrativeMinRate: 9.5,
    illustrativeMaxRate: 13.5,
    rateGuidance:
      "Loan Against Property rates depend on property type, LTV and borrower profile.",
  },
  {
    id: "business",
    label: "Business Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5, 7],
    defaultRate: 14,
    illustrativeMinRate: 11.0,
    illustrativeMaxRate: 20.0,
    rateGuidance:
      "Business loan rates vary substantially by entity type, cash flows and security.",
  },
  {
    id: "gold",
    label: "Gold Loan",
    tenureUnit: "months",
    comparisonTenures: [6, 12, 18, 24, 36],
    defaultRate: 10.5,
    illustrativeMinRate: 9.0,
    illustrativeMaxRate: 14.0,
    rateGuidance:
      "Gold loan rates and tenures are often shorter and may be quoted with different fee structures.",
  },
];

export const DEFAULT_LOAN_TYPE_ID = "home";

export function getLoanTypeById(id) {
  return LOAN_TYPES.find((type) => type.id === id) ?? null;
}

export function formatTenureLabel(value, unit) {
  if (unit === "months") {
    return `${value} ${value === 1 ? "month" : "months"}`;
  }
  return `${value} ${value === 1 ? "year" : "years"}`;
}
