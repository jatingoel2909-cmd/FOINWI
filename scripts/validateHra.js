/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  calculateHraEstimate,
  isFiftyPercentCity,
  normalizeMonthlyAmount,
  resolveResidenceCategory,
} from "../src/utils/hra/hraEngine.js";
import {
  HRA_ASSESSMENT_YEAR,
  HRA_BASIC_LABEL,
  HRA_CITY_40_HELPER_NOTE,
  HRA_CITY_50_HELPER_NOTE,
  HRA_CITY_CATEGORY_40,
  HRA_CITY_CATEGORY_50,
  HRA_DA_HELPER_NOTE,
  HRA_DA_LABEL,
  HRA_FIFTY_PERCENT_CITIES,
  HRA_FORM_124_NOTE,
  HRA_LEGAL_FRAMEWORK,
  HRA_OCCUPANCY_NOTE,
  HRA_OWN_HOUSE_NOTE,
  HRA_PERIOD_NOTE,
  HRA_PRIMARY_RESULT_LABEL,
  HRA_RECEIVED_LABEL,
  HRA_REGIME_NOTE,
  HRA_RENT_LABEL,
  HRA_RESIDENCE_LABEL,
  HRA_RULE_FRAMEWORK,
  HRA_SALARY_SCOPE_NOTE,
  HRA_SCOPE_NOTE,
  HRA_TAX_YEAR,
  HRA_TAX_YEAR_LABEL,
  HRA_TAXABLE_MEANING_NOTE,
  HRA_TAXABLE_RESULT_LABEL,
  HRA_TITLE,
} from "../src/utils/hra/hraRules.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

