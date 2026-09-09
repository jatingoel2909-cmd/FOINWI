/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyContributionRate,
  calculateContributionWage,
  calculateEpfEstimate,
  calculateStatutoryContributions,
  projectEpfBalance,
  roundContribution,
} from "../src/utils/epf/epfEngine.js";
import {
  EPF_CEILING_LABEL,
  EPF_CEILING_NOTE,
  EPF_CONTRIBUTION_WAGE_LABEL,
  EPF_GENERAL_EMPLOYEE_RATE,
  EPF_GENERAL_EMPLOYER_RATE,
  EPF_HIGHER_WAGE_SCOPE_NOTE,
  EPF_ILLUSTRATIVE_INTEREST_RATE,
  EPF_ILLUSTRATIVE_INTEREST_YEAR,
  EPF_INTEREST_HELPER_NOTE,
  EPF_INTEREST_INPUT_LABEL,
  EPF_LEGAL_FRAMEWORK,
  EPF_NEW_JOINER_SCOPE_NOTE,
  EPF_PROJECTION_METHOD_NOTE,
  EPF_RATE_OPERATIONAL_NOTE,
  EPF_SCHEME_FRAMEWORK_NOTE,
  EPF_SCOPE_NOTE,
  EPF_TEN_PERCENT_SCOPE_NOTE,
  EPF_WAGE_BASIS_LABEL,
  EPF_WAGE_CEILING,
  EPF_WAGE_CEILING_NOTIFICATION,
  EPF_WAGE_HELPER_NOTE,
} from "../src/utils/epf/epfRules.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function estimateAt(monthlyPFWages, currentBalance = 0, annualInterestRate = EPF_ILLUSTRATIVE_INTEREST_RATE, years = 0) {
  return calculateEpfEstimate({
    monthlyPFWages,
    currentBalance,
    annualInterestRate,
    years,
  });
}

assert(EPF_LEGAL_FRAMEWORK === "Code on Social Security, 2020", "Legal framework must be Code on Social Security, 2020");
assert(EPF_WAGE_CEILING === 15000, "Statutory wage ceiling must remain centralized at ₹15,000");
assert(EPF_WAGE_CEILING_NOTIFICATION === "S.O. 2702(E), 29 May 2026", "Ceiling notification must be S.O. 2702(E), 29 May 2026");
assert(EPF_GENERAL_EMPLOYEE_RATE === 0.12, "General employee rate modelled must be 12%");
assert(EPF_GENERAL_EMPLOYER_RATE === 0.12, "General employer rate modelled must be 12%");
assert(EPF_ILLUSTRATIVE_INTEREST_RATE === 8.25, "Default illustrative rate must be 8.25");
assert(EPF_ILLUSTRATIVE_INTEREST_YEAR === "FY 2024-25", "Illustrative rate year must be FY 2024-25");
assert(EPF_WAGE_BASIS_LABEL === "Monthly PF wages", "Wage label must be Monthly PF wages");
assert(EPF_CEILING_LABEL === "Statutory wage ceiling", "Ceiling label must be Statutory wage ceiling");
assert(EPF_CONTRIBUTION_WAGE_LABEL === "Contribution wage used", "Contribution-wage label must be centralized");
assert(EPF_INTEREST_INPUT_LABEL === "Illustrative EPF interest assumption", "Interest label must be illustrative");
assert(EPF_WAGE_HELPER_NOTE.includes("may differ from Basic salary alone"), "Wage helper must say PF wages may differ from Basic salary");
assert(EPF_RATE_OPERATIONAL_NOTE.includes("current EPFO operational treatment"), "12% wording must be operational, not a Scheme 2026 notification claim");
assert(EPF_TEN_PERCENT_SCOPE_NOTE.includes("10%"), "10% establishments must be outside default scope");
assert(EPF_HIGHER_WAGE_SCOPE_NOTE.toLowerCase().includes("voluntary"), "VPF / higher-wage must be outside default scope");
assert(EPF_NEW_JOINER_SCOPE_NOTE.includes("not an EPS member"), "New joiner above ₹15,000 / no-EPS must be outside default scope");
assert(EPF_INTEREST_HELPER_NOTE.includes("FY 2024-25"), "Interest helper must identify FY 2024-25");
assert(EPF_INTEREST_HELPER_NOTE.includes("Government-approved/notified"), "Interest helper must identify the last verified Government-approved rate");
assert(EPF_PROJECTION_METHOD_NOTE.includes("monthly running-balance approximation"), "Projection method note must stay educational");
assert(EPF_SCHEME_FRAMEWORK_NOTE.includes("Employees' Provident Fund Scheme, 2026"), "Framework note must mention Scheme 2026 without quoting unread clauses");
assert(EPF_CEILING_NOTE.includes("₹15,000"), "Ceiling note must disclose ₹15,000");
assert(EPF_SCOPE_NOTE.includes("residual employer EPF"), "Scope note must explain that only residual employer EPF enters the corpus");

