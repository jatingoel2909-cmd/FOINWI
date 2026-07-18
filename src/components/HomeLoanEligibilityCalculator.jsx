import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  income: { min: 15000, max: 500000, step: 5000 },
  existingEmi: { min: 0, max: 200000, step: 1000 },
  rate: { min: 6, max: 15, step: 0.1 },
  years: { min: 1, max: 30, step: 1 },
};

const FOIR = 0.5;

function loanFromEmi(emi, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return emi * months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (emi * (factor - 1)) / (monthlyRate * factor);
}

function HomeLoanEligibilityCalculator({
  defaultIncome = 100000,
  defaultExistingEmi = 10000,
  defaultRate = 8.5,
  defaultYears = 20,
  className = "",
  showHeader = true,
}) {
  const [monthlyIncome, setMonthlyIncome] = useState(defaultIncome);
  const [existingEmi, setExistingEmi] = useState(defaultExistingEmi);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const eligibleEmi = Math.max(0, monthlyIncome * FOIR - existingEmi);
  const loanEligibility =
    eligibleEmi > 0 ? loanFromEmi(eligibleEmi, rate, years) : 0;

  return (
    <CalculatorLayout
      label="Home Loan Eligibility Calculator"
      title="Estimate how much home loan you may qualify for"
      description="Based on monthly income, existing EMIs, interest rate, and tenure using a common 50% income-to-EMI guideline."
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/home-loan-eligibility-calculator"
      simplifiedModelNotice
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
        </>
      }
      results={
        <CalculatorResults
          primary={{
            label: "Estimated Loan Eligibility",
            value: formatCurrency(loanEligibility),
          }}
          metrics={[
            { label: "Eligible EMI", value: formatCurrency(eligibleEmi) },
            { label: "Monthly Income", value: formatCurrency(monthlyIncome) },
            { label: "Existing Monthly EMI", value: formatCurrency(existingEmi) },
            { label: "Loan Tenure", value: `${years} years` },
          ]}
          story="This estimate uses a simplified income-to-EMI guideline. Banks may apply different FOIR limits, credit checks, and co-applicant rules."
        />
      }
    />
  );
}

export default HomeLoanEligibilityCalculator;
