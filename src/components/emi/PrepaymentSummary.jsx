import { formatCurrency } from "../../utils/calculatorFormat";
import { formatMonthsAsYears } from "../../utils/prepaymentEngine";

function PrepaymentSummary({ result }) {
  if (!result?.valid) {
    return (
      <aside className="emi-prepay__summary" aria-labelledby="emi-prepay-summary-title">
        <h4 id="emi-prepay-summary-title">Prepayment summary</h4>
        <p className="emi-prepay__empty">
          Enter a valid extra payment or lump-sum amount to see an educational prepayment
          estimate.
        </p>
      </aside>
    );
  }

  const statements = result.summaryStatements ?? [];

  return (
    <aside className="emi-prepay__summary" aria-labelledby="emi-prepay-summary-title">
      <h4 id="emi-prepay-summary-title">Prepayment summary</h4>

      <dl className="emi-prepay__metrics">
        {result.mode === "monthly" ? (
          <>
            <div>
              <dt>New payoff period</dt>
              <dd>{formatMonthsAsYears(result.newPayoffMonths)}</dd>
            </div>
            <div>
              <dt>Months saved</dt>
              <dd>{result.monthsSaved}</dd>
            </div>
            <div>
              <dt>Interest saved</dt>
              <dd>{formatCurrency(result.interestSaved)}</dd>
            </div>
            <div>
              <dt>Total repayment difference</dt>
              <dd>{formatCurrency(result.totalRepaymentDifference)}</dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt>Remaining principal after prepayment</dt>
              <dd>{formatCurrency(result.remainingPrincipal)}</dd>
            </div>
            <div>
              <dt>New tenure after prepayment</dt>
              <dd>{formatMonthsAsYears(result.newTenureMonths)}</dd>
            </div>
            <div>
              <dt>Interest saved</dt>
              <dd>{formatCurrency(result.interestSaved)}</dd>
            </div>
            <div>
              <dt>Remaining interest after prepayment</dt>
              <dd>{formatCurrency(result.remainingInterest)}</dd>
            </div>
          </>
        )}
      </dl>

      <div
        className="emi-prepay__statements"
        aria-live="polite"
        aria-atomic="true"
        role="status"
      >
        <ul>
          {statements.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default PrepaymentSummary;
