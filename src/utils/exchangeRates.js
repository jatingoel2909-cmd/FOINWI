import { CURRENCY_SEARCH_METADATA } from "../data/currencyMetadata.js";

const ISO_CODE = /^[A-Z]{3}$/u;

export function isCurrencyCode(value) {
  return typeof value === "string" && ISO_CODE.test(value);
}

export function normalizeCurrencies(payload) {
  if (!Array.isArray(payload)) return [];

  return payload
    .filter(
      (currency) =>
        isCurrencyCode(currency?.code) &&
        typeof currency?.name === "string" &&
        currency.providerSupported === true,
    )
    .map((currency) => {
      const code = currency.code.toUpperCase();
      const metadata = CURRENCY_SEARCH_METADATA[code] ?? {};

      return {
        code,
        name: currency.name.trim(),
        minorUnit: Number.isInteger(currency.minorUnit) ? currency.minorUnit : null,
        territories: metadata.territories ?? [],
        searchTerms: metadata.searchTerms ?? [],
        providerSupported: currency.providerSupported === true,
      };
    })
    .sort((left, right) => left.code.localeCompare(right.code));
}

export function searchCurrencies(currencies, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return currencies;

  return currencies.filter((currency) =>
    [
      currency.code,
      currency.name,
      ...currency.territories,
      ...currency.searchTerms,
    ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)),
  );
}

export function validateNormalizedRate(payload, requestedBase, requestedQuote) {
  if (!payload || typeof payload !== "object") return null;
  if (payload.base !== requestedBase || payload.quote !== requestedQuote) return null;
  if (!Number.isFinite(payload.rate) || payload.rate <= 0) return null;
  if (typeof payload.provider !== "string" || !payload.provider.trim()) return null;
  if (!isValidTimestamp(payload.sourcePublishedAt) || !isValidTimestamp(payload.retrievedAt)) return null;
  if (!["fresh", "cached"].includes(payload.cacheState)) return null;

  return payload;
}

export function convertAmount(amount, rate) {
  if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(rate) || rate <= 0) return null;
  return amount * rate;
}

export function formatCurrencyAmount(amount, currency, locale) {
  if (!Number.isFinite(amount) || !isCurrencyCode(currency)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 8,
  }).format(amount);
}

export function isValidTimestamp(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

export function formatTimestamp(value, locale) {
  if (!isValidTimestamp(value)) return "Unavailable";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "long",
  }).format(new Date(value));
}
