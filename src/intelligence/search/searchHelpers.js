/**
 * FOINWI Search Engine — query normalization, scoring, grouping, suggestions.
 * Deterministic ranking only. No machine learning. No browser APIs.
 */

import { getRelatedConceptIds } from "../recommendation/recommendationRules.js";
import { buildIntelligenceContext } from "../context/contextEngine.js";
import { buildSearchIndex, SEARCH_SYNONYMS } from "./searchIndex.js";
import {
  STRONG_MATCH_THRESHOLD,
  TYPE_TO_GROUP,
  createEmptyGroupedResults,
  toPublicSearchResult,
} from "./searchTypes.js";

const STOP_WORDS = new Set(["a", "an", "the", "and", "or", "of", "to", "for", "in", "on", "with", "how", "what", "is"]);

const FALLBACK_SUGGESTIONS = [
  {
    id: "suggestion:calculators",
    label: "Browse calculators",
    path: "/calculators",
    reason: "Explore educational calculators across saving, investing, loans, and tax.",
  },
  {
    id: "suggestion:learn",
    label: "Open Learn Academy",
    path: "/learn",
    reason: "Start with structured lessons on money, investing, and planning.",
  },
  {
    id: "suggestion:guide",
    label: "Open FOINWI Intelligence",
    path: "/ai-tools",
    reason: "Explore goals and habits with educational guidance.",
  },
];

/**
 * Normalize a raw search query string.
 * @param {string} [query]
 * @returns {string}
 */
export function normalizeSearchQuery(query = "") {
  if (typeof query !== "string") return "";
  return query
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s&+-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tokenize a normalized query into searchable terms.
 * @param {string} [query]
 * @returns {string[]}
 */
export function tokenizeQuery(query = "") {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) return [];

  return normalized
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));
}

/**
 * Expand query with known educational synonyms.
 * @param {string} [query]
 * @returns {{ normalized: string, tokens: string[], synonymHits: string[], expandedTerms: string[] }}
 */
export function expandSynonyms(query = "") {
  const normalized = normalizeSearchQuery(query);
  const tokens = tokenizeQuery(normalized);
  const synonymHits = [];
  const expandedTerms = new Set([normalized, ...tokens].filter(Boolean));

  Object.entries(SEARCH_SYNONYMS).forEach(([conceptId, phrases]) => {
    phrases.forEach((phrase) => {
      const phraseNorm = normalizeSearchQuery(phrase);
      if (!phraseNorm) return;

      const queryContainsPhrase = normalized.includes(phraseNorm);
      const phraseContainsQuery = phraseNorm.includes(normalized) && normalized.length >= 3;
      const tokenOverlap = tokens.some(
        (token) => phraseNorm.includes(token) || token.includes(phraseNorm.split(" ")[0]),
      );

      if (queryContainsPhrase || phraseContainsQuery || (normalized === conceptId)) {
        synonymHits.push(conceptId);
        expandedTerms.add(phraseNorm);
        expandedTerms.add(conceptId);
        tokenizeQuery(phraseNorm).forEach((t) => expandedTerms.add(t));
      } else if (tokenOverlap && tokens.length >= 2) {
        const matchedTokens = tokens.filter((token) => phraseNorm.includes(token));
        if (matchedTokens.length >= Math.min(2, tokens.length)) {
          synonymHits.push(conceptId);
          expandedTerms.add(phraseNorm);
          expandedTerms.add(conceptId);
        }
      }
    });

    // Direct concept id / short title queries
    if (normalized === conceptId || tokens.includes(conceptId)) {
      synonymHits.push(conceptId);
      phrases.forEach((phrase) => expandedTerms.add(normalizeSearchQuery(phrase)));
    }
  });

  // Short aliases
  const aliasMap = {
    sip: "sip",
    emi: "emi",
    nps: "nps",
    epf: "epf",
    ppf: "ppf",
    fd: "fd",
    rd: "rd",
    swp: "retirement",
    gst: "tax",
    hra: "tax",
  };

  tokens.forEach((token) => {
    if (aliasMap[token]) {
      synonymHits.push(aliasMap[token]);
      (SEARCH_SYNONYMS[aliasMap[token]] ?? []).forEach((phrase) =>
        expandedTerms.add(normalizeSearchQuery(phrase)),
      );
    }
  });

  return {
    normalized,
    tokens,
    synonymHits: [...new Set(synonymHits)],
    expandedTerms: [...expandedTerms].filter(Boolean),
  };
}

/**
 * Highlight the first matching span in text.
 * @param {string} text
 * @param {string} query
 * @returns {string}
 */
export function highlightMatch(text = "", query = "") {
  const source = String(text ?? "");
  const normalized = normalizeSearchQuery(query);
  if (!source || !normalized) return source;

  const lower = source.toLowerCase();
  const idx = lower.indexOf(normalized);
  if (idx >= 0) {
    const matched = source.slice(idx, idx + normalized.length);
    return `${source.slice(0, idx)}**${matched}**${source.slice(idx + normalized.length)}`;
  }

  const tokens = tokenizeQuery(normalized);
  for (const token of tokens) {
    const tokenIdx = lower.indexOf(token);
    if (tokenIdx >= 0) {
      const matched = source.slice(tokenIdx, tokenIdx + token.length);
      return `${source.slice(0, tokenIdx)}**${matched}**${source.slice(tokenIdx + token.length)}`;
    }
  }

  return source;
}

