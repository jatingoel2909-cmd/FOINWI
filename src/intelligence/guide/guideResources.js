import { ALL_CALCULATORS } from "../../data/calculators.js";
import { LEARNING_PATHS } from "../../data/learnAcademy.js";
import { FINANCIAL_JOURNEYS } from "../../data/journeys.js";
import { isApprovedIntelligencePath } from "../engine/intelligenceAllowlist.js";

const calculatorByPath = new Map(ALL_CALCULATORS.map((calculator) => [calculator.path, calculator]));
const pathBySlug = new Map(LEARNING_PATHS.map((path) => [path.slug, path]));
const journeyBySlug = new Map(FINANCIAL_JOURNEYS.map((journey) => [journey.slug, journey]));

export const GUIDE_RESOURCE_CATALOG = Object.freeze({
  emi: { type: "CALCULATE", path: "/emi-calculator", title: "EMI Calculator", description: "Estimate the monthly payment under different loan assumptions." },
  prepayment: { type: "CALCULATE", path: "/loan-prepayment-calculator", title: "Loan Prepayment Calculator", description: "Explore how an extra payment may affect future interest." },
  eligibility: { type: "CHECK", path: "/home-loan-eligibility-calculator", title: "Home Loan Eligibility Calculator", description: "Explore an illustrative borrowing-capacity estimate." },
  loansLesson: { type: "LEARN", path: "/learn/loans-emi", title: "Loans & EMI", description: "Learn how principal, rate, tenure, and interest connect." },
  sip: { type: "CALCULATE", path: "/sip-calculator", title: "SIP Calculator", description: "Explore a monthly-investment illustration using your assumptions." },
  lumpsum: { type: "CALCULATE", path: "/lumpsum-calculator", title: "Lumpsum Calculator", description: "Explore growth for a one-time investment illustration." },
  cagr: { type: "CALCULATE", path: "/cagr-calculator", title: "CAGR Calculator", description: "Measure an annualised return across a period." },
  swp: { type: "CALCULATE", path: "/swp-calculator", title: "SWP Calculator", description: "Explore periodic withdrawals using a constant-return assumption." },
  investingLesson: { type: "LEARN", path: "/learn/mutual-funds-sip", title: "Mutual Funds & SIP", description: "Understand regular investing, compounding, and market-linked outcomes." },
  fundamentals: { type: "LEARN", path: "/learn/investing-fundamentals", title: "Investing Fundamentals", description: "Build a foundation before exploring long-term investing." },
  goal: { type: "PLAN", path: "/goal-planner", title: "Goal Planner", description: "Turn a future goal into an illustrative monthly saving path." },
  inflation: { type: "CALCULATE", path: "/inflation-calculator", title: "Inflation Calculator", description: "See how today’s cost may change over time." },
  inflationLesson: { type: "LEARN", path: "/learn/money-basics/inflation", title: "Inflation lesson", description: "Learn why prices rising over time can change what money can buy." },
  wealthJourney: { type: "EXPLORE", path: "/journeys/build-wealth", title: "Build Wealth Journey", description: "Explore saving, investing, and goal planning step by step." },
  educationJourney: { type: "PLAN", path: "/journeys/child-education", title: "Child Education Journey", description: "Explore a structured path for an education goal." },
  homeJourney: { type: "PLAN", path: "/journeys/buy-dream-home", title: "Home Buying Journey", description: "Explore down-payment, EMI, and planning steps." },
  retirement: { type: "PLAN", path: "/retirement-calculator", title: "Retirement Calculator", description: "Explore an illustrative retirement-corpus estimate." },
  nps: { type: "CALCULATE", path: "/nps-calculator", title: "NPS Calculator", description: "Explore an educational NPS accumulation and normal-exit illustration." },
  epf: { type: "CALCULATE", path: "/epf-calculator", title: "EPF Calculator", description: "Explore Employees’ Provident Fund corpus assumptions." },
  ppf: { type: "CALCULATE", path: "/ppf-calculator", title: "PPF Calculator", description: "Explore Public Provident Fund growth assumptions." },
  retirementLesson: { type: "LEARN", path: "/learn/retirement-planning", title: "Retirement Planning", description: "Learn how time, inflation, and retirement goals connect." },
  retirementJourney: { type: "EXPLORE", path: "/journeys/retirement-planning", title: "Retirement Planning Journey", description: "Explore retirement planning in smaller educational steps." },
  fd: { type: "CALCULATE", path: "/fd-calculator", title: "FD Calculator", description: "Explore a cumulative fixed-deposit illustration." },
  rd: { type: "CALCULATE", path: "/rd-calculator", title: "RD Calculator", description: "Explore recurring-deposit growth using a simplified model." },
  compound: { type: "CALCULATE", path: "/compound-interest-calculator", title: "Compound Interest Calculator", description: "See how compounding changes an illustrative amount over time." },
  tax: { type: "CALCULATE", path: "/income-tax-calculator", title: "Income Tax Calculator", description: "Explore a tax estimate using the calculator’s stated assumptions." },
  hra: { type: "CALCULATE", path: "/hra-calculator", title: "HRA Calculator", description: "Explore an educational monthly HRA exemption estimate for FY 2026-27." },
  gst: { type: "CALCULATE", path: "/gst-calculator", title: "GST Calculator", description: "Add or remove Goods and Services Tax from an amount." },
  gratuity: { type: "CALCULATE", path: "/gratuity-calculator", title: "Gratuity Calculator", description: "Explore an illustrative gratuity estimate." },
  taxLesson: { type: "LEARN", path: "/learn/income-tax-basics", title: "Income Tax Basics", description: "Learn tax terms and calculator assumptions in plain language." },
  taxJourney: { type: "EXPLORE", path: "/journeys/save-tax", title: "Tax & Salary Journey", description: "Explore tax and salary planning concepts step by step." },
  savingsLesson: { type: "LEARN", path: "/learn/saving-budgeting", title: "Saving & Budgeting", description: "Build practical saving and budgeting habits." },
  moneyBasics: { type: "LEARN", path: "/learn/money-basics", title: "Money Basics", description: "Start with the core ideas behind saving, inflation, and goals." },
  insuranceLesson: { type: "LEARN", path: "/learn/insurance-planning", title: "Insurance Planning", description: "Learn how insurance can transfer specified financial risks." },
  debtJourney: { type: "EXPLORE", path: "/journeys/become-debt-free", title: "Become Debt Free Journey", description: "Explore loan and repayment habits in a structured path." },
  health: { type: "CHECK", path: "/financial-health-score", title: "Financial Health Score", description: "Reflect on savings, debt, protection, and planning habits." },
  exchangeRates: { type: "EXPLORE", path: "/exchange-rates", title: "FOINWI Exchange Rates", description: "Convert using published reference rates. Educational only — not transaction pricing." },
  calculators: { type: "EXPLORE", path: "/calculators", title: "Explore Calculators", description: "Browse FOINWI’s educational calculator library." },
  learn: { type: "LEARN", path: "/learn", title: "Explore Learning", description: "Browse beginner-friendly financial learning paths." },
  intelligence: { type: "EXPLORE", path: "/ai-tools", title: "FOINWI Intelligence", description: "Explore FOINWI’s educational discovery tools." },
  disclaimer: { type: "EXPLORE", path: "/disclaimer", title: "Educational Disclaimer", description: "Read FOINWI’s educational-use boundary." },
});