assert(roundContribution(1.49) === 1, "₹1.49 must round down");
assert(roundContribution(1.5) === 2, "₹1.50 must round upward");
assert(roundContribution(1.51) === 2, "₹1.51 must round upward");
assert(roundContribution(0.49) === 0, "₹0.49 must round down to 0");
assert(roundContribution(0.5) === 1, "₹0.50 must round upward to 1");
assert(roundContribution(1249.5) === 1250, "₹1,249.50 must round to ₹1,250");
assert(roundContribution(1249.49) === 1249, "₹1,249.49 must round to ₹1,249");
assert(roundContribution(0) === 0, "Zero contribution rounding must stay 0");
assert(roundContribution(-10) === 0, "Negative contribution rounding must normalize to 0");
assert(roundContribution(Number.NaN) === 0, "NaN contribution rounding must normalize to 0");
assert(roundContribution(Number.POSITIVE_INFINITY) === 0, "Infinity contribution rounding must normalize to 0");
assert(applyContributionRate(15000, 833, 10000) === 1250, "8.33% of ₹15,000 must round to ₹1,250");
assert(applyContributionRate(10000, 833, 10000) === 833, "8.33% of ₹10,000 must stay ₹833");

assert(calculateContributionWage(10000) === 10000, "₹10,000 PF wages must keep contribution wage ₹10,000");
assert(calculateContributionWage(15000) === 15000, "₹15,000 PF wages must keep contribution wage ₹15,000");
assert(calculateContributionWage(30000) === 15000, "₹30,000 PF wages must cap contribution wage at ₹15,000");
assert(calculateContributionWage(0) === 0, "Zero PF wages must produce zero contribution wage");
assert(calculateContributionWage(-5000) === 0, "Negative PF wages must normalize to zero contribution wage");

const tenThousand = estimateAt(10000);
assert(tenThousand.contributionWage === 10000, "Vector A contribution wage must be ₹10,000");
assert(tenThousand.employeeEPF === 1200, "Vector A employee EPF must be ₹1,200");
assert(tenThousand.employerTotal === 1200, "Vector A employer total must be ₹1,200");
assert(tenThousand.employerEPS === 833, "Vector A EPS must be rounded 8.33% = ₹833");
assert(tenThousand.employerEPF === 367, "Vector A employer EPF must be employer total − EPS");
assert(
  tenThousand.employerEPF + tenThousand.employerEPS === tenThousand.employerTotal,
  "Vector A employerEPF + employerEPS must equal employerTotal",
);
assert(
  tenThousand.monthlyEpfEnteringCorpus === tenThousand.employeeEPF + tenThousand.employerEPF,
  "Vector A combined monthly EPF must be employeeEPF + employerEPF",
);
assert(tenThousand.monthlyEpfEnteringCorpus !== tenThousand.employerTotal + tenThousand.employeeEPF, "Vector A must not add EPS into the projected EPF contribution");

