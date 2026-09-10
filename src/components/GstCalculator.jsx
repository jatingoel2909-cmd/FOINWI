import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import InputField from "./ui/InputField";
import { calculateGstEstimate } from "../utils/gst/gstEngine.js";
import {
  formatGstMoney,
  GST_ADD_AMOUNT_HELPER,
  GST_ADD_MODE_LABEL,
  GST_ADD_STORY,
  GST_AMOUNT_LIMIT_NOTE,
  GST_ARITHMETIC_SCOPE_NOTE,
  GST_CESS_NOTE,
  GST_COMPONENT_LABEL,
  GST_DEFAULT_AMOUNT,
  GST_DEFAULT_RATE_PERCENT,
  GST_DISPLAY_NOTE,
  GST_EXTRACT_AMOUNT_HELPER,
  GST_EXTRACT_MODE_LABEL,
  GST_EXTRACT_STORY,
  GST_INCLUSIVE_AMOUNT_LABEL,
  GST_INPUT_LIMITS,
  GST_INVOICE_VALUE_LABEL,
  GST_MODE_ADD,
  GST_MODE_EXTRACT,
  GST_MODE_LABEL,
  GST_PAGE_DESCRIPTION,
  GST_PRESET_HELPER_NOTE,
  GST_PRESET_LABEL,
  GST_RATE_HELPER_NOTE,
  GST_RATE_LABEL,
  GST_RATE_PRESETS,
  GST_SCOPE_NOTE,
  GST_SPLIT_NOTE,
  GST_STARTING_VALUE_NOTE,
  GST_TAXABLE_VALUE_LABEL,
  GST_TITLE,
  GST_ZERO_RATE_NOTE,
} from "../utils/gst/gstRules.js";

const CALC_TYPES = [
  { value: GST_MODE_ADD, label: GST_ADD_MODE_LABEL },
  { value: GST_MODE_EXTRACT, label: GST_EXTRACT_MODE_LABEL },
];

function GstCalculator({
  defaultAmount = GST_DEFAULT_AMOUNT,
  defaultRate = GST_DEFAULT_RATE_PERCENT,
  defaultType = GST_MODE_ADD,
  className = "",
  showHeader = true,
}) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [calcType, setCalcType] = useState(defaultType);

  const estimate = calculateGstEstimate({
    amount,
    gstRatePercent: rate,
    mode: calcType,
  });

  const isAdd = calcType === GST_MODE_ADD;
  const amountLabel = isAdd ? GST_TAXABLE_VALUE_LABEL : GST_INCLUSIVE_AMOUNT_LABEL;
  const amountHelper = isAdd ? GST_ADD_AMOUNT_HELPER : GST_EXTRACT_AMOUNT_HELPER;
  const story = isAdd ? GST_ADD_STORY : GST_EXTRACT_STORY;

  const results = estimate.valid ? (
    <CalculatorResults
      headerTitle="GST arithmetic"
      headerSubtitle="Educational estimate using the rate you entered."
      primary={{
        label: isAdd ? GST_INVOICE_VALUE_LABEL : GST_TAXABLE_VALUE_LABEL,
        value: formatGstMoney(isAdd ? estimate.invoiceValue : estimate.taxableValue),
      }}
      metrics={
        isAdd
          ? [
              { label: GST_TAXABLE_VALUE_LABEL, value: formatGstMoney(estimate.taxableValue) },
              { label: GST_COMPONENT_LABEL, value: formatGstMoney(estimate.gstAmount) },
            ]
          : [
              { label: GST_INCLUSIVE_AMOUNT_LABEL, value: formatGstMoney(estimate.invoiceValue) },
              { label: GST_COMPONENT_LABEL, value: formatGstMoney(estimate.gstAmount) },
            ]
      }
      story={`${story} ${GST_ARITHMETIC_SCOPE_NOTE} ${GST_CESS_NOTE} ${GST_ZERO_RATE_NOTE} ${GST_SPLIT_NOTE} ${GST_DISPLAY_NOTE}`}
    />
  ) : (
    <CalculatorResults
      headerTitle="GST arithmetic"
      headerSubtitle="Enter a finite, non-negative amount and rate to estimate GST arithmetic."
      primary={{ label: GST_COMPONENT_LABEL, value: "—" }}
      story={`${GST_ARITHMETIC_SCOPE_NOTE} ${GST_SCOPE_NOTE}`}
    />
  );

  return (
    <CalculatorLayout
      label="Goods and Services Tax (GST) Calculator"
      title={GST_TITLE}
      description={GST_PAGE_DESCRIPTION}
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/gst-calculator"
      form={
        <>
          <p className="calc-field__helper" id="gst-scope">
            {GST_SCOPE_NOTE}
          </p>
          <div className="calc-field">
            <label className="calc-field__label" htmlFor="gst-type">
              {GST_MODE_LABEL}
            </label>
            <select
              id="gst-type"
              className="calc-field__select"
              value={calcType}
              onChange={(e) => setCalcType(e.target.value)}
            >
              {CALC_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <InputField
            id="gst-amount"
            label={amountLabel}
            value={amount}
            onChange={setAmount}
            format="currencyPaise"
            limits={GST_INPUT_LIMITS.amount}
          />
          <p className="calc-field__helper" id="gst-amount-helper">
            {amountHelper} {GST_AMOUNT_LIMIT_NOTE}
          </p>
          <InputField
            id="gst-rate"
            label={GST_RATE_LABEL}
            value={rate}
            onChange={setRate}
            format="percent"
            limits={GST_INPUT_LIMITS.rate}
          />
          <p className="calc-field__helper" id="gst-rate-helper">
            {GST_RATE_HELPER_NOTE}
          </p>
          <p className="calc-field__helper" id="gst-starting-value">
            {GST_STARTING_VALUE_NOTE}
          </p>
          <div className="calc-field">
            <p className="calc-field__label" id="gst-presets-label">
              {GST_PRESET_LABEL}
            </p>
            <div className="calc-preset-row" role="group" aria-labelledby="gst-presets-label">
              {GST_RATE_PRESETS.map((preset) => {
                const selected = rate === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    className={`calc-preset${selected ? " calc-preset--active" : ""}`}
                    aria-pressed={selected}
                    onClick={() => setRate(preset)}
                  >
                    {preset}%
                  </button>
                );
              })}
            </div>
            <p className="calc-field__helper" id="gst-preset-helper">
              {GST_PRESET_HELPER_NOTE}
            </p>
          </div>
        </>
      }
      results={results}
    />
  );
}

export default GstCalculator;
