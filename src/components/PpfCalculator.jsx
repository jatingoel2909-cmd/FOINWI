import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const PPF_LIMITS = {
  yearly: { min: 500, max: 150000, step: 500 },
  rate: { min: 5, max: 10, step: 0.1 },
  years: { min: 15, max: 50, step: 1 },
};

function calculatePpfMaturity(yearlyInvestment, annualRate, years) {
  const rate = annualRate / 100;

  if (rate === 0) {
    return yearlyInvestment * years;
  }

  const factor = Math.pow(1 + rate, years);
  return yearlyInvestment * ((factor - 1) / rate) * (1 + rate);
}

function PpfCalculator({
  defaultYearly = 150000,
  defaultRate = 7.1,
  defaultYears = 15,
  className = "",
  showHeader = true,
}) {
  const [yearly, setYearly] = useState(defaultYearly);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const totalInvested = yearly * years;
  const maturityValue = calculatePpfMaturity(yearly, rate, years);
  const interestEarned = maturityValue - totalInvested;

  return (
    <CalculatorLayout
      label="PPF Calculator"
      title="Build long-term wealth with PPF"
      description="Estimate PPF maturity value based on yearly investment, interest rate, and investment period."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/ppf-calculator"
      form={
        <>
          <CurrencyInput
            id="ppf-yearly"
            label="Yearly Investment"
            value={yearly}
            onChange={setYearly}
            limits={PPF_LIMITS.yearly}
          />
          <InputField
            id="ppf-rate"
            label="Interest Rate (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={PPF_LIMITS.rate}
          />
          <InputField
            id="ppf-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={PPF_LIMITS.years}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Maturity Value", value: formatCurrency(maturityValue) }}
          metrics={[
            { label: "Yearly Investment", value: formatCurrency(yearly) },
            { label: "Total Invested", value: formatCurrency(totalInvested) },
            { label: "Interest Earned", value: formatCurrency(interestEarned) },
            { label: "Investment Period", value: `${years} years` },
          ]}
          story="PPF growth is modelled with annual compounding and a long lock-in. Rate assumptions may change over the full tenure."
        />
      }
    />
  );
}

export default PpfCalculator;
