export const CONSENT_STORAGE_KEY = "foinwi.analytics.consent";
export const CONSENT_GRANTED = "granted";
export const CONSENT_DENIED = "denied";
export const CONSENT_UNKNOWN = "unknown";

const STORED_CHOICES = new Set([CONSENT_GRANTED, CONSENT_DENIED]);

export function readStoredConsent(storage) {
  if (!storage || typeof storage.getItem !== "function") return CONSENT_UNKNOWN;
  try {
    const value = storage.getItem(CONSENT_STORAGE_KEY);
    if (STORED_CHOICES.has(value)) return value;
  } catch {
    return CONSENT_UNKNOWN;
  }
  return CONSENT_UNKNOWN;
}

export function writeStoredConsent(storage, consent) {
  if (!STORED_CHOICES.has(consent) || !storage || typeof storage.setItem !== "function") {
    return CONSENT_UNKNOWN;
  }
  try {
    storage.setItem(CONSENT_STORAGE_KEY, consent);
    return consent;
  } catch {
    return CONSENT_UNKNOWN;
  }
}
