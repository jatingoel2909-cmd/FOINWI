import { ALL_CALCULATORS } from "../data/calculators.js";
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
 * Build Wealth now paints an empty checklist first, then restores
 * localStorage after that render. No public journey stays excluded.
 */
export const EXCLUDED_JOURNEY_ROUTES = [];

export const JOURNEY_HTML_ROUTES = FINANCIAL_JOURNEYS
  .map((journey) => `/journeys/${journey.slug}`)
  .filter((routePath) => !EXCLUDED_JOURNEY_ROUTES.includes(routePath));

/** No public calculator is excluded. EMI opens its desktop section after the first render. */
export const EXCLUDED_CALCULATOR_ROUTES = [];

const CALCULATOR_HEADINGS = {
  "/sip-calculator": "Plan your wealth with clarity",
  "/emi-calculator": "Plan your loan with clarity",
  "/fd-calculator": "Estimate your fixed deposit maturity",
  "/ppf-calculator": "Explore how PPF contributions may accumulate",
  "/retirement-calculator": "Illustrative retirement corpus estimate",
  "/goal-planner": "Plan your financial goals with clarity",
  "/cagr-calculator": "Measure your annualized return",
  "/lumpsum-calculator": "Project one-time investment growth",
  "/rd-calculator": "Plan your recurring deposit growth",
  "/swp-calculator": "Plan systematic withdrawals wisely",
  "/inflation-calculator": "Understand the rising cost of living",
  "/gratuity-calculator": "Code on Social Security, 2020 — simplified gratuity estimate",
  "/epf-calculator": "Explore an illustrative EPF accumulation estimate",
  "/nps-calculator": "NPS accumulation and normal-exit illustration",
  "/home-loan-eligibility-calculator": "Explore an illustrative home-loan affordability estimate",
  "/loan-prepayment-calculator": "See how prepayment reduces interest",
  "/gst-calculator": "GST arithmetic calculator",
  "/income-tax-calculator": "Educational tax estimate",
  "/hra-calculator": "HRA exemption — opt-out regime estimate",
  "/compound-interest-calculator": "Watch your money grow with compounding",
};

export const CALCULATOR_HTML_ROUTES = ALL_CALCULATORS
  .map((calculator) => calculator.path)
  .filter((routePath) => !EXCLUDED_CALCULATOR_ROUTES.includes(routePath));

/** GST remains inside the calculator allowlist. */
export const RETAINED_PILOT_ROUTES = [
  "/gst-calculator",
];

export const LEARN_PATH_ROUTES = LEARNING_PATHS.map((path) => `/learn/${path.slug}`);

/**
 * Indexable public pages whose first render does not read browser storage,
 * the clock, or a network response. Guide Trial stays out: it is noindex
 * and is not on the public sitemap.
 */
export const STATIC_HTML_ROUTES = [
  "/",
  "/about",
  "/ai-tools",
  "/calculators",
  "/disclaimer",
  "/exchange-rates",
  "/financial-health-score",
  "/learn",
  "/privacy-policy",
  "/terms-and-conditions",
];

const STATIC_HTML_MARKERS = {
  "/": ["Grow Beyond", "Welcome to FOINWI", "Start with Useful Calculators", "Study a money question with live tools"],
  "/about": ["Financial Clarity for Every Indian", "Who We Are"],
  "/ai-tools": ["FOINWI Intelligence", "FOINWI does not provide a live AI assistant"],
  "/calculators": ["All Financial Calculators", "Exchange Rates"],
  "/disclaimer": ["Disclaimer", "Important information about how to use FOINWI responsibly."],
  "/exchange-rates": ["FOINWI Exchange Rates", "Loading the latest available reference rate", "How to read a reference rate"],
  "/financial-health-score": ["Understand Your Financial Wellness", "Start Assessment"],
  "/learn": ["Learn Finance Step by Step", "FOINWI Learn Academy"],
  "/privacy-policy": ["Privacy Policy", "Information We Collect"],
  "/terms-and-conditions": ["Please read these terms before using FOINWI calculators and educational content."],
};

export const PILOT_ROUTES = [
  ...STATIC_HTML_ROUTES,
  ...LEARN_PATH_ROUTES,
  ...LEARN_LESSON_ROUTES,
  ...JOURNEY_HTML_ROUTES,
  ...CALCULATOR_HTML_ROUTES,
];

export function isPilotRoute(pathname) {
  return PILOT_ROUTES.includes(pathname);
}

/**
 * Phrases that must appear in the prerendered article.
 * Lesson phrases come from the registry title plus the shared lesson headings.
 */
export function pilotBodyMarkers(routePath) {
  if (CALCULATOR_HTML_ROUTES.includes(routePath)) {
    const heading = CALCULATOR_HEADINGS[routePath];
    if (!heading) return null;
    return [heading, "How to read this estimate", "Worked example"];
  }
  if (routePath.startsWith("/journeys/")) {
    if (EXCLUDED_JOURNEY_ROUTES.includes(routePath)) return null;
    const slug = routePath.slice("/journeys/".length);
    const journey = FINANCIAL_JOURNEYS.find((item) => item.slug === slug);
    if (!journey || !JOURNEY_HTML_ROUTES.includes(routePath)) return null;
    if (routePath === "/journeys/build-wealth") {
      return [journey.title, "Journey Progress", "Mark a milestone when you have completed it."];
    }
    return [journey.title, "How to read this mission", "Mission Checklist"];
  }

  if (LEARN_PATH_ROUTES.includes(routePath)) {
    const slug = routePath.slice("/learn/".length);
    const path = LEARNING_PATHS.find((item) => item.slug === slug);
    if (!path) return null;
    return [path.title.replaceAll("&", "&amp;"), "Learning Path", "Estimated time"];
  }

  if (Object.prototype.hasOwnProperty.call(STATIC_HTML_MARKERS, routePath)) {
    return STATIC_HTML_MARKERS[routePath];
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
