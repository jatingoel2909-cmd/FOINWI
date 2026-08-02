/**
 * Lightweight validation for EMI tenure comparison + storytelling helpers.
 * Run: node scripts/validateEmiComparison.js
 */

import { calculateEmi, calculateEmiFromMonths } from "../src/utils/emiFormula.js";
import {
  buildDecisionSummary,
  buildTenureComparison,
  scaleBarPercent,
} from "../src/utils/emiComparisonEngine.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function summarize(label, comparison) {
  console.log(`\n=== ${label} ===`);
  assert(comparison.valid, `${label} should be valid`);
  comparison.options.forEach((option) => {
    console.log(
      `${option.tenureLabel.padEnd(12)} EMI ${formatCurrency(option.monthlyEmi).padStart(14)}  Interest ${formatCurrency(option.totalInterest).padStart(14)}  Total ${formatCurrency(option.totalRepayment).padStart(14)}  [${option.badges.join(", ")}]`,
    );
  });
  console.log(`Balanced Option → ${comparison.highlights.balanced.tenureLabel}`);
  console.log("--- Decision summary ---");
  comparison.decisionSummary.statements.forEach((line) => console.log(`• ${line}`));
}

// A. Home Loan
const home = buildTenureComparison({
  principal: 5000000,
  annualRate: 8.5,
  loanTypeId: "home",
});
summarize("Home Loan ₹50L @ 8.5%", home);
assert(home.options.length === 6, "Home loan should have 6 tenures");
assert(
  home.highlights.lowestInterest.tenureValue === 5,
  "Lowest interest should be shortest home tenure",
);
assert(
  home.highlights.lowestEmi.tenureValue === 30,
  "Lowest EMI should be longest home tenure",
);
assert(
  home.decisionSummary.statements.length >= 4,
  "Home loan decision summary should include factual statements",
);
assert(
  home.decisionSummary.statements.some((line) => line.includes("15 years")),
  "Home summary should mention balanced 15-year trade-off",
);

// Visual scaling for Home Loan EMI bars
const homeEmiMax = Math.max(...home.options.map((o) => o.monthlyEmi));
assert(scaleBarPercent(homeEmiMax, homeEmiMax) === 100, "Max EMI bar should be 100%");
assert(
  scaleBarPercent(home.highlights.lowestEmi.monthlyEmi, homeEmiMax) < 100,
  "Lower EMI bar should be shorter than max",
);
assert(scaleBarPercent(0, homeEmiMax) === 0, "Zero value bar should be empty");
console.log("=== Home Loan visuals ✓ ===");

// B. Personal Loan
const personal = buildTenureComparison({
  principal: 500000,
  annualRate: 12,
  loanTypeId: "personal",
});
summarize("Personal Loan ₹5L @ 12%", personal);
assert(personal.options.length === 5, "Personal loan should have 5 tenures");
assert(
  personal.decisionSummary.statements.some((line) =>
    line.includes(personal.highlights.balanced.tenureLabel),
  ),
  "Personal summary should mention balanced tenure",
);
console.log("=== Personal Loan visuals ✓ ===");

// C. Car Loan
const car = buildTenureComparison({
  principal: 1000000,
  annualRate: 9,
  loanTypeId: "car",
});
summarize("Car Loan ₹10L @ 9%", car);
assert(car.options.length === 7, "Car loan should have 7 tenures");

// D. Gold Loan (months)
const gold = buildTenureComparison({
  principal: 200000,
  annualRate: 10,
  loanTypeId: "gold",
});
summarize("Gold Loan ₹2L @ 10%", gold);
assert(gold.options.length === 5, "Gold loan should have 5 month tenures");
assert(gold.options[0].tenureUnit === "months", "Gold tenures are months");
assert(
  Math.abs(gold.options[0].months - 6) < 0.001,
  "First gold tenure is 6 months",
);

// E. Zero interest
const zero = buildTenureComparison({
  principal: 120000,
  annualRate: 0,
  loanTypeId: "personal",
});
assert(zero.valid, "Zero interest should still compare");
assert(
  Math.abs(zero.options.find((o) => o.tenureValue === 1).monthlyEmi - 10000) < 0.01,
  "Zero-interest 1-year EMI should be principal/12",
);
assert(
  zero.options.every((o) => o.totalInterest < 0.01),
  "Zero interest means ~0 total interest",
);
const zeroInterestMax = Math.max(...zero.options.map((o) => o.totalInterest), 0);
assert(
  zero.options.every((o) => scaleBarPercent(o.totalInterest, zeroInterestMax) === 0),
  "Zero-interest bars stay empty when max interest is 0",
);
assert(
  zero.decisionSummary.statements.length > 0,
  "Zero-interest case still produces decision statements",
);
console.log("\n=== Zero interest ✓ ===");

// Near-equal bar scaling
assert(scaleBarPercent(100, 100) === 100, "Equal max values map to 100%");
assert(scaleBarPercent(50, 100) === 50, "Half value maps to 50%");
assert(scaleBarPercent(1, 100) === 4, "Tiny non-zero values keep a visible minimum width");
console.log("=== Equal / near-equal bar scaling ✓ ===");

// F. Invalid / empty comparison data
const invalid = buildTenureComparison({
  principal: 0,
  annualRate: 10,
  loanTypeId: "home",
});
assert(!invalid.valid && invalid.options.length === 0, "Invalid principal yields empty compare");
assert(
  invalid.decisionSummary.statements.length === 0,
  "Empty comparison has no decision statements",
);
assert(
  buildDecisionSummary(invalid).statements.length === 0,
  "buildDecisionSummary handles empty comparison",
);
assert(calculateEmi(null, 10, 5) === null, "Null principal returns null EMI");
assert(calculateEmiFromMonths(100000, 10, 0) === null, "Zero months returns null");
console.log("=== Invalid / empty inputs ✓ ===");

// Formula reuse sanity: year-based helper matches months helper
const fromYears = calculateEmi(1000000, 10, 5);
const fromMonths = calculateEmiFromMonths(1000000, 10, 60);
assert(Math.abs(fromYears - fromMonths) < 0.0001, "Year and month helpers must match");
console.log("=== Formula reuse ✓ ===");

console.log("\nAll EMI comparison validations passed.");
