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
  },
  {
    id: "personal",
    label: "Personal Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5],
  },
  {
    id: "car",
    label: "Car Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: "two-wheeler",
    label: "Two-Wheeler Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5],
  },
  {
    id: "education",
    label: "Education Loan",
    tenureUnit: "years",
    comparisonTenures: [5, 7, 10, 12, 15],
  },
  {
    id: "lap",
    label: "Loan Against Property",
    tenureUnit: "years",
    comparisonTenures: [5, 10, 15, 20],
  },
  {
    id: "business",
    label: "Business Loan",
    tenureUnit: "years",
    comparisonTenures: [1, 2, 3, 4, 5, 7],
  },
  {
    id: "gold",
    label: "Gold Loan",
    tenureUnit: "months",
    comparisonTenures: [6, 12, 18, 24, 36],
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
