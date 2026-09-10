/**
 * FOINWI educational GST rules for a locked P1 product scope.
 *
 * Product scope: educational transaction-level GST arithmetic for a
 * visitor-entered applicable GST rate. Combined GST only. Not a rate
 * classifier, HSN/SAC classifier, place-of-supply adjudicator,
 * CGST/SGST/IGST determination engine, GST return/GSTR calculator,
 * input-tax-credit calculator, composition calculator, registration
 * advisor, cess calculator, or e-invoice/e-way-bill advisor.
 */

import { formatCurrencyPaise } from "../calculatorFormat.js";

export const GST_LEGAL_FRAMEWORK = "CGST Act, 2017; IGST Act, 2017; CGST Rules, 2017";
export const GST_INCLUSIVE_RULE = "CGST Rules, 2017, Rule 35";

export const GST_TITLE = "GST arithmetic calculator";
export const GST_PAGE_DESCRIPTION =
  "Estimate GST arithmetic using a rate applicable to your transaction.";

export const GST_TAXABLE_VALUE_LABEL = "Taxable value";
export const GST_INCLUSIVE_AMOUNT_LABEL = "GST-inclusive amount";
export const GST_INVOICE_VALUE_LABEL = "GST-inclusive invoice value";
export const GST_COMPONENT_LABEL = "GST component";
export const GST_RATE_LABEL = "Applicable GST rate (%)";
export const GST_MODE_LABEL = "Calculation type";
export const GST_ADD_MODE_LABEL = "Add GST to taxable value";
export const GST_EXTRACT_MODE_LABEL = "Extract GST from GST-inclusive amount";
export const GST_PRESET_LABEL = "Illustration rate choices";

export const GST_MODE_ADD = "add";
export const GST_MODE_EXTRACT = "extract";

export const GST_DEFAULT_AMOUNT = 10000;
export const GST_DEFAULT_RATE_PERCENT = 18;

export const GST_INPUT_LIMITS = Object.freeze({
  amount: { min: 0, max: 10000000, step: 1 },
  rate: { min: 0, max: 40, step: 0.25 },
});

export const GST_RATE_PRESETS = Object.freeze([0, 5, 18, 28, 40]);

export const GST_SCOPE_NOTE =
  "Educational transaction-level GST arithmetic calculator for a visitor-entered applicable GST rate.";

export const GST_RATE_HELPER_NOTE =
  "Enter or select the GST rate applicable to your transaction. FOINWI does not determine the legally applicable rate.";

export const GST_STARTING_VALUE_NOTE =
  "18% is only this calculator's starting value. It is not FOINWI's classification of your transaction.";

export const GST_ADD_AMOUNT_HELPER = "Enter the amount before GST.";
export const GST_EXTRACT_AMOUNT_HELPER = "Enter the total amount that already includes GST.";

export const GST_PRESET_HELPER_NOTE =
  "These are convenience presets for illustration, not a complete GST rate schedule. Other notified rates can be entered manually.";

export const GST_ARITHMETIC_SCOPE_NOTE =
  "This calculator estimates transaction-level GST arithmetic only. It does not calculate GST return liability or input tax credit.";

export const GST_CESS_NOTE = "Compensation cess, where applicable, is not included.";

export const GST_ZERO_RATE_NOTE =
  "A 0% calculation does not determine whether a supply is exempt, nil-rated, zero-rated or outside GST.";

export const GST_AMOUNT_LIMIT_NOTE =
  "Amount limits in this calculator are product limits for the illustration. They are not statutory GST thresholds.";

export const GST_DISPLAY_NOTE =
  "Monetary results are shown to two decimal places for this calculator. This display rule is not statutory invoice rounding.";

export const GST_ADD_STORY =
  "GST is calculated on the taxable value and added to it. GST component = taxable value × rate / 100. GST-inclusive invoice value = taxable value + GST component.";

export const GST_EXTRACT_STORY =
  "When an amount already includes GST, the GST component is extracted using inclusive amount × rate / (100 + rate). Do not subtract rate% from an inclusive amount.";

export const GST_SPLIT_NOTE =
  "This calculator shows one combined GST amount. It does not determine CGST, SGST, UTGST or IGST, and it does not decide place of supply.";

export function formatGstMoney(value) {
  return formatCurrencyPaise(value);
}
