import { formatMonthsAsYears } from "../../utils/prepaymentEngine";

function PrepaymentTimeline({ timeline }) {
  if (!timeline) return null;

  const {
    originalBarPercent,
    newBarPercent,
    originalMonths,
    newMonths,
    monthsReduced,
    yearsReducedLabel,
  } = timeline;

  return (
    <div
      className="emi-prepay__timeline"
      aria-labelledby="emi-prepay-timeline-title"
      role="group"
    >
      <h4 id="emi-prepay-timeline-title">Remaining principal timeline</h4>
      <p className="emi-prepay__timeline-lead">
        Compare the original schedule length with the estimated prepaid payoff period.
      </p>

      <div className="emi-prepay__bars">
        <div className="emi-prepay__bar-row">
          <div className="emi-prepay__bar-label">
            <span>Original Loan</span>
            <span className="emi-prepay__bar-meta">{formatMonthsAsYears(originalMonths)}</span>
          </div>
          <div
            className="emi-prepay__track"
            role="img"
            aria-label={`Original loan tenure ${formatMonthsAsYears(originalMonths)}`}
          >
            <div
              className="emi-prepay__fill emi-prepay__fill--original"
              style={{ width: `${originalBarPercent}%` }}
            />
          </div>
        </div>

        <div className="emi-prepay__bar-row">
          <div className="emi-prepay__bar-label">
            <span>New Loan</span>
            <span className="emi-prepay__bar-meta">{formatMonthsAsYears(newMonths)}</span>
          </div>
          <div
            className="emi-prepay__track"
            role="img"
            aria-label={`Estimated new loan tenure ${formatMonthsAsYears(newMonths)}`}
          >
            <div
              className="emi-prepay__fill emi-prepay__fill--new"
              style={{ width: `${newBarPercent}%` }}
            />
          </div>
        </div>
      </div>

      <p className="emi-prepay__years-reduced">
        {monthsReduced > 0
          ? `${yearsReducedLabel}.`
          : "No years reduced in this estimate."}
      </p>
    </div>
  );
}

export default PrepaymentTimeline;
