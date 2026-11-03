/* global process */
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodeHtml, routeHtmlPath } from "./prerenderSeoHeads.js";
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
assert(source.headers.includes("connect-src 'self'"), "CSP connect-src must stay same-origin");
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

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function collectTags(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[0]);
}

function oneTag(html, pattern, predicate, label) {
  const hits = collectTags(html, pattern).filter(predicate);
  assert(hits.length === 1, `${label} must appear exactly once`);
  return hits[0] ?? "";
}

function metaContent(html, attribute, key, label) {
  const tag = oneTag(
    html,
    /<meta\b[\s\S]*?>/gi,
    (item) => new RegExp(`\\b${attribute}\\s*=\\s*"${key}"`, "i").test(item),
    label,
  );
  const content = tag.match(/\bcontent\s*=\s*"([^"]*)"/i);
  assert(Boolean(content), `${label} must include a content attribute`);
  return content ? decodeHtml(content[1]) : "";
}

function canonicalHref(html, label) {
  const tag = oneTag(
    html,
    /<link\b[\s\S]*?>/gi,
    (item) => /\brel\s*=\s*"canonical"/i.test(item),
    label,
  );
  const href = tag.match(/\bhref\s*=\s*"([^"]*)"/i);
  assert(Boolean(href), `${label} must include an href`);
  return href ? decodeHtml(href[1]) : "";
}

function titleText(html, label) {
  const titles = collectTags(html, /<title\b[\s\S]*?<\/title>/gi);
  assert(titles.length === 1, `${label} must include exactly one title`);
  const text = titles[0]?.match(/<title>([\s\S]*?)<\/title>/i);
  return text ? decodeHtml(text[1]) : "";
}

async function listBuiltHtmlFiles(directory) {
  const found = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "assets") continue;
      found.push(...await listBuiltHtmlFiles(fullPath));
    } else if (entry.name.endsWith(".html")) {
      found.push(fullPath);
    }
  }
  return found;
}

const builtHomePath = path.join(distDir, "index.html");
assert(await exists(builtHomePath), "Built homepage HTML is missing. Run npm run build before validate:seo.");

if (await exists(builtHomePath)) {
  const builtHome = await readFile(builtHomePath, "utf8");
  const homeSeo = resolvePublicSeo("/");
  assert(titleText(builtHome, "Built homepage") === homeSeo.title, "Built homepage title must stay the approved homepage title");
  assert(metaContent(builtHome, "name", "description", "Built homepage description") === homeSeo.description, "Built homepage description must stay the approved homepage description");
  assert(canonicalHref(builtHome, "Built homepage canonical") === homeSeo.canonical, "Built homepage canonical must stay https://foinwi.com/");
  assert(metaContent(builtHome, "name", "robots", "Built homepage robots") === homeSeo.robots, "Built homepage robots must stay index, follow");
  assert(metaContent(builtHome, "property", "og:url", "Built homepage og:url") === homeSeo.canonical, "Built homepage og:url must stay the homepage canonical");
  assert(builtHome.includes('<div id="root"></div>'), "Built homepage must keep the empty React root");

  const sourceJsonLd = collectTags(source.indexHtml, /<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
  const builtJsonLd = collectTags(builtHome, /<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
  assert(builtJsonLd.length === sourceJsonLd.length, "Built homepage must keep both JSON-LD scripts");
  builtJsonLd.forEach((body, index) => {
    assert(body === sourceJsonLd[index], "Built homepage JSON-LD must match the source shell");
  });

  for (const routePath of publicPaths.filter((item) => item !== "/")) {
    const routeFile = routeHtmlPath(distDir, routePath);
    const staleDirectoryIndex = path.join(distDir, ...routePath.slice(1).split("/"), "index.html");
    assert(path.basename(routeFile) !== "index.html", `${routePath} must use a slashless HTML file`);
    assert(!(await exists(staleDirectoryIndex)), `${routePath} must not keep a directory index`);
    assert(await exists(routeFile), `Built route HTML is missing for ${routePath}`);
    if (!(await exists(routeFile))) continue;
    const html = await readFile(routeFile, "utf8");
    const seo = resolvePublicSeo(routePath);
    const label = `Built ${routePath}`;
    assert(titleText(html, label) === seo.title, `${label} title must match the SEO map`);
    assert(metaContent(html, "name", "description", `${label} description`) === seo.description, `${label} description must match the SEO map`);
    assert(metaContent(html, "name", "robots", `${label} robots`) === seo.robots, `${label} robots must match the SEO map`);
    assert(canonicalHref(html, `${label} canonical`) === seo.canonical, `${label} canonical must match the SEO map`);
    assert(metaContent(html, "property", "og:title", `${label} og:title`) === seo.title, `${label} og:title must match the SEO map`);
    assert(metaContent(html, "property", "og:description", `${label} og:description`) === seo.description, `${label} og:description must match the SEO map`);
    assert(metaContent(html, "property", "og:url", `${label} og:url`) === seo.canonical, `${label} og:url must match the canonical URL`);
    assert(metaContent(html, "name", "twitter:title", `${label} twitter:title`) === seo.title, `${label} twitter:title must match the SEO map`);
    assert(metaContent(html, "name", "twitter:description", `${label} twitter:description`) === seo.description, `${label} twitter:description must match the SEO map`);
    assert(metaContent(html, "name", "twitter:card", `${label} twitter:card`) === "summary_large_image", `${label} must keep the existing Twitter card`);
    assert(metaContent(html, "property", "og:type", `${label} og:type`) === "website", `${label} must keep og:type`);
    assert(html.includes('<div id="root"></div>'), `${label} must keep the empty React root`);
    const routeJsonLd = collectTags(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
    assert(routeJsonLd.length === builtJsonLd.length, `${label} must keep the homepage JSON-LD scripts`);
    routeJsonLd.forEach((body, index) => {
      assert(body === builtJsonLd[index], `${label} JSON-LD must match the homepage shell`);
    });
  }

  assert(!(await exists(path.join(distDir, "guide-trial.html"))), "Guide Trial must not receive route HTML");
  assert(!(await exists(path.join(distDir, "guide-trial", "index.html"))), "Guide Trial must not receive a directory index");
  assert(!(await exists(path.join(distDir, "api.html"))), "API paths must not receive route HTML");
  assert(!(await exists(path.join(distDir, "api", "index.html"))), "API paths must not receive a directory index");

  const expectedFiles = new Set([
    path.resolve(builtHomePath),
    ...publicPaths
      .filter((item) => item !== "/")
      .map((item) => path.resolve(routeHtmlPath(distDir, item))),
  ]);
  const builtFiles = await listBuiltHtmlFiles(distDir);
  assert(builtFiles.length === expectedFiles.size, `Built HTML count must stay ${expectedFiles.size}`);
  builtFiles.forEach((filePath) => {
    assert(expectedFiles.has(path.resolve(filePath)), `Unexpected built HTML: ${path.relative(distDir, filePath)}`);
  });

  const publicDir = path.resolve(distDir, "../public");
  for (const fileName of ["robots.txt", "sitemap.xml", "ads.txt", "_headers"]) {
    const published = await readFile(path.join(publicDir, fileName));
    const built = await readFile(path.join(distDir, fileName));
    assert(published.equals(built), `Built ${fileName} must match public/${fileName}`);
  }
}

if (failures.length) {
  console.error(`SEO validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SEO validation passed: ${checks} checks across ${publicPaths.length} public URLs.`);
