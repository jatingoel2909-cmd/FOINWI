import { normalizeSearchQuery, tokenizeQuery } from "../intelligence/search/searchHelpers.js";
import { GUIDE_INTENTS, GUIDE_START_OPTIONS, GUIDE_TOPICS } from "./guideIntents.js";
import { isGuideSafetyRequest, GUIDE_SAFETY_RESPONSE } from "./guideSafety.js";

const HIGH_MATCH_THRESHOLD = 62;
const AMBIGUITY_MARGIN = 10;

const NORMALIZATION_ALIASES = Object.freeze({
  retirment: "retirement",
  budjet: "budget",
  emergncy: "emergency",
  lumpsom: "lumpsum",
  installment: "emi",
  instalment: "emi",
  installments: "emi",
  instalments: "emi",
  borrowing: "loan",
  borrowings: "loan",
});

const PHRASE_ALIASES = Object.freeze([
  [/\bfixed\s+deposit\b/gu, "fd"],
  [/\brecurring\s+deposit\b/gu, "rd"],
  [/\bpublic\s+provident\s+fund\b/gu, "ppf"],
  [/\bhouse\s+rent\s+allowance\b/gu, "hra"],
  [/\bgoods\s+(?:and\s+)?services\s+tax\b/gu, "gst"],
  [/\bearly\s+(?:loan\s+)?payment\b/gu, "prepayment"],
  [/\bpay\s+loan\s+early\b/gu, "prepayment"],
  [/\bemergency\s+fun\b/gu, "emergency fund"],
]);

const GUIDE_FAMILIES = Object.freeze([
  {
    id: "loans",
    label: "Loans",
    signals: ["loan", "home loan", "emi", "prepayment", "interest", "tenure", "eligibility", "borrow"],
    clarifications: ["loan-emi", "loan-prepayment", "loan-affordability", "loan-eligibility"],
  },
  {
    id: "investing",
    label: "Investing",
    signals: ["invest", "investing", "investment", "sip", "lumpsum", "cagr", "compounding", "mutual fund", "return", "swp"],
    clarifications: ["invest-basics", "invest-sip", "invest-compounding", "invest-lumpsum"],
  },
  {
    id: "goals",
    label: "Goals",
    signals: ["goal", "education", "child", "home", "wealth", "down payment"],
    clarifications: ["goal-planning", "goal-education", "goal-home", "goal-wealth"],
  },
  {
    id: "retirement",
    label: "Retirement",
    signals: ["retirement", "retire", "corpus", "pension"],
    clarifications: ["retirement-start", "retirement-corpus", "retirement-inflation"],
  },
  {
    id: "deposits",
    label: "Deposits",
    signals: ["fd", "rd", "ppf", "deposit", "maturity"],
    clarifications: ["deposit-basics", "deposit-fd", "deposit-rd", "deposit-ppf"],
  },
  {
    id: "tax",
    label: "Tax basics",
    signals: ["tax", "hra", "gst", "gratuity", "epf", "nps"],
    clarifications: ["tax-income", "tax-hra", "tax-gst", "tax-epf"],
  },
  {
    id: "health",
    label: "Financial Health",
    signals: ["budget", "spending", "salary", "expense", "save", "saving", "debt", "credit card", "emergency", "insurance", "protection"],
    clarifications: ["health-budgeting", "health-emergency", "health-debt", "health-protection"],
  },
  {
    id: "discovery",
    label: "Getting started",
    signals: ["help", "confused", "start", "money help", "where begin"],
    clarifications: ["discovery-start", "discovery-calculator", "discovery-learning", "discovery-journey"],
  },
]);

export function hasGuideAmountSignal(query = "") {
  const value = String(query).toLowerCase().replace(/,/gu, "");
  return /(?:₹\s*|(?:rs\.?|inr|rupee)\s*)\d+(?:\.\d+)?\b|\b\d+(?:\.\d+)?\s*(?:k|lakh|l)\b/iu.test(value);
}

export function normalizeGuideQuery(query = "") {
  const normalized = normalizeSearchQuery(
    String(query)
      .replace(/[₹]/gu, " rupee ")
      .replace(/\b(rs\.?|inr)\b/giu, " rupee "),
  );
  const phraseNormalized = PHRASE_ALIASES.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    normalized,
  );

  return phraseNormalized
    .split(" ")
    .map((token) => NORMALIZATION_ALIASES[token] ?? token)
    .join(" ");
}

function scoreIntent(intent, normalizedQuery, tokens) {
  let score = 0;
  let hasExactPhraseMatch = false;
  const matched = [];
  const queryTerms = new Set(tokens);

  intent.phrases.forEach((phrase) => {
    const normalizedPhrase = normalizeGuideQuery(phrase);
    if (normalizedQuery === normalizedPhrase) {
      score += 100;
      hasExactPhraseMatch = true;
      matched.push(phrase);
    } else if (normalizedPhrase.length > 3 && normalizedQuery.includes(normalizedPhrase)) {
      score += 62;
      matched.push(phrase);
    }
  });

  intent.keywords.forEach((keyword) => {
    const keywordTokens = tokenizeQuery(normalizeGuideQuery(keyword));
    if (keywordTokens.length && keywordTokens.every((token) => queryTerms.has(token))) {
      score += keywordTokens.length > 1 ? 40 : 22;
      matched.push(keyword);
    }
  });

  (intent.negativeKeywords ?? []).forEach((keyword) => {
    if (normalizedQuery.includes(normalizeGuideQuery(keyword))) score -= 80;
  });

  return { score, matched, hasExactPhraseMatch };
}

