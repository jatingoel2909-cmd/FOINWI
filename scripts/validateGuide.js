/* global process */
import { readFile } from "node:fs/promises";
import { GUIDE_INTENTS } from "../src/guide-trial/guideIntents.js";
import { getGuideFollowUps, hasGuideAmountSignal, matchGuideQuery, normalizeGuideQuery } from "../src/guide-trial/guideEngine.js";
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
  { query: "I want to start investing.", intentId: "invest-basics" },
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

const contractCases = [
  { query: "i have loan how pay", responseType: "CLARIFY", family: "loans" },
  { query: "i have a 10 lakh loan how to pay it", responseType: "CLARIFY", family: "loans" },
  { query: "emi too high what do", responseType: "CLARIFY", family: "loans" },
  { query: "want save 10k every month", responseType: "CLARIFY", family: "health" },
  { query: "salary finish every month", intentId: "health-budgeting", responseType: "SUPPORTED" },
  { query: "fd rd difference", intentId: "compare-fd-rd", responseType: "SUPPORTED" },
  { query: "what cagr mean", intentId: "invest-cagr", responseType: "SUPPORTED" },
  { query: "retirement no planning", responseType: "CLARIFY", family: "retirement" },
  { query: "i need home loan", responseType: "CLARIFY", family: "loans" },
  { query: "money help", responseType: "CLARIFY", family: "discovery" },
  { query: "explain sip", intentId: "invest-basics", responseType: "SUPPORTED" },
  { query: "how investing works", intentId: "invest-basics", responseType: "SUPPORTED" },
  { query: "prepay loan", intentId: "loan-prepayment", responseType: "SUPPORTED" },
  { query: "credit card debt", intentId: "health-debt", responseType: "SUPPORTED" },
  { query: "emergency fun", intentId: "health-emergency", responseType: "SUPPORTED" },
  { query: "retirment plan", responseType: "CLARIFY", family: "retirement" },
  { query: "budjet help", intentId: "health-budgeting", responseType: "SUPPORTED" },
  { query: "what does ppf mean", responseType: "CLARIFY", family: "deposits" },
  { query: "how avoid tax", responseType: "SAFETY" },
  { query: "tell me where to invest 5 lakh", responseType: "SAFETY" },
  { query: "exact mutual fund for me", responseType: "SAFETY" },
  { query: "recommend a stock to buy", responseType: "SAFETY" },
  { query: "which fund is right for me", responseType: "SAFETY" },
  { query: "what return should I assume for my FD?", responseType: "CLARIFY", family: "deposits" },

  { query: "loan", responseType: "CLARIFY", family: "loans" },
  { query: "borrow money", responseType: "CLARIFY", family: "loans" },
  { query: "monthly instalment", intentId: "loan-emi", responseType: "SUPPORTED" },
  { query: "installment issue", responseType: "CLARIFY", family: "loans" },
  { query: "loan interest", responseType: "CLARIFY", family: "loans" },
  { query: "home loan help", responseType: "CLARIFY", family: "loans" },
  { query: "loan tenure", intentId: "loan-tenure", responseType: "SUPPORTED" },
  { query: "loan prepayment", intentId: "loan-prepayment", responseType: "SUPPORTED" },
  { query: "how much emi", intentId: "loan-emi", responseType: "SUPPORTED" },
  { query: "affordable emi", intentId: "loan-affordability", responseType: "SUPPORTED" },

  { query: "investing", responseType: "CLARIFY", family: "investing" },
  { query: "mutual fund basics", responseType: "CLARIFY", family: "investing" },
  { query: "what is mutual fund", intentId: "invest-basics", responseType: "SUPPORTED" },
  { query: "want start investing", intentId: "invest-basics", responseType: "SUPPORTED" },
  { query: "monthly investment", responseType: "CLARIFY", family: "investing" },
  { query: "compound interest", intentId: "invest-compounding", responseType: "SUPPORTED" },
  { query: "what is compound interest", intentId: "invest-compounding", responseType: "SUPPORTED" },
  { query: "explain compound interest", intentId: "invest-compounding", responseType: "SUPPORTED" },
  { query: "how compound interest works", intentId: "invest-compounding", responseType: "SUPPORTED" },
  { query: "sip", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "lumpsom investment", intentId: "invest-lumpsum", responseType: "SUPPORTED" },
  { query: "compunding", responseType: "FALLBACK" },
  { query: "cagr", responseType: "CLARIFY", family: "investing" },
  { query: "swp withdrawal", responseType: "CLARIFY", family: "investing" },

  { query: "fd", intentId: "deposit-fd", responseType: "SUPPORTED" },
  { query: "rd", intentId: "deposit-rd", responseType: "SUPPORTED" },
  { query: "ppf", intentId: "deposit-ppf", responseType: "SUPPORTED" },
  { query: "fixed deposit", intentId: "deposit-fd", responseType: "SUPPORTED" },
  { query: "recurring deposit", intentId: "deposit-rd", responseType: "SUPPORTED" },
  { query: "how does fd work", intentId: "deposit-basics", responseType: "SUPPORTED" },
  { query: "deposit basics", intentId: "deposit-basics", responseType: "SUPPORTED" },
  { query: "fd maturity", intentId: "deposit-fd", responseType: "SUPPORTED" },
  { query: "rd maturity", intentId: "deposit-rd", responseType: "SUPPORTED" },
  { query: "difference fd rd", responseType: "CLARIFY", family: "deposits" },

  { query: "tax", responseType: "CLARIFY", family: "tax" },
  { query: "how can i learn about tax", responseType: "CLARIFY", family: "tax" },
  { query: "hra", intentId: "tax-hra", responseType: "SUPPORTED" },
  { query: "gst", intentId: "tax-gst", responseType: "SUPPORTED" },
  { query: "epf", intentId: "tax-epf", responseType: "SUPPORTED" },
  { query: "nps", intentId: "tax-nps", responseType: "SUPPORTED" },
  { query: "gratuity", intentId: "tax-gratuity", responseType: "SUPPORTED" },
  { query: "how tax works", intentId: "tax-income", responseType: "SUPPORTED" },
  { query: "income tax", intentId: "tax-income", responseType: "SUPPORTED" },
  { query: "how to sav tax", responseType: "CLARIFY", family: "tax" },

  { query: "budget", responseType: "CLARIFY", family: "health" },
  { query: "salary problem", responseType: "CLARIFY", family: "health" },
  { query: "spending too much", responseType: "CLARIFY", family: "health" },
  { query: "emergncy fund", intentId: "health-emergency", responseType: "SUPPORTED" },
  { query: "emergency savings", intentId: "health-emergency", responseType: "SUPPORTED" },
  { query: "debt", responseType: "CLARIFY", family: "health" },
  { query: "insurance basics", intentId: "health-protection", responseType: "SUPPORTED" },
  { query: "what is insurance", intentId: "health-protection", responseType: "SUPPORTED" },
  { query: "financial health", intentId: "health-score", responseType: "SUPPORTED" },
  { query: "money confused", responseType: "CLARIFY", family: "discovery" },

  { query: "₹10,000 sip", responseType: "CLARIFY", family: "investing" },
  { query: "Rs 10000 monthly investment", responseType: "CLARIFY", family: "investing" },
  { query: "Rs. 10,000 invest", responseType: "CLARIFY", family: "investing" },
  { query: "i can invest 10k monthly", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "i can invest 50k monthly", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "i can invest 1 lakh", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "i can invest 10 lakh", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "i can invest 1.5 lakh", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "i can invest 1.5L", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "loan of 10 lakh", responseType: "CLARIFY", family: "loans" },
  { query: "home loan 50L", responseType: "CLARIFY", family: "loans" },
  { query: "fd 1 lakh", responseType: "CLARIFY", family: "deposits" },

  { query: "which share should i buy", responseType: "SAFETY" },
  { query: "best fund for me", responseType: "SAFETY" },
  { query: "what crypto should i buy", responseType: "SAFETY" },
  { query: "where should i invest", responseType: "SAFETY" },
  { query: "recommend where i invest", responseType: "SAFETY" },
  { query: "guarantee 20 return", responseType: "SAFETY" },
  { query: "can you assure 15 percent", responseType: "SAFETY" },
  { query: "best lender approval", responseType: "SAFETY" },
  { query: "escape tax", responseType: "SAFETY" },
  { query: "hide tax", responseType: "SAFETY" },

  { query: "i can invest 10000 monthly", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "how does sip work", intentId: "invest-sip", responseType: "SUPPORTED" },
  { query: "what is cagr", intentId: "invest-cagr", responseType: "SUPPORTED" },
  { query: "how compounding works", intentId: "invest-compounding", responseType: "SUPPORTED" },
  { query: "how does fd work", intentId: "deposit-basics", responseType: "SUPPORTED" },
  { query: "plan my retirement", intentId: "retirement-start", responseType: "SUPPORTED" },
  { query: "calculate income tax", intentId: "tax-income", responseType: "SUPPORTED" },
  { query: "purple flying bananas", responseType: "FALLBACK" },
  { query: "hello there", responseType: "FALLBACK" },
  { query: "weather tomorrow", responseType: "FALLBACK" },
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

contractCases.forEach(({ query, intentId, responseType, family }) => {
  const result = matchGuideQuery(query);
  assert(result.responseType === responseType, `Expected ${responseType} for "${query}", got ${result.responseType}`);
  if (intentId) assert(result.intent?.id === intentId, `Expected ${intentId} for "${query}", got ${result.intent?.id}`);
  if (family) assert(result.family === family, `Expected ${family} family for "${query}", got ${result.family}`);
  if (responseType === "CLARIFY") {
    assert(result.confidence === "medium" && result.clarificationOptions?.length >= 2, `Expected clarification contract for "${query}"`);
  }
  if (responseType === "SUPPORTED") assert(result.confidence === "high", `Expected high confidence for "${query}"`);
});

const repeatA = matchGuideQuery("How much EMI can I afford?");
const repeatB = matchGuideQuery("How much EMI can I afford?");
assert(JSON.stringify(repeatA) === JSON.stringify(repeatB), "Guide matching is not repeatable for the same query");
assert(normalizeGuideQuery("₹10,000 in SIP!") === "rupee 10 000 in sip", "Currency and punctuation normalization changed unexpectedly");
["₹10,000", "Rs 10000", "Rs. 10,000", "10k", "50k", "1 lakh", "10 lakh", "1.5 lakh", "1.5L"].forEach((amount) => {
  assert(hasGuideAmountSignal(amount), `Amount signal was not recognised for "${amount}"`);
});

GUIDE_INTENTS.forEach((intent) => {
  const resources = getGuideResources(intent.resourceIds);
  assert(resources.length === intent.resourceIds.length, `Invalid resource route in ${intent.id}`);
  assert(resources.every((resource) => ["CALCULATE", "CHECK", "EXPLORE", "LEARN", "PLAN"].includes(resource.type)), `Invalid resource type in ${intent.id}`);
  assert(resources.every((resource) => resource.title && resource.description && resource.path.startsWith("/")), `Incomplete resource metadata in ${intent.id}`);
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

const queryCount = exactCases.length + additionalCases.length + contractCases.length;
assert(queryCount >= 150, `Guide query coverage ${queryCount} is below 150`);

if (failures.length) {
  console.error(`Guide validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Guide validation passed: ${checks} checks across ${queryCount} queries and ${GUIDE_INTENTS.length} intents.`);
