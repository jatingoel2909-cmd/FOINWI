import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const EMI_LIMITS = {
  principal: { min: 100000, max: 10000000, step: 50000 },
  rate: { min: 6, max: 20, step: 0.1 },
  years: { min: 1, max: 30, step: 1 },
};

function calculateEmi(principal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function EmiCalculator({
  defaultPrincipal = 5000000,
  defaultRate = 9,
  defaultYears = 20,
  className = "",
  showHeader = true,
}) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const months = years * 12;
  const emi = calculateEmi(principal, rate, years);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;

  return (
    <CalculatorLayout
      label="EMI Calculator"
      title="Plan your loan with confidence"
      description="Estimate monthly EMI, total interest, and overall repayment based on loan amount, interest rate, and tenure."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/emi-calculator"
      form={
        <>
          <CurrencyInput
            id="emi-principal"
            label="Loan Amount"
            value={principal}
            onChange={setPrincipal}
            limits={EMI_LIMITS.principal}
          />
          <InputField
            id="emi-rate"
            label="Interest Rate (% yearly)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={EMI_LIMITS.rate}
          />
          <InputField
            id="emi-years"
            label="Loan Tenure (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={EMI_LIMITS.years}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Monthly EMI", value: formatCurrency(emi) }}
          metrics={[
            { label: "Loan Amount", value: formatCurrency(principal) },
            { label: "Interest Paid", value: formatCurrency(totalInterest) },
            { label: "Total Repayment", value: formatCurrency(totalPayment) },
          ]}
          story="A significant portion of long-term repayment is interest. Paying extra toward principal can reduce total interest."
        />
      }
    />
  );
}

export default EmiCalculator;
