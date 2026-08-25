import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_CALCULATORS } from "../src/data/calculators.js";
import { CURRENCY_SEARCH_METADATA } from "../src/data/currencyMetadata.js";
import {
  convertAmount,
  normalizeCurrencies,
  searchCurrencies,
  validateNormalizedRate,
} from "../src/utils/exchangeRates.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validation(name, callback) {
  callback();
  console.log(`✅ ${name}`);
}

const validRate = {
  base: "INR",
  quote: "USD",
  rate: 0.0125,
  provider: "Synthetic provider",
  sourcePublishedAt: "2026-08-24T00:00:00.000Z",
  retrievedAt: "2026-08-24T01:00:00.000Z",
  cacheState: "fresh",
};

validation("currency search metadata is complete and unique", () => {
  const codes = Object.keys(CURRENCY_SEARCH_METADATA);
  assert(new Set(codes).size === codes.length, "Currency codes must be unique");
  codes.forEach((code) => {
    const metadata = CURRENCY_SEARCH_METADATA[code];
    assert(/^[A-Z]{3}$/u.test(code), `${code} must be a valid ISO-style currency code`);
    assert(Array.isArray(metadata.territories), `${code} requires territories`);
    assert(Array.isArray(metadata.searchTerms), `${code} requires search terms`);
  });
});

validation("provider currency normalization and aliases work", () => {
  const currencies = normalizeCurrencies([
    { code: "INR", name: "Indian Rupee", minorUnit: 2, providerSupported: true },
    { code: "USD", name: "United States Dollar", minorUnit: 2, providerSupported: true },
  ]);
  assert(currencies.length === 2, "Valid provider currencies must normalize");
  assert(searchCurrencies(currencies, "india")[0]?.code === "INR", "Territory alias must match INR");
  assert(searchCurrencies(currencies, "usd")[0]?.code === "USD", "Currency code must match");
  assert(searchCurrencies(currencies, "america")[0]?.code === "USD", "Common alias must match USD");
  assert(normalizeCurrencies([{ code: "INRR", name: "Invalid" }]).length === 0, "Invalid codes must reject");
  assert(normalizeCurrencies([{ code: "INR", name: "Indian Rupee", providerSupported: false }]).length === 0, "Unsupported currencies must reject");
});

validation("conversion uses synthetic fixtures and preserves same-currency identity", () => {
  assert(convertAmount(200, validRate.rate) === 2.5, "Synthetic conversion vector failed");
  assert(convertAmount(0, validRate.rate) === 0, "Zero amount must remain zero");
  assert(convertAmount(250.5, 1) === 250.5, "Same-currency identity must preserve amount exactly");
  assert(convertAmount(-1, validRate.rate) === null, "Negative amount must reject");
});

validation("normalized rate contract rejects unsafe responses", () => {
  assert(validateNormalizedRate(validRate, "INR", "USD") === validRate, "Valid synthetic rate must pass");
  assert(!validateNormalizedRate({ ...validRate, rate: 0 }, "INR", "USD"), "Zero rate must reject");
  assert(!validateNormalizedRate({ ...validRate, rate: -1 }, "INR", "USD"), "Negative rate must reject");
  assert(!validateNormalizedRate({ ...validRate, rate: Number.NaN }, "INR", "USD"), "Non-finite rate must reject");
  assert(!validateNormalizedRate({ ...validRate, quote: "EUR" }, "INR", "USD"), "Currency mismatch must reject");
  assert(!validateNormalizedRate({ ...validRate, sourcePublishedAt: "unknown" }, "INR", "USD"), "Invalid source timestamp must reject");
  assert(!validateNormalizedRate({ ...validRate, provider: "" }, "INR", "USD"), "Missing provider must reject");
});

validation("production source contains no market rates or frontend credentials", () => {
  const metadata = read("src/data/currencyMetadata.js");
  const client = read("src/services/exchangeRatesClient.js");
  const endpoint = read("functions/api/exchange-rates.js");
  assert(!/\brate\s*:\s*\d/u.test(metadata), "Currency metadata must not contain production market rates");
  assert(!/(api[_-]?key|authorization:\s*bearer|secret[_-]?key)/iu.test(`${client}\n${endpoint}`), "Exchange source must not contain credentials");
  assert(!/amount.*URLSearchParams|URLSearchParams.*amount/us.test(client), "Entered amount must be absent from outbound rate requests");
  assert(client.includes("base, quote"), "Rate request must use only currency codes");
});

validation("route, separation, trust copy, and failure states exist", () => {
  const app = read("src/App.jsx");
  const calculatorData = read("src/data/calculators.js");
  const page = read("src/pages/ExchangeRatesPage.jsx");
  const converter = read("src/components/exchange-rates/ExchangeConverter.jsx");
  const privacy = read("src/pages/PrivacyPolicyPage.jsx");
  const disclaimer = read("src/pages/DisclaimerPage.jsx");
  assert(app.includes('path="/exchange-rates"'), "Exchange Rates route is missing");
  assert(page.includes("ExchangeConverter"), "Exchange Rates page must use its isolated converter");
  assert(!calculatorData.includes("Exchange Rates"), "Exchange Rates must not enter ALL_CALCULATORS");
  assert(ALL_CALCULATORS.length === 20, "Existing calculator count must remain 20");
  assert(privacy.includes("Frankfurter"), "Privacy disclosure must name the rate provider");
  assert(disclaimer.includes("Exchange Rates"), "Disclaimer must cover reference rates");
  ["navigator.onLine", "timed out", "provider-unavailable", "invalid-response", "unsupported-currency", "stale", "Refresh"].forEach((term) => {
    assert(converter.includes(term) || clientHas(term), `Required failure state is missing: ${term}`);
  });
});

function clientHas(term) {
  return read("src/services/exchangeRatesClient.js").includes(term);
}

console.log("\nAll Exchange Rates validations passed.");
