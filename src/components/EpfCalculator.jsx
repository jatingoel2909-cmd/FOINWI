import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";
import { calculateEpfEstimate } from "../utils/epf/epfEngine.js";
import {
  EPF_CEILING_LABEL,
  EPF_CEILING_NOTE,
  EPF_CONTRIBUTION_WAGE_LABEL,
  EPF_HIGHER_WAGE_SCOPE_NOTE,
  EPF_ILLUSTRATIVE_INTEREST_RATE,
  EPF_INPUT_LIMITS,
  EPF_INTEREST_HELPER_NOTE,
  EPF_INTEREST_INPUT_LABEL,
  EPF_LEGAL_FRAMEWORK,
  EPF_NEW_JOINER_SCOPE_NOTE,
  EPF_PROJECTION_METHOD_NOTE,
  EPF_RATE_OPERATIONAL_NOTE,
  EPF_SCHEME_FRAMEWORK_NOTE,
  EPF_SCOPE_NOTE,
  EPF_TEN_PERCENT_SCOPE_NOTE,
  EPF_WAGE_BASIS_LABEL,
  EPF_WAGE_CEILING,
  EPF_WAGE_HELPER_NOTE,
} from "../utils/epf/epfRules.js";

function EpfCalculator({
  defaultPFWages = 30000,
  defaultBalance = 200000,
  defaultRate = EPF_ILLUSTRATIVE_INTEREST_RATE,
  defaultYears = 20,
  className = "",
  showHeader = true,
}) {
  const [monthlyPFWages, setMonthlyPFWages] = useState(defaultPFWages);
  const [currentBalance, setCurrentBalance] = useState(defaultBalance);
  const [annualInterestRate, setAnnualInterestRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const estimate = calculateEpfEstimate({
    monthlyPFWages,
    currentBalance,
    annualInterestRate,
    years,
  });

  return (
    <CalculatorLayout
      label="Employees' Provident Fund (EPF) Calculator"
      title="Explore an illustrative EPF accumulation estimate"
      description="Educational EPF accumulation estimate for a standard already-enrolled EPF/EPS member using statutory contribution assumptions under the Code on Social Security, 2020 and current EPFO operational treatment."
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/epf-calculator"
      simplifiedModelNotice
      form={
        <>
          <p className="calc-field__helper" id="epf-scope">
            {EPF_SCOPE_NOTE}
            {" "}
            {EPF_RATE_OPERATIONAL_NOTE}
            {" "}
            {EPF_TEN_PERCENT_SCOPE_NOTE}
            {" "}
            {EPF_HIGHER_WAGE_SCOPE_NOTE}
            {" "}
            {EPF_NEW_JOINER_SCOPE_NOTE}
            {" "}
            {EPF_SCHEME_FRAMEWORK_NOTE}
          </p>
          <CurrencyInput
            id="epf-wages"
            label={EPF_WAGE_BASIS_LABEL}
            value={monthlyPFWages}
            onChange={setMonthlyPFWages}
            limits={EPF_INPUT_LIMITS.monthlyPFWages}
          />
          <p className="calc-field__helper" id="epf-wages-helper">
            {EPF_WAGE_HELPER_NOTE}
          </p>
          <p className="calc-field__helper" id="epf-ceiling-helper">
            {EPF_CEILING_NOTE}
          </p>
          <CurrencyInput
            id="epf-balance"
            label="Current EPF Balance"
            value={currentBalance}
            onChange={setCurrentBalance}
            limits={EPF_INPUT_LIMITS.currentBalance}
          />
          <InputField
            id="epf-rate"
            label={`${EPF_INTEREST_INPUT_LABEL} (%)`}
            value={annualInterestRate}
            onChange={setAnnualInterestRate}
            format="percent"
            limits={EPF_INPUT_LIMITS.annualInterestRate}
          />
          <p className="calc-field__helper" id="epf-rate-helper">
            {EPF_INTEREST_HELPER_NOTE}
          </p>
          <InputField
            id="epf-years"
            label="Years remaining"
            value={years}
            onChange={setYears}
            format="years"
            limits={EPF_INPUT_LIMITS.years}
          />
        </>
      }
      results={
        <CalculatorResults
          headerTitle="Illustrative EPF estimate"
          headerSubtitle={`${EPF_LEGAL_FRAMEWORK} — simplified statutory contribution model`}
          primary={{
            label: "Projected EPF balance",
            value: formatCurrency(estimate.projectedBalance),
          }}
          metrics={[
            { label: EPF_WAGE_BASIS_LABEL, value: formatCurrency(estimate.monthlyPFWages) },
            { label: EPF_CONTRIBUTION_WAGE_LABEL, value: formatCurrency(estimate.contributionWage) },
            { label: EPF_CEILING_LABEL, value: formatCurrency(EPF_WAGE_CEILING) },
            { label: "Employee EPF contribution", value: formatCurrency(estimate.employeeEPF) },
            { label: "Employer total contribution", value: formatCurrency(estimate.employerTotal) },
            { label: "Employer EPS diversion", value: formatCurrency(estimate.employerEPS) },
            {
              label: "Employer EPF contribution entering corpus",
              value: formatCurrency(estimate.employerEPF),
            },
            {
              label: "Combined monthly EPF entering projected corpus",
              value: formatCurrency(estimate.monthlyEpfEnteringCorpus),
            },
            { label: "Current EPF Balance", value: formatCurrency(estimate.currentBalance) },
            {
              label: EPF_INTEREST_INPUT_LABEL,
              value: `${estimate.annualInterestRate}%`,
            },
            { label: "Years remaining", value: `${estimate.years} years` },
          ]}
          story={`${EPF_PROJECTION_METHOD_NOTE} ${EPF_RATE_OPERATIONAL_NOTE} ${EPF_CEILING_NOTE} ${EPF_INTEREST_HELPER_NOTE} ${EPF_TEN_PERCENT_SCOPE_NOTE} ${EPF_HIGHER_WAGE_SCOPE_NOTE} ${EPF_NEW_JOINER_SCOPE_NOTE}`}
        />
      }
    />
  );
}

export default EpfCalculator;
