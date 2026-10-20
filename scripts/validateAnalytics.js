/* global process */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LEARNING_PATHS } from "../src/data/learnAcademy.js";
import { listPublicSitemapPaths } from "../src/seo/publicSeoMap.js";
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  CONSENT_STORAGE_KEY,
  CONSENT_UNKNOWN,
  readStoredConsent,
  writeStoredConsent,
} from "../src/analytics/consentStore.js";
import { shouldLoadGa4, shouldSendPageView } from "../src/analytics/collectionPolicy.js";
import {
  analyticsCookieNames,
  expiredCookieDirectives,
  isAnalyticsCookieName,
} from "../src/analytics/gaCookies.js";
import {
  GA4_SCRIPT_ID,
  configParameters,
  createAnalyticsController,
  gtagScriptUrl,
} from "../src/analytics/ga4Loader.js";
import { toAnalyticsPageView } from "../src/analytics/pageView.js";
import {
  isApprovedProductionEnvironment,
  isValidMeasurementId,
  readMeasurementId,
} from "../src/analytics/productionGate.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function queuedCommands(win) {
  return (win.dataLayer || []).map((entry) => Array.from(entry));
}

function pageViews(win) {
  return queuedCommands(win).filter((command) => command[0] === "event" && command[1] === "page_view");
}

function createHarness(measurementId = "G-TEST1234") {
  const elements = [];
  const cookies = [];
  const win = {
    location: {
      hostname: "foinwi.com",
      protocol: "https:",
      origin: "https://foinwi.com",
    },
  };
  const doc = {
    cookie: "_ga=1; theme=light; _ga_LEFTOVER=1",
    head: {
      appendChild(node) {
        elements.push(node);
      },
    },
    getElementById(id) {
      return elements.find((node) => node.id === id && !node.removed) ?? null;
    },
    createElement() {
      return {
        id: "",
        async: false,
        src: "",
        removed: false,
        remove() {
          this.removed = true;
        },
      };
    },
  };
  const controller = createAnalyticsController({
    window: win,
    document: doc,
    measurementId,
    writeCookie: (line) => cookies.push(line),
  });
  return { win, doc, elements, cookies, controller };
}

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null;
    },
    setItem(key, value) {
      data[key] = String(value);
    },
  };
}

function walk(directory, files = []) {
  for (const entry of readdirSync(directory)) {
    if (entry === "node_modules" || entry === "dist" || entry === ".git") continue;
    const fullPath = path.join(directory, entry);
    if (statSync(fullPath).isDirectory()) walk(fullPath, files);
    else files.push(fullPath);
  }
  return files;
}

const measurementId = "G-TEST1234";
const production = {
  prod: true,
  mode: "production",
  protocol: "https:",
  hostname: "foinwi.com",
  measurementId,
};
const calculators = toAnalyticsPageView("/calculators", "https://foinwi.com");
const home = toAnalyticsPageView("/", "https://foinwi.com");

assert(readStoredConsent(memoryStorage()) === CONSENT_UNKNOWN, "Missing consent stays unknown");
assert(readStoredConsent(memoryStorage({ [CONSENT_STORAGE_KEY]: "granted" })) === CONSENT_GRANTED, "Stored acceptance is read");
assert(readStoredConsent(memoryStorage({ [CONSENT_STORAGE_KEY]: "maybe" })) === CONSENT_UNKNOWN, "Invalid consent stays unknown");
assert(readStoredConsent({ getItem() { throw new Error("blocked"); } }) === CONSENT_UNKNOWN, "Storage read failures stay unknown");
const stored = memoryStorage();
assert(writeStoredConsent(stored, CONSENT_GRANTED) === CONSENT_GRANTED, "Acceptance can be stored");
assert(readStoredConsent(stored) === CONSENT_GRANTED, "Stored acceptance round-trips");
assert(writeStoredConsent(stored, CONSENT_DENIED) === CONSENT_DENIED, "Rejection can be stored");
assert(writeStoredConsent(stored, "yes") === CONSENT_UNKNOWN, "Invalid writes are ignored");
assert(readStoredConsent(stored) === CONSENT_DENIED, "Invalid writes do not replace a rejection");

