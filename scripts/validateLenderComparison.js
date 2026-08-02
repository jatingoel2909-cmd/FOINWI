/**
 * Validation for EMI lender comparison engine.
 * Run: node scripts/validateLenderComparison.js
 */

import { INDIAN_LENDERS } from "../src/data/lenders/indianLenders.js";
import { buildEmiSummary, calculateEmiFromMonths } from "../src/utils/emiFormula.js";
import {
  buildLenderComparisons,
  buildLenderSavingsSummary,
  filterLendersByLoanType,
  resolveIllustrativeRate,
} from "../src/utils/lenderComparisonEngine.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function printComparisons(label, result) {
  console.log(`\n=== ${label} ===`);
  if (!result.valid) {
    console.log("No valid comparisons");
    return;
  }
  result.comparisons.forEach((entry) => {
    console.log(
      `${entry.name.padEnd(28)} ${entry.annualRate.toFixed(2)}%  EMI ${formatCurrency(entry.monthlyEmi).padStart(14)}  Interest ${formatCurrency(entry.totalInterest).padStart(14)}`,
    );
  });
  const savings = buildLenderSavingsSummary(result);
  if (savings) console.log(`Insight: ${savings.statement}`);
}

// Dataset sanity
assert(INDIAN_LENDERS.length === 13, "Expected 13 starter lenders");
assert(
  INDIAN_LENDERS.every((l) => l.isDevelopmentPlaceholder === true),
  "All lenders must be marked development placeholders",
);

// A. Home Loan ₹50,00,000 / 20 years
const home = buildLenderComparisons({
  principal: 5000000,
  tenureMonths: 20 * 12,
  loanType: "home",
  lenders: INDIAN_LENDERS,
});
printComparisons("A. Home Loan ₹50L / 20 years", home);
assert(home.valid, "Home loan comparison should be valid");
assert(home.comparisons.length >= 5, "Home loan should compare multiple lenders");
assert(
  home.comparisons.every((c) => c.emiDifferenceFromLowest >= 0),
  "EMI differences should be relative to lowest-rate entry",
);
assert(
  home.lowestRateEntry.isLowestRate,
  "Lowest-rate entry should be flagged",
);

// B. Personal Loan ₹5,00,000 / 3 years
const personal = buildLenderComparisons({
  principal: 500000,
  tenureMonths: 3 * 12,
  loanType: "personal",
  lenders: INDIAN_LENDERS,
});
printComparisons("B. Personal Loan ₹5L / 3 years", personal);
assert(personal.valid, "Personal loan comparison should be valid");
assert(
  personal.comparisons.every((c) =>
    filterLendersByLoanType(INDIAN_LENDERS, "personal").some((l) => l.id === c.id),
  ),
  "Personal results should only include eligible lenders",
);

// C. Car Loan ₹10,00,000 / 5 years
const car = buildLenderComparisons({
  principal: 1000000,
  tenureMonths: 5 * 12,
  loanType: "car",
  lenders: INDIAN_LENDERS,
});
printComparisons("C. Car Loan ₹10L / 5 years", car);
assert(car.valid, "Car loan comparison should be valid");

// D. Gold Loan ₹2,00,000 / 24 months
const gold = buildLenderComparisons({
  principal: 200000,
  tenureMonths: 24,
  loanType: "gold",
  lenders: INDIAN_LENDERS,
});
printComparisons("D. Gold Loan ₹2L / 24 months", gold);
assert(gold.valid, "Gold loan comparison should be valid");
assert(
  gold.comparisons.every((c) => c.tenureMonths === 24),
  "Gold loan tenure must stay in months",
);
assert(
  !gold.comparisons.some((c) => c.id === "lic-housing" || c.id === "bajaj-housing"),
  "Housing specialists should not appear for gold",
);

