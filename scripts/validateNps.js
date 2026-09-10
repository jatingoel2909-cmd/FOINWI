/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  calculateNpsEstimate,
  NPS_INVALID_EXIT_AGE_BELOW_60,
  NPS_INVALID_INVERTED_AGES,
  normalizeAnnuityAllocationPercent,
  normalizeNonNegativeAmount,
  projectBeginningOfMonthCorpus,
  resolveAgeValidation,
} from "../src/utils/nps/npsEngine.js";
import {
  NPS_AGE_SCOPE_NOTE,
  NPS_ANNUITY_ALLOCATION_HELPER_NOTE,
  NPS_ANNUITY_AMOUNT_LABEL,
  NPS_ANNUITY_RATE_HELPER_NOTE,
  NPS_CONTRIBUTED_LABEL,
  NPS_CONTRIBUTION_LIMIT_NOTE,
  NPS_CORPUS_BAND_NOTE,
  NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT,
  NPS_DEFAULT_ANNUITY_RATE_PERCENT,
  NPS_EXIT_SPLIT_CORPUS_THRESHOLD,
  NPS_INVALID_AGE_NOTE,
  NPS_LUMP_SUM_LABEL,
  NPS_MIN_ANNUITY_ALLOCATION_PERCENT,
  NPS_MIN_ILLUSTRATED_EXIT_AGE,
  NPS_MINIMUM_ANNUITY_NOTE,
  NPS_MONTHLY_ANNUITY_LABEL,
  NPS_PRIMARY_RESULT_LABEL,
  NPS_PROJECTION_METHOD_NOTE,
  NPS_RETURN_HELPER_NOTE,
  NPS_RETURN_LABEL,
  NPS_SCOPE_NOTE,
  NPS_SPECIAL_CASE_NOTE,
  NPS_TAX_NOTE,
  NPS_TITLE,
} from "../src/utils/nps/npsRules.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function nearlyEqual(left, right, tolerance = 0.01) {
  return Math.abs(left - right) <= tolerance;
}

function independentBeginningOfMonthCorpus(monthly, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return monthly * months;
  return monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
}

assert(NPS_TITLE === "NPS accumulation and normal-exit illustration", "Title must name the scoped illustration");
assert(NPS_PRIMARY_RESULT_LABEL === "Estimated projected NPS corpus", "Primary result must be Estimated projected NPS corpus");
assert(NPS_CONTRIBUTED_LABEL === "Total illustrated contributions", "Contributed label must be Total illustrated contributions");
assert(NPS_LUMP_SUM_LABEL === "Illustrative non-annuity portion", "Lump-sum label must not say tax-free");
assert(NPS_ANNUITY_AMOUNT_LABEL === "Illustrative amount allocated to annuity", "Annuity amount label must be illustrative");
assert(NPS_MONTHLY_ANNUITY_LABEL === "Illustrative monthly annuity income", "Monthly annuity label must not say pension");
assert(NPS_RETURN_LABEL === "Illustrative market-linked return assumption (%)", "Return label must be illustrative and market-linked");
assert(NPS_MIN_ANNUITY_ALLOCATION_PERCENT === 20, "Statutory minimum annuity allocation for this scope must be 20%");
assert(NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT === 20, "Default allocation must be the 20% minimum");
assert(NPS_DEFAULT_ANNUITY_RATE_PERCENT === 6, "Default annuity-rate assumption may remain 6% as an illustration");
assert(NPS_MIN_ILLUSTRATED_EXIT_AGE === 60, "Illustrated exit age must be at least 60");
assert(NPS_EXIT_SPLIT_CORPUS_THRESHOLD === 1200000, "Exit-split threshold must be ₹12 lakh");