assert(isApprovedProductionEnvironment(production), "Production https foinwi.com with a measurement ID can collect");
assert(isApprovedProductionEnvironment({ ...production, hostname: "www.foinwi.com" }), "www.foinwi.com can collect");
[
  { prod: false, mode: "development" },
  { hostname: "localhost" },
  { hostname: "preview.foinwi.pages.dev" },
  { protocol: "http:" },
  { measurementId: "" },
  { measurementId: "UA-123456" },
  { mode: "preview" },
].forEach((patch) => {
  assert(!isApprovedProductionEnvironment({ ...production, ...patch }), `Collection stays off for ${JSON.stringify(patch)}`);
});
assert(readMeasurementId({ VITE_GA_MEASUREMENT_ID: " G-TEST1234 " }) === measurementId, "Measurement ID is trimmed from the env value");
assert(readMeasurementId({ VITE_GA_MEASUREMENT_ID: "g-test1234" }) === "", "Lowercase measurement IDs are rejected");
assert(readMeasurementId({}) === "", "Missing measurement ID stays empty");
assert(!isValidMeasurementId("G-TEST1234?x=1"), "Measurement IDs cannot carry query strings");

assert(shouldLoadGa4({ consent: CONSENT_GRANTED, production: true }), "Granted production consent can load GA4");
assert(!shouldLoadGa4({ consent: CONSENT_UNKNOWN, production: true }), "Unknown consent cannot load GA4");
assert(!shouldLoadGa4({ consent: CONSENT_DENIED, production: true }), "Rejected consent cannot load GA4");
assert(!shouldLoadGa4({ consent: CONSENT_GRANTED, production: false }), "Non-production cannot load GA4");
assert(shouldSendPageView({ consent: CONSENT_GRANTED, production: true, page: calculators }), "Eligible pages can send one page view");
assert(!shouldSendPageView({ consent: CONSENT_GRANTED, production: true, page: null }), "Ineligible paths do not send a page view");

assert(calculators.page_path === "/calculators", "Calculator route keeps its public path");
assert(calculators.page_location === "https://foinwi.com/calculators", "Page location is the public path only");
assert(home.page_location === "https://foinwi.com/", "Homepage location keeps the trailing slash");
assert(JSON.stringify(Object.keys(calculators)) === JSON.stringify(["page_path", "page_location"]), "Page view payload has only path fields");

const dirty = toAnalyticsPageView("/income-tax-calculator?income=2500000&search=aadhaar#answers", "https://foinwi.com");
const dirtyJson = JSON.stringify(dirty);
assert(dirty.page_path === "/income-tax-calculator", "Query and hash are removed before an allowlisted path is kept");
["2500000", "aadhaar", "answers", "?", "#", "income=", "search="].forEach((secret) => {
  assert(!dirtyJson.includes(secret), `Sanitized page view must not contain ${secret}`);
});
assert(toAnalyticsPageView("/calculators/", "https://foinwi.com").page_path === "/calculators", "Trailing slashes collapse to the public path");
assert(toAnalyticsPageView("/guide-trial", "https://foinwi.com") === null, "Guide Trial is not tracked");
assert(toAnalyticsPageView("/guide-trial?message=salary", "https://foinwi.com") === null, "Guide Trial content is not tracked");
assert(toAnalyticsPageView("/guide-trial/notes", "https://foinwi.com") === null, "Guide Trial subpaths are not tracked");
assert(toAnalyticsPageView("/not-a-real-page", "https://foinwi.com") === null, "Unknown paths are not tracked");
assert(toAnalyticsPageView("/calculators/../privacy-policy", "https://foinwi.com") === null, "Path traversal is not tracked");
assert(toAnalyticsPageView("/Calculators", "https://foinwi.com") === null, "Non-public path casing is not tracked");
assert(toAnalyticsPageView("/calculators", "http://localhost:5173") === null, "Local origins are not tracked");
assert(toAnalyticsPageView("/calculators", "https://foinwi.com.evil.test") === null, "Lookalike origins are not tracked");
assert(toAnalyticsPageView("/calculators", "https://www.foinwi.com").page_location === "https://www.foinwi.com/calculators", "www origin stays on www");

