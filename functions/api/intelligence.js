import { parseIntelligenceApiRequest } from "../../src/intelligence/engine/intelligenceApiContract.js";
import { isValidIntelligenceResponse } from "../../src/intelligence/engine/intelligenceTypes.js";
import { isApprovedIntelligencePath } from "../../src/intelligence/engine/intelligenceAllowlist.js";
import { runIntelligence } from "../../src/intelligence/engine/runIntelligence.js";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function errorResponse(status, code, message) {
  return json({ error: { code, message } }, status);
}

function methodNotAllowed() {
  return errorResponse(405, "method-not-allowed", "Use POST.");
}

async function readJsonBody(request) {
  try {
    return { ok: true, body: await request.json() };
  } catch {
    return { ok: false };
  }
}

export async function onRequestPost({ request }) {
  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) {
    return errorResponse(400, "invalid-request", "Request body must be valid JSON.");
  }

  const parsed = parseIntelligenceApiRequest(parsedBody.body);
  if (!parsed.ok) {
    return errorResponse(400, parsed.code, parsed.message);
  }

  let result;
  try {
    result = runIntelligence(parsed.request);
  } catch {
    return errorResponse(500, "server-error", "Intelligence is temporarily unavailable.");
  }

  if (!isValidIntelligenceResponse(result, isApprovedIntelligencePath)) {
    return errorResponse(500, "invalid-response", "Intelligence is temporarily unavailable.");
  }

  return json(result, 200);
}

export function onRequest({ request }) {
  if (request.method === "POST") {
    return onRequestPost({ request });
  }
  return methodNotAllowed();
}