const ceilingWages = estimateAt(15000);
assert(ceilingWages.contributionWage === 15000, "Vector B contribution wage must be ₹15,000");
assert(ceilingWages.employeeEPF === 1800, "Vector B employee EPF must be ₹1,800");
assert(ceilingWages.employerTotal === 1800, "Vector B employer total must be ₹1,800");
assert(ceilingWages.employerEPS === 1250, "Vector B EPS must be ₹1,250");
assert(ceilingWages.employerEPF === 550, "Vector B employer EPF must be ₹550");
assert(
  ceilingWages.employerEPF + ceilingWages.employerEPS === ceilingWages.employerTotal,
  "Vector B employerEPF + employerEPS must equal employerTotal",
);
assert(
  ceilingWages.monthlyEpfEnteringCorpus === ceilingWages.employeeEPF + ceilingWages.employerEPF,
  "Vector B combined monthly EPF must be employeeEPF + employerEPF",
);
assert(ceilingWages.monthlyEpfEnteringCorpus === 2350, "Vector B monthly EPF entering corpus must exclude EPS");

const aboveCeiling = estimateAt(30000);
assert(aboveCeiling.contributionWage === 15000, "Vector C contribution wage must remain ₹15,000");
assert(aboveCeiling.employeeEPF === ceilingWages.employeeEPF, "Vector C employee EPF must match the ₹15,000 vector");
assert(aboveCeiling.employerTotal === ceilingWages.employerTotal, "Vector C employer total must match the ₹15,000 vector");
assert(aboveCeiling.employerEPS === ceilingWages.employerEPS, "Vector C EPS must match the ₹15,000 vector");
assert(aboveCeiling.employerEPF === ceilingWages.employerEPF, "Vector C employer EPF must match the ₹15,000 vector");
assert(aboveCeiling.ceilingApplied === true, "Vector C must flag that the statutory ceiling was applied");

const zeroWages = estimateAt(0, 250000, 8.25, 10);
assert(zeroWages.contributionWage === 0, "Zero PF wages must produce zero contribution wage");
assert(zeroWages.employeeEPF === 0, "Zero PF wages must produce zero employee EPF");
assert(zeroWages.employerTotal === 0, "Zero PF wages must produce zero employer total");
assert(zeroWages.employerEPS === 0, "Zero PF wages must produce zero EPS");
assert(zeroWages.employerEPF === 0, "Zero PF wages must produce zero employer EPF");
assert(zeroWages.monthlyEpfEnteringCorpus === 0, "Zero PF wages must add no EPF contribution");
assert(Number.isFinite(zeroWages.projectedBalance), "Zero PF wages must stay finite");
assert(!Number.isNaN(zeroWages.projectedBalance), "Zero PF wages must not be NaN");
assert(zeroWages.projectedBalance !== Number.POSITIVE_INFINITY, "Zero PF wages must not be Infinity");
assert(zeroWages.projectedBalance >= 0, "Zero PF wages projection must stay nonnegative");

const negativeInputs = calculateEpfEstimate({
  monthlyPFWages: -20000,
  currentBalance: -1000,
  annualInterestRate: -5,
  years: -3,
});
assert(negativeInputs.monthlyPFWages === 0, "Negative PF wages must normalize to 0");
assert(negativeInputs.currentBalance === 0, "Negative balance must normalize to 0");
assert(negativeInputs.annualInterestRate === 0, "Negative interest must normalize to 0");
assert(negativeInputs.years === 0, "Negative years must normalize to 0");
assert(negativeInputs.projectedBalance === 0, "Negative inputs must not produce a projected balance");
assert(Number.isFinite(negativeInputs.projectedBalance), "Negative inputs must stay finite");

const invalidInputs = calculateEpfEstimate({
  monthlyPFWages: Number.NaN,
  currentBalance: Number.POSITIVE_INFINITY,
  annualInterestRate: Number.NaN,
  years: Number.POSITIVE_INFINITY,
});
assert(invalidInputs.monthlyPFWages === 0, "NaN PF wages must normalize to 0");
assert(invalidInputs.currentBalance === 0, "Infinite balance must normalize to 0");
assert(invalidInputs.annualInterestRate === 0, "NaN interest must normalize to 0");
assert(invalidInputs.years === 0, "Infinite years must normalize to 0");
assert(Number.isFinite(invalidInputs.projectedBalance), "Invalid inputs must stay finite");
assert(!Number.isNaN(invalidInputs.projectedBalance), "Invalid inputs must not be NaN");

