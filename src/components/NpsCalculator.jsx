import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";
import { calculateNpsEstimate } from "../utils/nps/npsEngine.js";
import {
  NPS_AGE_SCOPE_NOTE,
  NPS_ANNUITY_ALLOCATION_HELPER_NOTE,
  NPS_ANNUITY_ALLOCATION_LABEL,
  NPS_ANNUITY_AMOUNT_LABEL,
  NPS_ANNUITY_RATE_HELPER_NOTE,
  NPS_ANNUITY_RATE_LABEL,
  NPS_CONTRIBUTED_LABEL,
  NPS_CONTRIBUTION_LABEL,
  NPS_CONTRIBUTION_LIMIT_NOTE,
  NPS_CURRENT_AGE_LABEL,
  NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT,
  NPS_DEFAULT_ANNUITY_RATE_PERCENT,
  NPS_DEFAULT_ILLUSTRATIVE_RETURN_PERCENT,
  NPS_EXIT_AGE_LABEL,
  NPS_INPUT_LIMITS,
  NPS_INVALID_AGE_NOTE,
  NPS_LUMP_SUM_LABEL,
  NPS_MINIMUM_ANNUITY_NOTE,
  NPS_MONTHLY_ANNUITY_LABEL,
  NPS_PRIMARY_RESULT_LABEL,
  NPS_PROJECTION_METHOD_NOTE,
  NPS_RETURN_HELPER_NOTE,
  NPS_RETURN_LABEL,
  NPS_SCOPE_NOTE,
  NPS_SPECIAL_CASE_NOTE,
  NPS_TAX_NOTE,
  NPS_TITLE,
} from "../utils/nps/npsRules.js";

