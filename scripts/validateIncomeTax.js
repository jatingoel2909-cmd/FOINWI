/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  calculateApplicableSalaryStandardDeduction,
  calculateHealthAndEducationCess,
  calculateIncomeTaxEstimate,
  calculateSection87AMarginalRelief,
  calculateSection87ARebate,
  calculateSlabTax,
  compareRegimeEstimates,
} from "../src/utils/incomeTax/incomeTaxEngine.js";
import {
  HEALTH_AND_EDUCATION_CESS_RATE,
  INCOME_TAX_EDUCATIONAL_INCOME_CAP,
  INCOME_TAX_PERIOD,
  INCOME_TAX_REGIMES,
  INCOME_TAX_SPECIAL_RATE_INCOME_MODELLED,
  NEW_STANDARD_DEDUCTION,
  OLD_STANDARD_DEDUCTION,
  SECTION_87A,
  SECTION_87A_EDUCATIONAL_SCOPE_NOTE,
  SECTION_87A_MARGINAL_RELIEF_IMPLEMENTED,
} from "../src/utils/incomeTax/incomeTaxRules.js";

const failures = [];
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function nearlyEqual(left, right, tolerance = 0.0001) {
  return Math.abs(left - right) <= tolerance;
}

function estimateNewRegimeAtTaxableIncome(taxableIncome) {
  return calculateIncomeTaxEstimate({
    annualSalaryIncome: taxableIncome + NEW_STANDARD_DEDUCTION,
    regime: INCOME_TAX_REGIMES.NEW,
  });
}

function assertCessAfterRebateOrRelief(estimate, label) {
  assert(
    nearlyEqual(estimate.cess, calculateHealthAndEducationCess(estimate.taxAfterRebate)),
    `${label}: cess must be computed from tax after rebate or marginal relief`,
  );
  assert(
    nearlyEqual(estimate.estimatedTax, estimate.taxAfterRebate + estimate.cess),
    `${label}: estimated total tax must be tax after rebate or relief plus cess`,
  );
  assert(
    nearlyEqual(estimate.cess, estimate.taxAfterRebate * HEALTH_AND_EDUCATION_CESS_RATE),
    `${label}: cess must be 4% of tax after rebate or relief`,
  );
}

function assertMarginalReliefBounds(estimate, label) {
  assert(estimate.marginalRelief >= 0, `${label}: marginalRelief must be >= 0`);
  assert(estimate.marginalRelief <= estimate.slabTax, `${label}: marginalRelief must be <= slabTax`);
}

function findFirstTaxableIncomeWhereSlabDoesNotExceedExcess() {
  const threshold = SECTION_87A.new.maxTaxableIncome;
  for (let income = threshold + 1; income <= 1600000; income += 1) {
    const slabTax = calculateSlabTax(income, INCOME_TAX_REGIMES.NEW);
    if (slabTax <= income - threshold) return income;
  }
  return null;
}

assert(INCOME_TAX_PERIOD.assessmentYear === "AY 2026-27", "Period must be AY 2026-27");
assert(INCOME_TAX_PERIOD.financialYear === "FY 2025-26", "Period must be FY 2025-26");
assert(NEW_STANDARD_DEDUCTION === 75000, "New-regime salary standard deduction must be ₹75,000");
assert(OLD_STANDARD_DEDUCTION === 50000, "Old-regime salary standard deduction must be ₹50,000");
assert(INCOME_TAX_EDUCATIONAL_INCOME_CAP === 5000000, "Educational income cap must be ₹50 lakh");
assert(HEALTH_AND_EDUCATION_CESS_RATE === 0.04, "Cess must be 4%");
assert(SECTION_87A_MARGINAL_RELIEF_IMPLEMENTED === true, "New-regime 87A marginal relief must be implemented");
assert(INCOME_TAX_SPECIAL_RATE_INCOME_MODELLED === false, "Special-rate income must remain outside calculator scope");
assert(
  SECTION_87A_EDUCATIONAL_SCOPE_NOTE.includes("Special-rate income"),
  "Educational scope note must state that special-rate income is outside calculator scope",
);

