import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import { formatCurrency } from "../utils/calculatorFormat";
import {
  calculateIncomeTaxEstimate,
  compareRegimeEstimates,
} from "../utils/incomeTax/incomeTaxEngine.js";
import {
  INCOME_TAX_INPUT_LIMITS,
  INCOME_TAX_PERIOD,
  INCOME_TAX_REGIMES,
  NEW_STANDARD_DEDUCTION,
  OLD_STANDARD_DEDUCTION,
  SECTION_87A_EDUCATIONAL_SCOPE_NOTE,
} from "../utils/incomeTax/incomeTaxRules.js";

const REGIMES = [
  { value: INCOME_TAX_REGIMES.NEW, label: "New Regime" },
  { value: INCOME_TAX_REGIMES.OLD, label: "Old Regime" },
];

function regimeComparisonNote(lowerEstimatedRegime) {
  if (lowerEstimatedRegime === INCOME_TAX_REGIMES.NEW) {
    return "New regime has the lower estimated tax in this simplified scenario.";
  }
  if (lowerEstimatedRegime === INCOME_TAX_REGIMES.OLD) {
    return "Old regime has the lower estimated tax in this simplified scenario.";
  }
  return "Both regimes produce the same estimated tax in this simplified scenario.";
}

function IncomeTaxCalculator({
  defaultIncome = 1200000,
  defaultDeductions = 0,
  defaultRegime = INCOME_TAX_REGIMES.NEW,
  className = "",
  showHeader = true,
}) {
  const [annualSalaryIncome, setAnnualSalaryIncome] = useState(defaultIncome);
  const [eligibleDeductions, setEligibleDeductions] = useState(defaultDeductions);
  const [regime, setRegime] = useState(defaultRegime);

  const estimate = calculateIncomeTaxEstimate({
    annualSalaryIncome,
    regime,
    eligibleDeductions,
  });
  const comparison = compareRegimeEstimates({
    annualSalaryIncome,
    eligibleDeductions,
  });
  const isNewRegime = estimate.regime === INCOME_TAX_REGIMES.NEW;

  return (
    <CalculatorLayout
      label="Income Tax Calculator"
      title="Educational tax estimate"
      description="This calculator provides a simplified estimate for FY 2025-26 (AY 2026-27). Actual tax liability can differ based on residency, age, income type, exemptions, deductions, special-rate income, rebate eligibility, surcharge, marginal relief and other provisions."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/income-tax-calculator"
      simplifiedModelNotice
      form={
        <>
          <p className="calc-field__helper" id="it-period">
            {INCOME_TAX_PERIOD.label}. Educational estimate for salary income.
            Old-regime slabs are for an individual below 60 years. Surcharge is
            not modelled, so this estimator is scoped to income up to ₹50 lakh.
            {" "}
            {SECTION_87A_EDUCATIONAL_SCOPE_NOTE}
          </p>
          <CurrencyInput
            id="it-income"
            label="Annual Salary Income"
            value={annualSalaryIncome}
            onChange={setAnnualSalaryIncome}
            limits={INCOME_TAX_INPUT_LIMITS.annualSalaryIncome}
          />
          <p className="calc-field__helper" id="it-income-helper">
            This field is treated as salary income for the educational estimate.
            {isNewRegime
              ? ` A salary standard deduction of up to ₹${NEW_STANDARD_DEDUCTION.toLocaleString("en-IN")} is applied, or salary income if lower.`
              : ` A salary standard deduction of up to ₹${OLD_STANDARD_DEDUCTION.toLocaleString("en-IN")} is applied, or salary income if lower.`}
          </p>
          <div className="calc-field">
            <label className="calc-field__label" htmlFor="it-regime">
              Regime
            </label>
            <select
              id="it-regime"
              className="calc-field__select"
              value={regime}
              onChange={(e) => setRegime(e.target.value)}
              aria-describedby="it-regime-helper"
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
              New-regime estimation applies only the salary standard deduction
              supported here. It does not include every deduction that may be
              available under the new regime.
            </p>
          ) : (
            <>
              <p className="calc-field__helper" id="it-regime-helper">
                Old-regime estimation is scoped to an individual below 60 years.
                The salary standard deduction is applied first and is separate
                from amounts entered below. Enter only additional amounts you
                want this simplified estimate to treat as eligible deductions.
                Limits and eligibility, including any 80C items, still apply
                outside this calculator.
              </p>
              <CurrencyInput
                id="it-deductions"
                label="Eligible deductions considered for this simplified estimate"
                value={eligibleDeductions}
                onChange={setEligibleDeductions}
                limits={INCOME_TAX_INPUT_LIMITS.eligibleDeductions}
              />
            </>
          )}
        </>
      }
      results={
        <CalculatorResults
          headerTitle="Educational tax estimate"
          headerSubtitle={INCOME_TAX_PERIOD.label}
          primary={{
            label: "Estimated total tax",
            value: formatCurrency(estimate.estimatedTax),
          }}
          metrics={[
            { label: "Income considered", value: formatCurrency(estimate.incomeConsidered) },
            {
              label: "Salary standard deduction",
              value: formatCurrency(estimate.standardDeduction),
            },
            {
              label: "Other deductions considered",
              value: isNewRegime ? "Not applied" : formatCurrency(estimate.otherDeductions),
            },
            { label: "Estimated taxable income", value: formatCurrency(estimate.taxableIncome) },
            { label: "Slab tax", value: formatCurrency(estimate.slabTax) },
            {
              label: "Section 87A rebate",
              value: estimate.rebate > 0 ? formatCurrency(estimate.rebate) : "Not applied",
            },
            {
              label: "Section 87A marginal relief",
              value: estimate.marginalRelief > 0 ? formatCurrency(estimate.marginalRelief) : "Not applied",
            },
            {
              label: "Tax after rebate / relief",
              value: formatCurrency(estimate.taxAfterRebate),
            },
            {
              label: "Health & Education Cess",
              value: formatCurrency(estimate.cess),
            },
            { label: "Surcharge", value: "Not modelled" },
            {
              label: "Regime",
              value: isNewRegime ? "New Regime" : "Old Regime · below 60",
            },
          ]}
          story={`${regimeComparisonNote(comparison.lowerEstimatedRegime)} ${SECTION_87A_EDUCATIONAL_SCOPE_NOTE} Surcharge is not modelled.`}
        />
      }
    />
  );
}

export default IncomeTaxCalculator;
