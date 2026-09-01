/**
 * Shadow sinks are internal only.
 * Default is no-op. Memory is allowed for tests. No disk, database, analytics, or external automation.
 */

export const SHADOW_SINK_KINDS = Object.freeze(["none", "memory"]);

export function resolveShadowSinkKind(env = {}) {
  const value = String(env?.FOINWI_AI_SHADOW_SINK ?? "none").trim().toLowerCase();
  return value === "memory" ? "memory" : "none";
}

function createNoopShadowSink() {
  return {
    kind: "none",
    write() {},
    list() {
      return [];
    },
    clear() {},
  };
}

export function createMemoryShadowSink() {
  const records = [];
  return {
    kind: "memory",
    write(review) {
      records.push(review);
    },
    list() {
      return [...records];
    },
    clear() {
      records.length = 0;
    },
  };
}

export function createShadowSink(kind = "none") {
  return kind === "memory" ? createMemoryShadowSink() : createNoopShadowSink();
}
