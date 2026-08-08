const toFiniteNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

function normalizeValues(values) {
  if (!values || typeof values !== "object" || Array.isArray(values)) return {};

  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, toFiniteNumber(value)])
  );
}

function normalizeDomain(domain) {
  return typeof domain === "string" ? domain.trim().toLowerCase() : "";
}

/**
 * Builds an in-memory context from calculator values already supplied by a caller.
 * It does not derive financial results, infer user attributes, or persist any values.
 */
export function buildCalculatorContext(context = {}) {
  const inputs = normalizeValues(context.inputs);
  const results = normalizeValues(context.results);
  const years = inputs.years ?? inputs.tenureYears;
  const months = inputs.months ?? inputs.tenureMonths;

  return {
    domain: normalizeDomain(context.domain),
    inputs,
    results,
    derived: {
      tenureMonths: months ?? (years !== null && years !== undefined ? years * 12 : null),
      annualRate: inputs.annualRate ?? inputs.rate ?? null,
      investmentYears: inputs.years ?? inputs.investmentYears ?? null,
      inflationRate: inputs.inflationRate ?? null,
    },
  };
}
