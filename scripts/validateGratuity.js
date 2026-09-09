/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  calculateGratuityEstimate,
  calculateQualifyingYears,
  calculateUncappedGratuity,
} from "../src/utils/gratuity/gratuityEngine.js";
import {
  GRATUITY_ADDITIONAL_MONTH_THRESHOLD,
  GRATUITY_BETTER_TERMS_NOTE,
  GRATUITY_CEILING_APPLIED_NOTE,
  GRATUITY_CEILING_LABEL,
  GRATUITY_CEILING_LEGAL_NOTE,
  GRATUITY_CEILING_SUPPORTING_NOTE,
  GRATUITY_CEILING_TIME_SENSITIVE,
  GRATUITY_DAYS_DENOMINATOR,
  GRATUITY_DAYS_NUMERATOR,
  GRATUITY_FIVE_YEAR_NOTE,
  GRATUITY_FIXED_TERM_NOTE,
  GRATUITY_FRAMEWORK_EFFECTIVE_DATE,
  GRATUITY_FRAMEWORK_EFFECTIVE_DATE_SHORT,
  GRATUITY_LEGAL_FRAMEWORK,
  GRATUITY_MIN_CONTINUOUS_SERVICE_YEARS,
  GRATUITY_STATUTORY_CEILING,
  GRATUITY_WAGE_BASIS_LABEL,
  GRATUITY_WAGE_HELPER_NOTE,
} from "../src/utils/gratuity/gratuityRules.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function nearlyEqual(left, right, tolerance = 0.0001) {
  return Math.abs(left - right) <= tolerance;
}

function estimateAt(lastDrawnStatutoryWages, completedYears, additionalMonths = 0) {
  return calculateGratuityEstimate({
    lastDrawnStatutoryWages,
    completedYears,
    additionalMonths,
  });
}

assert(GRATUITY_LEGAL_FRAMEWORK === "Code on Social Security, 2020", "Current legal framework must be Code on Social Security, 2020");
assert(GRATUITY_FRAMEWORK_EFFECTIVE_DATE === "21 November 2025", "Framework effective date must be 21 November 2025");
assert(GRATUITY_FRAMEWORK_EFFECTIVE_DATE_SHORT === "21.11.2025", "Short effective date must be 21.11.2025");
assert(GRATUITY_WAGE_BASIS_LABEL === "Last drawn statutory wages", "Wage basis label must be Last drawn statutory wages");
assert(GRATUITY_DAYS_NUMERATOR === 15, "Monthly-rated formula numerator must be 15");
assert(GRATUITY_DAYS_DENOMINATOR === 26, "Monthly-rated formula denominator must be 26");
assert(GRATUITY_ADDITIONAL_MONTH_THRESHOLD === 6, "Additional-month threshold must be 6");
assert(GRATUITY_MIN_CONTINUOUS_SERVICE_YEARS === 5, "General eligibility must require 5 years");
assert(GRATUITY_STATUTORY_CEILING === 2000000, "Ceiling used in this estimate must remain centralized at ₹20,00,000");
assert(GRATUITY_CEILING_TIME_SENSITIVE === true, "Ceiling used in this estimate must remain time-sensitive");
assert(GRATUITY_CEILING_LABEL === "Ceiling used in this estimate", "Visitor-facing ceiling label must be Ceiling used in this estimate");
assert(
  GRATUITY_CEILING_SUPPORTING_NOTE.includes("time-sensitive")
  && GRATUITY_CEILING_SUPPORTING_NOTE.includes("rechecked"),
  "Supporting ceiling copy must be time-sensitive and ask for rechecking if notifications change",
);
assert(
  GRATUITY_CEILING_LEGAL_NOTE.includes("subject to an amount notified by the Central Government"),
  "Detailed ceiling explanation must state the Code notification standard without calling ₹20 lakh the current notified Code ceiling",
);
assert(
  GRATUITY_FIVE_YEAR_NOTE.includes("five years of continuous service"),
  "Five-year note must state the general continuous-service rule",
);
assert(
  GRATUITY_FIVE_YEAR_NOTE.includes("death or disablement"),
  "Five-year note must mention death or disablement without adjudicating those cases",
);
assert(
  GRATUITY_FIVE_YEAR_NOTE.includes("labour-code"),
  "Five-year note must acknowledge the current labour-code scope",
);
assert(
  GRATUITY_FIXED_TERM_NOTE.includes("Fixed-term employment"),
  "Fixed-term employment must be explicitly outside ordinary calculator scope",
);
assert(
  GRATUITY_BETTER_TERMS_NOTE.includes("award, agreement or employment contract"),
  "Better-terms note must remain educational and non-absolute",
);
assert(
  GRATUITY_WAGE_HELPER_NOTE.includes("may differ from Basic + DA"),
  "Wage helper must state that statutory wages may differ from Basic + DA",
);