assert(calculateSlabTax(400000, INCOME_TAX_REGIMES.NEW) === 0, "New regime ₹4,00,000 slab tax must be ₹0");
assert(calculateSlabTax(800000, INCOME_TAX_REGIMES.NEW) === 20000, "New regime ₹8,00,000 slab tax must be ₹20,000");
assert(calculateSlabTax(1200000, INCOME_TAX_REGIMES.NEW) === 60000, "New regime ₹12,00,000 slab tax must be ₹60,000");
assert(nearlyEqual(calculateSlabTax(1200001, INCOME_TAX_REGIMES.NEW), 60000.15), "New regime ₹12,00,001 must start the 15% band");
assert(calculateSlabTax(1600000, INCOME_TAX_REGIMES.NEW) === 120000, "New regime ₹16,00,000 slab tax must be ₹1,20,000");
assert(calculateSlabTax(2400000, INCOME_TAX_REGIMES.NEW) === 300000, "New regime ₹24,00,000 slab tax must be ₹3,00,000");
assert(calculateSlabTax(2500000, INCOME_TAX_REGIMES.NEW) === 330000, "New regime above ₹24,00,000 must apply 30%");

assert(calculateSlabTax(399999, INCOME_TAX_REGIMES.NEW) === 0, "New regime just below ₹4,00,000 must stay nil");
assert(nearlyEqual(calculateSlabTax(400001, INCOME_TAX_REGIMES.NEW), 0.05), "New regime ₹4,00,001 must enter the 5% band");
assert(nearlyEqual(calculateSlabTax(800001, INCOME_TAX_REGIMES.NEW), 20000.1), "New regime ₹8,00,001 must enter the 10% band");
assert(nearlyEqual(calculateSlabTax(1600001, INCOME_TAX_REGIMES.NEW), 120000.2), "New regime ₹16,00,001 must enter the 20% band");
assert(nearlyEqual(calculateSlabTax(2000001, INCOME_TAX_REGIMES.NEW), 200000.25), "New regime ₹20,00,001 must enter the 25% band");
assert(nearlyEqual(calculateSlabTax(2400001, INCOME_TAX_REGIMES.NEW), 300000.3), "New regime ₹24,00,001 must enter the 30% band");

const rebateAt12L = calculateSection87ARebate({
  regime: INCOME_TAX_REGIMES.NEW,
  taxableIncome: 1200000,
  slabTax: 60000,
});
assert(rebateAt12L === 60000, "Eligible new-regime ₹12,00,000 rebate must cover slab tax");
assert(
  calculateSection87ARebate({
    regime: INCOME_TAX_REGIMES.NEW,
    taxableIncome: 1200001,
    slabTax: 60000.15,
  }) === 0,
  "New-regime income above ₹12,00,000 must not receive the ₹12 lakh 87A rebate",
);

assert(calculateSlabTax(250000, INCOME_TAX_REGIMES.OLD) === 0, "Old regime ₹2,50,000 slab tax must be ₹0");
assert(calculateSlabTax(500000, INCOME_TAX_REGIMES.OLD) === 12500, "Old regime ₹5,00,000 slab tax must be ₹12,500");
assert(calculateSlabTax(1000000, INCOME_TAX_REGIMES.OLD) === 112500, "Old regime ₹10,00,000 slab tax must be ₹1,12,500");
assert(calculateSlabTax(1100000, INCOME_TAX_REGIMES.OLD) === 142500, "Old regime above ₹10,00,000 must apply 30%");
assert(nearlyEqual(calculateSlabTax(250001, INCOME_TAX_REGIMES.OLD), 0.05), "Old regime ₹2,50,001 must enter the 5% band");
assert(nearlyEqual(calculateSlabTax(500001, INCOME_TAX_REGIMES.OLD), 12500.2), "Old regime ₹5,00,001 must enter the 20% band");
assert(nearlyEqual(calculateSlabTax(1000001, INCOME_TAX_REGIMES.OLD), 112500.3), "Old regime ₹10,00,001 must enter the 30% band");

const oldRebate = calculateSection87ARebate({
  regime: INCOME_TAX_REGIMES.OLD,
  taxableIncome: 500000,
  slabTax: 12500,
});
assert(oldRebate === 12500, "Eligible old-regime ₹5,00,000 rebate must be limited to tax payable");
assert(
  calculateSection87ARebate({
    regime: INCOME_TAX_REGIMES.OLD,
    taxableIncome: 500001,
    slabTax: 12500.2,
  }) === 0,
  "Old-regime income above ₹5,00,000 must not receive 87A",
);

