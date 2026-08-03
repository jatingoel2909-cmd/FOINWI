import { useMemo, useState } from "react";
import CurrencyInput from "../ui/CurrencyInput";
import InputField from "../ui/InputField";
import {
  analyzeLumpSumPrepayment,
  analyzeMonthlyPrepayment,
  formatMonthsAsYears,
} from "../../utils/prepaymentEngine";
import { formatCurrency } from "../../utils/calculatorFormat";
import PrepaymentSummary from "./PrepaymentSummary";
import PrepaymentTimeline from "./PrepaymentTimeline";
import "./prepayment.css";

const EXTRA_LIMITS = { min: 0, max: 500000, step: 500 };
const LUMP_LIMITS = { min: 0, max: 10000000, step: 10000 };
const AFTER_YEARS_LIMITS = { min: 0, max: 30, step: 1 };

function EmiPrepaymentCalculator({
  principal,
  annualRate,
  tenureYears,
}) {
  const [mode, setMode] = useState("monthly");
  const [extraMonthly, setExtraMonthly] = useState(5000);
  const [lumpSum, setLumpSum] = useState(200000);
  const [afterYears, setAfterYears] = useState(2);

  const tenureMonths = Math.round(Number(tenureYears) * 12);

  const result = useMemo(() => {
    if (mode === "monthly") {
      return analyzeMonthlyPrepayment({
        principal,
        annualRate,
        tenureMonths,
        extraMonthly,
      });
    }
    return analyzeLumpSumPrepayment({
      principal,
      annualRate,
      tenureMonths,
      prepaymentAmount: lumpSum,
      afterYears,
    });
  }, [mode, principal, annualRate, tenureMonths, extraMonthly, lumpSum, afterYears]);

  return (
    <section className="emi-prepay" aria-labelledby="emi-prepay-title">
      <header className="emi-prepay__header">
        <h3 id="emi-prepay-title">Explore Prepayment Impact</h3>
        <p>
          See how extra monthly payments or a one-time lump sum may change estimated interest
          and payoff timing. Educational estimates only — not personal financial advice.
        </p>
      </header>

      <p className="emi-prepay__context" aria-live="polite">
        Based on loan amount {formatCurrency(Number(principal) || 0)}, illustrative rate{" "}
        {Number(annualRate).toFixed(1)}%, original tenure {formatMonthsAsYears(tenureMonths)}.
      </p>

      <div
        className="emi-prepay__modes"
        role="tablist"
        aria-label="Prepayment type"
      >
        <button
          type="button"
          role="tab"
          id="emi-prepay-tab-monthly"
          aria-selected={mode === "monthly"}
          aria-controls="emi-prepay-panel"
          className={`emi-prepay__mode${mode === "monthly" ? " is-active" : ""}`}
          onClick={() => setMode("monthly")}
        >
          Extra monthly payment
        </button>
        <button
          type="button"
          role="tab"
          id="emi-prepay-tab-lump"
          aria-selected={mode === "lumpSum"}
          aria-controls="emi-prepay-panel"
          className={`emi-prepay__mode${mode === "lumpSum" ? " is-active" : ""}`}
          onClick={() => setMode("lumpSum")}
        >
          One-time lump sum
        </button>
      </div>

      <div
        id="emi-prepay-panel"
        role="tabpanel"
        aria-labelledby={
          mode === "monthly" ? "emi-prepay-tab-monthly" : "emi-prepay-tab-lump"
        }
        className="emi-prepay__panel"
      >
        <div className="emi-prepay__form">
          {mode === "monthly" ? (
            <CurrencyInput
              id="emi-prepay-extra"
              label="Monthly Extra Payment"
              value={extraMonthly}
              onChange={setExtraMonthly}
              limits={EXTRA_LIMITS}
            />
          ) : (
            <>
              <CurrencyInput
                id="emi-prepay-lump"
                label="Prepayment Amount"
                value={lumpSum}
                onChange={setLumpSum}
                limits={LUMP_LIMITS}
              />
              <InputField
                id="emi-prepay-after-years"
                label="Prepayment After (Years)"
                value={afterYears}
                onChange={setAfterYears}
                format="years"
                limits={AFTER_YEARS_LIMITS}
              />
            </>
          )}
        </div>

        {result.valid ? (
          <div className="emi-prepay__results">
            <PrepaymentSummary result={result} />
            <PrepaymentTimeline timeline={result.timeline} />
          </div>
        ) : (
          <PrepaymentSummary result={result} />
        )}
      </div>

      <aside
        className="emi-prepay__assumptions"
        aria-labelledby="emi-prepay-assumptions-title"
      >
        <h4 id="emi-prepay-assumptions-title">Calculation assumptions</h4>
        <ul>
          <li>Interest rate is assumed to remain unchanged.</li>
          <li>Monthly EMI remains unchanged after a lump-sum prepayment.</li>
          <li>Extra monthly payments are assumed to be made consistently.</li>
          <li>
            Prepayment charges, foreclosure fees, taxes and lender-specific rules are not
            included.
          </li>
          <li>Results are estimates for educational comparison only.</li>
        </ul>
      </aside>
    </section>
  );
}

export default EmiPrepaymentCalculator;
