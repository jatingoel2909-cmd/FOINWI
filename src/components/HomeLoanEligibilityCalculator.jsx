import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";
import {
  AFFORDABILITY_RATIO_LABEL,
  AFFORDABLE_EMI_LABEL,
  DEFAULT_FOIR_PERCENT,
  ELIGIBILITY_DESCRIPTION,
  ELIGIBILITY_LIMITATION_NOTE,
  ELIGIBILITY_TITLE,
  FOIR_HELPER_TEXT,
  FOIR_MAX,
  FOIR_MIN,
  LTV_LIMITATION_NOTE,
  PRIMARY_LOAN_LABEL,
  ZERO_AFFORDABILITY_NOTE,
  calculateLoanEligibility,
} from "../utils/loanEligibilityEngine";

const LIMITS = {
  income: { min: 15000, max: 500000, step: 5000 },
  existingEmi: { min: 0, max: 200000, step: 1000 },
  rate: { min: 6, max: 15, step: 0.1 },
  years: { min: 1, max: 30, step: 1 },
  affordabilityRatio: { min: FOIR_MIN, max: FOIR_MAX, step: 1 },
};

function HomeLoanEligibilityCalculator({
  defaultIncome = 100000,
  defaultExistingEmi = 10000,
  defaultRate = 8.5,
  defaultYears = 20,
  defaultAffordabilityRatio = DEFAULT_FOIR_PERCENT,
  className = "",
  showHeader = true,
}) {
  const [monthlyIncome, setMonthlyIncome] = useState(defaultIncome);
  const [existingEmi, setExistingEmi] = useState(defaultExistingEmi);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);
  const [affordabilityRatio, setAffordabilityRatio] = useState(
    defaultAffordabilityRatio,
  );

  const estimate = calculateLoanEligibility({
    monthlyIncome,
    existingMonthlyObligations: existingEmi,
    annualInterestRate: rate,
    tenureMonths: years * 12,
    foirPercent: affordabilityRatio,
  });

  const noAffordableEmi = estimate.estimatedAvailableEmi <= 0;
  const story = noAffordableEmi
    ? `${ZERO_AFFORDABILITY_NOTE} ${ELIGIBILITY_LIMITATION_NOTE} ${LTV_LIMITATION_NOTE}`
    : `${ELIGIBILITY_LIMITATION_NOTE} ${LTV_LIMITATION_NOTE}`;

  return (
    <CalculatorLayout
      label="Home Loan Eligibility Calculator"
      title={ELIGIBILITY_TITLE}
      description={ELIGIBILITY_DESCRIPTION}
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/home-loan-eligibility-calculator"
      form={
        <>
          <CurrencyInput
            id="hle-income"
            label="Monthly Income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            limits={LIMITS.income}
          />
          <CurrencyInput
            id="hle-existing-emi"
            label="Existing Monthly EMI"
            value={existingEmi}
            onChange={setExistingEmi}
            limits={LIMITS.existingEmi}
          />
          <InputField
            id="hle-rate"
            label="Interest Rate (% yearly)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <InputField
            id="hle-years"
            label="Loan Tenure (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={LIMITS.years}
          />
          <InputField
            id="hle-affordability-ratio"
            label={AFFORDABILITY_RATIO_LABEL}
            value={affordabilityRatio}
            onChange={setAffordabilityRatio}
            format="percent"
            limits={LIMITS.affordabilityRatio}
          />
          <p className="calc-field__helper" id="hle-affordability-helper">
            {FOIR_HELPER_TEXT}
          </p>
        </>
      }
      results={
        <CalculatorResults
          headerTitle="Illustrative affordability estimate"
          headerSubtitle="Educational projection using the assumptions you entered — not a lender decision"
          primary={{
            label: PRIMARY_LOAN_LABEL,
            value: formatCurrency(estimate.estimatedEligibleLoan),
          }}
          metrics={[
            {
              label: AFFORDABLE_EMI_LABEL,
              value: formatCurrency(estimate.estimatedAvailableEmi),
            },
            { label: "Monthly Income", value: formatCurrency(monthlyIncome) },
            { label: "Existing Monthly EMI", value: formatCurrency(existingEmi) },
            { label: "Loan Tenure", value: `${years} years` },
          ]}
          story={story}
        />
      }
    />
  );
}

export default HomeLoanEligibilityCalculator;
