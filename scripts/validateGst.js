/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  addGstToTaxableValue,
  calculateGstEstimate,
  extractGstFromInclusiveAmount,
  GST_INVALID_INPUT,
  GST_INVALID_MODE,
  normalizeNonNegativeAmount,
} from "../src/utils/gst/gstEngine.js";
import {
  formatGstMoney,
  GST_ADD_AMOUNT_HELPER,
  GST_ADD_MODE_LABEL,
  GST_ADD_STORY,
  GST_AMOUNT_LIMIT_NOTE,
  GST_ARITHMETIC_SCOPE_NOTE,
  GST_CESS_NOTE,
  GST_COMPONENT_LABEL,
  GST_DEFAULT_RATE_PERCENT,
  GST_DISPLAY_NOTE,
  GST_EXTRACT_AMOUNT_HELPER,
  GST_EXTRACT_MODE_LABEL,
  GST_EXTRACT_STORY,
  GST_INCLUSIVE_AMOUNT_LABEL,
  GST_INCLUSIVE_RULE,
  GST_INPUT_LIMITS,
  GST_INVOICE_VALUE_LABEL,
  GST_PAGE_DESCRIPTION,
  GST_PRESET_HELPER_NOTE,
  GST_RATE_HELPER_NOTE,
  GST_RATE_LABEL,
  GST_RATE_PRESETS,
  GST_SCOPE_NOTE,
  GST_SPLIT_NOTE,
  GST_STARTING_VALUE_NOTE,
  GST_TAXABLE_VALUE_LABEL,
  GST_TITLE,
  GST_ZERO_RATE_NOTE,
} from "../src/utils/gst/gstRules.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function nearlyEqual(left, right, tolerance = 1e-9) {
  return Math.abs(left - right) <= tolerance;
}

function allFiniteNonNegative(estimate) {
  return ["taxableValue", "gstAmount", "invoiceValue"].every(
    (field) => Number.isFinite(estimate[field]) && estimate[field] >= 0,
  );
}

assert(GST_TITLE === "GST arithmetic calculator", "Title must name GST arithmetic");
assert(GST_PAGE_DESCRIPTION.includes("rate applicable to your transaction"), "Page description must not claim a FOINWI rate set");
assert(GST_TAXABLE_VALUE_LABEL === "Taxable value", "Taxable value label must be Taxable value");
assert(GST_INCLUSIVE_AMOUNT_LABEL === "GST-inclusive amount", "Inclusive label must be GST-inclusive amount");
assert(GST_INVOICE_VALUE_LABEL === "GST-inclusive invoice value", "Invoice label must be GST-inclusive invoice value");
assert(GST_COMPONENT_LABEL === "GST component", "GST output must be GST component");
assert(GST_RATE_LABEL === "Applicable GST rate (%)", "Rate label must be Applicable GST rate (%)");
assert(GST_ADD_MODE_LABEL === "Add GST to taxable value", "Add mode label must name taxable value");
assert(GST_EXTRACT_MODE_LABEL === "Extract GST from GST-inclusive amount", "Extract mode label must name GST-inclusive amount");
assert(GST_DEFAULT_RATE_PERCENT === 18, "Default rate may remain 18% as a starting value");
assert(GST_INPUT_LIMITS.amount.min === 0, "Amount minimum must allow ₹0");
assert(GST_INPUT_LIMITS.rate.max === 40, "Rate maximum must allow 40%");
assert(GST_RATE_PRESETS.join(",") === "0,5,18,28,40", "Presets must be 0, 5, 18, 28, 40");
assert(!GST_RATE_PRESETS.includes(12), "Presets must not present 12% as a current standard goods slab");

