import { ALL_CALCULATORS } from "../data/calculators";
import { FINANCIAL_JOURNEYS } from "../data/journeys";
import {
  HEALTH_SCORE_CATEGORIES,
  HEALTH_SCORE_QUESTIONS,
} from "../data/healthScoreQuestions";

const MAX_QUESTION_SCORE = 10;

const LEARN_MODULES = [
  { title: "Investing Basics", path: "/learn", topic: "investments" },
  { title: "Loans & EMI", path: "/learn", topic: "debt" },
  { title: "Tax & Salary Planning", path: "/learn", topic: "planning" },
  { title: "Retirement Planning", path: "/learn", topic: "planning" },
  { title: "Financial Calculators", path: "/learn", topic: "general" },
  { title: "Emergency Fund", path: "/learn", topic: "savings" },
  { title: "Salary Planning", path: "/learn", topic: "savings" },
  { title: "Insurance Basics", path: "/learn", topic: "protection" },
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
  savings: "You show disciplined saving habits or expense awareness.",
  investments: "You have active investment participation beyond basic savings.",
  protection: "You maintain financial safety nets through insurance or emergency reserves.",
  debt: "Your borrowing profile appears manageable with healthy credit habits.",
  planning: "You think ahead with goals, tax awareness, or retirement planning.",
};

const IMPROVE_MESSAGES = {
  savings: "Building a consistent savings rate and tracking expenses can strengthen your foundation.",
  investments: "Starting or regularising SIP and retirement contributions can help long-term growth.",
  protection: "An emergency fund and adequate insurance can reduce financial vulnerability.",
  debt: "Reviewing loan obligations and credit card usage can improve financial flexibility.",
  planning: "Clearer goals, tax planning, and retirement estimates can improve long-term clarity.",
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
    "This can help you understand why an emergency fund is often recommended before aggressive investing.",
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

function getQuestionScore(question, answer) {
  if (answer === undefined || answer === null || answer === "") return 0;

  if (question.type === "slider") {
    return question.scoreFromValue(Number(answer));
  }

  const option = question.options.find((item) => item.value === answer);
  return option?.score ?? 0;
}

function getScoreBand(score) {
  if (score >= 90) return { label: "Excellent", tone: "excellent" };
  if (score >= 75) return { label: "Strong", tone: "strong" };
  if (score >= 60) return { label: "On Track", tone: "on-track" };
  if (score >= 40) return { label: "Building Foundation", tone: "building" };
  return { label: "Needs Attention", tone: "needs-attention" };
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
  return LEARN_MODULES.filter((module) => topics.has(module.topic)).slice(0, limit);
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
    : ["You have started assessing your financial habits — awareness is a useful first step."];

  const improvements = weakest.length
    ? weakest.map((item) => IMPROVE_MESSAGES[item.id])
    : ["Continue reviewing your habits periodically to maintain balanced financial health."];

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