assert(
  calculateSection87ARebate({
    regime: INCOME_TAX_REGIMES.NEW,
    taxableIncome: 800000,
    slabTax: 20000,
  }) === 20000,
  "87A rebate must never exceed slab tax",
);
assert(
  calculateSection87ARebate({
    regime: INCOME_TAX_REGIMES.NEW,
    taxableIncome: 800000,
    slabTax: 20000,
  }) <= SECTION_87A.new.maxRebate,
  "87A rebate must never exceed the regime cap",
);

assert(calculateHealthAndEducationCess(60000) === 2400, "Cess must be 4% of post-rebate tax");
assert(calculateHealthAndEducationCess(0) === 0, "Cess on zero post-rebate tax must be zero");

const twelveLakhNewTaxable = estimateNewRegimeAtTaxableIncome(1200000);
assert(twelveLakhNewTaxable.taxableIncome === 1200000, "Salary plus standard deduction must produce the intended taxable income");
assert(twelveLakhNewTaxable.slabTax === 60000, "New-regime ₹12,00,000 taxable income must have ₹60,000 slab tax");
assert(twelveLakhNewTaxable.rebate === 60000, "Eligible resident 87A estimate at ₹12,00,000 must reduce slab tax to ₹0");
assert(twelveLakhNewTaxable.marginalRelief === 0, "Ordinary rebate range must not also apply marginal relief");
assert(twelveLakhNewTaxable.taxAfterRebate === 0, "Tax after rebate at ₹12,00,000 must be ₹0");
assert(twelveLakhNewTaxable.completeEstimate === true, "Eligible ₹12,00,000 estimate must remain complete");
assert(twelveLakhNewTaxable.estimatedTax === 0, "Estimated tax at eligible ₹12,00,000 must be ₹0");
assertCessAfterRebateOrRelief(twelveLakhNewTaxable, "₹12,00,000");
assertMarginalReliefBounds(twelveLakhNewTaxable, "₹12,00,000");

const justOver12L = estimateNewRegimeAtTaxableIncome(1200001);
assert(justOver12L.taxableIncome === 1200001, "₹12,00,001 taxable-income fixture must keep the boundary");
assert(justOver12L.rebate === 0, "₹12,00,001 must not receive the ordinary ₹12 lakh 87A rebate");
assert(justOver12L.marginalRelief > 0, "₹12,00,001 must receive Section 87A marginal relief");
assert(justOver12L.taxAfterRebate <= 1, "₹12,00,001 tax before cess must not exceed ₹1");
assert(justOver12L.completeEstimate === true, "₹12,00,001 must present a complete estimate after marginal relief");
assert(Number.isFinite(justOver12L.estimatedTax), "₹12,00,001 must present a numeric estimated total");
assert(
  nearlyEqual(
    justOver12L.marginalRelief,
    calculateSection87AMarginalRelief({
      regime: INCOME_TAX_REGIMES.NEW,
      taxableIncome: justOver12L.taxableIncome,
      slabTax: justOver12L.slabTax,
    }),
  ),
  "₹12,00,001 estimate must use the centralized marginal-relief function",
);
assertCessAfterRebateOrRelief(justOver12L, "₹12,00,001");
assertMarginalReliefBounds(justOver12L, "₹12,00,001");

const twelveLakhTenThousand = estimateNewRegimeAtTaxableIncome(1210000);
assert(twelveLakhTenThousand.rebate === 0, "₹12,10,000 must not receive the ordinary 87A rebate");
assert(twelveLakhTenThousand.marginalRelief > 0, "₹12,10,000 must receive Section 87A marginal relief");
assert(twelveLakhTenThousand.taxAfterRebate <= 10000, "₹12,10,000 tax before cess must not exceed ₹10,000 where marginal relief applies");
assertCessAfterRebateOrRelief(twelveLakhTenThousand, "₹12,10,000");
assertMarginalReliefBounds(twelveLakhTenThousand, "₹12,10,000");

