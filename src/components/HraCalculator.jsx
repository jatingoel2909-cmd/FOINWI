import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import { formatCurrency } from "../utils/calculatorFormat";
import { calculateHraEstimate } from "../utils/hra/hraEngine.js";
import {
  HRA_BASIC_LABEL,
  HRA_CITY_40_HELPER_NOTE,
  HRA_CITY_50_HELPER_NOTE,
  HRA_DA_HELPER_NOTE,
  HRA_DA_LABEL,
  HRA_FORM_124_NOTE,
  HRA_INPUT_LIMITS,
  HRA_MONTHLY_RESULT_NOTE,
  HRA_OCCUPANCY_NOTE,
  HRA_OWN_HOUSE_NOTE,
  HRA_PERIOD_NOTE,
  HRA_PRIMARY_RESULT_LABEL,
  HRA_PROJECTION_METHOD_NOTE,
  HRA_RECEIVED_LABEL,
  HRA_REGIME_NOTE,
  HRA_RENT_LABEL,
  HRA_RESIDENCE_LABEL,
  HRA_RESIDENCE_OPTIONS,
  HRA_SCOPE_NOTE,
  HRA_TAX_YEAR_LABEL,
  HRA_TAXABLE_MEANING_NOTE,
  HRA_TAXABLE_RESULT_LABEL,
  HRA_TITLE,
  HRA_CITY_CATEGORY_50,
} from "../utils/hra/hraRules.js";

function HraCalculator({
  defaultBasic = 50000,
  defaultQualifyingDA = 0,
  defaultHra = 20000,
  defaultRent = 18000,
  defaultResidenceCategory = HRA_CITY_CATEGORY_50,
  className = "",
  showHeader = true,
}) {
  const [monthlyBasicSalary, setMonthlyBasicSalary] = useState(defaultBasic);
  const [monthlyQualifyingDA, setMonthlyQualifyingDA] = useState(defaultQualifyingDA);
  const [monthlyHraReceived, setMonthlyHraReceived] = useState(defaultHra);
  const [monthlyRentPaid, setMonthlyRentPaid] = useState(defaultRent);
  const [residenceCategory, setResidenceCategory] = useState(defaultResidenceCategory);

  const estimate = calculateHraEstimate({
    monthlyBasicSalary,
    monthlyQualifyingDA,
    monthlyHraReceived,
    monthlyRentPaid,
    residenceCategory,
  });

  const residenceLabel =
    HRA_RESIDENCE_OPTIONS.find((option) => option.value === estimate.residenceCategory)?.label
    ?? estimate.residenceCategory;

  return (
    <CalculatorLayout
      label="House Rent Allowance (HRA) Calculator"
      title={HRA_TITLE}
      description={`${HRA_SCOPE_NOTE} ${HRA_TAX_YEAR_LABEL}.`}
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/hra-calculator"
      simplifiedModelNotice
      form={
        <>
          <p className="calc-field__helper" id="hra-scope">
            {HRA_SCOPE_NOTE}
            {" "}
            {HRA_REGIME_NOTE}
            {" "}
            {HRA_OCCUPANCY_NOTE}
            {" "}
            {HRA_OWN_HOUSE_NOTE}
          </p>
          <p className="calc-field__helper" id="hra-tax-year">
            {HRA_TAX_YEAR_LABEL}
          </p>
          <CurrencyInput
            id="hra-basic"
            label={HRA_BASIC_LABEL}
            value={monthlyBasicSalary}
            onChange={setMonthlyBasicSalary}
            limits={HRA_INPUT_LIMITS.monthlyBasicSalary}
          />
          <CurrencyInput
            id="hra-da"
            label={HRA_DA_LABEL}
            value={monthlyQualifyingDA}
            onChange={setMonthlyQualifyingDA}
            limits={HRA_INPUT_LIMITS.monthlyQualifyingDA}
          />
          <p className="calc-field__helper" id="hra-da-helper">
            {HRA_DA_HELPER_NOTE}
          </p>
          <CurrencyInput
            id="hra-received"
            label={HRA_RECEIVED_LABEL}
            value={monthlyHraReceived}
            onChange={setMonthlyHraReceived}
            limits={HRA_INPUT_LIMITS.monthlyHraReceived}
          />
          <CurrencyInput
            id="hra-rent"
            label={HRA_RENT_LABEL}
            value={monthlyRentPaid}
            onChange={setMonthlyRentPaid}
            limits={HRA_INPUT_LIMITS.monthlyRentPaid}
          />
          <div className="calc-field">
            <label className="calc-field__label" htmlFor="hra-residence">
              {HRA_RESIDENCE_LABEL}
            </label>
            <select
              id="hra-residence"
              className="calc-field__select"
              value={residenceCategory}
              onChange={(e) => setResidenceCategory(e.target.value)}
            >
              {HRA_RESIDENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <p className="calc-field__helper" id="hra-city-helper">
            {HRA_CITY_50_HELPER_NOTE}
            {" "}
            {HRA_CITY_40_HELPER_NOTE}
          </p>
          <p className="calc-field__helper" id="hra-period-helper">
            {HRA_PERIOD_NOTE}
            {" "}
            {HRA_MONTHLY_RESULT_NOTE}
          </p>
          <p className="calc-field__helper" id="hra-form-124">
            {HRA_FORM_124_NOTE}
          </p>
        </>
      }
      results={
        <CalculatorResults
          headerTitle="Illustrative monthly HRA estimate"
          headerSubtitle={`${HRA_TAX_YEAR_LABEL} — opt-out regime educational model`}
          primary={{
            label: HRA_PRIMARY_RESULT_LABEL,
            value: formatCurrency(estimate.estimatedMonthlyExemption),
          }}
          metrics={[
            { label: HRA_RECEIVED_LABEL, value: formatCurrency(estimate.monthlyHraReceived) },
            { label: HRA_TAXABLE_RESULT_LABEL, value: formatCurrency(estimate.monthlyTaxableHra) },
            { label: HRA_RENT_LABEL, value: formatCurrency(estimate.monthlyRentPaid) },
            { label: "Rule 279 salary", value: formatCurrency(estimate.rule279Salary) },
            { label: HRA_RESIDENCE_LABEL, value: residenceLabel },
          ]}
          story={`${HRA_PROJECTION_METHOD_NOTE} ${HRA_TAXABLE_MEANING_NOTE} ${HRA_PERIOD_NOTE} ${HRA_REGIME_NOTE}`}
        />
      }
    />
  );
}

export default HraCalculator;