listPublicSitemapPaths().forEach((publicPath) => {
  const page = toAnalyticsPageView(publicPath, "https://foinwi.com");
  assert(page?.page_path === publicPath, `Public SEO path ${publicPath} is allowlisted`);
  assert(!JSON.stringify(page).includes("?"), `Public SEO path ${publicPath} has no query`);
  assert(!JSON.stringify(page).includes("#"), `Public SEO path ${publicPath} has no hash`);
});
assert(!listPublicSitemapPaths().includes("/guide-trial"), "Public sitemap still excludes Guide Trial");

const previewLesson = LEARNING_PATHS.flatMap((learningPath) => learningPath.lessons.map((lesson) => ({
  route: `/learn/${learningPath.slug}/${lesson.slug}`,
  status: lesson.contentStatus,
}))).find((lesson) => lesson.status !== "complete");
const completeLesson = LEARNING_PATHS.flatMap((learningPath) => learningPath.lessons.map((lesson) => ({
  route: `/learn/${learningPath.slug}/${lesson.slug}`,
  status: lesson.contentStatus,
}))).find((lesson) => lesson.status === "complete");
assert(completeLesson && toAnalyticsPageView(completeLesson.route, "https://foinwi.com")?.page_path === completeLesson.route, "Complete lessons are allowlisted");
if (previewLesson) {
  assert(toAnalyticsPageView(previewLesson.route, "https://foinwi.com") === null, "Preview lessons are not tracked");
}
assert(toAnalyticsPageView("/learn/money-basics/not-a-real-lesson", "https://foinwi.com") === null, "Unknown lessons are not tracked");

const denied = createHarness();
assert(denied.win[`ga-disable-${measurementId}`] === true, "Collection starts disabled");
denied.controller.sync({ collect: false, clearCookies: false, page: null });
assert(denied.elements.length === 0, "Unknown consent does not insert the Google script");
assert(denied.cookies.length === 0, "Unknown consent does not write cookies");
assert(!denied.win.gtag, "Unknown consent does not install gtag");

denied.controller.sync({ collect: false, clearCookies: true, page: calculators });
assert(denied.elements.length === 0, "Rejection does not insert the Google script");
assert(denied.cookies.some((line) => line.startsWith("_ga=")), "Rejection clears the _ga cookie");
assert(denied.cookies.some((line) => line.startsWith(`_ga_${measurementId.slice(2)}=`)), "Rejection clears the measurement cookie");
assert(denied.cookies.some((line) => line.startsWith("_ga_LEFTOVER=")), "Rejection clears visible GA cookies");
assert(denied.cookies.every((line) => !line.startsWith("theme=")), "Rejection does not clear unrelated cookies");
assert(denied.cookies.every((line) => line.includes("Max-Age=0")), "Cleared cookies expire immediately");
assert(denied.win[`ga-disable-${measurementId}`] === true, "Rejection keeps the GA disable flag on");

const granted = createHarness();
granted.controller.sync({ collect: false, clearCookies: false, page: calculators });
assert(granted.elements.length === 0, "A false collect flag does not load GA4");
granted.controller.sync({
  collect: true,
  page: { ...calculators, income: 2500000, search: "salary" },
});
assert(granted.elements.length === 0, "Extra fields block collection");
assert(!JSON.stringify(granted.win.dataLayer || []).includes("2500000"), "Income is not queued");
assert(!JSON.stringify(granted.win.dataLayer || []).includes("salary"), "Search text is not queued");