assert(calculateQualifyingYears(10, 0) === 10, "10 years 0 months must stay 10 qualifying years");
assert(calculateQualifyingYears(10, 6) === 10, "10 years 6 months must stay 10 qualifying years");
assert(calculateQualifyingYears(10, 7) === 11, "10 years 7 months must become 11 qualifying years");
assert(calculateQualifyingYears(10, 11) === 11, "10 years 11 months must become 11 qualifying years");
assert(calculateQualifyingYears(5, 0) === 5, "5 years 0 months must stay 5 qualifying years");
assert(calculateQualifyingYears(4, 0) === 4, "4 years 0 months must stay 4 qualifying years");
assert(calculateQualifyingYears(4, 7) === 5, "4 years 7 months adds a qualifying year for the formula only");

const fiveYears = estimateAt(50000, 5, 0);
assert(fiveYears.lastDrawnStatutoryWages === 50000, "₹50,000 statutory-wages fixture must keep the wage basis");
assert(!Object.hasOwn(fiveYears, "lastDrawnBasicPlusDA"), "Engine result must use statutory wages, not Basic + DA");
assert(fiveYears.qualifyingYears === 5, "5 years 0 months must use 5 qualifying years");
assert(fiveYears.eligibleUnderGeneralRule === true, "5 years exactly must be eligible under the general rule");
assert(
  nearlyEqual(fiveYears.uncappedGratuity, (50000 * 15 * 5) / 26),
  "₹50,000 × 5 years must use the centralized 15/26 formula",
);
assert(fiveYears.estimatedGratuity === fiveYears.statutoryGratuity, "Eligible estimate must equal statutory gratuity");
assert(fiveYears.ceilingApplied === false, "₹50,000 × 5 years must remain below the statutory ceiling");
assert(fiveYears.wageBasis === GRATUITY_WAGE_BASIS_LABEL, "Estimate must expose the last drawn statutory wages basis");
assert(fiveYears.legalFramework === GRATUITY_LEGAL_FRAMEWORK, "Estimate must identify Code on Social Security, 2020");
assert(fiveYears.ceilingTimeSensitive === true, "Estimate must flag the ceiling as time-sensitive");

const ignoredBasicPlusDAAlias = calculateGratuityEstimate({
  lastDrawnBasicPlusDA: 50000,
  completedYears: 5,
  additionalMonths: 0,
});
assert(
  ignoredBasicPlusDAAlias.lastDrawnStatutoryWages === 0,
  "Passing Basic + DA instead of statutory wages must not be treated as the wage input",
);

const tenYearsSixMonths = estimateAt(50000, 10, 6);
assert(tenYearsSixMonths.qualifyingYears === 10, "10 years 6 months must still be 10 qualifying years");
assert(
  nearlyEqual(tenYearsSixMonths.uncappedGratuity, calculateUncappedGratuity(50000, 10)),
  "10 years 6 months must not add a year in the 15/26 estimate",
);

const tenYearsSevenMonths = estimateAt(50000, 10, 7);
assert(tenYearsSevenMonths.qualifyingYears === 11, "10 years 7 months must be 11 qualifying years");
assert(
  nearlyEqual(tenYearsSevenMonths.uncappedGratuity, calculateUncappedGratuity(50000, 11)),
  "10 years 7 months must use 11 qualifying years in the 15/26 estimate",
);