export function isKnownGuidePath(path) {
  if (isApprovedIntelligencePath(path)) return true;
  if (calculatorByPath.has(path)) return true;
  if (path.startsWith("/learn/")) {
    const remainder = path.slice("/learn/".length);
    const [pathSlug, lessonSlug] = remainder.split("/");
    const learnPath = pathBySlug.get(pathSlug);
    if (!learnPath) return false;
    if (!lessonSlug) return true;
    return learnPath.lessons.some((lesson) => lesson.slug === lessonSlug);
  }
  if (path.startsWith("/journeys/")) return journeyBySlug.has(path.slice("/journeys/".length));
  return false;
}

export function getGuideResources(resourceIds = []) {
  return resourceIds
    .map((resourceId) => {
      const resource = GUIDE_RESOURCE_CATALOG[resourceId];
      if (!resource) return null;
      return { ...resource, resourceId };
    })
    .filter((resource) => resource && isApprovedIntelligencePath(resource.path));
}

export function validateGuideResources() {
  return Object.entries(GUIDE_RESOURCE_CATALOG)
    .filter(([, resource]) => !isApprovedIntelligencePath(resource.path))
    .map(([id, resource]) => ({ id, path: resource.path }));
}

export function getGuideResourceById(resourceId) {
  const resource = GUIDE_RESOURCE_CATALOG[resourceId];
  if (!resource || !isApprovedIntelligencePath(resource.path)) return null;
  return { ...resource, resourceId };
}
