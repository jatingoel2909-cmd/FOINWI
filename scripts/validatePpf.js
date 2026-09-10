/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  calculatePpfEstimate,
  normalizeAnnualContribution,
  normalizeContributionYears,
  normalizeIllustrativeRate,
  projectPpfBalance,
} from "../src/utils/ppf/ppfEngine.js";
import {
  PPF_CONTRIBUTION_LABEL,
  PPF_CONTRIBUTION_STEP,
  PPF_DEPOSIT_TIMING_NOTE,
  PPF_EXTENSION_NOTE,
  PPF_ILLUSTRATIVE_INTEREST_RATE,
  PPF_ILLUSTRATIVE_RATE_PERIOD,
  PPF_INPUT_LIMITS,
  PPF_INTEREST_HELPER_NOTE,
  PPF_INTEREST_INPUT_LABEL,
  PPF_INTEREST_METHOD_NOTE,
  PPF_LEGAL_FRAMEWORK,
  PPF_LIMIT_AGGREGATION_NOTE,
  PPF_MATURITY_DISCLOSURE,
  PPF_MAX_ANNUAL_CONTRIBUTION,
  PPF_MIN_ANNUAL_CONTRIBUTION,
  PPF_PRIMARY_RESULT_LABEL,
  PPF_PROJECTION_METHOD_NOTE,
  PPF_SCOPE_LIMITATIONS_NOTE,
  PPF_SCOPE_NOTE,
  PPF_STANDARD_CONTRIBUTION_YEARS,
  PPF_TAX_NOTE,
  PPF_YEARS_HELPER_NOTE,
  PPF_YEARS_LABEL,
} from "../src/utils/ppf/ppfRules.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function nearlyEqual(left, right, tolerance = 1e-9) {
  return Math.abs(left - right) <= tolerance;
}

function roundedBalance(result) {
  return Math.round(result.estimatedBalance);
}

assert(PPF_LEGAL_FRAMEWORK === "Public Provident Fund Scheme, 2019", "Legal framework must be Public Provident Fund Scheme, 2019");
assert(PPF_MIN_ANNUAL_CONTRIBUTION === 500, "Minimum annual contribution must be ₹500");
assert(PPF_MAX_ANNUAL_CONTRIBUTION === 150000, "Maximum annual contribution must be ₹1,50,000");
assert(PPF_CONTRIBUTION_STEP === 50, "Contribution step must be ₹50");
assert(PPF_ILLUSTRATIVE_INTEREST_RATE === 7.1, "Default illustrative rate must be 7.1");
assert(PPF_ILLUSTRATIVE_RATE_PERIOD === "1 July–30 September 2026", "Rate period must be 1 July–30 September 2026");
assert(PPF_STANDARD_CONTRIBUTION_YEARS === 15, "Standard contribution years must be 15");
assert(PPF_CONTRIBUTION_LABEL === "Annual contribution", "Contribution label must be Annual contribution");
assert(PPF_YEARS_LABEL === "Contribution years", "Years label must be Contribution years");
assert(PPF_INTEREST_INPUT_LABEL === "Illustrative interest rate assumption", "Rate label must be illustrative");
assert(PPF_PRIMARY_RESULT_LABEL === "Estimated PPF balance", "Primary result must be Estimated PPF balance");
assert(PPF_INPUT_LIMITS.annualContribution.step === 50, "UI contribution step must be ₹50");
assert(PPF_SCOPE_NOTE.includes("on or before 5 April"), "Scope must state the 5 April deposit-timing assumption");
assert(PPF_SCOPE_NOTE.includes("not an official PPF passbook"), "Scope must say this is not an official passbook");
assert(PPF_INTEREST_HELPER_NOTE.includes("1 July–30 September 2026"), "Rate helper must identify Jul–Sep 2026");
assert(PPF_INTEREST_HELPER_NOTE.includes("can change, including quarter by quarter"), "Rate helper must disclose future rate changes");
assert(PPF_DEPOSIT_TIMING_NOTE.includes("on or before 5 April"), "Timing note must be visible as a 5 April assumption");
assert(PPF_INTEREST_METHOD_NOTE.includes("lowest balance between the close of the 5th day"), "Interest method must describe the 5th-day rule");
assert(PPF_INTEREST_METHOD_NOTE.includes("credited annually"), "Interest method must say interest is credited annually");
assert(!PPF_PROJECTION_METHOD_NOTE.toLowerCase().includes("monthly compounding"), "Projection method must not say monthly compounding");
assert(PPF_LIMIT_AGGREGATION_NOTE.includes("on behalf of a minor"), "Limit note must mention minor-account aggregation");
assert(PPF_MATURITY_DISCLOSURE.includes("15 complete financial years"), "Maturity disclosure must distinguish statutory FY-end maturity");
assert(PPF_YEARS_HELPER_NOTE.includes("15 contribution years"), "Years helper must describe 15 contribution years");
assert(PPF_EXTENSION_NOTE.includes("5-year blocks"), "Extension note must mention 5-year blocks");
assert(PPF_EXTENSION_NOTE.includes("does not determine eligibility"), "Extension note must not claim eligibility");
assert(PPF_SCOPE_LIMITATIONS_NOTE.includes("no loans, withdrawals, premature closure"), "Scope must disclose no-loan / no-withdrawal assumptions");
assert(PPF_TAX_NOTE.includes("does not estimate tax benefits"), "Tax note must say the calculator does not estimate tax benefits");