const tenYearsElevenMonths = estimateAt(50000, 10, 11);
assert(tenYearsElevenMonths.qualifyingYears === 11, "10 years 11 months must be 11 qualifying years");

const fourYearsOrdinary = estimateAt(50000, 4, 0);
assert(fourYearsOrdinary.eligibleUnderGeneralRule === false, "4 years ordinary exit must not be treated as normally eligible");
assert(fourYearsOrdinary.estimatedGratuity === null, "4 years ordinary exit must not present a payable gratuity amount");

const fourYearsSevenMonths = estimateAt(50000, 4, 7);
assert(
  fourYearsSevenMonths.eligibleUnderGeneralRule === false,
  "Ordinary eligibility must use completed years, not formula qualifying years, and must not adjudicate exceptions",
);
assert(fourYearsSevenMonths.estimatedGratuity === null, "4 years 7 months ordinary exit must not present a payable amount");
assert(fourYearsSevenMonths.qualifyingYears === 5, "4 years 7 months still adds a formula qualifying year");

const belowCeiling = estimateAt(50000, 10, 0);
assert(belowCeiling.uncappedGratuity < GRATUITY_STATUTORY_CEILING, "₹50,000 × 10 years fixture must sit below ₹20,00,000");
assert(
  nearlyEqual(belowCeiling.statutoryGratuity, belowCeiling.uncappedGratuity),
  "Uncapped gratuity below ₹20,00,000 must remain unchanged",
);
assert(belowCeiling.ceilingApplied === false, "Below-ceiling estimate must not report a cap");

const wagesForExactCeiling = (GRATUITY_STATUTORY_CEILING * GRATUITY_DAYS_DENOMINATOR) / (GRATUITY_DAYS_NUMERATOR * 10);
const exactCeiling = estimateAt(wagesForExactCeiling, 10, 0);
assert(nearlyEqual(exactCeiling.uncappedGratuity, GRATUITY_STATUTORY_CEILING), "Exact-ceiling fixture must produce ₹20,00,000 before capping");
assert(nearlyEqual(exactCeiling.statutoryGratuity, GRATUITY_STATUTORY_CEILING), "Uncapped gratuity of exactly ₹20,00,000 must stay ₹20,00,000");
assert(exactCeiling.ceilingApplied === false, "Exact statutory ceiling is not an excess cap");
assert(nearlyEqual(exactCeiling.estimatedGratuity, GRATUITY_STATUTORY_CEILING), "Eligible exact-ceiling estimate must be ₹20,00,000");

const aboveCeiling = estimateAt(500000, 40, 0);
assert(aboveCeiling.uncappedGratuity > GRATUITY_STATUTORY_CEILING, "High-value fixture must exceed ₹20,00,000 before the ceiling");
assert(aboveCeiling.statutoryGratuity === GRATUITY_STATUTORY_CEILING, "Uncapped gratuity above ₹20,00,000 must be capped at ₹20,00,000");
assert(aboveCeiling.estimatedGratuity === GRATUITY_STATUTORY_CEILING, "Eligible capped estimate must be ₹20,00,000");
assert(aboveCeiling.ceilingApplied === true, "Above-ceiling estimate must report that the statutory cap applied");

const zeroWage = estimateAt(0, 10, 0);
assert(zeroWage.uncappedGratuity === 0, "Zero wages must produce zero uncapped gratuity");
assert(zeroWage.estimatedGratuity === 0, "Zero wages with eligible service must estimate ₹0 rather than a false payout");

const invalidWage = estimateAt(Number.NaN, 10, 0);
assert(invalidWage.lastDrawnStatutoryWages === 0, "Invalid wages must collapse to zero");
assert(invalidWage.uncappedGratuity === 0, "Invalid wages must not produce a false uncapped amount");

