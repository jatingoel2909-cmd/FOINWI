/**
 * FOINWI Command Center — small UI helpers (non-component).
 */

export const SEARCH_GROUP_ORDER = [
  { key: "learning", title: "Learning", source: "learning" },
  { key: "calculators", title: "Calculator", source: "calculators" },
  { key: "journeys", title: "Journey", source: "journeys" },
  { key: "health", title: "Health", source: "health" },
  { key: "insights", title: "Insight", source: "insights" },
];

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getFocusableElements(container) {
  if (!container) return [];

  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => {
    if (element.hasAttribute("disabled") || element.getAttribute("aria-hidden") === "true") {
      return false;
    }

    return element.getClientRects().length > 0;
  });
}

export function trapTabKey(event, container) {
  if (event.key !== "Tab" || !container) return;

  const focusable = getFocusableElements(container);
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

export function flattenSearchGroups(groupedResults) {
  const flat = [];
  const seen = new Set();

  const pushAll = (items = []) => {
    items.forEach((item) => {
      if (!item?.id || seen.has(item.id)) return;
      seen.add(item.id);
      flat.push(item);
    });
  };

  SEARCH_GROUP_ORDER.forEach((group) => {
    pushAll(groupedResults?.[group.source]);
  });
  pushAll(groupedResults?.concepts);

  return flat;
}
