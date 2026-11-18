/** Build-time initial HTML is limited to these three public routes. */
export const PILOT_ROUTES = [
  "/learn/income-tax-basics/income-tax-overview-in-india",
  "/journeys/save-tax",
  "/gst-calculator",
];

export function isPilotRoute(pathname) {
  return PILOT_ROUTES.includes(pathname);
}

/**
 * Cloudflare and local preview may request the slashless file directly.
 * Only the approved pilot routes are rewritten, so other .html URLs stay unchanged.
 */
export function stripPilotHtmlSuffix(pathname) {
  if (typeof pathname !== "string" || !pathname.endsWith(".html")) return pathname;
  const stripped = pathname.slice(0, -".html".length) || "/";
  return isPilotRoute(stripped) ? stripped : pathname;
}
