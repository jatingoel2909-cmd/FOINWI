/**
 * FOINWI Intelligence Engine — production entry point.
 * Deterministic. No model. No persistence. No network.
 */

import { getConceptById } from "../knowledge/financialConcepts.js";
import {
  getFallbackOptions,
  getGuideTopicLabel,
  matchGuideQuery,
} from "../guide/guideEngine.js";
import { getGuideResources } from "../guide/guideResources.js";
import { searchFOINWI } from "../search/searchEngine.js";
import { filterApprovedActions, isApprovedIntelligencePath } from "./intelligenceAllowlist.js";
import { resolveCanonicalConcept } from "./canonicalConceptMaps.js";
import {
  DEFAULT_INTELLIGENCE_SAFETY,
  INTELLIGENCE_SURFACES,
  MAX_INTELLIGENCE_QUERY_LENGTH,
  createIntelligenceAction,
  createIntelligenceResponse,
  createResourceRef,
} from "./intelligenceTypes.js";

const ACTION_LABEL_TYPE = Object.freeze({
  "Calculate it": "CALCULATE",
  "Understand it": "LEARN",
  "Plan it": "PLAN",
  Check: "CHECK",
  Explore: "EXPLORE",
});

const CONFIDENCE_SCORE = Object.freeze({
  safety: 100,
  high: 86,
  medium: 48,
  low: 18,
});

function normalizeQuery(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/gu, " ").trim().slice(0, MAX_INTELLIGENCE_QUERY_LENGTH);
}

function normalizeSurface(surface) {
  return INTELLIGENCE_SURFACES.includes(surface) ? surface : "api";
}

function splitKeyPoints(text) {
  if (!text) return [];
  return String(text)
    .split(/(?<=\.)\s+/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 20)
    .slice(0, 3);
}

function resourcesToActions(resources, preferredLabels = []) {
  const usedPaths = new Set();
  const actions = [];

  preferredLabels.forEach((label) => {
    const type = ACTION_LABEL_TYPE[label];
    const resource = resources.find((item) => item.type === type && !usedPaths.has(item.path));
    if (!resource) return;
    usedPaths.add(resource.path);
    actions.push(createIntelligenceAction({
      type: resource.type,
      label,
      path: resource.path,
      resourceId: resource.resourceId,
    }));
  });

  resources.forEach((resource) => {
    if (usedPaths.has(resource.path)) return;
    usedPaths.add(resource.path);
    actions.push(createIntelligenceAction({
      type: resource.type,
      label: resource.title,
      path: resource.path,
      resourceId: resource.resourceId,
    }));
  });

  return filterApprovedActions(actions);
}

function assignTypedResources(response, actions) {
  const byPath = (test) => actions.find((action) => test(action.path)) ?? null;

  response.calculator = createResourceRef(byPath((path) => path.endsWith("-calculator") || path === "/goal-planner"));
  response.learn = createResourceRef(byPath((path) => path === "/learn" || path.startsWith("/learn/")));
  response.journey = createResourceRef(byPath((path) => path.startsWith("/journeys/")));
  response.healthScore = createResourceRef(byPath((path) => path === "/financial-health-score"));
  response.exchangeRates = createResourceRef(byPath((path) => path === "/exchange-rates"));
  return response;
}

function buildSafetyBlock(refusalReason) {
  return {
    ...DEFAULT_INTELLIGENCE_SAFETY,
    ...(refusalReason ? { refusalReason } : {}),
  };
}

function buildFromIntent(match, sourceType = "deterministic-intent") {
  const intent = match.intent;
  const resources = getGuideResources(intent.resourceIds ?? []);
  const suggestedActions = resourcesToActions(resources, intent.actions ?? []);
  const topic = match.family ?? intent.topic ?? null;

  return assignTypedResources(createIntelligenceResponse({
    responseType: match.responseType,
    intent: intent.id ?? null,
    topic: topic ? getGuideTopicLabel(topic) : null,
    confidence: match.confidence,
    confidenceScore: CONFIDENCE_SCORE[match.confidence] ?? 86,
    explanation: intent.simpleAnswer ?? "",
    keyPoints: splitKeyPoints(intent.deeperExplanation),
    suggestedActions,
    clarification: null,
    safety: buildSafetyBlock(match.responseType === "SAFETY" ? "educational-boundary" : undefined),
    sourceType: match.responseType === "SAFETY" ? "safety" : sourceType,
  }), suggestedActions);
}

function buildClarification(match) {
  const options = (match.clarificationOptions ?? []).filter((option) => option.id && option.label);
  const explore = resourcesToActions(getGuideResources(["calculators", "learn"]));

  return assignTypedResources(createIntelligenceResponse({
    responseType: "CLARIFY",
    intent: null,
    topic: match.family ? getGuideTopicLabel(match.family) : null,
    confidence: "medium",
    confidenceScore: CONFIDENCE_SCORE.medium,
    explanation: match.family
      ? `I can help you understand ${getGuideTopicLabel(match.family).toLowerCase()}. Which part would you like to explore?`
      : "I need a little more detail to point you to a FOINWI tool or lesson.",
    keyPoints: [],
    suggestedActions: explore,
    clarification: options.length
      ? {
        prompt: match.family
          ? `Which part of ${getGuideTopicLabel(match.family).toLowerCase()} would you like to understand?`
          : "What would you like to understand?",
        options,
      }
      : null,
    safety: buildSafetyBlock(),
    sourceType: "clarification",
  }), explore);
}

