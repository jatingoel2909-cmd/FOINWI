import { BALANCED_OPTION_NOTE } from "../../utils/emiComparisonEngine";

function EmiDecisionSummary({ comparison }) {
  const summary = comparison?.decisionSummary;
  const statements = summary?.statements ?? [];
  const balancedNote = summary?.balancedNote ?? BALANCED_OPTION_NOTE;

  if (!comparison?.valid) {
    return null;
  }

  return (
    <aside className="emi-decision" aria-labelledby="emi-tradeoff-title">
      <h4 id="emi-tradeoff-title">Understanding the Trade-off</h4>

      <div
        className="emi-decision__live"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        {statements.length > 0 ? (
          <ul className="emi-decision__list">
            {statements.map((statement) => (
              <li key={statement}>{statement}</li>
            ))}
          </ul>
        ) : (
          <p className="emi-decision__empty">
            Comparison insights will appear when valid loan inputs are available.
          </p>
        )}
      </div>

      <p className="emi-decision__balanced-note">{balancedNote}</p>

      <p className="emi-compare__disclaimer">
        Educational comparison only. Affordability depends on income, existing obligations,
        and lender criteria — this tool does not assess those factors.
      </p>
    </aside>
  );
}

export default EmiDecisionSummary;
