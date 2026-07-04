import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import ResultCard from "./ui/ResultCard";
import { formatCurrency } from "../utils/calculatorFormat";

const SIP_LIMITS = {
  monthly: { min: 500, max: 1000000, step: 500 },
  rate: { min: 1, max: 30, step: 0.5 },
  years: { min: 1, max: 40, step: 1 },
};

function SipCalculator({
  defaultMonthly = 10000,
  defaultRate = 12,
  defaultYears = 15,
  className = "",
  showHeader = true,
}) {
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  const futureValue =
    monthlyRate === 0
      ? monthly * months
      : monthly *
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate));

  const invested = monthly * months;
  const returns = futureValue - invested;

  return (
    <CalculatorLayout
      label="SIP Calculator"
      title="Plan your wealth with clarity"
      description="Calculate estimated SIP returns based on monthly investment, expected annual return and investment period."
      showHeader={showHeader}
      variant="default"
      className={className}
      form={
        <>
          <CurrencyInput
            id="sip-monthly"
            label="Monthly Investment"
            value={monthly}
            onChange={setMonthly}
            limits={SIP_LIMITS.monthly}
          />
          <InputField
            id="sip-rate"
            label="Expected Return (% yearly)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={SIP_LIMITS.rate}
          />
          <InputField
            id="sip-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={SIP_LIMITS.years}
          />
        </>
      }
      results={
        <>
          <ResultCard
            key={formatCurrency(invested)}
            label="Total Invested"
            value={formatCurrency(invested)}
          />
          <ResultCard
            key={formatCurrency(returns)}
            label="Estimated Returns"
            value={formatCurrency(returns)}
          />
          <ResultCard
            key={formatCurrency(futureValue)}
            label="Future Value"
            value={formatCurrency(futureValue)}
            highlight
          />
        </>
      }
    />
  );
}

export default SipCalculator;
