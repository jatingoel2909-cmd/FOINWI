/* global process */
/**
 * Writes slashless route HTML files for public sitemap URLs.
 * /about becomes dist/about.html. The homepage stays dist/index.html.
 * Only existing head tags are replaced. JSON-LD, the empty React root, and
 * client bundle references stay as Vite emitted them.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listPublicSitemapPaths, resolvePublicSeo } from "../src/seo/publicSeoMap.js";

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const PUBLIC_PATH = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)$/u;

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function decodeHtml(value) {
  return String(value)
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function tags(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[0]);
}

function replaceOne(html, pattern, predicate, replacement, label) {
  let count = 0;
  const next = html.replace(pattern, (tag) => {
    if (!predicate(tag)) return tag;
    count += 1;
    return replacement;
  });
  if (count !== 1) {
    throw new Error(`${label} must match exactly one tag (found ${count})`);
  }
  return next;
}

function metaTag(attribute, key, content) {
  return `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
}

export function applySeoHead(templateHtml, seo) {
  const jsonLdBefore = tags(templateHtml, /<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
  let html = templateHtml;
  html = replaceOne(
    html,
    /<title\b[\s\S]*?<\/title>/gi,
    () => true,
    `<title>${escapeHtml(seo.title)}</title>`,
    "title",
  );
  html = replaceOne(
    html,
    /<meta\b[\s\S]*?>/gi,
    (tag) => /\bname\s*=\s*"description"/i.test(tag),
    metaTag("name", "description", seo.description),
    "description",
  );
  html = replaceOne(
    html,
    /<meta\b[\s\S]*?>/gi,
    (tag) => /\bname\s*=\s*"robots"/i.test(tag),
    metaTag("name", "robots", seo.robots),
    "robots",
  );
  html = replaceOne(
    html,
    /<link\b[\s\S]*?>/gi,
    (tag) => /\brel\s*=\s*"canonical"/i.test(tag),
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    "canonical",
  );
  html = replaceOne(
    html,
    /<meta\b[\s\S]*?>/gi,
    (tag) => /\bproperty\s*=\s*"og:title"/i.test(tag),
    metaTag("property", "og:title", seo.title),
    "og:title",
  );
  html = replaceOne(
    html,
    /<meta\b[\s\S]*?>/gi,
    (tag) => /\bproperty\s*=\s*"og:description"/i.test(tag),
    metaTag("property", "og:description", seo.description),
    "og:description",
  );
  html = replaceOne(
    html,
    /<meta\b[\s\S]*?>/gi,
    (tag) => /\bproperty\s*=\s*"og:url"/i.test(tag),
    metaTag("property", "og:url", seo.canonical),
    "og:url",
  );
  html = replaceOne(
    html,
    /<meta\b[\s\S]*?>/gi,
    (tag) => /\bname\s*=\s*"twitter:title"/i.test(tag),
    metaTag("name", "twitter:title", seo.title),
    "twitter:title",
  );
  html = replaceOne(
    html,
    /<meta\b[\s\S]*?>/gi,
    (tag) => /\bname\s*=\s*"twitter:description"/i.test(tag),
    metaTag("name", "twitter:description", seo.description),
    "twitter:description",
  );

  const jsonLdAfter = tags(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/g);
  if (jsonLdAfter.length !== jsonLdBefore.length || jsonLdAfter.some((body, index) => body !== jsonLdBefore[index])) {
    throw new Error("SEO head rewrite changed JSON-LD");
  }
  if (!html.includes('<div id="root"></div>')) {
    throw new Error("SEO head rewrite must keep the empty React root");
  }
  return html;
}

export function routeHtmlPath(distRoot, routePath) {
  if (!PUBLIC_PATH.test(routePath) || routePath === "/guide-trial" || routePath.startsWith("/api/") || routePath === "/api") {
    throw new Error(`Refusing non-sitemap route HTML for ${routePath}`);
  }
  return path.join(distRoot, `${routePath.slice(1)}.html`);
}

function staleDirectoryIndexPath(distRoot, routePath) {
  return path.join(distRoot, ...routePath.slice(1).split("/"), "index.html");
}

export async function writeRouteSeoHeads({ distRoot = distDir } = {}) {
  const templatePath = path.join(distRoot, "index.html");
  const templateHtml = await readFile(templatePath, "utf8");
  const routes = listPublicSitemapPaths().filter((routePath) => routePath !== "/");
  const written = [];

  for (const routePath of routes) {
    const seo = resolvePublicSeo(routePath);
    if (seo.path !== routePath) {
      throw new Error(`SEO map path mismatch for ${routePath}`);
    }
    const html = applySeoHead(templateHtml, seo);
    const target = routeHtmlPath(distRoot, routePath);
    if (path.relative(distRoot, target).startsWith("..") || path.basename(target) === "index.html") {
      throw new Error(`Route HTML escaped the slashless layout for ${routePath}`);
    }
    await rm(staleDirectoryIndexPath(distRoot, routePath), { force: true });
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
    written.push(routePath);
  }

  return written;
}

async function main() {
  const written = await writeRouteSeoHeads();
  console.log(`SEO route HTML written for ${written.length} public routes.`);
}

function isDirectRun() {
  if (!process.argv[1]) return false;
  const entry = path.resolve(process.argv[1]);
  const self = fileURLToPath(import.meta.url);
  return process.platform === "win32" ? entry.toLowerCase() === self.toLowerCase() : entry === self;
}

if (isDirectRun()) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
