/* global process */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
let checks = 0;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function stripClassNames(source) {
  return source
    .replace(/className="[^"]*"/g, "")
    .replace(/className=\{`[^`]*`\}/g, "")
    .replace(/className=\{"[^"]*"\}/g, "");
}

const navbar = read("src/components/Navbar.jsx");
const navbarCss = read("src/components/Navbar.css");
const footer = read("src/components/Footer.jsx");
const brand = read("src/components/BrandWordmark.jsx");
const command = read("src/components/intelligence/SearchCommandCenter.jsx");
const overlay = read("src/components/intelligence/SearchOverlay.jsx");
const results = read("src/components/intelligence/SearchResults.jsx");
const helpers = read("src/components/intelligence/searchCommandHelpers.js");
const app = read("src/App.jsx");
const packageJson = read("package.json");
const shellSource = [navbar, footer, brand].join("\n");
const commandSource = [command, overlay, results, helpers].join("\n");

const NAV_DESTINATIONS = [
  "/",
  "/calculators",
  "/financial-health-score",
  "/learn",
  "/ai-tools",
  "/about",
  "/#contact",
];

assert(packageJson.includes('"validate:shell"'), "package.json must expose validate:shell");
assert(app.includes('path="/"'), "A: Home route must remain /");
assert(app.includes('path="/calculators"'), "A: Calculators route must remain /calculators");
assert(app.includes('path="/financial-health-score"'), "A: Health Score route must remain /financial-health-score");
assert(app.includes('path="/learn"'), "A: Learn route must remain /learn");
assert(app.includes('path="/ai-tools"'), "A: Intelligence route must remain /ai-tools");
assert(app.includes('path="/about"'), "A: About route must remain /about");
assert(!app.includes('path="/contact"'), "B: App must not invent a /contact route");

NAV_DESTINATIONS.forEach((href) => {
  assert(navbar.includes(`to="${href}"`) || navbar.includes(`href: "${href}"`), `A: Navbar must keep destination ${href}`);
});

assert(navbar.includes('href: "/"'), "A: Navbar Home destination must remain /");
assert(navbar.includes('href: "/calculators"'), "A: Navbar Calculators destination must remain /calculators");
assert(navbar.includes('href: "/financial-health-score"'), "A: Navbar Health Score destination must remain /financial-health-score");
assert(navbar.includes('href: "/learn"'), "A: Navbar Learn destination must remain /learn");
assert(navbar.includes('href: "/ai-tools"'), "A: Navbar Intelligence destination must remain /ai-tools");
assert(navbar.includes('href: "/about"'), "A: Navbar About destination must remain /about");
assert(navbar.includes('to="/#contact"'), "C: Navbar Contact must remain /#contact");
assert(!navbar.includes('to="/contact"'), "B: Navbar must not invent a /contact route");
assert(footer.includes('to="/#contact"'), "C: Footer Contact must remain /#contact");
assert(!footer.includes('to="/contact"'), "B: Footer must not invent a /contact route");

assert(navbar.includes("aria-expanded={menuOpen}"), "D: Menu button must keep aria-expanded");
assert(navbar.includes("aria-controls={MOBILE_NAV_ID}") || navbar.includes('aria-controls="foinwi-mobile-nav"'), "D: Menu button must have aria-controls");
assert(navbar.includes('const MOBILE_NAV_ID = "foinwi-mobile-nav"') || navbar.includes('id="foinwi-mobile-nav"'), "E: Mobile drawer must have a stable id");
assert(navbar.includes("id={MOBILE_NAV_ID}") || navbar.includes('id="foinwi-mobile-nav"'), "E: Drawer id must match the menu aria-controls target");

assert(navbar.includes('event.key !== "Escape"') || navbar.includes('event.key === "Escape"'), "F: Navbar must handle Escape for the open drawer");
assert(navbar.includes("if (!menuOpen) return undefined"), "F: Drawer Escape listener must run only while the drawer is open");
assert(navbar.includes("aria-hidden={!menuOpen}"), "G: Closed drawer must use aria-hidden");
assert(navbar.includes("inert={!menuOpen}"), "G: Closed drawer must use inert");
const mobileCss = navbarCss.split("@media (max-width: 1023px)")[1] ?? "";
const drawerShell = mobileCss.match(/\.shrix-nav-drawer\s*\{([^}]+)\}/u)?.[1] ?? "";
assert(/inset:\s*0/u.test(drawerShell), "G: Mobile drawer shell must stay viewport-contained");
assert(/overflow:\s*hidden/u.test(drawerShell), "G: Mobile drawer shell must clip overflow");
assert(/visibility:\s*hidden/u.test(drawerShell), "G: Closed mobile drawer must use visibility hidden");
assert(!/transform:\s*translateX\(100%\)/u.test(drawerShell), "G: Closed drawer root must not translate off-canvas");

assert(navbar.includes('aria-haspopup="dialog"'), 'H: Search opener must use aria-haspopup="dialog"');
assert(navbar.includes("aria-expanded={searchOpen}"), "H: Search opener must reflect search open state");

assert(overlay.includes('role="dialog"'), "I: Command Center must keep dialog semantics");
assert(overlay.includes('aria-modal="true"'), "I: Command Center must keep aria-modal");
assert(command.includes('event.key === "Escape"'), "J: Command Center Escape close must remain");
assert(command.includes("closeAndReset"), "J: Command Center must keep an Escape close path");
assert(command.includes("inputRef.current?.focus"), "K: Command Center must move focus into the search input");
assert(helpers.includes("trapTabKey") && helpers.includes('event.key !== "Tab"'), "L: Command Center must trap Tab inside the dialog");
assert(command.includes("trapTabKey(event, dialogRef.current)"), "L: Dialog key handling must call the Tab trap");
assert(command.includes("returnFocusRef"), "M: Command Center must restore focus to the opener");
assert(navbar.includes("returnFocusRef={searchOpenerRef}"), "M: Navbar must pass the search opener for focus restoration");

assert(!/Popular searches/u.test(commandSource), 'N: Shared Command Center must not use "Popular searches"');
assert(/More topics to try/u.test(results), "O: Command Center must use the editorial More topics to try heading");
assert(!/Recent searches/u.test(commandSource), "P: Command Center must not show fake Recent searches");
assert(!/\b(localStorage|sessionStorage)\b/u.test(commandSource), "P: Command Center must not persist search history");

assert(footer.includes('to="/about"'), "Q: Footer must include /about");
assert(footer.includes('to="/privacy-policy"'), "Q: Footer must include /privacy-policy");
assert(footer.includes('to="/terms-and-conditions"'), "Q: Footer must include the live terms route");
assert(footer.includes('to="/disclaimer"'), "Q: Footer must include /disclaimer");
assert(footer.includes("support@foinwi.com"), "Q: Footer must include support@foinwi.com");

assert(!/\bShrix\b|\bSHRiX\b/u.test(stripClassNames(shellSource)), "R: Navbar/Footer/BrandWordmark must not contain public Shrix branding");
assert(!/href=["']#["']/u.test(shellSource), "S: Navbar/Footer must not use href=# placeholders");
assert(!/javascript:void/u.test(shellSource), "S: Navbar/Footer must not use javascript:void placeholders");
assert(!navbar.includes("/exchange-rates"), "T: Exchange Rates must not be added to primary nav");

if (failures.length) {
  console.error(`Shell validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Shell validation passed: ${checks} checks.`);