// E. Equal rates
const equalLenders = [
  {
    id: "eq-a",
    name: "Equal A",
    lenderType: "Test",
    loanTypes: ["home"],
    illustrativeRates: { home: { min: 8.5, max: 8.5 } },
    processingStyle: "Hybrid",
  },
  {
    id: "eq-b",
    name: "Equal B",
    lenderType: "Test",
    loanTypes: ["home"],
    illustrativeRates: { home: { min: 8.5, max: 8.5 } },
    processingStyle: "Hybrid",
  },
];
const equal = buildLenderComparisons({
  principal: 1000000,
  tenureMonths: 120,
  loanType: "home",
  lenders: equalLenders,
});
assert(equal.valid, "Equal-rate case should be valid");
assert(
  equal.comparisons.every((c) => c.emiDifferenceFromLowest === 0),
  "Equal rates should produce zero EMI difference",
);
const equalSavings = buildLenderSavingsSummary(equal);
assert(equalSavings?.rateDiffPoints === 0, "Equal-rate savings should report 0 pp difference");

// F. Missing lender rate
const missing = buildLenderComparisons({
  principal: 1000000,
  tenureMonths: 120,
  loanType: "home",
  lenders: [
    {
      id: "ok",
      name: "Has Rate",
      lenderType: "Test",
      loanTypes: ["home"],
      illustrativeRates: { home: { min: 8, max: 9 } },
      processingStyle: "Hybrid",
    },
    {
      id: "missing",
      name: "No Rate",
      lenderType: "Test",
      loanTypes: ["home"],
      illustrativeRates: { home: { min: null, max: null } },
      processingStyle: "Hybrid",
    },
  ],
});
assert(missing.comparisons.length === 1, "Missing rates should be skipped");
assert(
  missing.skipped.some((s) => s.id === "missing" && s.reason === "missing-rate"),
  "Missing rate should be recorded in skipped",
);

// G. Empty lender list
const empty = buildLenderComparisons({
  principal: 1000000,
  tenureMonths: 120,
  loanType: "home",
  lenders: [],
});
assert(!empty.valid, "Empty lender list should be invalid");
assert(empty.comparisons.length === 0, "Empty lender list should yield no rows");

// H. Zero-interest case
const zero = buildLenderComparisons({
  principal: 120000,
  tenureMonths: 12,
  loanType: "personal",
  lenders: [
    {
      id: "zero",
      name: "Zero Interest",
      lenderType: "Test",
      loanTypes: ["personal"],
      illustrativeRates: { personal: { min: 0, max: 0 } },
      processingStyle: "Digital-first",
    },
  ],
});
assert(zero.valid, "Zero-interest case should calculate");
assert(
  Math.abs(zero.comparisons[0].monthlyEmi - 10000) < 0.01,
  "Zero-interest EMI should be principal / months",
);
assert(
  Math.abs(zero.comparisons[0].totalInterest) < 0.01,
  "Zero-interest total interest should be ~0",
);

// I. Formula reuse — engine output must match emiFormula helpers
const reuseLender = INDIAN_LENDERS.find((l) => l.id === "sbi");
const reuseRate = resolveIllustrativeRate(reuseLender.illustrativeRates.home);
const direct = buildEmiSummary(5000000, reuseRate, 240);
const fromEngine = home.comparisons.find((c) => c.id === "sbi");
assert(direct && fromEngine, "SBI home scenario should exist for formula check");
assert(
  Math.abs(direct.monthlyEmi - fromEngine.monthlyEmi) < 0.0001,
  "Engine EMI must match buildEmiSummary",
);
assert(
  Math.abs(direct.totalInterest - fromEngine.totalInterest) < 0.0001,
  "Engine interest must match buildEmiSummary",
);
const emiDirect = calculateEmiFromMonths(5000000, reuseRate, 240);
assert(
  Math.abs(emiDirect - fromEngine.monthlyEmi) < 0.0001,
  "Engine EMI must match calculateEmiFromMonths",
);

// Unsupported loan type filtering
const housingOnly = filterLendersByLoanType(INDIAN_LENDERS, "home");
assert(housingOnly.length === 13, "All starter lenders support home");
const twoWheeler = filterLendersByLoanType(INDIAN_LENDERS, "two-wheeler");
assert(twoWheeler.length < INDIAN_LENDERS.length, "Two-wheeler support is a subset");

console.log("\nAll lender comparison validations passed.");
