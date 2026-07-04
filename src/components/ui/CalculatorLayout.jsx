import "./calculator-ui.css";

function CalculatorLayout({
  label,
  title,
  description,
  showHeader = true,
  variant = "default",
  className = "",
  form,
  results,
}) {
  return (
    <section
      className={`calc-layout calc-layout--${variant}${className ? ` ${className}` : ""}`}
    >
      {showHeader && (
        <div className="calc-layout__header">
          <p className="shrix-section-label">{label}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      )}

      <div className="calc-layout__body">
        <div className="calc-layout__form">{form}</div>
        <div className="calc-layout__results">{results}</div>
      </div>
    </section>
  );
}

export default CalculatorLayout;