const twelveLakhFiftyThousand = estimateNewRegimeAtTaxableIncome(1250000);
const twelveLakhFiftyThousandSlab = calculateSlabTax(1250000, INCOME_TAX_REGIMES.NEW);
const twelveLakhFiftyThousandRelief = calculateSection87AMarginalRelief({
  regime: INCOME_TAX_REGIMES.NEW,
  taxableIncome: 1250000,
  slabTax: twelveLakhFiftyThousandSlab,
});
assert(twelveLakhFiftyThousand.taxableIncome === 1250000, "₹12,50,000 taxable-income fixture must keep the boundary");
assert(nearlyEqual(twelveLakhFiftyThousand.slabTax, twelveLakhFiftyThousandSlab), "₹12,50,000 estimate must use centralized slab tax");
assert(twelveLakhFiftyThousand.rebate === 0, "₹12,50,000 must not receive the ordinary 87A rebate");
assert(twelveLakhFiftyThousand.marginalRelief > 0, "₹12,50,000 must receive Section 87A marginal relief");
assert(
  nearlyEqual(twelveLakhFiftyThousand.marginalRelief, twelveLakhFiftyThousandRelief),
  "₹12,50,000 estimate must use the centralized marginal-relief function",
);
assert(
  twelveLakhFiftyThousand.taxAfterRebate <= 1250000 - SECTION_87A.new.maxTaxableIncome,
  "₹12,50,000 tax before cess must not exceed excess income over ₹12,00,000",
);
assert(
  nearlyEqual(
    twelveLakhFiftyThousand.taxAfterRebate,
    twelveLakhFiftyThousand.slabTax - twelveLakhFiftyThousand.rebate - twelveLakhFiftyThousand.marginalRelief,
  ),
  "₹12,50,000 tax after rebate or relief must equal slab tax minus rebate minus marginal relief",
);
assertCessAfterRebateOrRelief(twelveLakhFiftyThousand, "₹12,50,000");
assertMarginalReliefBounds(twelveLakhFiftyThousand, "₹12,50,000");

const reliefCeaseIncome = findFirstTaxableIncomeWhereSlabDoesNotExceedExcess();
assert(reliefCeaseIncome !== null, "Must locate the taxable income where slab tax no longer exceeds excess income");
const justBelowCease = estimateNewRegimeAtTaxableIncome(reliefCeaseIncome - 1);
const atCease = estimateNewRegimeAtTaxableIncome(reliefCeaseIncome);
const justAboveCease = estimateNewRegimeAtTaxableIncome(reliefCeaseIncome + 1);
assert(justBelowCease.marginalRelief > 0, "Immediately below the cease point, marginal relief must apply");
assert(atCease.marginalRelief === 0, "At the cease point, marginal relief must not apply");
assert(justAboveCease.marginalRelief === 0, "Immediately above the cease point, marginal relief must not apply");
assertCessAfterRebateOrRelief(justBelowCease, "just below cease");
assertCessAfterRebateOrRelief(atCease, "at cease");
assertCessAfterRebateOrRelief(justAboveCease, "just above cease");
assertMarginalReliefBounds(justBelowCease, "just below cease");
assertMarginalReliefBounds(atCease, "at cease");
assertMarginalReliefBounds(justAboveCease, "just above cease");

const sixteenLakhNew = estimateNewRegimeAtTaxableIncome(1600000);
assert(sixteenLakhNew.taxableIncome === 1600000, "₹16,00,000 taxable-income fixture must keep the 15% band end");
assert(sixteenLakhNew.rebate === 0, "₹16,00,000 must not receive the ordinary 87A rebate");
assert(sixteenLakhNew.marginalRelief === 0, "₹16,00,000 must not receive marginal relief when slab tax is already below excess income");
assert(sixteenLakhNew.completeEstimate === true, "₹16,00,000 must remain a complete estimate");
assert(nearlyEqual(sixteenLakhNew.taxAfterRebate, sixteenLakhNew.slabTax), "₹16,00,000 tax before cess must equal slab tax when no rebate or relief applies");
assert(nearlyEqual(sixteenLakhNew.estimatedTax, 124800), "₹16,00,000 complete estimate must be slab tax plus 4% cess");
assertCessAfterRebateOrRelief(sixteenLakhNew, "₹16,00,000");
assertMarginalReliefBounds(sixteenLakhNew, "₹16,00,000");

const atOrBelow12L = [
  estimateNewRegimeAtTaxableIncome(0),
  estimateNewRegimeAtTaxableIncome(800000),
  estimateNewRegimeAtTaxableIncome(1199999),
  estimateNewRegimeAtTaxableIncome(1200000),
];
atOrBelow12L.forEach((estimate, index) => {
  assert(estimate.marginalRelief === 0, `No marginal relief at or below ₹12,00,000 (vector ${index})`);
  assertMarginalReliefBounds(estimate, `at-or-below ₹12L vector ${index}`);
});

