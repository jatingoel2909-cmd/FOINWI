/**
 * Validation for EMI prepayment engine.
 * Run: node scripts/validatePrepayment.js
 */

import { buildEmiSummary, calculateEmiFromMonths } from "../src/utils/emiFormula.js";
import {
  analyzeLumpSumPrepayment,
  analyzeMonthlyPrepayment,
  buildPrepaymentTimeline,
  getBaselineEmi,
  monthsToPayOff,
  simulateAmortization,
} from "../src/utils/prepaymentEngine.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function nearlyEqual(a, b, eps = 1) {
  return Math.abs(a - b) <= eps;
}

// --- Monthly prepayment ---
const monthly = analyzeMonthlyPrepayment({
  principal: 5000000,
  annualRate: 8.5,
  tenureMonths: 240,
  extraMonthly: 5000,
});
console.log("\n=== Monthly prepayment ₹50L @ 8.5% + ₹5,000 extra ===");
assert(monthly.valid, "Monthly prepayment should be valid");
console.log(
  `New payoff: ${monthly.newPayoffMonths} months | Saved: ${monthly.monthsSaved} months | Interest saved: ${formatCurrency(monthly.interestSaved)}`,
);
assert(monthly.newPayoffMonths < 240, "Extra payment should shorten tenure");
assert(monthly.interestSaved > 0, "Extra payment should save interest");
assert(
  monthly.totalRepaymentDifference > 0,
  "Total repayment should fall with prepayment",
);
assert(
  monthly.summaryStatements.some((s) => s.includes("save approximately")),
  "Summary should include educational interest-saved wording",
);

// --- Zero extra payment ---
const zeroExtra = analyzeMonthlyPrepayment({
  principal: 5000000,
  annualRate: 8.5,
  tenureMonths: 240,
  extraMonthly: 0,
});
console.log("\n=== Zero extra payment ===");
assert(zeroExtra.valid, "Zero extra should still be valid");
assert(zeroExtra.monthsSaved === 0, "Zero extra should not save months");
assert(
  nearlyEqual(zeroExtra.interestSaved, 0, 2),
  "Zero extra should not materially save interest",
);
assert(
  zeroExtra.newPayoffMonths === 240,
  "Zero extra payoff should match original tenure",
);

// --- Large extra payment ---
const largeExtra = analyzeMonthlyPrepayment({
  principal: 500000,
  annualRate: 12,
  tenureMonths: 60,
  extraMonthly: 100000,
});
console.log("\n=== Large extra payment ===");
assert(largeExtra.valid, "Large extra should be valid");
assert(largeExtra.newPayoffMonths < 12, "Large extra should pay off quickly");
assert(largeExtra.monthsSaved > 40, "Large extra should save many months");

// --- Lump-sum prepayment ---
const lump = analyzeLumpSumPrepayment({
  principal: 5000000,
  annualRate: 8.5,
  tenureMonths: 240,
  prepaymentAmount: 500000,
  afterYears: 2,
});
console.log("\n=== Lump-sum ₹5L after 2 years ===");
assert(lump.valid, "Lump-sum prepayment should be valid");
console.log(
  `Remaining principal: ${formatCurrency(lump.remainingPrincipal)} | New tenure after: ${lump.newTenureMonths} months | Interest saved: ${formatCurrency(lump.interestSaved)}`,
);
assert(lump.remainingPrincipal > 0, "Should leave some remaining principal");
assert(
  lump.remainingPrincipal < lump.remainingPrincipalBeforePrepayment,
  "Lump sum should reduce remaining principal",
);
assert(lump.monthsSaved > 0, "Lump sum should reduce overall tenure");
assert(lump.interestSaved > 0, "Lump sum should save interest");
assert(
  lump.remainingInterest >= 0 && lump.remainingInterest < lump.originalTotalInterest,
  "Remaining interest should be below original total interest",
);

// --- Invalid values ---
console.log("\n=== Invalid values ===");
assert(
  !analyzeMonthlyPrepayment({
    principal: -1,
    annualRate: 8.5,
    tenureMonths: 240,
    extraMonthly: 1000,
  }).valid,
  "Negative principal should be invalid",
);
assert(
  !analyzeMonthlyPrepayment({
    principal: 1000000,
    annualRate: -1,
    tenureMonths: 120,
    extraMonthly: 1000,
  }).valid,
  "Negative rate should be invalid",
);
assert(
  !analyzeLumpSumPrepayment({
    principal: 1000000,
    annualRate: 10,
    tenureMonths: 120,
    prepaymentAmount: 100000,
    afterYears: 20,
  }).valid,
  "Prepayment after loan end should be invalid",
);
assert(
  !analyzeMonthlyPrepayment({
    principal: 1000000,
    annualRate: 10,
    tenureMonths: 0,
    extraMonthly: 1000,
  }).valid,
  "Zero tenure should be invalid",
);

// --- Timeline ---
const timeline = buildPrepaymentTimeline({
  originalMonths: 240,
  newMonths: 180,
});
assert(timeline.monthsReduced === 60, "Timeline should report 60 months reduced");
assert(timeline.originalBarPercent === 100, "Longer bar should be 100%");
assert(timeline.newBarPercent === 75, "Shorter bar should be 75%");

// --- Formula reuse ---
console.log("\n=== Formula reuse ===");
const emiShared = calculateEmiFromMonths(5000000, 8.5, 240);
const emiEngine = getBaselineEmi(5000000, 8.5, 240);
const summary = buildEmiSummary(5000000, 8.5, 240);
assert(emiShared !== null && emiEngine !== null && summary !== null, "Baseline EMI required");
assert(
  Math.abs(emiShared - emiEngine) < 1e-9,
  "getBaselineEmi must match calculateEmiFromMonths",
);
assert(
  Math.abs(monthly.originalMonthlyEmi - summary.monthlyEmi) < 1e-9,
  "Monthly analysis must reuse shared EMI",
);
assert(
  Math.abs(lump.monthlyEmi - summary.monthlyEmi) < 1e-9,
  "Lump-sum analysis must reuse shared EMI",
);

const zeroRateMonths = monthsToPayOff(120000, 0, 10000);
assert(zeroRateMonths === 12, "Zero-rate payoff months should be principal/payment");

const zeroRateSim = simulateAmortization({
  principal: 120000,
  annualRate: 0,
  monthlyPayment: 10000,
});
assert(zeroRateSim?.paidOff && zeroRateSim.monthsPaid === 12, "Zero-rate sim should pay off in 12");

console.log("\nAll prepayment validations passed.");