assert(GST_SCOPE_NOTE.includes("visitor-entered applicable GST rate"), "Scope must say visitor-entered applicable rate");
assert(GST_SCOPE_NOTE.includes("transaction-level GST arithmetic"), "Scope must say transaction-level arithmetic");
assert(GST_RATE_HELPER_NOTE.includes("FOINWI does not determine the legally applicable rate"), "Rate helper must deny FOINWI rate classification");
assert(GST_STARTING_VALUE_NOTE.includes("starting value"), "18% note must call it a starting value");
assert(GST_STARTING_VALUE_NOTE.includes("not FOINWI's classification"), "18% note must deny classification");
assert(GST_ADD_AMOUNT_HELPER.includes("before GST"), "Add amount helper must say before GST");
assert(GST_EXTRACT_AMOUNT_HELPER.includes("already includes GST"), "Extract amount helper must say already includes GST");
assert(GST_PRESET_HELPER_NOTE.includes("not a complete GST rate schedule"), "Presets must not claim a complete schedule");
assert(GST_ARITHMETIC_SCOPE_NOTE.includes("transaction-level GST arithmetic only"), "Must deny return liability computation");
assert(GST_ARITHMETIC_SCOPE_NOTE.includes("does not calculate GST return liability or input tax credit"), "Must deny ITC and return liability");
assert(GST_CESS_NOTE.includes("Compensation cess"), "Cess note must say compensation cess is not included");
assert(GST_ZERO_RATE_NOTE.includes("does not determine whether a supply is exempt"), "0% note must not equate 0% with exempt");
assert(GST_ZERO_RATE_NOTE.includes("nil-rated"), "0% note must mention nil-rated");
assert(GST_ZERO_RATE_NOTE.includes("zero-rated"), "0% note must mention zero-rated");
assert(GST_AMOUNT_LIMIT_NOTE.includes("not statutory GST thresholds"), "Amount limits must be product-scoped");
assert(GST_DISPLAY_NOTE.includes("two decimal places"), "Display note must say two decimal places");
assert(GST_DISPLAY_NOTE.includes("not statutory invoice rounding"), "Display note must deny statutory invoice rounding");
assert(GST_ADD_STORY.includes("taxable value × rate / 100"), "Add story must keep the exclusive identity");
assert(GST_EXTRACT_STORY.includes("inclusive amount × rate / (100 + rate)"), "Extract story must keep the Rule 35 identity");
assert(GST_EXTRACT_STORY.includes("Do not subtract rate%"), "Extract story must reject subtracting rate% from inclusive amounts");
assert(GST_SPLIT_NOTE.includes("does not determine CGST"), "Split note must deny CGST/SGST/IGST determination");
assert(GST_INCLUSIVE_RULE.includes("Rule 35"), "Inclusive rule metadata must cite Rule 35");

const addA = calculateGstEstimate({ amount: 1000, gstRatePercent: 18, mode: "add" });
assert(addA.valid === true, "A: add 18% must be valid");
assert(addA.gstAmount === 180, "A: ₹1,000 @ 18% GST must be ₹180");
assert(addA.invoiceValue === 1180, "A: invoice must be ₹1,180");
assert(addA.taxableValue === 1000, "A: taxable value must be ₹1,000");

const addB = calculateGstEstimate({ amount: 1000, gstRatePercent: 5, mode: "add" });
assert(addB.gstAmount === 50, "B: ₹1,000 @ 5% GST must be ₹50");
assert(addB.invoiceValue === 1050, "B: invoice must be ₹1,050");

const addC = calculateGstEstimate({ amount: 1000, gstRatePercent: 28, mode: "add" });
assert(addC.gstAmount === 280, "C: ₹1,000 @ 28% GST must be ₹280");
assert(addC.invoiceValue === 1280, "C: invoice must be ₹1,280");

const addD = calculateGstEstimate({ amount: 1000, gstRatePercent: 40, mode: "add" });
assert(addD.valid === true, "D: 40% must be enterable in the engine");
assert(addD.gstAmount === 400, "D: ₹1,000 @ 40% GST must be ₹400");
assert(addD.invoiceValue === 1400, "D: invoice must be ₹1,400");

const extractE = calculateGstEstimate({ amount: 1180, gstRatePercent: 18, mode: "extract" });
assert(nearlyEqual(extractE.taxableValue, 1000), "E: extract 18% taxable must be ₹1,000");
assert(nearlyEqual(extractE.gstAmount, 180), "E: extract 18% GST must be ₹180");
assert(extractE.invoiceValue === 1180, "E: inclusive amount must remain ₹1,180");

const extractF = calculateGstEstimate({ amount: 1050, gstRatePercent: 5, mode: "extract" });
assert(nearlyEqual(extractF.taxableValue, 1000), "F: extract 5% taxable must be ₹1,000");
assert(nearlyEqual(extractF.gstAmount, 50), "F: extract 5% GST must be ₹50");

const addG = calculateGstEstimate({ amount: 1000, gstRatePercent: 0, mode: "add" });
assert(addG.gstAmount === 0, "G: 0% GST must be 0");
assert(addG.invoiceValue === 1000, "G: 0% invoice must equal taxable value");