granted.controller.sync({ collect: true, clearCookies: false, page: calculators });
granted.controller.sync({ collect: true, clearCookies: false, page: calculators });
assert(pageViews(granted.win).length === 1, "The same path sends one page view");
assert(pageViews(granted.win)[0][2].page_path === "/calculators", "Manual page view uses the public path");
assert(pageViews(granted.win)[0][2].page_location === "https://foinwi.com/calculators", "Manual page view omits query and hash");
assert(Object.keys(pageViews(granted.win)[0][2]).sort().join(",") === "page_location,page_path", "Manual page view has no extra parameters");
const config = queuedCommands(granted.win).find((command) => command[0] === "config");
assert(config[1] === measurementId, "Config targets the env measurement ID");
assert(config[2].send_page_view === false, "Automatic page views are disabled");
assert(config[2].allow_google_signals === false, "Google signals stay off");
assert(config[2].allow_ad_personalization_signals === false, "Ad personalization signals stay off");
assert(config[2].page_path === "/calculators", "Config pins the allowlisted page path");
assert(config[2].page_location === "https://foinwi.com/calculators", "Config pins the sanitized page location");
assert(!String(config[2].page_location).includes("?") && !String(config[2].page_location).includes("#"), "Config page location has no query or hash");
assert(!queuedCommands(granted.win).some((command) => command[0] === "consent"), "Consent mode is not used");
assert(granted.elements.length === 1, "GA4 script is inserted once");
assert(granted.elements[0].id === GA4_SCRIPT_ID, "GA4 script has a stable id");
assert(granted.elements[0].async === true, "GA4 script loads asynchronously");
assert(granted.elements[0].src === gtagScriptUrl(measurementId), "GA4 script URL is only the measurement tag");
assert(!granted.elements[0].src.includes("income"), "GA4 script URL does not carry page data");
assert(granted.win[`ga-disable-${measurementId}`] === false, "Accepted production collection enables the tag");
assert(queuedCommands(granted.win).filter((command) => command[0] === "config").length === 1, "Config is sent once");

const remount = createAnalyticsController({
  window: granted.win,
  document: granted.doc,
  measurementId,
  writeCookie: () => {},
});
remount.sync({ collect: true, page: calculators });
assert(pageViews(granted.win).length === 1, "A remount does not send a second page view for the same path");

granted.controller.sync({ collect: true, page: home });
assert(pageViews(granted.win).length === 2, "A pathname change sends another page view");
const locationUpdates = queuedCommands(granted.win).filter((command) => command[0] === "set");
assert(locationUpdates.length === 1, "A later public page updates the sanitized location once");
assert(locationUpdates[0][1].page_path === "/", "The location update uses the public homepage path");
assert(locationUpdates[0][1].page_location === "https://foinwi.com/", "The location update has no query or hash");

granted.win.gtag("event", "page_view", {
  page_path: "/calculators",
  page_location: "https://foinwi.com/calculators?income=900000#score",
});
granted.win.gtag("event", "view_search_results", { search_term: "salary" });
granted.win.gtag("consent", "default", { analytics_storage: "denied" });
const queuedJson = JSON.stringify(queuedCommands(granted.win));
assert(!queuedJson.includes("900000"), "Query values are dropped from later page views");
assert(!queuedJson.includes("salary"), "Search results events are dropped");
assert(!queuedJson.includes("analytics_storage"), "Consent-mode payloads are dropped");
assert(!queuedJson.includes("guide-trial"), "Guide Trial is absent from the queue");

const beforeIneligible = queuedJson;
granted.controller.sync({ collect: false, clearCookies: false, page: null });
assert(granted.win[`ga-disable-${measurementId}`] === true, "Ineligible paths disable collection");
assert(JSON.stringify(queuedCommands(granted.win)) === beforeIneligible, "Ineligible paths do not add hits");
assert(granted.cookies.length === 0, "An eligible visit does not clear cookies until rejection");

