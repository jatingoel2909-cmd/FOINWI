/**
 * Inserts build-time React markup into the approved route files
 * after the existing SEO head rewrite. Every other route stays an empty root.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  EXCLUDED_JOURNEY_ROUTES,
  JOURNEY_HTML_ROUTES,
  LEARN_LESSON_ROUTES,
  PILOT_ROUTES,
  RETAINED_PILOT_ROUTES,
  pilotBodyMarkers,
} from "../src/pilot/pilotRoutes.js";
import { routeHtmlPath } from "./prerenderSeoHeads.js";

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

function assertSafeBody(routePath, html) {
  const markers = pilotBodyMarkers(routePath);
  if (!markers) {
    throw new Error(`Pilot HTML for ${routePath} is not an approved initial-HTML route`);
  }
  if (
    (routePath.startsWith("/learn/") || routePath.startsWith("/journeys/"))
    && (html.match(/<h1\b/g) || []).length !== 1
  ) {
    throw new Error(`Pilot HTML for ${routePath} must contain one h1`);
  }
  if (routePath.startsWith("/journeys/") && (html.match(/<main\b/g) || []).length !== 1) {
    throw new Error(`Pilot HTML for ${routePath} must contain one main`);
  }
  if (!html.includes("<h1") && !html.includes("<h2")) {
    throw new Error(`Pilot HTML for ${routePath} has no heading`);
  }
  for (const marker of markers) {
    if (!html.includes(marker)) {
      throw new Error(`Pilot HTML for ${routePath} is missing “${marker}”`);
    }
  }
  if (/<script\b/i.test(html)) {
    throw new Error(`Pilot HTML for ${routePath} contains a script element`);
  }
  if (/display\s*:\s*none/i.test(html)) {
    throw new Error(`Pilot HTML for ${routePath} hides content with display:none`);
  }
}

export async function writePilotBodies({ distRoot = distDir } = {}) {
  if (LEARN_LESSON_ROUTES.length !== 39) {
    throw new Error(`Expected 39 completed Learn lessons, found ${LEARN_LESSON_ROUTES.length}`);
  }
  if (JOURNEY_HTML_ROUTES.length !== 7 || !JOURNEY_HTML_ROUTES.includes("/journeys/save-tax")) {
    throw new Error(`Expected 7 safe journey routes including Save Tax, found ${JOURNEY_HTML_ROUTES.length}`);
  }
  if (EXCLUDED_JOURNEY_ROUTES.length !== 1 || EXCLUDED_JOURNEY_ROUTES[0] !== "/journeys/build-wealth") {
    throw new Error("Build Wealth must stay excluded from initial HTML");
  }
  if (PILOT_ROUTES.includes("/journeys/build-wealth")) {
    throw new Error("Build Wealth must not receive initial HTML");
  }
  if (RETAINED_PILOT_ROUTES.length !== 1 || RETAINED_PILOT_ROUTES[0] !== "/gst-calculator") {
    throw new Error("The GST calculator must remain the retained calculator route");
  }
  const serverEntry = path.join(distRoot, "server", "entry-server.js");
  const serverModule = await import(pathToFileURL(serverEntry).href);
  const written = [];

  for (const routePath of PILOT_ROUTES) {
    const target = routeHtmlPath(distRoot, routePath);
    const template = await readFile(target, "utf8");
    if (!template.includes('<div id="root"></div>')) {
      throw new Error(`Pilot route ${routePath} must start from the empty SEO root`);
    }

    const first = serverModule.renderPilotRoute(routePath);
    const second = serverModule.renderPilotRoute(routePath);
    if (first.html !== second.html || first.insightDate !== second.insightDate) {
      throw new Error(`Pilot render for ${routePath} was not deterministic`);
    }
    assertSafeBody(routePath, first.html);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(first.insightDate)) {
      throw new Error(`Pilot insight date for ${routePath} is not a calendar date`);
    }

    const next = template.replace(
      '<div id="root"></div>',
      `<div id="root" data-foinwi-hydrate="1" data-foinwi-insight-date="${first.insightDate}">${first.html}</div>`,
    );
    if (next === template || next.includes('<div id="root"></div>')) {
      throw new Error(`Pilot root replacement failed for ${routePath}`);
    }
    await writeFile(target, next);
    written.push(routePath);
  }

  return written;
}
