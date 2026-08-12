/* global process */
import { readFile } from "node:fs/promises";
import { GUIDE_INTENTS } from "../src/guide-trial/guideIntents.js";
import { getGuideFollowUps, matchGuideQuery, normalizeGuideQuery } from "../src/guide-trial/guideEngine.js";
import { getGuideResources, validateGuideResources } from "../src/guide-trial/guideResources.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

const exactCases = GUIDE_INTENTS.map((intent) => ({
  query: intent.phrases[0],
  intentId: intent.id,
}));

const additionalCases = [
  { query: "How much EMI can I afford?", intentId: "loan-affordability" },
  { query: "I can invest ₹10,000 every month.", intentId: "invest-sip" },
  { query: "I can invest 10000 every month.", intentId: "invest-sip" },
  { query: "I want to start investing.", intentId: "invest-sip" },
  { query: "How does SIP work?", intentId: "invest-sip" },
  { query: "I want to plan my retirement.", intentId: "retirement-start" },
  { query: "My salary comes but nothing remains.", intentId: "health-budgeting" },
  { query: "Which calculator should I use?", intentId: "discovery-calculator" },
  { query: "I want to save for my child's education.", intentId: "goal-education" },
  { query: "What is compound interest?", intentId: "invest-compounding" },
  { query: "compare fd and rd", intentId: "compare-fd-rd" },
  { query: "rd or fd", intentId: "compare-fd-rd" },
  { query: "difference between fd and rd", intentId: "compare-fd-rd" },
  { query: "home loan qualify", intentId: "loan-eligibility" },
  { query: "how to reduce loan payment early", intentId: "loan-prepayment" },
  { query: "i am confused about money", intentId: "discovery-start" },
  { query: "tax basics please", intentId: "tax-income" },
  { query: "What is the best mutual fund?", responseType: "SAFETY" },
  { query: "What should I invest in?", responseType: "SAFETY" },
  { query: "Which stock should I buy?", responseType: "SAFETY" },
  { query: "Guarantee me 20%", responseType: "SAFETY" },
  { query: "Which bank will approve my loan?", responseType: "SAFETY" },
  { query: "How can I avoid paying tax?", responseType: "SAFETY" },
  { query: "Tell me exactly where to invest ₹5 lakh.", responseType: "SAFETY" },
  { query: "", responseType: "FALLBACK" },
  { query: "purple flying bananas", responseType: "FALLBACK" },
];

exactCases.forEach(({ query, intentId }) => {
  const result = matchGuideQuery(query);
  assert(result.responseType === "SUPPORTED", `Expected supported response for "${query}"`);
  assert(result.intent?.id === intentId, `Expected ${intentId} for "${query}", got ${result.intent?.id}`);
});

additionalCases.forEach(({ query, intentId, responseType }) => {
  const result = matchGuideQuery(query);
  if (intentId) assert(result.intent?.id === intentId, `Expected ${intentId} for "${query}", got ${result.intent?.id}`);
  if (responseType) assert(result.responseType === responseType, `Expected ${responseType} for "${query}", got ${result.responseType}`);
});

const repeatA = matchGuideQuery("How much EMI can I afford?");
const repeatB = matchGuideQuery("How much EMI can I afford?");
assert(JSON.stringify(repeatA) === JSON.stringify(repeatB), "Guide matching is not repeatable for the same query");
assert(normalizeGuideQuery("₹10,000 in SIP!") === "rupee 10 000 in sip", "Currency and punctuation normalization changed unexpectedly");

GUIDE_INTENTS.forEach((intent) => {
  const resources = getGuideResources(intent.resourceIds);
  assert(resources.length === intent.resourceIds.length, `Invalid resource route in ${intent.id}`);
  assert(intent.simpleAnswer.length > 30 && intent.deeperExplanation.length > 40, `Insufficient reviewed copy in ${intent.id}`);
  const responseText = `${intent.simpleAnswer} ${intent.deeperExplanation}`.toLowerCase();
  assert(!/\b(guaranteed|approved|certain|best|lowest)\b/u.test(responseText), `Unsafe certainty wording in ${intent.id}`);
  if (intent.followUps) assert(getGuideFollowUps(intent).length === intent.followUps.length, `Broken follow-up flow in ${intent.id}`);
});

assert(validateGuideResources().length === 0, "Guide resource catalog contains a missing route");
assert(GUIDE_INTENTS.length >= 30 && GUIDE_INTENTS.length <= 50, `Intent count ${GUIDE_INTENTS.length} is outside trial target`);

const guideSourceFiles = [
  new URL("../src/guide-trial/GuideTrialPage.jsx", import.meta.url),
  new URL("../src/guide-trial/guideEngine.js", import.meta.url),
  new URL("../src/guide-trial/guideIntents.js", import.meta.url),
  new URL("../src/guide-trial/guideResources.js", import.meta.url),
  new URL("../src/guide-trial/guideSafety.js", import.meta.url),
];

const source = await Promise.all(guideSourceFiles.map((file) => readFile(file, "utf8")));
const joinedSource = source.join("\n");
assert(!/\b(fetch|axios|openai|claude|gemini|websocket)\b/iu.test(joinedSource), "Guide code contains an external API/network dependency");
assert(!/\b(localStorage|sessionStorage|document\.cookie)\b/u.test(joinedSource), "Guide code contains conversation persistence");

if (failures.length) {
  console.error(`Guide validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Guide validation passed: ${checks} checks across ${exactCases.length + additionalCases.length} queries and ${GUIDE_INTENTS.length} intents.`);