assert(normalizeAnnualContribution(500) === 500, "₹500 must be accepted");
assert(normalizeAnnualContribution(150000) === 150000, "₹1,50,000 must be accepted");
assert(normalizeAnnualContribution(550) === 550, "₹550 must be accepted");
assert(normalizeAnnualContribution(501) === 500, "₹501 must normalize to a ₹50 multiple");
assert(normalizeAnnualContribution(400) === 500, "Below ₹500 must clamp to the minimum");
assert(normalizeAnnualContribution(200000) === 150000, "Above ₹1,50,000 must clamp to the maximum");
assert(normalizeAnnualContribution(-1000) === 0, "Negative contribution must normalize to 0");
assert(normalizeAnnualContribution(Number.NaN) === 0, "NaN contribution must normalize to 0");
assert(normalizeAnnualContribution(Number.POSITIVE_INFINITY) === 0, "Infinity contribution must normalize to 0");
assert(normalizeIllustrativeRate(-5) === 0, "Negative rate must normalize to 0");
assert(normalizeIllustrativeRate(Number.NaN) === 0, "NaN rate must normalize to 0");
assert(normalizeContributionYears(-3) === 0, "Negative years must normalize to 0");
assert(normalizeContributionYears(Number.POSITIVE_INFINITY) === 0, "Infinite years must normalize to 0");

const fiveHundred = calculatePpfEstimate({
  annualContribution: 500,
  illustrativeAnnualRate: 7.1,
  contributionYears: 15,
});
assert(roundedBalance(fiveHundred) === 13561, "₹500 × 15 years @ 7.1% must round to ₹13,561");

const oneLakh = calculatePpfEstimate({
  annualContribution: 100000,
  illustrativeAnnualRate: 7.1,
  contributionYears: 15,
});
assert(roundedBalance(oneLakh) === 2712139, "₹1,00,000 × 15 years @ 7.1% must round to ₹27,12,139");

const oneFifty = calculatePpfEstimate({
  annualContribution: 150000,
  illustrativeAnnualRate: 7.1,
  contributionYears: 15,
});
assert(roundedBalance(oneFifty) === 4068209, "₹1,50,000 × 15 years @ 7.1% must round to ₹40,68,209");
assert(oneFifty.illustrativeAnnualRate === 7.1, "Default vector must keep illustrative rate 7.1");
assert(oneFifty.contributionYears === 15, "Default vector must use 15 contribution years");
assert(oneFifty.annualContribution === 150000, "Default vector must keep ₹1,50,000");
assert(oneFifty.totalContributed === 2250000, "₹1,50,000 × 15 must contribute ₹22,50,000");

