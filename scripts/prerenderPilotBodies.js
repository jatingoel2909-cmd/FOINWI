/**
 * Inserts build-time React markup into the three approved route files
 * after the existing SEO head rewrite. Every other route stays an empty root.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PILOT_ROUTES } from "../src/pilot/pilotRoutes.js";
import { routeHtmlPath } from "./prerenderSeoHeads.js";

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");

function assertSafeBody(routePath, html) {
  if (!html.includes("<h1") && !html.includes("<h2")) {
    throw new Error(`Pilot HTML for ${routePath} has no heading`);
  }
  if (/<script\b/i.test(html)) {
    throw new Error(`Pilot HTML for ${routePath} contains a script element`);
  }
  if (/display\s*:\s*none/i.test(html)) {
    throw new Error(`Pilot HTML for ${routePath} hides content with display:none`);
  }
}

export async function writePilotBodies({ distRoot = distDir } = {}) {
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
