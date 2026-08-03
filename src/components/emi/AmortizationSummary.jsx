import { formatCurrency } from "../../utils/calculatorFormat";
import { buildAmortizationProgress } from "../../utils/amortizationEngine";

function ProgressBar({ label, percent, valueText }) {
  const width = Math.max(0, Math.min(100, percent || 0));
  return (
    <div className="emi-amort__progress-row">
      <div className="emi-amort__progress-label">
        <span>{label}</span>
        <span>{valueText}</span>
      </div>
      <div
        className="emi-amort__progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(width)}
        aria-label={`${label}: ${valueText}`}
      >
        <div className="emi-amort__progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function AmortizationSummary({ schedule, variantLabel }) {
  if (!schedule?.valid) {
    return (
      <aside className="emi-amort__summary" aria-labelledby="emi-amort-summary-title">
        <h4 id="emi-amort-summary-title">Amortization summary</h4>
        <p className="emi-amort__empty">
          Enter a valid loan amount, illustrative rate and tenure to see an educational
          amortization estimate.
        </p>
      </aside>
    );
  }

  const progress = buildAmortizationProgress(schedule);
  const { totals } = schedule;

  return (
    <aside className="emi-amort__summary" aria-labelledby="emi-amort-summary-title">
      <h4 id="emi-amort-summary-title">
        Amortization summary{variantLabel ? ` — ${variantLabel}` : ""}
      </h4>

      <dl className="emi-amort__metrics">
        <div>
          <dt>Total Principal</dt>
          <dd>{formatCurrency(totals.totalPrincipal)}</dd>
        </div>
        <div>
          <dt>Total Interest</dt>
          <dd>{formatCurrency(totals.totalInterest)}</dd>
        </div>
        <div>
          <dt>Total Repayment</dt>
          <dd>{formatCurrency(totals.totalRepayment)}</dd>
        </div>
        <div>
          <dt>Remaining Balance</dt>
          <dd>{formatCurrency(schedule.remainingBalance ?? 0)}</dd>
        </div>
      </dl>

      <div className="emi-amort__progress" aria-label="Loan progress">
        <p className="emi-amort__progress-heading">Loan Progress</p>
        <ProgressBar
          label="Principal share of repayment"
          percent={progress.principalPercent}
          valueText={`${Math.round(progress.principalPercent)}%`}
        />
        <ProgressBar
          label="Interest share of repayment"
          percent={progress.interestPercent}
          valueText={`${Math.round(progress.interestPercent)}%`}
        />
        <ProgressBar
          label="Principal repaid"
          percent={progress.repaidPercent}
          valueText={formatCurrency(progress.repaidPrincipal)}
        />
      </div>
    </aside>
  );
}

export default AmortizationSummary;
