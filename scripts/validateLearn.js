/* global process */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_CALCULATORS } from "../src/data/calculators.js";
import {
  LEARN_JOURNEY_DESTINATIONS,
  LEARN_DISCOVERY_TOPICS,
  LEARN_PATH_CONNECTIONS,
  LEARN_SEARCH_SYNONYMS,
  LEARN_START_OPTIONS,
  LEARNING_PATHS,
} from "../src/data/learnAcademy.js";
import { FINANCIAL_JOURNEYS } from "../src/data/journeys.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function unique(values) {
  return new Set(values).size === values.length;
}

const pathSlugs = LEARNING_PATHS.map((path) => path.slug);
const lessons = LEARNING_PATHS.flatMap((path) => path.lessons);
const lessonIds = lessons.map((lesson) => lesson.id);
const calculatorPaths = new Set(ALL_CALCULATORS.map((calculator) => calculator.path));
const journeyPaths = new Set(FINANCIAL_JOURNEYS.map((journey) => `/journeys/${journey.slug}`));
const healthPath = "/financial-health-score";
const prohibitedTrustLanguage = /\b(guaranteed\s+(?:return|outcome|saving)|approved\s+(?:loan|budget)|best\s+(?:investment|fund|emi|return|rate|option)|lowest\s+(?:emi|rate|return))\b/iu;
const placeholderContent = /\b(todo|lorem ipsum|placeholder|coming soon)\b/iu;
const currentRateClaim = /\b\d+(?:\.\d+)?\s*(?:%|percent)\b.*\b(?:current|return|rate|interest)\b|\bcurrent\s+(?:rate|slab|limit)\b/iu;

assert(unique(pathSlugs), "Learning path slugs must be unique");
assert(unique(lessonIds), "Lesson IDs must be unique across all paths");

LEARNING_PATHS.forEach((path) => {
  assert(path.slug && path.title && path.description && path.duration && path.difficulty, `Missing required path fields in ${path.slug}`);
  assert(Array.isArray(path.lessons) && path.lessons.length > 0, `Path ${path.slug} has no lessons`);
  assert(path.nextPath && pathSlugs.includes(path.nextPath), `Path ${path.slug} has an invalid nextPath`);
  assert(unique(path.lessons.map((lesson) => lesson.slug)), `Lesson slugs must be unique within ${path.slug}`);
  assert(path.relatedCalculators.every((calculatorPath) => calculatorPaths.has(calculatorPath)), `Path ${path.slug} has an invalid calculator destination`);

  path.lessons.forEach((lesson) => {
    assert(
      lesson.id && lesson.slug && lesson.title && lesson.summary && lesson.level && lesson.pathSlug
      && Number.isFinite(lesson.estimatedMinutes) && Array.isArray(lesson.calculatorLinks)
      && Array.isArray(lesson.relatedLessonIds) && lesson.contentStatus === "complete",
      `Missing required preview fields in ${lesson.id}`,
    );
    assert(lesson.pathSlug === path.slug, `Lesson ${lesson.id} has a mismatched pathSlug`);
    assert(lesson.calculatorLinks.every((calculatorPath) => calculatorPaths.has(calculatorPath)), `Lesson ${lesson.id} has an invalid calculator destination`);
    assert(lesson.calculators.every((calculatorPath) => calculatorPaths.has(calculatorPath)), `Lesson ${lesson.id} has an invalid legacy calculator destination`);
    assert(lesson.relatedLessonIds.every((relatedId) => lessonIds.includes(relatedId)), `Lesson ${lesson.id} has an invalid related lesson`);

    const content = [
      lesson.title,
      lesson.summary,
      lesson.simpleExplanation ?? "",
      lesson.whyItMatters ?? "",
      ...lesson.keyIdeas,
      lesson.deeperExplanation ?? "",
      lesson.example ?? "",
      ...lesson.nextSteps,
    ].join(" ");
    assert(!placeholderContent.test(content), `Placeholder content found in ${lesson.id}`);
    assert(!prohibitedTrustLanguage.test(content), `Prohibited trust language found in ${lesson.id}`);
    const fullContent = [
      lesson.simpleExplanation ?? "",
      lesson.whyItMatters ?? "",
      ...lesson.keyIdeas,
      lesson.deeperExplanation ?? "",
      lesson.example ?? "",
      ...lesson.nextSteps,
    ].join(" ");
    assert(!currentRateClaim.test(fullContent), `Current rate claim found in ${lesson.id}`);

    assert(Boolean(lesson.simpleExplanation), `Complete lesson ${lesson.id} is missing a simple explanation`);
    assert(Boolean(lesson.whyItMatters), `Complete lesson ${lesson.id} is missing practical context`);
    assert(lesson.keyIdeas.length > 0, `Complete lesson ${lesson.id} is missing key ideas`);
    assert(Boolean(lesson.deeperExplanation), `Complete lesson ${lesson.id} is missing a deeper explanation`);
    assert(Boolean(lesson.example), `Complete lesson ${lesson.id} is missing an example`);
    assert(lesson.nextSteps.length > 0, `Complete lesson ${lesson.id} is missing a next step`);
  });
});

