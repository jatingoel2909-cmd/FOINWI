import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import { AppShell } from "./App.jsx";
import { getDateKey } from "./intelligence/insight/insightHelpers.js";
import { PilotHydrationContext } from "./pilot/PilotHydrationContext.js";
import { isPilotRoute } from "./pilot/pilotRoutes.js";

/**
 * Renders one approved route with the same component tree the browser hydrates.
 * MemoryRouter supplies the URL without touching window.history.
 */
export function renderPilotRoute(routePath) {
  if (!isPilotRoute(routePath)) {
    throw new Error(`Refusing to prerender a route outside the pilot: ${routePath}`);
  }

  const insightDate = getDateKey(new Date());
  const html = renderToString(
    <StrictMode>
      <PilotHydrationContext.Provider value={{ route: routePath, insightDate }}>
        <AppErrorBoundary>
          <MemoryRouter initialEntries={[routePath]}>
            <AppShell />
          </MemoryRouter>
        </AppErrorBoundary>
      </PilotHydrationContext.Provider>
    </StrictMode>,
  );

  if (/<script\b/i.test(html)) {
    throw new Error(`Pilot HTML for ${routePath} contains a script element`);
  }

  return { html, insightDate };
}