assert(NPS_SCOPE_NOTE.includes("non-Government"), "Scope must name non-Government");
assert(NPS_SCOPE_NOTE.includes("All Citizen"), "Scope must name All Citizen");
assert(NPS_SCOPE_NOTE.includes("Common Scheme"), "Scope must name Common Scheme");
assert(NPS_SCOPE_NOTE.includes("Tier-I"), "Scope must name Tier-I");
assert(NPS_SCOPE_NOTE.includes("normal-exit"), "Scope must name normal-exit");
assert(NPS_SCOPE_NOTE.includes("₹12 lakh"), "Scope must name the corpus > ₹12 lakh split");
assert(NPS_RETURN_HELPER_NOTE.includes("market-linked"), "Return helper must say market-linked");
assert(NPS_RETURN_HELPER_NOTE.includes("illustrative"), "Return helper must say illustrative");
assert(NPS_ANNUITY_ALLOCATION_HELPER_NOTE.includes("at least 20%"), "Allocation helper must describe 20% as a minimum");
assert(NPS_MINIMUM_ANNUITY_NOTE.includes("statutory minimum"), "Minimum note must call 20% a statutory minimum");
assert(NPS_MINIMUM_ANNUITY_NOTE.includes("not a recommendation"), "Minimum note must not treat 20% as a recommendation");
assert(NPS_ANNUITY_RATE_HELPER_NOTE.includes("not an NPS statutory rate"), "Annuity-rate helper must deny a statutory rate");
assert(NPS_ANNUITY_RATE_HELPER_NOTE.includes("not a quote from an Annuity Service Provider"), "Annuity-rate helper must deny an ASP quote");
assert(NPS_ANNUITY_RATE_HELPER_NOTE.includes("prevailing pricing"), "Annuity-rate helper must say actual ASP pricing differs");
assert(NPS_TAX_NOTE.includes("does not compute tax"), "Tax note must say tax is not computed");
assert(NPS_TAX_NOTE.includes("tax regime"), "Tax note must mention tax regime");
assert(NPS_SPECIAL_CASE_NOTE.includes("Government-sector"), "Special-case note must exclude Government-sector");
assert(NPS_SPECIAL_CASE_NOTE.includes("premature exit"), "Special-case note must exclude premature exit");
assert(NPS_SPECIAL_CASE_NOTE.includes("MSF"), "Special-case note must exclude MSF");
assert(NPS_CORPUS_BAND_NOTE.includes("up to ₹12 lakh"), "Corpus-band note must suppress the >₹12 lakh split");
assert(NPS_PROJECTION_METHOD_NOTE.includes("beginning-of-month"), "Projection note must state beginning-of-month timing");
assert(NPS_PROJECTION_METHOD_NOTE.includes("zero opening balance"), "Projection note must state zero opening balance");
assert(NPS_CONTRIBUTION_LIMIT_NOTE.includes("not NPS statutory contribution limits"), "Contribution limits must be product-scoped");
assert(NPS_AGE_SCOPE_NOTE.includes("not the full statutory NPS"), "Age limits must be product-scoped");
assert(NPS_INVALID_AGE_NOTE.includes("No financial projection"), "Invalid ages must produce no financial projection");

const defaultExpected = independentBeginningOfMonthCorpus(5000, 10, 30);
assert(nearlyEqual(defaultExpected, 11396626.62, 0.02), "Independent default identity must match the documented corpus target");

const defaultEstimate = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 30,
  exitAge: 60,
  annuityAllocationPercent: 20,
  illustrativeAnnuityRatePercent: 6,
});
assert(defaultEstimate.valid === true, "Default case must be valid");
assert(defaultEstimate.contributionYears === 30, "Default years must be 30");
assert(defaultEstimate.totalContributed === 1800000, "Default contributions must be ₹18,00,000");
assert(nearlyEqual(defaultEstimate.projectedCorpus, defaultExpected, 0.01), "Default corpus must match the production identity");
assert(nearlyEqual(defaultEstimate.projectedCorpus, 11396626.62, 0.02), "Default corpus must match the documented unrounded target");
assert(defaultEstimate.exitIllustrationApplies === true, "Default corpus is above ₹12 lakh so the exit split applies");
assert(nearlyEqual(defaultEstimate.annuityAllocation, defaultEstimate.projectedCorpus * 0.2, 0.01), "20% annuity amount must be corpus × 0.20");
assert(nearlyEqual(defaultEstimate.illustrativeLumpSum, defaultEstimate.projectedCorpus * 0.8, 0.01), "Non-annuity portion must be corpus × 0.80");
assert(
  nearlyEqual(defaultEstimate.illustrativeMonthlyAnnuity, (defaultEstimate.annuityAllocation * 0.06) / 12, 0.01),
  "6% illustrative annuity rate must be allocation × 0.06 / 12",
);

