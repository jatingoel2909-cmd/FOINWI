import { isApprovedIntelligencePath } from "../engine/intelligenceAllowlist.js";
import { getApprovedIntentIds } from "./aiApprovedContext.js";
import { FORBIDDEN_DRAFT_KEYS } from "./aiDraftTypes.js";
import {
  AI_DRAFT_SCHEMA_VERSION,
  MAX_CANDIDATE_INTENTS,
  MAX_CLARIFY_TEXT_LENGTH,
  MAX_CLASSIFY_TEXT_LENGTH,
  MAX_SIMPLIFY_TEXT_LENGTH,
  isApprovedAiTask,
} from "./aiTaskTypes.js";

const URL_PATTERN = /https?:\/\/|\bwww\./iu;
const PATH_PATTERN = /(?:^|\s)\/[a-z0-9-]{2,}(?:\/[a-z0-9-]+)*/iu;
const PRODUCT_PATTERN = /\b(buy|sell|recommend)\b.*\b(stock|share|mutual fund|fund|crypto)\b|\b(best|top)\b.*\b(stock|fund|mutual fund)\b/iu;
const GUARANTEE_PATTERN = /\b(guarantee|guaranteed|assured|certain)\b.*\b(\d+\s*%|return|profit)\b/iu;
const LENDER_PATTERN = /\b(bank|lender)\b.*\b(approve|approval|sanction)\b/iu;
const TAX_EVASION_PATTERN = /\b(hide|avoid|evade|escape)\b.*\btax\b/iu;
const BYPASS_PATTERN = /\bignore (?:previous )?instructions\b|\bbypass safety\b|\breveal (?:the )?system prompt\b/iu;
const PROVIDER_LEAK_PATTERN = /\b(openai|anthropic|gemini|claude|gpt-|api key)\b/iu;
const ADVICE_PATTERN = /\byou should invest\b|\binvest ₹\s*\d+/iu;
const CALCULATOR_CLAIM_PATTERN = /\b(emi is|tax due is|your returns? (?:are|will be)|maturity value is)\b/iu;

function fail(reason) {
  return { ok: false, reason };
}

export function validateModelDraft(draft, { sourceContent = "" } = {}) {
  if (!draft || typeof draft !== "object" || Array.isArray(draft)) {
    return fail("malformed-draft");
  }
  if (draft.schemaVersion !== AI_DRAFT_SCHEMA_VERSION) return fail("invalid-schema");
  if (!isApprovedAiTask(draft.task)) return fail("unsupported-task");
  if (FORBIDDEN_DRAFT_KEYS.some((key) => Object.hasOwn(draft, key))) return fail("authoritative-fields");
  if (!Array.isArray(draft.candidateIntentIds) || !Array.isArray(draft.flags)) return fail("malformed-draft");
  if (typeof draft.text !== "string") return fail("malformed-draft");
  if (!Number.isFinite(draft.confidenceScore) || draft.confidenceScore < 0 || draft.confidenceScore > 100) {
    return fail("invalid-confidence");
  }

  const approvedIds = new Set(getApprovedIntentIds());
  if (draft.candidateIntentIds.length > MAX_CANDIDATE_INTENTS) return fail("too-many-intents");
  if (draft.candidateIntentIds.some((id) => !approvedIds.has(id))) return fail("unknown-intent");

  const text = draft.text.trim();
  if (URL_PATTERN.test(text) || URL_PATTERN.test(draft.candidateIntentIds.join(" "))) return fail("arbitrary-url");
  if (PATH_PATTERN.test(text)) {
    const possiblePath = text.match(/\/[a-z0-9-]+(?:\/[a-z0-9-]+)*/iu)?.[0];
    if (possiblePath && !isApprovedIntelligencePath(possiblePath)) return fail("unknown-route");
    if (possiblePath) return fail("draft-must-not-include-routes");
  }
  if (PRODUCT_PATTERN.test(text)) return fail("product-recommendation");
  if (GUARANTEE_PATTERN.test(text)) return fail("guaranteed-return");
  if (LENDER_PATTERN.test(text)) return fail("lender-approval");
  if (TAX_EVASION_PATTERN.test(text)) return fail("illegal-tax");
  if (BYPASS_PATTERN.test(text)) return fail("bypass-attempt");
  if (PROVIDER_LEAK_PATTERN.test(text)) return fail("provider-leak");
  if (ADVICE_PATTERN.test(text) || CALCULATOR_CLAIM_PATTERN.test(text)) return fail("authoritative-finance");

  if (draft.task === "CLASSIFY") {
    if (!draft.candidateIntentIds.length) return fail("missing-intent");
    if (text.length > MAX_CLASSIFY_TEXT_LENGTH) return fail("classify-text-too-long");
  }

  if (draft.task === "CLARIFY") {
    if (!text || text.length > MAX_CLARIFY_TEXT_LENGTH) return fail("clarify-length");
    if (!text.endsWith("?")) return fail("clarify-not-a-question");
    if (draft.candidateIntentIds.length === 0) return fail("missing-intent");
  }

  if (draft.task === "SIMPLIFY") {
    if (!sourceContent || typeof sourceContent !== "string") return fail("missing-source-copy");
    if (!text || text.length > MAX_SIMPLIFY_TEXT_LENGTH) return fail("simplify-length");
    if (text.length > sourceContent.length * 2 + 40) return fail("simplify-exceeds-source");
  }

  return { ok: true, reason: null };
}