const negativeInputs = estimateAt(-50000, -2, -3);
assert(negativeInputs.lastDrawnStatutoryWages === 0, "Negative wages must not be used");
assert(negativeInputs.completedYears === 0, "Negative years must not be used");
assert(negativeInputs.additionalMonths === 0, "Negative months must not be used");
assert(negativeInputs.qualifyingYears === 0, "Negative service must not create qualifying years");

[
  fiveYears,
  tenYearsSixMonths,
  tenYearsSevenMonths,
  fourYearsOrdinary,
  belowCeiling,
  exactCeiling,
  aboveCeiling,
  zeroWage,
  invalidWage,
  negativeInputs,
  calculateGratuityEstimate({}),
  calculateGratuityEstimate({ lastDrawnStatutoryWages: Number.POSITIVE_INFINITY, completedYears: 10 }),
].forEach((result, index) => {
  assert(Object.hasOwn(result, "lastDrawnStatutoryWages"), `Estimate ${index} must expose lastDrawnStatutoryWages`);
  assert(!Object.hasOwn(result, "lastDrawnBasicPlusDA"), `Estimate ${index} must not expose lastDrawnBasicPlusDA`);
  assert(result.completedYears >= 0, `completedYears ${index} must not be negative`);
  assert(result.additionalMonths >= 0 && result.additionalMonths <= 11, `additionalMonths ${index} must stay in 0–11`);
  assert(result.qualifyingYears >= 0, `qualifyingYears ${index} must not be negative`);
  assert(result.uncappedGratuity >= 0, `uncappedGratuity ${index} must not be negative`);
  assert(result.statutoryGratuity >= 0, `statutoryGratuity ${index} must not be negative`);
  assert(Number.isFinite(result.uncappedGratuity), `uncappedGratuity ${index} must be finite`);
  assert(!Number.isNaN(result.uncappedGratuity), `uncappedGratuity ${index} must not be NaN`);
  assert(result.uncappedGratuity !== Number.POSITIVE_INFINITY, `uncappedGratuity ${index} must not be Infinity`);
  assert(Number.isFinite(result.statutoryGratuity), `statutoryGratuity ${index} must be finite`);
  if (result.estimatedGratuity !== null) {
    assert(result.estimatedGratuity >= 0, `estimatedGratuity ${index} must not be negative`);
    assert(Number.isFinite(result.estimatedGratuity), `estimatedGratuity ${index} must be finite`);
    assert(!Number.isNaN(result.estimatedGratuity), `estimatedGratuity ${index} must not be NaN`);
  } else {
    assert(result.eligibleUnderGeneralRule === false, `null estimatedGratuity ${index} must be the ineligible path`);
  }
});

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/GratuityCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/gratuity/gratuityEngine.js"), "utf8");
const rulesSource = readFileSync(join(sourceRoot, "src/utils/gratuity/gratuityRules.js"), "utf8");
const insightsSource = readFileSync(join(sourceRoot, "src/data/calculatorInsights.js"), "utf8");
const explainsSource = readFileSync(join(sourceRoot, "src/data/calculatorExplains.js"), "utf8");
const publicCopy = `${calculatorSource}\n${insightsSource}\n${explainsSource}`;