const preservedBalance = estimateAt(30000, 175000, 8.25, 0);
assert(preservedBalance.months === 0, "Zero remaining years must produce zero contribution months");
assert(preservedBalance.totalEpfContributions === 0, "Zero remaining years must add no future EPF contributions");
assert(preservedBalance.projectedBalance === 175000, "Existing balance must be preserved when remaining contributions are zero");
assert(preservedBalance.interestEarned === 0, "Zero remaining years must earn no projected interest");
assert(preservedBalance.monthlyEpfEnteringCorpus === 2350, "Zero-year path must still compute statutory monthly EPF without adding EPS");

const defaultRateEstimate = estimateAt(15000, 200000, undefined, 1);
assert(defaultRateEstimate.annualInterestRate === 8.25, "Engine default illustrative rate must be 8.25");

const projected = estimateAt(15000, 200000, 8.25, 20);
assert(projected.monthlyEpfEnteringCorpus === 2350, "Projection must add only employee EPF + residual employer EPF");
assert(projected.monthlyEpfEnteringCorpus === projected.employeeEPF + projected.employerEPF, "Projected monthly EPF must exclude EPS");
assert(projected.employerEPS > 0, "EPS must be calculated");
assert(
  projected.totalEpfContributions === projected.monthlyEpfEnteringCorpus * 240,
  "Total EPF contributions must use the corpus-entering amount, not employer total",
);
assert(projected.projectedBalance > projected.currentBalance, "Positive years and rate must grow the projected balance");
assert(Number.isFinite(projected.projectedBalance), "Projected balance must be finite");
assert(projected.projectedBalance >= 0, "Projected balance must be nonnegative");
assert(projected.interestEarned >= 0, "Interest earned must be nonnegative");
assert(projected.legalFramework === EPF_LEGAL_FRAMEWORK, "Estimate must identify Code on Social Security, 2020");

const zeroRateProjection = projectEpfBalance({
  currentBalance: 100000,
  monthlyEpfEnteringCorpus: 2350,
  annualInterestRate: 0,
  years: 2,
});
assert(zeroRateProjection.projectedBalance === 100000 + 2350 * 24, "Zero-rate projection must add contributions only");

[
  tenThousand,
  ceilingWages,
  aboveCeiling,
  zeroWages,
  negativeInputs,
  invalidInputs,
  preservedBalance,
  projected,
  calculateEpfEstimate({}),
].forEach((result, index) => {
  assert(Object.hasOwn(result, "monthlyPFWages"), `Estimate ${index} must expose monthlyPFWages`);
  assert(!Object.hasOwn(result, "basicSalary"), `Estimate ${index} must not expose basicSalary`);
  assert(result.employeeEPF >= 0, `employeeEPF ${index} must not be negative`);
  assert(result.employerTotal >= 0, `employerTotal ${index} must not be negative`);
  assert(result.employerEPS >= 0, `employerEPS ${index} must not be negative`);
  assert(result.employerEPF >= 0, `employerEPF ${index} must not be negative`);
  assert(result.monthlyEpfEnteringCorpus >= 0, `monthlyEpfEnteringCorpus ${index} must not be negative`);
  assert(result.projectedBalance >= 0, `projectedBalance ${index} must not be negative`);
  assert(Number.isFinite(result.projectedBalance), `projectedBalance ${index} must be finite`);
  assert(!Number.isNaN(result.projectedBalance), `projectedBalance ${index} must not be NaN`);
  assert(
    result.employerEPF + result.employerEPS === result.employerTotal,
    `employer split ${index} must recombine to employerTotal`,
  );
  assert(
    result.monthlyEpfEnteringCorpus === result.employeeEPF + result.employerEPF,
    `corpus contribution ${index} must exclude EPS`,
  );
});

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/EpfCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/epf/epfEngine.js"), "utf8");
const rulesSource = readFileSync(join(sourceRoot, "src/utils/epf/epfRules.js"), "utf8");
const insightsSource = readFileSync(join(sourceRoot, "src/data/calculatorInsights.js"), "utf8");
const explainsSource = readFileSync(join(sourceRoot, "src/data/calculatorExplains.js"), "utf8");
const calculatorsSource = readFileSync(join(sourceRoot, "src/data/calculators.js"), "utf8");
const publicCopy = `${calculatorSource}\n${insightsSource}\n${explainsSource}\n${calculatorsSource}`;

