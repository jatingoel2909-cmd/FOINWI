/**
 * Authoritative FOINWI route allowlist for Intelligence actions.
 * Unknown paths must never be returned to the user.
 */

import { ALL_CALCULATORS } from "../../data/calculators.js";
import { FINANCIAL_JOURNEYS } from "../../data/journeys.js";
import { LEARNING_PATHS } from "../../data/learnAcademy.js";

const STATIC_APPROVED_PATHS = Object.freeze([
  "/calculators",
  "/learn",
  "/financial-health-score",
  "/exchange-rates",
  "/ai-tools",
  "/disclaimer",
  "/about",
]);

function collectApprovedPaths() {
  const paths = new Set(STATIC_APPROVED_PATHS);

  ALL_CALCULATORS.forEach((calculator) => {
    if (calculator?.path) paths.add(calculator.path);
  });

  FINANCIAL_JOURNEYS.forEach((journey) => {
    if (journey?.slug) paths.add(`/journeys/${journey.slug}`);
  });

  LEARNING_PATHS.forEach((path) => {
    paths.add(`/learn/${path.slug}`);
    (path.lessons ?? []).forEach((lesson) => {
      if (lesson?.slug) paths.add(`/learn/${path.slug}/${lesson.slug}`);
    });
  });

  return paths;
}

const APPROVED_PATHS = collectApprovedPaths();

export function getApprovedIntelligencePaths() {
  return [...APPROVED_PATHS].sort();
}

export function isApprovedIntelligencePath(path) {
  if (typeof path !== "string" || !path.startsWith("/")) return false;
  const normalized = path.split("?")[0].split("#")[0].replace(/\/$/u, "") || "/";
  return APPROVED_PATHS.has(normalized);
}

export function filterApprovedActions(actions = []) {
  return actions.filter((action) => action?.path && isApprovedIntelligencePath(action.path));
}
