import CalculatorExplainEngine from "./CalculatorExplainEngine";
import CalculatorResultSupport from "./CalculatorResultSupport";
import { getCalculatorExplain } from "../../data/calculatorExplains";
import { getCalculatorInsights } from "../../data/calculatorInsights";
import "./calculator-ui.css";

function CalculatorLayout({
  label,
  title,
  description,
  showHeader = true,
  variant = "default",
  className = "",
  calculatorId,
  form,
  results,
  formula,
}) {
  const insights = calculatorId ? getCalculatorInsights(calculatorId) : null;
  const explain = calculatorId ? getCalculatorExplain(calculatorId) : null;

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
        {formula}
      </div>

      {explain ? <CalculatorExplainEngine explain={explain} /> : null}

      {insights ? (
        <CalculatorResultSupport {...insights} />
      ) : (
        <p className="calc-layout__disclaimer">
          Results are illustrative estimates based on your inputs and assumptions. For
          educational purposes only. Not financial, tax, investment, or loan advice.
          Consult qualified professionals before making financial decisions.
        </p>
      )}
    </section>
  );
}

export default CalculatorLayout;
