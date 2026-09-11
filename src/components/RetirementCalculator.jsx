import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";
import { calculateRetirementEstimate } from "../utils/retirement/retirementEngine.js";
import {
  RETIREMENT_25X_LABEL,
  RETIREMENT_25X_NOTE,
  RETIREMENT_AGE_HELPER,
  RETIREMENT_CONTRIBUTION_HELPER,
  RETIREMENT_CONTRIBUTION_LABEL,
  RETIREMENT_CORPUS_LABEL,
  RETIREMENT_CURRENT_AGE_LABEL,
  RETIREMENT_DEFAULTS,
  RETIREMENT_DESCRIPTION,
  RETIREMENT_EXPENSE_LABEL,
  RETIREMENT_INPUT_LIMITS,
  RETIREMENT_INVALID_AGE_NOTE,
  RETIREMENT_PERIOD_SECTION_HELPER,
  RETIREMENT_PERIOD_SECTION_TITLE,
  RETIREMENT_POST_RETURN_LABEL,
  RETIREMENT_PRE_INFLATION_LABEL,
  RETIREMENT_PRE_RETURN_HELPER,
  RETIREMENT_PRE_RETURN_LABEL,
  RETIREMENT_PRIMARY_RESULT_LABEL,
  RETIREMENT_PROJECTED_SAVINGS_LABEL,
  RETIREMENT_RET_INFLATION_LABEL,
  RETIREMENT_RETIREMENT_AGE_LABEL,
  RETIREMENT_SHORTFALL_LABEL,
  RETIREMENT_STORY,
  RETIREMENT_SURPLUS_LABEL,
  RETIREMENT_TITLE,
  RETIREMENT_WITHDRAWAL_HELPER,
  RETIREMENT_YEARS_LABEL,
} from "../utils/retirement/retirementRules.js";

