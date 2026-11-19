import { FINANCIAL_JOURNEYS } from "../data/journeys.js";
import { LEARNING_PATHS } from "../data/learnAcademy.js";

/**
 * Completed Learn lessons from the academy registry.
 * Preview lessons are excluded because they have no full content.
 */
export const LEARN_LESSON_ROUTES = LEARNING_PATHS.flatMap((path) =>
  path.lessons
    .filter((lesson) => lesson.contentStatus === "complete")
    .map((lesson) => `/learn/${path.slug}/${lesson.slug}`),
);

/**
 * Build Wealth reads localStorage while computing its first render.
 * A saved checklist would then differ from the server HTML.
 * The other public journeys share MissionJourneyPage, which paints an
 * empty checklist and restores storage after that first render.
 */
export const EXCLUDED_JOURNEY_ROUTES = ["/journeys/build-wealth"];

export const JOURNEY_HTML_ROUTES = FINANCIAL_JOURNEYS
  .map((journey) => `/journeys/${journey.slug}`)
  .filter((routePath) => !EXCLUDED_JOURNEY_ROUTES.includes(routePath));

/** Routes already accepted in the three-route pilot and retained here. */
export const RETAINED_PILOT_ROUTES = [
  "/gst-calculator",
];

export const PILOT_ROUTES = [
  ...LEARN_LESSON_ROUTES,
  ...JOURNEY_HTML_ROUTES,
  ...RETAINED_PILOT_ROUTES,
];

export function isPilotRoute(pathname) {
  return PILOT_ROUTES.includes(pathname);
}

/**
 * Phrases that must appear in the prerendered article.
 * Lesson phrases come from the registry title plus the shared lesson headings.
 */
export function pilotBodyMarkers(routePath) {
  if (routePath === "/gst-calculator") {
    return ["GST arithmetic calculator", "How to read this estimate", "Worked example"];
  }
  if (routePath.startsWith("/journeys/")) {
    if (EXCLUDED_JOURNEY_ROUTES.includes(routePath)) return null;
    const slug = routePath.slice("/journeys/".length);
    const journey = FINANCIAL_JOURNEYS.find((item) => item.slug === slug);
    if (!journey || !JOURNEY_HTML_ROUTES.includes(routePath)) return null;
    return [journey.title, "How to read this mission", "Mission Checklist"];
  }

  const match = /^\/learn\/([^/]+)\/([^/]+)$/u.exec(routePath);
  if (!match) return null;
  const path = LEARNING_PATHS.find((item) => item.slug === match[1]);
  const lesson = path?.lessons.find(
    (item) => item.slug === match[2] && item.contentStatus === "complete",
  );
  if (!lesson) return null;
  return [lesson.title, "What this means", "Why it matters"];
}

/**
 * Cloudflare and local preview may request the slashless file directly.
 * Only the approved initial-HTML routes are rewritten, so other .html URLs stay unchanged.
 */
export function stripPilotHtmlSuffix(pathname) {
  if (typeof pathname !== "string" || !pathname.endsWith(".html")) return pathname;
  const stripped = pathname.slice(0, -".html".length) || "/";
  return isPilotRoute(stripped) ? stripped : pathname;
}