granted.controller.sync({ collect: false, clearCookies: true, page: null });
assert(granted.elements[0].removed, "Withdrawal removes the script tag");
assert(!granted.win.gtag, "Withdrawal removes the gtag stub");
assert(granted.win[`ga-disable-${measurementId}`] === true, "Withdrawal disables GA");
assert(granted.cookies.some((line) => line.includes("domain=.foinwi.com")), "Withdrawal clears the parent-domain cookie");
assert(granted.cookies.some((line) => line.startsWith("_gid=")), "Withdrawal clears _gid");

granted.controller.sync({ collect: true, page: calculators });
assert(pageViews(granted.win).length === 1, "Accepting again sends the current public page once");
assert(granted.elements.some((element) => !element.removed), "Accepting again can reload the script");

assert(configParameters({ hostname: "foinwi.com" }).send_page_view === false, "Config helper keeps automatic page views off");
assert(analyticsCookieNames(measurementId).includes("_ga_TEST1234"), "Measurement cookie name is derived from the ID");
assert(!isAnalyticsCookieName("theme"), "Unrelated cookie names are ignored");
const cleared = expiredCookieDirectives("_ga", { hostname: "www.foinwi.com", secure: true });
assert(cleared.some((line) => line.includes("domain=.foinwi.com")), "www withdrawal also expires the parent domain");
assert(cleared.every((line) => line.includes("Secure")), "HTTPS cookie removal stays Secure");

const app = read("src/App.jsx");
const consentUi = read("src/components/AnalyticsConsent.jsx");
const consentCss = read("src/components/AnalyticsConsent.css");
const privacy = read("src/pages/PrivacyPolicyPage.jsx");
const headers = read("public/_headers");
const loader = read("src/analytics/ga4Loader.js");
const shell = [read("index.html"), read("src/main.jsx"), read("src/components/DocumentSeo.jsx"), app].join("\n");

assert(app.includes("<AnalyticsConsentProvider>"), "App mounts the consent provider");
assert(app.indexOf("<AnalyticsConsentProvider>") > app.indexOf("<BrowserRouter>"), "Consent provider is inside the router");
assert(app.includes('path="/guide-trial"'), "Guide Trial route remains");
assert(!/gtag|googletagmanager|google-analytics|G-[A-Z0-9]{6,}/u.test(shell), "Shell files do not add Google Analytics");
assert(!consentUi.includes("location.search"), "Consent UI does not read query strings");
assert(!consentUi.includes("location.hash"), "Consent UI does not read hashes");
assert(!consentUi.includes("useSearchParams"), "Consent UI does not read search params");
assert(consentUi.includes("shouldLoadGa4"), "Consent UI uses the production consent gate");
assert(consentUi.includes("shouldSendPageView"), "Consent UI uses the page-view gate");
assert(consentUi.includes("clearCookies: consent === CONSENT_DENIED"), "Cookies are cleared on rejection or withdrawal");
assert((consentUi.match(/className="analytics-consent__choice"/g) || []).length === 2, "Accept and Reject share one choice style");
assert(consentUi.includes("Accept"), "Accept is an explicit choice");
assert(consentUi.includes("Reject"), "Reject is an explicit choice");
assert(!/analytics-consent__(accept|reject)/u.test(`${consentUi}\n${consentCss}`), "Accept and Reject do not get unequal modifiers");
assert(read("src/components/Footer.jsx").includes("Privacy settings"), "Footer exposes persistent privacy settings");
assert(loader.includes("send_page_view: false"), "Loader disables automatic page views");
assert(!loader.includes("analytics_storage"), "Loader does not start consent mode");
assert(!loader.includes("collectGuard"), "Loader does not use a transport guard");
assert(!/\bfetch\s*=/u.test(loader), "Loader does not replace fetch");
assert(!loader.includes("XMLHttpRequest"), "Loader does not replace XMLHttpRequest");
assert(!loader.includes("sendBeacon"), "Loader does not replace sendBeacon");
assert(consentUi.includes("useLayoutEffect"), "Excluded routes stop authoring during route commit");
assert(!/googletagmanager\.com/u.test(consentUi), "The consent UI does not embed the Google script");

