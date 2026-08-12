import { normalizeSearchQuery, tokenizeQuery } from "../intelligence/search/searchHelpers.js";
import { GUIDE_INTENTS, GUIDE_START_OPTIONS, GUIDE_TOPICS } from "./guideIntents.js";
import { isGuideSafetyRequest, GUIDE_SAFETY_RESPONSE } from "./guideSafety.js";

const MATCH_THRESHOLD = 34;
const AMBIGUITY_MARGIN = 8;

export function normalizeGuideQuery(query = "") {
  return normalizeSearchQuery(String(query).replace(/[₹]/gu, " rupee ").replace(/\b(rs\.?|inr)\b/giu, " rupee "));
}

function scoreIntent(intent, normalizedQuery, tokens) {
  let score = 0;
  const matched = [];
  const queryTerms = new Set(tokens);

  intent.phrases.forEach((phrase) => {
    const normalizedPhrase = normalizeGuideQuery(phrase);
    if (normalizedQuery === normalizedPhrase) {
      score += 100;
      matched.push(phrase);
    } else if (normalizedPhrase.length > 3 && normalizedQuery.includes(normalizedPhrase)) {
      score += 62;
      matched.push(phrase);
    }
  });

  intent.keywords.forEach((keyword) => {
    const keywordTokens = tokenizeQuery(keyword);
    if (keywordTokens.length && keywordTokens.every((token) => queryTerms.has(token))) {
      score += keywordTokens.length > 1 ? 28 : 16;
      matched.push(keyword);
    }
  });

  (intent.negativeKeywords ?? []).forEach((keyword) => {
    if (normalizedQuery.includes(normalizeGuideQuery(keyword))) score -= 80;
  });

  return { score, matched };
}

export function matchGuideQuery(query) {
  const normalizedQuery = normalizeGuideQuery(query);
  if (!normalizedQuery) {
    return { responseType: "FALLBACK", confidence: "empty", normalizedQuery, intent: null, matched: [] };
  }

  if (isGuideSafetyRequest(normalizedQuery)) {
    return { responseType: "SAFETY", confidence: "safety", normalizedQuery, intent: GUIDE_SAFETY_RESPONSE, matched: [] };
  }

  const tokens = tokenizeQuery(normalizedQuery);
  const candidates = GUIDE_INTENTS
    .map((intent) => ({ intent, ...scoreIntent(intent, normalizedQuery, tokens) }))
    .sort((a, b) => b.score - a.score || a.intent.id.localeCompare(b.intent.id));
  const winner = candidates[0];
  const runnerUp = candidates[1];

  if (!winner || winner.score < MATCH_THRESHOLD || (runnerUp && winner.score - runnerUp.score < AMBIGUITY_MARGIN)) {
    return { responseType: "FALLBACK", confidence: "low", normalizedQuery, intent: null, matched: winner?.matched ?? [] };
  }

  return {
    responseType: "SUPPORTED",
    confidence: winner.score >= 90 ? "exact" : "keyword",
    normalizedQuery,
    intent: winner.intent,
    matched: winner.matched,
  };
}

export function getGuideResponseForIntent(intentId) {
  const intent = GUIDE_INTENTS.find((candidate) => candidate.id === intentId) ?? null;
  if (!intent) return { responseType: "FALLBACK", confidence: "low", intent: null, matched: [] };
  return { responseType: "SUPPORTED", confidence: "exact", intent, matched: [intent.id] };
}

export function getGuideFollowUps(intent) {
  if (!intent?.followUps?.length) return [];
  return intent.followUps
    .map((intentId) => GUIDE_INTENTS.find((candidate) => candidate.id === intentId))
    .filter(Boolean)
    .map((nextIntent) => ({
      id: nextIntent.id,
      label: GUIDE_START_OPTIONS.find(([, intentId]) => intentId === nextIntent.id)?.[0]
        ?? nextIntent.phrases[0],
    }));
}

export function getFallbackOptions() {
  return GUIDE_START_OPTIONS.map(([label, intentId]) => ({ label, intentId }));
}

export function getGuideTopicLabel(topicId) {
  return GUIDE_TOPICS.find((topic) => topic.id === topicId)?.label ?? "General";
}
