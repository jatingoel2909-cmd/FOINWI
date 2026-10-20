import { cleanPageView, toAnalyticsPageView } from "./pageView.js";
import {
  analyticsCookieNames,
  expiredCookieDirectives,
  visibleAnalyticsCookieNames,
} from "./gaCookies.js";
import { isValidMeasurementId } from "./productionGate.js";

export const GA4_SCRIPT_ID = "foinwi-ga4";
export const GA4_SCRIPT_ORIGIN = "https://www.googletagmanager.com";

const BLOCKED_EVENTS = new Set([
  "scroll",
  "click",
  "file_download",
  "view_search_results",
  "video_start",
  "video_progress",
  "video_complete",
  "form_start",
  "form_submit",
  "user_engagement",
]);

export function gtagScriptUrl(measurementId) {
  if (!isValidMeasurementId(measurementId)) return "";
  return `${GA4_SCRIPT_ORIGIN}/gtag/js?id=${encodeURIComponent(measurementId)}`;
}

export function gaDisableKey(measurementId) {
  return `ga-disable-${measurementId}`;
}

export function configParameters({ hostname = "" } = {}) {
  const parameters = {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true,
  };
  if (hostname === "foinwi.com" || hostname === "www.foinwi.com") {
    parameters.cookie_domain = hostname;
    parameters.cookie_flags = "SameSite=Lax;Secure";
  }
  return parameters;
}

function pageViewParams(page) {
  return {
    page_path: page.page_path,
    page_location: page.page_location,
  };
}

function pageConfig(page, hostname) {
  return {
    ...configParameters({ hostname }),
    page_path: page.page_path,
    page_location: page.page_location,
  };
}

function hasRawPageDecoration(value) {
  return typeof value === "string" && (value.includes("?") || value.includes("#"));
}

function hasRawPageFields(params) {
  if (!params || typeof params !== "object") return false;
  return hasRawPageDecoration(params.page_location) || hasRawPageDecoration(params.page_path);
}

const PATH_MEMORY = "__foinwiLastAnalyticsPath";
const AUTHORING = "__foinwiAnalyticsAuthoring";

function pageForNavigation(value, origin) {
  if (value == null || !origin) return null;
  try {
    const url = new URL(String(value), origin);
    return toAnalyticsPageView(`${url.pathname}${url.search}${url.hash}`, url.origin);
  } catch {
    return null;
  }
}

export function createAnalyticsController({
  window: win,
  document: doc,
  measurementId = "",
  writeCookie,
} = {}) {
  let configured = false;
  let scriptNode = null;

  function rememberedPath() {
    return win?.[PATH_MEMORY] ?? "";
  }

  function rememberPath(path) {
    if (win) win[PATH_MEMORY] = path;
  }

  function setAuthoring(enabled) {
    if (win) win[AUTHORING] = enabled === true;
  }

  function stopAuthoring() {
    setAuthoring(false);
    setCollectionEnabled(false);
    rememberPath("");
  }

  function installNavigationClose() {
    try {
      const history = win?.history;
      if (!history || history.__foinwiNavClose || typeof history.pushState !== "function") return;
      history.__foinwiNavClose = true;
      const wrap = (original) => function wrappedNavigation(...args) {
        const url = args[2];
        if (url != null && !pageForNavigation(url, win.location?.origin)) stopAuthoring();
        return original.apply(this, args);
      };
      history.pushState = wrap(history.pushState);
      if (typeof history.replaceState === "function") history.replaceState = wrap(history.replaceState);
      win.addEventListener?.("popstate", () => {
        if (!pageForNavigation(win.location?.pathname, win.location?.origin)) stopAuthoring();
      }, true);
    } catch {
      // A sealed history object cannot be wrapped. The route effect still stops authoring.
    }
  }

  function setCollectionEnabled(enabled) {
    if (!win || !isValidMeasurementId(measurementId)) return;
    win[gaDisableKey(measurementId)] = !enabled;
  }

  function expireCookies() {
    const existing = visibleAnalyticsCookieNames(typeof doc?.cookie === "string" ? doc.cookie : "");
    const names = [...new Set([...analyticsCookieNames(measurementId), ...existing])];
    const hostname = win?.location?.hostname ?? "";
    const secure = win?.location?.protocol === "https:";
    names.forEach((name) => {
      expiredCookieDirectives(name, { hostname, secure }).forEach((line) => {
        if (typeof writeCookie === "function") writeCookie(line);
        else if (doc) doc.cookie = line;
      });
    });
  }

  function removeScript() {
    scriptNode?.remove?.();
    scriptNode = null;
    doc?.getElementById?.(GA4_SCRIPT_ID)?.remove?.();
    configured = false;
    if (win) {
      win.dataLayer = [];
      win.gtag = undefined;
    }
  }

  function installGtag() {
    if (!win) return;
    if (!Array.isArray(win.dataLayer)) win.dataLayer = [];
    if (typeof win.gtag === "function") return;
    win.gtag = function gtag() {
      if (win[AUTHORING] !== true) return;
      const command = arguments[0];
      const name = arguments[1];
      const params = arguments[2];
      if (command === "consent") return;
      if (command === "event" && BLOCKED_EVENTS.has(name)) return;
      if (command === "set" && (name === "page_location" || name === "page_path") && hasRawPageDecoration(params)) return;
      if (command === "set" && hasRawPageFields(name)) return;
      if ((command === "config" || command === "event") && hasRawPageFields(params)) return;
      if (command === "event" && name === "page_view") {
        const location = params?.page_location;
        const path = params?.page_path;
        if (typeof location !== "string" || typeof path !== "string") return;
      }
      win.dataLayer.push(arguments);
    };
  }

  function ensureScript() {
    if (!doc || !isValidMeasurementId(measurementId)) return;
    if (scriptNode || doc.getElementById?.(GA4_SCRIPT_ID)) return;
    const script = doc.createElement("script");
    script.id = GA4_SCRIPT_ID;
    script.async = true;
    script.src = gtagScriptUrl(measurementId);
    doc.head.appendChild(script);
    scriptNode = script;
  }

  installNavigationClose();
  setAuthoring(false);
  setCollectionEnabled(false);

  return {
    sync({ collect = false, clearCookies = false, page = null } = {}) {
      if (!collect) {
        stopAuthoring();
        if (clearCookies) {
          removeScript();
          expireCookies();
        }
        return;
      }

      const clean = cleanPageView(page);
      if (!clean || !isValidMeasurementId(measurementId) || !win || !doc) {
        stopAuthoring();
        return;
      }

      const fields = pageConfig(clean, win.location?.hostname ?? "");
      setAuthoring(true);
      setCollectionEnabled(true);
      installGtag();
      if (!configured) {
        win.gtag("js", new Date());
        win.gtag("config", measurementId, fields);
        configured = true;
      } else if (clean.page_path !== rememberedPath()) {
        win.gtag("set", pageViewParams(clean));
      }
      if (clean.page_path !== rememberedPath()) {
        rememberPath(clean.page_path);
        win.gtag("event", "page_view", pageViewParams(clean));
      }
      ensureScript();
    },
  };
}
