import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { readStoredConsent, writeStoredConsent, CONSENT_DENIED, CONSENT_GRANTED, CONSENT_UNKNOWN, CONSENT_STORAGE_KEY } from "../analytics/consentStore.js";
import { shouldLoadGa4, shouldSendPageView } from "../analytics/collectionPolicy.js";
import { createAnalyticsController } from "../analytics/ga4Loader.js";
import { toAnalyticsPageView } from "../analytics/pageView.js";
import { isApprovedProductionEnvironment, readMeasurementId } from "../analytics/productionGate.js";
import { AnalyticsConsentContext } from "./analyticsConsentContext.js";
import "./AnalyticsConsent.css";

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

function trapDialogTab(event, container) {
  if (event.key !== "Tab" || !container) return;
  const focusable = [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => {
    return element.getClientRects().length > 0;
  });
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey) {
    if (active === first || !container.contains(active)) {
      event.preventDefault();
      last.focus();
    }
    return;
  }
  if (active === last || !container.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}

function ChoiceButtons({ onChoose }) {
  return (
    <div className="analytics-consent__actions">
      <button type="button" className="analytics-consent__choice" onClick={() => onChoose(CONSENT_GRANTED)}>
        Accept
      </button>
      <button type="button" className="analytics-consent__choice" onClick={() => onChoose(CONSENT_DENIED)}>
        Reject
      </button>
    </div>
  );
}

function consentStatus(consent) {
  if (consent === CONSENT_GRANTED) return "accepted";
  if (consent === CONSENT_DENIED) return "rejected";
  return "not set";
}

function AnalyticsConsentProvider({ children }) {
  const location = useLocation();
  const dialogRef = useRef(null);
  const openerRef = useRef(null);
  const [consent, setConsent] = useState(() => readStoredConsent(window.localStorage));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics] = useState(() => {
    const measurementId = readMeasurementId();
    return {
      measurementId,
      controller: createAnalyticsController({
        window,
        document,
        measurementId,
      }),
    };
  });

  const production = isApprovedProductionEnvironment({
    prod: import.meta.env.PROD,
    mode: import.meta.env.MODE,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    measurementId: analytics.measurementId,
  });

  const choose = (next) => {
    setConsent(writeStoredConsent(window.localStorage, next));
  };

  const openSettings = useCallback((opener) => {
    openerRef.current = opener || null;
    setSettingsOpen(true);
  }, []);

  const contextValue = useMemo(() => ({
    consent,
    openSettings,
  }), [consent, openSettings]);

  useLayoutEffect(() => {
    const page = toAnalyticsPageView(location.pathname, window.location.origin);
    const load = shouldLoadGa4({ consent, production });
    try {
      analytics.controller.sync({
        collect: load && shouldSendPageView({ consent, production, page }),
        clearCookies: consent === CONSENT_DENIED,
        page: load ? page : null,
      });
    } catch {
      return undefined;
    }
    return undefined;
  }, [analytics, consent, location.pathname, production]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== CONSENT_STORAGE_KEY) return;
      setConsent(readStoredConsent(window.localStorage));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (consent !== CONSENT_UNKNOWN || settingsOpen) return undefined;
    const previous = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "240px";
    return () => {
      document.body.style.paddingBottom = previous;
    };
  }, [consent, settingsOpen]);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const dialog = dialogRef.current;
    const opener = openerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSettingsOpen(false);
        return;
      }
      trapDialogTab(event, dialog);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [settingsOpen]);

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
      {consent === CONSENT_UNKNOWN && !settingsOpen ? (
        <section className="analytics-consent" aria-labelledby="analytics-consent-title">
          <h2 id="analytics-consent-title">Analytics choice</h2>
          <p id="analytics-consent-description">
            FOINWI can use Google Analytics 4 to count visits to public pages.
            This stays off unless you accept. Reject keeps analytics off.
            Calculator values, income, Health Score answers, search text, and Guide Trial content are not sent.
          </p>
          <ChoiceButtons onChoose={choose} />
          <Link className="analytics-consent__link" to="/privacy-policy">
            Privacy policy
          </Link>
        </section>
      ) : null}
      {consent !== CONSENT_UNKNOWN && !settingsOpen ? (
        <button
          type="button"
          className="analytics-consent__launcher"
          aria-haspopup="dialog"
          onClick={(event) => openSettings(event.currentTarget)}
        >
          Privacy settings
        </button>
      ) : null}
      {settingsOpen ? (
        <div
          className="analytics-consent__backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSettingsOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="analytics-consent__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="analytics-settings-title"
            aria-describedby="analytics-settings-status"
            tabIndex={-1}
          >
            <h2 id="analytics-settings-title">Privacy settings</h2>
            <p id="analytics-settings-status" role="status">
              Current choice: {consentStatus(consent)}. You can accept or reject analytics here.
              Choosing Reject withdraws an earlier acceptance.
              {production
                ? " Analytics can load on this production website for public pages after you accept."
                : " This browser is not sending analytics."}
            </p>
            <ChoiceButtons onChoose={choose} />
            <p>
              Reject stops further collection in this browser and clears analytics cookies this site can remove.
              It does not erase data Google may already have received. How long Google keeps that data depends on
              the Google Analytics retention settings, which this website cannot enforce.
            </p>
            <p>
              <Link className="analytics-consent__link" to="/privacy-policy" onClick={() => setSettingsOpen(false)}>
                Privacy policy
              </Link>
            </p>
            <button type="button" className="analytics-consent__close" onClick={() => setSettingsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </AnalyticsConsentContext.Provider>
  );
}

export default AnalyticsConsentProvider;