const analyticsDir = path.join(root, "src", "analytics");
for (const filePath of walk(analyticsDir)) {
  const source = readFileSync(filePath, "utf8");
  const imports = source.split("\n").filter((line) => line.trim().startsWith("import ")).join("\n");
  assert(!/guide-trial|HealthScore|searchEngine|incomeTax|SearchCommand|calculator/iu.test(imports), `${path.relative(root, filePath)} does not import sensitive product modules`);
}

const allowedGoogleScriptFiles = new Set([
  path.normalize("src/analytics/ga4Loader.js"),
  path.normalize("public/_headers"),
]);
const textExtensions = new Set([".js", ".jsx", ".css", ".html", ".json", ".txt", ".xml", ".md", ".svg"]);
for (const filePath of walk(path.join(root, "src")).concat(walk(path.join(root, "public")), path.join(root, "index.html"))) {
  const base = path.basename(filePath);
  if (base !== "_headers" && !textExtensions.has(path.extname(filePath))) continue;
  const relative = path.normalize(path.relative(root, filePath));
  const source = readFileSync(filePath, "utf8");
  if (source.includes("googletagmanager.com") && !allowedGoogleScriptFiles.has(relative)) {
    failures.push(`${relative} unexpectedly references googletagmanager.com`);
    checks += 1;
  } else if (source.includes("googletagmanager.com")) {
    checks += 1;
  }
  assert(!/G-[A-Z0-9]{6,}/u.test(source), `${relative} does not hardcode a measurement ID`);
}

const cspLine = headers.split("\n").find((line) => line.includes("Content-Security-Policy:"));
const directives = Object.fromEntries(cspLine.split("Content-Security-Policy:")[1].trim().split(";").map((part) => {
  const tokens = part.trim().split(/\s+/u).filter(Boolean);
  return [tokens[0], tokens.slice(1)];
}));
assert(JSON.stringify(directives["script-src"]) === JSON.stringify([
  "'self'",
  "'sha256-t65yTLilvzBYFDeBuZ1UY2+E09yuu15BJ3muW9pFfwA='",
  "'sha256-BVYNLGYlxclZS/kThn5NsTXOhE2CSJf0DO0yiHg0pO0='",
  "https://www.googletagmanager.com",
]), "script-src adds only the Google tag host and keeps JSON-LD hashes");
assert(JSON.stringify(directives["img-src"]) === JSON.stringify([
  "'self'",
  "data:",
  "https://*.google-analytics.com",
  "https://www.googletagmanager.com",
]), "img-src adds only Google tag image hosts");
assert(JSON.stringify(directives["connect-src"]) === JSON.stringify([
  "'self'",
  "https://*.google-analytics.com",
  "https://www.googletagmanager.com",
]), "connect-src adds only Google tag collection hosts");
assert(!headers.includes("https://www.google-analytics.com"), "CSP does not repeat the apex analytics host covered by the wildcard");
assert(!headers.includes("analytics.google.com"), "CSP does not allow the unused analytics.google.com wildcard");
assert(JSON.stringify(directives["style-src"]) === JSON.stringify(["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"]), "style-src stays unchanged");
assert(!headers.includes("unsafe-eval"), "CSP does not add unsafe-eval");
assert(!/script-src[^;]*unsafe-inline/u.test(headers), "script-src does not allow unsafe-inline");
["doubleclick.net", "googleadservices.com", "googlesyndication.com", "https://www.google.com"].forEach((host) => {
  assert(!headers.includes(host), `CSP does not allow ${host}`);
});
["X-Content-Type-Options: nosniff", "Referrer-Policy: strict-origin-when-cross-origin", "X-Frame-Options: DENY", "Cross-Origin-Opener-Policy: same-origin", "upgrade-insecure-requests"].forEach((header) => {
  assert(headers.includes(header), `Security header remains: ${header}`);
});
assert(privacy.includes("Google Analytics 4"), "Privacy notice names Google Analytics 4");
assert(privacy.includes("Google is the recipient"), "Privacy notice names Google as recipient");
assert(privacy.includes("analytics cookies"), "Privacy notice describes cookies");
assert(privacy.includes("opt out"), "Privacy notice describes opt-out");
assert(privacy.includes("withdraw"), "Privacy notice describes withdrawal");
assert(privacy.includes("retention"), "Privacy notice describes retention limitations");
assert(!/\bGDPR\b|\bDPDP\b|\bfully compliant\b|\bguaranteed deletion\b|\bcompletely anonymous\b/iu.test(privacy), "Privacy notice avoids unsupported legal claims");
assert(read("package.json").includes('"validate:analytics"'), "package.json exposes the analytics validator");
assert(read(".env.example").includes("VITE_GA_MEASUREMENT_ID="), "Example env documents the measurement ID variable");
assert(!/G-[A-Z0-9]{6,}/u.test(read(".env.example")), "Example env does not contain a real measurement ID");

