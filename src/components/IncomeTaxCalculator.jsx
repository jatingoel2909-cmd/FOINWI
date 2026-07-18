import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  income: { min: 100000, max: 50000000, step: 50000 },
  deductions: { min: 0, max: 5000000, step: 10000 },
};

const REGIMES = [
  { value: "old", label: "Old Regime" },
  { value: "new", label: "New Regime" },
];

function calculateOldRegimeTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  let tax = 0;

  if (taxableIncome > 250000) {
    tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
  }
  if (taxableIncome > 500000) {
    tax += Math.min(taxableIncome - 500000, 500000) * 0.2;
  }
  if (taxableIncome > 1000000) {
    tax += (taxableIncome - 1000000) * 0.3;
  }

  return tax * 1.04;
}

function calculateNewRegimeTax(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  let tax = 0;

  if (taxableIncome > 300000) {
    tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
  }
  if (taxableIncome > 700000) {
    tax += Math.min(taxableIncome - 700000, 300000) * 0.1;
  }
  if (taxableIncome > 1000000) {
    tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
  }
  if (taxableIncome > 1200000) {
    tax += Math.min(taxableIncome - 1200000, 300000) * 0.2;
  }
  if (taxableIncome > 1500000) {
    tax += (taxableIncome - 1500000) * 0.3;
  }

  return tax * 1.04;
}

function IncomeTaxCalculator({
  defaultIncome = 1200000,
  defaultDeductions = 150000,
  defaultRegime = "new",
  className = "",
  showHeader = true,
}) {
  const [annualIncome, setAnnualIncome] = useState(defaultIncome);
  const [deductions, setDeductions] = useState(defaultDeductions);
  const [regime, setRegime] = useState(defaultRegime);

  const taxableIncome =
    regime === "old"
      ? Math.max(0, annualIncome - deductions)
      : Math.max(0, annualIncome - 75000);

  const estimatedTax =
    regime === "old"
      ? calculateOldRegimeTax(taxableIncome)
      : calculateNewRegimeTax(taxableIncome);

  const netIncome = Math.max(0, annualIncome - estimatedTax);
  const isNewRegime = regime === "new";

  return (
    <CalculatorLayout
      label="Income Tax Calculator"
      title="Estimate your income tax liability"
      description="Approximate tax calculation for Old and New regimes using simplified Indian income tax slabs."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/income-tax-calculator"
      simplifiedModelNotice
      form={
        <>
          <CurrencyInput
            id="it-income"
            label="Annual Income"
            value={annualIncome}
            onChange={setAnnualIncome}
            limits={LIMITS.income}
          />
          <div className="calc-field">
            <label className="calc-field__label" htmlFor="it-regime">
              Regime
            </label>
            <select
              id="it-regime"
              className="calc-field__select"
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              aria-describedby={isNewRegime ? "it-regime-helper" : undefined}
            >
              {REGIMES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {isNewRegime ? (
            <p className="calc-field__helper" id="it-regime-helper">
              The New Regime automatically applies the standard deduction where applicable.
              Additional deductions are not required.
            </p>
          ) : (
            <CurrencyInput
              id="it-deductions"
              label="Deductions"
              value={deductions}
              onChange={setDeductions}
              limits={LIMITS.deductions}
            />
          )}
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Estimated Tax", value: formatCurrency(estimatedTax) }}
          metrics={[
            { label: "Annual Income", value: formatCurrency(annualIncome) },
            { label: "Taxable Income", value: formatCurrency(taxableIncome) },
            { label: "Net Income", value: formatCurrency(netIncome) },
            {
              label: "Regime",
              value: isNewRegime ? "New Regime" : "Old Regime",
            },
          ]}
          story="This simplified estimate compares tax under your selected regime. Actual liability can change with exemptions, rebates, and filing details."
        />
      }
    />
  );
}

export default IncomeTaxCalculator;