assert(HRA_LEGAL_FRAMEWORK === "Income-tax Act, 2025", "Legal framework must be Income-tax Act, 2025");
assert(HRA_RULE_FRAMEWORK === "Income-tax Rules, 2026, Rule 279", "Rule framework must be Rules 2026 Rule 279");
assert(HRA_TAX_YEAR === "2026-27", "Tax year must be 2026-27");
assert(HRA_ASSESSMENT_YEAR === "2027-28", "Assessment year must be 2027-28");
assert(HRA_TAX_YEAR_LABEL === "FY / Tax year 2026-27", "Tax-year label must be FY / Tax year 2026-27");
assert(HRA_TITLE === "HRA exemption — opt-out regime estimate", "Title must be the opt-out regime estimate");
assert(HRA_PRIMARY_RESULT_LABEL === "Estimated monthly HRA exemption", "Primary result must be Estimated monthly HRA exemption");
assert(HRA_TAXABLE_RESULT_LABEL === "Monthly taxable HRA", "Taxable result must be Monthly taxable HRA");
assert(HRA_BASIC_LABEL === "Monthly basic salary", "Basic label must be monthly");
assert(HRA_DA_LABEL === "Monthly qualifying DA", "DA label must be monthly qualifying DA");
assert(HRA_RECEIVED_LABEL === "Monthly HRA received", "HRA received label must be monthly");
assert(HRA_RENT_LABEL === "Monthly rent actually paid", "Rent label must be monthly rent actually paid");
assert(HRA_RESIDENCE_LABEL === "Residence category", "Residence label must be Residence category");
assert(HRA_SCOPE_NOTE.includes("opted out of the default tax regime under section 202"), "Scope must be opt-out regime");
assert(HRA_SCOPE_NOTE.includes("FY 2026-27"), "Scope must name FY 2026-27");
assert(HRA_REGIME_NOTE.includes("not available under the default tax regime under section 202"), "Regime note must say default section 202 regime does not allow this exemption");
assert(HRA_REGIME_NOTE.includes("opted out of that default regime"), "Regime note must describe the opt-out case");
assert(HRA_SALARY_SCOPE_NOTE === "This simplified calculator uses Basic salary plus qualifying DA. Commission is not modelled.", "Salary scope must be a product limitation, not a commission legal conclusion");
assert(HRA_DA_HELPER_NOTE.includes("Commission is not modelled"), "DA helper must say commission is not modelled");
assert(HRA_DA_HELPER_NOTE.includes("provided for under the terms of employment"), "DA helper must use Rule 279 terms-of-employment wording");
assert(!/commission is excluded/i.test(HRA_DA_HELPER_NOTE), "DA helper must not say commission is excluded");
assert(!/commission cannot/i.test(HRA_DA_HELPER_NOTE), "DA helper must not say commission cannot form part of salary");
assert(HRA_OCCUPANCY_NOTE.includes("actually pay rent for the residential accommodation you occupy"), "Occupancy note must assume actual rent and occupation");
assert(HRA_OWN_HOUSE_NOTE.includes("owned and occupied by you"), "Own-house note must say exemption is not available");
assert(HRA_PERIOD_NOTE.includes("relevant period"), "Period note must mention the relevant period");
assert(HRA_PERIOD_NOTE.includes("calculate the relevant periods separately"), "Period note must say mid-year changes are calculated separately");
assert(HRA_FORM_124_NOTE.includes("Form 124"), "Form 124 note must be present");
assert(HRA_FORM_124_NOTE.includes("₹1,00,000"), "Form 124 note must use the ₹1,00,000 threshold");
assert(HRA_FORM_124_NOTE.includes("not a fourth mathematical limb of Rule 279"), "Form 124 note must not be a formula limb");
assert(HRA_TAXABLE_MEANING_NOTE.includes("not total taxable income"), "Taxable HRA must not be described as total taxable income");
assert(HRA_FIFTY_PERCENT_CITIES.join(",") === "Mumbai,Kolkata,Delhi,Chennai,Hyderabad,Pune,Ahmedabad,Bengaluru", "Eight-city 50% list must match Rule 279");
assert(HRA_CITY_50_HELPER_NOTE.includes("Mumbai"), "50% helper must list Mumbai");
assert(HRA_CITY_50_HELPER_NOTE.includes("Kolkata"), "50% helper must list Kolkata");
assert(HRA_CITY_50_HELPER_NOTE.includes("Delhi"), "50% helper must list Delhi");
assert(HRA_CITY_50_HELPER_NOTE.includes("Chennai"), "50% helper must list Chennai");
assert(HRA_CITY_50_HELPER_NOTE.includes("Hyderabad"), "50% helper must list Hyderabad");
assert(HRA_CITY_50_HELPER_NOTE.includes("Pune"), "50% helper must list Pune");
assert(HRA_CITY_50_HELPER_NOTE.includes("Ahmedabad"), "50% helper must list Ahmedabad");
assert(HRA_CITY_50_HELPER_NOTE.includes("Bengaluru"), "50% helper must list Bengaluru");
assert(HRA_CITY_40_HELPER_NOTE.includes("Gurugram"), "40% helper must mention Gurugram");
assert(HRA_CITY_40_HELPER_NOTE.includes("Noida"), "40% helper must mention Noida");

assert(normalizeMonthlyAmount(50000) === 50000, "Finite monthly amount must pass through");
assert(normalizeMonthlyAmount(0) === 0, "Zero monthly amount must stay 0");
assert(normalizeMonthlyAmount(-1000) === 0, "Negative amount must normalize to 0");
assert(normalizeMonthlyAmount(Number.NaN) === 0, "NaN amount must normalize to 0");
assert(normalizeMonthlyAmount(Number.POSITIVE_INFINITY) === 0, "Infinity amount must normalize to 0");
assert(isFiftyPercentCity("Bengaluru") === true, "Bengaluru must be a 50% city");
assert(isFiftyPercentCity("Gurugram") === false, "Gurugram must not be a 50% city");
assert(isFiftyPercentCity("Noida") === false, "Noida must not be a 50% city");
assert(resolveResidenceCategory("Bengaluru") === HRA_CITY_CATEGORY_50, "Bengaluru must resolve to the 50% category");
assert(resolveResidenceCategory("Gurugram") === HRA_CITY_CATEGORY_40, "Gurugram must resolve to the 40% category");
assert(resolveResidenceCategory("metro") === HRA_CITY_CATEGORY_40, "Generic metro must not resolve to the 50% category");

const hraLimiting = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 0,
  monthlyHraReceived: 8000,
  monthlyRentPaid: 18000,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
