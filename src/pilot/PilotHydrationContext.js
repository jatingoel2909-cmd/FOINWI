import { createContext } from "react";

/**
 * The build stamps one UTC date onto a pilot page so the daily insight
 * selected during prerender matches the first client render.
 * Other routes and later navigations leave this empty.
 */
export const PilotHydrationContext = createContext({
  route: null,
  insightDate: null,
});