function createRouteHarness() {
  const listeners = [];
  const elements = [];
  const cookies = [];
  function nativeFetch() {
    return Promise.resolve({ status: 200 });
  }
  function nativeBeacon() {
    return true;
  }
  const win = {
    location: {
      hostname: "foinwi.com",
      protocol: "https:",
      origin: "https://foinwi.com",
      pathname: "/calculators",
    },
    fetch: nativeFetch,
    navigator: { sendBeacon: nativeBeacon },
    history: {
      pushState(_state, _title, url) {
        win.location.pathname = new URL(String(url), win.location.origin).pathname;
      },
      replaceState(_state, _title, url) {
        win.location.pathname = new URL(String(url), win.location.origin).pathname;
      },
    },
    addEventListener(type, listener, capture) {
      listeners.push({ type, listener, capture });
    },
  };
  const doc = {
    cookie: "_ga=1; theme=light",
    head: { appendChild(node) { elements.push(node); } },
    getElementById(id) {
      return elements.find((node) => node.id === id && !node.removed) ?? null;
    },
    createElement() {
      return { id: "", async: false, src: "", removed: false, remove() { this.removed = true; } };
    },
  };
  const controller = createAnalyticsController({
    window: win,
    document: doc,
    measurementId,
    writeCookie: (line) => cookies.push(line),
  });
  return { win, elements, cookies, listeners, controller, nativeFetch, nativeBeacon };
}

const route = createRouteHarness();
assert(route.win.fetch === route.nativeFetch, "Creating the controller leaves fetch untouched");
assert(route.win.navigator.sendBeacon === route.nativeBeacon, "Creating the controller leaves sendBeacon untouched");
route.controller.sync({ collect: true, page: calculators });
assert(route.elements.length === 1, "An accepted public page still loads the tag script");
assert(route.win[`ga-disable-${measurementId}`] === false, "An allowlisted page enables app authoring");
const beforeSensitiveNavigation = JSON.stringify(queuedCommands(route.win));
route.win.history.pushState({}, "", "/income-tax-calculator?income=2500000&search=aadhaar#answers");
assert(JSON.stringify(queuedCommands(route.win)) === beforeSensitiveNavigation, "A query-only history update does not author a hit");
assert(route.win[`ga-disable-${measurementId}`] === false, "An allowlisted path with a query stays eligible");
const sensitivePage = toAnalyticsPageView("/income-tax-calculator?income=2500000&search=aadhaar#answers", "https://foinwi.com");
route.controller.sync({ collect: true, page: sensitivePage });
const sensitiveView = pageViews(route.win).at(-1);
assert(sensitiveView[2].page_path === "/income-tax-calculator", "The manual page view keeps the allowlisted path");
assert(sensitiveView[2].page_location === "https://foinwi.com/income-tax-calculator", "The manual page view drops the query and hash");
["2500000", "aadhaar", "answers", "income=", "search=", "#"].forEach((secret) => {
  assert(!JSON.stringify(queuedCommands(route.win)).includes(secret), `Queued commands must not contain ${secret}`);
});

