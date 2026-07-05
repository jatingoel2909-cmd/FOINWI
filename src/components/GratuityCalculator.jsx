import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorFormula from "./ui/CalculatorFormula";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import ResultCard from "./ui/ResultCard";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  salary: { min: 5000, max: 500000, step: 1000 },
  years: { min: 5, max: 40, step: 1 },
};

function calculateGratuity(monthlySalary, years) {
  if (years < 5) return 0;
  return (monthlySalary * 15 * years) / 26;
}

function GratuityCalculator({
  defaultSalary = 50000,
  defaultYears = 10,
  className = "",
  showHeader = true,
}) {
  const [salary, setSalary] = useState(defaultSalary);
  const [years, setYears] = useState(defaultYears);

  const gratuity = calculateGratuity(salary, years);

  return (
    <CalculatorLayout
      label="Gratuity Calculator"
      title="Estimate your gratuity payout"
      description="Calculate gratuity based on last drawn salary and years of service under the Payment of Gratuity Act."
      showHeader={showHeader}
      variant="alt"
      className={className}
      form={
        <>
          <CurrencyInput
            id="gratuity-salary"
            label="Last Drawn Monthly Salary (Basic + DA)"
            value={salary}
            onChange={setSalary}
            limits={LIMITS.salary}
          />
          <InputField
            id="gratuity-years"
            label="Years of Service"
            value={years}
            onChange={setYears}
            format="years"
            limits={LIMITS.years}
          />
        </>
      }
      results={
        <ResultCard
          key={formatCurrency(gratuity)}
          label="Gratuity Amount"
          value={formatCurrency(gratuity)}
          highlight
        />
      }
      formula={
        <CalculatorFormula
          formula="Gratuity = (Monthly Salary × 15 × Years of Service) / 26"
          explanation="Eligible employees with at least 5 years of continuous service qualify for gratuity under Indian law."
        />
      }
    />
  );
}

export default GratuityCalculator;
