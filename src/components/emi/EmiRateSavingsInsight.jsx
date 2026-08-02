import "./emi-lender-comparison.css";

function EmiRateSavingsInsight({ summary }) {
  if (!summary) return null;

  return (
    <aside className="emi-lender__savings" aria-labelledby="emi-rate-savings-title">
      <h4 id="emi-rate-savings-title" className="emi-lender__savings-title">
        Rate difference insight
      </h4>
      <p className="emi-lender__savings-statement" aria-live="polite">
        {summary.statement}
      </p>
      <p className="emi-lender__savings-secondary">{summary.secondary}</p>
    </aside>
  );
}

export default EmiRateSavingsInsight;
