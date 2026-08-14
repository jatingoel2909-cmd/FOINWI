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
  about: new URL("../src/pages/AboutPage.jsx", import.meta.url),
  privacy: new URL("../src/pages/PrivacyPolicyPage.jsx", import.meta.url),
  disclaimer: new URL("../src/pages/DisclaimerPage.jsx", import.meta.url),
  terms: new URL("../src/pages/TermsAndConditionsPage.jsx", import.meta.url),
  footer: new URL("../src/components/Footer.jsx", import.meta.url),
  infoLayout: new URL("../src/components/InfoPageLayout.jsx", import.meta.url),
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([name, file]) => [name, await readFile(file, "utf8")])),
);
const publicTrustSource = [source.about, source.privacy, source.disclaimer, source.terms, source.footer].join("\n");
const expectedRoutes = ["/about", "/privacy-policy", "/disclaimer", "/terms-and-conditions"];
const requiredAboutCopy = [
  "What You Can Use Today",
  "What FOINWI Does Not Do",
  "How Intelligence Works Today",
  "structured educational content",
  "More advanced AI-enabled assistance may be introduced later",
];

expectedRoutes.forEach((route) => assert(source.app.includes(`path="${route}"`), `Missing route ${route}`));
requiredAboutCopy.forEach((copy) => assert(source.about.includes(copy), `About is missing "${copy}"`));
["/calculators", "/learn", "/financial-health-score", "/ai-tools", "/disclaimer", "/privacy-policy", "/terms-and-conditions"].forEach((route) => {
  assert(source.about.includes(`to="${route}"`), `About CTA route ${route} is missing`);
});
assert(source.about.includes("mailto:support@foinwi.com"), "About support email CTA is missing");
assert(source.footer.includes('to="/about"'), "Footer About route is missing");
assert(!source.footer.includes('id="about"'), "Footer must not use an About anchor that conflicts with the About route");
assert(
  /does not provide personalised financial,\s*tax,\s*legal,\s*or loan\s*advice/iu.test(source.about),
  "About non-advisory boundary is missing",
);
assert(!/\bai-powered\b/iu.test(source.about), "About must not present current Intelligence as AI-powered");
assert(!/\bguaranteed returns?\b/iu.test(publicTrustSource), "Trust surfaces must not promise guaranteed returns");
assert(!/\b(?:loan )?approval for you\b|\bsuitable for you\b/iu.test(publicTrustSource), "Trust surfaces must not imply approval or suitability");
assert(source.privacy.includes("contact us by email"), "Privacy policy must describe current email contact");
assert(source.privacy.includes("not currently enabled"), "Privacy policy must state current analytics status");
assert(source.privacy.includes("not saved after refresh"), "Privacy policy must describe Guide Trial persistence");
assert(!/\bforms on the website\b/iu.test(source.privacy), "Privacy policy must not claim current website forms");
assert(!/\bTODO\b|\blorem ipsum\b|\bplaceholder\b/iu.test(publicTrustSource), "Trust surfaces contain placeholder content");
const supportEmails = [...publicTrustSource.matchAll(/support@foinwi\.com/giu)];
assert(supportEmails.length >= 4, "Support email must be present across trust surfaces");
assert(!/\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/giu.test(publicTrustSource.replace(/support@foinwi\.com/giu, "")), "Trust surfaces contain a conflicting support email");
assert(source.infoLayout.includes("<main") && source.infoLayout.includes('id="main-content"'), "InfoPage layout must provide a main landmark");
assert(source.infoLayout.includes("Skip to main content"), "InfoPage layout must provide a skip link");

if (failures.length) {
  console.error(`Trust validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Trust validation passed: ${checks} checks.`);