function buildFallback(responseType = "FALLBACK") {
  const startOptions = getFallbackOptions().map((option) => ({
    id: option.intentId,
    label: option.label,
  }));
  const suggestedActions = resourcesToActions(getGuideResources(["calculators", "learn", "health"]));

  return assignTypedResources(createIntelligenceResponse({
    responseType,
    intent: null,
    topic: null,
    confidence: "low",
    confidenceScore: CONFIDENCE_SCORE.low,
    explanation: responseType === "UNSUPPORTED"
      ? "I can help with FOINWI educational topics such as loans, investing, tax, goals, retirement, financial health, calculators, and learning — not unrelated questions."
      : "I'm not confident I understood that yet. You can ask about loans, investing, goals, retirement, deposits, tax basics, or financial health.",
    keyPoints: [
      "FOINWI can point you toward calculators, Learn paths, journeys, and the Financial Health Score.",
      "It does not choose investments, lenders, or tax actions for you.",
    ],
    suggestedActions,
    clarification: {
      prompt: "Which supported area would you like to explore?",
      options: startOptions,
    },
    safety: buildSafetyBlock(),
    sourceType: "fallback",
  }), suggestedActions);
}

function searchFallback(query, context) {
  const conceptId = resolveCanonicalConcept(context);
  const search = searchFOINWI(query, {
    limit: 8,
    context: {
      pathname: context.pathname,
      conceptId,
      calculatorPath: context.calculatorPath,
      lessonSlug: context.lessonSlug,
      journeySlug: context.journeySlug,
      healthTopic: context.healthTopic,
    },
  });

  const top = search.results.find((item) => isApprovedIntelligencePath(item.path));
  if (!top || search.metadata.confidence !== "high" || (top.score ?? 0) < 90) {
    return null;
  }

  const concept = top.conceptId ? getConceptById(top.conceptId) : null;
  const explanation = concept?.description || top.description || "This FOINWI resource may help you explore that topic.";
  const type = top.type === "learning"
    ? "LEARN"
    : top.path.startsWith("/journeys/")
      ? "EXPLORE"
      : top.path === "/financial-health-score"
        ? "CHECK"
        : top.path === "/exchange-rates"
          ? "EXPLORE"
          : "CALCULATE";

  const suggestedActions = filterApprovedActions([
    createIntelligenceAction({
      type,
      label: top.title,
      path: top.path,
      resourceId: top.id,
    }),
  ]);

  if (!suggestedActions.length) return null;

  return assignTypedResources(createIntelligenceResponse({
    responseType: "SUPPORTED",
    intent: top.conceptId ?? top.id,
    topic: concept?.category ?? top.category ?? null,
    confidence: "high",
    confidenceScore: CONFIDENCE_SCORE.high,
    explanation,
    keyPoints: splitKeyPoints(concept?.description),
    suggestedActions,
    safety: buildSafetyBlock(),
    sourceType: "deterministic-search",
  }), suggestedActions);
}

export function normalizeIntelligenceRequest(request = {}) {
  const raw = request && typeof request === "object" && !Array.isArray(request) ? request : {};
  const context = raw.context && typeof raw.context === "object" ? raw.context : {};

  return {
    query: normalizeQuery(raw.query),
    locale: raw.locale === "en-IN" ? "en-IN" : "en-IN",
    surface: normalizeSurface(raw.surface),
    context: {
      pathname: typeof context.pathname === "string" ? context.pathname : undefined,
      conceptId: typeof context.conceptId === "string" ? context.conceptId : undefined,
      calculatorPath: typeof context.calculatorPath === "string" ? context.calculatorPath : undefined,
      lessonSlug: typeof context.lessonSlug === "string" ? context.lessonSlug : undefined,
      journeySlug: typeof context.journeySlug === "string" ? context.journeySlug : undefined,
      healthTopic: typeof context.healthTopic === "string" ? context.healthTopic : undefined,
    },
  };
}

/**
 * @param {object} request
 * @returns {object} IntelligenceResponse
 */
export function runIntelligence(request = {}) {
  const normalized = normalizeIntelligenceRequest(request);
  if (!normalized.query) {
    return buildFallback("FALLBACK");
  }

  const match = matchGuideQuery(normalized.query);

  if (match.responseType === "SAFETY") {
    return buildFromIntent(match, "safety");
  }

  if (match.responseType === "SUPPORTED" && match.intent) {
    const response = buildFromIntent(match);
    if (response.suggestedActions.length) return response;
    return buildFallback("FALLBACK");
  }

  if (match.responseType === "CLARIFY") {
    return buildClarification(match);
  }

  const fromSearch = searchFallback(normalized.query, normalized.context);
  if (fromSearch) return fromSearch;

  return buildFallback(match.family ? "FALLBACK" : "UNSUPPORTED");
}

export { normalizeIntelligenceRequest as validateIntelligenceRequest };
