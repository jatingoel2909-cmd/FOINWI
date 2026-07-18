import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  outstanding: { min: 100000, max: 10000000, step: 50000 },
  rate: { min: 6, max: 20, step: 0.1 },
  years: { min: 1, max: 30, step: 1 },
  prepayment: { min: 10000, max: 5000000, step: 10000 },
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

function monthsToRepay(principal, emi, annualRate) {
  const monthlyRate = annualRate / 12 / 100;

  if (principal <= 0) return 0;
  if (monthlyRate === 0) return Math.ceil(principal / emi);

  const minEmi = principal * monthlyRate;
  if (emi <= minEmi) return Infinity;

  return Math.ceil(
    Math.log(emi / (emi - principal * monthlyRate)) / Math.log(1 + monthlyRate)
  );
}

function LoanPrepaymentCalculator({
  defaultOutstanding = 3000000,
  defaultRate = 9,
  defaultYears = 15,
  defaultPrepayment = 200000,
  className = "",
  showHeader = true,
}) {
  const [outstanding, setOutstanding] = useState(defaultOutstanding);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);
  const [prepayment, setPrepayment] = useState(defaultPrepayment);

  const months = years * 12;
  const emi = calculateEmi(outstanding, rate, years);
  const originalInterest = emi * months - outstanding;
  const newOutstanding = Math.max(0, outstanding - prepayment);

  let interestSaved = originalInterest;
  let revisedImpact = "Loan fully closed";

  if (newOutstanding > 0 && prepayment < outstanding) {
    const newMonths = monthsToRepay(newOutstanding, emi, rate);
    if (Number.isFinite(newMonths)) {
      const newInterest = emi * newMonths - newOutstanding;
      interestSaved = Math.max(0, originalInterest - newInterest);
      const monthsSaved = months - newMonths;
      revisedImpact =
        monthsSaved >= 12
          ? `${Math.round((monthsSaved / 12) * 10) / 10} years saved`
          : `${monthsSaved} months saved`;
    }
  } else if (prepayment >= outstanding) {
    interestSaved = originalInterest;
    revisedImpact = "Loan fully closed";
  }

  return (
    <CalculatorLayout
      label="Loan Prepayment Calculator"
      title="See how prepayment reduces interest"
      description="Estimate interest saved when you prepay part of your loan while keeping the same EMI and shortening tenure."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/loan-prepayment-calculator"
      form={
        <>
          <CurrencyInput
            id="lp-outstanding"
            label="Outstanding Loan Amount"
            value={outstanding}
            onChange={setOutstanding}
            limits={LIMITS.outstanding}
          />
          <InputField
            id="lp-rate"
            label="Interest Rate (% yearly)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <InputField
            id="lp-years"
            label="Remaining Tenure (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={LIMITS.years}
          />
          <CurrencyInput
            id="lp-prepayment"
            label="Prepayment Amount"
            value={prepayment}
            onChange={setPrepayment}
            limits={LIMITS.prepayment}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Interest Saved", value: formatCurrency(interestSaved) }}
          metrics={[
            { label: "Prepayment Amount", value: formatCurrency(prepayment) },
            { label: "New Outstanding Amount", value: formatCurrency(newOutstanding) },
            { label: "Revised Loan Impact", value: revisedImpact },
          ]}
          story="Prepaying principal can reduce remaining interest when EMI stays the same and tenure shortens. Fees or lender rules are not included here."
        />
      }
    />
  );
}

export default LoanPrepaymentCalculator;
