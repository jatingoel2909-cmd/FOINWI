/**
 * Planning entry for a future guarded model step.
 * Phase 4A never changes the production IntelligenceResponse.
 */

import { runIntelligence } from "../engine/runIntelligence.js";
import { buildApprovedAiContext, getApprovedIntent } from "./aiApprovedContext.js";
import { complete } from "./aiProviderAdapter.js";
import { resolveAiFailure } from "./aiFailureFallback.js";
import { routeAiTask } from "./aiTaskRouter.js";
import { validateModelDraft } from "./aiOutputValidator.js";

export function planGuardedIntelligence(request = {}) {
  const response = runIntelligence(request);
  const query = typeof request.query === "string" ? request.query : "";
  const plan = routeAiTask(query);
  const candidateIntentIds = response.intent && response.intent !== "safety-boundary"
    ? [response.intent]
    : [];
  const approvedContext = plan.useAi
    ? buildApprovedAiContext({
      task: plan.task,
      userQuery: query,
      candidateIntentIds,
      surface: request.surface,
    })
    : null;

  return {
    response,
    aiPlan: plan,
    approvedContext,
  };
}

export async function previewGuardedAiInvocation(request = {}) {
  const planned = planGuardedIntelligence(request);
  if (!planned.aiPlan.useAi) {
    return {
      ...planned,
      draftValidation: null,
      provider: { ok: false, draft: null, error: null },
    };
  }

  const provider = await complete({
    task: planned.aiPlan.task,
    userQuery: request.query,
    approvedContext: planned.approvedContext,
    constraints: planned.approvedContext?.constraints,
  });

  if (!provider.ok) {
    return {
      ...planned,
      provider,
      fallback: resolveAiFailure(request, planned.response, provider.error),
      draftValidation: provider.draft ? validateModelDraft(provider.draft, {
        sourceContent: planned.approvedContext?.approvedCopy?.[0]?.simpleAnswer
          ?? getApprovedIntent(planned.response.intent)?.simpleAnswer
          ?? "",
      }) : null,
    };
  }

  return {
    ...planned,
    provider,
    fallback: resolveAiFailure(request, planned.response, { code: "schema-failure" }),
  };
}
