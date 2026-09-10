/**
 * FOINWI Recommendation Engine — context resolution and rule templates.
 * Educational guidance only. No product or provider recommendations.
 */

import { DAILY_FINANCIAL_INSIGHT } from "../../data/foinwiGuide.js";
import { FINANCIAL_CONCEPTS } from "../knowledge/financialConcepts.js";
import { CONCEPT_ADJACENCY } from "../knowledge/conceptGraph.js";
import { createRecommendationItem } from "./recommendationTypes.js";

/** Calculator path → primary concept id */
export const CALCULATOR_CONCEPT_MAP = {
  "/sip-calculator": "sip",
  "/lumpsum-calculator": "mutual-funds",
  "/cagr-calculator": "compounding",
  "/compound-interest-calculator": "compounding",
  "/goal-planner": "goal-planning",
  "/inflation-calculator": "inflation",
  "/fd-calculator": "fd",
  "/rd-calculator": "rd",
  "/ppf-calculator": "ppf",
  "/epf-calculator": "epf",
  "/nps-calculator": "nps",
  "/swp-calculator": "retirement",
  "/retirement-calculator": "retirement",
  "/emi-calculator": "emi",
  "/loan-prepayment-calculator": "debt",
  "/home-loan-eligibility-calculator": "debt",
  "/income-tax-calculator": "tax",
  "/hra-calculator": "tax",
  "/gst-calculator": "tax",
  "/gratuity-calculator": "retirement",
};

/** Learn path slug → primary concept id */
export const LESSON_CONCEPT_MAP = {
  "money-basics": "savings",
  "saving-budgeting": "budgeting",
  "investing-fundamentals": "compounding",
  "mutual-funds-sip": "sip",
  "loans-emi": "emi",
  "income-tax-basics": "tax",
  "insurance-planning": "insurance",
  "retirement-planning": "retirement",
};

/** Journey / mission slug → primary concept id */
export const JOURNEY_CONCEPT_MAP = {
  "build-wealth": "sip",
  "retirement-planning": "retirement",
  "become-debt-free": "debt",
  "buy-dream-home": "debt",
  "buy-your-car": "debt",
  "protect-your-family": "emergency-fund",
  "save-tax": "tax",
  "child-education": "goal-planning",
};

/** Health score topic → priority concept ids */
export const HEALTH_TOPIC_CONCEPTS = {
  savings: ["emergency-fund", "budgeting", "savings", "goal-planning"],
  investments: ["sip", "mutual-funds", "compounding", "asset-allocation"],
  protection: ["emergency-fund", "insurance", "goal-planning"],
  debt: ["debt", "emi", "credit-score", "budgeting"],
  planning: ["goal-planning", "retirement", "tax", "inflation"],
};

/** Concept-specific rule boosts with educational reasons */
export const CONCEPT_RULE_BOOSTS = {
  sip: [
    { type: "nextLesson", slug: "mutual-funds-sip", baseScore: 88, reason: "Explore how SIPs work within mutual fund investing." },
    { type: "nextCalculator", path: "/goal-planner", baseScore: 82, reason: "Estimate the corpus a monthly SIP could support toward a goal." },
    { type: "nextJourney", slug: "build-wealth", baseScore: 90, reason: "Follow a structured path for SIP planning and long-term wealth habits." },
    { type: "relatedConcepts", conceptId: "compounding", baseScore: 78, reason: "Compounding explains how regular SIP contributions may grow over time." },
    { type: "relatedConcepts", conceptId: "inflation", baseScore: 72, reason: "Inflation affects the real value of long-term SIP projections." },
  ],
  emi: [
    { type: "nextLesson", slug: "loans-emi", baseScore: 90, reason: "Understand EMI structure, tenure, and total interest cost." },
    { type: "nextCalculator", path: "/loan-prepayment-calculator", baseScore: 85, reason: "Compare how prepayments may reduce interest over a loan tenure." },
    { type: "nextCalculator", path: "/home-loan-eligibility-calculator", baseScore: 80, reason: "Estimate borrowing capacity before committing to a home loan." },
    { type: "nextJourney", slug: "become-debt-free", baseScore: 88, reason: "Explore a guided path for reviewing loans and repayment habits." },
    { type: "relatedConcepts", conceptId: "debt", baseScore: 76, reason: "Debt management concepts help put EMI in a broader financial context." },
  ],
  retirement: [
    { type: "nextLesson", slug: "retirement-planning", baseScore: 92, reason: "Learn retirement corpus basics, EPF, NPS, and withdrawal concepts." },
    { type: "nextCalculator", path: "/nps-calculator", baseScore: 86, reason: "Explore an educational NPS accumulation and normal-exit illustration." },
    { type: "nextCalculator", path: "/epf-calculator", baseScore: 84, reason: "Estimate EPF corpus from salary contributions over time." },
    { type: "nextCalculator", path: "/swp-calculator", baseScore: 82, reason: "Explore systematic withdrawals from a retirement corpus." },
    { type: "nextJourney", slug: "retirement-planning", baseScore: 90, reason: "Follow a guided retirement planning path on FOINWI." },
  ],
  tax: [
    { type: "nextLesson", slug: "income-tax-basics", baseScore: 90, reason: "Learn Old vs New regime concepts and common deductions." },
    { type: "nextCalculator", path: "/hra-calculator", baseScore: 82, reason: "Explore an educational monthly HRA exemption estimate for FY 2026-27." },
    { type: "nextCalculator", path: "/ppf-calculator", baseScore: 78, reason: "Explore PPF as a commonly discussed 80C instrument." },
    { type: "nextJourney", slug: "save-tax", baseScore: 86, reason: "Review tax and salary planning in a structured mission." },
  ],
  savings: [
    { type: "relatedConcepts", conceptId: "emergency-fund", baseScore: 88, reason: "An emergency buffer is often discussed before ambitious goals." },
    { type: "relatedConcepts", conceptId: "budgeting", baseScore: 85, reason: "Budgeting helps make saving intentional rather than accidental." },
    { type: "nextLesson", slug: "saving-budgeting", baseScore: 84, reason: "Build practical saving and budgeting habits step by step." },
    { type: "nextJourney", slug: "build-wealth", baseScore: 80, reason: "Channel savings habits into a structured wealth-building path." },
  ],
};

