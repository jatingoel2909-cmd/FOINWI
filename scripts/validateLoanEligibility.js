/* global process */
/**
 * Validates the production home-loan eligibility implementation.
 * Run: npm run validate:loan-eligibility
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
  DEFAULT_FOIR_PERCENT,
  FOIR_MAX,
  FOIR_MIN,
  LTV_LIMITATION_NOTE,
  buildEligibilityTenureComparison,
  calculateLoanEligibility,
  verifyPrincipalEmiRoundTrip,
} from "../src/utils/loanEligibilityEngine.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function nearlyEqual(a, b, eps = 1) {
  return Math.abs(a - b) <= eps;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function readSource(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function sliceBlock(source, startKey, endKey) {
  const start = source.indexOf(startKey);
  const end = source.indexOf(endKey, start + startKey.length);
  assert(start >= 0, `Missing block ${startKey}`);
  return start >= 0 ? source.slice(start, end >= 0 ? end : undefined) : "";
}

// ---------------------------------------------------------------------------
// Production-surface wiring
// ---------------------------------------------------------------------------
const publicComponent = readSource("src/components/HomeLoanEligibilityCalculator.jsx");
const engineSource = readSource("src/utils/loanEligibilityEngine.js");
const emiCalculator = readSource("src/components/emi/LoanEligibilityCalculator.jsx");
const emiSummary = readSource("src/components/emi/LoanEligibilitySummary.jsx");
const emiComparison = readSource("src/components/emi/LoanEligibilityComparison.jsx");
const centralValidator = readSource("scripts/validateAllCalculators.js");
const packageJson = readSource("package.json");
const insightsSource = readSource("src/data/calculatorInsights.js");
const explainsSource = readSource("src/data/calculatorExplains.js");
const calculatorsSource = readSource("src/data/calculators.js");
const journeysSource = readSource("src/data/journeys.js");
const recommendationSource = readSource("src/intelligence/recommendation/recommendationRules.js");

const homeInsights = sliceBlock(
  insightsSource,
  '"/home-loan-eligibility-calculator": {',
  '"/loan-prepayment-calculator": {',
);
const homeExplains = sliceBlock(
  explainsSource,
  '"/home-loan-eligibility-calculator": {',
  '"/loan-prepayment-calculator": {',
);

assert(
  publicComponent.includes("calculateLoanEligibility"),
  "Public calculator must call the production eligibility engine",
);
assert(
  !/const\s+FOIR\s*=\s*0\.5/.test(publicComponent),
  "Public calculator must not hide a fixed 50% FOIR constant",
);
assert(
  !/function\s+loanFromEmi/.test(publicComponent),
  "Public calculator must not keep a local inverse-EMI function",
);
assert(
  publicComponent.includes("DEFAULT_FOIR_PERCENT") &&
    publicComponent.includes("affordabilityRatio"),
  "Public calculator must expose the same editable affordability-ratio source as the engine",
);
assert(
  emiCalculator.includes("calculateLoanEligibility"),
  "EMI accordion must use the same production eligibility engine",
);
assert(
  centralValidator.includes("calculateLoanEligibility"),
  "Central validator must import the production eligibility engine",
);
assert(
  packageJson.includes("validate:loan-eligibility"),
  "package.json must expose validate:loan-eligibility",
);
assert(DEFAULT_FOIR_PERCENT === 50, "Default affordability ratio remains 50%");
assert(FOIR_MIN === 20 && FOIR_MAX === 70, "Affordability-ratio limits remain 20–70");

// ---------------------------------------------------------------------------
// Required public default + affordability cases
// ---------------------------------------------------------------------------
const publicDefault = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
assert(publicDefault.valid, "Public default vector must be valid");
assert(publicDefault.estimatedAvailableEmi === 40000, "Public default available EMI must be ₹40,000");
assert(
  nearlyEqual(
    publicDefault.estimatedEligibleLoan,
    calculatePrincipalFromEmi(40000, 8.5, 240),
    1,
  ),
  "Public default loan must match inverse-EMI of ₹40,000",
);
assert(publicDefault.estimatedEligibleLoan > 0, "Public default loan must be positive");
assert(publicDefault.estimatedEligibleLoan >= 0, "Public default loan must not be negative");

const noEmi = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 0,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
assert(noEmi.estimatedAvailableEmi === 50000, "No-EMI case must use full 50% capacity");
assert(noEmi.estimatedEligibleLoan > publicDefault.estimatedEligibleLoan, "No EMI should raise the loan estimate");

const existingEmi = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
assert(existingEmi.estimatedAvailableEmi === 30000, "Existing EMI of ₹20,000 must leave ₹30,000");
assert(existingEmi.estimatedEligibleLoan < publicDefault.estimatedEligibleLoan, "Existing EMI should lower the loan estimate");

const zeroAffordability = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 50000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
assert(zeroAffordability.estimatedAvailableEmi === 0, "Available EMI = 0 must stay 0");
assert(zeroAffordability.estimatedEligibleLoan === 0, "Available EMI = 0 must yield a 0 loan");

const negativeBeforeClamp = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 80000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
assert(
  100000 * 0.5 - 80000 < 0,
  "Negative-before-clamp fixture must be negative before Math.max",
);
assert(negativeBeforeClamp.estimatedAvailableEmi === 0, "Negative available EMI must clamp to 0");
assert(negativeBeforeClamp.estimatedEligibleLoan === 0, "Negative available EMI must not produce a negative loan");

const highTenure = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 8.5,
  tenureMonths: 360,
  foirPercent: 50,
});
const shortTenure = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 8.5,
  tenureMonths: 12,
  foirPercent: 50,
});
assert(highTenure.estimatedAvailableEmi === 40000, "Tenure must not change available EMI");
assert(shortTenure.estimatedAvailableEmi === 40000, "Short tenure must keep the same available EMI");
assert(
  highTenure.estimatedEligibleLoan > shortTenure.estimatedEligibleLoan,
  "Longer tenure should increase the illustrated loan at the same EMI",
);

const lowRate = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 6,
  tenureMonths: 240,
  foirPercent: 50,
});
const highRate = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 15,
  tenureMonths: 240,
  foirPercent: 50,
});
assert(
  lowRate.estimatedEligibleLoan > publicDefault.estimatedEligibleLoan,
  "Lower rate should raise the illustrated loan",
);
assert(
  highRate.estimatedEligibleLoan < publicDefault.estimatedEligibleLoan,
  "Higher rate should lower the illustrated loan",
);

const zeroRate = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 0,
  annualInterestRate: 0,
  tenureMonths: 12,
  foirPercent: 50,
});
assert(zeroRate.valid, "Zero interest remains supported by the engine");
assert(
  nearlyEqual(zeroRate.estimatedEligibleLoan, zeroRate.estimatedAvailableEmi * 12, 1),
  "Zero-interest principal should be EMI × months",
);

assert(
  publicDefault.maximumPermittedObligations === 100000 * (DEFAULT_FOIR_PERCENT / 100),
  "50% default must keep income × 0.5 identity",
);
assert(
  publicDefault.estimatedAvailableEmi ===
    100000 * (DEFAULT_FOIR_PERCENT / 100) - 10000,
  "50% default available EMI must be income × 0.5 − existing EMI",
);

const foir40 = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 40,
});
const foir60 = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 60,
});
assert(foir40.foirPercent === 40 && foir40.estimatedAvailableEmi === 30000, "Editable 40% ratio must apply");
assert(foir60.foirPercent === 60 && foir60.estimatedAvailableEmi === 50000, "Editable 60% ratio must apply");
assert(
  foir60.estimatedEligibleLoan > publicDefault.estimatedEligibleLoan &&
    publicDefault.estimatedEligibleLoan > foir40.estimatedEligibleLoan,
  "Higher affordability ratio should raise the illustrated loan",
);

const clampedLow = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 0,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 10,
});
const clampedHigh = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 0,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 90,
});
assert(clampedLow.foirPercent === FOIR_MIN, "Affordability ratio below 20% must clamp to 20%");
assert(clampedHigh.foirPercent === FOIR_MAX, "Affordability ratio above 70% must clamp to 70%");

[
  publicDefault,
  noEmi,
  existingEmi,
  zeroAffordability,
  negativeBeforeClamp,
  highTenure,
  shortTenure,
  lowRate,
  highRate,
  zeroRate,
  foir40,
  foir60,
].forEach((result, index) => {
  assert(result.estimatedEligibleLoan >= 0, `Case ${index} must not return a negative loan`);
});

// ---------------------------------------------------------------------------
// Existing engine regression cases
// ---------------------------------------------------------------------------
const caseA = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
assert(caseA.valid, "Case A should be valid");
assert(caseA.combinedMonthlyIncome === 100000, "Combined income should be 1L");
assert(caseA.maximumPermittedObligations === 50000, "Max obligations at 50% ratio");
assert(caseA.estimatedAvailableEmi === 30000, "Available EMI should be 30k");
assert(nearlyEqual(caseA.availableEmiCapacityPercent, 60, 0.01), "Case A capacity should be 60%");
assert(
  caseA.capacityLabel === "Most assumed EMI capacity available",
  "Case A should use factual most-capacity wording",
);

const caseB = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
  coApplicantMonthlyIncome: 50000,
});
assert(caseB.combinedMonthlyIncome === 150000, "Combined income should include co-applicant");
assert(caseB.estimatedAvailableEmi > caseA.estimatedAvailableEmi, "Co-applicant should increase available EMI");

const caseG = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
  downPayment: 1000000,
});
assert(
  nearlyEqual(caseG.estimatedPropertyBudget, caseG.estimatedEligibleLoan + 1000000, 1),
  "Budget should be loan + down payment",
);

const comparison = buildEligibilityTenureComparison({
  monthlyIncome: 100000,
  existingMonthlyObligations: 20000,
  annualInterestRate: 8.5,
  foirPercent: 50,
  loanTypeId: "home",
});
assert(comparison.valid, "Comparison should be valid");
assert(comparison.options.length === 6, "Home loan should have 6 tenures");

const roundTrip = verifyPrincipalEmiRoundTrip(3456789, 8.5, 240);
assert(roundTrip, "Round-trip should succeed");
assert(nearlyEqual(roundTrip.recovered, 3456789, 1), "Recovered principal should match original");
const emiCheck = calculateEmiFromMonths(caseA.estimatedEligibleLoan, 8.5, 240);
assert(nearlyEqual(emiCheck, caseA.estimatedAvailableEmi, 1), "EMI of illustrated loan should match available EMI");
const summary = buildEmiSummary(caseA.estimatedEligibleLoan, 8.5, 240);
assert(nearlyEqual(summary.monthlyEmi, caseA.estimatedAvailableEmi, 1), "buildEmiSummary must align with eligibility EMI");

assert(!calculateLoanEligibility({
  monthlyIncome: 0,
  existingMonthlyObligations: 0,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
}).valid, "Zero income should be invalid");

// ---------------------------------------------------------------------------
// Trust / limitation copy
// ---------------------------------------------------------------------------
const publicCopy = [
  publicComponent,
  engineSource,
  emiCalculator,
  emiSummary,
  emiComparison,
  homeInsights,
  homeExplains,
  calculatorsSource,
  journeysSource,
  recommendationSource,
].join("\n");

const forbiddenClaims = [
  /\bEligible Loan\b/,
  /\byou qualify for\b/i,
  /\bsanctioned amount\b/i,
  /\bbank will give\b/i,
  /\bmaximum loan you can get\b/i,
  /\bapproved amount\b/i,
  /\bcommon guideline\b/i,
  /\buniversal lender\b/i,
  /\bRBI (prescribes|requires|mandates)\b/i,
  /\bis an RBI\b/i,
  /\bas an RBI\b/i,
];
for (const pattern of forbiddenClaims) {
  assert(!pattern.test(publicCopy), `Related copy must not contain ${pattern}`);
}

const uiFiles = [
  ["src/components/HomeLoanEligibilityCalculator.jsx", publicComponent],
  ["src/components/emi/LoanEligibilityCalculator.jsx", emiCalculator],
  ["src/components/emi/LoanEligibilitySummary.jsx", emiSummary],
  ["src/components/emi/LoanEligibilityComparison.jsx", emiComparison],
  ["src/utils/loanEligibilityEngine.js", engineSource],
];
const uiForbidden = [
  /\bapproved\b/i,
  /\bguaranteed\b/i,
  /\bsanctioned\b/i,
  /best bank/i,
  /official approval/i,
];
for (const [rel, text] of uiFiles) {
  for (const pattern of uiForbidden) {
    assert(!pattern.test(text), `${rel} must not contain ${pattern}`);
  }
}

assert(
  publicComponent.includes("PRIMARY_LOAN_LABEL"),
  "Public results must use illustrative loan amount",
);
assert(
  publicComponent.includes("FOIR_HELPER_TEXT"),
  "Public calculator must show the illustrative-ratio helper",
);
assert(
  publicComponent.includes("ELIGIBILITY_LIMITATION_NOTE"),
  "Public results must include the eligibility limitation",
);
assert(
  publicComponent.includes("LTV_LIMITATION_NOTE"),
  "Public results must include the LTV limitation",
);
assert(
  publicComponent.includes("ZERO_AFFORDABILITY_NOTE"),
  "Public calculator must explain zero affordability",
);
assert(
  publicComponent.includes("AFFORDABILITY_RATIO_LABEL"),
  "Public calculator must label the ratio as illustrative",
);
assert(
  emiCalculator.includes("FOIR_HELPER_TEXT"),
  "EMI accordion must use the same FOIR helper",
);
assert(
  emiCalculator.includes("LTV_LIMITATION_NOTE"),
  "EMI accordion must disclose that LTV is not modelled",
);
assert(
  emiSummary.includes("Illustrative loan amount") || emiSummary.includes("PRIMARY_LOAN_LABEL"),
  "EMI summary must use illustrative loan amount",
);
assert(homeInsights.includes(LTV_LIMITATION_NOTE) || homeInsights.includes("loan-to-value"), "Insights must disclose LTV is not modelled");
assert(
  /illustrative affordability ratio/i.test(homeExplains) &&
    /illustrative affordability ratio/i.test(homeInsights),
  "Explains and insights must treat 50% as an illustrative ratio",
);
assert(!/\bbest\b/i.test(emiComparison), "Comparison UI must not label any option best");

if (failures.length) {
  console.error(`Loan eligibility validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Loan eligibility validation passed: ${checks} checks.`);
console.log(
  `Public default: available EMI ${formatCurrency(publicDefault.estimatedAvailableEmi)} | illustrative loan ${formatCurrency(publicDefault.estimatedEligibleLoan)}`,
);
