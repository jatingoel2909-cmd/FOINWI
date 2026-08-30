/**
 * Canonical concept routing for the production Intelligence Engine.
 *
 * This does not rewrite the existing recommendation or context engines.
 * Those layers may keep page-context distinctions documented below.
 *
 * Learn path `mutual-funds-sip`:
 *   Intelligence routing concept = sip
 *   recommendationRules.LESSON_CONCEPT_MAP already uses sip.
 *   contextResolvers overrides the same path to mutual-funds for
 *   page-context adjacency. That override is intentional for
 *   RecommendationPanel / daily insight context, not for NL routing.
 *
 * Journey `build-wealth`:
 *   Intelligence routing concept = sip
 *   recommendationRules.JOURNEY_CONCEPT_MAP already uses sip.
 *   contextResolvers overrides the journey to goal-planning for
 *   lifecycle/context. That is an activity-stage distinction:
 *   the journey teaches SIP/wealth habits; context treats the visit
 *   as planning. NL routing uses sip.
 */

import { FINANCIAL_CONCEPTS } from "../knowledge/financialConcepts.js";
import {
  CALCULATOR_CONCEPT_MAP,
  HEALTH_TOPIC_CONCEPTS,
  JOURNEY_CONCEPT_MAP,
  LESSON_CONCEPT_MAP,
} from "../recommendation/recommendationRules.js";

export const CANONICAL_LESSON_CONCEPT_MAP = Object.freeze({
  ...LESSON_CONCEPT_MAP,
  "mutual-funds-sip": "sip",
});

export const CANONICAL_JOURNEY_CONCEPT_MAP = Object.freeze({
  ...JOURNEY_CONCEPT_MAP,
  "build-wealth": "sip",
});

export const CANONICAL_CALCULATOR_CONCEPT_MAP = CALCULATOR_CONCEPT_MAP;

export function resolveCanonicalConcept(input = {}) {
  if (input.conceptId && FINANCIAL_CONCEPTS[input.conceptId]) {
    return input.conceptId;
  }
  if (input.calculatorPath && CANONICAL_CALCULATOR_CONCEPT_MAP[input.calculatorPath]) {
    return CANONICAL_CALCULATOR_CONCEPT_MAP[input.calculatorPath];
  }
  if (input.lessonSlug && CANONICAL_LESSON_CONCEPT_MAP[input.lessonSlug]) {
    return CANONICAL_LESSON_CONCEPT_MAP[input.lessonSlug];
  }
  if (input.journeySlug && CANONICAL_JOURNEY_CONCEPT_MAP[input.journeySlug]) {
    return CANONICAL_JOURNEY_CONCEPT_MAP[input.journeySlug];
  }
  if (input.healthTopic) {
    if (FINANCIAL_CONCEPTS[input.healthTopic]) return input.healthTopic;
    return HEALTH_TOPIC_CONCEPTS[input.healthTopic]?.[0] ?? null;
  }
  return null;
}
