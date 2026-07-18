import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const SWP_LIMITS = {
  corpus: { min: 100000, max: 50000000, step: 50000 },
  withdrawal: { min: 1000, max: 500000, step: 1000 },
  rate: { min: 1, max: 20, step: 0.5 },
  years: { min: 1, max: 30, step: 1 },
};

function calculateSwp(corpus, monthlyWithdrawal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  let balance = corpus;
  let totalWithdrawal = 0;

  for (let month = 0; month < months; month += 1) {
    balance *= 1 + monthlyRate;
    balance -= monthlyWithdrawal;
    totalWithdrawal += monthlyWithdrawal;
    if (balance <= 0) {
      balance = 0;
      break;
    }
  }

  const remainingValue = Math.max(balance, 0);
  const estimatedReturns = remainingValue + totalWithdrawal - corpus;

  return { totalWithdrawal, remainingValue, estimatedReturns };
}

function SwpCalculator({
  defaultCorpus = 5000000,
  defaultWithdrawal = 25000,
  defaultRate = 10,
  defaultYears = 15,
  className = "",
  showHeader = true,
}) {
  const [corpus, setCorpus] = useState(defaultCorpus);
  const [withdrawal, setWithdrawal] = useState(defaultWithdrawal);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const { totalWithdrawal, remainingValue, estimatedReturns } = calculateSwp(
    corpus,
    withdrawal,
    rate,
    years
  );

  return (
    <CalculatorLayout
      label="SWP Calculator"
      title="Plan systematic withdrawals wisely"
      description="Estimate total withdrawal, remaining corpus, and returns when withdrawing monthly from your investment."
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/swp-calculator"
      form={
        <>
          <CurrencyInput
            id="swp-corpus"
            label="Initial Corpus"
            value={corpus}
            onChange={setCorpus}
            limits={SWP_LIMITS.corpus}
          />
          <CurrencyInput
            id="swp-withdrawal"
            label="Monthly Withdrawal"
            value={withdrawal}
            onChange={setWithdrawal}
            limits={SWP_LIMITS.withdrawal}
          />
          <InputField
            id="swp-rate"
            label="Expected Return (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={SWP_LIMITS.rate}
          />
          <InputField
            id="swp-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={SWP_LIMITS.years}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Remaining Value", value: formatCurrency(remainingValue) }}
          metrics={[
            { label: "Initial Corpus", value: formatCurrency(corpus) },
            { label: "Total Withdrawal", value: formatCurrency(totalWithdrawal) },
            { label: "Estimated Returns", value: formatCurrency(estimatedReturns) },
            { label: "Monthly Withdrawal", value: formatCurrency(withdrawal) },
          ]}
          story="Systematic withdrawals depend on both return assumptions and withdrawal size. A zero remaining value means the corpus may be exhausted within the period."
        />
      }
    />
  );
}

export default SwpCalculator;
