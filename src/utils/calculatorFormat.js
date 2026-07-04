export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDisplayValue(value, format) {
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") {
    return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value)}%`;
  }
  if (format === "years") {
    return `${value} ${value === 1 ? "year" : "years"}`;
  }
  return String(value);
}

export function parseIntegerInput(str) {
  const digits = str.replace(/[^\d]/g, "");
  if (digits === "") return null;
  return parseInt(digits, 10);
}

export function parseDecimalInput(str) {
  const cleaned = str.replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");
  const normalized =
    dotIndex === -1
      ? cleaned
      : cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replace(/\./g, "");
  if (normalized === "" || normalized === ".") return null;
  return parseFloat(normalized);
}

export function getValidationError(value, limits, format) {
  if (value < limits.min) {
    if (format === "currency") return `Minimum is ${formatCurrency(limits.min)}`;
    if (format === "percent") return `Minimum is ${limits.min}%`;
    if (format === "years") return `Minimum is ${limits.min} year${limits.min === 1 ? "" : "s"}`;
    return `Minimum is ${limits.min}`;
  }
  if (value > limits.max) {
    if (format === "currency") return `Maximum is ${formatCurrency(limits.max)}`;
    if (format === "percent") return `Maximum is ${limits.max}%`;
    if (format === "years") return `Maximum is ${limits.max} years`;
    return `Maximum is ${limits.max}`;
  }
  return "";
}

export function parseFormattedInput(raw, format) {
  if (format === "percent") return parseDecimalInput(raw);
  return parseIntegerInput(raw);
}
