import { useId, useMemo, useRef, useState } from "react";
import { searchCurrencies } from "../../utils/exchangeRates";

function CurrencyCombobox({ id, label, currencies, value, onChange, disabled = false }) {
  const listboxId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const selected = currencies.find((currency) => currency.code === value);
  const results = useMemo(() => searchCurrencies(currencies, query), [currencies, query]);
  const visibleResults = results.slice(0, 100);

  const choose = (currency) => {
    onChange(currency.code);
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
      } else {
        setActiveIndex((index) => Math.min(index + 1, Math.max(visibleResults.length - 1, 0)));
      }
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(visibleResults.length - 1, 0));
      } else {
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
    }
    if (event.key === "Enter" && open && visibleResults[activeIndex]) {
      event.preventDefault();
      choose(visibleResults[activeIndex]);
    }
    if (event.key === "Escape") {
      setOpen(false);
      setQuery("");
      setActiveIndex(0);
    }
  };

  const shownValue = open ? query : selected ? `${selected.code} — ${selected.name}` : query;

  return (
    <div className="er-combobox">
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        className="er-combobox__input"
        type="text"
        role="combobox"
        value={shownValue}
        placeholder="Search currency or country"
        autoComplete="off"
        disabled={disabled}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-activedescendant={open && visibleResults[activeIndex] ? `${listboxId}-${visibleResults[activeIndex].code}` : undefined}
        onFocus={() => {
          setOpen(true);
          setQuery("");
          setActiveIndex(0);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={onKeyDown}
      />
      <p className="er-sr-only" aria-live="polite">
        {open ? `${results.length} currencies available.` : selected ? `${selected.code} selected.` : ""}
      </p>
      {open && (
        <ul id={listboxId} className="er-combobox__list" role="listbox" aria-label={`${label} results`}>
          {results.length ? (
            visibleResults.map((currency, index) => (
              <li
                id={`${listboxId}-${currency.code}`}
                key={currency.code}
                role="option"
                aria-selected={currency.code === value}
                className={index === activeIndex ? "er-combobox__option er-combobox__option--active" : "er-combobox__option"}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(currency)}
              >
                <strong>{currency.code}</strong>
                <span>{currency.name}</span>
                {currency.territories.length ? <small>{currency.territories.join(", ")}</small> : null}
              </li>
            ))
          ) : (
            <li className="er-combobox__empty" role="status">No supported currencies found.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default CurrencyCombobox;
