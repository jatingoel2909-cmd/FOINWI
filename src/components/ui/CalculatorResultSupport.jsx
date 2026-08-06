import { Link } from "react-router-dom";
import { CALCULATOR_DISCLAIMER } from "../../data/calculatorInsights";

function FormulaWhereBlock({ formula, formulaLabel = "Formula used", variables, estimateNote }) {
  if (!formula) return null;

  return (
    <div className="calc-result-support__formula-block">
      <p className="calc-result-support__label">{formulaLabel}</p>
      <p className="calc-result-support__formula">{formula}</p>

      {variables?.length > 0 ? (
        <div className="calc-result-support__where">
          <p className="calc-result-support__where-label">Where:</p>
          <ul className="calc-result-support__variables">
            {variables.map((item) => (
              <li key={item.symbol}>
                <span className="calc-result-support__symbol">{item.symbol}</span>
                {" = "}
                {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {estimateNote ? (
        <p className="calc-result-support__estimate-note">{estimateNote}</p>
      ) : null}
    </div>
  );
}

function CalculatorResultSupport({ howCalculated, meaning, relatedTools }) {
  return (
    <aside className="calc-result-support" aria-label="Calculator result guidance">
      <div className="calc-result-support__grid">
        <article className="calc-result-support__card">
          <h3>How was this calculated?</h3>
          <FormulaWhereBlock
            formula={howCalculated.formula}
            formulaLabel={howCalculated.formulaLabel}
            variables={howCalculated.variables}
            estimateNote={howCalculated.estimateNote}
          />
        </article>

        <article className="calc-result-support__card">
          <h3>What this result means</h3>
          <p>{meaning}</p>
        </article>
      </div>

      {relatedTools?.length > 0 && (
        <article className="calc-result-support__card calc-result-support__card--wide">
          <h3>Next useful tools</h3>
          <div className="calc-result-support__links">
            {relatedTools.map((tool) => (
              <Link key={tool.path} to={tool.path} className="calc-result-support__link">
                {tool.title} →
              </Link>
            ))}
          </div>
        </article>
      )}

      <p className="calc-result-support__disclaimer">{CALCULATOR_DISCLAIMER}</p>
    </aside>
  );
}

export default CalculatorResultSupport;
