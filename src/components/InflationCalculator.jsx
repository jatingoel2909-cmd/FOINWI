import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorFormula from "./ui/CalculatorFormula";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import ResultCard from "./ui/ResultCard";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  amount: { min: 1000, max: 10000000, step: 1000 },
  rate: { min: 1, max: 15, step: 0.1 },
  years: { min: 1, max: 40, step: 1 },
};

function calculateInflation(amount, rate, years) {
  const futureCost = amount * Math.pow(1 + rate / 100, years);
  return { futureCost, increase: futureCost - amount };
}

function InflationCalculator({
  defaultAmount = 100000,
  defaultRate = 6,
  defaultYears = 10,
  className = "",
  showHeader = true,
}) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const { futureCost, increase } = calculateInflation(amount, rate, years);

  return (
    <CalculatorLayout
      label="Inflation Calculator"
      title="Understand the rising cost of living"
      description="See how inflation affects purchasing power over time and how much an expense today may cost in the future."
      showHeader={showHeader}
      variant="default"
      className={className}
      form={
        <>
          <CurrencyInput
            id="inflation-amount"
            label="Current Amount"
            value={amount}
            onChange={setAmount}
            limits={LIMITS.amount}
          />
          <InputField
            id="inflation-rate"
            label="Inflation Rate (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <InputField
            id="inflation-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={LIMITS.years}
          />
        </>
      }
      results={
        <>
          <ResultCard
            key={formatCurrency(futureCost)}
            label="Future Cost"
            value={formatCurrency(futureCost)}
            highlight
          />
          <ResultCard
            key={formatCurrency(increase)}
            label="Increase in Cost"
            value={formatCurrency(increase)}
          />
        </>
      }
      formula={
        <CalculatorFormula
          formula="Future Cost = Current Amount × (1 + Inflation Rate)^Years"
          explanation="This shows how much money you would need in the future to match today's purchasing power."
        />
      }
    />
  );
}

export default InflationCalculator;