const zeroRate = calculatePpfEstimate({
  annualContribution: 150000,
  illustrativeAnnualRate: 0,
  contributionYears: 15,
});
assert(zeroRate.estimatedBalance === 2250000, "0% rate must return annual contribution × contribution years");
assert(zeroRate.interestEarned === 0, "0% rate must earn no illustrative interest");

const zeroContribution = calculatePpfEstimate({
  annualContribution: 0,
  illustrativeAnnualRate: 7.1,
  contributionYears: 15,
});
assert(zeroContribution.estimatedBalance === 0, "Zero contribution must produce a zero estimated balance");

const invalidInputs = calculatePpfEstimate({
  annualContribution: Number.NaN,
  illustrativeAnnualRate: Number.POSITIVE_INFINITY,
  contributionYears: Number.NaN,
});
assert(invalidInputs.annualContribution === 0, "NaN contribution must normalize to 0");
assert(invalidInputs.illustrativeAnnualRate === 0, "Infinite rate must normalize to 0");
assert(invalidInputs.contributionYears === 0, "NaN years must normalize to 0");
assert(Number.isFinite(invalidInputs.estimatedBalance), "Invalid inputs must stay finite");
assert(!Number.isNaN(invalidInputs.estimatedBalance), "Invalid inputs must not be NaN");
assert(invalidInputs.estimatedBalance === 0, "Invalid inputs must not produce a projected balance");

const negativeInputs = calculatePpfEstimate({
  annualContribution: -150000,
  illustrativeAnnualRate: -7.1,
  contributionYears: -15,
});
assert(negativeInputs.annualContribution === 0, "Negative contribution must normalize to 0");
assert(negativeInputs.illustrativeAnnualRate === 0, "Negative rate must normalize to 0");
assert(negativeInputs.contributionYears === 0, "Negative years must normalize to 0");
assert(negativeInputs.estimatedBalance === 0, "Negative inputs must not produce a projected balance");

const snapped = calculatePpfEstimate({
  annualContribution: 501,
  illustrativeAnnualRate: 0,
  contributionYears: 15,
});
assert(snapped.annualContribution === 500, "Estimate must snap ₹501 to ₹500");
assert(snapped.estimatedBalance === 7500, "Snapped ₹500 at 0% over 15 years must be ₹7,500");

const defaultRateEstimate = calculatePpfEstimate({
  annualContribution: 150000,
  contributionYears: 15,
});
assert(defaultRateEstimate.illustrativeAnnualRate === 7.1, "Engine default illustrative rate must be 7.1");

const projected = projectPpfBalance({
  annualContribution: 150000,
  illustrativeAnnualRate: 7.1,
  contributionYears: 15,
});
assert(Math.round(projected.estimatedBalance) === roundedBalance(oneFifty), "projectPpfBalance must match calculatePpfEstimate");

const yearByYear = projectPpfBalance({
  annualContribution: 150000,
  illustrativeAnnualRate: 7.1,
  contributionYears: 2,
});
const manualTwoYears = 150000 * 1.071 + 150000;
const twoYearBalance = manualTwoYears * 1.071;
assert(nearlyEqual(yearByYear.estimatedBalance, twoYearBalance, 0.01), "Year-by-year engine must add contribution then apply the annual rate");

