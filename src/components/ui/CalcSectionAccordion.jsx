import { useId, useState } from "react";

const MOBILE_MQ = "(max-width: 899px)";

function getIsDesktopViewport() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return !window.matchMedia(MOBILE_MQ).matches;
}

/**
 * Premium progressive-disclosure panel for calculator advanced sections.
 * Children stay mounted while collapsed so form/scenario state is preserved.
 */
function CalcSectionAccordion({
  id,
  title,
  description,
  defaultOpen = false,
  defaultOpenOnDesktop = false,
  children,
  className = "",
}) {
  const reactId = useId();
  const safeId = id || reactId.replace(/:/g, "");
  const triggerId = `calc-section-trigger-${safeId}`;
  const panelId = `calc-section-panel-${safeId}`;

  const [open, setOpen] = useState(() => {
    if (defaultOpen) return true;
    if (defaultOpenOnDesktop) return getIsDesktopViewport();
    return false;
  });

  return (
    <section
      className={`calc-section-accordion${open ? " is-open" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <h3 className="calc-section-accordion__heading">
        <button
          type="button"
          id={triggerId}
          className="calc-section-accordion__trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="calc-section-accordion__title-wrap">
            <span className="calc-section-accordion__title">{title}</span>
            {!open && description ? (
              <span className="calc-section-accordion__desc">{description}</span>
            ) : null}
          </span>
          <span className="calc-section-accordion__icon" aria-hidden="true">
            {open ? "−" : "+"}
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        className="calc-section-accordion__panel"
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
      >
        {children}
      </div>
    </section>
  );
}

export default CalcSectionAccordion;