const zeroContribution = calculateNpsEstimate({
  monthlyContribution: 0,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 30,
  exitAge: 60,
});
assert(zeroContribution.valid === true, "Zero contribution with valid ages must remain valid");
assert(zeroContribution.projectedCorpus === 0, "Zero contribution must produce corpus 0");
assert(zeroContribution.totalContributed === 0, "Zero contribution must produce contributed 0");
assert(zeroContribution.exitIllustrationApplies === false, "Zero corpus must not apply the >₹12 lakh split");

const zeroReturn = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 0,
  currentAge: 30,
  exitAge: 60,
});
assert(zeroReturn.projectedCorpus === 1800000, "Zero return must equal ₹5,000 × 360");
assert(zeroReturn.totalContributed === 1800000, "Zero-return contributions must be ₹18,00,000");
assert(zeroReturn.exitIllustrationApplies === true, "Zero-return ₹18 lakh corpus must apply the exit split");

const oneYearExpected = independentBeginningOfMonthCorpus(5000, 10, 1);
assert(nearlyEqual(oneYearExpected, 63351.41, 0.01), "Independent one-year identity must match the unrounded mathematical target");
const oneYear = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 59,
  exitAge: 60,
});
assert(oneYear.contributionYears === 1, "Age 59 to 60 must be one contribution year");
assert(nearlyEqual(oneYear.projectedCorpus, oneYearExpected, 0.01), "One-year corpus must match the production identity");
assert(nearlyEqual(oneYear.projectedCorpus, 63351.41, 0.01), "One-year corpus must match the unrounded mathematical target");
assert(oneYear.exitIllustrationApplies === false, "One-year corpus is at or below ₹12 lakh so the exit split must not apply");

const inverted = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 60,
  exitAge: 55,
});
assert(inverted.valid === false, "Inverted ages must be invalid");
assert(inverted.reason === NPS_INVALID_INVERTED_AGES, "Inverted ages must use the inverted-ages reason");
assert(inverted.projectedCorpus === null, "Inverted ages must not force a one-year projection");
assert(inverted.totalContributed === null, "Inverted ages must not produce contributed totals");
assert(inverted.exitIllustrationApplies === false, "Inverted ages must not apply an exit split");
assert(resolveAgeValidation(58, 40).reason === NPS_INVALID_INVERTED_AGES, "currentAge >= exitAge must be inverted");

const belowSixty = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 30,
  exitAge: 55,
});
assert(belowSixty.valid === false, "Exit age below 60 must be invalid for this scoped calculator");
assert(belowSixty.reason === NPS_INVALID_EXIT_AGE_BELOW_60, "Exit age below 60 must use the exit-age-below-60 reason");
assert(belowSixty.projectedCorpus === null, "Exit age below 60 must not produce a financial projection");

const smallCorpus = calculateNpsEstimate({
  monthlyContribution: 1000,
  illustrativeAnnualReturnPercent: 5,
  currentAge: 55,
  exitAge: 60,
});
assert(smallCorpus.valid === true, "Small-corpus accumulation must remain valid");
assert(smallCorpus.projectedCorpus <= 1200000, "Small-corpus fixture must stay at or below ₹12 lakh");
assert(smallCorpus.exitIllustrationApplies === false, "Corpus at or below ₹12 lakh must not apply the 20%/80% split");
assert(smallCorpus.annuityAllocation === null, "Small corpus must suppress annuity allocation");
assert(smallCorpus.illustrativeLumpSum === null, "Small corpus must suppress the non-annuity portion");
assert(smallCorpus.illustrativeMonthlyAnnuity === null, "Small corpus must suppress monthly annuity income");
assert(smallCorpus.message === NPS_CORPUS_BAND_NOTE, "Small corpus must show the band-guard message");

const fullAnnuity = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 30,
  exitAge: 60,
  annuityAllocationPercent: 100,
  illustrativeAnnuityRatePercent: 6,
});
assert(nearlyEqual(fullAnnuity.annuityAllocation, fullAnnuity.projectedCorpus, 0.01), "100% allocation must send the whole corpus to annuity");
assert(fullAnnuity.illustrativeLumpSum === 0, "100% allocation must leave a zero non-annuity portion");