[
  fiveHundred,
  oneLakh,
  oneFifty,
  zeroRate,
  zeroContribution,
  invalidInputs,
  negativeInputs,
  calculatePpfEstimate({}),
].forEach((result, index) => {
  assert(Object.hasOwn(result, "estimatedBalance"), `Estimate ${index} must expose estimatedBalance`);
  assert(!Object.hasOwn(result, "maturityValue"), `Estimate ${index} must not expose maturityValue`);
  assert(result.estimatedBalance >= 0, `estimatedBalance ${index} must not be negative`);
  assert(Number.isFinite(result.estimatedBalance), `estimatedBalance ${index} must be finite`);
  assert(result.totalContributed >= 0, `totalContributed ${index} must not be negative`);
  assert(result.interestEarned >= 0, `interestEarned ${index} must not be negative`);
});

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/PpfCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/ppf/ppfEngine.js"), "utf8");
const rulesSource = readFileSync(join(sourceRoot, "src/utils/ppf/ppfRules.js"), "utf8");
const insightsSource = readFileSync(join(sourceRoot, "src/data/calculatorInsights.js"), "utf8");
const explainsSource = readFileSync(join(sourceRoot, "src/data/calculatorExplains.js"), "utf8");
const calculatorsSource = readFileSync(join(sourceRoot, "src/data/calculators.js"), "utf8");
const journeysSource = readFileSync(join(sourceRoot, "src/data/journeys.js"), "utf8");
const formatSource = readFileSync(join(sourceRoot, "src/utils/calculatorFormat.js"), "utf8");
const ppfInsights = insightsSource.slice(
  insightsSource.indexOf('"/ppf-calculator": {'),
  insightsSource.indexOf('"/retirement-calculator": {'),
);
const ppfExplains = explainsSource.slice(
  explainsSource.indexOf('"/ppf-calculator": {'),
  explainsSource.indexOf('"/retirement-calculator": {'),
);
const publicCopy = `${calculatorSource}\n${ppfInsights}\n${ppfExplains}\n${calculatorsSource}`;

assert(calculatorSource.includes("calculatePpfEstimate"), "PPF UI must use the centralized engine");
assert(calculatorSource.includes("PPF_ILLUSTRATIVE_INTEREST_RATE"), "PPF UI must default to the centralized 7.1% illustrative rate");
assert(calculatorSource.includes("PPF_STANDARD_CONTRIBUTION_YEARS"), "PPF UI must lock the standard model to 15 contribution years");
assert(calculatorSource.includes("PPF_PRIMARY_RESULT_LABEL"), "PPF UI must use Estimated PPF balance");
assert(calculatorSource.includes("PPF_INTEREST_INPUT_LABEL"), "PPF UI must label the rate as an illustrative assumption");
assert(calculatorSource.includes("PPF_INTEREST_HELPER_NOTE"), "PPF UI must show the Jul–Sep 2026 rate basis");
assert(calculatorSource.includes("PPF_DEPOSIT_TIMING_NOTE"), "PPF UI must show the 5 April timing assumption");
assert(calculatorSource.includes("PPF_MATURITY_DISCLOSURE"), "PPF UI must show the statutory maturity distinction");
assert(calculatorSource.includes("PPF_SCOPE_LIMITATIONS_NOTE"), "PPF UI must show the no-loan / no-withdrawal assumption");
assert(calculatorSource.includes("PPF_LIMIT_AGGREGATION_NOTE"), "PPF UI must disclose minor-account aggregation of the annual cap");
assert(calculatorSource.includes("PPF_EXTENSION_NOTE"), "PPF UI must keep extension blocks outside the standard model");
assert(calculatorSource.includes("PPF_TAX_NOTE"), "PPF UI must state that it does not estimate tax benefits");
assert(calculatorSource.includes("Explore how PPF contributions may accumulate"), "PPF title must be educational");
assert(!calculatorSource.includes("max: 50"), "PPF UI must not silently expose a 16–50 year slider");
assert(!calculatorSource.includes("Time Period (Years)"), "PPF UI must not label years as a generic time period");
assert(!calculatorSource.includes("Maturity Value"), "PPF UI must not use Maturity Value as the primary label");
assert(!calculatorSource.includes("expected interest rate"), "PPF UI must not say expected interest rate");
assert(!calculatorSource.includes("Build long-term wealth with PPF"), "PPF UI must not use promotional wealth wording");
assert(!/monthly compounding/i.test(calculatorSource), "PPF UI must not describe PPF as monthly compounding");
assert(!/guaranteed 7\.1%/i.test(calculatorSource), "PPF UI must not say guaranteed 7.1%");
assert(!/fixed 7\.1%/i.test(calculatorSource), "PPF UI must not say fixed 7.1%");
assert(!/7\.1% for 15 years/i.test(calculatorSource), "PPF UI must not lock 7.1% for 15 years");

assert(engineSource.includes("balance += yearly"), "Engine must use a year-by-year contribution step");
assert(engineSource.includes("balance += balance * rate"), "Engine must apply the illustrative annual rate once per year");
assert(!engineSource.includes("((1 + rate) ** years - 1) / rate"), "Engine must not hide the model behind an unexplained closed-form annuity");
assert(!/monthly compounding/i.test(engineSource), "Engine must not describe monthly compounding");