export function getGuideFamily(query) {
  const normalizedQuery = normalizeGuideQuery(query);
  const tokens = new Set(tokenizeQuery(normalizedQuery));
  const candidates = GUIDE_FAMILIES
    .map((family) => {
      const matched = family.signals.filter((signal) => {
        const signalTokens = tokenizeQuery(signal);
        return signalTokens.length && signalTokens.every((token) => tokens.has(token));
      });
      return { family, score: matched.length * 22, matched };
    })
    .sort((a, b) => b.score - a.score || a.family.id.localeCompare(b.family.id));
  const winner = candidates[0];

  if (!winner?.score) return { family: null, confidence: "low", matched: [] };
  return {
    family: winner.family,
    confidence: winner.score >= 44 ? "high" : "medium",
    matched: winner.matched,
  };
}

export function matchGuideQuery(query) {
  const normalizedQuery = normalizeGuideQuery(query);
  const hasAmountSignal = hasGuideAmountSignal(query);
  if (!normalizedQuery) {
    return {
      responseType: "FALLBACK", confidence: "low", intentConfidence: "low",
      family: null, familyConfidence: "low", hasAmountSignal, normalizedQuery, intent: null, matched: [],
    };
  }

  if (isGuideSafetyRequest(normalizedQuery)) {
    return {
      responseType: "SAFETY", confidence: "safety", intentConfidence: "safety",
      family: null, familyConfidence: "low", hasAmountSignal, normalizedQuery, intent: GUIDE_SAFETY_RESPONSE, matched: [],
    };
  }

  const tokens = tokenizeQuery(normalizedQuery);
  const familyResult = getGuideFamily(normalizedQuery);
  const candidates = GUIDE_INTENTS
    .map((intent) => ({ intent, ...scoreIntent(intent, normalizedQuery, tokens) }))
    .sort((a, b) => b.score - a.score || a.intent.id.localeCompare(b.intent.id));
  const winner = candidates[0];
  const runnerUp = candidates[1];
  const hasConflictingFamily = !winner?.hasExactPhraseMatch && familyResult.family
    && !["comparison", "discovery"].includes(winner?.intent?.topic)
    && winner?.intent?.topic !== familyResult.family.id;

  if (winner && !hasConflictingFamily && winner.score >= HIGH_MATCH_THRESHOLD && (!runnerUp || winner.score - runnerUp.score >= AMBIGUITY_MARGIN)) {
    return {
      responseType: "SUPPORTED",
      confidence: "high",
      intentConfidence: "high",
      family: familyResult.family?.id ?? winner.intent.topic,
      familyConfidence: familyResult.confidence,
      hasAmountSignal,
      normalizedQuery,
      intent: winner.intent,
      matched: winner.matched,
    };
  }

  if (familyResult.family) {
    return {
      responseType: "CLARIFY",
      confidence: "medium",
      intentConfidence: "medium",
      family: familyResult.family.id,
      familyConfidence: familyResult.confidence,
      hasAmountSignal,
      normalizedQuery,
      intent: null,
      matched: familyResult.matched,
      clarificationOptions: getGuideFamilyClarifications(familyResult.family.id),
    };
  }

  return {
    responseType: "FALLBACK",
    confidence: "low",
    intentConfidence: "low",
    family: null,
    familyConfidence: "low",
    hasAmountSignal,
    normalizedQuery,
    intent: null,
    matched: winner?.matched ?? [],
  };
}

export function getGuideResponseForIntent(intentId) {
  const intent = GUIDE_INTENTS.find((candidate) => candidate.id === intentId) ?? null;
  if (!intent) return {
    responseType: "FALLBACK", confidence: "low", intentConfidence: "low",
    family: null, familyConfidence: "low", intent: null, matched: [],
  };
  return {
    responseType: "SUPPORTED", confidence: "high", intentConfidence: "high",
    family: intent.topic, familyConfidence: "high", intent, matched: [intent.id],
  };
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

export function getGuideFamilyClarifications(familyId) {
  const family = GUIDE_FAMILIES.find((candidate) => candidate.id === familyId);
  if (!family) return [];
  return family.clarifications
    .map((intentId) => GUIDE_INTENTS.find((candidate) => candidate.id === intentId))
    .filter(Boolean)
    .map((intent) => ({
      id: intent.id,
      label: intent.clarificationLabel ?? intent.phrases[0],
    }));
}

export function getGuideTopicLabel(topicId) {
  return GUIDE_TOPICS.find((topic) => topic.id === topicId)?.label
    ?? GUIDE_FAMILIES.find((family) => family.id === topicId)?.label
    ?? "General";
}
