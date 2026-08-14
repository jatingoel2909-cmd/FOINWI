/* global process */
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

if (failures.length) {
  console.error(`Learn validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Learn validation passed: ${checks} checks across ${LEARNING_PATHS.length} paths and ${lessons.length} lessons.`);
