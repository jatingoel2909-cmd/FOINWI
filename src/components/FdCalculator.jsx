import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const FD_LIMITS = {
  deposit: { min: 10000, max: 10000000, step: 10000 },
  rate: { min: 3, max: 12, step: 0.1 },
  years: { min: 1, max: 10, step: 1 },
};

const COMPOUNDING_OPTIONS = [
  { value: "yearly", label: "Yearly", periods: 1 },
  { value: "half-yearly", label: "Half-Yearly", periods: 2 },
  { value: "quarterly", label: "Quarterly", periods: 4 },
  { value: "monthly", label: "Monthly", periods: 12 },
];

function calculateMaturity(deposit, annualRate, years, periodsPerYear) {
  if (annualRate === 0) return deposit;
  const rateDecimal = annualRate / 100;
  return deposit * Math.pow(1 + rateDecimal / periodsPerYear, periodsPerYear * years);
}

function FdCalculator({
  defaultDeposit = 500000,
  defaultRate = 7,
  defaultYears = 5,
  defaultFrequency = "quarterly",
  className = "",
  showHeader = true,
}) {
  const [deposit, setDeposit] = useState(defaultDeposit);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);
  const [frequency, setFrequency] = useState(defaultFrequency);

  const periodsPerYear =
    COMPOUNDING_OPTIONS.find((option) => option.value === frequency)?.periods ?? 4;

  const maturityAmount = calculateMaturity(deposit, rate, years, periodsPerYear);
  const interestEarned = maturityAmount - deposit;

  return (
    <CalculatorLayout
      label="FD Calculator"
      title="Grow your savings with certainty"
      description="Calculate fixed deposit maturity value based on deposit amount, interest rate, tenure, and compounding frequency."
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/fd-calculator"
      form={
        <>
          <CurrencyInput
            id="fd-deposit"
            label="Deposit Amount"
            value={deposit}
            onChange={setDeposit}
            limits={FD_LIMITS.deposit}
          />
          <InputField
            id="fd-rate"
            label="Interest Rate (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={FD_LIMITS.rate}
          />
          <InputField
            id="fd-years"
            label="Tenure (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={FD_LIMITS.years}
          />
          <div className="calc-field">
            <label className="calc-field__label" htmlFor="fd-frequency">
              Compounding Frequency
            </label>
            <select
              id="fd-frequency"
              className="calc-field__select"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              {COMPOUNDING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Maturity Value", value: formatCurrency(maturityAmount) }}
          metrics={[
            { label: "Principal", value: formatCurrency(deposit) },
            { label: "Interest Earned", value: formatCurrency(interestEarned) },
            { label: "Tenure", value: `${years} years` },
          ]}
          story="This estimate assumes the selected interest rate remains constant for the full tenure."
        />
      }
    />
  );
}

export default FdCalculator;