assert(rulesSource.includes("G.S.R. 915(E)"), "Rules must document G.S.R. 915(E)");
assert(rulesSource.includes("1 July–30 September 2026"), "Rules must document the Jul–Sep 2026 rate period");

assert(formatSource.includes("maximumFractionDigits: 2"), "Percent display must keep one-decimal rates such as 7.1%");

assert(publicCopy.includes("Explore an illustrative PPF accumulation estimate") || publicCopy.includes("Explore how PPF contributions may accumulate"), "Card/title copy must stay educational");
assert(publicCopy.includes("1 July–30 September 2026"), "Copy must show the Jul–Sep 2026 rate basis");
assert(publicCopy.includes("on or before 5 April"), "Copy must show the 5 April timing assumption");
assert(publicCopy.includes("15 complete financial years"), "Copy must distinguish statutory maturity");
assert(publicCopy.includes("no loans, withdrawals, premature closure"), "Copy must disclose no-loan / no-withdrawal assumptions");
assert(publicCopy.includes("Illustrative interest rate assumption"), "Copy must use illustrative interest rate assumption");
assert(!publicCopy.includes("expected interest rate"), "Copy must not say expected interest rate");
assert(!publicCopy.includes("Expected annual interest rate"), "Copy must not say expected annual interest rate");
assert(!publicCopy.includes("Maturity Value"), "Copy must not use Maturity Value");
assert(!/monthly compounding/i.test(publicCopy), "Copy must not say monthly compounding");
assert(!/guaranteed maturity/i.test(publicCopy), "Copy must not say guaranteed maturity");
assert(!/fixed return/i.test(publicCopy), "Copy must not say fixed return");
assert(!/guaranteed 7\.1%/i.test(publicCopy), "Copy must not say guaranteed 7.1%");
assert(!/tax-efficient/i.test(publicCopy), "PPF calculator copy must not make a universal tax-efficient claim");
assert(!/80C-linked/i.test(publicCopy), "PPF calculator copy must not say 80C-linked");
assert(!journeysSource.includes("80C-linked long-term tax-efficient savings"), "Journey PPF card must not say 80C-linked tax-efficient savings");
assert(!journeysSource.includes("long-term tax-efficient savings options"), "Journey PPF card must not say tax-efficient savings options");

assert(ppfInsights.includes("Estimated PPF balance"), "Insights must use Estimated PPF balance");
assert(ppfInsights.includes("Illustrative interest rate assumption"), "Insights must use illustrative interest rate assumption");
assert(ppfExplains.includes("1 July–30 September 2026"), "Explains must identify Jul–Sep 2026");
assert(ppfExplains.includes("15 contribution years"), "Explains must describe 15 contribution years");

if (failures.length) {
  console.error(`PPF validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`PPF validation passed: ${checks} checks.`);
console.log(`Framework: ${PPF_LEGAL_FRAMEWORK}`);
console.log(`Limits: ₹${PPF_MIN_ANNUAL_CONTRIBUTION}–₹${PPF_MAX_ANNUAL_CONTRIBUTION.toLocaleString("en-IN")}, step ₹${PPF_CONTRIBUTION_STEP}`);
console.log(`Default illustrative rate: ${PPF_ILLUSTRATIVE_INTEREST_RATE}% (${PPF_ILLUSTRATIVE_RATE_PERIOD})`);
console.log(`₹500 × 15y @ 7.1% → ₹${roundedBalance(fiveHundred).toLocaleString("en-IN")}`);
console.log(`₹1,00,000 × 15y @ 7.1% → ₹${roundedBalance(oneLakh).toLocaleString("en-IN")}`);
console.log(`₹1,50,000 × 15y @ 7.1% → ₹${roundedBalance(oneFifty).toLocaleString("en-IN")}`);
console.log(`₹1,50,000 × 15y @ 0% → ₹${zeroRate.estimatedBalance.toLocaleString("en-IN")}`);