/**
 * Score a single indexed item against an expanded query.
 * @param {Object} item
 * @param {{ normalized: string, tokens: string[], synonymHits: string[] }} queryInfo
 * @param {{ primaryConceptId?: string|null, relatedConceptIds?: string[], difficulty?: string|null, recentItems?: string[], lifecycleStage?: string }} [boost]
 * @returns {{ score: number, matchedOn: string[] }}
 */
export function scoreSearchResult(item, queryInfo, boost = {}) {
  const { normalized, tokens, synonymHits } = queryInfo;
  if (!normalized) return { score: 0, matchedOn: [] };

  const title = (item.title ?? "").toLowerCase();
  const description = (item.description ?? "").toLowerCase();
  const tags = (item.tags ?? []).map((tag) => String(tag).toLowerCase());
  const searchText = (item.searchText ?? "").toLowerCase();
  const synonyms = (item.synonyms ?? []).map((s) => normalizeSearchQuery(s));
  const matchedOn = [];
  let score = 0;

  // Exact title match
  if (title === normalized) {
    score += 100;
    matchedOn.push("exact-title");
  } else if (title.startsWith(normalized)) {
    score += 85;
    matchedOn.push("starts-with-title");
  } else if (title.includes(normalized)) {
    score += 70;
    matchedOn.push("partial-title");
  }

  // Synonym match against item synonyms or concept synonym hits
  const synonymMatched =
    synonyms.some((phrase) => phrase === normalized || phrase.includes(normalized) || normalized.includes(phrase)) ||
    (item.conceptId && synonymHits.includes(item.conceptId)) ||
    synonymHits.some((id) => id === item.conceptId);

  if (synonymMatched) {
    score += 60;
    matchedOn.push("synonym");
  }

  // Tag match
  const tagHit = tags.some(
    (tag) => tag === normalized || tokens.includes(tag) || tag.includes(normalized),
  );
  if (tagHit) {
    score += 40;
    matchedOn.push("tag");
  }

  // Description / body keyword match
  const descHit =
    (normalized.length >= 3 && description.includes(normalized)) ||
    tokens.some((token) => token.length >= 3 && description.includes(token));
  if (descHit) {
    score += 25;
    matchedOn.push("description");
  }

  // Broader search text token coverage
  if (tokens.length) {
    const covered = tokens.filter((token) => searchText.includes(token)).length;
    if (covered > 0) {
      score += Math.min(20, covered * 6);
      if (!matchedOn.includes("description") && !matchedOn.includes("partial-title")) {
        matchedOn.push("keyword");
      }
    }
  }

  // Related concept boost
  const relatedIds = boost.relatedConceptIds ?? [];
  if (item.conceptId && boost.primaryConceptId) {
    if (item.conceptId === boost.primaryConceptId) {
      score += 30;
      matchedOn.push("context-concept");
    } else if (relatedIds.includes(item.conceptId)) {
      score += 15;
      matchedOn.push("related-concept");
    }
  }

  // Lifecycle-aware light boost
  if (boost.lifecycleStage === "practice" && item.type === "calculator") {
    score += 5;
  } else if (boost.lifecycleStage === "understand" && item.type === "learning") {
    score += 5;
  } else if (boost.lifecycleStage === "plan" && (item.type === "journey" || item.type === "mission")) {
    score += 5;
  } else if (boost.lifecycleStage === "progress" && item.type === "health") {
    score += 5;
  }

  // Difficulty match
  if (boost.difficulty && item.difficulty && boost.difficulty === item.difficulty) {
    score += 8;
    matchedOn.push("difficulty");
  }

  // Recent item de-prioritization
  const recent = boost.recentItems ?? [];
  if (recent.includes(item.id) || recent.includes(item.path)) {
    score -= 20;
    matchedOn.push("recent-penalty");
  }

  // Require at least one real match signal
  const meaningful = matchedOn.filter((m) => m !== "recent-penalty" && m !== "difficulty");
  if (!meaningful.length && score < 20) {
    return { score: 0, matchedOn: [] };
  }

  return {
    score: Math.max(0, Math.round(score)),
    matchedOn: [...new Set(matchedOn)],
  };
}

/**
 * Remove duplicate results (prefer higher score; keep journey over mission for same path when both present in flat list is fine — dedupe by id only, and by path+type).
 * @param {Object[]} items
 * @returns {Object[]}
 */
export function deduplicateSearchResults(items = []) {
  const seenIds = new Set();
  const seenPathType = new Set();

  return items.filter((item) => {
    if (seenIds.has(item.id)) return false;
    seenIds.add(item.id);

    const key = `${item.type}:${item.path}`;
    if (item.path && seenPathType.has(key)) return false;
    if (item.path) seenPathType.add(key);

    return true;
  });
}

