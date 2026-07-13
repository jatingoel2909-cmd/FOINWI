/**
 * FOINWI Command Center — search result card.
 */

import { Link } from "react-router-dom";

const TYPE_ICONS = {
  concept: "💡",
  calculator: "🧮",
  learning: "📚",
  journey: "🗺️",
  mission: "🎯",
  health: "❤️",
  guide: "🧭",
  insight: "✨",
};

function formatReason(item) {
  if (item.matchedOn?.length) {
    const label = item.matchedOn[0].replace(/-/g, " ");
    return `Matched on ${label}`;
  }
  if (item.category) return `In ${item.category}`;
  if (item.type) return `Explore ${item.type}`;
  return "Educational discovery on FOINWI";
}

function SearchResultCard({ item, active = false, id, onSelect }) {
  if (!item?.path) return null;

  const icon = TYPE_ICONS[item.type] ?? "➡️";
  const description = item.description || item.highlight || "";
  const reason = formatReason(item);

  return (
    <Link
      id={id}
      to={item.path}
      className={`fi-search-card${active ? " fi-search-card--active" : ""}`}
      role="option"
      aria-selected={active}
      onClick={onSelect}
    >
      <span className="fi-search-card__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="fi-search-card__body">
        <h4 className="fi-search-card__title">{item.title}</h4>
        {description ? <p className="fi-search-card__desc">{description}</p> : null}
        <p className="fi-search-card__reason">{reason}</p>
      </div>
      <span className="fi-search-card__open">Open →</span>
    </Link>
  );
}

export default SearchResultCard;
