/**
 * Validation for amortization schedule engine.
 * Run: node scripts/validateAmortization.js
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { calculateEmiFromMonths } from "../src/utils/emiFormula.js";
import {
  amortizationToCsv,
  buildAmortizationSchedule,
  buildYearlySummary,
  countCsvDataRows,
  yearlySummaryToCsv,
} from "../src/utils/amortizationEngine.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function nearlyEqual(a, b, eps = 2) {
  return Math.abs(a - b) <= eps;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function printSample(label, schedule) {
  console.log(`\n=== ${label} ===`);
  assert(schedule.valid, `${label} should be valid`);
  const first = schedule.rows[0];
  const last = schedule.rows[schedule.rows.length - 1];
  console.log(
    `Rows ${schedule.rows.length} | EMI ~ ${formatCurrency(schedule.emi)} | Interest ${formatCurrency(schedule.totals.totalInterest)}`,
  );
  console.log(
    `First: M${first.month} int ${formatCurrency(first.interest)} prin ${formatCurrency(first.principal)} bal ${formatCurrency(first.remainingBalance)}`,
  );
  console.log(
    `Last:  M${last.month} int ${formatCurrency(last.interest)} prin ${formatCurrency(last.principal)} bal ${formatCurrency(last.remainingBalance)}`,
  );
}

// A. 1-year loan
const oneYear = buildAmortizationSchedule({
  principal: 120000,
  annualInterestRate: 12,
  tenureMonths: 12,
});
printSample("A. 1-year loan", oneYear);
assert(oneYear.rows.length === 12, "1-year loan should have 12 months");
assert(oneYear.rows.every((r) => r.year === 1), "All months should be year 1");

// B. 30-year loan
const thirtyYear = buildAmortizationSchedule({
  principal: 5000000,
  annualInterestRate: 8.5,
  tenureMonths: 360,
});
printSample("B. 30-year loan", thirtyYear);
assert(thirtyYear.rows.length === 360, "30-year loan should have 360 months");
assert(thirtyYear.rows[359].year === 30, "Final year should be 30");
const yearly30 = buildYearlySummary(thirtyYear);
assert(yearly30.length === 30, "Yearly summary should have 30 rows");

// C. Zero interest
const zeroRate = buildAmortizationSchedule({
  principal: 120000,
  annualInterestRate: 0,
  tenureMonths: 12,
});
printSample("C. Zero interest", zeroRate);
assert(
  zeroRate.rows.every((r) => nearlyEqual(r.interest, 0, 0.01)),
  "Zero interest rows should have ~0 interest",
);
assert(nearlyEqual(zeroRate.totals.totalInterest, 0, 0.01), "Zero total interest");
assert(nearlyEqual(zeroRate.emi, 10000, 0.01), "Zero-rate EMI should be principal/months");

// D. High interest
const highRate = buildAmortizationSchedule({
  principal: 500000,
  annualInterestRate: 18,
  tenureMonths: 60,
});
printSample("D. High interest", highRate);
assert(highRate.valid, "High interest schedule should be valid");
assert(
  highRate.totals.totalInterest > highRate.totals.totalPrincipal * 0.2,
  "High rate should produce substantial interest",
);

// E. Tiny loan
const tiny = buildAmortizationSchedule({
  principal: 1000,
  annualInterestRate: 10,
  tenureMonths: 6,
});
printSample("E. Tiny loan", tiny);
assert(tiny.rows.length === 6, "Tiny loan should amortize in 6 months");

// F. Large loan
const large = buildAmortizationSchedule({
  principal: 10000000,
  annualInterestRate: 9,
  tenureMonths: 240,
});
printSample("F. Large loan", large);
assert(large.rows.length === 240, "Large loan should have 240 months");

// G. Totals reconcile
console.log("\n=== G. Totals reconcile ===");
const sharedEmi = calculateEmiFromMonths(5000000, 8.5, 240);
const mid = buildAmortizationSchedule({
  principal: 5000000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  emi: sharedEmi,
});
assert(mid.valid, "Mid-tenure schedule should be valid");
assert(
  nearlyEqual(mid.totals.totalPrincipal, 5000000, 5),
  "Total principal paid should match loan amount",
);
assert(
  nearlyEqual(
    mid.totals.totalRepayment,
    mid.totals.totalPrincipal + mid.totals.totalInterest,
    5,
  ),
  "Repayment should equal principal + interest",
);
assert(
  nearlyEqual(mid.emi, sharedEmi, 0.05),
  "Schedule EMI must reuse shared calculateEmiFromMonths",
);

// H. Remaining balance ends at zero
console.log("\n=== H. Remaining balance ends at zero ===");
[
  oneYear,
  thirtyYear,
  zeroRate,
  highRate,
  tiny,
  large,
  mid,
].forEach((schedule, index) => {
  const last = schedule.rows[schedule.rows.length - 1];
  assert(
    nearlyEqual(last.remainingBalance, 0, 1),
    `Case index ${index} final balance should be ~0`,
  );
  assert(
    nearlyEqual(schedule.remainingBalance, 0, 1),
    `Case index ${index} schedule remainingBalance should be ~0`,
  );
});

// I. CSV generation remains available; public download is disabled
console.log("\n=== I. CSV generation + public download disabled ===");
const csv = amortizationToCsv(mid);
assert(countCsvDataRows(csv) === mid.rows.length, "CSV data rows must match schedule length");
const yearlyCsv = yearlySummaryToCsv(buildYearlySummary(mid));
assert(
  countCsvDataRows(yearlyCsv) === buildYearlySummary(mid).length,
  "Yearly CSV rows must match yearly summary length",
);
assert(csv.startsWith("Month,Year,EMI,Interest,Principal,Remaining Balance"), "CSV header");

const scheduleUi = readFileSync(
  join(root, "src/components/emi/AmortizationSchedule.jsx"),
  "utf8",
);
assert(
  /Download CSV — Coming Soon/.test(scheduleUi),
  "Public UI must show Coming Soon CSV button text",
);
assert(
  /disabled\s*\n\s*aria-disabled="true"/.test(scheduleUi) ||
    /disabled\s+aria-disabled="true"/.test(scheduleUi) ||
    (scheduleUi.includes("disabled") && scheduleUi.includes('aria-disabled="true"')),
  "CSV button must be disabled with aria-disabled",
);
assert(
  !/onClick=\{handleDownloadCsv\}/.test(scheduleUi),
  "Public CSV button must not wire a download onClick handler",
);
assert(
  !/function downloadCsv/.test(scheduleUi) && !/URL\.createObjectURL/.test(scheduleUi),
  "Public amortization UI must not include active browser download glue",
);
assert(
  scheduleUi.includes(
    "CSV export will be available as an optional premium feature in a future release.",
  ),
  "Helper text for future premium CSV export must be present",
);
assert(
  typeof amortizationToCsv === "function" && typeof yearlySummaryToCsv === "function",
  "CSV generation helpers must remain available in the engine",
);

// J. Trust wording scan
console.log("\n=== J. Trust wording scan ===");
const uiFiles = [
  "src/utils/amortizationEngine.js",
  "src/components/emi/AmortizationSchedule.jsx",
  "src/components/emi/AmortizationSummary.jsx",
  "src/components/emi/AmortizationYearView.jsx",
];
const forbidden = [
  /\bapproved\b/i,
  /\bguaranteed\b/i,
  /\bsanctioned\b/i,
  /best bank/i,
  /official approval/i,
];
for (const rel of uiFiles) {
  const text = readFileSync(join(root, rel), "utf8");
  for (const pattern of forbidden) {
    assert(!pattern.test(text), `${rel} must not contain ${pattern}`);
  }
}

console.log("\nAll amortization validations passed.");
