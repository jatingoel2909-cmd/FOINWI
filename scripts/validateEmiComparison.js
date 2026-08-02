/**
 * Lightweight validation for EMI tenure comparison.
 * Run: node scripts/validateEmiComparison.js
 */

import { calculateEmi, calculateEmiFromMonths } from "../src/utils/emiFormula.js";
import { buildTenureComparison } from "../src/utils/emiComparisonEngine.js";
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
  console.log(
    `Balanced Option → ${comparison.highlights.balanced.tenureLabel}`,
  );
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

// B. Personal Loan
const personal = buildTenureComparison({
  principal: 500000,
  annualRate: 12,
  loanTypeId: "personal",
});
summarize("Personal Loan ₹5L @ 12%", personal);
assert(personal.options.length === 5, "Personal loan should have 5 tenures");

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
console.log("\n=== Zero interest ✓ ===");

// F. Invalid inputs
const invalid = buildTenureComparison({
  principal: 0,
  annualRate: 10,
  loanTypeId: "home",
});
assert(!invalid.valid && invalid.options.length === 0, "Invalid principal yields empty compare");
assert(calculateEmi(null, 10, 5) === null, "Null principal returns null EMI");
assert(calculateEmiFromMonths(100000, 10, 0) === null, "Zero months returns null");
console.log("=== Invalid / empty inputs ✓ ===");

// Formula reuse sanity: year-based helper matches months helper
const fromYears = calculateEmi(1000000, 10, 5);
const fromMonths = calculateEmiFromMonths(1000000, 10, 60);
assert(Math.abs(fromYears - fromMonths) < 0.0001, "Year and month helpers must match");
console.log("=== Formula reuse ✓ ===");

console.log("\nAll EMI comparison validations passed.");
