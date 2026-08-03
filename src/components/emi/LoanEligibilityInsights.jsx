function LoanEligibilityInsights({ statements }) {
  if (!statements?.length) return null;

  return (
    <aside className="emi-elig__insights" aria-labelledby="emi-elig-insights-title">
      <h4 id="emi-elig-insights-title">Educational insights</h4>
      <ul>
        {statements.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </aside>
  );
}

export default LoanEligibilityInsights;
