/**
 * Safe publication controls for features that must not ship unfinished data.
 *
 * ENABLE_LENDER_COMPARISON:
 * - false (default): hide named-lender scenarios and development placeholder rates
 * - true: render the illustrative lender comparison UI for local/dev review
 *
 * Override at build time with VITE_ENABLE_LENDER_COMPARISON=true when needed.
 */

function readBooleanFlag(envValue, defaultValue) {
  if (envValue === undefined || envValue === null || envValue === "") {
    return defaultValue;
  }
  const normalized = String(envValue).trim().toLowerCase();
  if (normalized === "true" || normalized === "1") return true;
  if (normalized === "false" || normalized === "0") return false;
  return defaultValue;
}

/** Default false for production-safe publication. */
export const ENABLE_LENDER_COMPARISON = readBooleanFlag(
  import.meta.env?.VITE_ENABLE_LENDER_COMPARISON,
  false,
);
