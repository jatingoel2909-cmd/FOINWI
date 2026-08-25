import { ALL_CALCULATORS } from "../data/calculators.js";
import { FINANCIAL_JOURNEYS } from "../data/journeys.js";
import {
  HEALTH_SCORE_CATEGORIES,
  HEALTH_SCORE_QUESTIONS,
} from "../data/healthScoreQuestions.js";

const MAX_QUESTION_SCORE = 10;

export const HEALTH_SCORE_LEARN_MODULES = [
  { title: "Investing Basics", path: "/learn/investing-fundamentals", topic: "investments" },
  { title: "Loans & EMI", path: "/learn/loans-emi", topic: "debt" },
  { title: "Tax & Salary Planning", path: "/learn/income-tax-basics", topic: "planning" },
  { title: "Retirement Planning", path: "/learn/retirement-planning", topic: "planning" },
  { title: "Financial Calculators", path: "/calculators", topic: "general" },
  { title: "Emergency Fund", path: "/learn/saving-budgeting", topic: "savings" },
  { title: "Money Basics", path: "/learn/money-basics", topic: "savings" },
  { title: "Insurance Basics", path: "/learn/insurance-planning", topic: "protection" },
];

const CATEGORY_CALCULATORS = {
  savings: ["/goal-planner", "/fd-calculator", "/rd-calculator", "/sip-calculator"],
  investments: ["/sip-calculator", "/lumpsum-calculator", "/cagr-calculator", "/ppf-calculator"],
  protection: ["/goal-planner", "/inflation-calculator", "/retirement-calculator"],
  debt: ["/emi-calculator", "/loan-prepayment-calculator", "/home-loan-eligibility-calculator"],
  planning: ["/goal-planner", "/retirement-calculator", "/income-tax-calculator", "/inflation-calculator"],
};

const CATEGORY_MISSIONS = {
  savings: "build-wealth",
  investments: "build-wealth",
  protection: "protect-your-family",
  debt: "become-debt-free",
  planning: "retirement-planning",
};

const STRENGTH_MESSAGES = {
  savings: "Savings scored relatively higher than some other areas in this reflection.",
  investments: "Investments scored relatively higher than some other areas in this reflection.",
  protection: "Protection scored relatively higher than some other areas in this reflection.",
  debt: "Debt-related answers scored relatively higher than some other areas in this reflection.",
  planning: "Planning scored relatively higher than some other areas in this reflection.",
};

const IMPROVE_MESSAGES = {
  savings: "Learning more about a regular savings rate and expense tracking may help you review this area.",
  investments: "Exploring SIP and retirement contribution concepts may help you review this area.",
  protection: "Emergency-fund and insurance concepts may help you review protection as part of money habits.",
  debt: "Reviewing loan and credit-card concepts may help you understand this area more clearly.",
  planning: "Written goals, retirement estimates, and tax basics may help you review long-term planning.",
};

const RECOMMENDATIONS = {
  savings: [
    "This can help you understand how a monthly savings rate affects future corpus using the Goal Planner.",
    "Tracking expenses for one month may reveal simple areas to redirect toward savings.",
    "An emergency fund target of 3–6 months of expenses is a common educational benchmark.",
  ],
  investments: [
    "This can help you understand how regular SIP contributions compound over time.",
    "Exploring EPF and NPS projections may clarify your existing retirement contributions.",
    "Comparing lumpsum vs SIP scenarios can illustrate different investment approaches.",
  ],
  protection: [
    "This can help you understand why an emergency fund is often discussed before aggressive investing.",
    "Reviewing term and health insurance concepts may clarify protection gaps.",
    "Inflation estimates can show why protection planning needs to account for rising costs.",
  ],
  debt: [
    "This can help you understand how EMI structure affects total interest paid over a loan tenure.",
    "Loan prepayment scenarios may illustrate how extra payments reduce interest burden.",
    "Checking loan eligibility estimates can help you understand borrowing capacity before new loans.",
  ],
  planning: [
    "This can help you understand how written goals with timelines create clearer financial direction.",
    "Retirement corpus estimates can illustrate the gap between current savings and future needs.",
    "Tax calculator comparisons may help you understand Old vs New regime differences educationally.",
  ],
};

export function questionAffectsScore(question) {
  return question?.scoring !== false;
}

function getQuestionScore(question, answer) {
  if (!questionAffectsScore(question)) return null;
  if (answer === undefined || answer === null || answer === "") return 0;

  if (question.type === "slider") {
    return question.scoreFromValue(Number(answer));
  }

  const option = question.options.find((item) => item.value === answer);
  return option?.score ?? 0;
}

