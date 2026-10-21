const MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]{6,}$/u;

export const APPROVED_PRODUCTION_HOSTS = Object.freeze(["foinwi.com", "www.foinwi.com"]);

export function isValidMeasurementId(value) {
  return typeof value === "string" && MEASUREMENT_ID_PATTERN.test(value);
}

export function readMeasurementId(env = import.meta.env) {
  const raw = env?.VITE_GA_MEASUREMENT_ID;
  if (typeof raw !== "string") return "";
  const measurementId = raw.trim();
  return isValidMeasurementId(measurementId) ? measurementId : "";
}

export function isApprovedProductionEnvironment({
  prod = import.meta.env?.PROD,
  mode = import.meta.env?.MODE,
  protocol = "",
  hostname = "",
  measurementId = "",
} = {}) {
  if (prod !== true || mode !== "production") return false;
  if (protocol !== "https:") return false;
  if (!APPROVED_PRODUCTION_HOSTS.includes(hostname)) return false;
  return isValidMeasurementId(measurementId);
}
