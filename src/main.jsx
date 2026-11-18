import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/global.css";
import "./styles/polish.css";
import "./styles/mobile-touch.css";
import "./index.css";
import App from "./App.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import { PilotHydrationContext } from "./pilot/PilotHydrationContext.js";
import { isPilotRoute, stripPilotHtmlSuffix } from "./pilot/pilotRoutes.js";

const rootElement = document.getElementById("root");

function readPilotLocation() {
  const stripped = stripPilotHtmlSuffix(window.location.pathname);
  if (stripped !== window.location.pathname) {
    const nextUrl = `${stripped}${window.location.search}${window.location.hash}`;
    window.history.replaceState(window.history.state, "", nextUrl);
  }
  return stripped;
}

const locationPath = readPilotLocation();
const insightDate = rootElement?.dataset.foinwiInsightDate || null;
const canHydrate = Boolean(
  rootElement?.dataset.foinwiHydrate === "1"
  && insightDate
  && isPilotRoute(locationPath)
  && rootElement.childElementCount > 0,
);

const pilotValue = canHydrate
  ? { route: locationPath, insightDate }
  : { route: null, insightDate: null };

const tree = (
  <StrictMode>
    <PilotHydrationContext.Provider value={pilotValue}>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </PilotHydrationContext.Provider>
  </StrictMode>
);

if (canHydrate) {
  hydrateRoot(rootElement, tree);
} else {
  createRoot(rootElement).render(tree);
}
