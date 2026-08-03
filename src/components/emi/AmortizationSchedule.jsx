import { useMemo, useRef, useState } from "react";
import { formatCurrency } from "../../utils/calculatorFormat";
import {
  AMORTIZATION_ASSUMPTIONS,
  buildAmortizationFromPrepaymentScenario,
  buildAmortizationSchedule,
  buildYearlySummary,
} from "../../utils/amortizationEngine";
import AmortizationSummary from "./AmortizationSummary";
import AmortizationYearView from "./AmortizationYearView";
import "./amortization.css";

function MonthlyTable({ rows, highlightMonth, monthRefs }) {
  return (
    <div className="emi-amort__table-wrap emi-amort__table-wrap--desktop">
      <table className="emi-amort__table">
        <caption className="emi-amort__caption">
          Illustrative monthly amortization schedule
        </caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Year</th>
            <th scope="col">EMI</th>
            <th scope="col">Interest</th>
            <th scope="col">Principal</th>
            <th scope="col">Remaining Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.month}
              ref={(el) => {
                if (monthRefs) monthRefs.current[row.month] = el;
              }}
              className={
                highlightMonth === row.month ? "emi-amort__row--highlight" : undefined
              }
              data-month={row.month}
            >
              <th scope="row">{row.month}</th>
              <td>{row.year}</td>
              <td>{formatCurrency(row.emi)}</td>
              <td>{formatCurrency(row.interest)}</td>
              <td>{formatCurrency(row.principal)}</td>
              <td>{formatCurrency(row.remainingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MonthlyCards({ rows, highlightMonth, monthRefs }) {
  return (
    <div className="emi-amort__month-cards" aria-label="Monthly amortization cards">
      {rows.map((row) => (
        <article
          key={row.month}
          className={`emi-amort__card${
            highlightMonth === row.month ? " emi-amort__card--highlight" : ""
          }`}
          ref={(el) => {
            if (monthRefs) monthRefs.current[`mobile-m-${row.month}`] = el;
          }}
        >
          <h5>
            Month {row.month} · Year {row.year}
          </h5>
          <dl className="emi-amort__card-stats">
            <div>
              <dt>EMI</dt>
              <dd>{formatCurrency(row.emi)}</dd>
            </div>
            <div>
              <dt>Interest</dt>
              <dd>{formatCurrency(row.interest)}</dd>
            </div>
            <div>
              <dt>Principal</dt>
              <dd>{formatCurrency(row.principal)}</dd>
            </div>
            <div>
              <dt>Remaining Balance</dt>
              <dd>{formatCurrency(row.remainingBalance)}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function AmortizationSchedule({
  principal,
  annualInterestRate,
  tenureMonths,
  emi,
  prepaymentScenario = null,
}) {
  const [viewMode, setViewMode] = useState("monthly");
  const [scheduleSource, setScheduleSource] = useState("original");
  const [jumpMonth, setJumpMonth] = useState("");
  const [jumpYear, setJumpYear] = useState("");
  const [highlightMonth, setHighlightMonth] = useState(null);
  const [highlightYear, setHighlightYear] = useState(null);

  const monthRefs = useRef({});
  const yearRefs = useRef({});

  const hasPrepayment =
    Boolean(prepaymentScenario?.intentionallyApplied) &&
    Boolean(prepaymentScenario?.valid) &&
    ((prepaymentScenario.mode === "monthly" &&
      Number(prepaymentScenario.extraMonthly) > 0) ||
      (prepaymentScenario.mode === "lumpSum" &&
        Number(prepaymentScenario.appliedLump ?? prepaymentScenario.prepaymentAmount) >
          0));

  const effectiveSource =
    hasPrepayment && scheduleSource === "prepayment" ? "prepayment" : "original";

  const originalSchedule = useMemo(
    () =>
      buildAmortizationSchedule({
        principal,
        annualInterestRate,
        tenureMonths,
        emi,
      }),
    [principal, annualInterestRate, tenureMonths, emi],
  );

  const prepaidSchedule = useMemo(() => {
    if (!hasPrepayment) return null;
    return buildAmortizationFromPrepaymentScenario({
      principal,
      annualInterestRate,
      tenureMonths,
      prepaymentResult: prepaymentScenario,
    });
  }, [hasPrepayment, principal, annualInterestRate, tenureMonths, prepaymentScenario]);

  const activeSchedule =
    effectiveSource === "prepayment" && prepaidSchedule?.valid
      ? prepaidSchedule
      : originalSchedule;

  const yearlyRows = useMemo(
    () => buildYearlySummary(activeSchedule),
    [activeSchedule],
  );

  const preferReducedMotion = () =>
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);

  const scrollToMonth = (month) => {
    const desktop = monthRefs.current[month];
    const mobile = monthRefs.current[`mobile-m-${month}`];
    const target = desktop || mobile;
    if (target?.scrollIntoView) {
      target.scrollIntoView({
        behavior: preferReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    }
    setHighlightMonth(month);
    setHighlightYear(null);
  };

  const scrollToYear = (year) => {
    const desktop = yearRefs.current[year];
    const mobile = yearRefs.current[`mobile-${year}`];
    const target = desktop || mobile;
    if (target?.scrollIntoView) {
      target.scrollIntoView({
        behavior: preferReducedMotion() ? "auto" : "smooth",
        block: "center",
      });
    }
    setHighlightYear(year);
    setHighlightMonth(null);
  };

  const handleJumpMonth = (event) => {
    event.preventDefault();
    const month = Number(jumpMonth);
    if (!Number.isFinite(month) || month < 1) return;
    const max = activeSchedule.rows?.length || 0;
    if (month > max) return;
    setViewMode("monthly");
    setHighlightMonth(month);
    setHighlightYear(null);
    window.setTimeout(() => scrollToMonth(month), 0);
  };

  const handleJumpYear = (event) => {
    event.preventDefault();
    const year = Number(jumpYear);
    if (!Number.isFinite(year) || year < 1) return;
    if (!yearlyRows.some((row) => row.year === year)) return;
    setViewMode("yearly");
    setHighlightYear(year);
    setHighlightMonth(null);
    window.setTimeout(() => scrollToYear(year), 0);
  };

  return (
    <section className="emi-amort" aria-labelledby="emi-amort-title">
      <header className="emi-amort__header">
        <h3 id="emi-amort-title">Amortization Schedule</h3>
        <p>
          See how each estimated EMI may split between interest and principal over the loan life.
          Educational estimate only.
        </p>
      </header>

      {hasPrepayment ? (
        <div
          className="emi-amort__source"
          role="tablist"
          aria-label="Schedule comparison source"
        >
          <button
            type="button"
            role="tab"
            aria-selected={effectiveSource === "original"}
            className={`emi-amort__tab${effectiveSource === "original" ? " is-active" : ""}`}
            onClick={() => setScheduleSource("original")}
          >
            Compare Original Schedule
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={effectiveSource === "prepayment"}
            className={`emi-amort__tab${effectiveSource === "prepayment" ? " is-active" : ""}`}
            onClick={() => setScheduleSource("prepayment")}
          >
            Compare Prepayment Schedule
          </button>
        </div>
      ) : null}

      <AmortizationSummary
        schedule={activeSchedule}
        variantLabel={
          effectiveSource === "prepayment" && hasPrepayment
            ? "Prepayment scenario"
            : "Original schedule"
        }
      />

      <div className="emi-amort__toolbar">
        <div className="emi-amort__modes" role="tablist" aria-label="Amortization view mode">
          <button
            type="button"
            role="tab"
            id="emi-amort-tab-monthly"
            aria-selected={viewMode === "monthly"}
            aria-controls="emi-amort-view-panel"
            className={`emi-amort__tab${viewMode === "monthly" ? " is-active" : ""}`}
            onClick={() => setViewMode("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            role="tab"
            id="emi-amort-tab-yearly"
            aria-selected={viewMode === "yearly"}
            aria-controls="emi-amort-view-panel"
            className={`emi-amort__tab${viewMode === "yearly" ? " is-active" : ""}`}
            onClick={() => setViewMode("yearly")}
          >
            Yearly
          </button>
        </div>

        <div className="emi-amort__jump">
          <form className="emi-amort__jump-form" onSubmit={handleJumpMonth}>
            <label htmlFor="emi-amort-jump-month">Jump to month</label>
            <input
              id="emi-amort-jump-month"
              type="number"
              min={1}
              max={activeSchedule.rows?.length || 1}
              inputMode="numeric"
              value={jumpMonth}
              onChange={(e) => setJumpMonth(e.target.value)}
            />
            <button type="submit" className="emi-amort__jump-btn">
              Go
            </button>
          </form>
          <form className="emi-amort__jump-form" onSubmit={handleJumpYear}>
            <label htmlFor="emi-amort-jump-year">Jump to year</label>
            <input
              id="emi-amort-jump-year"
              type="number"
              min={1}
              max={yearlyRows.length || 1}
              inputMode="numeric"
              value={jumpYear}
              onChange={(e) => setJumpYear(e.target.value)}
            />
            <button type="submit" className="emi-amort__jump-btn">
              Go
            </button>
          </form>
        </div>
      </div>

      <div className="emi-amort__csv-wrap">
        <button
          type="button"
          className="emi-amort__csv"
          disabled={true}
          aria-disabled="true"
          aria-describedby="emi-amort-csv-help"
        >
          🔒 Download CSV — Coming Soon
        </button>
        <p className="emi-amort__csv-help" id="emi-amort-csv-help">
          CSV export will be available as an optional premium feature in a future release.
        </p>
      </div>

      <div
        id="emi-amort-view-panel"
        role="tabpanel"
        aria-labelledby={
          viewMode === "monthly" ? "emi-amort-tab-monthly" : "emi-amort-tab-yearly"
        }
        className="emi-amort__panel"
      >
        {!activeSchedule?.valid ? (
          <p className="emi-amort__empty">
            A valid amortization schedule is not available for the current inputs.
          </p>
        ) : viewMode === "monthly" ? (
          <>
            <MonthlyTable
              rows={activeSchedule.rows}
              highlightMonth={highlightMonth}
              monthRefs={monthRefs}
            />
            <MonthlyCards
              rows={activeSchedule.rows}
              highlightMonth={highlightMonth}
              monthRefs={monthRefs}
            />
          </>
        ) : (
          <AmortizationYearView
            yearlyRows={yearlyRows}
            highlightYear={highlightYear}
            yearRefs={yearRefs}
          />
        )}
      </div>

      <aside
        className="emi-amort__assumptions"
        aria-labelledby="emi-amort-assumptions-title"
      >
        <h4 id="emi-amort-assumptions-title">Calculation assumptions</h4>
        <ul>
          {AMORTIZATION_ASSUMPTIONS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

export default AmortizationSchedule;
