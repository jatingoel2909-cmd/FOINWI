/* global process */
import { readFile } from "node:fs/promises";
import { GUIDE_INTENTS } from "../src/intelligence/guide/guideIntents.js";
import { GUIDE_RESOURCE_CATALOG, validateGuideResources } from "../src/intelligence/guide/guideResources.js";
import { runIntelligence } from "../src/intelligence/engine/runIntelligence.js";
import { isApprovedIntelligencePath } from "../src/intelligence/engine/intelligenceAllowlist.js";
import {
  CANONICAL_JOURNEY_CONCEPT_MAP,
  CANONICAL_LESSON_CONCEPT_MAP,
  resolveCanonicalConcept,
} from "../src/intelligence/engine/canonicalConceptMaps.js";
import {
  INTELLIGENCE_CONFIDENCE,
  INTELLIGENCE_RESPONSE_TYPES,
  INTELLIGENCE_SCHEMA_VERSION,
  INTELLIGENCE_SOURCE_TYPES,
} from "../src/intelligence/engine/intelligenceTypes.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function run(query, extras = {}) {
  return runIntelligence({ query, surface: "api", ...extras });
}

function assertContract(response, label) {
  assert(response.schemaVersion === INTELLIGENCE_SCHEMA_VERSION, `${label}: missing schemaVersion`);
  assert(INTELLIGENCE_RESPONSE_TYPES.includes(response.responseType), `${label}: invalid responseType ${response.responseType}`);
  assert(INTELLIGENCE_CONFIDENCE.includes(response.confidence), `${label}: invalid confidence ${response.confidence}`);
  assert(INTELLIGENCE_SOURCE_TYPES.includes(response.sourceType), `${label}: invalid sourceType ${response.sourceType}`);
  assert(response.usedModel === false, `${label}: usedModel must be false`);
  assert(response.safety && response.safety.educationalOnly === true, `${label}: safety object missing`);
  assert(typeof response.explanation === "string" && response.explanation.length > 20, `${label}: explanation too short`);
  assert(Array.isArray(response.suggestedActions), `${label}: suggestedActions must be an array`);
  response.suggestedActions.forEach((action) => {
    assert(isApprovedIntelligencePath(action.path), `${label}: unapproved action path ${action.path}`);
    assert(GUIDE_RESOURCE_CATALOG[action.resourceId] || action.resourceId, `${label}: action missing resourceId`);
  });
}

const normalCases = [
  { query: "I want to invest ₹5,000 every month. Where should I begin?", intent: "invest-sip", type: "SUPPORTED", path: "/sip-calculator" },
  { query: "Why is my EMI so high?", intent: "loan-affordability", type: "SUPPORTED", path: "/emi-calculator" },
  { query: "Explain inflation simply.", intent: "explain-inflation", type: "SUPPORTED", path: "/inflation-calculator" },
  { query: "How does loan prepayment help?", intent: "loan-prepayment", type: "SUPPORTED", path: "/loan-prepayment-calculator" },
  { query: "Where can I learn about income tax?", intent: "tax-income", type: "SUPPORTED", path: "/learn/income-tax-basics" },
  { query: "I want to plan for retirement.", intent: "retirement-start", type: "SUPPORTED", path: "/retirement-calculator" },
  { query: "What tool should I use for a financial goal?", intent: "goal-planning", type: "SUPPORTED", path: "/goal-planner" },
  { query: "Convert USD to INR.", intent: "exchange-rates", type: "SUPPORTED", path: "/exchange-rates" },
  { query: "How does SIP work?", intent: "invest-sip", type: "SUPPORTED" },
  { query: "lumpsum investment", intent: "invest-lumpsum", type: "SUPPORTED" },
  { query: "fixed deposit", intent: "deposit-fd", type: "SUPPORTED" },
  { query: "recurring deposit", intent: "deposit-rd", type: "SUPPORTED" },
  { query: "ppf calculator", intent: "deposit-ppf", type: "SUPPORTED" },
  { query: "HRA exemption", intent: "tax-hra", type: "SUPPORTED" },
  { query: "what is GST", intent: "tax-gst", type: "SUPPORTED" },
  { query: "calculate gratuity", intent: "tax-gratuity", type: "SUPPORTED" },
  { query: "EPF calculator", intent: "tax-epf", type: "SUPPORTED" },
  { query: "NPS calculator", intent: "tax-nps", type: "SUPPORTED" },
  { query: "credit card debt", intent: "health-debt", type: "SUPPORTED" },
  { query: "what is insurance", intent: "health-protection", type: "SUPPORTED" },
  { query: "budget help", intent: "health-budgeting", type: "SUPPORTED" },
  { query: "emergency fund", intent: "health-emergency", type: "SUPPORTED" },
  { query: "financial health score", intent: "health-score", type: "SUPPORTED", path: "/financial-health-score" },
  { query: "which calculator should I use", intent: "discovery-calculator", type: "SUPPORTED" },
  { query: "what should I learn", intent: "discovery-learning", type: "SUPPORTED" },
  { query: "financial journey", intent: "discovery-journey", type: "SUPPORTED" },
];

normalCases.forEach((item) => {
  const response = run(item.query);
  assertContract(response, item.query);
  assert(response.responseType === item.type, `Expected ${item.type} for "${item.query}", got ${response.responseType}`);
  assert(response.intent === item.intent, `Expected ${item.intent} for "${item.query}", got ${response.intent}`);
  if (item.path) {
    assert(
      response.suggestedActions.some((action) => action.path === item.path)
        || response.calculator?.path === item.path
        || response.learn?.path === item.path
        || response.exchangeRates?.path === item.path
        || response.healthScore?.path === item.path
        || response.journey?.path === item.path,
      `Expected path ${item.path} for "${item.query}"`,
    );
  }
});

