/* global process */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { ALL_CALCULATORS } from "../src/data/calculators.js";
import { FINANCIAL_JOURNEYS } from "../src/data/journeys.js";
import { LEARNING_PATHS } from "../src/data/learnAcademy.js";
import {
  HOME_DESCRIPTION,
  INDEXABLE_ROBOTS,
  NOINDEX_ROBOTS,
  SITE_ORIGIN,
  listPublicSitemapPaths,
  resolvePublicSeo,
} from "../src/seo/publicSeoMap.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

const files = {
  app: new URL("../src/App.jsx", import.meta.url),
  documentSeo: new URL("../src/components/DocumentSeo.jsx", import.meta.url),
  seoMap: new URL("../src/seo/publicSeoMap.js", import.meta.url),
  indexHtml: new URL("../index.html", import.meta.url),
  robots: new URL("../public/robots.txt", import.meta.url),
  sitemap: new URL("../public/sitemap.xml", import.meta.url),
  headers: new URL("../public/_headers", import.meta.url),
};
const source = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([name, file]) => [name, await readFile(file, "utf8")])),
);

assert(source.app.includes("<DocumentSeo />"), "App must apply DocumentSeo inside the router");
assert(source.documentSeo.includes("resolvePublicSeo"), "DocumentSeo must read the public SEO map");
assert(source.documentSeo.includes('"robots"'), "DocumentSeo must set robots");
assert(source.documentSeo.includes("canonical"), "DocumentSeo must set canonical URLs");
assert(!/gtag|googletagmanager|G-[A-Z0-9]{6,}/u.test(`${source.indexHtml}\n${source.app}\n${source.documentSeo}`), "SEO files must not add Google Analytics");

assert(source.indexHtml.includes('content="index, follow"'), "HTML shell must allow public indexing");
assert(!source.indexHtml.includes('name="keywords"'), "HTML shell must not include an obsolete meta keywords tag");
assert(source.indexHtml.includes('href="https://foinwi.com/"'), "HTML shell must keep the trailing-slash homepage canonical");
assert(source.indexHtml.includes('content="https://foinwi.com/"'), "HTML shell og:url must use the trailing-slash homepage canonical");
assert(source.indexHtml.includes(HOME_DESCRIPTION), "HTML shell must use the approved homepage description");
assert(
  source.indexHtml.includes('"legalName": "FOINWI INDIA DIGITAL TOOLS LLP"'),
  "Organization JSON-LD must include the legal name",
);
const jsonLdBodies = [...source.indexHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
  (match) => match[1],
);
assert(jsonLdBodies.length === 2, "Homepage must keep Organization and WebSite JSON-LD scripts");
jsonLdBodies.forEach((body) => {
  const crlfBody = body.replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
  const digest = createHash("sha256").update(crlfBody).digest("base64");
  assert(source.headers.includes(`'sha256-${digest}'`), `CSP must allow the JSON-LD script hash sha256-${digest}`);
});
assert(source.robots.includes("Sitemap: https://foinwi.com/sitemap.xml"), "robots.txt must list the sitemap");
assert(source.robots.includes("Disallow: /api/"), "robots.txt must block API paths");
assert(!/^Disallow: \/$/m.test(source.robots), "robots.txt must not disallow the whole site");
assert(source.headers.includes("Content-Security-Policy:"), "CSP header must remain");
assert(source.headers.includes("connect-src 'self'"), "CSP connect-src must keep 'self'");
assert(source.headers.includes("'sha256-LsgatpB5UHFzey3fy2nZHiZNkF9V7z1w7FJqzpyGASI='"), "CSP must keep the first JSON-LD hash");
assert(source.headers.includes("'sha256-ZePDULtHg/hFomBbJx+mSfoBtlJ0VgzZS83um42hbuQ='"), "CSP must keep the second JSON-LD hash");
assert(!/script-src[^;]*'unsafe-inline'/u.test(source.headers), "CSP script-src must not allow unsafe-inline");
assert(!/script-src[^;]*'unsafe-eval'/u.test(source.headers), "CSP script-src must not allow unsafe-eval");
assert(
  /^\/guide-trial\s*\n[ \t]+X-Robots-Tag: noindex, nofollow/m.test(source.headers),
  "public/_headers must send X-Robots-Tag: noindex, nofollow for /guide-trial",
);
assert(
  /^\/guide-trial\/\s*\n[ \t]+X-Robots-Tag: noindex, nofollow/m.test(source.headers),
  "public/_headers must send X-Robots-Tag: noindex, nofollow for /guide-trial/",
);
assert(!/api\.groq\.com/iu.test(source.headers), "CSP must not whitelist Groq");

