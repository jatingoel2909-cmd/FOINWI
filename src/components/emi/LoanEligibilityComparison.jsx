import { formatCurrency } from "../../utils/calculatorFormat";

function LoanEligibilityComparison({ comparison }) {
  if (!comparison?.valid || !comparison.options?.length) {
    return null;
  }

  return (
    <section className="emi-elig__compare" aria-labelledby="emi-elig-compare-title">
      <h4 id="emi-elig-compare-title">Illustrative tenure comparison</h4>
      <p className="emi-elig__compare-lead">
        Compare how estimated eligibility and borrowing cost may change across sensible tenures for
        the selected loan type. Markers describe calculations within this displayed set only.
      </p>

      <div className="emi-elig__cards">
        {comparison.options.map((option) => (
          <article
            key={option.id}
            className="emi-elig__card"
            aria-label={`${option.tenureLabel} eligibility scenario`}
          >
            <h5>{option.tenureLabel}</h5>
            {option.markers?.length ? (
              <ul className="emi-elig__markers">
                {option.markers.map((marker) => (
                  <li key={marker} className="emi-elig__marker">
                    {marker}
                  </li>
                ))}
              </ul>
            ) : null}
            <dl className="emi-elig__card-stats">
              <div>
                <dt>Estimated available EMI</dt>
                <dd>{formatCurrency(option.estimatedAvailableEmi)}</dd>
              </div>
              <div>
                <dt>Estimated eligible loan</dt>
                <dd>{formatCurrency(option.estimatedEligibleLoan)}</dd>
              </div>
              <div>
                <dt>Estimated total interest</dt>
                <dd>{formatCurrency(option.estimatedTotalInterest)}</dd>
              </div>
              <div>
                <dt>Estimated total repayment</dt>
                <dd>{formatCurrency(option.estimatedTotalRepayment)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LoanEligibilityComparison;
