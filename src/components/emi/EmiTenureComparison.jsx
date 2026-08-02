import { formatCurrency } from "../../utils/calculatorFormat";
import { BALANCED_OPTION_NOTE } from "../../utils/emiComparisonEngine";
import EmiComparisonVisuals from "./EmiComparisonVisuals";
import EmiDecisionSummary from "./EmiDecisionSummary";
import "./emi-comparison.css";

function BadgeList({ badges, showBalancedExplain = false }) {
  if (!badges?.length) return null;
  const hasBalanced = badges.includes("Balanced Option");

  return (
    <div className="emi-compare__badge-wrap">
      <ul className="emi-compare__badges">
        {badges.map((badge) => (
          <li
            key={badge}
            className={`emi-compare__badge${
              badge === "Balanced Option" ? " emi-compare__badge--balanced" : ""
            }`}
          >
            {badge}
          </li>
        ))}
      </ul>
      {showBalancedExplain && hasBalanced ? (
        <p className="emi-compare__balanced-explain">{BALANCED_OPTION_NOTE}</p>
      ) : null}
    </div>
  );
}

function ComparisonCard({ option }) {
  return (
    <article
      className={`emi-compare__card${option.isBalanced ? " emi-compare__card--balanced" : ""}`}
    >
      <header className="emi-compare__card-head">
        <h4>{option.tenureLabel}</h4>
        <BadgeList badges={option.badges} showBalancedExplain />
      </header>
      <dl className="emi-compare__stats">
        <div>
          <dt>Monthly EMI</dt>
          <dd>{formatCurrency(option.monthlyEmi)}</dd>
        </div>
        <div>
          <dt>Total Interest</dt>
          <dd>{formatCurrency(option.totalInterest)}</dd>
        </div>
        <div>
          <dt>Total Repayment</dt>
          <dd>{formatCurrency(option.totalRepayment)}</dd>
        </div>
        <div>
          <dt>Completion</dt>
          <dd>{option.completionLabel}</dd>
        </div>
      </dl>
      {option.interestSavedNote ? (
        <p className="emi-compare__saved">{option.interestSavedNote}</p>
      ) : null}
    </article>
  );
}

function EmiTenureComparison({ comparison }) {
  if (!comparison?.valid || !comparison.options?.length) {
    return (
      <section className="emi-compare" aria-label="Compare loan tenures">
        <header className="emi-compare__header">
          <h3>Compare Loan Tenures</h3>
          <p>See how your EMI and total interest change across different repayment periods.</p>
        </header>
        <p className="emi-compare__empty">
          Enter a valid loan amount and interest rate to compare tenures.
        </p>
      </section>
    );
  }

  const { options, highlights, longest } = comparison;

  return (
    <section className="emi-compare" aria-label="Compare loan tenures">
      <header className="emi-compare__header">
        <h3>Compare Loan Tenures</h3>
        <p>See how your EMI and total interest change across different repayment periods.</p>
      </header>

      <p className="emi-compare__highlights">
        Lowest EMI: {highlights.lowestEmi.tenureLabel} (
        {formatCurrency(highlights.lowestEmi.monthlyEmi)})
        {" · "}
        Lowest Total Interest: {highlights.lowestInterest.tenureLabel} (
        {formatCurrency(highlights.lowestInterest.totalInterest)})
        {" · "}
        Fastest Payoff: {highlights.fastest.tenureLabel}
        {" · "}
        Balanced Option: {highlights.balanced.tenureLabel}
      </p>

      <EmiComparisonVisuals comparison={comparison} />

      <div className="emi-compare__table-wrap">
        <table className="emi-compare__table">
          <caption className="sr-only">
            Loan tenure comparison for {comparison.loanType.label}
          </caption>
          <thead>
            <tr>
              <th scope="col">Tenure</th>
              <th scope="col">Monthly EMI</th>
              <th scope="col">Total Interest</th>
              <th scope="col">Total Repayment</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {options.map((option) => (
              <tr
                key={option.id}
                className={option.isBalanced ? "emi-compare__row--balanced" : undefined}
              >
                <th scope="row">
                  <span className="emi-compare__tenure">{option.tenureLabel}</span>
                  <BadgeList badges={option.badges} />
                </th>
                <td>{formatCurrency(option.monthlyEmi)}</td>
                <td>{formatCurrency(option.totalInterest)}</td>
                <td>{formatCurrency(option.totalRepayment)}</td>
                <td>
                  {option.interestSavedNote ? (
                    <span className="emi-compare__saved emi-compare__saved--inline">
                      {option.interestSavedNote}
                    </span>
                  ) : option.id === longest.id ? (
                    <span className="emi-compare__baseline">Longest tenure baseline</span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="emi-compare__cards">
        {options.map((option) => (
          <ComparisonCard key={option.id} option={option} />
        ))}
      </div>

      <EmiDecisionSummary comparison={comparison} />
    </section>
  );
}

export default EmiTenureComparison;
