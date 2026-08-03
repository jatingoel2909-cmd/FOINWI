import { formatCurrency } from "../../utils/calculatorFormat";

function LoanEligibilitySummary({ result }) {
  if (!result?.valid) {
    return (
      <aside className="emi-elig__summary" aria-labelledby="emi-elig-summary-title">
        <h4 id="emi-elig-summary-title">Illustrative eligibility estimate</h4>
        <p className="emi-elig__empty">
          Enter a valid monthly income, illustrative interest rate and preferred tenure to see an
          educational eligibility estimate.
        </p>
      </aside>
    );
  }

  return (
    <aside className="emi-elig__summary" aria-labelledby="emi-elig-summary-title">
      <h4 id="emi-elig-summary-title">Illustrative eligibility estimate</h4>

      <dl
        className="emi-elig__metrics"
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <dt>Estimated eligible loan amount</dt>
          <dd>{formatCurrency(result.estimatedEligibleLoan)}</dd>
        </div>
        <div>
          <dt>Estimated available EMI</dt>
          <dd>{formatCurrency(result.estimatedAvailableEmi)}</dd>
        </div>
        <div>
          <dt>Combined monthly income</dt>
          <dd>{formatCurrency(result.combinedMonthlyIncome)}</dd>
        </div>
        <div>
          <dt>Existing monthly obligations</dt>
          <dd>{formatCurrency(result.existingMonthlyObligations)}</dd>
        </div>
        {result.estimatedPropertyBudget != null ? (
          <div>
            <dt>Estimated property / purchase budget</dt>
            <dd>{formatCurrency(result.estimatedPropertyBudget)}</dd>
          </div>
        ) : null}
        <div>
          <dt>FOIR assumption used</dt>
          <dd>{result.foirPercent}%</dd>
        </div>
      </dl>

      <div
        className="emi-elig__capacity"
        aria-label={`Assumed EMI capacity: ${result.capacityLabel}`}
      >
        <p className="emi-elig__capacity-label">{result.capacityLabel}</p>
        {result.capacityDetail ? (
          <p className="emi-elig__capacity-detail">{result.capacityDetail}</p>
        ) : null}
        <p className="emi-elig__capacity-note">{result.capacityNote}</p>
      </div>
    </aside>
  );
}

export default LoanEligibilitySummary;
