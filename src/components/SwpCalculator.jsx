import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const SWP_LIMITS = {
  corpus: { min: 100000, max: 50000000, step: 50000 },
  withdrawal: { min: 1000, max: 500000, step: 1000 },
  rate: { min: 0, max: 20, step: 0.5 },
  years: { min: 1, max: 30, step: 1 },
};

function calculateSwp(corpus, monthlyWithdrawal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  let balance = corpus;
  let totalWithdrawal = 0;
  let monthsSustained = 0;

  for (let month = 0; month < months; month += 1) {
    balance *= 1 + monthlyRate;
    const availableBalance = Math.max(balance, 0);
    const actualWithdrawal = Math.min(monthlyWithdrawal, availableBalance);
    balance = availableBalance - actualWithdrawal;
    totalWithdrawal += actualWithdrawal;
    monthsSustained += 1;

    if (balance === 0) {
      break;
    }
  }

  const remainingValue = Math.max(balance, 0);
  const netInvestmentChange = remainingValue + totalWithdrawal - corpus;
  const depletedEarly = remainingValue === 0 && monthsSustained < months;

  return {
    totalWithdrawal,
    remainingValue,
    netInvestmentChange,
    monthsSustained,
    depletedEarly,
  };
}

function formatDuration(months) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const parts = [];

  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`);
  }

  return parts.join(" ") || "0 months";
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

  const {
    totalWithdrawal,
    remainingValue,
    netInvestmentChange,
    monthsSustained,
    depletedEarly,
  } = calculateSwp(
    corpus,
    withdrawal,
    rate,
    years
  );

  return (
    <CalculatorLayout
      label="Systematic Withdrawal Plan (SWP) Calculator"
      title="Plan systematic withdrawals wisely"
      description="Project total withdrawals and remaining corpus in a Systematic Withdrawal Plan (SWP) using a constant return assumption."
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
        <>
          <CalculatorResults
            primary={{ label: "Remaining Value", value: formatCurrency(remainingValue) }}
            metrics={[
              { label: "Initial Corpus", value: formatCurrency(corpus) },
              { label: "Total Withdrawal", value: formatCurrency(totalWithdrawal) },
              { label: "Net Investment Change", value: formatCurrency(netInvestmentChange) },
              { label: "Monthly Withdrawal", value: formatCurrency(withdrawal) },
            ]}
            story={
              depletedEarly
                ? `Corpus depleted after ${formatDuration(monthsSustained)}.`
                : "Corpus lasts through the selected tenure."
            }
          />
          <p className="calc-simplified-notice">
            Net Investment Change is remaining value plus withdrawals minus the initial corpus. This constant-return educational projection excludes taxes, exit loads, fund expenses, changing or inflation-adjusted withdrawals, sequence-of-returns effects, and actual mutual-fund NAV or redemption mechanics.
          </p>
        </>
      }
    />
  );
}

export default SwpCalculator;