assert(hraLimiting.estimatedMonthlyExemption === 8000, "HRA-limiting vector must be ₹8,000");
assert(hraLimiting.monthlyTaxableHra === 0, "HRA-limiting taxable HRA must be ₹0");

const rentLimiting = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 0,
  monthlyHraReceived: 20000,
  monthlyRentPaid: 18000,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
assert(rentLimiting.estimatedMonthlyExemption === 13000, "Rent-limb vector must be ₹13,000");
assert(rentLimiting.monthlyTaxableHra === 7000, "Rent-limb taxable HRA must be ₹7,000");

const city50Limiting = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 0,
  monthlyHraReceived: 40000,
  monthlyRentPaid: 40000,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
assert(city50Limiting.estimatedMonthlyExemption === 25000, "50% city-limb vector must be ₹25,000");
assert(city50Limiting.cityLimb === 25000, "50% city limb must be ₹25,000");

const city40Limiting = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 0,
  monthlyHraReceived: 40000,
  monthlyRentPaid: 40000,
  residenceCategory: HRA_CITY_CATEGORY_40,
});
assert(city40Limiting.estimatedMonthlyExemption === 20000, "40% place-limb vector must be ₹20,000");
assert(city40Limiting.cityLimb === 20000, "40% city limb must be ₹20,000");

const rentBelowTenPercent = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyHraReceived: 20000,
  monthlyRentPaid: 4000,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
assert(rentBelowTenPercent.estimatedMonthlyExemption === 0, "Rent below 10% of salary must produce ₹0 exemption");
assert(rentBelowTenPercent.rentLimb === 0, "Rent limb below 10% must floor at 0");

const zeroRent = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyHraReceived: 20000,
  monthlyRentPaid: 0,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
assert(zeroRent.estimatedMonthlyExemption === 0, "Zero rent must produce ₹0 exemption");

const zeroHra = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyHraReceived: 0,
  monthlyRentPaid: 18000,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
assert(zeroHra.estimatedMonthlyExemption === 0, "Zero HRA must produce ₹0 exemption");

const bengaluru = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 0,
  monthlyHraReceived: 40000,
  monthlyRentPaid: 40000,
  residenceCategory: "Bengaluru",
});
assert(bengaluru.cityCategory50 === true, "Bengaluru must use the 50% category");
assert(bengaluru.estimatedMonthlyExemption === 25000, "Bengaluru 50% limb must limit exemption to ₹25,000");

const gurugram = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 0,
  monthlyHraReceived: 40000,
  monthlyRentPaid: 40000,
  residenceCategory: "Gurugram",
});
assert(gurugram.cityCategory50 === false, "Gurugram must use the 40% category");
assert(gurugram.estimatedMonthlyExemption === 20000, "Gurugram 40% limb must limit exemption to ₹20,000");

const qualifyingDa = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 10000,
  monthlyHraReceived: 20000,
  monthlyRentPaid: 18000,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
assert(qualifyingDa.rule279Salary === 60000, "Qualifying DA must be added to Rule 279 salary");
assert(qualifyingDa.rentLimb === 12000, "Qualifying DA vector rent limb must be ₹12,000");
assert(qualifyingDa.estimatedMonthlyExemption === 12000, "Qualifying DA vector exemption must be ₹12,000");

const invalidInputs = calculateHraEstimate({
  monthlyBasicSalary: Number.NaN,
  monthlyQualifyingDA: Number.NEGATIVE_INFINITY,
  monthlyHraReceived: Number.POSITIVE_INFINITY,
  monthlyRentPaid: -18000,
  residenceCategory: Number.NaN,
});
assert(invalidInputs.monthlyBasicSalary === 0, "NaN basic must normalize to 0");
assert(invalidInputs.monthlyQualifyingDA === 0, "Infinite DA must normalize to 0");
assert(invalidInputs.monthlyHraReceived === 0, "Infinite HRA must normalize to 0");
assert(invalidInputs.monthlyRentPaid === 0, "Negative rent must normalize to 0");
assert(invalidInputs.estimatedMonthlyExemption === 0, "Invalid inputs must not produce a projected exemption");
assert(Number.isFinite(invalidInputs.estimatedMonthlyExemption), "Invalid inputs must stay finite");
assert(!Number.isNaN(invalidInputs.estimatedMonthlyExemption), "Invalid inputs must not be NaN");

