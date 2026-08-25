/* global process */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_CALCULATORS } from "../src/data/calculators.js";
import { FINANCIAL_JOURNEYS } from "../src/data/journeys.js";
import { LEARNING_PATHS } from "../src/data/learnAcademy.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
let checks = 0;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

const page = read("src/pages/AiToolsPage.jsx");
const app = read("src/App.jsx");
const packageJson = read("package.json");
const css = read("src/styles/ai-guide.css");
const mascotPath = path.join(root, "src/assets/guide/fg-money-tree.png");
const calculatorPaths = new Set(ALL_CALCULATORS.map((item) => item.path));
const learnSlugs = new Set(LEARNING_PATHS.map((item) => item.slug));
const journeySlugs = new Set(FINANCIAL_JOURNEYS.map((item) => item.slug));
const liveHubRoutes = new Set([
  "/calculators",
  "/learn",
  "/financial-health-score",
  "/ai-tools",
]);
const pageLinks = [...page.matchAll(/\bto="([^"]+)"/g)].map((match) => match[1]);

function isAllowedIntelligenceLink(href) {
  if (liveHubRoutes.has(href) || calculatorPaths.has(href)) return true;
  const learnMatch = href.match(/^\/learn\/([a-z0-9-]+)$/u);
  if (learnMatch) return learnSlugs.has(learnMatch[1]);
  const journeyMatch = href.match(/^\/journeys\/([a-z0-9-]+)$/u);
  if (journeyMatch) return journeySlugs.has(journeyMatch[1]);
  return false;
}

assert(app.includes('path="/ai-tools"'), "A: /ai-tools route must exist");
assert(packageJson.includes('"validate:intelligence-ui"'), "package.json must expose validate:intelligence-ui");

