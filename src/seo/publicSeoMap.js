import { ALL_CALCULATORS } from "../data/calculators.js";
import { FINANCIAL_JOURNEYS } from "../data/journeys.js";
import { LEARNING_PATHS } from "../data/learnAcademy.js";

export const SITE_ORIGIN = "https://foinwi.com";
export const INDEXABLE_ROBOTS = "index, follow";
export const NOINDEX_ROBOTS = "noindex, nofollow";

const PRIVATE_PATHS = new Set(["/guide-trial"]);

function clipDescription(text, max = 158) {
  const cleaned = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned.length <= max) return cleaned;
  const ellipsis = "...";
  const trimmed = cleaned
    .slice(0, max - ellipsis.length)
    .replace(/\s+\S*$/u, "")
    .trimEnd();
  return `${trimmed}${ellipsis}`;
}

function canonicalFor(pathname) {
  if (!pathname || pathname === "/") return `${SITE_ORIGIN}/`;
  const normalized = pathname.replace(/\/+$/u, "") || "/";
  return `${SITE_ORIGIN}${normalized}`;
}

function entry(title, description, { robots = INDEXABLE_ROBOTS } = {}) {
  return {
    title,
    description: clipDescription(description),
    robots,
  };
}

const STATIC_PAGES = {
  "/": entry(
    "FOINWI | Grow Beyond Numbers",
    "FOINWI offers educational financial calculators, learning content, and planned AI guidance tools for Indian users.",
  ),
  "/calculators": entry(
    "Financial Calculators | FOINWI",
    "Explore educational SIP, EMI, tax, retirement, and savings calculators for Indian users. Results are estimates only.",
  ),
  "/learn": entry(
    "Learn Finance | FOINWI",
    "Structured educational lessons on money, saving, investing, loans, tax, insurance, and retirement for Indian users.",
  ),
  "/ai-tools": entry(
    "FOINWI Intelligence | Educational Guidance",
    "Explore FOINWI Intelligence through educational calculators, learning, and journeys. Advanced AI assistance is in development.",
  ),
  "/exchange-rates": entry(
    "Exchange Rates | FOINWI",
    "Convert currencies with a published reference rate, source, and time. Educational FX tool for Indian users.",
  ),
  "/about": entry(
    "About FOINWI | Financial Clarity for Every Indian",
    "FOINWI is an educational finance platform with calculators and learning tools for Indian users. Not financial advice.",
  ),
  "/financial-health-score": entry(
    "Financial Health Score | FOINWI",
    "An educational snapshot of money habits across saving, borrowing, protection, and planning. Not a credit score.",
  ),
  "/privacy-policy": entry(
    "Privacy Policy | FOINWI",
    "How FOINWI handles information on its educational financial platform for users in India.",
  ),
  "/terms-and-conditions": entry(
    "Terms and Conditions | FOINWI",
    "Terms for using FOINWI educational calculators, learning content, and related tools.",
  ),
  "/disclaimer": entry(
    "Disclaimer | FOINWI",
    "FOINWI provides educational estimates only. It does not provide financial, tax, investment, or loan advice.",
  ),
  "/guide-trial": entry(
    "FOINWI Guide Trial",
    "An experimental local educational guide. This page is not part of the public FOINWI launch index.",
    { robots: NOINDEX_ROBOTS },
  ),
};

const CALCULATOR_PAGES = Object.fromEntries(
  ALL_CALCULATORS.map((calculator) => [
    calculator.path,
    entry(
      `${calculator.title} | FOINWI`,
      `${calculator.desc} Educational estimate for Indian users. Not financial advice.`,
    ),
  ]),
);

export function listPublicSitemapPaths() {
  const paths = new Set([
    ...Object.keys(STATIC_PAGES).filter((path) => !PRIVATE_PATHS.has(path)),
    ...ALL_CALCULATORS.map((calculator) => calculator.path),
    ...LEARNING_PATHS.map((path) => `/learn/${path.slug}`),
    ...LEARNING_PATHS.flatMap((path) =>
      path.lessons
        .filter((lesson) => lesson.contentStatus === "complete")
        .map((lesson) => `/learn/${path.slug}/${lesson.slug}`),
    ),
    ...FINANCIAL_JOURNEYS.map((journey) => `/journeys/${journey.slug}`),
  ]);

  return [...paths].sort((left, right) => {
    if (left === "/") return -1;
    if (right === "/") return 1;
    return left.localeCompare(right);
  });
}

export function resolvePublicSeo(pathname) {
  const normalized = !pathname || pathname === "/" ? "/" : pathname.replace(/\/+$/u, "") || "/";
  const canonical = canonicalFor(normalized);
  const staticPage = STATIC_PAGES[normalized] || CALCULATOR_PAGES[normalized];

  if (staticPage) {
    return { ...staticPage, canonical, path: normalized };
  }

  const learnLesson = normalized.match(/^\/learn\/([^/]+)\/([^/]+)$/u);
  if (learnLesson) {
    const path = LEARNING_PATHS.find((item) => item.slug === learnLesson[1]);
    const lesson = path?.lessons.find(
      (item) => item.slug === learnLesson[2] && item.contentStatus === "complete",
    );
    if (path && lesson) {
      return {
        ...entry(
          `${lesson.title} | ${path.title} | FOINWI`,
          `${lesson.summary} Educational lesson. Not financial advice.`,
        ),
        canonical,
        path: normalized,
      };
    }
  }

  const learnPath = normalized.match(/^\/learn\/([^/]+)$/u);
  if (learnPath) {
    const path = LEARNING_PATHS.find((item) => item.slug === learnPath[1]);
    if (path) {
      return {
        ...entry(`${path.title} | FOINWI Learn`, `${path.description} Educational content for Indian users.`),
        canonical,
        path: normalized,
      };
    }
  }

  const journeyMatch = normalized.match(/^\/journeys\/([^/]+)$/u);
  if (journeyMatch) {
    const journey = FINANCIAL_JOURNEYS.find((item) => item.slug === journeyMatch[1]);
    if (journey) {
      return {
        ...entry(
          `${journey.title} | FOINWI`,
          `${journey.description} Educational mission. Not financial advice.`,
        ),
        canonical,
        path: normalized,
      };
    }
  }

  return {
    title: "Page not found | FOINWI",
    description: "That FOINWI page is unavailable. Return to calculators, learning, or the homepage.",
    robots: NOINDEX_ROBOTS,
    canonical,
    path: normalized,
  };
}
