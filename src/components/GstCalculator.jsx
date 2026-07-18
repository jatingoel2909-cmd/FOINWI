import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  amount: { min: 100, max: 10000000, step: 100 },
  rate: { min: 0, max: 28, step: 0.5 },
};

const CALC_TYPES = [
  { value: "add", label: "Add GST" },
  { value: "remove", label: "Remove GST" },
];

function calculateGst(amount, rate, type) {
  if (type === "add") {
    const gstAmount = amount * (rate / 100);
    return {
      baseAmount: amount,
      gstAmount,
      totalAmount: amount + gstAmount,
    };
  }

  const baseAmount = amount / (1 + rate / 100);
  const gstAmount = amount - baseAmount;

  return {
    baseAmount,
    gstAmount,
    totalAmount: amount,
  };
}

function GstCalculator({
  defaultAmount = 10000,
  defaultRate = 18,
  defaultType = "add",
  className = "",
  showHeader = true,
}) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [calcType, setCalcType] = useState(defaultType);

  const { baseAmount, gstAmount, totalAmount } = calculateGst(amount, rate, calcType);

  return (
    <CalculatorLayout
      label="GST Calculator"
      title="Add or remove GST instantly"
      description="Calculate base amount, GST component, and total for common Indian GST rates."
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/gst-calculator"
      form={
        <>
          <CurrencyInput
            id="gst-amount"
            label="Amount"
            value={amount}
            onChange={setAmount}
            limits={LIMITS.amount}
          />
          <InputField
            id="gst-rate"
            label="GST Rate (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <div className="calc-field">
            <label className="calc-field__label" htmlFor="gst-type">
              Calculation Type
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
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Total Amount", value: formatCurrency(totalAmount) }}
          metrics={[
            { label: "Base Amount", value: formatCurrency(baseAmount) },
            { label: "GST Amount", value: formatCurrency(gstAmount) },
            { label: "GST Rate", value: `${rate}%` },
          ]}
          story="GST splits an invoice into taxable value and tax component. The same rate can be used to add GST or extract it from an inclusive total."
        />
      }
    />
  );
}

export default GstCalculator;
