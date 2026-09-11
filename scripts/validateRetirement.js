/* global process */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  annualCompound,
  calculateBeginningOfMonthContribution,
  calculateRetirementEstimate,
  depletionTolerance,
  simulateBeginningOfMonthDepletion,
  solveRequiredRetirementCorpus,
} from "../src/utils/retirement/retirementEngine.js";
import {
  RETIREMENT_25X_LABEL,
  RETIREMENT_25X_NOTE,
  RETIREMENT_CONTRIBUTION_LABEL,
  RETIREMENT_DEFAULTS,
  RETIREMENT_INVALID_AGE,
  RETIREMENT_INVALID_AGE_NOTE,
  RETIREMENT_PRE_RETURN_HELPER,
  RETIREMENT_PRIMARY_RESULT_LABEL,
  RETIREMENT_PROJECTED_SAVINGS_LABEL,
  RETIREMENT_SHORTFALL_LABEL,
  RETIREMENT_SIMPLE_25X_MULTIPLIER,
  RETIREMENT_STORY,
} from "../src/utils/retirement/retirementRules.js";

const failures = [];
let checks = 0;
const vectors = [];

function assert(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function nearlyEqual(left, right, tolerance = 0.01) {
  return Math.abs(left - right) <= tolerance;
}

function isFiniteNumber(value) {
  return Number.isFinite(value);
}

function documentedRequiredCorpus(firstMonthlyExpense, postReturnPercent, retirementInflationPercent, retirementYears) {
  const n = retirementYears * 12;
  const growthFactor = 1 + postReturnPercent / 12 / 100;
  const inflationFactor = 1 + retirementInflationPercent / 12 / 100;
  const q = inflationFactor / growthFactor;
  const sum = Math.abs(q - 1) < 1e-12 ? n : (1 - q ** n) / (1 - q);
  return firstMonthlyExpense * sum;
}

function documentedAnnuityDue(shortfall, annualRatePercent, years) {
  const n = years * 12;
  const r = annualRatePercent / 12 / 100;
  if (shortfall <= 0 || n <= 0) return 0;
  if (r === 0) return shortfall / n;
  return shortfall / ((((1 + r) ** n - 1) / r) * (1 + r));
}

function recordVector({
  id,
  inputs,
  method,
  expected,
  actual,
  tolerance = 0.01,
}) {
  const difference = actual - expected;
  vectors.push({
    id,
    inputs,
    method,
    expected,
    actual,
    difference,
  });
  assert(
    Number.isFinite(actual) && nearlyEqual(actual, expected, tolerance),
    `${id}: expected ${expected}, engine ${actual}, difference ${difference}`,
  );
}

function assertFiniteNonNegativeContract(result, label) {
  const numericFields = [
    "yearsToRetirement",
    "monthsToRetirement",
    "monthlyExpenseAtRetirement",
    "retirementYears",
    "monthsInRetirement",
    "primaryRequiredCorpus",
    "projectedExistingCorpus",
    "shortfall",
    "surplus",
    "monthlyContributionRequired",
    "simple25xComparison",
  ];
  numericFields.forEach((field) => {
    assert(field in result, `${label} missing ${field}`);
    assert(isFiniteNumber(result[field]), `${label} ${field} must be finite`);
    assert(result[field] >= 0, `${label} ${field} must not be negative`);
  });
  assert("valid" in result, `${label} missing valid`);
  assert(Array.isArray(result.validationErrors), `${label} missing validationErrors`);
  assert(result.assumptions && typeof result.assumptions === "object", `${label} missing assumptions`);
}

function verifyDepletion(result, label) {
  const closing = simulateBeginningOfMonthDepletion({
    startingCorpus: result.primaryRequiredCorpus,
    firstMonthlyExpense: result.monthlyExpenseAtRetirement,
    monthlyReturn: result.assumptions.postRetirementReturnRate / 12 / 100,
    monthlyInflation: result.assumptions.retirementInflationRate / 12 / 100,
    months: result.monthsInRetirement,
  });
  const tolerance = depletionTolerance(result.primaryRequiredCorpus);
  assert(
    Number.isFinite(closing) && Math.abs(closing) <= tolerance,
    `${label}: forward depletion closing corpus ${closing} exceeds tolerance ${tolerance}`,
  );
  return closing;
}

const defaultInputs = { ...RETIREMENT_DEFAULTS };
const defaultEstimate = calculateRetirementEstimate(defaultInputs);

assert(defaultEstimate.valid, "A: default scenario must be valid");
assertFiniteNonNegativeContract(defaultEstimate, "A: default");
assert(defaultEstimate.yearsToRetirement === 30, "A: years to retirement must be 30");
assert(defaultEstimate.monthsToRetirement === 360, "A: months to retirement must be 360");
assert(defaultEstimate.retirementYears === 25, "A: retirement years default 25");
assert(defaultEstimate.monthsInRetirement === 300, "A: months in retirement must be 300");

const defaultExpenseAtRetirement = annualCompound(50000, 6, 30);
recordVector({
  id: "A: monthly expense at retirement",
  inputs: defaultInputs,
  method: "currentMonthlyExpense × (1 + preRetirementInflationRate/100)^yearsToRetirement",
  expected: defaultExpenseAtRetirement,
  actual: defaultEstimate.monthlyExpenseAtRetirement,
  tolerance: 1e-8,
});

const defaultRequired = documentedRequiredCorpus(
  defaultExpenseAtRetirement,
  7,
  5,
  25,
);
recordVector({
  id: "A: primary required corpus",
  inputs: defaultInputs,
  method: "C0 = E1 × Σ q^t, q = (1+g)/(1+r), beginning-of-month withdrawals",
  expected: defaultRequired,
  actual: defaultEstimate.primaryRequiredCorpus,
  tolerance: 1e-6,
});

const defaultProjected = annualCompound(500000, 10, 30);
recordVector({
  id: "A: projected existing corpus",
  inputs: defaultInputs,
  method: "currentRetirementCorpus × (1 + preRetirementReturnRate/100)^yearsToRetirement",
  expected: defaultProjected,
  actual: defaultEstimate.projectedExistingCorpus,
  tolerance: 1e-8,
});

recordVector({
  id: "A: shortfall",
  inputs: defaultInputs,
  method: "max(primaryRequiredCorpus − projectedExistingCorpus, 0)",
  expected: Math.max(defaultRequired - defaultProjected, 0),
  actual: defaultEstimate.shortfall,
  tolerance: 1e-6,
});

recordVector({
  id: "A: monthly contribution",
  inputs: defaultInputs,
  method: "annuity-due: shortfall / (((1+r)^n − 1)/r × (1+r))",
  expected: documentedAnnuityDue(
    defaultEstimate.shortfall,
    10,
    30,
  ),
  actual: defaultEstimate.monthlyContributionRequired,
  tolerance: 1e-6,
});

verifyDepletion(defaultEstimate, "A: default depletion");

function zeroRateCase(id, overrides, notes) {
  const inputs = { ...RETIREMENT_DEFAULTS, ...overrides };
  const result = calculateRetirementEstimate(inputs);
  assert(result.valid, `${id} must be valid`);
  assertFiniteNonNegativeContract(result, id);
  const expectedExpense = annualCompound(
    inputs.currentMonthlyExpense,
    inputs.preRetirementInflationRate,
    inputs.retirementAge - inputs.currentAge,
  );
  const expectedCorpus = documentedRequiredCorpus(
    expectedExpense,
    inputs.postRetirementReturnRate,
    inputs.retirementInflationRate,
    inputs.retirementYears,
  );
  recordVector({
    id: `${id}: primary corpus`,
    inputs,
    method: notes,
    expected: expectedCorpus,
    actual: result.primaryRequiredCorpus,
    tolerance: 1e-4,
  });
  verifyDepletion(result, id);
  return result;
}

zeroRateCase("B: zero pre-retirement inflation", {
  preRetirementInflationRate: 0,
}, "0% pre-retirement inflation; annual expense growth factor = 1");

zeroRateCase("C: zero pre-retirement return", {
  preRetirementReturnRate: 0,
}, "0% pre-retirement return; existing corpus is unchanged to retirement");

const zeroPreReturn = calculateRetirementEstimate({
  ...RETIREMENT_DEFAULTS,
  preRetirementReturnRate: 0,
});
assert(
  nearlyEqual(zeroPreReturn.projectedExistingCorpus, RETIREMENT_DEFAULTS.currentRetirementCorpus, 1e-8),
  "C: projected existing corpus equals current corpus at 0% pre-retirement return",
);
recordVector({
  id: "C: contribution at 0% pre-retirement return",
  inputs: { ...RETIREMENT_DEFAULTS, preRetirementReturnRate: 0 },
  method: "monthlyContribution = shortfall / monthsToRetirement",
  expected: zeroPreReturn.shortfall / zeroPreReturn.monthsToRetirement,
  actual: zeroPreReturn.monthlyContributionRequired,
  tolerance: 1e-8,
});

zeroRateCase("D: zero retirement inflation", {
  retirementInflationRate: 0,
}, "0% retirement inflation; G = 1");

zeroRateCase("E: zero post-retirement return", {
  postRetirementReturnRate: 0,
}, "0% post-retirement return; R = 1");

const bothZero = zeroRateCase("F: both retirement inflation and return = 0", {
  retirementInflationRate: 0,
  postRetirementReturnRate: 0,
}, "r = 0 and g = 0 → C0 = E1 × monthsInRetirement");
assert(
  nearlyEqual(
    bothZero.primaryRequiredCorpus,
    bothZero.monthlyExpenseAtRetirement * bothZero.monthsInRetirement,
    1e-6,
  ),
  "F: required corpus equals first monthly expense × retirement months",
);

const zeroCorpus = zeroRateCase("G: current corpus = 0", {
  currentRetirementCorpus: 0,
}, "current savings 0 → projected existing corpus 0");
assert(zeroCorpus.projectedExistingCorpus === 0, "G: projected existing corpus is 0");
assert(zeroCorpus.shortfall === zeroCorpus.primaryRequiredCorpus, "G: shortfall equals required corpus");

const surplusInputs = {
  ...RETIREMENT_DEFAULTS,
  currentRetirementCorpus: 50000000,
  currentMonthlyExpense: 10000,
  retirementYears: 1,
  retirementInflationRate: 0,
  postRetirementReturnRate: 0,
};
const surplusResult = calculateRetirementEstimate(surplusInputs);
assert(surplusResult.valid, "H: surplus case must be valid");
assert(surplusResult.shortfall === 0, "H: shortfall is 0 when existing corpus exceeds required corpus");
assert(surplusResult.monthlyContributionRequired === 0, "H: monthly contribution is 0 when there is no shortfall");
assert(surplusResult.surplus > 0, "H: surplus is reported separately");
assertFiniteNonNegativeContract(surplusResult, "H: surplus");
recordVector({
  id: "H: surplus shortfall",
  inputs: surplusInputs,
  method: "max(required − projected, 0) when projected exceeds required",
  expected: 0,
  actual: surplusResult.shortfall,
});

const equalAges = calculateRetirementEstimate({
  ...RETIREMENT_DEFAULTS,
  currentAge: 50,
  retirementAge: 50,
});
assert(equalAges.valid === false, "I: retirementAge == currentAge is invalid");
assert(
  equalAges.validationErrors.some((error) => error.code === RETIREMENT_INVALID_AGE),
  "I: equal ages use the age validation code",
);
assert(equalAges.primaryRequiredCorpus === 0, "I: invalid equal-age case does not emit a corpus");
assert(equalAges.yearsToRetirement === 0, "I: equal ages are not forced to 1 year");

const invertedAges = calculateRetirementEstimate({
  ...RETIREMENT_DEFAULTS,
  currentAge: 55,
  retirementAge: 40,
});
assert(invertedAges.valid === false, "J: retirementAge < currentAge is invalid");
assert(
  invertedAges.validationErrors.some((error) => error.code === RETIREMENT_INVALID_AGE),
  "J: inverted ages use the age validation code",
);
assert(invertedAges.monthlyContributionRequired === 0, "J: inverted ages do not emit a contribution");

const oneYear = zeroRateCase("K: 1-year retirement duration", {
  retirementYears: 1,
}, "n = 12 monthly periods");
assert(oneYear.monthsInRetirement === 12, "K: 1-year retirement is 12 months");

const longDuration = zeroRateCase("L: long retirement duration", {
  retirementYears: 50,
}, "n = 600 monthly periods");
assert(longDuration.monthsInRetirement === 600, "L: 50-year retirement is 600 months");

const highExpense = zeroRateCase("M: high but valid expense", {
  currentMonthlyExpense: 500000,
}, "UI-maximum monthly expense");
assert(highExpense.monthlyExpenseAtRetirement > 500000, "M: inflated high expense exceeds current expense");

const repeatA = calculateRetirementEstimate(defaultInputs);
const repeatB = calculateRetirementEstimate(defaultInputs);
assert(
  repeatA.primaryRequiredCorpus === repeatB.primaryRequiredCorpus &&
    repeatA.monthlyContributionRequired === repeatB.monthlyContributionRequired &&
    repeatA.simple25xComparison === repeatB.simple25xComparison,
  "N: default scenario is deterministic across repeats",
);

[
  defaultEstimate,
  zeroCorpus,
  surplusResult,
  bothZero,
  highExpense,
  longDuration,
  oneYear,
].forEach((result, index) => {
  Object.values(result).forEach((value) => {
    if (typeof value === "number") {
      assert(Number.isFinite(value), `O: result ${index} contains a non-finite number`);
      assert(!Number.isNaN(value), `O: result ${index} contains NaN`);
    }
  });
});

recordVector({
  id: "P: 25× comparison identity",
  inputs: defaultInputs,
  method: "monthlyExpenseAtRetirement × 12 × 25",
  expected: defaultEstimate.monthlyExpenseAtRetirement * 12 * RETIREMENT_SIMPLE_25X_MULTIPLIER,
  actual: defaultEstimate.simple25xComparison,
  tolerance: 1e-8,
});
assert(
  defaultEstimate.simple25xComparison !== defaultEstimate.primaryRequiredCorpus,
  "P: 25× comparison is not used as the primary required corpus",
);

recordVector({
  id: "Q: annuity-due identity",
  inputs: defaultInputs,
  method: "shortfall / (((1+r)^n − 1)/r × (1+r)) with r = 10%/12, n = 360",
  expected: calculateBeginningOfMonthContribution(
    defaultEstimate.shortfall,
    10,
    30,
  ),
  actual: defaultEstimate.monthlyContributionRequired,
  tolerance: 1e-8,
});

/**
 * Independent beginning-of-month ledger. This is the documented recurrence,
 * not a second production solver. It is used only to prove that the engine
 * corpus depletes to approximately zero under that convention.
 *
 * For t = 0 ... n-1:
 *   expense_0 = firstMonthlyExpense
 *   afterWithdrawal_t = openingCorpus_t − expense_t
 *   closingCorpus_t = afterWithdrawal_t × (1 + monthlyReturn)
 *   openingCorpus_(t+1) = closingCorpus_t
 *   expense_(t+1) = expense_t × (1 + monthlyInflation)
 */
function independentBeginningOfMonthRecurrence({
  startingCorpus,
  firstMonthlyExpense,
  monthlyReturn,
  monthlyInflation,
  months,
}) {
  const ledger = [];
  let openingCorpus = startingCorpus;
  let expense = firstMonthlyExpense;
  for (let t = 0; t < months; t += 1) {
    const afterWithdrawal = openingCorpus - expense;
    const closingCorpus = afterWithdrawal * (1 + monthlyReturn);
    ledger.push({
      t,
      expense_t: expense,
      openingCorpus_t: openingCorpus,
      afterWithdrawal_t: afterWithdrawal,
      closingCorpus_t: closingCorpus,
    });
    openingCorpus = closingCorpus;
    expense *= 1 + monthlyInflation;
  }
  return { ledger, finalCorpus: openingCorpus };
}

const timingProofs = [];

function runTimingProof({
  id,
  firstMonthlyExpense,
  annualReturnPercent,
  annualInflationPercent,
  months,
  expectedClosedForm,
}) {
  const monthlyReturn = annualReturnPercent / 12 / 100;
  const monthlyInflation = annualInflationPercent / 12 / 100;
  const engineCorpus = solveRequiredRetirementCorpus({
    firstMonthlyExpense,
    monthlyReturn,
    monthlyInflation,
    months,
  });
  const simulation = independentBeginningOfMonthRecurrence({
    startingCorpus: engineCorpus,
    firstMonthlyExpense,
    monthlyReturn,
    monthlyInflation,
    months,
  });
  const absoluteResidual = Math.abs(simulation.finalCorpus);
  const relativeResidual = engineCorpus === 0 ? 0 : absoluteResidual / engineCorpus;
  const residualTolerance = Math.max(1e-8, Math.abs(engineCorpus) * 1e-10);

  timingProofs.push({
    id,
    firstMonthlyExpense,
    annualReturnPercent,
    annualInflationPercent,
    monthlyReturn,
    monthlyInflation,
    months,
    startingCorpus: engineCorpus,
    withdrawals: simulation.ledger.map((row) => row.expense_t),
    ledger: simulation.ledger,
    finalCorpus: simulation.finalCorpus,
    absoluteResidual,
    relativeResidual,
  });

  assert(Number.isFinite(engineCorpus), `${id}: engine corpus must be finite`);
  assert(engineCorpus >= 0, `${id}: engine corpus must not be negative`);
  if (expectedClosedForm != null) {
    assert(
      nearlyEqual(engineCorpus, expectedClosedForm, 1e-8),
      `${id}: engine ${engineCorpus} must match closed form ${expectedClosedForm}`,
    );
  }
  assert(
    absoluteResidual <= residualTolerance,
    `${id}: independent recurrence residual ${simulation.finalCorpus} exceeds ${residualTolerance}`,
  );
  return { engineCorpus, simulation, monthlyReturn, monthlyInflation };
}

const timingE1 = defaultEstimate.monthlyExpenseAtRetirement;
const defaultMonthlyReturn = 7 / 12 / 100;
const defaultMonthlyInflation = 5 / 12 / 100;

const oneMonthProof = runTimingProof({
  id: "TIMING A: 1 month",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 7,
  annualInflationPercent: 5,
  months: 1,
  expectedClosedForm: timingE1,
});
assert(
  oneMonthProof.engineCorpus === timingE1,
  "TIMING A: one-month required corpus must equal the first retirement-month expense exactly",
);
assert(
  oneMonthProof.simulation.ledger[0].afterWithdrawal_t === 0,
  "TIMING A: first withdrawal must exhaust the opening corpus immediately",
);
assert(
  oneMonthProof.simulation.finalCorpus === 0,
  "TIMING A: closing corpus after the final month's growth must be exactly 0",
);

const twoMonthExpected = timingE1 + (timingE1 * (1 + defaultMonthlyInflation)) / (1 + defaultMonthlyReturn);
const twoMonthProof = runTimingProof({
  id: "TIMING B: 2 months",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 7,
  annualInflationPercent: 5,
  months: 2,
  expectedClosedForm: twoMonthExpected,
});
assert(
  nearlyEqual(twoMonthProof.engineCorpus, twoMonthExpected, 1e-8),
  "TIMING B: two-month corpus must equal E1 + E1(1+g)/(1+r)",
);

runTimingProof({
  id: "TIMING C: 12 months",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 7,
  annualInflationPercent: 5,
  months: 12,
});

runTimingProof({
  id: "TIMING D: default 25 years",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 7,
  annualInflationPercent: 5,
  months: 300,
  expectedClosedForm: defaultEstimate.primaryRequiredCorpus,
});
assert(
  nearlyEqual(
    timingProofs.find((row) => row.id.startsWith("TIMING D")).startingCorpus,
    defaultEstimate.primaryRequiredCorpus,
    1e-8,
  ),
  "TIMING D: helper corpus must match the public default primaryRequiredCorpus",
);

runTimingProof({
  id: "TIMING E: r = 0, g = 0",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 0,
  annualInflationPercent: 0,
  months: 300,
  expectedClosedForm: timingE1 * 300,
});

runTimingProof({
  id: "TIMING F: r = g = 5% annual nominal / 12",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 5,
  annualInflationPercent: 5,
  months: 300,
  expectedClosedForm: timingE1 * 300,
});

runTimingProof({
  id: "TIMING G: r > g (7% vs 5%)",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 7,
  annualInflationPercent: 5,
  months: 300,
});

runTimingProof({
  id: "TIMING H: g > r (8% vs 4%)",
  firstMonthlyExpense: timingE1,
  annualReturnPercent: 4,
  annualInflationPercent: 8,
  months: 300,
});

const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const calculatorSource = readFileSync(join(sourceRoot, "src/components/RetirementCalculator.jsx"), "utf8");
const engineSource = readFileSync(join(sourceRoot, "src/utils/retirement/retirementEngine.js"), "utf8");
const rulesSource = readFileSync(join(sourceRoot, "src/utils/retirement/retirementRules.js"), "utf8");
const centralValidatorSource = readFileSync(join(sourceRoot, "scripts/validateAllCalculators.js"), "utf8");
const insightsSource = readFileSync(join(sourceRoot, "src/data/calculatorInsights.js"), "utf8");
const explainsSource = readFileSync(join(sourceRoot, "src/data/calculatorExplains.js"), "utf8");

assert(calculatorSource.includes("calculateRetirementEstimate"), "R: calculator component imports production engine");
assert(calculatorSource.includes("RETIREMENT_PRIMARY_RESULT_LABEL"), "R: calculator uses the illustrative corpus label");
assert(calculatorSource.includes("RETIREMENT_PERIOD_SECTION_TITLE"), "R: calculator shows retirement period assumptions");
assert(!calculatorSource.includes("Target Corpus"), "R: calculator must not use Target Corpus");
assert(!calculatorSource.includes("Expected Return"), "R: calculator must not use Expected Return");
assert(!calculatorSource.includes("max(retirementAge - currentAge, 1)"), "R: calculator must not silently force a 1-year horizon");
assert(!engineSource.includes("max(retirementAge - currentAge, 1)"), "R: engine must not silently force a 1-year horizon");

assert(
  centralValidatorSource.includes("calculateRetirementEstimate"),
  "S: central validator must import the production retirement engine",
);
assert(
  !centralValidatorSource.includes("expenseAtRetirement * 12 * 25"),
  "S: central validator must not reimplement 25× as a primary corpus formula",
);
assert(
  !centralValidatorSource.includes("corpusNeeded"),
  "S: central validator must not keep a divergent corpusNeeded formula",
);

const insightsStart = insightsSource.indexOf('"/retirement-calculator": {');
const insightsEnd = insightsSource.indexOf('"/goal-planner": {');
const explainsStart = explainsSource.indexOf('"/retirement-calculator": {');
const explainsEnd = explainsSource.indexOf('"/goal-planner": {');
const retirementInsights = insightsSource.slice(insightsStart, insightsEnd);
const retirementExplains = explainsSource.slice(explainsStart, explainsEnd);
const publicCopy = `${calculatorSource}\n${rulesSource}\n${retirementInsights}\n${retirementExplains}`;

assert(retirementInsights.includes("25× simple comparison") || retirementInsights.includes("25x simple comparison") || retirementInsights.includes(RETIREMENT_25X_LABEL), "Insights must keep 25× as a comparison");
assert(!/monthly SIP/.test(retirementExplains), "Explains must not say projected corpus includes a monthly SIP");
assert(!/Current savings and monthly SIP/.test(retirementInsights), "Insights must not list monthly SIP as an input");
assert(!/Corpus Needed = Inflated Monthly Expense/.test(retirementInsights), "Insights must not keep 25× as the primary formula");
assert(publicCopy.includes(RETIREMENT_PRIMARY_RESULT_LABEL) || publicCopy.includes("Illustrative retirement corpus"), "Public copy must use the illustrative corpus label");
assert(publicCopy.includes(RETIREMENT_STORY) || /Under the assumptions entered/.test(publicCopy), "Public copy must keep illustrative framing");
assert(publicCopy.includes(RETIREMENT_PRE_RETURN_HELPER) || /grown to retirement/.test(publicCopy), "Copy must disclose annual compounding of current savings");
assert(!/safe withdrawal/i.test(publicCopy), "Copy must not say safe withdrawal");
assert(!/4% rule/i.test(publicCopy), "Copy must not say 4% rule");
assert(!/recommended corpus/i.test(publicCopy), "Copy must not say recommended corpus");
assert(!/ideal corpus/i.test(publicCopy), "Copy must not say ideal corpus");
assert(!/retirement ready/i.test(publicCopy), "Copy must not say retirement ready");
assert(!/fully secure/i.test(publicCopy), "Copy must not say fully secure");
assert(publicCopy.includes(RETIREMENT_25X_NOTE) || /educational comparison/.test(publicCopy), "Copy must explain 25× as educational comparison");
assert(publicCopy.includes(RETIREMENT_SHORTFALL_LABEL) || /Illustrative funding gap/.test(publicCopy), "Copy must use illustrative funding gap");
assert(publicCopy.includes(RETIREMENT_CONTRIBUTION_LABEL) || /Illustrative monthly contribution/.test(publicCopy), "Copy must use illustrative monthly contribution");
assert(publicCopy.includes(RETIREMENT_PROJECTED_SAVINGS_LABEL) || /Projected value of current retirement savings/.test(publicCopy), "Copy must use projected current savings label");
assert(!/effective annual/i.test(publicCopy), "Copy must not describe divided-by-12 monthly rates as effective annual rates");
assert(
  retirementInsights.includes("annual rate ÷ 12 ÷ 100"),
  "Insights must disclose that post-retirement monthly rates are annual ÷ 12 ÷ 100",
);
assert(
  engineSource.includes("postReturn / 12 / 100") && engineSource.includes("retirementInflation / 12 / 100"),
  "Engine must convert annual post-retirement assumptions as annual / 12 / 100",
);
assert(
  /corpus -= expense[\s\S]*corpus \*= 1 \+ r[\s\S]*expense \*= 1 \+ g/u.test(engineSource),
  "Engine simulation must withdraw, then grow, then inflate",
);
assert(
  engineSource.includes("inflationFactor / growthFactor"),
  "Closed form must use q = (1+g)/(1+r)",
);

if (failures.length) {
  console.error(`Retirement validation failed: ${failures.length} of ${checks} checks`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Retirement validation passed: ${checks} checks.`);
console.log("");
console.log("Deterministic vectors");
console.log("=====================");
vectors.forEach((vector) => {
  console.log(`\n${vector.id}`);
  console.log(`  inputs: ${JSON.stringify(vector.inputs)}`);
  console.log(`  method: ${vector.method}`);
  console.log(`  expected: ${vector.expected}`);
  console.log(`  engine:   ${vector.actual}`);
  console.log(`  difference: ${vector.difference}`);
});
console.log("");
console.log("Beginning-of-month timing proof");
console.log("===============================");
timingProofs.forEach((proof) => {
  console.log(`\n${proof.id}`);
  console.log(`  E1: ${proof.firstMonthlyExpense}`);
  console.log(`  annual return/inflation %: ${proof.annualReturnPercent} / ${proof.annualInflationPercent}`);
  console.log(`  monthly r / g: ${proof.monthlyReturn} / ${proof.monthlyInflation}`);
  console.log(`  months: ${proof.months}`);
  console.log(`  starting corpus: ${proof.startingCorpus}`);
  if (proof.months <= 2) {
    proof.ledger.forEach((row) => {
      console.log(
        `  t=${row.t}: expense=${row.expense_t} opening=${row.openingCorpus_t} afterWithdrawal=${row.afterWithdrawal_t} closing=${row.closingCorpus_t}`,
      );
    });
  }
  console.log(`  final corpus: ${proof.finalCorpus}`);
  console.log(`  absolute residual: ${proof.absoluteResidual}`);
  console.log(`  relative residual: ${proof.relativeResidual}`);
});
console.log("");
console.log(`Default illustrative retirement corpus: ₹${defaultEstimate.primaryRequiredCorpus.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
console.log(`Default 25× simple comparison: ₹${defaultEstimate.simple25xComparison.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
console.log(`Default projected existing savings: ₹${defaultEstimate.projectedExistingCorpus.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
console.log(`Default illustrative monthly contribution: ₹${defaultEstimate.monthlyContributionRequired.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`);
console.log(`Age validation note: ${RETIREMENT_INVALID_AGE_NOTE}`);