function NpsCalculator({
  defaultMonthly = 5000,
  defaultRate = NPS_DEFAULT_ILLUSTRATIVE_RETURN_PERCENT,
  defaultCurrentAge = 30,
  defaultExitAge = 60,
  defaultAnnuityAllocation = NPS_DEFAULT_ANNUITY_ALLOCATION_PERCENT,
  defaultAnnuityRate = NPS_DEFAULT_ANNUITY_RATE_PERCENT,
  className = "",
  showHeader = true,
}) {
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [rate, setRate] = useState(defaultRate);
  const [currentAge, setCurrentAge] = useState(defaultCurrentAge);
  const [exitAge, setExitAge] = useState(defaultExitAge);
  const [annuityAllocationPercent, setAnnuityAllocationPercent] = useState(
    defaultAnnuityAllocation,
  );
  const [annuityRate, setAnnuityRate] = useState(defaultAnnuityRate);

  const estimate = calculateNpsEstimate({
    monthlyContribution: monthly,
    illustrativeAnnualReturnPercent: rate,
    currentAge,
    exitAge,
    annuityAllocationPercent,
    illustrativeAnnuityRatePercent: annuityRate,
  });

  const invalidResults = (
    <CalculatorResults
      headerTitle="NPS illustration"
      headerSubtitle="Age combination is outside this calculator’s scoped normal-exit case"
      primary={{ label: NPS_PRIMARY_RESULT_LABEL, value: "—" }}
      story={`${NPS_INVALID_AGE_NOTE} ${NPS_SCOPE_NOTE} ${NPS_SPECIAL_CASE_NOTE}`}
    />
  );

  const accumulationMetrics = [
    { label: NPS_CONTRIBUTED_LABEL, value: formatCurrency(estimate.totalContributed) },
    { label: "Illustrated contribution years", value: `${estimate.contributionYears} years` },
  ];

  const exitMetrics = estimate.exitIllustrationApplies
    ? [
        { label: NPS_LUMP_SUM_LABEL, value: formatCurrency(estimate.illustrativeLumpSum) },
        { label: NPS_ANNUITY_AMOUNT_LABEL, value: formatCurrency(estimate.annuityAllocation) },
        {
          label: NPS_MONTHLY_ANNUITY_LABEL,
          value: formatCurrency(estimate.illustrativeMonthlyAnnuity),
        },
      ]
    : [];

  const validResults = (
    <CalculatorResults
      headerTitle="Illustrative NPS estimate"
      headerSubtitle="Educational projection — not an official PRAN statement or ASP quote"
      primary={{
        label: NPS_PRIMARY_RESULT_LABEL,
        value: formatCurrency(estimate.projectedCorpus),
      }}
      metrics={[...accumulationMetrics, ...exitMetrics]}
      story={
        estimate.exitIllustrationApplies
          ? `${NPS_PROJECTION_METHOD_NOTE} ${NPS_MINIMUM_ANNUITY_NOTE} ${NPS_ANNUITY_RATE_HELPER_NOTE} ${NPS_TAX_NOTE} ${NPS_SPECIAL_CASE_NOTE}`
          : `${NPS_PROJECTION_METHOD_NOTE} ${estimate.message} ${NPS_TAX_NOTE} ${NPS_SPECIAL_CASE_NOTE}`
      }
    />
  );

  return (
    <CalculatorLayout
      label="NPS Calculator"
      title={NPS_TITLE}
      description={NPS_SCOPE_NOTE}
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/nps-calculator"
      simplifiedModelNotice
      form={
        <>
          <p className="calc-field__helper" id="nps-scope">
            {NPS_SCOPE_NOTE}
            {" "}
            {NPS_SPECIAL_CASE_NOTE}
            {" "}
            {NPS_TAX_NOTE}
          </p>
          <CurrencyInput
            id="nps-monthly"
            label={NPS_CONTRIBUTION_LABEL}
            value={monthly}
            onChange={setMonthly}
            limits={NPS_INPUT_LIMITS.monthlyContribution}
          />
          <p className="calc-field__helper" id="nps-contribution-helper">
            {NPS_CONTRIBUTION_LIMIT_NOTE}
          </p>
          <InputField
            id="nps-rate"
            label={NPS_RETURN_LABEL}
            value={rate}
            onChange={setRate}
            format="percent"
            limits={NPS_INPUT_LIMITS.illustrativeAnnualReturnPercent}
          />
          <p className="calc-field__helper" id="nps-return-helper">
            {NPS_RETURN_HELPER_NOTE}
          </p>
          <InputField
            id="nps-current-age"
            label={NPS_CURRENT_AGE_LABEL}
            value={currentAge}
            onChange={setCurrentAge}
            format="number"
            limits={NPS_INPUT_LIMITS.currentAge}
          />
          <InputField
            id="nps-exit-age"
            label={NPS_EXIT_AGE_LABEL}
            value={exitAge}
            onChange={setExitAge}
            format="number"
            limits={NPS_INPUT_LIMITS.exitAge}
          />
          <p className="calc-field__helper" id="nps-age-helper">
            {NPS_AGE_SCOPE_NOTE}
          </p>
          <InputField
            id="nps-annuity-allocation"
            label={NPS_ANNUITY_ALLOCATION_LABEL}
            value={annuityAllocationPercent}
            onChange={setAnnuityAllocationPercent}
            format="percent"
            limits={NPS_INPUT_LIMITS.annuityAllocationPercent}
          />
          <p className="calc-field__helper" id="nps-allocation-helper">
            {NPS_ANNUITY_ALLOCATION_HELPER_NOTE}
            {" "}
            {NPS_MINIMUM_ANNUITY_NOTE}
          </p>
          <InputField
            id="nps-annuity-rate"
            label={NPS_ANNUITY_RATE_LABEL}
            value={annuityRate}
            onChange={setAnnuityRate}
            format="percent"
            limits={NPS_INPUT_LIMITS.illustrativeAnnuityRatePercent}
          />
          <p className="calc-field__helper" id="nps-annuity-rate-helper">
            {NPS_ANNUITY_RATE_HELPER_NOTE}
          </p>
          <p className="calc-field__helper" id="nps-projection-helper">
            {NPS_PROJECTION_METHOD_NOTE}
          </p>
        </>
      }
      results={estimate.valid ? validResults : invalidResults}
    />
  );
}

export default NpsCalculator;
