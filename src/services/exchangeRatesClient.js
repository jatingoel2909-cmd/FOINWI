import { validateNormalizedRate } from "../utils/exchangeRates";

const API_PATH = "/api/exchange-rates";
const REQUEST_TIMEOUT_MS = 10_000;

async function requestJson(url, signal) {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("invalid-response");
  }

  if (!response.ok) {
    throw new Error(payload?.error || "provider-unavailable");
  }

  return payload;
}

function withTimeout(callback) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  return callback(controller.signal).finally(() => window.clearTimeout(timeout));
}

export function fetchCurrencies() {
  return withTimeout((signal) => requestJson(`${API_PATH}?resource=currencies`, signal));
}

export async function fetchExchangeRate(base, quote, { refresh = false } = {}) {
  const params = new URLSearchParams({ base, quote });
  if (refresh) params.set("refresh", "1");
  const payload = await withTimeout((signal) =>
    requestJson(`${API_PATH}?${params.toString()}`, signal),
  );
  const normalized = validateNormalizedRate(payload, base, quote);

  if (!normalized) throw new Error("invalid-response");
  return normalized;
}

export function getExchangeErrorMessage(error) {
  if (!navigator.onLine) return "You appear to be offline. Connect to the internet and refresh the rate.";
  if (error?.name === "AbortError") return "The rate request timed out. Please try again.";
  if (error?.message === "unsupported-currency") return "That currency is not currently supported by the reference-rate provider.";
  if (error?.message === "invalid-response") return "Exchange rate currently unavailable.";
  return "Exchange rate currently unavailable.";
}