const publicPaths = listPublicSitemapPaths();
assert(publicPaths.includes("/"), "Sitemap path list must include the homepage");
assert(publicPaths.includes("/calculators"), "Sitemap path list must include the calculator hub");
assert(publicPaths.includes("/learn"), "Sitemap path list must include Learn");
assert(publicPaths.includes("/financial-health-score"), "Sitemap path list must include Financial Health Score");
assert(publicPaths.includes("/exchange-rates"), "Sitemap path list must include Exchange Rates");
assert(!publicPaths.includes("/guide-trial"), "Sitemap must omit the Guide Trial");
assert(publicPaths.includes("/ai-tools"), "Sitemap must include the public Intelligence page");

ALL_CALCULATORS.forEach((calculator) => {
  assert(publicPaths.includes(calculator.path), `Sitemap must include ${calculator.path}`);
  const seo = resolvePublicSeo(calculator.path);
  assert(seo.robots === INDEXABLE_ROBOTS, `${calculator.path} must be indexable`);
  assert(seo.canonical === `${SITE_ORIGIN}${calculator.path}`, `${calculator.path} canonical must be absolute`);
});

LEARNING_PATHS.forEach((path) => {
  assert(publicPaths.includes(`/learn/${path.slug}`), `Sitemap must include /learn/${path.slug}`);
});

FINANCIAL_JOURNEYS.forEach((journey) => {
  assert(publicPaths.includes(`/journeys/${journey.slug}`), `Sitemap must include /journeys/${journey.slug}`);
});

const sitemapLocs = [...source.sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedLocs = publicPaths.map((path) => (path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`));
assert(sitemapLocs.length === expectedLocs.length, `Sitemap URL count must match the public path list (${expectedLocs.length})`);
expectedLocs.forEach((loc) => {
  assert(sitemapLocs.includes(loc), `Sitemap must include ${loc}`);
});
assert(!source.sitemap.includes("<lastmod>"), "Sitemap must omit lastmod dates that cannot be verified");
assert(!source.sitemap.includes("/guide-trial"), "Sitemap XML must omit the Guide Trial");

const guideSeo = resolvePublicSeo("/guide-trial");
assert(guideSeo.robots === NOINDEX_ROBOTS, "Guide Trial SEO must remain noindex");
assert(resolvePublicSeo("/missing-page").robots === NOINDEX_ROBOTS, "Unknown routes must remain noindex");
assert(resolvePublicSeo("/").canonical === `${SITE_ORIGIN}/`, "Homepage canonical must use the trailing slash origin");
assert(resolvePublicSeo("/calculators/").canonical === `${SITE_ORIGIN}/calculators`, "Canonical URLs must drop extra trailing slashes");

const forbidden = /\b(guaranteed|approved|best|lowest|certain)\b/iu;
publicPaths.forEach((path) => {
  const seo = resolvePublicSeo(path);
  assert(!forbidden.test(seo.title), `${path} title must follow FOINWI trust language`);
  assert(!forbidden.test(seo.description), `${path} description must follow FOINWI trust language`);
  if (path === "/") {
    assert(seo.description === HOME_DESCRIPTION, "Homepage description must use the approved brand description");
  } else {
    assert(seo.description.length <= 160, `${path} description must stay within 160 characters`);
  }
});

if (failures.length) {
  console.error(`SEO validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SEO validation passed: ${checks} checks across ${publicPaths.length} public URLs.`);