const beforeGuideTrial = JSON.stringify(queuedCommands(route.win));
route.win.history.pushState({}, "", "/guide-trial?message=secret");
assert(route.win.location.pathname === "/guide-trial", "Guide Trial navigation still updates the address");
assert(route.win[`ga-disable-${measurementId}`] === true, "Guide Trial synchronously disables GA4");
assert(JSON.stringify(queuedCommands(route.win)) === beforeGuideTrial, "Guide Trial does not author a page view");
assert(route.elements.every((element) => !element.removed), "Guide Trial does not remove the script node by itself");
route.win.gtag("event", "page_view", {
  page_path: "/calculators",
  page_location: "https://foinwi.com/calculators",
});
route.win.gtag("config", measurementId, {
  page_path: "/guide-trial",
  page_location: "https://foinwi.com/guide-trial?message=secret",
  send_page_view: false,
});
assert(JSON.stringify(queuedCommands(route.win)) === beforeGuideTrial, "The app stub drops events while Guide Trial is open");
assert(!JSON.stringify(queuedCommands(route.win)).includes("secret"), "Guide Trial content is not queued");

route.win.history.replaceState({}, "", "/not-a-real-page?income=9");
assert(route.win[`ga-disable-${measurementId}`] === true, "An unknown route keeps GA4 disabled");
assert(JSON.stringify(queuedCommands(route.win)) === beforeGuideTrial, "An unknown route does not author a page view");
route.win.location.pathname = "/guide-trial/notes";
route.listeners.find((entry) => entry.type === "popstate").listener();
assert(route.win[`ga-disable-${measurementId}`] === true, "Popping back to Guide Trial keeps authoring stopped");

route.win.history.pushState({}, "", "/");
assert(route.win[`ga-disable-${measurementId}`] === true, "History to a public route does not reopen tracking by itself");
assert(JSON.stringify(queuedCommands(route.win)) === beforeGuideTrial, "History to a public route does not author a hit by itself");
route.controller.sync({ collect: true, page: home });
assert(route.win[`ga-disable-${measurementId}`] === false, "An eligible route can author again");
assert(pageViews(route.win).at(-1)[2].page_path === "/", "Returning to an eligible route sends that public path");
assert(pageViews(route.win).at(-1)[2].page_location === "https://foinwi.com/", "The reopened page view has no query or hash");
assert(!JSON.stringify(queuedCommands(route.win)).includes("guide-trial"), "Reopened tracking does not include Guide Trial");

route.controller.sync({ collect: false, clearCookies: true, page: null });
assert(route.elements[0].removed, "Withdrawal removes the script node");
assert(!route.win.gtag, "Withdrawal removes the app gtag stub");
assert(route.win[`ga-disable-${measurementId}`] === true, "Withdrawal leaves the GA disable flag on");
assert(route.cookies.some((line) => line.startsWith("_ga=") && line.includes("Max-Age=0")), "Withdrawal expires the visible _ga cookie");
assert(route.cookies.every((line) => !line.startsWith("theme=")), "Withdrawal does not expire unrelated cookies");
route.win.history.pushState({}, "", "/calculators");
assert(route.win[`ga-disable-${measurementId}`] === true, "Navigation after withdrawal does not reopen tracking");
assert(!route.win.gtag, "Navigation after withdrawal does not restore the stub");

if (failures.length) {
  console.error(`Analytics validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Analytics validation passed: ${checks} checks.`);