const reliefComparison = compareRegimeEstimates({
  annualSalaryIncome: 1200001 + NEW_STANDARD_DEDUCTION,
  eligibleDeductions: 0,
});
assert(
  reliefComparison.newRegime.completeEstimate === true
  && reliefComparison.oldRegime.completeEstimate === true,
  "Former cliff-range new-regime totals may be used for educational regime comparison",
);
assert(
  reliefComparison.lowerEstimatedRegime === INCOME_TAX_REGIMES.NEW
  || reliefComparison.lowerEstimatedRegime === INCOME_TAX_REGIMES.OLD
  || reliefComparison.lowerEstimatedRegime === null,
  "Regime comparison just above ₹12,00,000 must stay educational and non-prescriptive",
);

const salary12LNew = calculateIncomeTaxEstimate({
  annualSalaryIncome: 1200000,
  regime: INCOME_TAX_REGIMES.NEW,
});
assert(salary12LNew.standardDeduction === NEW_STANDARD_DEDUCTION, "New regime must apply ₹75,000 salary standard deduction");
assert(salary12LNew.otherDeductions === 0, "New regime must not apply the old-regime deductions field");
assert(salary12LNew.taxableIncome === 1125000, "₹12,00,000 salary minus ₹75,000 must be ₹11,25,000 taxable");
assert(salary12LNew.estimatedTax === 0, "Eligible new-regime ₹12,00,000 salary estimate should be ₹0 after rebate");
assert(salary12LNew.marginalRelief === 0, "New-regime ₹12,00,000 salary remains below the marginal-relief range");

const oldSalary40000 = calculateIncomeTaxEstimate({
  annualSalaryIncome: 40000,
  regime: INCOME_TAX_REGIMES.OLD,
  eligibleDeductions: 0,
});
assert(oldSalary40000.standardDeduction === 40000, "Old-regime salary ₹40,000 must cap standard deduction at salary");
assert(oldSalary40000.taxableIncome === 0, "Old-regime salary ₹40,000 must not become negative after standard deduction");
assert(
  oldSalary40000.standardDeduction === calculateApplicableSalaryStandardDeduction(40000, INCOME_TAX_REGIMES.OLD),
  "Old-regime ₹40,000 must use the centralized salary standard-deduction function",
);

const oldSalary50000 = calculateIncomeTaxEstimate({
  annualSalaryIncome: 50000,
  regime: INCOME_TAX_REGIMES.OLD,
  eligibleDeductions: 0,
});
assert(oldSalary50000.standardDeduction === OLD_STANDARD_DEDUCTION, "Old-regime salary ₹50,000 standard deduction must be ₹50,000");
assert(oldSalary50000.taxableIncome === 0, "Old-regime salary ₹50,000 after standard deduction must be ₹0 taxable");

const oldSalary5L = calculateIncomeTaxEstimate({
  annualSalaryIncome: 500000,
  regime: INCOME_TAX_REGIMES.OLD,
  eligibleDeductions: 0,
});
assert(oldSalary5L.standardDeduction === OLD_STANDARD_DEDUCTION, "Old-regime salary ₹5,00,000 standard deduction must be ₹50,000 before other eligible deductions");
assert(oldSalary5L.otherDeductions === 0, "Old-regime ₹5,00,000 with default deductions must not invent extra deductions");
assert(oldSalary5L.taxableIncome === 450000, "Old-regime ₹5,00,000 salary minus ₹50,000 standard deduction must be ₹4,50,000 taxable");

const newSalary50000 = calculateIncomeTaxEstimate({
  annualSalaryIncome: 50000,
  regime: INCOME_TAX_REGIMES.NEW,
});
assert(newSalary50000.standardDeduction === 50000, "New-regime salary ₹50,000 must cap standard deduction at salary");
assert(newSalary50000.taxableIncome === 0, "New-regime salary ₹50,000 must not become negative after standard deduction");

const newSalary75000 = calculateIncomeTaxEstimate({
  annualSalaryIncome: 75000,
  regime: INCOME_TAX_REGIMES.NEW,
});
assert(newSalary75000.standardDeduction === NEW_STANDARD_DEDUCTION, "New-regime salary ₹75,000 standard deduction must be ₹75,000");
assert(newSalary75000.taxableIncome === 0, "New-regime salary ₹75,000 after standard deduction must be ₹0 taxable");