function RetirementCalculator({
  defaultCurrentAge = RETIREMENT_DEFAULTS.currentAge,
  defaultRetirementAge = RETIREMENT_DEFAULTS.retirementAge,
  defaultExpense = RETIREMENT_DEFAULTS.currentMonthlyExpense,
  defaultInflation = RETIREMENT_DEFAULTS.preRetirementInflationRate,
  defaultRate = RETIREMENT_DEFAULTS.preRetirementReturnRate,
  defaultCorpus = RETIREMENT_DEFAULTS.currentRetirementCorpus,
  defaultRetirementYears = RETIREMENT_DEFAULTS.retirementYears,
  defaultRetirementInflation = RETIREMENT_DEFAULTS.retirementInflationRate,
  defaultPostRetirementReturn = RETIREMENT_DEFAULTS.postRetirementReturnRate,
  className = "",
  showHeader = true,
}) {
  const [currentAge, setCurrentAge] = useState(defaultCurrentAge);
  const [retirementAge, setRetirementAge] = useState(defaultRetirementAge);
  const [expense, setExpense] = useState(defaultExpense);
  const [inflation, setInflation] = useState(defaultInflation);
  const [rate, setRate] = useState(defaultRate);
  const [corpus, setCorpus] = useState(defaultCorpus);
  const [retirementYears, setRetirementYears] = useState(defaultRetirementYears);
  const [retirementInflation, setRetirementInflation] = useState(
    defaultRetirementInflation,
  );
  const [postRetirementReturn, setPostRetirementReturn] = useState(
    defaultPostRetirementReturn,
  );

  const estimate = calculateRetirementEstimate({
    currentAge,
    retirementAge,
    currentMonthlyExpense: expense,
    preRetirementInflationRate: inflation,
    currentRetirementCorpus: corpus,
    preRetirementReturnRate: rate,
    retirementYears,
    retirementInflationRate: retirementInflation,
    postRetirementReturnRate: postRetirementReturn,
  });

  const invalidResults = (
    <CalculatorResults
      headerTitle="Retirement illustration"
      headerSubtitle="Age combination is outside this calculator’s modelled range"
      primary={{ label: RETIREMENT_PRIMARY_RESULT_LABEL, value: "—" }}
      story={`${RETIREMENT_INVALID_AGE_NOTE} ${RETIREMENT_AGE_HELPER}`}
    />
  );

  const validMetrics = [
    {
      label: RETIREMENT_PROJECTED_SAVINGS_LABEL,
      value: formatCurrency(estimate.projectedExistingCorpus),
    },
    {
      label: RETIREMENT_SHORTFALL_LABEL,
      value: formatCurrency(estimate.shortfall),
    },
  ];

  if (estimate.surplus > 0) {
    validMetrics.push({
      label: RETIREMENT_SURPLUS_LABEL,
      value: formatCurrency(estimate.surplus),
    });
  }

  validMetrics.push(
    {
      label: RETIREMENT_CONTRIBUTION_LABEL,
      value: formatCurrency(estimate.monthlyContributionRequired),
    },
    {
      label: RETIREMENT_25X_LABEL,
      value: formatCurrency(estimate.simple25xComparison),
    },
  );

  const validResults = (
    <CalculatorResults
      headerTitle="Illustrative retirement estimate"
      headerSubtitle="Educational projection using the assumptions you entered — not a savings recommendation"
      primary={{
        label: RETIREMENT_PRIMARY_RESULT_LABEL,
        value: formatCurrency(estimate.primaryRequiredCorpus),
      }}
      metrics={validMetrics}
      story={`${RETIREMENT_STORY} ${RETIREMENT_WITHDRAWAL_HELPER} ${RETIREMENT_PRE_RETURN_HELPER} ${RETIREMENT_CONTRIBUTION_HELPER} ${RETIREMENT_25X_NOTE}`}
    />
  );

  return (
    <CalculatorLayout
      label="Retirement Calculator"
      title={RETIREMENT_TITLE}
      description={RETIREMENT_DESCRIPTION}
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/retirement-calculator"
      simplifiedModelNotice
      form={
        <>
          <InputField
            id="retire-current-age"
            label={RETIREMENT_CURRENT_AGE_LABEL}
            value={currentAge}
            onChange={setCurrentAge}
            format="number"
            limits={RETIREMENT_INPUT_LIMITS.currentAge}
          />
          <InputField
            id="retire-retirement-age"
            label={RETIREMENT_RETIREMENT_AGE_LABEL}
            value={retirementAge}
            onChange={setRetirementAge}
            format="number"
            limits={RETIREMENT_INPUT_LIMITS.retirementAge}
          />
          <p className="calc-field__helper" id="retire-age-helper">
            {RETIREMENT_AGE_HELPER}
          </p>
          <CurrencyInput
            id="retire-expense"
            label={RETIREMENT_EXPENSE_LABEL}
            value={expense}
            onChange={setExpense}
            limits={RETIREMENT_INPUT_LIMITS.currentMonthlyExpense}
          />
          <InputField
            id="retire-inflation"
            label={RETIREMENT_PRE_INFLATION_LABEL}
            value={inflation}
            onChange={setInflation}
            format="percent"
            limits={RETIREMENT_INPUT_LIMITS.preRetirementInflationRate}
          />
          <InputField
            id="retire-rate"
            label={RETIREMENT_PRE_RETURN_LABEL}
            value={rate}
            onChange={setRate}
            format="percent"
            limits={RETIREMENT_INPUT_LIMITS.preRetirementReturnRate}
          />
          <p className="calc-field__helper" id="retire-pre-return-helper">
            {RETIREMENT_PRE_RETURN_HELPER}
          </p>
          <CurrencyInput
            id="retire-corpus"
            label={RETIREMENT_CORPUS_LABEL}
            value={corpus}
            onChange={setCorpus}
            limits={RETIREMENT_INPUT_LIMITS.currentRetirementCorpus}
          />
          <fieldset className="calc-assumption-panel">
            <legend>{RETIREMENT_PERIOD_SECTION_TITLE}</legend>
            <p className="calc-field__helper" id="retire-period-helper">
              {RETIREMENT_PERIOD_SECTION_HELPER}
            </p>
            <InputField
              id="retire-years"
              label={RETIREMENT_YEARS_LABEL}
              value={retirementYears}
              onChange={setRetirementYears}
              format="years"
              limits={RETIREMENT_INPUT_LIMITS.retirementYears}
            />
            <InputField
              id="retire-retirement-inflation"
              label={RETIREMENT_RET_INFLATION_LABEL}
              value={retirementInflation}
              onChange={setRetirementInflation}
              format="percent"
              limits={RETIREMENT_INPUT_LIMITS.retirementInflationRate}
            />
            <InputField
              id="retire-post-return"
              label={RETIREMENT_POST_RETURN_LABEL}
              value={postRetirementReturn}
              onChange={setPostRetirementReturn}
              format="percent"
              limits={RETIREMENT_INPUT_LIMITS.postRetirementReturnRate}
            />
            <p className="calc-field__helper" id="retire-withdrawal-helper">
              {RETIREMENT_WITHDRAWAL_HELPER}
            </p>
          </fieldset>
        </>
      }
      results={estimate.valid ? validResults : invalidResults}
    />
  );
}

export default RetirementCalculator;
