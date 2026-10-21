import { CONSENT_GRANTED } from "./consentStore.js";

export function shouldLoadGa4({ consent, production }) {
  return consent === CONSENT_GRANTED && production === true;
}

export function shouldSendPageView({ consent, production, page }) {
  return shouldLoadGa4({ consent, production }) && Boolean(page?.page_path && page?.page_location);
}