function getScoreBand(score) {
  if (score >= 90) return { label: "Higher range", tone: "excellent" };
  if (score >= 75) return { label: "Upper-middle range", tone: "strong" };
  if (score >= 60) return { label: "Middle range", tone: "on-track" };
  if (score >= 40) return { label: "Developing range", tone: "building" };
  return { label: "Lower range", tone: "needs-attention" };
}

function getCalculatorsByPaths(paths) {
  return paths
    .map((path) => ALL_CALCULATORS.find((calc) => calc.path === path))
    .filter(Boolean)
    .slice(0, 4);
}

function getLearnModules(categoryIds, limit = 3) {
  const topicMap = {
    savings: ["savings", "general"],
    investments: ["investments", "general"],
    protection: ["protection", "general"],
    debt: ["debt", "general"],
    planning: ["planning", "general"],
  };

  const topics = new Set(categoryIds.flatMap((id) => topicMap[id] || ["general"]));
  return HEALTH_SCORE_LEARN_MODULES.filter((module) => topics.has(module.topic)).slice(0, limit);
}

function getSuggestedMission(weakestCategories) {
  const primary = weakestCategories[0]?.id;
  const slug = CATEGORY_MISSIONS[primary] || "build-wealth";
  return FINANCIAL_JOURNEYS.find((journey) => journey.slug === slug) || FINANCIAL_JOURNEYS[1];
}

export function calculateHealthScore(answers) {
  const questionScores = {};
  const categoryTotals = Object.fromEntries(
    HEALTH_SCORE_CATEGORIES.map(({ id }) => [id, { earned: 0, max: 0 }]),
  );

  HEALTH_SCORE_QUESTIONS.forEach((question) => {
    const score = getQuestionScore(question, answers[question.id]);
    questionScores[question.id] = score;

    if (!questionAffectsScore(question) || score === null) return;

    const bucket = categoryTotals[question.category];
    bucket.earned += score;
    bucket.max += MAX_QUESTION_SCORE;
  });

  const categoryScores = HEALTH_SCORE_CATEGORIES.map(({ id, label, icon }) => {
    const { earned, max } = categoryTotals[id];
    const score = max > 0 ? Math.round((earned / max) * 100) : 0;
    return { id, label, icon, score };
  });

  const overallScore = Math.round(
    categoryScores.reduce((sum, item) => sum + item.score, 0) / categoryScores.length,
  );

  const sortedCategories = [...categoryScores].sort((a, b) => a.score - b.score);
  const strongest = sortedCategories.filter((item) => item.score >= 70).slice(-3).reverse();
  const weakest = sortedCategories.filter((item) => item.score < 70).slice(0, 3);

  const strengths = strongest.length
    ? strongest.map((item) => STRENGTH_MESSAGES[item.id])
    : ["Completing this reflection can help you notice which money areas scored relatively higher today."];

  const improvements = weakest.length
    ? weakest.map((item) => IMPROVE_MESSAGES[item.id])
    : ["You may revisit this reflection later to see whether your answers still match your current habits."];

  const recommendations = weakest.length
    ? weakest.flatMap((item) => RECOMMENDATIONS[item.id].slice(0, 1))
    : RECOMMENDATIONS.planning.slice(0, 2);

  const suggestedMission = getSuggestedMission(weakest.length ? weakest : sortedCategories);

  const calcPaths = new Set();
  (weakest.length ? weakest : sortedCategories.slice(0, 2)).forEach((item) => {
    CATEGORY_CALCULATORS[item.id]?.forEach((path) => calcPaths.add(path));
  });
  const suggestedCalculators = getCalculatorsByPaths([...calcPaths]);

  const suggestedLearn = getLearnModules(
    weakest.length ? weakest.map((item) => item.id) : ["planning"],
    4,
  );

  return {
    overallScore,
    band: getScoreBand(overallScore),
    categoryScores,
    strengths,
    improvements,
    recommendations,
    suggestedMission,
    suggestedCalculators,
    suggestedLearn,
    questionScores,
  };
}

export function getDefaultAnswers() {
  return Object.fromEntries(
    HEALTH_SCORE_QUESTIONS.map((question) => [
      question.id,
      question.type === "slider" ? question.defaultValue : "",
    ]),
  );
}

export function isQuestionAnswered(question, value) {
  if (question.type === "slider") return value !== undefined && value !== null;
  return Boolean(value);
}