assert(lessons.every((lesson) => lesson.contentStatus === "complete"), "All lessons must be complete before full lesson links are exposed");
assert(unique(lessons.map((lesson) => `${lesson.pathSlug}/${lesson.slug}`)), "Full lesson routes must be unique");
assert(LEARN_JOURNEY_DESTINATIONS.every((path) => journeyPaths.has(path)), "Learn contains an invalid Journey destination");
assert(unique(LEARN_DISCOVERY_TOPICS.map((topic) => topic.label)), "Discovery topic labels must be unique");
assert(LEARN_DISCOVERY_TOPICS.some((topic) => topic.id === "all"), "Discovery topics must include All");
LEARN_DISCOVERY_TOPICS.forEach((topic) => {
  assert((topic.pathSlugs ?? pathSlugs).every((pathSlug) => pathSlugs.includes(pathSlug)), `Discovery topic ${topic.id} has an invalid path`);
});
assert(unique(LEARN_START_OPTIONS.map((option) => option.label)), "Start-here labels must be unique");
assert(LEARN_START_OPTIONS.every((option) => pathSlugs.includes(option.pathSlug)), "Start-here options must reference valid paths");
assert(!/\bbest for you\b/iu.test(LEARN_START_OPTIONS.map((option) => option.label).join(" ")), "Start-here options must not imply personalized recommendations");
Object.entries(LEARN_SEARCH_SYNONYMS).forEach(([term, destinations]) => {
  assert(term && destinations.every((pathSlug) => pathSlugs.includes(pathSlug)), `Search synonym ${term} has an invalid path`);
});
Object.entries(LEARN_PATH_CONNECTIONS).forEach(([pathSlug, connection]) => {
  assert(pathSlugs.includes(pathSlug), `Connection references an invalid Learn path ${pathSlug}`);
  if (connection.journeyPath) assert(journeyPaths.has(connection.journeyPath), `Connection ${pathSlug} has an invalid Journey`);
  if (connection.healthPath) assert(connection.healthPath === healthPath, `Connection ${pathSlug} has an invalid Health Score route`);
});

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function readLearnSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const learnPage = readLearnSource("src/pages/LearnPage.jsx");
const pathPage = readLearnSource("src/pages/LearnPathPage.jsx");
const lessonPage = readLearnSource("src/pages/LearnLessonPage.jsx");
const timeline = readLearnSource("src/components/learn/LessonTimeline.jsx");
const pathCard = readLearnSource("src/components/learn/LearningPathCard.jsx");
const learnChrome = [learnPage, pathPage, lessonPage, timeline, pathCard].join("\n");
const learnPages = [
  ["LearnPage", learnPage],
  ["LearnPathPage", pathPage],
  ["LearnLessonPage", lessonPage],
];

const EXPECTED_LESSON_ROUTES = Object.freeze([
  "money-basics/what-is-money",
  "money-basics/inflation",
  "money-basics/compounding",
  "money-basics/time-value-of-money",
  "money-basics/financial-goals",
  "saving-budgeting/needs-vs-wants",
  "saving-budgeting/building-a-monthly-budget",
  "saving-budgeting/emergency-funds",
  "saving-budgeting/saving-strategies",
  "saving-budgeting/tracking-expenses",
  "investing-fundamentals/risk-and-return",
  "investing-fundamentals/asset-classes-in-india",
  "investing-fundamentals/power-of-compounding",
  "investing-fundamentals/inflation-and-real-returns",
  "investing-fundamentals/getting-started-with-investing",
  "mutual-funds-sip/what-are-mutual-funds",
  "mutual-funds-sip/how-sip-works",
  "mutual-funds-sip/lumpsum-vs-sip",
  "mutual-funds-sip/understanding-cagr",
  "mutual-funds-sip/reviewing-fund-performance",
  "loans-emi/how-loans-work",
  "loans-emi/understanding-emi",
  "loans-emi/fixed-vs-floating-rates",
  "loans-emi/prepayment-basics",
  "loans-emi/managing-debt-wisely",
  "income-tax-basics/income-tax-overview-in-india",
  "income-tax-basics/old-vs-new-tax-regime",
  "income-tax-basics/section-80c-deductions",
  "income-tax-basics/hra-exemption-basics",
  "income-tax-basics/gst-in-everyday-purchases",
  "insurance-planning/why-insurance-matters",
  "insurance-planning/term-life-insurance",
  "insurance-planning/health-insurance",
  "insurance-planning/evaluating-coverage-needs",
  "retirement-planning/retirement-corpus-basics",
  "retirement-planning/epf-and-employer-benefits",
  "retirement-planning/nps-overview",
  "retirement-planning/swp-for-retirement-income",
  "retirement-planning/planning-your-retirement-timeline",
]);