assert(!/<input\b/iu.test(page), "B: AiToolsPage must not include an input field");
assert(!/<textarea\b/iu.test(page), "B: AiToolsPage must not include a textarea");
assert(!/<form\b/iu.test(page), "B: AiToolsPage must not include a form");
assert(!/\btype=["']submit["']/iu.test(page), "B: AiToolsPage must not include a submit control");
assert(!/>\s*Send\s*</u.test(page), "B: AiToolsPage must not include a Send button");
assert(!/\bcontentEditable\b/u.test(page), "B: AiToolsPage must not include editable chat content");

assert(!/\b(openai|anthropic|groq|gemini|claude)\b/iu.test(page), "C: AiToolsPage must not wire an LLM provider");
assert(!/\b(apiKey|OPENAI|ANTHROPIC|VITE_OPENAI|sk-[a-zA-Z0-9]{8,})\b/u.test(page), "C: AiToolsPage must not include frontend API keys");
assert(!/\bfetch\s*\(/u.test(page), "C: AiToolsPage must not call a backend from this page");
assert(!/intelligenceEngine/u.test(page), "C: AiToolsPage must not import an intelligence engine runtime");

assert(/Static Guided Preview/u.test(page), "D: Guided Preview must be labeled static");
assert(/Explore the Guided Preview/u.test(page), "D: Guided Preview title must stay educational, not chatbot-like");
assert(/not a live assistant/iu.test(page), "D: Guided Preview must be described as non-live");
assert(/aria-live="polite"/u.test(page), "D: Guided Preview must keep aria-live");
assert(/aria-pressed=/u.test(page), "D: Guided Preview must keep aria-pressed");

assert(/not personalized/iu.test(page), "E: Preview disclosure must state it is not personalized");
assert(/not a live AI assistant/iu.test(page), "E: Preview disclosure must state it is not a live AI assistant");
assert(/not stored/iu.test(page), "E: Preview disclosure must state it is not stored");
assert(/not sent to a backend/iu.test(page), "E: Preview disclosure must state it is not sent to a backend");

assert(page.includes('to="/calculators"'), "F: Live Calculators link must remain");
assert(page.includes('to="/learn"'), "F: Live Learn link must remain");
assert(page.includes("/journeys/build-wealth"), "G: Journey link must be /journeys/build-wealth");
assert(page.includes("/financial-health-score"), "H: Health Score link must be /financial-health-score");
assert(!/approved budget range/iu.test(page), 'I: Must not claim an "approved budget range"');
assert(!/AI-powered financial clarity/iu.test(page), 'J: Must not claim "AI-powered financial clarity"');
assert(!/best next steps/iu.test(page), 'K: Must not claim "best next steps"');
assert(!/Recent searches/u.test(page), "L: Must not show fake Recent searches");

assert(!/future health-score insights/iu.test(page), "M: Must not describe Health Score insights as a future tool substitute");
assert(!/Financial Health Score (is |itself is )?(coming soon|unavailable|not available)/iu.test(page), "M: Must not claim Health Score itself is unavailable");
assert(/The Financial Health Score tool itself is available today/u.test(page), "M: Health Score must remain described as available today");

assert(/Advanced AI assistance is in development/u.test(page), "N: Advanced AI assistance must be described as in development");
assert(/Not available today/u.test(page), "N: Phase 2 interactive assistant must be marked as not available today");
assert(/Future guardrailed interactive assistant/u.test(page), "N: Phase 2 must remain a future guardrailed assistant");
assert(/Educational discovery \+ static guided preview/u.test(page), "N: Phase 1 must describe current educational discovery and static preview");

assert(/from ["']\.\.\/assets\/guide\/fg-money-tree\.png["']/u.test(page), "O: FOINWI Guide asset must use fg-money-tree.png");
assert(fs.existsSync(mascotPath), "O: src/assets/guide/fg-money-tree.png must exist");
assert(!/fg-money-tree\.png\.png/u.test(page), "P: Page must not reference fg-money-tree.png.png");
assert(!/fg-money-tree\.png\.png/u.test(css), "P: CSS must not reference fg-money-tree.png.png");

assert(/visual learning companion/iu.test(page), "Q: Guide must be described as a visual learning companion");
assert(/not the underlying intelligence engine/iu.test(page), "Q: Guide copy must say it is not the intelligence engine");
assert(!/AI bot/iu.test(page), "Q: Production copy must not call the Guide an AI bot");
assert(!/\bn8n\b/iu.test(page), "R: Page must not mention n8n");
assert(!/live automation/iu.test(page), "R: Page must not claim live automation");

assert(/className="shrix-skip-link"/u.test(page), "S: Skip link must use the existing FOINWI pattern");
assert(/href="#main-content"/u.test(page), "S: Skip link must target #main-content");
assert(/id="main-content"/u.test(page), "S: Main landmark must use id=main-content");

assert(learnSlugs.has("loans-emi"), "T: Learn route /learn/loans-emi must remain valid");
assert(learnSlugs.has("mutual-funds-sip"), "T: Learn route /learn/mutual-funds-sip must remain valid");
assert(learnSlugs.has("income-tax-basics"), "T: Learn route /learn/income-tax-basics must remain valid");
assert(learnSlugs.has("retirement-planning"), "T: Learn route /learn/retirement-planning must remain valid");
assert(journeySlugs.has("build-wealth"), "T: Journey route /journeys/build-wealth must remain valid");
assert(calculatorPaths.has("/emi-calculator"), "T: Calculator route /emi-calculator must remain valid");
assert(pageLinks.length > 0, "T: AiToolsPage must expose live platform links");
pageLinks.forEach((href) => {
  assert(isAllowedIntelligenceLink(href), `T: Unknown or invalid Intelligence UI link ${href}`);
});

assert(!/Planned Intelligence Layer/u.test(page), "Layer section must not label live destinations as planned");
assert(/FOINWI Knowledge &amp; Planning Surfaces|FOINWI Knowledge & Planning Surfaces/u.test(page), "Layer section must use live-surface wording");
assert(/Human review for official financial data/u.test(page) === false, "Trust copy must not invent a human-review process");
assert(/source-aware content/iu.test(page) === false, "Trust copy must not invent source-aware content");
assert(/aria-label="FOINWI Guide"/u.test(page), "Hero mascot region must remain labeled as FOINWI Guide");
assert(/fi-ai__hero-mascot/u.test(page) && /fi-ai__hero-mascot/u.test(css), "Hero mascot styles must exist");
assert(/max-width: 720px/u.test(css) && /fi-ai__hero-mascot/u.test(css), "Mascot must have a mobile size rule");

if (failures.length) {
  console.error(`Intelligence UI validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Intelligence UI validation passed: ${checks} checks.`);