[
  hraLimiting,
  rentLimiting,
  city50Limiting,
  city40Limiting,
  rentBelowTenPercent,
  zeroRent,
  zeroHra,
  bengaluru,
  gurugram,
  qualifyingDa,
  invalidInputs,
  calculateHraEstimate({}),
].forEach((result, index) => {
  assert(Object.hasOwn(result, "estimatedMonthlyExemption"), `Estimate ${index} must expose estimatedMonthlyExemption`);
  assert(Object.hasOwn(result, "monthlyTaxableHra"), `Estimate ${index} must expose monthlyTaxableHra`);
  assert(result.estimatedMonthlyExemption >= 0, `Exemption ${index} must not be negative`);
  assert(result.monthlyTaxableHra >= 0, `Taxable HRA ${index} must not be negative`);
  assert(Number.isFinite(result.estimatedMonthlyExemption), `Exemption ${index} must be finite`);
  assert(Number.isFinite(result.monthlyTaxableHra), `Taxable HRA ${index} must be finite`);
});

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/HraCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/hra/hraEngine.js"), "utf8");
const rulesSource = readFileSync(join(sourceRoot, "src/utils/hra/hraRules.js"), "utf8");
const insightsSource = readFileSync(join(sourceRoot, "src/data/calculatorInsights.js"), "utf8");
const explainsSource = readFileSync(join(sourceRoot, "src/data/calculatorExplains.js"), "utf8");
const calculatorsSource = readFileSync(join(sourceRoot, "src/data/calculators.js"), "utf8");
const journeysSource = readFileSync(join(sourceRoot, "src/data/journeys.js"), "utf8");
const ppfInsightsStart = insightsSource.indexOf('"/hra-calculator": {');
const ppfInsightsEnd = insightsSource.indexOf('"/compound-interest-calculator": {');
const ppfExplainsStart = explainsSource.indexOf('"/hra-calculator": {');
const ppfExplainsEnd = explainsSource.indexOf('"/compound-interest-calculator": {');
const hraInsights = insightsSource.slice(ppfInsightsStart, ppfInsightsEnd);
const hraExplains = explainsSource.slice(ppfExplainsStart, ppfExplainsEnd);
const publicCopy = `${calculatorSource}\n${hraInsights}\n${hraExplains}\n${calculatorsSource}`;

assert(calculatorSource.includes("calculateHraEstimate"), "HRA UI must use the centralized engine");
assert(calculatorSource.includes("HRA_TITLE"), "HRA UI must use the opt-out regime title");
assert(calculatorSource.includes("HRA_PRIMARY_RESULT_LABEL"), "HRA UI must use Estimated monthly HRA exemption");
assert(calculatorSource.includes("HRA_TAXABLE_RESULT_LABEL"), "HRA UI must use Monthly taxable HRA");
assert(calculatorSource.includes("HRA_REGIME_NOTE"), "HRA UI must show the section 202 default-regime disclosure");
assert(calculatorSource.includes("HRA_TAX_YEAR_LABEL"), "HRA UI must show FY / Tax year 2026-27");
assert(calculatorSource.includes("HRA_PERIOD_NOTE"), "HRA UI must show the relevant-period note");
assert(calculatorSource.includes("HRA_OCCUPANCY_NOTE"), "HRA UI must show the actual-rent occupancy assumption");
assert(calculatorSource.includes("HRA_FORM_124_NOTE"), "HRA UI must show the Form 124 documentation note");
assert(calculatorSource.includes("HRA_DA_HELPER_NOTE"), "HRA UI must show the qualifying DA helper");
assert(calculatorSource.includes("HRA_CITY_50_HELPER_NOTE"), "HRA UI must show the eight-city list");
assert(calculatorSource.includes("HRA_CITY_40_HELPER_NOTE"), "HRA UI must show the 40% other-place note");
assert(!calculatorSource.includes("Metro"), "HRA UI must not use generic Metro logic");
assert(!calculatorSource.includes("Non-Metro"), "HRA UI must not use generic Non-Metro logic");
assert(!calculatorSource.includes("defaultCity"), "HRA UI must not keep the old metro city prop");
assert(!/10\(13A\)/.test(calculatorSource), "HRA UI must not present section 10(13A) as the current basis");
assert(!calculatorSource.includes("Rule 2A"), "HRA UI must not present Rule 2A as the current basis");

