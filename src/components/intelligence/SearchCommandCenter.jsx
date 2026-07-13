/**
 * FOINWI Command Center — primary discovery UI for the Intelligence Layer.
 * Uses searchFOINWI() only. No engine changes. No persistence.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFOINWI } from "../../intelligence/search/searchEngine.js";
import SearchOverlay from "./SearchOverlay";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import { flattenSearchGroups } from "./searchCommandHelpers";
import "./search-ui.css";

const RECENT_SEARCHES = ["SIP", "Emergency fund", "Home loan", "Retirement"];
const POPULAR_SEARCHES = [
  "Monthly investment",
  "Tax saving",
  "EMI",
  "Build wealth",
  "Health score",
];

const QUICK_ACTIONS = [
  { id: "learn", label: "Learn", path: "/learn", icon: "📚" },
  { id: "calculator", label: "Calculator", path: "/calculators", icon: "🧮" },
  { id: "journey", label: "Journey", path: "/journeys/build-wealth", icon: "🗺️" },
  { id: "health", label: "Health", path: "/financial-health-score", icon: "❤️" },
];

function SearchCommandCenter({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const response = useMemo(() => {
    if (!query.trim()) return null;
    return searchFOINWI(query, { limit: 24 });
  }, [query]);

  const flatResults = useMemo(
    () => (response ? flattenSearchGroups(response.groupedResults) : []),
    [response],
  );

  const safeActiveIndex =
    flatResults.length > 0 ? Math.min(Math.max(activeIndex, 0), flatResults.length - 1) : -1;

  const getOptionId = useCallback((index) => `fi-search-option-${index}`, []);

  const closeAndReset = useCallback(() => {
    setQuery("");
    setActiveIndex(-1);
    onClose?.();
  }, [onClose]);

  const openPath = useCallback(
    (path) => {
      if (!path) return;
      closeAndReset();
      navigate(path);
    },
    [closeAndReset, navigate],
  );

  const handleSelectResult = useCallback(
    (item) => {
      openPath(item.path);
    },
    [openPath],
  );

  const handlePickSuggestion = useCallback((value) => {
    const next = String(value ?? "")
      .replace(/^Try [“"]|[”"]$/g, "")
      .trim();
    setQuery(next);
    setActiveIndex(next ? 0 : -1);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleQueryChange = (value) => {
    setQuery(value);
    setActiveIndex(value.trim() ? 0 : -1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAndReset();
      return;
    }

    if (!flatResults.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => {
        const start = prev < 0 ? -1 : prev;
        return (start + 1) % flatResults.length;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? flatResults.length - 1 : prev - 1));
      return;
    }

    if (event.key === "Enter" && safeActiveIndex >= 0 && flatResults[safeActiveIndex]) {
      event.preventDefault();
      handleSelectResult(flatResults[safeActiveIndex]);
    }
  };

  useEffect(() => {
    if (!open || safeActiveIndex < 0) return;
    const node = document.getElementById(getOptionId(safeActiveIndex));
    node?.scrollIntoView({ block: "nearest" });
  }, [safeActiveIndex, open, getOptionId]);

  return (
    <SearchOverlay open={open} onClose={closeAndReset}>
      <div className="fi-search-command" onKeyDown={handleKeyDown}>
        <header className="fi-search-command__header">
          <div className="fi-search-command__heading">
            <p className="shrix-section-label">FOINWI Command Center</p>
            <h2 id="fi-search-command-title">What would you like to achieve today?</h2>
          </div>
          <button
            type="button"
            className="fi-search-command__close"
            aria-label="Close command center"
            onClick={closeAndReset}
          >
            Esc
          </button>
        </header>

        <div className="fi-search-command__actions" aria-label="Quick actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className="fi-search-chip"
              onClick={() => openPath(action.path)}
            >
              <span aria-hidden="true">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        <SearchInput
          ref={inputRef}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
        />

        <SearchResults
          query={query}
          response={response}
          activeIndex={safeActiveIndex}
          getOptionId={getOptionId}
          onSelectResult={handleSelectResult}
          recentSearches={RECENT_SEARCHES}
          popularSearches={POPULAR_SEARCHES}
          onPickSuggestion={handlePickSuggestion}
        />
      </div>
    </SearchOverlay>
  );
}

export default SearchCommandCenter;