const synonymCases = [
  { query: "I can invest 10000 every month.", intent: "invest-sip" },
  { query: "currency converter", intent: "exchange-rates" },
  { query: "forex rate", intent: "exchange-rates" },
  { query: "convert dollars to rupees", intent: "exchange-rates" },
  { query: "what is inflaton", intent: "explain-inflation" },
  { query: "prepay loan", intent: "loan-prepayment" },
  { query: "retirment planning", intent: "retirement-start" },
];

synonymCases.forEach((item) => {
  const response = run(item.query);
  assertContract(response, item.query);
  if (item.intent) assert(response.intent === item.intent, `Synonym "${item.query}" expected ${item.intent}, got ${response.intent}`);
  if (item.type) assert(response.responseType === item.type, `Synonym "${item.query}" expected ${item.type}, got ${response.responseType}`);
});

["loan", "investment", "tax"].forEach((query) => {
  const response = run(query);
  assertContract(response, query);
  assert(response.responseType === "CLARIFY", `"${query}" should clarify, got ${response.responseType}`);
  assert(response.clarification?.options?.length >= 2, `"${query}" needs clarification options`);
  response.clarification.options.forEach((option) => {
    assert(GUIDE_INTENTS.some((intent) => intent.id === option.id), `Unknown clarification intent ${option.id}`);
  });
});

const safetyCases = [
  "Which stock should I buy?",
  "Which mutual fund should I invest in?",
  "Tell me where to invest for guaranteed 20% returns.",
  "Which bank will approve my loan?",
  "How can I avoid paying tax illegally?",
];

safetyCases.forEach((query) => {
  const response = run(query);
  assertContract(response, query);
  assert(response.responseType === "SAFETY", `Expected SAFETY for "${query}", got ${response.responseType}`);
  assert(response.confidence === "safety", `Expected safety confidence for "${query}"`);
  assert(!/you should invest|approved for you|guaranteed return/iu.test(response.explanation), `Unsafe advice in SAFETY for "${query}"`);
  response.suggestedActions.forEach((action) => {
    assert(isApprovedIntelligencePath(action.path), `SAFETY invented path ${action.path}`);
  });
});

const unsupported = run("Who won the cricket match?");
assertContract(unsupported, "cricket");
assert(unsupported.responseType === "UNSUPPORTED" || unsupported.responseType === "FALLBACK", "Cricket query must be unsupported or fallback");
assert(!unsupported.suggestedActions.some((action) => !isApprovedIntelligencePath(action.path)), "Unsupported response invented a path");

const first = run("How does SIP work?");
const second = run("How does SIP work?");
assert(JSON.stringify(first) === JSON.stringify(second), "runIntelligence is not deterministic for the same query");

assert(resolveCanonicalConcept({ lessonSlug: "mutual-funds-sip" }) === "sip", "Canonical learn map must route mutual-funds-sip to sip");
assert(resolveCanonicalConcept({ journeySlug: "build-wealth" }) === "sip", "Canonical journey map must route build-wealth to sip");
assert(CANONICAL_LESSON_CONCEPT_MAP["mutual-funds-sip"] === "sip", "Canonical lesson map missing sip");
assert(CANONICAL_JOURNEY_CONCEPT_MAP["build-wealth"] === "sip", "Canonical journey map missing sip");

assert(validateGuideResources().length === 0, "Resource catalog contains an unapproved path");
assert(isApprovedIntelligencePath("/exchange-rates"), "Allowlist must include Exchange Rates");
assert(isApprovedIntelligencePath("/learn/money-basics/inflation"), "Allowlist must include inflation lesson");
assert(!isApprovedIntelligencePath("/not-a-real-tool"), "Allowlist must reject unknown routes");

const amount = run("I can invest ₹5,000 monthly");
assert(amount.responseType === "SUPPORTED", "Amount-bearing SIP query should stay educational");
assert(!/you should invest ₹?\s*5/iu.test(`${amount.explanation} ${amount.keyPoints.join(" ")}`), "Amount must not become personalised advice");

const engineFiles = [
  new URL("../src/intelligence/engine/runIntelligence.js", import.meta.url),
  new URL("../src/intelligence/engine/intelligenceTypes.js", import.meta.url),
  new URL("../src/intelligence/engine/intelligenceAllowlist.js", import.meta.url),
  new URL("../src/intelligence/guide/guideEngine.js", import.meta.url),
  new URL("../src/intelligence/guide/guideSafety.js", import.meta.url),
  new URL("../src/intelligence/guide/guideResources.js", import.meta.url),
  new URL("../src/intelligence/guide/guideIntents.js", import.meta.url),
];

const source = (await Promise.all(engineFiles.map((file) => readFile(file, "utf8")))).join("\n");
assert(!/\b(fetch|axios|openai|anthropic|claude|gemini|groq|websocket)\b/iu.test(source), "Intelligence engine contains a network or model dependency");
assert(!/\b(localStorage|sessionStorage|document\.cookie)\b/u.test(source), "Intelligence engine contains persistence");
assert(!/\b(apiKey|OPENAI|ANTHROPIC|VITE_OPENAI|sk-[a-zA-Z0-9]{8,})\b/u.test(source), "Intelligence engine contains provider keys");

if (failures.length) {
  console.error(`Intelligence engine validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Intelligence engine validation passed: ${checks} checks.`);
