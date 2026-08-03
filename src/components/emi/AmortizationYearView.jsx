import { useId, useState } from "react";
import { formatCurrency } from "../../utils/calculatorFormat";

function AmortizationYearView({ yearlyRows, highlightYear, yearRefs }) {
  const [expandedYear, setExpandedYear] = useState(null);
  const baseId = useId();

  if (!yearlyRows?.length) {
    return <p className="emi-amort__empty">No yearly summary is available for these inputs.</p>;
  }

  return (
    <div className="emi-amort__year-wrap">
      <div className="emi-amort__table-wrap emi-amort__table-wrap--desktop">
        <table className="emi-amort__table">
          <caption className="emi-amort__caption">
            Illustrative yearly amortization summary
          </caption>
          <thead>
            <tr>
              <th scope="col">Year</th>
              <th scope="col">EMI Paid</th>
              <th scope="col">Principal Paid</th>
              <th scope="col">Interest Paid</th>
              <th scope="col">Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {yearlyRows.map((row) => (
              <tr
                key={row.year}
                ref={(el) => {
                  if (yearRefs) yearRefs.current[row.year] = el;
                }}
                className={
                  highlightYear === row.year ? "emi-amort__row--highlight" : undefined
                }
                data-year={row.year}
              >
                <th scope="row">{row.year}</th>
                <td>{formatCurrency(row.emiPaid)}</td>
                <td>{formatCurrency(row.principalPaid)}</td>
                <td>{formatCurrency(row.interestPaid)}</td>
                <td>{formatCurrency(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="emi-amort__year-cards" aria-label="Yearly amortization cards">
        {yearlyRows.map((row) => {
          const panelId = `${baseId}-year-${row.year}`;
          const isOpen = expandedYear === row.year || highlightYear === row.year;
          return (
            <article
              key={row.year}
              className={`emi-amort__card${
                highlightYear === row.year ? " emi-amort__card--highlight" : ""
              }`}
              ref={(el) => {
                if (yearRefs) yearRefs.current[`mobile-${row.year}`] = el;
              }}
            >
              <button
                type="button"
                className="emi-amort__card-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setExpandedYear((prev) => (prev === row.year ? null : row.year))
                }
              >
                Year {row.year}
              </button>
              <div id={panelId} hidden={!isOpen} className="emi-amort__card-body">
                <dl className="emi-amort__card-stats">
                  <div>
                    <dt>EMI Paid</dt>
                    <dd>{formatCurrency(row.emiPaid)}</dd>
                  </div>
                  <div>
                    <dt>Principal Paid</dt>
                    <dd>{formatCurrency(row.principalPaid)}</dd>
                  </div>
                  <div>
                    <dt>Interest Paid</dt>
                    <dd>{formatCurrency(row.interestPaid)}</dd>
                  </div>
                  <div>
                    <dt>Remaining Balance</dt>
                    <dd>{formatCurrency(row.remainingBalance)}</dd>
                  </div>
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default AmortizationYearView;
