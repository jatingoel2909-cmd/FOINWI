import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  principal: { min: 1000, max: 10000000, step: 1000 },
  rate: { min: 1, max: 30, step: 0.1 },
  years: { min: 1, max: 40, step: 1 },
};

const COMPOUNDING_OPTIONS = [
  { value: "yearly", label: "Yearly", periods: 1 },
  { value: "half-yearly", label: "Half-Yearly", periods: 2 },
  { value: "quarterly", label: "Quarterly", periods: 4 },
  { value: "monthly", label: "Monthly", periods: 12 },
];

function calculateCompoundInterest(principal, annualRate, years, periodsPerYear) {
  if (annualRate === 0) return principal;

  const rateDecimal = annualRate / 100;
  return (
    principal *
    Math.pow(1 + rateDecimal / periodsPerYear, periodsPerYear * years)
  );
}

function CompoundInterestCalculator({
  defaultPrincipal = 100000,
  defaultRate = 8,
  defaultYears = 10,
  defaultFrequency = "yearly",
  className = "",
  showHeader = true,
}) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);
  const [frequency, setFrequency] = useState(defaultFrequency);

  const periodsPerYear =
    COMPOUNDING_OPTIONS.find((option) => option.value === frequency)?.periods ?? 1;
  const frequencyLabel =
    COMPOUNDING_OPTIONS.find((option) => option.value === frequency)?.label ?? "Yearly";

  const maturityAmount = calculateCompoundInterest(
    principal,
    rate,
    years,
    periodsPerYear
  );
  const interestEarned = maturityAmount - principal;

  return (
    <CalculatorLayout
      label="Compound Interest Calculator"
      title="Watch your money grow with compounding"
      description="Calculate maturity value when interest is compounded at yearly, half-yearly, quarterly, or monthly intervals."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/compound-interest-calculator"
      form={
        <>
          <CurrencyInput
            id="ci-principal"
            label="Principal Amount"
            value={principal}
            onChange={setPrincipal}
            limits={LIMITS.principal}
          />
          <InputField
            id="ci-rate"
            label="Interest Rate (% yearly)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <InputField
            id="ci-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={LIMITS.years}
          />
          <div className="calc-field">
            <label className="calc-field__label" htmlFor="ci-frequency">
              Compounding Frequency
            </label>
            <select
              id="ci-frequency"
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
          primary={{ label: "Maturity Amount", value: formatCurrency(maturityAmount) }}
          metrics={[
            { label: "Principal", value: formatCurrency(principal) },
            { label: "Interest Earned", value: formatCurrency(interestEarned) },
            { label: "Compounding", value: frequencyLabel },
            { label: "Time Period", value: `${years} years` },
          ]}
          story="More frequent compounding can increase maturity value slightly because interest is added to principal more often."
        />
      }
    />
  );
}

export default CompoundInterestCalculator;