/**
 * Group scored results into typed buckets.
 * @param {Object[]} items
 * @returns {Object}
 */
export function groupSearchResults(items = []) {
  const grouped = createEmptyGroupedResults();

  items.forEach((item) => {
    const key = TYPE_TO_GROUP[item.type];
    if (!key || !grouped[key]) return;
    grouped[key].push(toPublicSearchResult(item));
  });

  return grouped;
}

/**
 * Build search suggestions when results are weak or empty.
 * @param {string} query
 * @param {Object[]} results
 * @param {{ synonymHits?: string[], primaryConceptId?: string|null }} [meta]
 * @returns {Object[]}
 */
export function buildSearchSuggestions(query = "", results = [], meta = {}) {
  const suggestions = [];
  const normalized = normalizeSearchQuery(query);
  const strong = results.filter((item) => item.score >= STRONG_MATCH_THRESHOLD);

  if (strong.length > 0) {
    // Still offer related concept browse when synonym hits exist
    (meta.synonymHits ?? []).slice(0, 2).forEach((conceptId) => {
      suggestions.push({
        id: `suggestion:concept:${conceptId}`,
        label: `Explore ${conceptId.replace(/-/g, " ")} concepts`,
        path: "/learn",
        reason: "Related educational concept from your search terms.",
        conceptId,
      });
    });
    return suggestions.slice(0, 3);
  }

  // Broader / corrected suggestions from synonym map
  Object.entries(SEARCH_SYNONYMS).forEach(([conceptId, phrases]) => {
    const hit = phrases.some(
      (phrase) =>
        normalizeSearchQuery(phrase).includes(normalized) ||
        normalized.includes(normalizeSearchQuery(phrase).split(" ")[0]),
    );
    if (hit || (meta.synonymHits ?? []).includes(conceptId)) {
      suggestions.push({
        id: `suggestion:broader:${conceptId}`,
        label: `Try “${conceptId.replace(/-/g, " ")}”`,
        path: "/learn",
        reason: "A broader educational topic related to your query.",
        conceptId,
      });
    }
  });

  if (meta.primaryConceptId) {
    suggestions.push({
      id: `suggestion:context:${meta.primaryConceptId}`,
      label: `Continue with ${meta.primaryConceptId.replace(/-/g, " ")}`,
      path: "/learn",
      reason: "Suggested from your current learning context.",
      conceptId: meta.primaryConceptId,
    });
  }

  // Always append safe fallbacks when weak/empty
  FALLBACK_SUGGESTIONS.forEach((item) => suggestions.push({ ...item }));

  // Deduplicate by id
  const seen = new Set();
  return suggestions
    .filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, 6);
}

/**
 * Resolve optional context into scoring boosts without exposing sensitive data.
 * @param {Object} [contextInput]
 * @returns {{ primaryConceptId: string|null, relatedConceptIds: string[], difficulty: string|null, lifecycleStage: string|null, recentItems: string[] }}
 */
export function resolveSearchContextBoost(contextInput) {
  if (!contextInput || typeof contextInput !== "object") {
    return {
      primaryConceptId: null,
      relatedConceptIds: [],
      difficulty: null,
      lifecycleStage: null,
      recentItems: [],
    };
  }

  // Accept either a raw context input or an already-built intelligence context
  let intelligence = contextInput;
  if (!contextInput.primaryConceptId && !contextInput.recommendationContext) {
    intelligence = buildIntelligenceContext(contextInput);
  }

  const primaryConceptId = intelligence.primaryConceptId ?? null;
  const relatedConceptIds = primaryConceptId
    ? getRelatedConceptIds(primaryConceptId, 1)
    : intelligence.relatedConceptIds ?? [];

  return {
    primaryConceptId,
    relatedConceptIds,
    difficulty: intelligence.difficulty ?? contextInput.difficulty ?? null,
    lifecycleStage: intelligence.lifecycleStage ?? null,
    recentItems: [
      ...(intelligence.recentItems ?? []),
      ...(contextInput.recentItems ?? []),
    ],
  };
}

/**
 * Filter index by optional type / category / difficulty constraints.
 * @param {Object[]} index
 * @param {{ types?: string[], category?: string, difficulty?: string }} options
 */
export function filterSearchIndex(index, options = {}) {
  let items = index;

  if (Array.isArray(options.types) && options.types.length) {
    const allowed = new Set(options.types);
    items = items.filter((item) => allowed.has(item.type));
  }

  if (options.category) {
    const category = String(options.category).toLowerCase();
    items = items.filter((item) => (item.category ?? "").toLowerCase() === category);
  }

  if (options.difficulty) {
    const difficulty = String(options.difficulty).toLowerCase();
    items = items.filter(
      (item) => !item.difficulty || item.difficulty.toLowerCase() === difficulty,
    );
  }

  return items;
}

export function getDefaultIndex() {
  return buildSearchIndex();
}
