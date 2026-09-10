/**
 * Educational transaction-level GST arithmetic.
 *
 * Add mode uses tax-exclusive arithmetic. Extract mode uses the Rule 35
 * inclusive-tax identity for a single combined rate. Combined GST only.
 * Not a rate classifier, ITC engine, return calculator, cess calculator,
 * composition calculator, or CGST/SGST/IGST determination engine.
 */

import {
  GST_INCLUSIVE_RULE,
  GST_LEGAL_FRAMEWORK,
  GST_MODE_ADD,
  GST_MODE_EXTRACT,
  GST_SCOPE_NOTE,
} from "./gstRules.js";

export const GST_INVALID_INPUT = "invalid-input";
export const GST_INVALID_MODE = "invalid-mode";

function asFiniteNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric;
}

export function normalizeNonNegativeAmount(value) {
  const numeric = asFiniteNumber(value);
  if (numeric === null || numeric < 0) return 0;
  return numeric;
}

function emptyMoney() {
  return {
    taxableValue: 0,
    gstAmount: 0,
    invoiceValue: 0,
  };
}

function invalidResult(reason, mode, amount, gstRatePercent) {
  return {
    valid: false,
    reason,
    legalFramework: GST_LEGAL_FRAMEWORK,
    inclusiveRule: GST_INCLUSIVE_RULE,
    scope: GST_SCOPE_NOTE,
    mode: mode ?? null,
    amount: asFiniteNumber(amount),
    gstRatePercent: asFiniteNumber(gstRatePercent),
    ...emptyMoney(),
  };
}

export function addGstToTaxableValue(taxableValue, gstRatePercent) {
  const gstAmount = taxableValue * gstRatePercent / 100;
  return {
    taxableValue,
    gstAmount,
    invoiceValue: taxableValue + gstAmount,
  };
}

export function extractGstFromInclusiveAmount(inclusiveAmount, gstRatePercent) {
  const taxableValue = inclusiveAmount * 100 / (100 + gstRatePercent);
  const gstAmount = inclusiveAmount - taxableValue;
  return {
    taxableValue,
    gstAmount,
    invoiceValue: inclusiveAmount,
  };
}

export function calculateGstEstimate({
  amount = 0,
  gstRatePercent = 0,
  mode,
} = {}) {
  if (mode !== GST_MODE_ADD && mode !== GST_MODE_EXTRACT) {
    return invalidResult(GST_INVALID_MODE, mode, amount, gstRatePercent);
  }

  const numericAmount = asFiniteNumber(amount);
  const numericRate = asFiniteNumber(gstRatePercent);
  if (numericAmount === null || numericRate === null || numericAmount < 0 || numericRate < 0) {
    return invalidResult(GST_INVALID_INPUT, mode, amount, gstRatePercent);
  }

  const money =
    mode === GST_MODE_ADD
      ? addGstToTaxableValue(numericAmount, numericRate)
      : extractGstFromInclusiveAmount(numericAmount, numericRate);

  return {
    valid: true,
    reason: null,
    legalFramework: GST_LEGAL_FRAMEWORK,
    inclusiveRule: GST_INCLUSIVE_RULE,
    scope: GST_SCOPE_NOTE,
    mode,
    amount: numericAmount,
    gstRatePercent: numericRate,
    taxableValue: money.taxableValue,
    gstAmount: money.gstAmount,
    invoiceValue: money.invoiceValue,
  };
}
