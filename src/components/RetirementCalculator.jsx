import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  expense: { min: 10000, max: 500000, step: 1000 },
  corpus: { min: 0, max: 50000000, step: 50000 },
  inflation: { min: 1, max: 12, step: 0.5 },
  rate: { min: 1, max: 20, step: 0.5 },
  currentAge: { min: 18, max: 58, step: 1 },
  retirementAge: { min: 40, max: 70, step: 1 },
};

function calculateRequiredMonthlySip(target, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  if (target <= 0) return 0;
  if (monthlyRate === 0) return target / months;
  return (
    target /
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
  );
}

function RetirementCalculator({
  defaultCurrentAge = 30,
  defaultRetirementAge = 60,
  defaultExpense = 50000,
  defaultInflation = 6,
  defaultRate = 10,
  defaultCorpus = 500000,
  className = "",
  showHeader = true,
}) {
  const [currentAge, setCurrentAge] = useState(defaultCurrentAge);
  const [retirementAge, setRetirementAge] = useState(defaultRetirementAge);
  const [expense, setExpense] = useState(defaultExpense);
  const [inflation, setInflation] = useState(defaultInflation);
  const [rate, setRate] = useState(defaultRate);
  const [corpus, setCorpus] = useState(defaultCorpus);

  const years = Math.max(retirementAge - currentAge, 1);
  const expenseAtRetirement = expense * Math.pow(1 + inflation / 100, years);
  const corpusNeeded = expenseAtRetirement * 12 * 25;
  const projectedCorpus = corpus * Math.pow(1 + rate / 100, years);
  const shortfall = Math.max(corpusNeeded - projectedCorpus, 0);
  const monthlySipRequired = calculateRequiredMonthlySip(shortfall, rate, years);

  return (
    <CalculatorLayout
      label="Retirement Calculator"
      title="Estimate your retirement corpus needs"
      description="Calculate how much you need at retirement based on inflated expenses and whether your current corpus is sufficient."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/retirement-calculator"
      form={
        <>
          <InputField
            id="retire-current-age"
            label="Current Age"
            value={currentAge}
            onChange={setCurrentAge}
            format="number"
            limits={LIMITS.currentAge}
          />
          <InputField
            id="retire-retirement-age"
            label="Retirement Age"
            value={retirementAge}
            onChange={setRetirementAge}
            format="number"
            limits={LIMITS.retirementAge}
          />
          <CurrencyInput
            id="retire-expense"
            label="Current Monthly Expense"
            value={expense}
            onChange={setExpense}
            limits={LIMITS.expense}
          />
          <InputField
            id="retire-inflation"
            label="Inflation Rate (%)"
            value={inflation}
            onChange={setInflation}
            format="percent"
            limits={LIMITS.inflation}
          />
          <InputField
            id="retire-rate"
            label="Expected Return (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <CurrencyInput
            id="retire-corpus"
            label="Current Retirement Corpus"
            value={corpus}
            onChange={setCorpus}
            limits={LIMITS.corpus}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Target Corpus", value: formatCurrency(corpusNeeded) }}
          metrics={[
            { label: "Projected Corpus", value: formatCurrency(projectedCorpus) },
            { label: "Monthly Investment", value: formatCurrency(monthlySipRequired) },
            { label: "Shortfall", value: formatCurrency(shortfall) },
          ]}
          story="Your projected corpus may or may not meet your retirement goal depending on inflation and future contributions."
        />
      }
    />
  );
}

export default RetirementCalculator;
