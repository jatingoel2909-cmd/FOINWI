/**
 * FOINWI Command Center — search input.
 */

import { forwardRef } from "react";

const SearchInput = forwardRef(function SearchInput(
  { value, onChange, onKeyDown, placeholder = "Search lessons, calculators, journeys…" },
  ref,
) {
  return (
    <div className="fi-search-input">
      <span className="fi-search-input__icon" aria-hidden="true">
        ⌕
      </span>
      <input
        ref={ref}
        type="search"
        className="fi-search-input__field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Search FOINWI"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
      {value ? (
        <button
          type="button"
          className="fi-search-input__clear"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          ×
        </button>
      ) : null}
    </div>
  );
});

export default SearchInput;
