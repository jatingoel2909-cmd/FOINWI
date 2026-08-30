/**
 * Approved generative-AI tasks. FOINWI remains the financial authority.
 * No generic CHAT task.
 */

export const AI_DRAFT_SCHEMA_VERSION = "1.0.0";

export const AI_TASKS = Object.freeze(["CLASSIFY", "SIMPLIFY", "CLARIFY"]);

export const AI_ROUTING_PRINCIPLES = Object.freeze([
  "DETERMINISTIC_FIRST",
  "AI_ONLY_WHEN_USEFUL",
  "NO_DUPLICATE_MODEL_CALL",
  "NO_MODEL_FOR_SIMPLE_NAVIGATION",
]);

export const MAX_CLARIFY_TEXT_LENGTH = 160;
export const MAX_SIMPLIFY_TEXT_LENGTH = 600;
export const MAX_CLASSIFY_TEXT_LENGTH = 80;
export const MAX_CANDIDATE_INTENTS = 5;
export const MAX_APPROVED_QUERY_LENGTH = 400;

export function isApprovedAiTask(task) {
  return AI_TASKS.includes(task);
}