assert(calculatorSource.includes("calculateGratuityEstimate"), "Gratuity UI must use the centralized engine");
assert(calculatorSource.includes("lastDrawnStatutoryWages"), "Gratuity UI must pass statutory wages into the engine");
assert(calculatorSource.includes("GRATUITY_WAGE_BASIS_LABEL"), "Gratuity UI must use the centralized wage label");
assert(calculatorSource.includes("GRATUITY_WAGE_HELPER_NOTE"), "Gratuity UI must use the centralized statutory-wage helper");
assert(calculatorSource.includes("Additional months of service"), "Gratuity UI must capture additional months");
assert(calculatorSource.includes("more than 6"), "Gratuity UI must explain the >6-month qualifying-year rule");
assert(calculatorSource.includes("GRATUITY_CEILING_LABEL"), "Gratuity UI must identify the ceiling used in this estimate");
assert(calculatorSource.includes("GRATUITY_CEILING_SUPPORTING_NOTE"), "Gratuity UI must show concise time-sensitive ceiling copy");
assert(!calculatorSource.includes("GRATUITY_CEILING_LEGAL_NOTE"), "Gratuity UI must not place the long legal ceiling paragraph on the primary result card");
assert(calculatorSource.includes("Calculated gratuity before the ceiling used in this estimate"), "Gratuity UI must show uncapped calculated gratuity");
assert(calculatorSource.includes("GRATUITY_FIVE_YEAR_NOTE"), "Gratuity UI must use the centralized five-year note");
assert(calculatorSource.includes("GRATUITY_BETTER_TERMS_NOTE"), "Gratuity UI must use the centralized better-terms note");
assert(calculatorSource.includes("GRATUITY_FIXED_TERM_NOTE"), "Gratuity UI must use the centralized fixed-term note");
assert(calculatorSource.includes("GRATUITY_CEILING_APPLIED_NOTE") || calculatorSource.includes(GRATUITY_CEILING_APPLIED_NOTE), "Gratuity UI must explain when the statutory estimate is capped");
assert(calculatorSource.includes("Code on Social Security, 2020"), "Gratuity UI must identify Code on Social Security, 2020");
assert(
  calculatorSource.includes("21 November 2025") || calculatorSource.includes("21.11.2025"),
  "Gratuity UI must reference the 21.11.2025 effective date",
);
assert(!calculatorSource.includes("Gratuity Amount"), "Gratuity UI must not present an unqualified payout amount label");
assert(!calculatorSource.includes("you will receive"), "Gratuity UI must not promise that the visitor will receive an amount");
assert(!calculatorSource.includes("legally entitled"), "Gratuity UI must not claim a legal entitlement");
assert(!calculatorSource.includes("final entitlement"), "Gratuity UI must not claim a final entitlement");
assert(!/guaranteed gratuity/i.test(calculatorSource), "Gratuity UI must not describe guaranteed gratuity");
assert(!/exact gratuity/i.test(calculatorSource), "Gratuity UI must not describe exact gratuity");
assert(
  !calculatorSource.includes("Last drawn Basic + DA"),
  "Gratuity UI must not label the input Last drawn Basic + DA",
);
assert(
  !/statutory wages always equal Basic \+ DA/i.test(publicCopy),
  "Copy must not state that statutory wages always equal Basic + DA",
);
assert(
  publicCopy.includes("may differ from Basic + DA"),
  "Copy must state that statutory wages may differ from Basic + DA",
);
assert(
  !/current notified Code ceiling is ₹?20\s*lakh/i.test(publicCopy),
  "Copy must not say the current notified Code ceiling is ₹20 lakh",
);
assert(
  !/the current notified ceiling under the Code/i.test(publicCopy),
  "Copy must not describe ₹20 lakh as the current notified ceiling under the Code",
);
assert(
  !/maximum gratuity is always ₹?20\s*lakh/i.test(publicCopy),
  "Copy must not say maximum gratuity is always ₹20 lakh",
);
assert(
  !/Basic \+ DA always equals statutory wages/i.test(publicCopy),
  "Copy must not say Basic + DA always equals statutory wages",
);

assert(engineSource.includes("lastDrawnStatutoryWages"), "Engine input must be lastDrawnStatutoryWages");
assert(!engineSource.includes("lastDrawnBasicPlusDA"), "Engine must not take lastDrawnBasicPlusDA as the wage input");
assert(engineSource.includes("Code on Social Security, 2020"), "Engine must identify the current labour-code framework");
assert(rulesSource.includes("time-sensitive"), "Ceiling constant must be documented as time-sensitive");
assert(rulesSource.includes("Section 53(3)"), "Rules comments must document Code section 53(3)");
assert(rulesSource.includes("Section 164"), "Rules comments must document section 164 savings");
assert(rulesSource.includes("S.O. 1420(E)"), "Rules comments must document S.O. 1420(E), 29 March 2018");
assert(rulesSource.includes("21 November 2025") || rulesSource.includes("21.11.2025"), "Rules must reference the 21.11.2025 effective date");