const addH = calculateGstEstimate({ amount: 0, gstRatePercent: 18, mode: "add" });
assert(addH.taxableValue === 0 && addH.gstAmount === 0 && addH.invoiceValue === 0, "H: ₹0 @ 18% must be all zeros");

const addI = calculateGstEstimate({ amount: 999.99, gstRatePercent: 18, mode: "add" });
assert(nearlyEqual(addI.gstAmount, 179.9982), "I: internal GST must be 179.9982");
assert(nearlyEqual(addI.invoiceValue, 1179.9882), "I: internal invoice must be 1179.9882");
assert(formatGstMoney(addI.gstAmount) === formatGstMoney(180), "I: displayed GST must be ₹180.00");
assert(formatGstMoney(addI.invoiceValue) === formatGstMoney(1179.99), "I: displayed invoice must be ₹1,179.99");
assert(formatGstMoney(addI.taxableValue) === formatGstMoney(999.99), "I: displayed taxable value must keep ₹999.99");

const addJ = calculateGstEstimate({ amount: 10000, gstRatePercent: 0.25, mode: "add" });
assert(addJ.gstAmount === 25, "J: ₹10,000 @ 0.25% GST must be ₹25");
assert(addJ.invoiceValue === 10025, "J: invoice must be ₹10,025");

const addK = calculateGstEstimate({ amount: 10000, gstRatePercent: 1.5, mode: "add" });
assert(addK.gstAmount === 150, "K: ₹10,000 @ 1.5% GST must be ₹150");
assert(addK.invoiceValue === 10150, "K: invoice must be ₹10,150");

const addL = calculateGstEstimate({ amount: 10000, gstRatePercent: 3, mode: "add" });
assert(addL.gstAmount === 300, "L: ₹10,000 @ 3% GST must be ₹300");
assert(addL.invoiceValue === 10300, "L: invoice must be ₹10,300");

const nanResult = calculateGstEstimate({ amount: Number.NaN, gstRatePercent: 18, mode: "add" });
assert(nanResult.valid === false, "M: NaN amount must be invalid");
assert(nanResult.reason === GST_INVALID_INPUT, "M: NaN must use invalid-input");
assert(allFiniteNonNegative(nanResult), "M: NaN must not produce non-finite or negative money");

const infResult = calculateGstEstimate({
  amount: Number.POSITIVE_INFINITY,
  gstRatePercent: 18,
  mode: "add",
});
assert(infResult.valid === false, "M: Infinity amount must be invalid");
assert(allFiniteNonNegative(infResult), "M: Infinity must not produce non-finite or negative money");

const negResult = calculateGstEstimate({ amount: -1000, gstRatePercent: 18, mode: "add" });
assert(negResult.valid === false, "M: negative amount must be invalid");
assert(allFiniteNonNegative(negResult), "M: negative amount must not produce negative displayed money");

const negRate = calculateGstEstimate({ amount: 1000, gstRatePercent: -18, mode: "add" });
assert(negRate.valid === false, "M: negative rate must be invalid");
assert(allFiniteNonNegative(negRate), "M: negative rate must not produce negative money");

const infRate = calculateGstEstimate({
  amount: 1000,
  gstRatePercent: Number.NEGATIVE_INFINITY,
  mode: "extract",
});
assert(infRate.valid === false, "M: infinite rate must be invalid");
assert(allFiniteNonNegative(infRate), "M: infinite rate must stay finite and nonnegative");

const invalidMode = calculateGstEstimate({ amount: 1000, gstRatePercent: 18, mode: "remove" });
assert(invalidMode.valid === false, "N: unknown mode must be invalid");
assert(invalidMode.reason === GST_INVALID_MODE, "N: unknown mode must use invalid-mode");
assert(allFiniteNonNegative(invalidMode), "N: invalid mode must not leak non-finite money");

const missingMode = calculateGstEstimate({ amount: 1000, gstRatePercent: 18 });
assert(missingMode.valid === false && missingMode.reason === GST_INVALID_MODE, "N: missing mode must be invalid-mode");

