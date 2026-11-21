import { createContext, useContext } from "react";

export const AnalyticsConsentContext = createContext(null);

export function useAnalyticsConsent() {
  return useContext(AnalyticsConsentContext);
}
