import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
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
      calculatorId="/gratuity-calculator"
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
        <CalculatorResults
          primary={{ label: "Gratuity Amount", value: formatCurrency(gratuity) }}
          metrics={[
            { label: "Monthly Salary (Basic + DA)", value: formatCurrency(salary) },
            { label: "Years of Service", value: `${years} years` },
          ]}
          story="This estimate uses the standard gratuity formula for eligible service length. Actual payout can depend on employer rules and statutory limits."
        />
      }
    />
  );
}

export default GratuityCalculator;
