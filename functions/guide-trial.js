const PRESERVED_HEADERS = [
  "content-type",
  "content-security-policy",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-frame-options",
  "cross-origin-opener-policy",
  "cache-control",
];

function shellUnavailable() {
  return new Response("Application shell is unavailable.", {
    status: 502,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  if (requestUrl.pathname !== "/guide-trial" && requestUrl.pathname !== "/guide-trial/") {
    return context.env.ASSETS.fetch(context.request);
  }

  const assetUrl = new URL(context.request.url);
  assetUrl.pathname = "/";
  assetUrl.search = "";
  assetUrl.hash = "";

  const assetResponse = await context.env.ASSETS.fetch(new Request(assetUrl.toString(), { method: "GET" }));
  if (assetResponse.status !== 200 || assetResponse.headers.has("location")) {
    return shellUnavailable();
  }

  const headers = new Headers();
  for (const name of PRESERVED_HEADERS) {
    const value = assetResponse.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set("x-robots-tag", "noindex, nofollow");
  headers.delete("location");

  return new Response(assetResponse.body, {
    status: 200,
    headers,
  });
}
