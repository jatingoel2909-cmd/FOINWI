import { useMemo, useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import EmiLoanTypeSelector from "./emi/EmiLoanTypeSelector";
import EmiTenureComparison from "./emi/EmiTenureComparison";
import EmiLenderComparison from "./emi/EmiLenderComparison";
import { DEFAULT_LOAN_TYPE_ID, getLoanTypeById } from "../data/loanTypes";
import { calculateEmi } from "../utils/emiFormula";
import { buildTenureComparison } from "../utils/emiComparisonEngine";
import { formatCurrency } from "../utils/calculatorFormat";

const EMI_LIMITS = {
  principal: { min: 100000, max: 10000000, step: 50000 },
  rate: { min: 0, max: 20, step: 0.1 },
  years: { min: 1, max: 30, step: 1 },
};

function EmiCalculator({
  defaultPrincipal = 5000000,
  defaultRate,
  defaultYears = 20,
  defaultLoanType = DEFAULT_LOAN_TYPE_ID,
  className = "",
  showHeader = true,
}) {
  const initialLoanType = getLoanTypeById(defaultLoanType);
  const initialRate = initialLoanType?.defaultRate ?? defaultRate ?? 8.5;

  const [loanTypeId, setLoanTypeId] = useState(defaultLoanType);
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(initialRate);
  const [years, setYears] = useState(defaultYears);

  const loanType = getLoanTypeById(loanTypeId);

  const handleLoanTypeChange = (nextLoanTypeId) => {
    setLoanTypeId(nextLoanTypeId);
    const nextType = getLoanTypeById(nextLoanTypeId);
    if (nextType?.defaultRate != null) {
      setRate(nextType.defaultRate);
    }
  };

  const months = years * 12;
  const emi = calculateEmi(principal, rate, years);
  const hasValidPrimary = emi !== null && Number.isFinite(emi);
  const totalPayment = hasValidPrimary ? emi * months : 0;
  const totalInterest = hasValidPrimary ? totalPayment - principal : 0;

  const comparison = useMemo(
    () =>
      buildTenureComparison({
        principal,
        annualRate: rate,
        loanTypeId,
      }),
    [principal, rate, loanTypeId],
  );

  const minRate = loanType?.illustrativeMinRate;
  const maxRate = loanType?.illustrativeMaxRate;
  const hasRateRange =
    Number.isFinite(minRate) && Number.isFinite(maxRate);

  return (
    <CalculatorLayout
      label="EMI Calculator"
      title="Plan your loan with confidence"
      description="Estimate monthly EMI, total interest, and overall repayment based on loan amount, interest rate, and tenure. Compare how different repayment periods change EMI and interest."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/emi-calculator"
      form={
        <>
          <EmiLoanTypeSelector value={loanTypeId} onChange={handleLoanTypeChange} />
          <CurrencyInput
            id="emi-principal"
            label="Loan Amount"
            value={principal}
            onChange={setPrincipal}
            limits={EMI_LIMITS.principal}
          />
          <InputField
            id="emi-rate"
            label="Illustrative annual interest rate"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={EMI_LIMITS.rate}
          />
          {hasRateRange ? (
            <p className="calc-field__helper" id="emi-rate-range">
              Typical illustrative range: {minRate}% – {maxRate}%
              <br />
              Current calculation: {Number(rate).toFixed(1)}%
            </p>
          ) : null}
          <p className="calc-field__helper" id="emi-rate-helper">
            Rates vary by lender, credit profile, income, employment, loan amount, tenure and
            eligibility. Verify the final rate directly with the lender.
          </p>
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
        hasValidPrimary ? (
          <CalculatorResults
            primary={{ label: "Monthly EMI", value: formatCurrency(emi) }}
            metrics={[
              { label: "Loan Amount", value: formatCurrency(principal) },
              { label: "Interest Paid", value: formatCurrency(totalInterest) },
              { label: "Total Repayment", value: formatCurrency(totalPayment) },
            ]}
            story="A significant portion of long-term repayment is interest. Paying extra toward principal can reduce total interest."
          />
        ) : (
          <p className="calc-simplified-notice">
            Enter a valid loan amount, interest rate, and tenure to calculate EMI.
          </p>
        )
      }
      extension={
        <>
          <EmiTenureComparison comparison={comparison} />
          <EmiLenderComparison
            principal={principal}
            tenureMonths={months}
            loanTypeId={loanTypeId}
          />
        </>
      }
    />
  );
}

export default EmiCalculator;