assert(insightsSource.includes("Last drawn statutory wages"), "Insights must use last drawn statutory wages");
assert(insightsSource.includes("additional months > 6"), "Insights formula must match the engine >6-month rule");
assert(insightsSource.includes("₹20,00,000") || insightsSource.includes("₹20 lakh"), "Insights must show the ₹20 lakh ceiling used in this estimate");
assert(insightsSource.includes("time-sensitive"), "Insights must treat the ceiling as time-sensitive");
assert(
  insightsSource.includes("subject to an amount notified by the Central Government"),
  "Insights must carry the detailed Code ceiling explanation",
);
assert(insightsSource.includes("Ceiling used in this estimate"), "Insights must identify the ceiling used in this estimate");
assert(insightsSource.includes("Code on Social Security, 2020"), "Insights must identify Code on Social Security, 2020");
assert(insightsSource.includes("21 November 2025") || insightsSource.includes("21.11.2025"), "Insights must reference 21.11.2025");
assert(insightsSource.includes("death or disablement"), "Insights must include the death/disablement disclaimer");
assert(insightsSource.includes("Fixed-term employment"), "Insights must state that fixed-term employment is outside scope");
assert(!insightsSource.includes("Last drawn Basic + DA"), "Insights must not present Basic + DA as the wage input");
assert(!insightsSource.includes("Payment of Gratuity Act"), "Insights must not present the old Act as the current governing basis");

assert(explainsSource.includes("Last drawn statutory wages"), "Explains must use last drawn statutory wages");
assert(explainsSource.includes("more than 6 months"), "Explains must match the engine >6-month rule");
assert(explainsSource.includes("Code on Social Security, 2020"), "Explains must identify Code on Social Security, 2020");
assert(explainsSource.includes("Fixed-term employment") || explainsSource.includes("fixed-term employment"), "Explains must keep fixed-term employment outside ordinary scope");
assert(!explainsSource.includes("Last drawn Basic + DA"), "Explains must not present Basic + DA as the wage input");
assert(!explainsSource.includes("Payment of Gratuity Act"), "Explains must not present the old Act as the current governing basis");

if (failures.length) {
  console.error(`Gratuity validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Gratuity validation passed: ${checks} checks.`);
console.log(`Framework: ${GRATUITY_LEGAL_FRAMEWORK} effective ${GRATUITY_FRAMEWORK_EFFECTIVE_DATE_SHORT}`);
console.log(`Wage input: ${GRATUITY_WAGE_BASIS_LABEL}`);
console.log(`Ceiling: ₹${GRATUITY_STATUTORY_CEILING.toLocaleString("en-IN")} (time-sensitive=${GRATUITY_CEILING_TIME_SENSITIVE})`);
console.log(`₹50,000, 5y 0m → qualifying ${fiveYears.qualifyingYears}, uncapped ₹${fiveYears.uncappedGratuity}, estimated ₹${fiveYears.estimatedGratuity}`);
console.log(`₹50,000, 10y 6m → qualifying ${tenYearsSixMonths.qualifyingYears}`);
console.log(`₹50,000, 10y 7m → qualifying ${tenYearsSevenMonths.qualifyingYears}`);
console.log(`₹50,000, 10y 11m → qualifying ${tenYearsElevenMonths.qualifyingYears}`);
console.log(`₹50,000, 4y 0m → eligible ${fourYearsOrdinary.eligibleUnderGeneralRule}, estimated ${fourYearsOrdinary.estimatedGratuity}`);
console.log(`Below ceiling 10y → uncapped ₹${belowCeiling.uncappedGratuity}, statutory ₹${belowCeiling.statutoryGratuity}`);
console.log(`Exact ceiling → uncapped ₹${exactCeiling.uncappedGratuity}, statutory ₹${exactCeiling.statutoryGratuity}`);
console.log(`Above ceiling → uncapped ₹${aboveCeiling.uncappedGratuity}, statutory ₹${aboveCeiling.statutoryGratuity}, capped ${aboveCeiling.ceilingApplied}`);
