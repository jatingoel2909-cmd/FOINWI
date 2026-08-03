/**
 * Compact Formula Used block with variable definitions.
 * Visual-only helper — does not affect calculation logic.
 */
function CalculatorFormula({ formula, variables = [], estimateNote, explanation }) {
  return (
    <div className="calc-formula">
      <h3 className="calc-formula__title">Formula Used</h3>
      {formula ? <p className="calc-formula__text">{formula}</p> : null}

      {variables.length > 0 ? (
        <div className="calc-formula__where">
          <p className="calc-formula__where-label">Where:</p>
          <ul className="calc-formula__variables">
            {variables.map((item) => (
              <li key={item.symbol}>
                <span className="calc-formula__symbol">{item.symbol}</span>
                {" = "}
                {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {estimateNote ? <p className="calc-formula__note">{estimateNote}</p> : null}
      {!estimateNote && explanation ? (
        <p className="calc-formula__note">{explanation}</p>
      ) : null}
    </div>
  );
}

export default CalculatorFormula;