assert(engineSource.includes("rule279Salary = basic + qualifyingDA"), "Engine must add qualifying DA to Rule 279 salary");
assert(engineSource.includes("rentPaid - 0.1 * rule279Salary"), "Engine must compute rent minus 10% of Rule 279 salary");
assert(!engineSource.includes("10(13A)"), "Engine must not use section 10(13A) as the current formula basis");
assert(!engineSource.includes("Rule 2A"), "Engine must not use Rule 2A as the current formula basis");

assert(rulesSource.includes("Rule 279"), "Rules must document Rule 279");
assert(rulesSource.includes("section 202"), "Rules must document section 202");
assert(rulesSource.includes("Income-tax Act, 2025"), "Rules must document the Income-tax Act, 2025");
assert(!rulesSource.includes("10(13A)"), "Rules must not present section 10(13A) as the current governing basis");
assert(!rulesSource.includes("Rule 2A"), "Rules must not present Rule 2A as the current governing basis");

assert(publicCopy.includes("HRA exemption — opt-out regime estimate") || publicCopy.includes("opted out of the default tax regime"), "Copy must identify the opt-out regime scope");
assert(publicCopy.includes("FY 2026-27") || publicCopy.includes("FY / Tax year 2026-27"), "Copy must show FY 2026-27");
assert(publicCopy.includes("Commission is not modelled"), "Copy must say commission is not modelled");
assert(!/commission is excluded/i.test(publicCopy), "Copy must not say commission is excluded from Rule 279 salary");
assert(!/commission cannot/i.test(publicCopy), "Copy must not say commission cannot form part of HRA salary");
assert(!/Rule 279 salary is always only/i.test(publicCopy), "Copy must not say Rule 279 salary is always only Basic plus DA");
assert(!/under common Indian tax rules/i.test(publicCopy), "Copy must not say under common Indian tax rules");
assert(!/guaranteed tax saving/i.test(publicCopy), "Copy must not say guaranteed tax saving");
assert(!/\btax saved\b/i.test(publicCopy), "Copy must not say tax saved");
assert(!/exact exemption/i.test(publicCopy), "Copy must not say exact exemption");
assert(!/your tax saving/i.test(publicCopy), "Copy must not say your tax saving");
assert(!/Basic salary is always the HRA salary/i.test(publicCopy), "Copy must not say basic salary is always the HRA salary");
assert(!/HRA exemption available under default regime/i.test(publicCopy), "Copy must not say HRA exemption is available under the default regime");
assert(!hraInsights.includes('"Metro"') && !hraInsights.includes("metro or non-metro"), "Insights must not use generic Metro/Non-Metro");
assert(!hraExplains.includes("metro vs non-metro"), "Explains must not use generic metro vs non-metro");
assert(!calculatorsSource.includes("Calculate HRA exemption and taxable portion."), "Card must not use unqualified calculate HRA exemption");
assert(!journeysSource.includes("Calculate HRA exemption and taxable portion."), "Journey card must not use unqualified calculate HRA exemption");
assert(!journeysSource.includes("HRA exemption rules for metro and non-metro cities"), "Journey learning copy must not keep metro/non-metro HRA wording");

if (failures.length) {
  console.error(`HRA validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`HRA validation passed: ${checks} checks.`);
console.log(`Framework: ${HRA_LEGAL_FRAMEWORK}; ${HRA_RULE_FRAMEWORK}`);
console.log(`Tax year: ${HRA_TAX_YEAR} / AY ${HRA_ASSESSMENT_YEAR}`);
console.log(`Rent-limb default vector: ₹${rentLimiting.estimatedMonthlyExemption.toLocaleString("en-IN")} exemption; ₹${rentLimiting.monthlyTaxableHra.toLocaleString("en-IN")} taxable HRA`);
console.log(`50% cities: ${HRA_FIFTY_PERCENT_CITIES.join(", ")}`);
