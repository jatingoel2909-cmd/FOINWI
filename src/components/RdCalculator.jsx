import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const RD_LIMITS = {
  monthly: { min: 500, max: 100000, step: 500 },
  rate: { min: 3, max: 12, step: 0.1 },
  years: { min: 1, max: 10, step: 1 },
};

function calculateRdMaturity(monthlyDeposit, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return monthlyDeposit * months;
  }

  return (
    monthlyDeposit *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate))
  );
}

function RdCalculator({
  defaultMonthly = 5000,
  defaultRate = 7,
  defaultYears = 5,
  className = "",
  showHeader = true,
}) {
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const months = years * 12;
  const totalInvested = monthly * months;
  const maturityValue = calculateRdMaturity(monthly, rate, years);
  const interestEarned = maturityValue - totalInvested;

  return (
    <CalculatorLayout
      label="RD Calculator"
      title="Plan your recurring deposit growth"
      description="Calculate RD maturity value based on monthly deposit, interest rate, and tenure."
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/rd-calculator"
      form={
        <>
          <CurrencyInput
            id="rd-monthly"
            label="Monthly Deposit"
            value={monthly}
            onChange={setMonthly}
            limits={RD_LIMITS.monthly}
          />
          <InputField
            id="rd-rate"
            label="Interest Rate (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={RD_LIMITS.rate}
          />
          <InputField
            id="rd-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={RD_LIMITS.years}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Maturity Value", value: formatCurrency(maturityValue) }}
          metrics={[
            { label: "Monthly Deposit", value: formatCurrency(monthly) },
            { label: "Total Invested", value: formatCurrency(totalInvested) },
            { label: "Interest Earned", value: formatCurrency(interestEarned) },
            { label: "Tenure", value: `${years} years` },
          ]}
          story="Recurring deposits grow through regular monthly contributions. This estimate assumes a constant interest rate for the full tenure."
        />
      }
    />
  );
}

export default RdCalculator;