learnPages.forEach(([name, source]) => {
  assert(source.includes('className="shrix-skip-link"'), `A: ${name} must include the skip link`);
  assert(source.includes('href="#main-content"'), `A: ${name} skip link must target #main-content`);
  assert((source.match(/id="main-content"/g) || []).length === 1, `B: ${name} must have exactly one #main-content target`);
  assert((source.match(/<main\b/g) || []).length === 1, `B: ${name} must have exactly one main landmark`);
  assert(source.includes('<main id="main-content">'), `B: ${name} main landmark must use id=main-content`);
  assert(source.indexOf("<main") < source.indexOf("<h1"), `C: ${name} h1 must appear after main`);
  assert(!/<header\b[^>]*la-hero/u.test(source), `C: ${name} must not use a header landmark for the Learn hero`);
  assert(/<section className="la-hero/u.test(source), `C: ${name} hero must be a section inside main`);
});

assert(!/Recommended Next Path/u.test(learnPage), 'E: Landing must not use "Recommended Next Path"');
assert(!/Finished exploring/u.test(learnPage), 'F: Landing must not imply the visitor finished a path');
assert(!/\byour progress\b/iu.test(learnPage), "D: Landing must not claim saved user progress");
assert(!/\bpersonalized\b/iu.test(learnPage), "D: Landing must not claim personalized progress");
assert(!/\brecommended for you\b/iu.test(learnPage), "D: Landing must not claim a personalized recommendation");
assert(/Continue the learning sequence/u.test(learnPage), "D: Landing sequence must use static curriculum language");
assert(LEARNING_PATHS[1]?.slug === "saving-budgeting", "G: Curriculum sequence path must remain saving-budgeting");
assert(learnPage.includes("const continuePath = LEARNING_PATHS[1]"), "G: Landing sequence must use the second curriculum path");
assert(learnPage.includes("to={`/learn/${continuePath.slug}`}"), "G: Sequence CTA must use the continue-path route");

LEARNING_PATHS.forEach((item) => {
  const lessonMinutes = item.lessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
  assert(Number.isFinite(item.durationMinutes) && item.durationMinutes > 0, `I: Path ${item.slug} duration must be finite and positive`);
  assert(item.durationMinutes === lessonMinutes, `H: Path ${item.slug} durationMinutes must equal the sum of lesson estimatedMinutes`);
  assert(item.duration === `${lessonMinutes} min`, `H: Path ${item.slug} displayed duration must equal the summed lesson minutes`);
});

assert(!/Curriculum Preview/u.test(pathPage), 'J: Path pages must not use "Curriculum Preview"');
assert(/Lessons in this path/u.test(pathPage), "K: Path pages must use live curriculum heading");
assert(/preview-only/u.test(pathPage), "L: Completion indicators must remain preview-only");
assert(/no account or progress tracking required/u.test(pathPage), "L: Path pages must disclose that progress is not persisted");

assert(lessonPage.includes("const previousLesson = lessonIndex > 0 ? path.lessons[lessonIndex - 1] : null"), "M: Previous lesson must come from the prior index only");
assert(lessonPage.includes("{previousLesson ? ("), "M: Previous lesson navigation must render only when a previous lesson exists");
assert(lessonPage.includes("to={`/learn/${path.slug}/${previousLesson.slug}`}"), "M: Previous lesson must use the real prior lesson slug");
assert(lessonPage.includes("const nextLesson = path.lessons[lessonIndex + 1] ?? null"), "N: Next lesson must come from the following index");
assert(lessonPage.includes("to={nextLesson ? `/learn/${path.slug}/${nextLesson.slug}` : `/learn/${path.slug}`}"), "N: Next lesson navigation must remain valid");

assert(lessons.length === 39, "O: Learn must keep 39 lessons");
assert(EXPECTED_LESSON_ROUTES.length === 39, "O: Expected lesson route list must cover 39 lessons");
const actualLessonRoutes = new Set(lessons.map((lesson) => `${lesson.pathSlug}/${lesson.slug}`));
EXPECTED_LESSON_ROUTES.forEach((route) => {
  assert(actualLessonRoutes.has(route), `O: Lesson route ${route} must remain unchanged`);
});
assert(actualLessonRoutes.size === EXPECTED_LESSON_ROUTES.length, "O: Lesson route set must match the protected 39 routes");

assert(pathPage.includes("{relatedLessons.length > 0 ? ("), "P: Path related learning must be guarded against an empty list");
learnPages.forEach(([name, source]) => {
  assert(source.includes("LEARN_ACADEMY_NOTICE"), `Q: ${name} must reuse LEARN_ACADEMY_NOTICE`);
});

assert(!/\blocalStorage\b/u.test(learnChrome), "R: Learn chrome must not introduce localStorage progress");
assert(!/\bsessionStorage\b/u.test(learnChrome), "R: Learn chrome must not introduce sessionStorage progress");
assert(!/\bpersonalized\b/iu.test(learnChrome), "S: Learn chrome must not claim personalized advice");
assert(!/\bAI-generated\b/iu.test(learnChrome), "S: Learn chrome must not claim AI-generated content");
assert(!/\bAI assistant\b/iu.test(learnChrome), "S: Learn chrome must not claim an AI assistant");
assert(!/\binteractive guidance\b/iu.test(learnPage), "S: Landing must not overclaim interactive guidance");

if (failures.length) {
  console.error(`Learn validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Learn validation passed: ${checks} checks across ${LEARNING_PATHS.length} paths and ${lessons.length} lessons.`);