assert(nearlyEqual(extractE.gstAmount, 180), "O: inclusive 18% on ₹1,180 must be GST ₹180");
assert(!nearlyEqual(extractE.gstAmount, 212.4), "O: must not use inclusive × rate / 100");
const bugIdentity = 1180 * 18 / 100;
assert(bugIdentity === 212.4, "O: document the forbidden inclusive × rate / 100 identity");
assert(!nearlyEqual(extractE.gstAmount, bugIdentity), "O: production must not equal the inclusive-bug result");
assert(
  nearlyEqual(extractE.gstAmount, 1180 * 18 / (100 + 18)),
  "O: GST must equal inclusive × rate / (100 + rate)",
);

const extractPaise = calculateGstEstimate({ amount: 1179.99, gstRatePercent: 18, mode: "extract" });
assert(nearlyEqual(extractPaise.taxableValue + extractPaise.gstAmount, extractPaise.invoiceValue), "Extract paise must preserve taxable + GST = inclusive");
assert(formatGstMoney(extractPaise.invoiceValue) === formatGstMoney(1179.99), "Extract display must keep two decimal places");

const helperAdd = addGstToTaxableValue(1000, 18);
assert(helperAdd.gstAmount === 180 && helperAdd.invoiceValue === 1180, "Exported add helper must match the 18% identity");
const helperExtract = extractGstFromInclusiveAmount(1180, 18);
assert(nearlyEqual(helperExtract.taxableValue, 1000) && nearlyEqual(helperExtract.gstAmount, 180), "Exported extract helper must match Rule 35");
assert(normalizeNonNegativeAmount(-5) === 0, "Negative money helper must normalize to 0");
assert(normalizeNonNegativeAmount(Number.NaN) === 0, "NaN money helper must normalize to 0");
assert(normalizeNonNegativeAmount(Number.POSITIVE_INFINITY) === 0, "Infinity money helper must normalize to 0");

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/GstCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/gst/gstEngine.js"), "utf8");
const rulesSource = readFileSync(join(sourceRoot, "src/utils/gst/gstRules.js"), "utf8");
const insightsSource = readFileSync(join(sourceRoot, "src/data/calculatorInsights.js"), "utf8");
const explainsSource = readFileSync(join(sourceRoot, "src/data/calculatorExplains.js"), "utf8");
const calculatorsSource = readFileSync(join(sourceRoot, "src/data/calculators.js"), "utf8");
const learnSource = readFileSync(join(sourceRoot, "src/data/learnAcademy.js"), "utf8");
const journeysSource = readFileSync(join(sourceRoot, "src/data/journeys.js"), "utf8");
const intentsSource = readFileSync(join(sourceRoot, "src/intelligence/guide/guideIntents.js"), "utf8");
const resourcesSource = readFileSync(join(sourceRoot, "src/intelligence/guide/guideResources.js"), "utf8");

const insightsStart = insightsSource.indexOf('"/gst-calculator": {');
const insightsEnd = insightsSource.indexOf('"/income-tax-calculator": {');
const explainsStart = explainsSource.indexOf('"/gst-calculator": {');
const explainsEnd = explainsSource.indexOf('"/income-tax-calculator": {');
const gstInsights = insightsSource.slice(insightsStart, insightsEnd);
const gstExplains = explainsSource.slice(explainsStart, explainsEnd);
const gstLearnStart = learnSource.indexOf('"income-tax-basics/gst-in-everyday-purchases"');
const gstLearnEnd = learnSource.indexOf('"insurance-planning/why-insurance-matters"');
const gstLesson = learnSource.slice(gstLearnStart, gstLearnEnd);
const publicCopy = [
  calculatorSource,
  gstInsights,
  gstExplains,
  calculatorsSource,
  gstLesson,
  journeysSource,
  intentsSource,
  resourcesSource,
  rulesSource,
].join("\n");

