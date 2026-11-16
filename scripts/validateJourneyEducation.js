/**
 * Confirms the seven mission journeys link to real lessons and that
 * illustrative figures match the existing calculator engines.
 *
 * Run: npm run validate:journey-education
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FINANCIAL_JOURNEYS } from "../src/data/journeys.js";
import { JOURNEY_EDUCATION } from "../src/data/journeyEducation.js";
import { getLessonByRoute } from "../src/data/learnAcademy.js";
import { formatCurrency } from "../src/utils/calculatorFormat.js";
import { calculateEmi } from "../src/utils/emiFormula.js";
import { calculateLoanEligibility } from "../src/utils/loanEligibilityEngine.js";
import { calculateIncomeTaxEstimate } from "../src/utils/incomeTax/incomeTaxEngine.js";
import { INCOME_TAX_REGIMES } from "../src/utils/incomeTax/incomeTaxRules.js";
import { calculateEpfEstimate } from "../src/utils/epf/epfEngine.js";
import { calculateHraEstimate } from "../src/utils/hra/hraEngine.js";
import { HRA_CITY_CATEGORY_50 } from "../src/utils/hra/hraRules.js";
import { calculateGstEstimate } from "../src/utils/gst/gstEngine.js";
import {
  formatGstMoney,
  GST_DEFAULT_AMOUNT,
  GST_DEFAULT_RATE_PERCENT,
  GST_MODE_ADD,
} from "../src/utils/gst/gstRules.js";
import { calculateRetirementEstimate } from "../src/utils/retirement/retirementEngine.js";
import { RETIREMENT_DEFAULTS } from "../src/utils/retirement/retirementRules.js";

const sourceRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const EXPECTED_SLUGS = [
  "buy-dream-home",
  "save-tax",
  "child-education",
  "buy-your-car",
  "retirement-planning",
  "become-debt-free",
  "protect-your-family",
];
const UNLINKED_MODULES = {
  "become-debt-free": ["Listing balances, without a credit score"],
  "protect-your-family": ["Recording documents, without drafting a will"],
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const money = (value) => formatCurrency(value);

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
  return {
    emi,
    interestSaved: Math.max(0, originalInterest - newInterest),
    revisedImpact: `${Math.round(((months - newMonths) / 12) * 10) / 10} years saved`,
  };
}

function lessonFromPath(path) {
  const [, pathSlug, lessonSlug] = path.match(/^\/learn\/([^/]+)\/([^/]+)$/u) ?? [];
  return getLessonByRoute(pathSlug, lessonSlug);
}

function assertLesson(path, title, label) {
  const lesson = lessonFromPath(path);
  assert(lesson?.contentStatus === "complete", `${label} is not a complete lesson: ${path}`);
  assert(lesson.title === title, `${label} title does not match ${path}`);
}

const educationText = JSON.stringify(JOURNEY_EDUCATION);
assert(
  JSON.stringify(Object.keys(JOURNEY_EDUCATION)) === JSON.stringify(EXPECTED_SLUGS),
  "Journey education must cover the seven thin journeys in sitemap order",
);
assert(!JOURNEY_EDUCATION["build-wealth"], "build-wealth must stay on its existing journey page");
assert(!/\b(guaranteed|approved|best|lowest|certain|official approval)\b/iu.test(educationText), "Journey education uses disallowed financial wording");
assert(!/coming soon/iu.test(educationText), "Journey education must not add a coming-soon block");

const journeys = new Map(FINANCIAL_JOURNEYS.map((journey) => [journey.slug, journey]));
assert(
  journeys.get("build-wealth").overview.includes("consistent investing, realistic return assumptions"),
  "build-wealth overview must stay unchanged",
);

for (const slug of EXPECTED_SLUGS) {
  const education = JOURNEY_EDUCATION[slug];
  const journey = journeys.get(slug);
  assert(education.purpose.length >= 2, `${slug} needs a decision and a purpose`);
  assert(education.assumptions.length >= 3, `${slug} needs assumptions`);
  assert(education.limitations.length >= 3, `${slug} needs limitations`);
  assert(education.mistakes.length >= 3, `${slug} needs common mistakes`);
  assert(education.scenario.length >= 1, `${slug} needs a labeled scenario`);
  assertLesson(education.nextLesson.path, education.nextLesson.title, `${slug} next lesson`);
  for (const lesson of education.alsoRead ?? []) {
    assertLesson(lesson.path, lesson.title, `${slug} extra lesson`);
  }

  const linkedTitles = Object.keys(education.moduleLessons);
  const allowedMissing = new Set(UNLINKED_MODULES[slug] ?? []);
  for (const title of journey.learningModules) {
    if (allowedMissing.has(title)) {
      assert(!education.moduleLessons[title], `${slug} should not invent a lesson for ${title}`);
      continue;
    }
    assert(education.moduleLessons[title], `${slug} is missing a lesson for ${title}`);
  }
  for (const title of linkedTitles) {
    assert(journey.learningModules.includes(title), `${slug} links an unknown module: ${title}`);
    const lesson = education.moduleLessons[title];
    assertLesson(lesson.path, lesson.title, `${slug} module ${title}`);
  }
}

const home = calculateLoanEligibility({
  monthlyIncome: 100000,
  existingMonthlyObligations: 10000,
  annualInterestRate: 8.5,
  tenureMonths: 240,
  foirPercent: 50,
});
const emi = calculateEmi(5000000, 8.5, 20);
const carFive = calculateEmi(800000, 9, 5);
const carSeven = calculateEmi(800000, 9, 7);
const inflation = 100000 * (1.06 ** 10);
const goalMonthlyRate = 12 / 12 / 100;
const goalProjected = 200000 * (1 + goalMonthlyRate) ** (10 * 12) + futureValueOfMonthlyDeposits(15000, 12, 10);
const retirement = calculateRetirementEstimate(RETIREMENT_DEFAULTS);
const epf = calculateEpfEstimate({
  monthlyPFWages: 30000,
  currentBalance: 200000,
  annualInterestRate: 8.25,
  years: 20,
});
const prepayment = calculatePagePrepayment();
const fd = compoundValue(500000, 7, 5, 4);
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
const gst = calculateGstEstimate({
  amount: GST_DEFAULT_AMOUNT,
  gstRatePercent: GST_DEFAULT_RATE_PERCENT,
  mode: GST_MODE_ADD,
});

const requiredText = {
  "buy-dream-home": [money(home.estimatedAvailableEmi), money(home.estimatedEligibleLoan), money(emi), money(emi * 240 - 5000000), money(emi * 240)],
  "save-tax": [money(tax.taxableIncome), money(tax.estimatedTax), money(hra.estimatedMonthlyExemption), formatGstMoney(gst.gstAmount), formatGstMoney(gst.invoiceValue)],
  "child-education": [money(inflation), money(goalProjected), money(5000000 - goalProjected)],
  "buy-your-car": [money(carFive), money(carFive * 60 - 800000), money(carSeven), money(carSeven * 84 - 800000)],
  "retirement-planning": [money(retirement.primaryRequiredCorpus), money(retirement.shortfall), money(retirement.simple25xComparison), money(epf.projectedBalance), money(epf.contributionWage)],
  "become-debt-free": [money(prepayment.emi), money(prepayment.interestSaved), prepayment.revisedImpact],
  "protect-your-family": [money(fd), money(fd - 500000), money(inflation)],
};

for (const [slug, tokens] of Object.entries(requiredText)) {
  const blob = JSON.stringify(JOURNEY_EDUCATION[slug]);
  for (const token of tokens) {
    assert(blob.includes(String(token)), `${slug} is missing verified figure ${token}`);
  }
}

const missionPage = readFileSync(join(sourceRoot, "src/pages/MissionJourneyPage.jsx"), "utf8");
assert(missionPage.includes("getJourneyEducation"), "Mission pages must be able to render journey education");
assert(missionPage.includes("Illustrative scenario"), "Illustrative scenarios must be visibly labeled");

const lender = readFileSync(join(sourceRoot, "src/components/emi/EmiLenderComparison.jsx"), "utf8");
assert(lender.includes("ENABLE_LENDER_COMPARISON"), "Lender comparison flag must still gate the comparison");
assert(lender.includes("What this EMI illustration includes"), "EMI page must explain the existing illustration");
assert(!/coming soon/iu.test(lender), "EMI comparison block must not say coming soon");
const emiPage = readFileSync(join(sourceRoot, "src/components/EmiCalculator.jsx"), "utf8");
assert(emiPage.includes("They do not compare lenders."), "Closed EMI section must not advertise a lender comparison");
assert(emiPage.includes("ENABLE_LENDER_COMPARISON"), "EMI page must keep the lender-comparison flag");

const schedule = readFileSync(join(sourceRoot, "src/components/emi/AmortizationSchedule.jsx"), "utf8");
assert(!schedule.includes("Download CSV"), "Amortization page must not offer CSV download");
assert(schedule.includes("emi-amort-tab-monthly") && schedule.includes("emi-amort-tab-yearly"), "Monthly and yearly schedules must remain");

const aiTools = readFileSync(join(sourceRoot, "src/pages/AiToolsPage.jsx"), "utf8");
assert(aiTools.includes("not a chatbot and not live AI assistance"), "AI Tools must say the assistant is not live");
assert(aiTools.includes("The Financial Health Score tool itself is available today"), "Financial Health Score must stay described as available");
assert(!/<textarea\b/iu.test(aiTools), "AI Tools must not gain a chat box");

console.log("Journey education validation passed (7 journeys)");
