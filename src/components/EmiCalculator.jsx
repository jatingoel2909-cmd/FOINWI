import { useState } from "react";
import "./EmiCalculator.css";

const EMI_LIMITS = {
  principal: { min: 100000, max: 10000000, step: 50000 },
  rate: { min: 6, max: 20, step: 0.1 },
  years: { min: 1, max: 30, step: 1 },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDisplayValue(value, format) {
  if (format === "currency") return formatCurrency(value);
  if (format === "percent") {
    return `${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value)}%`;
  }
  return `${value} ${value === 1 ? "year" : "years"}`;
}

function parseIntegerInput(str) {
  const digits = str.replace(/[^\d]/g, "");
  if (digits === "") return null;
  return parseInt(digits, 10);
}

function parseDecimalInput(str) {
  const cleaned = str.replace(/[^\d.]/g, "");
  const dotIndex = cleaned.indexOf(".");
  const normalized =
    dotIndex === -1
      ? cleaned
      : cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replace(/\./g, "");
  if (normalized === "" || normalized === ".") return null;
  return parseFloat(normalized);
}

function getValidationError(value, limits, format) {
  if (value < limits.min) {
    if (format === "currency") return `Minimum is ${formatCurrency(limits.min)}`;
    if (format === "percent") return `Minimum is ${limits.min}%`;
    return `Minimum is ${limits.min} year${limits.min === 1 ? "" : "s"}`;
  }
  if (value > limits.max) {
    if (format === "currency") return `Maximum is ${formatCurrency(limits.max)}`;
    if (format === "percent") return `Maximum is ${limits.max}%`;
    return `Maximum is ${limits.max} years`;
  }
  return "";
}

function calculateEmi(principal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function EmiInputField({ id, label, value, onChange, format, limits }) {
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

    const parsed =
      format === "percent" ? parseDecimalInput(raw) : parseIntegerInput(raw);

    if (parsed === null) return;

    onChange(clamp(parsed, limits.min, limits.max));
    setError(getValidationError(parsed, limits, format));
  };

  const handleBlur = () => {
    setIsFocused(false);

    const parsed =
      format === "percent"
        ? parseDecimalInput(displayValue)
        : parseIntegerInput(displayValue);

    const finalValue = parsed === null ? limits.min : clamp(parsed, limits.min, limits.max);
    onChange(finalValue);
    setDisplayValue(formatDisplayValue(finalValue, format));
    setError(getValidationError(finalValue, limits, format));
  };

  const handleSliderChange = (e) => {
    const nextValue = Number(e.target.value);
    onChange(nextValue);
    setDisplayValue(isFocused ? String(nextValue) : formatDisplayValue(nextValue, format));
    setError(getValidationError(nextValue, limits, format));
  };

  const shownValue = isFocused ? displayValue : formatDisplayValue(value, format);

  return (
    <div className="emi-field">
      <label className="emi-field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`emi-field-input${error ? " emi-field-input--error" : ""}`}
        type="text"
        inputMode={inputMode}
        value={shownValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <input
        className="emi-range"
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={handleSliderChange}
        aria-label={`${label} slider`}
      />
      {error && (
        <p className="emi-field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function EmiResultCard({ label, value, highlight = false }) {
  return (
    <div className={`emi-result-card${highlight ? " emi-result-card--highlight" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmiCalculator({
  defaultPrincipal = 5000000,
  defaultRate = 9,
  defaultYears = 20,
  className = "",
  showHeader = true,
}) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const months = years * 12;
  const emi = calculateEmi(principal, rate, years);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return (
    <section className={`emi-calculator emi-section${className ? ` ${className}` : ""}`}>
      {showHeader && (
        <div className="emi-left">
          <p className="shrix-section-label">EMI Calculator</p>
          <h2>Plan your loan with confidence</h2>
          <p>
            Estimate monthly EMI, total interest, and overall repayment based on
            loan amount, interest rate, and tenure.
          </p>
        </div>
      )}

      <div className="emi-body">
        <div className="emi-form">
          <EmiInputField
            id="emi-principal"
            label="Loan Amount"
            value={principal}
            onChange={setPrincipal}
            format="currency"
            limits={EMI_LIMITS.principal}
          />
          <EmiInputField
            id="emi-rate"
            label="Interest Rate (% yearly)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={EMI_LIMITS.rate}
          />
          <EmiInputField
            id="emi-years"
            label="Loan Tenure (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={EMI_LIMITS.years}
          />
        </div>

        <div className="emi-results">
          <EmiResultCard
            key={formatCurrency(emi)}
            label="Monthly EMI"
            value={formatCurrency(emi)}
            highlight
          />
          <EmiResultCard
            key={formatCurrency(totalInterest)}
            label="Total Interest"
            value={formatCurrency(totalInterest)}
          />
          <EmiResultCard
            key={formatCurrency(totalPayment)}
            label="Total Payment"
            value={formatCurrency(totalPayment)}
          />
        </div>
      </div>
    </section>
  );
}

export default EmiCalculator;
