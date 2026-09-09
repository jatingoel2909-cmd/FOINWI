import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";
import { calculateGratuityEstimate } from "../utils/gratuity/gratuityEngine.js";
import {
  GRATUITY_BETTER_TERMS_NOTE,
  GRATUITY_CEILING_APPLIED_NOTE,
  GRATUITY_CEILING_LABEL,
  GRATUITY_CEILING_SUPPORTING_NOTE,
  GRATUITY_FIVE_YEAR_NOTE,
  GRATUITY_FIXED_TERM_NOTE,
  GRATUITY_FRAMEWORK_EFFECTIVE_DATE,
  GRATUITY_INPUT_LIMITS,
  GRATUITY_LEGAL_FRAMEWORK,
  GRATUITY_SCOPE_NOTE,
  GRATUITY_STATUTORY_CEILING,
  GRATUITY_WAGE_BASIS_LABEL,
  GRATUITY_WAGE_HELPER_NOTE,
} from "../utils/gratuity/gratuityRules.js";

function GratuityCalculator({
  defaultStatutoryWages = 50000,
  defaultYears = 10,
  defaultAdditionalMonths = 0,
  className = "",
  showHeader = true,
}) {
  const [lastDrawnStatutoryWages, setLastDrawnStatutoryWages] = useState(defaultStatutoryWages);
  const [completedYears, setCompletedYears] = useState(defaultYears);
  const [additionalMonths, setAdditionalMonths] = useState(defaultAdditionalMonths);

  const estimate = calculateGratuityEstimate({
    lastDrawnStatutoryWages,
    completedYears,
    additionalMonths,
  });
  const ineligible = estimate.eligibleUnderGeneralRule === false;
  const payableValue = ineligible
    ? "Not estimated under the general five-year rule"
    : formatCurrency(estimate.estimatedGratuity);
  const formulaValue = ineligible
    ? "Not estimated under the general five-year rule"
    : formatCurrency(estimate.uncappedGratuity);
  const ceilingNote = estimate.ceilingApplied ? ` ${GRATUITY_CEILING_APPLIED_NOTE}` : "";

  return (
    <CalculatorLayout
      label="Gratuity Calculator"
      title="Code on Social Security, 2020 — simplified gratuity estimate"
      description="This calculator provides a simplified statutory estimate under the current labour-code framework, modelled as effective from 21 November 2025, for a monthly-rated employee in an ordinary retirement, resignation, or superannuation scenario. Estimated gratuity may differ based on employment terms and eligibility facts."
      showHeader={showHeader}
      variant="alt"
      className={className}
      calculatorId="/gratuity-calculator"
      simplifiedModelNotice
      form={
        <>
          <p className="calc-field__helper" id="gratuity-scope">
            {GRATUITY_SCOPE_NOTE}
            {" "}
            {GRATUITY_FIXED_TERM_NOTE}
          </p>
          <CurrencyInput
            id="gratuity-wages"
            label={GRATUITY_WAGE_BASIS_LABEL}
            value={lastDrawnStatutoryWages}
            onChange={setLastDrawnStatutoryWages}
            limits={GRATUITY_INPUT_LIMITS.lastDrawnStatutoryWages}
          />
          <p className="calc-field__helper" id="gratuity-wages-helper">
            {GRATUITY_WAGE_HELPER_NOTE}
          </p>
          <InputField
            id="gratuity-years"
            label="Completed years of service"
            value={completedYears}
            onChange={setCompletedYears}
            format="years"
            limits={GRATUITY_INPUT_LIMITS.completedYears}
          />
          <InputField
            id="gratuity-months"
            label="Additional months of service"
            value={additionalMonths}
            onChange={setAdditionalMonths}
            format="number"
            limits={GRATUITY_INPUT_LIMITS.additionalMonths}
          />
          <p className="calc-field__helper" id="gratuity-service-helper">
            Qualifying service counts a completed year, plus one additional year
            only when additional months are more than 6. Exactly 6 additional
            months does not add a qualifying year. Decimal years are not used.
          </p>
          <p className="calc-field__helper" id="gratuity-ceiling-helper">
            {GRATUITY_CEILING_SUPPORTING_NOTE}
          </p>
        </>
      }
      results={
        <CalculatorResults
          headerTitle="Estimated gratuity"
          headerSubtitle={`${GRATUITY_LEGAL_FRAMEWORK} — simplified statutory estimate · effective ${GRATUITY_FRAMEWORK_EFFECTIVE_DATE}`}
          primary={{
            label: "Estimated gratuity",
            value: payableValue,
          }}
          metrics={[
            { label: GRATUITY_WAGE_BASIS_LABEL, value: formatCurrency(estimate.lastDrawnStatutoryWages) },
            { label: "Completed years of service", value: `${estimate.completedYears} years` },
            { label: "Additional months of service", value: `${estimate.additionalMonths}` },
            { label: "Qualifying years used in this estimate", value: `${estimate.qualifyingYears}` },
            {
              label: "Calculated gratuity before the ceiling used in this estimate",
              value: formulaValue,
            },
            {
              label: GRATUITY_CEILING_LABEL,
              value: formatCurrency(GRATUITY_STATUTORY_CEILING),
            },
            {
              label: "Estimated gratuity under this simplified statutory estimate",
              value: payableValue,
            },
          ]}
          story={`${GRATUITY_SCOPE_NOTE} ${GRATUITY_FIXED_TERM_NOTE}${ineligible ? ` ${GRATUITY_FIVE_YEAR_NOTE}` : ""}${ceilingNote} ${GRATUITY_BETTER_TERMS_NOTE}`}
        />
      }
    />
  );
}

export default GratuityCalculator;
