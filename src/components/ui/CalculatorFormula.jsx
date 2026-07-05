function CalculatorFormula({ formula, explanation }) {
  return (
    <div className="calc-formula">
      <h3 className="calc-formula__title">Formula</h3>
      <p className="calc-formula__text">{formula}</p>
      {explanation && <p className="calc-formula__note">{explanation}</p>}
    </div>
  );
}

export default CalculatorFormula;
