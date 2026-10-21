import { listPublicSitemapPaths } from "../seo/publicSeoMap.js";

const APPROVED_ORIGINS = new Set(["https://foinwi.com", "https://www.foinwi.com"]);
const PUBLIC_PATH_PATTERN = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/u;

let allowlistCache = null;

export function publicAnalyticsAllowlist() {
  if (!allowlistCache) allowlistCache = new Set(listPublicSitemapPaths());
  return allowlistCache;
}

export function normalizeAnalyticsPath(value) {
  if (typeof value !== "string") return null;
  const raw = value.trim();
  const decoration = raw.search(/[?#]/u);
  const withoutDecoration = decoration === -1 ? raw : raw.slice(0, decoration);
  if (!withoutDecoration.startsWith("/")) return null;
  if (/[\\%\s]|\.\./u.test(withoutDecoration)) return null;
  const normalized = withoutDecoration.length > 1
    ? withoutDecoration.replace(/\/+$/u, "")
    : withoutDecoration;
  if (normalized !== "/" && !PUBLIC_PATH_PATTERN.test(normalized)) return null;
  if (normalized === "/guide-trial" || normalized.startsWith("/guide-trial/")) return null;
  return normalized;
}

export function sanitizeAnalyticsPath(value, allowlist = publicAnalyticsAllowlist()) {
  const normalized = normalizeAnalyticsPath(value);
  if (!normalized || !allowlist.has(normalized)) return null;
  return normalized;
}

export function toAnalyticsPageView(pathname, origin, allowlist = publicAnalyticsAllowlist()) {
  if (!APPROVED_ORIGINS.has(origin)) return null;
  const pagePath = sanitizeAnalyticsPath(pathname, allowlist);
  if (!pagePath) return null;
  const pageLocation = `${origin}${pagePath}`;
  if (pageLocation.includes("?") || pageLocation.includes("#")) return null;
  return {
    page_path: pagePath,
    page_location: pageLocation,
  };
}

export function cleanPageView(page, allowlist = publicAnalyticsAllowlist()) {
  if (!page || typeof page !== "object") return null;
  const keys = Object.keys(page);
  if (keys.some((key) => key !== "page_path" && key !== "page_location")) return null;
  if (typeof page.page_location !== "string" || typeof page.page_path !== "string") return null;

  let origin;
  try {
    const url = new URL(page.page_location);
    if (url.username || url.password || url.search || url.hash) return null;
    if (`${url.origin}${url.pathname}` !== page.page_location) return null;
    origin = url.origin;
  } catch {
    return null;
  }

  const rebuilt = toAnalyticsPageView(page.page_path, origin, allowlist);
  if (!rebuilt) return null;
  if (rebuilt.page_path !== page.page_path || rebuilt.page_location !== page.page_location) return null;
  return rebuilt;
}
