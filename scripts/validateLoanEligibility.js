/**
 * Validation for educational loan-eligibility engine.
 * Run: node scripts/validateLoanEligibility.js
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildEmiSummary,
  calculateEmiFromMonths,
  calculatePrincipalFromEmi,
} from "../src/utils/emiFormula.js";
import {
  buildEligibilityTenureComparison,
  calculateLoanEligibility,
  verifyPrincipalEmiRoundTrip,
} from "../src/utils/loanEligibilityEngine.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function nearlyEqual(a, b, eps = 1) {
  return Math.abs(a - b) <= eps;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// A. Salaried single applicant
const caseA = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
  downPayment: 0,
  coApplicantMonthlyIncome: 0,
});
console.log("\n=== A. Salaried single applicant ===");
assert(caseA.valid, "Case A should be valid");
assert(caseA.combinedMonthlyIncome === 100000, "Combined income should be 1L");
assert(caseA.maximumPermittedObligations === 50000, "Max obligations at 50% FOIR");
assert(caseA.estimatedAvailableEmi === 30000, "Available EMI should be 30k");
assert(caseA.estimatedEligibleLoan > 0, "Eligible loan should be positive");
assert(
  nearlyEqual(caseA.availableEmiCapacityPercent, 60, 0.01),
  "Case A available EMI capacity should be 60%",
);
assert(
  caseA.capacityLabel === "Most assumed EMI capacity available",
  "Case A should use factual most-capacity wording",
);
assert(
  caseA.capacityDetail.includes("60% of the assumed obligation capacity"),
  "Case A should state the calculated capacity percentage",
);
console.log(
  `Available EMI ${formatCurrency(caseA.estimatedAvailableEmi)} | Eligible loan ${formatCurrency(caseA.estimatedEligibleLoan)} | ${caseA.capacityLabel} | ${caseA.capacityDetail}`,
);

const expectedPrincipal = calculatePrincipalFromEmi(30000, 8.5, 240);
assert(
  nearlyEqual(caseA.estimatedEligibleLoan, expectedPrincipal, 1),
  "Eligible loan must match principal-from-EMI",
);

// B. Co-applicant income
const caseB = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
  coApplicantMonthlyIncome: 50000,
});
console.log("\n=== B. Co-applicant income ===");
assert(caseB.combinedMonthlyIncome === 150000, "Combined income should include co-applicant");
assert(
  caseB.estimatedAvailableEmi > caseA.estimatedAvailableEmi,
  "Co-applicant should increase available EMI",
);
assert(
  caseB.estimatedEligibleLoan > caseA.estimatedEligibleLoan,
  "Co-applicant should increase estimated loan",
);

// C. Zero existing obligations
const caseC = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 0,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
console.log("\n=== C. Zero obligations ===");
assert(caseC.estimatedAvailableEmi === 50000, "Full FOIR capacity should be available");
assert(caseC.estimatedEligibleLoan > caseA.estimatedEligibleLoan, "Zero obligations → higher loan");

// D. Obligations exceed FOIR capacity
const caseD = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 60000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
console.log("\n=== D. Obligations exceed FOIR ===");
assert(caseD.estimatedAvailableEmi === 0, "Available EMI should be zero");
assert(caseD.estimatedEligibleLoan === 0, "Eligible loan should be zero");
assert(caseD.status === "none", "Capacity status should be none when no EMI remains");
assert(
  caseD.capacityLabel === "No estimated EMI capacity available",
  "Case D should use no-capacity wording",
);
assert(caseD.availableEmiCapacityPercent === 0, "Case D capacity percent should be 0");

// E. Zero interest
const caseE = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 0,
  annualInterestRate: 0,
  tenureMonths: 12,
  foirPercent: 50,
});
console.log("\n=== E. Zero interest ===");
assert(caseE.valid, "Zero interest should be valid");
assert(
  nearlyEqual(caseE.estimatedEligibleLoan, caseE.estimatedAvailableEmi * 12, 1),
  "Zero-interest principal should be EMI × months",
);

// F. Zero / invalid income
const caseF = calculateLoanEligibility({
  monthlyIncome: 0,
  existingMonthlyObligations: 0,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
console.log("\n=== F. Invalid income ===");
assert(!caseF.valid, "Zero income should be invalid");
assert(caseF.status === "invalid", "Status should be invalid");

// G. Down-payment property budget
const caseG = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
  downPayment: 1000000,
});
console.log("\n=== G. Down-payment budget ===");
assert(caseG.estimatedPropertyBudget != null, "Budget should be present with down payment");
assert(
  nearlyEqual(
    caseG.estimatedPropertyBudget,
    caseG.estimatedEligibleLoan + 1000000,
    1,
  ),
  "Budget should be loan + down payment",
);

// H. Tenure comparison
const comparison = buildEligibilityTenureComparison({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  foirPercent: 50,
  loanTypeId: "home",
});
console.log("\n=== H. Tenure comparison ===");
assert(comparison.valid, "Comparison should be valid");
assert(comparison.options.length === 6, "Home loan should have 6 tenures");
assert(
  comparison.highlights.highestEligibility,
  "Should mark highest calculated eligibility",
);
assert(
  comparison.highlights.shortestTenure.tenureValue === 5,
  "Shortest home tenure should be 5 years",
);
assert(
  comparison.highlights.lowestTotalInterest,
  "Should mark lowest calculated total interest",
);
const longest = comparison.options.find((o) => o.tenureValue === 30);
const shortest = comparison.options.find((o) => o.tenureValue === 5);
assert(
  longest.estimatedEligibleLoan >= shortest.estimatedEligibleLoan,
  "Longer tenure typically yields higher or equal eligibility",
);

// I. Principal-from-EMI formula correctness
console.log("\n=== I. Formula correctness ===");
const roundTrip = verifyPrincipalEmiRoundTrip(3456789, 8.5, 240);
assert(roundTrip, "Round-trip should succeed");
assert(
  nearlyEqual(roundTrip.recovered, 3456789, 1),
  "Recovered principal should match original",
);
const emiCheck = calculateEmiFromMonths(caseA.estimatedEligibleLoan, 8.5, 240);
assert(
  nearlyEqual(emiCheck, caseA.estimatedAvailableEmi, 1),
  "EMI of eligible loan should match available EMI",
);
const summary = buildEmiSummary(caseA.estimatedEligibleLoan, 8.5, 240);
assert(summary, "Summary for eligible loan required");
assert(
  nearlyEqual(summary.monthlyEmi, caseA.estimatedAvailableEmi, 1),
  "buildEmiSummary must align with eligibility EMI",
);

// J. Trust wording scan (public eligibility UI)
console.log("\n=== J. Trust wording scan ===");
const uiFiles = [
  "src/components/emi/LoanEligibilityCalculator.jsx",
  "src/components/emi/LoanEligibilitySummary.jsx",
  "src/components/emi/LoanEligibilityComparison.jsx",
  "src/components/emi/LoanEligibilityInsights.jsx",
  "src/utils/loanEligibilityEngine.js",
];
const forbidden = [
  /\bapproved\b/i,
  /\bguaranteed\b/i,
  /\bsanctioned\b/i,
  /best bank/i,
  /official approval/i,
  /limited estimated capacity/i,
  /moderate estimated capacity/i,
  /higher estimated capacity/i,
  /low(?:er)? borrowing capacity/i,
  /moderate borrowing capacity/i,
  /high(?:er)? borrowing capacity/i,
];
for (const rel of uiFiles) {
  const text = readFileSync(join(root, rel), "utf8");
  for (const pattern of forbidden) {
    assert(!pattern.test(text), `${rel} must not contain ${pattern}`);
  }
}
assert(
  !/\bbest\b/i.test(
    readFileSync(join(root, "src/components/emi/LoanEligibilityComparison.jsx"), "utf8"),
  ),
  "Comparison UI must not label any option best",
);

console.log("\nAll loan eligibility validations passed.");
