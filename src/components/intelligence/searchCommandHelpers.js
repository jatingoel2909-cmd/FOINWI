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