const newSalary10L = calculateIncomeTaxEstimate({
  annualSalaryIncome: 1000000,
  regime: INCOME_TAX_REGIMES.NEW,
});
assert(newSalary10L.standardDeduction === NEW_STANDARD_DEDUCTION, "New-regime salary ₹10,00,000 standard deduction must be ₹75,000");
assert(newSalary10L.otherDeductions === 0, "New-regime ₹10,00,000 must not apply visitor-entered deductions");
assert(newSalary10L.taxableIncome === 925000, "New-regime ₹10,00,000 salary minus ₹75,000 must be ₹9,25,000 taxable");

const comparedAt10L = compareRegimeEstimates({
  annualSalaryIncome: 1000000,
  eligibleDeductions: 0,
});
assert(comparedAt10L.newRegime.standardDeduction === NEW_STANDARD_DEDUCTION, "Comparison must apply ₹75,000 new-regime salary standard deduction");
assert(comparedAt10L.oldRegime.standardDeduction === OLD_STANDARD_DEDUCTION, "Comparison must apply ₹50,000 old-regime salary standard deduction");
assert(comparedAt10L.newRegime.incomeConsidered === comparedAt10L.oldRegime.incomeConsidered, "Comparison must use the same salary input");
assert(comparedAt10L.newRegime.otherDeductions === 0, "Comparison new-regime path must not receive visitor-entered deductions");

const oldSalaryAndEnteredDeductions = calculateIncomeTaxEstimate({
  annualSalaryIncome: 500000,
  regime: INCOME_TAX_REGIMES.OLD,
  eligibleDeductions: 100000,
});
assert(oldSalaryAndEnteredDeductions.standardDeduction === OLD_STANDARD_DEDUCTION, "Old regime must keep salary standard deduction separate from entered deductions");
assert(oldSalaryAndEnteredDeductions.otherDeductions === 100000, "Old regime must apply visitor-entered deductions after standard deduction");
assert(
  oldSalaryAndEnteredDeductions.taxableIncome === 350000,
  "Old-regime salary ₹5,00,000 minus ₹50,000 standard deduction minus ₹1,00,000 entered deductions must be ₹3,50,000",
);
assert(
  oldSalaryAndEnteredDeductions.standardDeduction + oldSalaryAndEnteredDeductions.otherDeductions === 150000,
  "Salary standard deduction must not be duplicated inside visitor-entered deductions",
);

const oldFiveLakhTaxable = calculateIncomeTaxEstimate({
  annualSalaryIncome: 500000 + OLD_STANDARD_DEDUCTION,
  regime: INCOME_TAX_REGIMES.OLD,
  eligibleDeductions: 0,
});
assert(oldFiveLakhTaxable.taxableIncome === 500000, "Old-regime ₹5,00,000 taxable fixture must subtract only the salary standard deduction");
assert(oldFiveLakhTaxable.slabTax === 12500, "Old-regime ₹5,00,000 taxable income slab tax must be ₹12,500");
assert(oldFiveLakhTaxable.rebate === 12500, "Eligible old-regime 87A at ₹5,00,000 taxable must equal tax payable");
assert(oldFiveLakhTaxable.marginalRelief === 0, "Old regime must not receive new-regime 87A marginal relief");
assert(oldFiveLakhTaxable.estimatedTax === 0, "Eligible old-regime ₹5,00,000 taxable estimate must be ₹0 after rebate and cess");

const oldWithDeductions = calculateIncomeTaxEstimate({
  annualSalaryIncome: 800000,
  regime: INCOME_TAX_REGIMES.OLD,
  eligibleDeductions: 1000000,
});
assert(oldWithDeductions.taxableIncome === 0, "Deductions must not produce negative taxable income");
assert(oldWithDeductions.estimatedTax === 0, "Zero taxable income must produce zero estimated tax");
assert(oldWithDeductions.marginalRelief === 0, "Zero taxable income must not invent marginal relief");

const ignoredNewDeductions = calculateIncomeTaxEstimate({
  annualSalaryIncome: 2000000,
  regime: INCOME_TAX_REGIMES.NEW,
  eligibleDeductions: 150000,
});
assert(ignoredNewDeductions.otherDeductions === 0, "New regime must ignore old-regime deduction input");

