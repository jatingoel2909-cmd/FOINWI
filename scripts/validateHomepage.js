/* global process */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_CALCULATORS, POPULAR_CALCULATOR_TITLES, getPopularCalculators } from "../src/data/calculators.js";
import { FINANCIAL_JOURNEYS } from "../src/data/journeys.js";

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

const home = read("src/pages/Home.jsx");
const hero = read("src/components/Hero.jsx");
const preview = read("src/components/home/AiToolsPreviewSection.jsx");
const learnPreview = read("src/components/home/LearnPreviewSection.jsx");
const journeys = read("src/components/home/FinancialJourneysSection.jsx");
const footer = read("src/components/Footer.jsx");
const app = read("src/App.jsx");
const packageJson = read("package.json");
const navigation = read("src/utils/homeNavigation.js");
const homepageSource = [home, hero, preview, learnPreview, journeys].join("\n");
const calculatorPaths = new Set(ALL_CALCULATORS.map((item) => item.path));
const popular = getPopularCalculators();
const journeySlugs = new Set(FINANCIAL_JOURNEYS.map((item) => item.slug));

assert(app.includes('path="/"'), "A: Homepage route must remain /");
assert(app.includes("element={<Home />}"), "A: App must render Home at /");

assert(home.includes('className="shrix-skip-link"'), "B: Homepage must use the existing skip-link pattern");
assert(home.includes('href="#main-content"'), "B: Skip link must target #main-content");
assert(home.includes('id="main-content"'), "B: Homepage main landmark must use id=main-content");

assert(home.includes("getPopularCalculators"), "C: Homepage popular calculators must come from calculator data");
assert(popular.length > 0, "C: Popular calculator list must not be empty");
popular.forEach((calculator) => {
  assert(calculatorPaths.has(calculator.path), `C: Popular calculator ${calculator.title} must be a real calculator`);
  assert(calculator.path !== "/exchange-rates", "D: Exchange Rates must not appear in the popular calculator grid");
});
assert(!homepageSource.includes("/exchange-rates"), "D: Homepage must not insert Exchange Rates into the calculator grid");
assert(POPULAR_CALCULATOR_TITLES.every((title) => ALL_CALCULATORS.some((item) => item.title === title)), "C: Popular titles must exist in ALL_CALCULATORS");

assert(home.includes('to="/calculators"') || hero.includes('to="/calculators"'), "E: Homepage must still link to /calculators");
assert(hero.includes('to="/calculators"'), "E: Hero must keep the calculators CTA");

assert(preview.includes('to="/ai-tools"'), "F: Intelligence CTA must point to /ai-tools");
assert(/Explore FOINWI Intelligence/u.test(preview), "F: Intelligence CTA label must remain a live Intelligence destination");

assert(!/<input\b/iu.test(preview), "G: Intelligence preview must not include an input field");
assert(!/<textarea\b/iu.test(preview), "G: Intelligence preview must not include a textarea");
assert(!/<form\b/iu.test(preview), "G: Intelligence preview must not include a form");
assert(!/\btype=["']submit["']/iu.test(preview), "G: Intelligence preview must not include a submit control");
assert(!/>\s*Send\s*</u.test(preview), "G: Intelligence preview must not include a Send control");

assert(!/\b(openai|anthropic|groq|gemini|claude)\b/iu.test(preview), "H: Intelligence preview must not wire an LLM provider");
assert(!/\b(apiKey|OPENAI|ANTHROPIC|VITE_OPENAI)\b/u.test(preview), "H: Intelligence preview must not include frontend API keys");
assert(!/\bfetch\s*\(/u.test(preview), "H: Intelligence preview must not call a backend");

assert(/Static concept preview/u.test(preview), "I: Preview must be labeled a static concept preview");
assert(/not a live assistant|static concept preview/iu.test(preview), "I: Preview must remain explicitly non-live");
assert(/Advanced AI assistance is in development/u.test(preview), "J: Advanced AI assistance must be described as in development");
assert(!/View AI Roadmap/u.test(preview), "F: CTA must not still say View AI Roadmap");

assert(!/AI-powered financial clarity/iu.test(homepageSource), 'K: Must not claim "AI-powered financial clarity"');
assert(!/approved budget range/iu.test(homepageSource), 'L: Must not claim an "approved budget range"');
assert(!/\bguaranteed returns?\b/iu.test(homepageSource), "M: Homepage must not use guaranteed-return wording");

assert(/Illustrative example only/u.test(hero), "N: SIP preview must remain explicitly illustrative");
assert(/₹10,000\/month/u.test(hero), "O: SIP assumptions must expose ₹10,000/month");
assert(/15 years/u.test(hero), "O: SIP assumptions must expose 15 years");
assert(/assumed 12%/u.test(hero), "O: SIP assumptions must expose assumed 12%");
assert(!/<h2>₹10,000\/month<\/h2>/u.test(hero), "Hero SIP amount must not be a section heading");

assert(hero.includes('to="/financial-health-score"') || home.includes('to="/financial-health-score"'), "P: Homepage must link to /financial-health-score");
assert(/educational[\s\S]{0,80}Financial Health Score/u.test(hero), "Q: Health Score homepage wording must stay educational");
assert(!/creditworthiness|financial verdict|AI-powered|personalized advice|diagnostic tool/iu.test(hero), "Q: Health Score homepage wording must not become a verdict or AI claim");

assert(journeys.includes("`/journeys/${journey.slug}`") || journeys.includes("/journeys/${journey.slug}"), "R: Journey discovery must use real /journeys/:slug destinations");
assert(journeySlugs.size >= 1, "R: Journey data must remain available");
assert(learnPreview.includes('to="/learn"'), "S: Learn CTA must remain /learn");
assert(learnPreview.includes("Investing Fundamentals"), "Learn chip must use Investing Fundamentals");
assert(learnPreview.includes("Loans & EMI"), "Learn chip must use Loans & EMI");
assert(learnPreview.includes("Income Tax Basics"), "Learn chip must use Income Tax Basics");

assert(home.includes("<Footer"), "T: Homepage must still render Footer contact");
assert(footer.includes('id="contact"'), "T: Contact target #contact must remain available");
assert(footer.includes("mailto:support@foinwi.com"), "U: support@foinwi.com must remain the contact email");

assert(!/testimonial/iu.test(homepageSource), "V: Homepage must not introduce fake testimonials");
assert(!/\b\d+\+?\s+(users|customers|reviews)\b/iu.test(homepageSource), "V: Homepage must not introduce fake usage counters");

assert(/prefers-reduced-motion: reduce/u.test(navigation), "Reduced-motion homepage scrolling must be respected");
assert(/\? "auto" : "smooth"/u.test(navigation) || (/["']auto["']/u.test(navigation) && /["']smooth["']/u.test(navigation)), "Homepage scroll must keep auto and smooth behaviors");
assert(home.includes('id="home-daily-insight-title"'), "Homepage Daily Insight must expose a section-level heading target");
assert(/<h2 id="home-daily-insight-title"/u.test(home), "Homepage Daily Insight must include a section-level h2");
assert(packageJson.includes('"validate:homepage"'), "package.json must expose validate:homepage");

if (failures.length) {
  console.error(`Homepage validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Homepage validation passed: ${checks} checks.`);