assert(normalizeAnnuityAllocationPercent(10) === 20, "Allocation below 20% must clamp to the 20% minimum");
assert(normalizeAnnuityAllocationPercent(150) === 100, "Allocation above 100% must clamp to 100%");
const clampedAllocation = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 30,
  exitAge: 60,
  annuityAllocationPercent: 10,
});
assert(clampedAllocation.annuityAllocationPercent === 20, "Engine must apply the 20% minimum after a below-minimum input");
assert(nearlyEqual(clampedAllocation.annuityAllocation, clampedAllocation.projectedCorpus * 0.2, 0.01), "Clamped 20% must use corpus × 0.20");

const zeroAnnuityRate = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
  currentAge: 30,
  exitAge: 60,
  annuityAllocationPercent: 20,
  illustrativeAnnuityRatePercent: 0,
});
assert(zeroAnnuityRate.illustrativeMonthlyAnnuity === 0, "0% illustrative annuity rate must produce monthly annuity 0");

const invalidInputs = calculateNpsEstimate({
  monthlyContribution: Number.NaN,
  illustrativeAnnualReturnPercent: Number.POSITIVE_INFINITY,
  currentAge: 30,
  exitAge: 60,
  annuityAllocationPercent: Number.NEGATIVE_INFINITY,
  illustrativeAnnuityRatePercent: -6,
});
assert(invalidInputs.valid === true, "Numeric garbage with valid ages must normalize rather than crash");
assert(invalidInputs.monthlyContribution === 0, "NaN contribution must normalize to 0");
assert(invalidInputs.illustrativeAnnualReturnPercent === 0, "Infinite return must normalize to 0");
assert(invalidInputs.projectedCorpus === 0, "Normalized invalid money inputs must not project a positive corpus");
assert(Number.isFinite(invalidInputs.projectedCorpus), "Normalized corpus must stay finite");
assert(normalizeNonNegativeAmount(-5000) === 0, "Negative money must normalize to 0");
assert(normalizeNonNegativeAmount(Number.NaN) === 0, "NaN money must normalize to 0");
assert(normalizeNonNegativeAmount(Number.POSITIVE_INFINITY) === 0, "Infinity money must normalize to 0");

const missingAges = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: 10,
});
assert(missingAges.valid === false, "Missing ages must be invalid");
assert(missingAges.projectedCorpus === null, "Missing ages must not invent a one-year projection");

assert(
  projectBeginningOfMonthCorpus(5000, 10, 30) === defaultEstimate.projectedCorpus,
  "Exported corpus helper must match the estimate engine",
);

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/NpsCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/nps/npsEngine.js"), "utf8");
const rulesSource = readFileSync(join(sourceRoot, "src/utils/nps/npsRules.js"), "utf8");
const insightsSource = readFileSync(join(sourceRoot, "src/data/calculatorInsights.js"), "utf8");
const explainsSource = readFileSync(join(sourceRoot, "src/data/calculatorExplains.js"), "utf8");
const calculatorsSource = readFileSync(join(sourceRoot, "src/data/calculators.js"), "utf8");
const learnSource = readFileSync(join(sourceRoot, "src/data/learnAcademy.js"), "utf8");
const conceptsSource = readFileSync(join(sourceRoot, "src/intelligence/knowledge/financialConcepts.js"), "utf8");
const insightsStart = insightsSource.indexOf('"/nps-calculator": {');
const insightsEnd = insightsSource.indexOf('"/home-loan-eligibility-calculator": {');
const explainsStart = explainsSource.indexOf('"/nps-calculator": {');
const explainsEnd = explainsSource.indexOf('"/home-loan-eligibility-calculator": {');
const npsInsights = insightsSource.slice(insightsStart, insightsEnd);
const npsExplains = explainsSource.slice(explainsStart, explainsEnd);
const npsLearnStart = learnSource.indexOf('"retirement-planning/nps-overview"');
const npsLearnEnd = learnSource.indexOf('"retirement-planning/swp-for-retirement-income"');
const npsLesson = learnSource.slice(npsLearnStart, npsLearnEnd);
const npsConceptStart = conceptsSource.indexOf("  nps: {");
const npsConceptEnd = conceptsSource.indexOf('  "goal-planning": {');
const npsConcept = conceptsSource.slice(npsConceptStart, npsConceptEnd);
const publicCopy = `${calculatorSource}\n${npsInsights}\n${npsExplains}\n${calculatorsSource}\n${npsLesson}\n${npsConcept}\n${rulesSource}`;