assert(calculatorSource.includes("calculateEpfEstimate"), "EPF UI must use the centralized engine");
assert(calculatorSource.includes("monthlyPFWages"), "EPF UI must pass monthly PF wages into the engine");
assert(calculatorSource.includes("EPF_WAGE_BASIS_LABEL"), "EPF UI must use the centralized PF-wages label");
assert(calculatorSource.includes("EPF_WAGE_HELPER_NOTE"), "EPF UI must use the centralized PF-wages helper");
assert(calculatorSource.includes("EPF_CEILING_NOTE") || calculatorSource.includes("EPF_CEILING_LABEL"), "EPF UI must disclose the ₹15,000 ceiling");
assert(calculatorSource.includes("EPF_INTEREST_INPUT_LABEL"), "EPF UI must label interest as an illustrative assumption");
assert(calculatorSource.includes("EPF_INTEREST_HELPER_NOTE"), "EPF UI must identify FY 2024-25 as the last verified Government-approved 8.25% basis");
assert(calculatorSource.includes("EPF_TEN_PERCENT_SCOPE_NOTE"), "EPF UI must keep 10% establishments outside default scope");
assert(calculatorSource.includes("EPF_HIGHER_WAGE_SCOPE_NOTE"), "EPF UI must keep VPF / higher-wage cases outside default scope");
assert(calculatorSource.includes("EPF_NEW_JOINER_SCOPE_NOTE"), "EPF UI must keep the new joiner above ₹15k/no-EPS case outside default scope");
assert(calculatorSource.includes("Employer EPS diversion"), "EPF UI must show EPS diversion separately");
assert(calculatorSource.includes("Employer EPF contribution entering corpus"), "EPF UI must show residual employer EPF entering the corpus");
assert(calculatorSource.includes("Employee EPF contribution"), "EPF UI must show employee EPF separately");
assert(calculatorSource.includes("Employer total contribution"), "EPF UI must show employer total contribution");
assert(calculatorSource.includes("Combined monthly EPF entering projected corpus"), "EPF UI must show combined EPF entering the corpus");
assert(calculatorSource.includes("EPF_ILLUSTRATIVE_INTEREST_RATE"), "EPF UI must default to the centralized 8.25% illustrative rate");
assert(!calculatorSource.includes("8.15"), "EPF UI must not default to 8.15%");
assert(!calculatorSource.includes("Monthly Basic Salary"), "EPF UI must not label the input Monthly Basic Salary");
assert(!calculatorSource.includes("0.0367"), "EPF UI must not hardcode 3.67%");
assert(!calculatorSource.includes("EPFO compounds monthly"), "EPF UI must not claim that EPFO compounds monthly");
assert(!/employer contribution = 3\.67%/i.test(calculatorSource), "EPF UI must not say employer contribution = 3.67%");
assert(!/FY 2025-26[^.]*notified/i.test(publicCopy), "Copy must not describe FY 2025-26 as notified");
assert(publicCopy.includes("FY 2024-25"), "Copy must identify FY 2024-25 as the last verified Government-approved 8.25% basis");
assert(!/PF wages always equal Basic/i.test(publicCopy), "Copy must not say PF wages always equal Basic salary");
assert(publicCopy.includes("may differ from Basic salary"), "Copy must state that PF wages may differ from Basic salary");
assert(publicCopy.includes("₹15,000") || publicCopy.includes("15000"), "Copy must disclose the ₹15,000 ceiling");
assert(publicCopy.includes("Explore an illustrative EPF accumulation estimate"), "Card/title copy must use the educational accumulation wording");
assert(!publicCopy.includes("Project your EPF retirement corpus"), "Copy must not say Project your EPF retirement corpus");
assert(!/freshly notified rate under EPF Scheme 2026/i.test(publicCopy), "Copy must not claim 12% is freshly notified under Scheme 2026");
assert(!/guaranteed EPF rate/i.test(publicCopy), "Copy must not call 8.25% a guaranteed EPF rate");
assert(!/current guaranteed rate/i.test(publicCopy), "Copy must not call 8.25% the current guaranteed rate");