const switchedNew = calculateIncomeTaxEstimate({ annualSalaryIncome: 1800000, regime: INCOME_TAX_REGIMES.NEW });
const switchedOld = calculateIncomeTaxEstimate({ annualSalaryIncome: 1800000, regime: INCOME_TAX_REGIMES.OLD });
assert(switchedNew.regime === INCOME_TAX_REGIMES.NEW, "Regime switch must keep the new-regime path");
assert(switchedOld.regime === INCOME_TAX_REGIMES.OLD, "Regime switch must keep the old-regime path");
assert(switchedNew.estimatedTax !== switchedOld.estimatedTax, "Regime switching must produce deterministic different paths at ₹18,00,000");
assert(switchedNew.standardDeduction === NEW_STANDARD_DEDUCTION, "₹18,00,000 new-regime path must apply ₹75,000 salary standard deduction");
assert(switchedOld.standardDeduction === OLD_STANDARD_DEDUCTION, "₹18,00,000 old-regime path must apply ₹50,000 salary standard deduction");
assert(switchedOld.marginalRelief === 0, "Old-regime path must not apply new-regime marginal relief");
assert(
  nearlyEqual(switchedNew.cess, switchedNew.taxAfterRebate * 0.04),
  "Cess must be 4% of tax after rebate or relief when surcharge is not modelled",
);
assert(switchedNew.surchargeModelled === false, "Surcharge must remain unimplemented");

const comparison = compareRegimeEstimates({ annualSalaryIncome: 1800000, eligibleDeductions: 0 });
assert(
  comparison.lowerEstimatedRegime === INCOME_TAX_REGIMES.NEW
  || comparison.lowerEstimatedRegime === INCOME_TAX_REGIMES.OLD
  || comparison.lowerEstimatedRegime === null,
  "Regime comparison must stay educational and non-prescriptive",
);

[
  calculateIncomeTaxEstimate({}),
  calculateIncomeTaxEstimate({ annualSalaryIncome: Number.NaN, regime: "new" }),
  calculateIncomeTaxEstimate({ annualSalaryIncome: 0, regime: "old", eligibleDeductions: 0 }),
  calculateIncomeTaxEstimate({ annualSalaryIncome: INCOME_TAX_EDUCATIONAL_INCOME_CAP, regime: "new" }),
  justOver12L,
  twelveLakhFiftyThousand,
  sixteenLakhNew,
  oldSalary40000,
  newSalary50000,
  oldSalaryAndEnteredDeductions,
].forEach((result, index) => {
  assert(result.taxableIncome >= 0, `Taxable income ${index} must not be negative`);
  assert(result.standardDeduction >= 0, `Standard deduction ${index} must not be negative`);
  assert(result.standardDeduction <= result.incomeConsidered, `Standard deduction ${index} must not exceed salary`);
  assert(result.rebate <= result.slabTax, `Rebate ${index} must not exceed slab tax`);
  assert(result.marginalRelief >= 0, `marginalRelief ${index} must be >= 0`);
  assert(result.marginalRelief <= result.slabTax, `marginalRelief ${index} must not exceed slab tax`);
  assert(!(result.rebate > 0 && result.marginalRelief > 0), `Rebate and marginal relief must not both apply (${index})`);
  assert(result.completeEstimate === true, `Estimate ${index} must be complete after 87A treatment`);
  assert(Number.isFinite(result.estimatedTax), `Complete estimate ${index} must be finite`);
  assert(!Number.isNaN(result.estimatedTax), `Complete estimate ${index} must not be NaN`);
  assert(result.estimatedTax >= 0, `Complete estimate ${index} must not be negative`);
  assert(result.estimatedTax !== Number.POSITIVE_INFINITY, `Complete estimate ${index} must not be Infinity`);
  assert(Number.isFinite(result.taxableIncome) && !Number.isNaN(result.taxableIncome), `Taxable income ${index} must be finite`);
  assert(!Object.hasOwn(result, "capitalGains"), `Estimate ${index} must not model special-rate capital gains`);
});

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/IncomeTaxCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/incomeTax/incomeTaxEngine.js"), "utf8");
assert(
  !calculatorSource.includes("Not estimated in this range"),
  "Income tax UI must not use the temporary not-estimated workaround",
);
assert(
  calculatorSource.includes("Salary standard deduction"),
  "Income tax UI must show the salary standard deduction in the breakdown",
);
assert(
  calculatorSource.includes("Section 87A marginal relief"),
  "Income tax UI must show Section 87A marginal relief in the breakdown",
);
assert(
  !calculatorSource.includes("The new-regime salary standard deduction is not applied"),
  "Income tax UI must not say the old regime skips salary standard deduction",
);
assert(
  engineSource.includes("special-rate") || engineSource.includes("Special-rate"),
  "Central engine must document that special-rate income is outside calculator scope",
);

