/* global process */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEARNING_PATHS } from "../src/data/learnAcademy.js";
import {
  HEALTH_SCORE_CATEGORIES,
  HEALTH_SCORE_DISCLAIMER,
  HEALTH_SCORE_QUESTIONS,
} from "../src/data/healthScoreQuestions.js";
import {
  calculateHealthScore,
  HEALTH_SCORE_LEARN_MODULES,
  questionAffectsScore,
} from "../src/utils/healthScoreEngine.js";

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

function pickOption(question, compare) {
  return question.options.reduce((best, option) =>
    compare(option.score ?? 0, best.score ?? 0) ? option : best,
  );
}

function buildFixture(selectOption, sliderValue) {
  return Object.fromEntries(
    HEALTH_SCORE_QUESTIONS.map((question) => {
      if (question.type === "slider") {
        return [question.id, sliderValue(question)];
      }
      if (!questionAffectsScore(question)) {
        return [question.id, question.options[0].value];
      }
      return [question.id, selectOption(question).value];
    }),
  );
}

const lowestAnswers = buildFixture(
  (question) => pickOption(question, (score, best) => score < best),
  (question) => question.min,
);
const highestAnswers = buildFixture(
  (question) => pickOption(question, (score, best) => score > best),
  (question) => question.max,
);

const incomeQuestion = HEALTH_SCORE_QUESTIONS.find((question) => question.id === "monthly-income");
const lowest = calculateHealthScore(lowestAnswers);
const highest = calculateHealthScore(highestAnswers);
const incomeLow = calculateHealthScore({ ...lowestAnswers, "monthly-income": "under-25k" });
const incomeHigh = calculateHealthScore({ ...lowestAnswers, "monthly-income": "above-2l" });
const learnSlugs = new Set(LEARNING_PATHS.map((item) => item.slug));
const allowedLearnDestinations = new Set([...learnSlugs].map((slug) => `/learn/${slug}`));
const healthSource = [
  read("src/pages/FinancialHealthScorePage.jsx"),
  read("src/components/health/HealthScoreQuestionnaire.jsx"),
  read("src/components/health/HealthScoreDashboard.jsx"),
  read("src/components/health/CircularScore.jsx"),
  read("src/utils/healthScoreEngine.js"),
  read("src/data/healthScoreQuestions.js"),
].join("\n");
const app = read("src/App.jsx");
const dashboard = read("src/components/health/HealthScoreDashboard.jsx");

assert(HEALTH_SCORE_QUESTIONS.length === 12, "Health Score must contain exactly 12 questions");
assert(HEALTH_SCORE_CATEGORIES.length === 5, "Health Score must contain exactly five categories");
assert(incomeQuestion?.scoring === false, "Income question must be marked non-scoring");
assert(!questionAffectsScore(incomeQuestion), "Income question must be excluded from scoring utilities");
assert(
  JSON.stringify(incomeLow.categoryScores) === JSON.stringify(incomeHigh.categoryScores)
    && incomeLow.overallScore === incomeHigh.overallScore,
  "Changing only the income answer must not change category or overall scores",
);
assert(Number.isFinite(lowest.overallScore), "Lowest scored fixture must produce a finite overall score");
assert(lowest.categoryScores.every((item) => Number.isFinite(item.score)), "Lowest scored fixture must produce finite category scores");
assert(Number.isFinite(highest.overallScore), "Highest scored fixture must produce a finite overall score");
assert(highest.categoryScores.every((item) => Number.isFinite(item.score)), "Highest scored fixture must produce finite category scores");
[lowest, highest].forEach((result, index) => {
  const label = index === 0 ? "lowest" : "highest";
  result.categoryScores.forEach((item) => {
    assert(item.score >= 0 && item.score <= 100, `${label} ${item.id} score must stay within 0–100`);
  });
  assert(result.overallScore >= 0 && result.overallScore <= 100, `${label} overall score must stay within 0–100`);
  const expectedOverall = Math.round(
    result.categoryScores.reduce((sum, item) => sum + item.score, 0) / result.categoryScores.length,
  );
  assert(result.overallScore === expectedOverall, `${label} overall score must equal the equal average of category scores`);
});
assert(!/calculator/iu.test(HEALTH_SCORE_DISCLAIMER), "Health Score disclaimer must not call the feature a calculator");
HEALTH_SCORE_LEARN_MODULES.forEach((module) => {
  assert(module.path !== "/learn", `${module.title} must not use the generic /learn path`);
  assert(
    module.path === "/calculators" || allowedLearnDestinations.has(module.path),
    `${module.title} must use a real Learn route or /calculators`,
  );
});
assert(/How this score is built/u.test(dashboard), "Results dashboard must explain how this score is built");
assert(app.includes('path="/financial-health-score"'), "Health Score route must remain present");
assert(
  !/(api[_-]?key|authorization:\s*bearer|secret[_-]?key|localStorage|indexedDB|navigator\.sendBeacon)/iu.test(healthSource),
  "Health Score must not introduce backend credentials or data-collection behavior",
);
assert(!/https?:\/\//iu.test(healthSource), "Health Score must not introduce an external API host");

if (failures.length) {
  console.error(`Health Score validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Health Score validation passed: ${checks} checks.`);
