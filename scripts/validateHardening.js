/* global process */
import { readFile } from "node:fs/promises";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

const files = {
  app: new URL("../src/App.jsx", import.meta.url),
  notFound: new URL("../src/pages/NotFoundPage.jsx", import.meta.url),
  main: new URL("../src/main.jsx", import.meta.url),
  errorBoundary: new URL("../src/components/AppErrorBoundary.jsx", import.meta.url),
  journeyPage: new URL("../src/pages/FinancialJourneyPage.jsx", import.meta.url),
  journeyProgress: new URL("../src/components/journey-engine/JourneyProgress.jsx", import.meta.url),
};
const source = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([name, file]) => [name, await readFile(file, "utf8")])),
);
const wildcardRouteIndex = source.app.indexOf('<Route path="*"');
const finalRouteIndex = source.app.lastIndexOf("<Route");

assert(wildcardRouteIndex >= 0, "Wildcard not-found route is missing");
assert(wildcardRouteIndex === finalRouteIndex, "Wildcard route must be last");
["/", "/calculators", "/learn", "/financial-health-score"].forEach((route) => {
  assert(source.notFound.includes(`to="${route}"`), `Not-found recovery route ${route} is missing`);
});
assert(source.notFound.includes("<main") && source.notFound.includes("<h1"), "Not-found page needs an accessible main heading");
assert(source.main.includes("<AppErrorBoundary>") && source.main.includes("</AppErrorBoundary>"), "Application error boundary must wrap App");
assert(source.errorBoundary.includes("getDerivedStateFromError"), "Error boundary must handle render errors");
assert(source.errorBoundary.includes("Reload page") && source.errorBoundary.includes("Return home"), "Error fallback must provide recovery actions");
assert(!/stack|error\.message/iu.test(source.errorBoundary), "Error fallback must not expose error details");
assert(source.journeyPage.includes("setCheckedItems") && source.journeyPage.includes("toggleProgressStep"), "Build Wealth progress must be interactive");
assert(source.journeyProgress.includes("aria-pressed") && source.journeyProgress.includes("onToggleStep"), "Journey milestones need accessible toggle controls");
assert(source.journeyProgress.includes("Reset journey progress") && source.journeyPage.includes("resetProgress"), "Journey progress needs a reset control");
assert(!/\bfetch\(|axios|openai|claude|gemini|websocket/iu.test(`${source.journeyPage}\n${source.journeyProgress}`), "Journey progress must remain local-only");

if (failures.length) {
  console.error(`Hardening validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Hardening validation passed: ${checks} checks.`);
