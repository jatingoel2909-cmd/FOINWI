import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";
import { calculatePpfEstimate, normalizeAnnualContribution } from "../utils/ppf/ppfEngine.js";
import {
  PPF_CONTRIBUTION_LABEL,
  PPF_DEPOSIT_TIMING_NOTE,
  PPF_EXTENSION_NOTE,
  PPF_ILLUSTRATIVE_INTEREST_RATE,
  PPF_INPUT_LIMITS,
  PPF_INTEREST_HELPER_NOTE,
  PPF_INTEREST_INPUT_LABEL,
  PPF_INTEREST_METHOD_NOTE,
  PPF_LIMIT_AGGREGATION_NOTE,
  PPF_MATURITY_DISCLOSURE,
  PPF_PRIMARY_RESULT_LABEL,
  PPF_PROJECTION_METHOD_NOTE,
  PPF_SCOPE_LIMITATIONS_NOTE,
  PPF_SCOPE_NOTE,
  PPF_STANDARD_CONTRIBUTION_YEARS,
  PPF_TAX_NOTE,
  PPF_YEARS_HELPER_NOTE,
  PPF_YEARS_LABEL,
} from "../utils/ppf/ppfRules.js";

function PpfCalculator({
  defaultYearly = 150000,
  defaultRate = PPF_ILLUSTRATIVE_INTEREST_RATE,
  className = "",
  showHeader = true,
}) {
  const [yearly, setYearly] = useState(normalizeAnnualContribution(defaultYearly));
  const [rate, setRate] = useState(defaultRate);

  const estimate = calculatePpfEstimate({
    annualContribution: yearly,
    illustrativeAnnualRate: rate,
    contributionYears: PPF_STANDARD_CONTRIBUTION_YEARS,
  });

  return (
    <CalculatorLayout
      label="Public Provident Fund (PPF) Calculator"
      title="Explore how PPF contributions may accumulate"
      description="Educational PPF accumulation estimate using an annual contribution assumed deposited on or before 5 April of each financial year and a constant illustrative interest-rate assumption."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/ppf-calculator"
      simplifiedModelNotice
      form={
        <>
          <p className="calc-field__helper" id="ppf-scope">
            {PPF_SCOPE_NOTE}
            {" "}
            {PPF_SCOPE_LIMITATIONS_NOTE}
            {" "}
            {PPF_TAX_NOTE}
          </p>
          <CurrencyInput
            id="ppf-yearly"
            label={PPF_CONTRIBUTION_LABEL}
            value={yearly}
            onChange={(nextValue) => setYearly(normalizeAnnualContribution(nextValue))}
            limits={PPF_INPUT_LIMITS.annualContribution}
          />
          <p className="calc-field__helper" id="ppf-limit-helper">
            {PPF_LIMIT_AGGREGATION_NOTE}
          </p>
          <p className="calc-field__helper" id="ppf-timing-helper">
            {PPF_DEPOSIT_TIMING_NOTE}
            {" "}
            {PPF_INTEREST_METHOD_NOTE}
          </p>
          <InputField
            id="ppf-rate"
            label={`${PPF_INTEREST_INPUT_LABEL} (%)`}
            value={rate}
            onChange={setRate}
            format="percent"
            limits={PPF_INPUT_LIMITS.illustrativeAnnualRate}
          />
          <p className="calc-field__helper" id="ppf-rate-helper">
            {PPF_INTEREST_HELPER_NOTE}
          </p>
          <div className="calc-field">
            <p className="calc-field__label" id="ppf-years-label">
              {PPF_YEARS_LABEL}
            </p>
            <p className="calc-field__helper" id="ppf-years-value">
              {PPF_STANDARD_CONTRIBUTION_YEARS} — standard modelled scenario
            </p>
            <p className="calc-field__helper" id="ppf-years-helper">
              {PPF_YEARS_HELPER_NOTE}
              {" "}
              {PPF_MATURITY_DISCLOSURE}
              {" "}
              {PPF_EXTENSION_NOTE}
            </p>
          </div>
        </>
      }
      results={
        <CalculatorResults
          headerTitle="Illustrative PPF estimate"
          headerSubtitle="Constant-rate educational model — not an official passbook"
          primary={{
            label: PPF_PRIMARY_RESULT_LABEL,
            value: formatCurrency(estimate.estimatedBalance),
          }}
          metrics={[
            { label: PPF_CONTRIBUTION_LABEL, value: formatCurrency(estimate.annualContribution) },
            { label: "Total contributed", value: formatCurrency(estimate.totalContributed) },
            { label: "Illustrative interest", value: formatCurrency(estimate.interestEarned) },
            {
              label: PPF_INTEREST_INPUT_LABEL,
              value: `${estimate.illustrativeAnnualRate}%`,
            },
            { label: PPF_YEARS_LABEL, value: `${estimate.contributionYears} years` },
          ]}
          story={`${PPF_PROJECTION_METHOD_NOTE} ${PPF_INTEREST_HELPER_NOTE} ${PPF_SCOPE_LIMITATIONS_NOTE} ${PPF_TAX_NOTE}`}
        />
      }
    />
  );
}

export default PpfCalculator;