assert(engineSource.includes("employerTotal - employerEPS") || engineSource.includes("employerTotal − employerEPS"), "Engine must derive employer EPF as a residual");
assert(!/contributionWage \* 0\.0367/.test(engineSource), "Engine must not independently calculate contributionWage × 3.67%");
assert(engineSource.includes("monthly running-balance approximation") || rulesSource.includes("monthly running-balance approximation"), "Engine/rules must label the projection as a running-balance approximation");
assert(rulesSource.includes("S.O. 2702(E)"), "Rules must document S.O. 2702(E)");
assert(rulesSource.includes("G.S.R. 525(E)"), "Rules comments may document Scheme 2026 existence without quoting unread clauses");
assert(!rulesSource.includes("12% is the freshly notified rate under EPF Scheme 2026"), "Rules must not claim a fresh Scheme 2026 12% notification");

assert(insightsSource.includes("Monthly PF wages"), "Insights must use Monthly PF wages");
assert(insightsSource.includes("employerTotal − employerEPS") || insightsSource.includes("employerTotal - employerEPS"), "Insights must show employer EPF as a residual");
assert(insightsSource.includes("8.33%"), "Insights must show EPS diversion");
assert(insightsSource.includes("₹15,000"), "Insights must disclose the ₹15,000 ceiling");
assert(insightsSource.includes("FY 2024-25"), "Insights must identify FY 2024-25");
assert(insightsSource.includes("10%"), "Insights must keep 10% establishments outside scope");
assert(!insightsSource.includes("Monthly EPF = Basic × (12% + 3.67%)"), "Insights must not keep the old 12% + 3.67% formula");
assert(!/employer contribution = 3\.67%/i.test(insightsSource), "Insights must not say employer contribution = 3.67%");

assert(explainsSource.includes("Monthly PF wages"), "Explains must use Monthly PF wages");
assert(explainsSource.includes("FY 2024-25"), "Explains must identify FY 2024-25");
assert(explainsSource.includes("₹15,000"), "Explains must disclose the ₹15,000 ceiling");
assert(explainsSource.includes("not an EPS member"), "Explains must keep the new joiner / no-EPS case outside scope");
assert(!explainsSource.includes("Monthly basic salary"), "Explains must not treat Basic salary as the wage input");

const statutoryOnly = calculateStatutoryContributions(15000);
assert(statutoryOnly.employeeEPF === 1800, "Dedicated contribution helper must match the engine at ₹15,000");
assert(statutoryOnly.employerEPF === 550, "Dedicated contribution helper must use residual employer EPF");

if (failures.length) {
  console.error(`EPF validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`EPF validation passed: ${checks} checks.`);
console.log(`Framework: ${EPF_LEGAL_FRAMEWORK}`);
console.log(`Ceiling: ₹${EPF_WAGE_CEILING.toLocaleString("en-IN")} (${EPF_WAGE_CEILING_NOTIFICATION})`);
console.log(`₹10,000 → wage ${tenThousand.contributionWage}, employee ${tenThousand.employeeEPF}, employer ${tenThousand.employerTotal}, EPS ${tenThousand.employerEPS}, employer EPF ${tenThousand.employerEPF}`);
console.log(`₹15,000 → wage ${ceilingWages.contributionWage}, employee ${ceilingWages.employeeEPF}, employer ${ceilingWages.employerTotal}, EPS ${ceilingWages.employerEPS}, employer EPF ${ceilingWages.employerEPF}`);
console.log(`₹30,000 → contribution wage ${aboveCeiling.contributionWage}, same contributions as ₹15,000`);
console.log(`Default illustrative rate: ${EPF_ILLUSTRATIVE_INTEREST_RATE}% (${EPF_ILLUSTRATIVE_INTEREST_YEAR})`);
console.log(`₹15,000, balance ₹2,00,000, 20y @ 8.25% → projected ₹${Math.round(projected.projectedBalance)}`);
