import { useState } from "react";
import RangeSlider from "./RangeSlider";
import {
  clamp,
  formatDisplayValue,
  getValidationError,
  parseFormattedInput,
} from "../../utils/calculatorFormat";
import "./calculator-ui.css";

function InputField({
  id,
  label,
  value,
  onChange,
  format = "number",
  limits,
  showSlider = true,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(String(value));
  const [error, setError] = useState("");

  const inputMode = format === "percent" ? "decimal" : "numeric";

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(String(value));
    setError("");
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    setDisplayValue(raw);

    const parsed = parseFormattedInput(raw, format);
    if (parsed === null) return;

    onChange(clamp(parsed, limits.min, limits.max));
    setError(getValidationError(parsed, limits, format));
  };

  const handleBlur = () => {
    setIsFocused(false);

    const parsed = parseFormattedInput(displayValue, format);
    const finalValue =
      parsed === null ? limits.min : clamp(parsed, limits.min, limits.max);

    onChange(finalValue);
    setDisplayValue(formatDisplayValue(finalValue, format));
    setError(getValidationError(finalValue, limits, format));
  };

  const handleSliderChange = (e) => {
    const nextValue = Number(e.target.value);
    onChange(nextValue);
    setDisplayValue(
      isFocused ? String(nextValue) : formatDisplayValue(nextValue, format)
    );
    setError(getValidationError(nextValue, limits, format));
  };

  const shownValue = isFocused ? displayValue : formatDisplayValue(value, format);

  return (
    <div className="calc-field">
      <label className="calc-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`calc-field__input${error ? " calc-field__input--error" : ""}`}
        type="text"
        inputMode={inputMode}
        value={shownValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {showSlider && (
        <RangeSlider
          min={limits.min}
          max={limits.max}
          step={limits.step}
          value={value}
          onChange={handleSliderChange}
          ariaLabel={`${label} slider`}
        />
      )}
      {error && (
        <p className="calc-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default InputField;
