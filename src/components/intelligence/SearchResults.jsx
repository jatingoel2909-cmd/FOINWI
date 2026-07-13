/**
 * FOINWI Command Center — grouped live results + empty states.
 */

import SearchResultCard from "./SearchResultCard";
import { SEARCH_GROUP_ORDER } from "./searchCommandHelpers";

function SearchResults({
  query,
  response,
  activeIndex,
  getOptionId,
  onSelectResult,
  recentSearches,
  popularSearches,
  onPickSuggestion,
}) {
  const hasQuery = Boolean(query.trim());

  if (!hasQuery) {
    return (
      <div className="fi-search-results fi-search-results--empty">
        <div className="fi-search-suggest">
          <h3 className="fi-search-suggest__title">Recent searches</h3>
          <ul className="fi-search-suggest__list">
            {recentSearches.map((item) => (
              <li key={`recent-${item}`}>
                <button type="button" onClick={() => onPickSuggestion(item)}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="fi-search-suggest">
          <h3 className="fi-search-suggest__title">Popular searches</h3>
          <ul className="fi-search-suggest__list">
            {popularSearches.map((item) => (
              <li key={`popular-${item}`}>
                <button type="button" onClick={() => onPickSuggestion(item)}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const grouped = response?.groupedResults ?? {};
  const groups = [
    ...SEARCH_GROUP_ORDER.map((group) => ({
      ...group,
      items: grouped[group.source] ?? [],
    })),
    {
      key: "concepts",
      title: "Concepts",
      items: grouped.concepts ?? [],
    },
  ].filter((group) => group.items.length > 0);

  if (!groups.length) {
    return (
      <div className="fi-search-results">
        <p className="fi-search-results__none">
          No matches yet. Try SIP, EMI, retirement, or tax saving.
        </p>
        {response?.suggestions?.length ? (
          <div className="fi-search-suggest">
            <h3 className="fi-search-suggest__title">Suggestions</h3>
            <ul className="fi-search-suggest__list">
              {response.suggestions.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() =>
                      onPickSuggestion(
                        item.label?.replace(/^Try [“"]|[”"]$/g, "") || item.label,
                      )
                    }
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  let runningIndex = -1;
  const flatCount = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="fi-search-results" role="listbox" aria-label="Search results">
      {groups.map((group) => (
        <div key={group.key} className="fi-search-group">
          <h3 className="fi-search-group__title">{group.title}</h3>
          <div className="fi-search-group__list">
            {group.items.map((item) => {
              runningIndex += 1;
              const index = runningIndex;
              return (
                <SearchResultCard
                  key={item.id}
                  id={getOptionId(index)}
                  item={item}
                  active={index === activeIndex}
                  onSelect={() => onSelectResult(item)}
                />
              );
            })}
          </div>
        </div>
      ))}
      <span className="fi-search-results__meta" aria-live="polite">
        {flatCount} result{flatCount === 1 ? "" : "s"}
      </span>
    </div>
  );
}

export default SearchResults;