assert(calculatorSource.includes("calculateNpsEstimate"), "NPS UI must use the centralized engine");
assert(calculatorSource.includes("NPS_PRIMARY_RESULT_LABEL"), "NPS UI must use Estimated projected NPS corpus");
assert(calculatorSource.includes("NPS_RETURN_LABEL"), "NPS UI must use the illustrative market-linked return label");
assert(calculatorSource.includes("NPS_ANNUITY_ALLOCATION_LABEL"), "NPS UI must expose annuity allocation");
assert(calculatorSource.includes("NPS_ANNUITY_RATE_LABEL"), "NPS UI must expose the illustrative annuity-rate assumption");
assert(calculatorSource.includes("NPS_RETURN_HELPER_NOTE"), "NPS UI must show the market-linked return helper");
assert(calculatorSource.includes("NPS_ANNUITY_RATE_HELPER_NOTE"), "NPS UI must show the ASP-pricing helper");
assert(calculatorSource.includes("NPS_TAX_NOTE"), "NPS UI must say tax is not computed");
assert(calculatorSource.includes("NPS_SPECIAL_CASE_NOTE"), "NPS UI must disclose out-of-scope cases");
assert(!calculatorSource.includes("Expected Return"), "NPS UI must not say Expected Return");
assert(!calculatorSource.includes("Est. Monthly Pension"), "NPS UI must not say Est. Monthly Pension");
assert(!calculatorSource.includes("Corpus at Retirement"), "NPS UI must not say Corpus at Retirement");
assert(!calculatorSource.includes("max(retirementAge - currentAge, 1)"), "NPS UI must not force inverted ages into 1 year");
assert(!calculatorSource.includes("0.4 * 0.06"), "NPS UI must not hard-code 40% × 6%");
assert(!engineSource.includes("years = Math.max"), "Engine must not silently force a one-year horizon");
assert(engineSource.includes("(1 + monthlyRate) ** months"), "Engine must keep the beginning-of-month identity");

const banned = [
  [/guaranteed pension/i, "Copy must not say guaranteed pension"],
  [/guaranteed return/i, "Copy must not say guaranteed return"],
  [/expected NPS interest/i, "Copy must not say expected NPS interest"],
  [/statutory 6%|6% annuity rate is|official annuity rate/i, "Copy must not present 6% as a statutory or official annuity rate"],
  [/40% mandatory/i, "Copy must not say 40% is mandatory for all NPS"],
  [/60% tax-free/i, "Copy must not say 60% tax-free withdrawal"],
  [/80% tax-free/i, "Copy must not say 80% tax-free withdrawal"],
  [/exact monthly pension/i, "Copy must not say exact monthly pension"],
  [/age 60 is the only/i, "Copy must not say age 60 is the only NPS exit"],
  [/all NPS subscribers require annuity/i, "Copy must not say all NPS subscribers require annuity"],
  [/interest rate/i, "NPS copy must not call the return an interest rate"],
  [/Not claiming additional tax deduction where eligible/i, "Copy must not give an unqualified extra-deduction tip"],
];

banned.forEach(([pattern, message]) => {
  assert(!pattern.test(publicCopy), message);
});

assert(/market-linked/i.test(publicCopy), "Related NPS copy must keep market-linked wording");
assert(/illustrative/i.test(publicCopy), "Related NPS copy must keep illustrative wording");
assert(npsInsights.includes("non-Government") || npsInsights.includes("All Citizen"), "Insights must keep the locked subscriber scope");
assert(npsExplains.includes("does not compute tax") || npsExplains.includes("tax regime"), "Explains must keep the tax caveat");

if (failures.length) {
  console.error(`NPS validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`NPS validation passed: ${checks} checks.`);
console.log(`Scope: ${NPS_SCOPE_NOTE}`);
console.log(`Default corpus: ₹${defaultEstimate.projectedCorpus.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
console.log(`Default 20% annuity allocation: ₹${defaultEstimate.annuityAllocation.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
