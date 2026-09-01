import {
  AI_DRAFT_SCHEMA_VERSION,
  AI_TASKS,
  MAX_CANDIDATE_INTENTS,
  MAX_CLARIFY_TEXT_LENGTH,
  MAX_CLASSIFY_TEXT_LENGTH,
  MAX_SIMPLIFY_TEXT_LENGTH,
} from "../../../src/intelligence/ai/aiTaskTypes.js";

export const OPENAI_DRAFT_JSON_SCHEMA = Object.freeze({
  type: "object",
  additionalProperties: false,
  required: ["schemaVersion", "task", "candidateIntentIds", "text", "confidenceScore", "flags"],
  properties: {
    schemaVersion: { type: "string", enum: [AI_DRAFT_SCHEMA_VERSION] },
    task: { type: "string", enum: [...AI_TASKS] },
    candidateIntentIds: {
      type: "array",
      items: { type: "string" },
      maxItems: MAX_CANDIDATE_INTENTS,
    },
    text: {
      type: "string",
      maxLength: Math.max(MAX_CLARIFY_TEXT_LENGTH, MAX_CLASSIFY_TEXT_LENGTH, MAX_SIMPLIFY_TEXT_LENGTH),
    },
    confidenceScore: { type: "number", minimum: 0, maximum: 100 },
    flags: {
      type: "array",
      items: { type: "string" },
    },
  },
});

export function getOpenAiTextFormat() {
  return {
    format: {
      type: "json_schema",
      name: "foinwi_normalized_model_draft",
      strict: true,
      schema: OPENAI_DRAFT_JSON_SCHEMA,
    },
  };
}