assert(calculatorSource.includes("calculateGstEstimate"), "GST UI must use the centralized engine");
assert(calculatorSource.includes("GST_RATE_HELPER_NOTE"), "GST UI must show the visitor-entered rate helper");
assert(calculatorSource.includes("GST_STARTING_VALUE_NOTE"), "GST UI must show the 18% starting-value note");
assert(calculatorSource.includes("GST_ARITHMETIC_SCOPE_NOTE"), "GST UI must deny return liability and ITC");
assert(calculatorSource.includes("GST_CESS_NOTE"), "GST UI must say cess is not included");
assert(calculatorSource.includes("GST_ZERO_RATE_NOTE"), "GST UI must show the 0% legal-category caveat");
assert(calculatorSource.includes("GST_ADD_MODE_LABEL"), "GST UI must use Add GST to taxable value");
assert(calculatorSource.includes("GST_EXTRACT_MODE_LABEL"), "GST UI must use Extract GST from GST-inclusive amount");
assert(calculatorSource.includes("formatGstMoney"), "GST UI must display money to two decimal places");
assert(calculatorSource.includes("currencyPaise"), "GST UI must accept decimal amounts");
assert(!calculatorSource.includes("function calculateGst("), "GST UI must not keep a local GST formula");
assert(!calculatorSource.includes("Add GST") || calculatorSource.includes("GST_ADD_MODE_LABEL"), "GST UI must not keep a generic Add GST label without the taxable-value wording");
assert(!calculatorSource.includes("common Indian GST rates"), "GST UI must not say common Indian GST rates");
assert(engineSource.includes("taxableValue * gstRatePercent / 100"), "Engine must keep the exclusive GST identity");
assert(engineSource.includes("inclusiveAmount * 100 / (100 + gstRatePercent)"), "Engine must keep the Rule 35 taxable-value identity");
assert(!engineSource.includes("inclusiveAmount * gstRatePercent / 100"), "Engine must not use the inclusive-bug identity");

const banned = [
  [/all GST rates/i, "Copy must not say all GST rates"],
  [/complete GST rates/i, "Copy must not say complete GST rates"],
  [/common Indian GST rates/i, "Copy must not say common Indian GST rates"],
  [/18% applies to your transaction/i, "Copy must not say 18% applies to the visitor's transaction"],
  [/0% means exempt/i, "Copy must not say 0% means exempt"],
  [/GST liability/i, "Copy must not say GST liability"],
  [/net GST payable/i, "Copy must not say net GST payable"],
  [/FOINWI determines the legally applicable/i, "Copy must not say FOINWI determines the applicable GST rate"],
  [/40% applies generally/i, "Copy must not say 40% applies generally"],
  [/12% standard current goods slab/i, "Copy must not call 12% a standard current goods slab"],
  [/your applicable GST rate/i, "Copy must not call a rate the visitor's applicable GST rate as FOINWI fact"],
  [/most services are 18%/i, "Copy must not classify most services as 18%"],
  [/input tax credit is included/i, "Copy must not say ITC is included"],
  [/CGST\/SGST vs IGST is automatically determined/i, "Copy must not claim automatic CGST/SGST/IGST determination"],
];

banned.forEach(([pattern, message]) => {
  assert(!pattern.test(publicCopy), message);
});

assert(/visitor-entered|applicable GST rate/i.test(publicCopy), "Related GST copy must keep visitor-entered/applicable rate wording");
assert(/does not determine the legally applicable rate/i.test(publicCopy), "Related GST copy must deny FOINWI rate classification");
assert(/starting value/i.test(publicCopy), "Related GST copy must keep 18% as a starting value");
assert(/transaction-level GST arithmetic/i.test(publicCopy), "Related GST copy must keep transaction-level arithmetic");
assert(/does not calculate GST return liability or input tax credit/i.test(publicCopy), "Related GST copy must deny ITC/return liability");
assert(/Compensation cess, where applicable, is not included/i.test(publicCopy), "Related GST copy must exclude cess");
assert(/does not determine whether a supply is exempt/i.test(publicCopy), "Related GST copy must keep the 0% legal-category caveat");
assert(gstInsights.includes("inclusive amount × rate / (100 + rate)") || gstInsights.includes("(100 + rate)"), "Insights must document the extract identity");
assert(!gstExplains.includes("goods vs services categories"), "Explains must not imply FOINWI classifies goods vs services");
assert(!gstExplains.includes("Confusing CGST/SGST"), "Explains must not discuss a CGST/SGST split this calculator does not offer");

if (failures.length) {
  console.error(`GST validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`GST validation passed: ${checks} checks.`);
console.log(`Scope: ${GST_SCOPE_NOTE}`);
console.log(`A add 18%: GST ₹${addA.gstAmount} invoice ₹${addA.invoiceValue}`);
console.log(`E extract 18%: taxable ₹${extractE.taxableValue} GST ₹${extractE.gstAmount}`);
console.log(`O inclusive-bug ₹212.40 rejected; production GST ₹${extractE.gstAmount}`);
