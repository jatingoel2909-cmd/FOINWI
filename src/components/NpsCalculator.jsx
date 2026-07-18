import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  monthly: { min: 500, max: 200000, step: 500 },
  rate: { min: 5, max: 14, step: 0.5 },
  currentAge: { min: 18, max: 58, step: 1 },
  retirementAge: { min: 40, max: 70, step: 1 },
};

function calculateSipCorpus(monthly, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) return monthly * months;

  return (
    monthly *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
  );
}

function NpsCalculator({
  defaultMonthly = 5000,
  defaultRate = 10,
  defaultCurrentAge = 30,
  defaultRetirementAge = 60,
  className = "",
  showHeader = true,
}) {
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [rate, setRate] = useState(defaultRate);
  const [currentAge, setCurrentAge] = useState(defaultCurrentAge);
  const [retirementAge, setRetirementAge] = useState(defaultRetirementAge);

  const years = Math.max(retirementAge - currentAge, 1);
  const corpus = calculateSipCorpus(monthly, rate, years);
  const totalInvested = monthly * years * 12;
  const estimatedPension = (corpus * 0.4 * 0.06) / 12;

  return (
    <CalculatorLayout
      label="NPS Calculator"
      title="Plan your National Pension System corpus"
      description="Estimate NPS retirement corpus and indicative monthly pension based on contributions until retirement."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/nps-calculator"
      form={
        <>
          <CurrencyInput
            id="nps-monthly"
            label="Monthly Contribution"
            value={monthly}
            onChange={setMonthly}
            limits={LIMITS.monthly}
          />
          <InputField
            id="nps-rate"
            label="Expected Return (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <InputField
            id="nps-current-age"
            label="Current Age"
            value={currentAge}
            onChange={setCurrentAge}
            format="number"
            limits={LIMITS.currentAge}
          />
          <InputField
            id="nps-retirement-age"
            label="Retirement Age"
            value={retirementAge}
            onChange={setRetirementAge}
            format="number"
            limits={LIMITS.retirementAge}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Corpus at Retirement", value: formatCurrency(corpus) }}
          metrics={[
            { label: "Total Invested", value: formatCurrency(totalInvested) },
            { label: "Est. Monthly Pension", value: formatCurrency(estimatedPension) },
            { label: "Contribution Years", value: `${years} years` },
          ]}
          story="The indicative pension uses a simplified annuity assumption on part of the corpus. Actual annuity rates and withdrawal rules can differ."
        />
      }
    />
  );
}

export default NpsCalculator;
