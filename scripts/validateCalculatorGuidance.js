/**
 * Confirms the visible calculator guidance uses existing engines,
 * existing assumption and limitation copy, and real lesson routes.
 *
 * Worked-example figures are recomputed from the same default inputs the
 * calculator pages show. This script does not change calculator formulas.
 *
 * Run: npm run validate:calculator-guidance
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_CALCULATORS } from "../src/data/calculators.js";
import { CALCULATOR_GUIDANCE } from "../src/data/calculatorGuidance.js";
import { getCalculatorExplain } from "../src/data/calculatorExplains.js";
import { getCalculatorInsights } from "../src/data/calculatorInsights.js";
import { getLessonByRoute } from "../src/data/learnAcademy.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";
import { calculateEmi } from "../src/utils/emiFormula.js";
import { calculateLoanEligibility } from "../src/utils/loanEligibilityEngine.js";
import { calculateIncomeTaxEstimate } from "../src/utils/incomeTax/incomeTaxEngine.js";
import { INCOME_TAX_REGIMES } from "../src/utils/incomeTax/incomeTaxRules.js";
import { calculateGratuityEstimate } from "../src/utils/gratuity/gratuityEngine.js";
import { calculateEpfEstimate } from "../src/utils/epf/epfEngine.js";
import { calculatePpfEstimate } from "../src/utils/ppf/ppfEngine.js";
import { calculateHraEstimate } from "../src/utils/hra/hraEngine.js";
import { HRA_CITY_CATEGORY_50 } from "../src/utils/hra/hraRules.js";
import { calculateNpsEstimate } from "../src/utils/nps/npsEngine.js";
import {
  NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT,
  NPS_DEFAULT_ANNUITY_RATE_PERCENT,
  NPS_DEFAULT_ILLUSTRATIVE_RETURN_PERCENT,
} from "../src/utils/nps/npsRules.js";
import { calculateGstEstimate } from "../src/utils/gst/gstEngine.js";
import {
  formatGstMoney,
  GST_DEFAULT_AMOUNT,
  GST_DEFAULT_RATE_PERCENT,
  GST_MODE_ADD,
  GST_STARTING_VALUE_NOTE,
} from "../src/utils/gst/gstRules.js";
import { calculateRetirementEstimate } from "../src/utils/retirement/retirementEngine.js";
import { RETIREMENT_DEFAULTS } from "../src/utils/retirement/retirementRules.js";

const sourceRoot = dirname(dirname(fileURLToPath(import.meta.url)));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const money = (value) => formatCurrency(value);
const percent = (value) => `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value)}%`;

function futureValueOfMonthlyDeposits(monthly, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return monthly * months;
  return monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
}

function compoundValue(principal, annualRate, years, periodsPerYear) {
  if (annualRate === 0) return principal;
  return principal * (1 + annualRate / 100 / periodsPerYear) ** (periodsPerYear * years);
}

function calculateSwp(corpus, monthlyWithdrawal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  let balance = corpus;
  let totalWithdrawal = 0;
  let monthsSustained = 0;

  for (let month = 0; month < months; month += 1) {
    balance *= 1 + monthlyRate;
    const availableBalance = Math.max(balance, 0);
    const actualWithdrawal = Math.min(monthlyWithdrawal, availableBalance);
    balance = availableBalance - actualWithdrawal;
    totalWithdrawal += actualWithdrawal;
    monthsSustained += 1;
    if (balance === 0) break;
  }

  const remainingValue = Math.max(balance, 0);
  return {
    remainingValue,
    totalWithdrawal,
    monthsSustained,
    depletedEarly: remainingValue === 0 && monthsSustained < months,
  };
}

function calculatePagePrepayment() {
  const outstanding = 3000000;
  const annualRate = 9;
  const years = 15;
  const prepayment = 200000;
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  const factor = (1 + monthlyRate) ** months;
  const emi = (outstanding * monthlyRate * factor) / (factor - 1);
  const originalInterest = emi * months - outstanding;
  const newOutstanding = outstanding - prepayment;
  const newMonths = Math.ceil(
    Math.log(emi / (emi - newOutstanding * monthlyRate)) / Math.log(1 + monthlyRate),
  );
  const newInterest = emi * newMonths - newOutstanding;
  const interestSaved = Math.max(0, originalInterest - newInterest);
  const monthsSaved = months - newMonths;
  const revisedImpact = monthsSaved >= 12
    ? `${Math.round((monthsSaved / 12) * 10) / 10} years saved`
    : `${monthsSaved} months saved`;
  return { emi, interestSaved, newOutstanding, revisedImpact };
}

const sipFuture = futureValueOfMonthlyDeposits(10000, 12, 15);
const emi = calculateEmi(5000000, 8.5, 20);
const emiMonths = 240;
const fd = compoundValue(500000, 7, 5, 4);
const ppf = calculatePpfEstimate({
  annualContribution: 150000,
  illustrativeAnnualRate: 7.1,
  contributionYears: 15,
});
const retirement = calculateRetirementEstimate(RETIREMENT_DEFAULTS);
const goalSip = futureValueOfMonthlyDeposits(15000, 12, 10);
const goalMonthlyRate = 12 / 12 / 100;
const goalSavings = 200000 * (1 + goalMonthlyRate) ** (10 * 12);
const goalProjected = goalSavings + goalSip;
const goalGap = 5000000 - goalProjected;
const cagr = ((250000 / 100000) ** (1 / 5) - 1) * 100;
const lumpsum = 500000 * (1.12 ** 10);
const rd = futureValueOfMonthlyDeposits(5000, 7, 5);
const swp = calculateSwp(5000000, 25000, 10, 15);
const inflation = 100000 * (1.06 ** 10);
const gratuity = calculateGratuityEstimate({
  lastDrawnStatutoryWages: 50000,
  completedYears: 10,
  additionalMonths: 0,
});
const epf = calculateEpfEstimate({
  monthlyPFWages: 30000,
  currentBalance: 200000,
  annualInterestRate: 8.25,
  years: 20,
});
const nps = calculateNpsEstimate({
  monthlyContribution: 5000,
  illustrativeAnnualReturnPercent: NPS_DEFAULT_ILLUSTRATIVE_RETURN_PERCENT,
  currentAge: 30,
  exitAge: 60,
  annuityAllocationPercent: NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT,
  illustrativeAnnuityRatePercent: NPS_DEFAULT_ANNUITY_RATE_PERCENT,
});
const home = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
const prepayment = calculatePagePrepayment();
const gst = calculateGstEstimate({
  amount: GST_DEFAULT_AMOUNT,
  gstRatePercent: GST_DEFAULT_RATE_PERCENT,
  mode: GST_MODE_ADD,
});
const tax = calculateIncomeTaxEstimate({
  annualSalaryIncome: 1200000,
  eligibleDeductions: 0,
  regime: INCOME_TAX_REGIMES.NEW,
});
const hra = calculateHraEstimate({
  monthlyBasicSalary: 50000,
  monthlyQualifyingDA: 0,
  monthlyHraReceived: 20000,
  monthlyRentPaid: 18000,
  residenceCategory: HRA_CITY_CATEGORY_50,
});
const compound = compoundValue(100000, 8, 10, 1);

const requiredOutcomeText = {
  "/sip-calculator": [money(sipFuture), money(10000 * 15 * 12), money(sipFuture - 1800000)],
  "/emi-calculator": [money(emi), money(emi * emiMonths - 5000000), money(emi * emiMonths)],
  "/fd-calculator": [money(fd), money(fd - 500000)],
  "/ppf-calculator": [money(ppf.estimatedBalance), money(ppf.totalContributed), money(ppf.interestEarned)],
  "/retirement-calculator": [
    money(retirement.monthlyExpenseAtRetirement),
    money(retirement.primaryRequiredCorpus),
    money(retirement.projectedExistingCorpus),
    money(retirement.shortfall),
    money(retirement.monthlyContributionRequired),
    money(retirement.simple25xComparison),
  ],
  "/goal-planner": [money(goalProjected), money(Math.abs(goalGap))],
  "/cagr-calculator": [percent(cagr), money(150000)],
  "/lumpsum-calculator": [money(lumpsum), money(lumpsum - 500000)],
  "/rd-calculator": [money(rd), money(300000), money(rd - 300000)],
  "/swp-calculator": [money(swp.remainingValue), money(swp.totalWithdrawal)],
  "/inflation-calculator": [money(inflation), money(inflation - 100000)],
  "/gratuity-calculator": [money(gratuity.estimatedGratuity), "10"],
  "/epf-calculator": [money(epf.contributionWage), money(epf.monthlyEpfEnteringCorpus), money(epf.projectedBalance)],
  "/nps-calculator": [
    money(nps.projectedCorpus),
    money(nps.totalContributed),
    money(nps.annuityAllocation),
    money(nps.illustrativeLumpSum),
    money(nps.illustrativeMonthlyAnnuity),
  ],
  "/home-loan-eligibility-calculator": [money(home.estimatedAvailableEmi), money(home.estimatedEligibleLoan)],
  "/loan-prepayment-calculator": [
    money(prepayment.emi),
    money(prepayment.newOutstanding),
    money(prepayment.interestSaved),
    prepayment.revisedImpact,
  ],
  "/gst-calculator": [
    formatGstMoney(gst.gstAmount),
    formatGstMoney(gst.invoiceValue),
    GST_STARTING_VALUE_NOTE,
  ],
  "/income-tax-calculator": [
    money(tax.incomeConsidered),
    money(tax.standardDeduction),
    money(tax.taxableIncome),
    money(tax.slabTax),
    money(tax.rebate),
    money(tax.cess),
    money(tax.estimatedTax),
  ],
  "/hra-calculator": [
    money(hra.rule279Salary),
    money(hra.estimatedMonthlyExemption),
    money(hra.monthlyTaxableHra),
  ],
  "/compound-interest-calculator": [money(compound), money(compound - 100000)],
};

assert(ALL_CALCULATORS.length === 20, "FOINWI should expose 20 public calculators");
assert(Object.keys(CALCULATOR_GUIDANCE).length === 20, "Guidance must cover all 20 calculators");
assert(!swp.depletedEarly && swp.monthsSustained === 180, "SWP default example must survive the full tenure");
assert(goalGap > 0, "Goal planner default example must be a gap");
assert(gratuity.qualifyingYears === 10, "Gratuity default example must use 10 qualifying years");
assert(tax.estimatedTax === 0, "Income-tax default example must match the new-regime zero-tax vector");
assert(hra.estimatedMonthlyExemption === 13000, "HRA default example must match the rent-limb vector");
assert(gst.gstAmount === 1800 && gst.invoiceValue === 11800, "GST default example must match the add-mode vector");

for (const calculator of ALL_CALCULATORS) {
  const guidance = CALCULATOR_GUIDANCE[calculator.path];
  const insights = getCalculatorInsights(calculator.path);
  const explain = getCalculatorExplain(calculator.path);
  assert(guidance, `${calculator.path} is missing visible guidance`);
  assert(Array.isArray(guidance.lines) && guidance.lines.length >= 3, `${calculator.path} needs a worked example`);
  assert(typeof guidance.outcome === "string" && guidance.outcome.length > 20, `${calculator.path} needs an example result`);
  assert(insights?.howCalculated?.summary, `${calculator.path} is missing its existing assumption summary`);
  assert(insights.howCalculated.inputs?.length > 0, `${calculator.path} is missing existing assumption inputs`);
  assert(explain?.beginnerMistakes?.length > 0, `${calculator.path} is missing existing limitations`);

  const tokens = requiredOutcomeText[calculator.path];
  assert(tokens, `${calculator.path} has no recomputed example check`);
  tokens.forEach((token) => {
    assert(
      guidance.outcome.includes(String(token)),
      `${calculator.path} worked example is missing verified text: ${token}`,
    );
  });

  const lessonPath = guidance.lesson?.path ?? "";
  const [, pathSlug, lessonSlug] = lessonPath.match(/^\/learn\/([^/]+)\/([^/]+)$/u) ?? [];
  const lesson = getLessonByRoute(pathSlug, lessonSlug);
  assert(lesson?.contentStatus === "complete", `${calculator.path} lesson route is not a complete lesson`);
  assert(lesson.title === guidance.lesson.title, `${calculator.path} lesson title does not match the academy`);
  assert(
    lesson.calculatorLinks.includes(calculator.path),
    `${calculator.path} lesson does not already name this calculator`,
  );
}

const layoutSource = readFileSync(join(sourceRoot, "src/components/ui/CalculatorLayout.jsx"), "utf8");
assert(layoutSource.includes("CalculatorGuidance"), "Calculator pages must render the visible guidance");
assert(layoutSource.includes("CalculatorExplainEngine"), "Explain My Result must stay on the calculator pages");

console.log("Calculator guidance validation passed (20 calculators)");
