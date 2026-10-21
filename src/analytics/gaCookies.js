import { isValidMeasurementId } from "./productionGate.js";

export function isAnalyticsCookieName(name) {
  return name === "_ga"
    || name === "_gid"
    || name === "_gat"
    || name.startsWith("_ga_")
    || name.startsWith("_gat_");
}

export function analyticsCookieNames(measurementId) {
  const names = ["_ga", "_gid", "_gat"];
  if (isValidMeasurementId(measurementId)) {
    names.push(`_ga_${measurementId.slice(2)}`);
  }
  return names;
}

export function visibleAnalyticsCookieNames(cookieString) {
  return String(cookieString || "")
    .split(";")
    .map((part) => part.trim().split("=")[0])
    .filter((name) => name && isAnalyticsCookieName(name));
}

export function cookieDomains(hostname) {
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost")) return [];
  const domains = new Set([hostname]);
  if (hostname.startsWith("www.")) domains.add(hostname.slice(4));
  const labels = hostname.split(".").filter(Boolean);
  if (labels.length >= 2) {
    const parent = labels.slice(-2).join(".");
    domains.add(parent);
    domains.add(`.${parent}`);
  }
  return [...domains];
}

export function expiredCookieDirectives(name, { hostname = "", secure = false } = {}) {
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";
  const secureFlag = secure ? "; Secure" : "";
  const base = `${name}=; Max-Age=0; expires=${expires}; path=/; SameSite=Lax${secureFlag}`;
  return [
    base,
    ...cookieDomains(hostname).map((domain) => `${base}; domain=${domain}`),
  ];
}
