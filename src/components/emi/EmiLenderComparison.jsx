import { useEffect, useMemo, useState } from "react";
import { ENABLE_LENDER_COMPARISON } from "../../config/featureFlags";
import { INDIAN_LENDERS } from "../../data/lenders/indianLenders";
import { formatCurrency } from "../../utils/calculatorFormat";
import {
  buildLenderComparisons,
  buildLenderSavingsSummary,
  ILLUSTRATIVE_RATE_DISCLAIMER,
} from "../../utils/lenderComparisonEngine";
import EmiRateSavingsInsight from "./EmiRateSavingsInsight";
import "./emi-lender-comparison.css";

const PROCESSING_NOTE =
  "Processing experience varies by applicant, branch, location, documents and lender workload.";

function formatRate(rate) {
  if (!Number.isFinite(rate)) return "—";
  return `${rate.toFixed(2)}%`;
}

function formatDiff(amount) {
  if (!Number.isFinite(amount) || amount === 0) return "Same as lowest-rate scenario";
  return `+${formatCurrency(amount)} vs lowest-rate scenario`;
}

function LenderCard({ entry }) {
  return (
    <article className="emi-lender__card" aria-label={`${entry.name} illustrative scenario`}>
      <header className="emi-lender__card-head">
        <h4>{entry.name}</h4>
        <p className="emi-lender__category">{entry.lenderType}</p>
      </header>
      <dl className="emi-lender__stats">
        <div>
          <dt>Illustrative rate</dt>
          <dd>{formatRate(entry.annualRate)}</dd>
        </div>
        <div>
          <dt>Estimated EMI</dt>
          <dd>{formatCurrency(entry.monthlyEmi)}</dd>
        </div>
        <div>
          <dt>Estimated total interest</dt>
          <dd>{formatCurrency(entry.totalInterest)}</dd>
        </div>
        <div>
          <dt>Estimated total repayment</dt>
          <dd>{formatCurrency(entry.totalRepayment)}</dd>
        </div>
        <div>
          <dt>Difference from lowest-rate scenario</dt>
          <dd>
            <span className="emi-lender__diff-emi">{formatDiff(entry.emiDifferenceFromLowest)} (EMI)</span>
            <span className="emi-lender__diff-int">
              {formatDiff(entry.interestDifferenceFromLowest)} (interest)
            </span>
          </dd>
        </div>
        <div>
          <dt>Processing style</dt>
          <dd>{entry.processingStyle}</dd>
        </div>
      </dl>
      <p className="emi-lender__rate-note">{ILLUSTRATIVE_RATE_DISCLAIMER}</p>
    </article>
  );
}

function LenderTable({ comparisons }) {
  return (
    <div className="emi-lender__table-wrap">
      <table className="emi-lender__table">
        <caption className="emi-lender__caption">
          Illustrative lender EMI scenarios for the selected loan type and tenure
        </caption>
        <thead>
          <tr>
            <th scope="col">Lender</th>
            <th scope="col">Category</th>
            <th scope="col">Illustrative rate</th>
            <th scope="col">Estimated EMI</th>
            <th scope="col">Total interest</th>
            <th scope="col">Total repayment</th>
            <th scope="col">Vs lowest-rate scenario</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((entry) => (
            <tr key={entry.id}>
              <th scope="row">
                <span className="emi-lender__name">{entry.name}</span>
                <span className="emi-lender__proc">{entry.processingStyle}</span>
              </th>
              <td>{entry.lenderType}</td>
              <td>{formatRate(entry.annualRate)}</td>
              <td>{formatCurrency(entry.monthlyEmi)}</td>
              <td>{formatCurrency(entry.totalInterest)}</td>
              <td>{formatCurrency(entry.totalRepayment)}</td>
              <td>
                {entry.isLowestRate ? (
                  <span className="emi-lender__lowest-label">Lowest-rate scenario in this set</span>
                ) : (
                  <>
                    <span className="emi-lender__diff-emi">
                      EMI {formatDiff(entry.emiDifferenceFromLowest)}
                    </span>
                    <span className="emi-lender__diff-int">
                      Interest {formatDiff(entry.interestDifferenceFromLowest)}
                    </span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getIsMobileViewport() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 899px)").matches;
}

function EmiLenderComparisonComingSoon() {
  return (
    <section className="emi-lender emi-lender--coming-soon" aria-labelledby="emi-lender-title">
      <header className="emi-lender__header">
        <div className="emi-lender__header-text">
          <h3 id="emi-lender-title">Compare Illustrative Lender Scenarios</h3>
          <p className="emi-lender__coming-soon">
            Verified lender comparisons are coming soon.
          </p>
        </div>
      </header>
    </section>
  );
}

function EmiLenderComparisonEnabled({ principal, tenureMonths, loanTypeId }) {
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);
  const [expanded, setExpanded] = useState(() => !getIsMobileViewport());

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(max-width: 899px)");
    const sync = () => {
      setIsMobile(mq.matches);
      setExpanded(!mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const result = useMemo(
    () =>
      buildLenderComparisons({
        principal,
        tenureMonths,
        loanType: loanTypeId,
        lenders: INDIAN_LENDERS,
      }),
    [principal, tenureMonths, loanTypeId],
  );

  const savingsSummary = useMemo(
    () => buildLenderSavingsSummary(result),
    [result],
  );

  const contentId = "emi-lender-comparison-panel";

  return (
    <section className="emi-lender" aria-labelledby="emi-lender-title">
      <header className="emi-lender__header">
        <div className="emi-lender__header-text">
          <h3 id="emi-lender-title">Compare Illustrative Lender Scenarios</h3>
          <p>See how small rate differences can affect EMI and estimated borrowing cost.</p>
        </div>
        <button
          type="button"
          className="emi-lender__toggle"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((prev) => !prev)}
        >
          Compare Lenders
        </button>
      </header>

      <div
        id={contentId}
        className={`emi-lender__panel${expanded || !isMobile ? " is-expanded" : ""}`}
        hidden={isMobile && !expanded}
      >
        {!result.valid || !result.comparisons.length ? (
          <p className="emi-lender__empty">
            Enter a valid loan amount and tenure to compare illustrative lender scenarios for this
            loan type.
          </p>
        ) : (
          <>
            <EmiRateSavingsInsight summary={savingsSummary} />

            <div className="emi-lender__desktop">
              <LenderTable comparisons={result.comparisons} />
            </div>

            <div className="emi-lender__mobile" aria-label="Illustrative lender scenarios">
              {result.comparisons.map((entry) => (
                <LenderCard key={entry.id} entry={entry} />
              ))}
            </div>

            <p className="emi-lender__rate-note emi-lender__rate-note--global">
              {ILLUSTRATIVE_RATE_DISCLAIMER}
            </p>
            <p className="emi-lender__processing-note">{PROCESSING_NOTE}</p>
            <p className="emi-lender__dev-note">
              Lender rates shown here are development-only illustrative placeholders for comparison
              learning. They are not live offers and must be verified directly with each lender.
            </p>
          </>
        )}
      </div>
    </section>
  );
}

function EmiLenderComparison(props) {
  if (!ENABLE_LENDER_COMPARISON) {
    return <EmiLenderComparisonComingSoon />;
  }
  return <EmiLenderComparisonEnabled {...props} />;
}

export default EmiLenderComparison;