if (failures.length) {
  console.error(`Income tax validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Income tax validation passed: ${checks} checks.`);
console.log(`87A marginal-relief cease taxable income (first integer where slab tax does not exceed excess): ₹${reliefCeaseIncome.toLocaleString("en-IN")}`);
console.log(`₹12,00,000 → rebate ₹${twelveLakhNewTaxable.rebate}, relief ₹${twelveLakhNewTaxable.marginalRelief}, tax before cess ₹${twelveLakhNewTaxable.taxAfterRebate}, cess ₹${twelveLakhNewTaxable.cess}, total ₹${twelveLakhNewTaxable.estimatedTax}`);
console.log(`₹12,00,001 → rebate ₹${justOver12L.rebate}, relief ₹${justOver12L.marginalRelief}, tax before cess ₹${justOver12L.taxAfterRebate}, cess ₹${justOver12L.cess}, total ₹${justOver12L.estimatedTax}`);
console.log(`₹12,10,000 → rebate ₹${twelveLakhTenThousand.rebate}, relief ₹${twelveLakhTenThousand.marginalRelief}, tax before cess ₹${twelveLakhTenThousand.taxAfterRebate}, cess ₹${twelveLakhTenThousand.cess}, total ₹${twelveLakhTenThousand.estimatedTax}`);
console.log(`₹12,50,000 → rebate ₹${twelveLakhFiftyThousand.rebate}, relief ₹${twelveLakhFiftyThousand.marginalRelief}, tax before cess ₹${twelveLakhFiftyThousand.taxAfterRebate}, cess ₹${twelveLakhFiftyThousand.cess}, total ₹${twelveLakhFiftyThousand.estimatedTax}`);
console.log(`₹${(reliefCeaseIncome - 1).toLocaleString("en-IN")} → relief ₹${justBelowCease.marginalRelief}, tax before cess ₹${justBelowCease.taxAfterRebate}`);
console.log(`₹${reliefCeaseIncome.toLocaleString("en-IN")} → relief ₹${atCease.marginalRelief}, tax before cess ₹${atCease.taxAfterRebate}`);
console.log(`₹${(reliefCeaseIncome + 1).toLocaleString("en-IN")} → relief ₹${justAboveCease.marginalRelief}, tax before cess ₹${justAboveCease.taxAfterRebate}`);
console.log(`₹16,00,000 → rebate ₹${sixteenLakhNew.rebate}, relief ₹${sixteenLakhNew.marginalRelief}, tax before cess ₹${sixteenLakhNew.taxAfterRebate}, cess ₹${sixteenLakhNew.cess}, total ₹${sixteenLakhNew.estimatedTax}`);
console.log(`Old salary ₹40,000 → SD ₹${oldSalary40000.standardDeduction}, taxable ₹${oldSalary40000.taxableIncome}`);
console.log(`Old salary ₹50,000 → SD ₹${oldSalary50000.standardDeduction}, taxable ₹${oldSalary50000.taxableIncome}`);
console.log(`Old salary ₹5,00,000 → SD ₹${oldSalary5L.standardDeduction}, other ₹${oldSalary5L.otherDeductions}, taxable ₹${oldSalary5L.taxableIncome}`);
console.log(`New salary ₹50,000 → SD ₹${newSalary50000.standardDeduction}, taxable ₹${newSalary50000.taxableIncome}`);
console.log(`New salary ₹75,000 → SD ₹${newSalary75000.standardDeduction}, taxable ₹${newSalary75000.taxableIncome}`);
console.log(`New salary ₹10,00,000 → SD ₹${newSalary10L.standardDeduction}, taxable ₹${newSalary10L.taxableIncome}`);
console.log(`Compare ₹10,00,000 → new SD ₹${comparedAt10L.newRegime.standardDeduction}, old SD ₹${comparedAt10L.oldRegime.standardDeduction}`);
console.log(`Old ₹5,00,000 + entered ₹1,00,000 → SD ₹${oldSalaryAndEnteredDeductions.standardDeduction}, other ₹${oldSalaryAndEnteredDeductions.otherDeductions}, taxable ₹${oldSalaryAndEnteredDeductions.taxableIncome}`);
