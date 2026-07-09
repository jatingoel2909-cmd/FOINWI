import { ALL_CALCULATORS } from "../data/calculators";
import { getLearningPathBySlug } from "../data/learnAcademy";
import { FINANCIAL_JOURNEYS } from "../data/journeys";

export function getCalculatorByPath(path) {
  return ALL_CALCULATORS.find((calc) => calc.path === path) ?? null;
}

export function getLearningPathLabel(slug) {
  const path = getLearningPathBySlug(slug);
  return path ? { slug, title: path.title, icon: path.icon } : null;
}

export function getMissionLabel(slug) {
  const mission = FINANCIAL_JOURNEYS.find((item) => item.slug === slug);
  return mission ? { slug, title: mission.title, icon: mission.icon } : null;
}

export function resolveExplainLinks(explain) {
  if (!explain) return null;

  return {
    calculators: (explain.relatedCalculators ?? [])
      .map((path) => getCalculatorByPath(path))
      .filter(Boolean),
    lessons: (explain.relatedLessons ?? [])
      .map((slug) => getLearningPathLabel(slug))
      .filter(Boolean),
    missions: (explain.relatedMissions ?? [])
      .map((slug) => getMissionLabel(slug))
      .filter(Boolean),
  };
}
