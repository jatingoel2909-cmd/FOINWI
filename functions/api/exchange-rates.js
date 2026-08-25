const PROVIDER = "Frankfurter (central-bank reference data)";
const PROVIDER_API = "https://api.frankfurter.dev/v2";
const RATE_CACHE_TTL_SECONDS = 6 * 60 * 60;
const CURRENCY_CACHE_TTL_SECONDS = 24 * 60 * 60;
const CURRENT_CURRENCY_GRACE_MS = 14 * 24 * 60 * 60 * 1000;
const ISO_CODE = /^[A-Z]{3}$/u;

function json(body, status = 200, cacheControl = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function isCode(value) {
  return typeof value === "string" && ISO_CODE.test(value);
}

function asTimestamp(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(date)) return null;
  const timestamp = new Date(`${date}T00:00:00.000Z`);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp.toISOString();
}

function minorUnitFor(code) {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency: code })
      .resolvedOptions()
      .maximumFractionDigits;
  } catch {
    return null;
  }
}

function isCurrentCurrency(currency) {
  const endDate = asTimestamp(currency?.end_date);
  return Boolean(endDate && new Date(endDate).getTime() >= Date.now() - CURRENT_CURRENCY_GRACE_MS);
}

async function fromCacheOrFetch(request, endpoint, ttlSeconds, normalize, bypassCache = false) {
  const cache = caches.default;
  const cacheUrl = new URL(request.url);
  cacheUrl.searchParams.delete("refresh");
  const cacheKey = new Request(cacheUrl.toString());
  const cached = bypassCache ? null : await cache.match(cacheKey);
  if (cached) {
    const payload = await cached.json();
    return { payload: { ...payload, cacheState: "cached" }, cacheControl: `public, max-age=${ttlSeconds}` };
  }

  let upstream;
  try {
    const requestOptions = {
      headers: { Accept: "application/json" },
      ...(bypassCache ? { cache: "no-store" } : { cf: { cacheTtl: ttlSeconds, cacheEverything: true } }),
    };
    upstream = await fetch(endpoint, {
      ...requestOptions,
    });
  } catch {
    return { error: "provider-unavailable", status: 502 };
  }

  if (!upstream.ok) {
    return {
      error: upstream.status === 422 ? "unsupported-currency" : "provider-unavailable",
      status: upstream.status === 422 ? 422 : 502,
    };
  }

  let raw;
  try {
    raw = await upstream.json();
  } catch {
    return { error: "invalid-response", status: 502 };
  }

  const payload = normalize(raw);
  if (!payload) return { error: "invalid-response", status: 502 };

  const response = json(payload, 200, `public, max-age=${ttlSeconds}`);
  await cache.put(cacheKey, response.clone());
  return { payload, cacheControl: `public, max-age=${ttlSeconds}` };
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const resource = url.searchParams.get("resource");

  if (resource === "currencies") {
    const result = await fromCacheOrFetch(
      context.request,
      `${PROVIDER_API}/currencies`,
      CURRENCY_CACHE_TTL_SECONDS,
      (raw) => {
        if (!Array.isArray(raw)) return null;
        const currencies = raw
          .filter(
            (item) =>
              isCode(item?.iso_code) &&
              typeof item?.name === "string" &&
              isCurrentCurrency(item),
          )
          .map((item) => ({
            code: item.iso_code,
            name: item.name,
            minorUnit: minorUnitFor(item.iso_code),
            providerSupported: true,
          }));
        return currencies.length ? { currencies } : null;
      },
    );
    if (result.error) return json({ error: result.error }, result.status);
    return json(result.payload, 200, result.cacheControl);
  }

  const base = url.searchParams.get("base")?.toUpperCase();
  const quote = url.searchParams.get("quote")?.toUpperCase();
  const refresh = url.searchParams.get("refresh") === "1";
  if (!isCode(base) || !isCode(quote)) return json({ error: "unsupported-currency" }, 422);
  if (base === quote) return json({ error: "same-currency-does-not-require-rate" }, 400);

  const providerUrl = `${PROVIDER_API}/rate/${encodeURIComponent(base)}/${encodeURIComponent(quote)}`;
  const result = await fromCacheOrFetch(
    context.request,
    providerUrl,
    RATE_CACHE_TTL_SECONDS,
    (raw) => {
      const sourcePublishedAt = asTimestamp(raw?.date);
      if (
        raw?.base !== base ||
        raw?.quote !== quote ||
        !Number.isFinite(raw?.rate) ||
        raw.rate <= 0 ||
        !sourcePublishedAt
      ) {
        return null;
      }
      return {
        base,
        quote,
        rate: raw.rate,
        provider: PROVIDER,
        sourcePublishedAt,
        retrievedAt: new Date().toISOString(),
        cacheState: "fresh",
      };
    },
    refresh,
  );

  if (result.error) return json({ error: result.error }, result.status);
  return json(result.payload, 200, result.cacheControl);
}