/** Fallback recommendations when context cannot be resolved */
export const FALLBACK_RECOMMENDATIONS = [
  createRecommendationItem({
    id: "lesson:money-basics",
    type: "nextLesson",
    title: "Money Basics",
    description: "Start with foundational money concepts on FOINWI Learn Academy.",
    path: "/learn/money-basics",
    reason: "A sensible starting point when no specific context is available.",
    priority: 55,
    conceptId: "savings",
    tags: ["fallback", "beginner"],
    score: 55,
    difficulty: "beginner",
  }),
  createRecommendationItem({
    id: "calculator:/goal-planner",
    type: "nextCalculator",
    title: "Goal Planner",
    description: "Plan a financial goal with a timeline and monthly savings estimate.",
    path: "/goal-planner",
    reason: "Goal planning is widely useful across saving and investing topics.",
    priority: 50,
    conceptId: "goal-planning",
    tags: ["fallback", "tool"],
    score: 50,
    difficulty: "beginner",
  }),
  createRecommendationItem({
    id: "journey:build-wealth",
    type: "nextJourney",
    title: "Build Wealth",
    description: "A guided path for SIP planning, goal-based investing, and long-term habits.",
    path: "/journeys/build-wealth",
    reason: "A popular educational journey for Indian savers starting their investing path.",
    priority: 48,
    conceptId: "sip",
    tags: ["fallback", "journey"],
    score: 48,
    difficulty: "beginner",
  }),
];

export function resolveContextConceptId(context = {}) {
  if (context.conceptId && FINANCIAL_CONCEPTS[context.conceptId]) {
    return context.conceptId;
  }
  if (context.calculatorPath && CALCULATOR_CONCEPT_MAP[context.calculatorPath]) {
    return CALCULATOR_CONCEPT_MAP[context.calculatorPath];
  }
  if (context.lessonSlug && LESSON_CONCEPT_MAP[context.lessonSlug]) {
    return LESSON_CONCEPT_MAP[context.lessonSlug];
  }
  const journeySlug = context.journeySlug ?? context.missionSlug;
  if (journeySlug && JOURNEY_CONCEPT_MAP[journeySlug]) {
    return JOURNEY_CONCEPT_MAP[journeySlug];
  }
  if (context.healthTopic) {
    if (FINANCIAL_CONCEPTS[context.healthTopic]) {
      return context.healthTopic;
    }
    return HEALTH_TOPIC_CONCEPTS[context.healthTopic]?.[0] ?? null;
  }
  return null;
}

export function resolveSourceType(context = {}, conceptId) {
  if (context.sourceType) return context.sourceType;
  if (context.calculatorPath) return "calculator";
  if (context.lessonSlug) return "lesson";
  if (context.journeySlug) return "journey";
  if (context.missionSlug) return "mission";
  if (context.healthTopic) return "health-score";
  if (conceptId) return "concept";
  return "unknown";
}

export function getRelatedConceptIds(conceptId, depth = 1) {
  if (!conceptId) return [];
  const direct = CONCEPT_ADJACENCY[conceptId] ?? [];
  if (depth <= 1) return direct;
  const extended = new Set(direct);
  direct.forEach((neighborId) => {
    (CONCEPT_ADJACENCY[neighborId] ?? []).forEach((id) => extended.add(id));
  });
  extended.delete(conceptId);
  return [...extended];
}

export function buildDailyInsightRecommendation(conceptId) {
  const insight = DAILY_FINANCIAL_INSIGHT;
  const relatedConcepts = ["emergency-fund", "savings", "budgeting"];
  if (!conceptId) return null;
  const isRelevant = relatedConcepts.includes(conceptId);

  if (!isRelevant) return null;

  return createRecommendationItem({
    id: `insight:${insight.id}`,
    type: "dailyInsight",
    title: insight.title,
    description: insight.body,
    path: `/learn/${insight.learnSlug}`,
    reason: "A short educational insight connected to saving and protection habits.",
    priority: 60,
    conceptId: "emergency-fund",
    tags: ["insight", "daily"],
    score: 60,
  });
}

export function getConceptRuleBoosts(conceptId) {
  return CONCEPT_RULE_BOOSTS[conceptId] ?? [];
}

export function getHealthTopicConceptIds(healthTopic) {
  return HEALTH_TOPIC_CONCEPTS[healthTopic] ?? [];
}
