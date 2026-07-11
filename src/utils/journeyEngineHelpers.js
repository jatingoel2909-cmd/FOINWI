import { ALL_CALCULATORS } from "../data/calculators";
import { FINANCIAL_JOURNEYS } from "../data/journeys";
import { getLearningPathBySlug } from "../data/learnAcademy";
import { FINANCIAL_JOURNEY_ENGINE } from "../data/financialJourneyEngine";

export function getFinancialJourney(slug) {
  return FINANCIAL_JOURNEY_ENGINE[slug] ?? null;
}

export function hasFinancialJourney(slug) {
  return Boolean(FINANCIAL_JOURNEY_ENGINE[slug]);
}

export function getJourneyCalculators(paths = []) {
  return paths
    .map((path) => ALL_CALCULATORS.find((calc) => calc.path === path))
    .filter(Boolean);
}

export function getJourneyMission(slug) {
  return FINANCIAL_JOURNEYS.find((journey) => journey.slug === slug) ?? null;
}

export function resolveJourneyModules(modules = []) {
  return modules.map((module) => ({
    ...module,
    learnPath: module.learnSlug ? getLearningPathBySlug(module.learnSlug) : null,
  }));
}

export function getJourneyProgressKey(slug) {
  return `foinwi-journey-progress-${slug}`;
}

export function calculateJourneyProgress(progressSteps = [], checkedItems = {}) {
  if (!progressSteps.length) return 0;
  const completed = progressSteps.filter((step) => checkedItems[step.id]).length;
  return Math.round((completed / progressSteps.length) * 100);
}

export function isJourneyComplete(progressSteps = [], checkedItems = {}) {
  return calculateJourneyProgress(progressSteps, checkedItems) === 100;
}
