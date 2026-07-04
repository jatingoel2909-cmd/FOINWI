function RangeSlider({ min, max, step, value, onChange, ariaLabel, className = "" }) {
  return (
    <input
      className={`calc-range${className ? ` ${className}` : ""}`}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
    />
  );
}

export default RangeSlider;
