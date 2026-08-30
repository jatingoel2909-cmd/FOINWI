/**
 * Deterministic-first AI eligibility. Never invokes a model.
 */

import { matchGuideQuery } from "../guide/guideEngine.js";
import { getPreModelBlockReason } from "./aiGuardrails.js";

const SIMPLE_NAVIGATION = Object.freeze([
  "sip calculator",
  "emi calculator",
  "explain inflation",
  "explain inflation simply",
  "loan prepayment",
  "income tax",
  "retirement planning",
  "usd to inr",
  "convert usd to inr",
  "financial health score",
  "exchange rate",
  "currency converter",
]);

const SIMPLIFY_SIGNALS = Object.freeze([
  "explain like",
  "like i am completely new",
  "like i'm completely new",
  "i understand nothing",
  "i don't understand",
  "i do not understand",
  "in simple words",
  "in simpler words",
]);

const FINANCIAL_TOKENS = Object.freeze([
  "invest", "loan", "emi", "tax", "sip", "money", "save", "inflation",
  "retirement", "goal", "debt", "insurance", "budget",
]);

function wordCount(query) {
  return query.split(/\s+/u).filter(Boolean).length;
}

function includesAny(value, phrases) {
  return phrases.some((phrase) => value.includes(phrase));
}

export function routeAiTask(query = "") {
  const trimmed = String(query).replace(/\s+/gu, " ").trim();
  const lowered = trimmed.toLowerCase();
  const blockReason = getPreModelBlockReason(trimmed);
  if (blockReason) {
    return { useAi: false, task: null, reason: blockReason };
  }

  if (!trimmed) {
    return { useAi: false, task: null, reason: "empty-query" };
  }

  if (includesAny(lowered, SIMPLE_NAVIGATION) && wordCount(trimmed) <= 8) {
    return { useAi: false, task: null, reason: "deterministic-simple-navigation" };
  }

  const match = matchGuideQuery(trimmed);

  if (match.responseType === "SAFETY") {
    return { useAi: false, task: null, reason: "safety-refusal" };
  }

  if (match.responseType === "SUPPORTED" && match.confidence === "high") {
    if (includesAny(lowered, SIMPLIFY_SIGNALS) && wordCount(trimmed) >= 10) {
      return { useAi: true, task: "SIMPLIFY", reason: "simplify-approved-copy" };
    }
    return { useAi: false, task: null, reason: "deterministic-high-confidence" };
  }

  if (match.responseType === "CLARIFY") {
    return { useAi: true, task: "CLARIFY", reason: "ambiguous-natural-language" };
  }

  const looksFinancial = FINANCIAL_TOKENS.some((token) => lowered.includes(token));
  if (looksFinancial && wordCount(trimmed) >= 12) {
    return { useAi: true, task: "CLASSIFY", reason: "messy-financial-language" };
  }

  return { useAi: false, task: null, reason: "deterministic-fallback" };
}
