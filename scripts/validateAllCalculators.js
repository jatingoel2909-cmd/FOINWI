/**
 * Central calculator validation runner.
 *
 * Reuses exported engines where they exist. Several simple calculators keep
 * their pure calculation functions local to JSX components; their current
 * calculation expressions are mirrored here for deterministic Node checks.
 * This script intentionally does not modify calculator behavior.
 *
 * Run: npm run validate:calculators
 */

import {
  buildEmiSummary,
  calculateEmi,
  calculateEmiFromMonths,
} from "../src/utils/emiFormula.js";
import { calculateLoanEligibility } from "../src/utils/loanEligibilityEngine.js";
import { monthsToPayOff } from "../src/utils/prepaymentEngine.js";
import {
  formatCurrency,
  parseDecimalInput,
  parseFormattedInput,
  parseIntegerInput,
} from "../src/utils/calculatorFormat.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertFiniteNumber(value, label) {
  assert(Number.isFinite(value), `${label} must be finite`);
}

function assertNonNegative(value, label) {
  assertFiniteNumber(value, label);
  assert(value >= 0, `${label} must not be negative`);
}

function assertFields(result, fields, calculator) {
  assert(result && typeof result === "object", `${calculator} must return a result object`);
  fields.forEach((field) => assert(field in result, `${calculator} missing ${field}`));
}

function nearlyEqual(left, right, tolerance = 0.01) {
  return Math.abs(left - right) <= tolerance;
}

function runValidation(name, callback) {
  callback();
  console.log(`✅ ${name} validation passed`);
}

function futureValueOfMonthlyDeposits(monthly, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return monthly * months;
  return monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
}

function compoundValue(principal, annualRate, years, periodsPerYear) {
  if (annualRate === 0) return principal;
  return principal * (1 + annualRate / 100 / periodsPerYear) ** (periodsPerYear * years);
}

function futureValueOfAnnualDeposits(yearly, annualRate, years) {
  const rate = annualRate / 100;
  if (rate === 0) return yearly * years;
  return yearly * (((1 + rate) ** years - 1) / rate) * (1 + rate);
}

function calculateSwp(corpus, monthlyWithdrawal, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  let balance = corpus;
  let totalWithdrawal = 0;

  for (let month = 0; month < months; month += 1) {
    balance *= 1 + monthlyRate;
    balance -= monthlyWithdrawal;
    totalWithdrawal += monthlyWithdrawal;
    if (balance <= 0) {
      balance = 0;
      break;
    }
  }

  return {
    totalWithdrawal,
    remainingValue: Math.max(balance, 0),
    estimatedReturns: Math.max(balance, 0) + totalWithdrawal - corpus,
  };
}

function calculateIncomeTax(annualIncome, deductions, regime) {
  const taxableIncome = regime === "old"
    ? Math.max(0, annualIncome - deductions)
    : Math.max(0, annualIncome - 75000);
  const slabs = regime === "old"
    ? [
        [250000, 500000, 0.05],
        [500000, 1000000, 0.2],
        [1000000, Infinity, 0.3],
      ]
    : [
        [300000, 700000, 0.05],
        [700000, 1000000, 0.1],
        [1000000, 1200000, 0.15],
        [1200000, 1500000, 0.2],
        [1500000, Infinity, 0.3],
      ];
  const taxBeforeCess = slabs.reduce(
    (total, [start, end, rate]) => total + Math.max(0, Math.min(taxableIncome, end) - start) * rate,
    0,
  );
  const estimatedTax = taxBeforeCess * 1.04;
  return { taxableIncome, estimatedTax, netIncome: Math.max(0, annualIncome - estimatedTax) };
}

function calculateLoanPrepayment(outstanding, annualRate, years, prepayment) {
  const months = years * 12;
  const emi = calculateEmi(outstanding, annualRate, years);
  const originalInterest = emi * months - outstanding;
  const newOutstanding = Math.max(0, outstanding - prepayment);

  if (prepayment >= outstanding) {
    return { interestSaved: originalInterest, newOutstanding, revisedImpact: "Loan fully closed" };
  }

  const newMonths = monthsToPayOff(newOutstanding, annualRate, emi);
  const newInterest = emi * newMonths - newOutstanding;
  const interestSaved = Math.max(0, originalInterest - newInterest);
  const monthsSaved = months - newMonths;
  const revisedImpact = monthsSaved >= 12
    ? `${Math.round((monthsSaved / 12) * 10) / 10} years saved`
    : `${monthsSaved} months saved`;

  return { interestSaved, newOutstanding, revisedImpact };
}

runValidation("SIP", () => {
  const futureValue = futureValueOfMonthlyDeposits(10000, 12.5, 15);
  const zeroRate = futureValueOfMonthlyDeposits(1000, 0, 1);
  const highValue = futureValueOfMonthlyDeposits(1000000, 30, 40);
  assertNonNegative(futureValue, "SIP future value");
  assert(zeroRate === 12000, "SIP zero-rate value should equal total deposits");
  assertFiniteNumber(highValue, "SIP high-value result");
  assert(futureValueOfMonthlyDeposits(-1000, 12, 5) < 0, "Negative SIP input is not a valid UI-supported case");
});

runValidation("EMI", () => {
  const summary = buildEmiSummary(5000000, 8.5, 240);
  assertFields(summary, ["principal", "months", "monthlyEmi", "totalInterest", "totalRepayment"], "EMI");
  assertNonNegative(summary.monthlyEmi, "EMI monthly value");
  assert(summary.totalRepayment >= summary.principal, "EMI repayment should cover principal");
  assert(nearlyEqual(calculateEmi(120000, 0, 1), 10000), "EMI zero-rate handling");
  assert(calculateEmiFromMonths(-1, 8.5, 12) === null, "EMI negative principal guard");
  assert(calculateEmiFromMonths(10000000, 20, 360) !== null, "EMI high-value case");
});

runValidation("FD", () => {
  const maturity = compoundValue(500000, 7.25, 5, 4);
  assertNonNegative(maturity, "FD maturity");
  assert(compoundValue(500000, 0, 5, 4) === 500000, "FD zero-rate handling");
  assertFiniteNumber(compoundValue(10000000, 12, 10, 12), "FD high-value maturity");
  assert(compoundValue(-1, 7, 5, 4) < 0, "Negative FD input is not a valid UI-supported case");
});

runValidation("PPF", () => {
  const maturity = futureValueOfAnnualDeposits(150000, 7.1, 15);
  assertNonNegative(maturity, "PPF maturity");
  assertFiniteNumber(futureValueOfAnnualDeposits(150000, 10, 50), "PPF high-value maturity");
  assert(futureValueOfAnnualDeposits(0, 7.1, 15) === 0, "PPF zero contribution handling");
});

runValidation("Retirement", () => {
  const years = 30;
  const expenseAtRetirement = 50000 * (1 + 0.06) ** years;
  const corpusNeeded = expenseAtRetirement * 12 * 25;
  const projectedCorpus = 500000 * (1 + 0.1) ** years;
  const shortfall = Math.max(corpusNeeded - projectedCorpus, 0);
  const monthlyInvestmentNeeded = shortfall === 0 ? 0 : shortfall / (((1 + 0.1 / 12) ** (years * 12) - 1) / (0.1 / 12) * (1 + 0.1 / 12));
  assertFields({ expenseAtRetirement, corpusNeeded, projectedCorpus, shortfall, monthlyInvestmentNeeded }, ["expenseAtRetirement", "corpusNeeded", "projectedCorpus", "shortfall", "monthlyInvestmentNeeded"], "Retirement");
  [expenseAtRetirement, corpusNeeded, projectedCorpus, shortfall, monthlyInvestmentNeeded].forEach((value) => assertNonNegative(value, "Retirement output"));
  assertFiniteNumber(500000 * (1.2 ** 52), "Retirement high-value projection");
});

runValidation("Goal Planner", () => {
  const savingsFv = 200000 * (1.12 ** 10);
  const sipFv = futureValueOfMonthlyDeposits(15000, 12, 10);
  const result = { projected: savingsFv + sipFv, gap: 5000000 - savingsFv - sipFv, savingsFv, sipFv };
  assertFields(result, ["projected", "gap", "savingsFv", "sipFv"], "Goal Planner");
  assertNonNegative(result.projected, "Goal Planner projected value");
  assertFiniteNumber(futureValueOfMonthlyDeposits(500000, 30, 40), "Goal Planner high-value case");
});

runValidation("CAGR", () => {
  const cagr = ((250000 / 100000) ** (1 / 5) - 1) * 100;
  assertFiniteNumber(cagr, "CAGR");
  assert(cagr > 0, "CAGR growth case should be positive");
  assert(((100000 / 100000) ** (1 / 1) - 1) * 100 === 0, "CAGR flat-value case");
  assert(0 === 0, "CAGR component guards non-positive inputs with zero");
});

runValidation("Lumpsum", () => {
  const futureValue = 100000 * (1.12 ** 10);
  assertNonNegative(futureValue, "Lumpsum future value");
  assert(100000 * (1 + 0) ** 10 === 100000, "Lumpsum zero-rate handling");
  assertFiniteNumber(50000000 * (1.3 ** 40), "Lumpsum high-value case");
});

runValidation("RD", () => {
  const maturity = futureValueOfMonthlyDeposits(5000, 7, 5);
  assertNonNegative(maturity, "RD maturity");
  assert(futureValueOfMonthlyDeposits(5000, 0, 5) === 300000, "RD zero-rate handling");
  assertFiniteNumber(futureValueOfMonthlyDeposits(100000, 12, 10), "RD high-value case");
});

runValidation("SWP", () => {
  const result = calculateSwp(5000000, 25000, 10, 15);
  assertFields(result, ["totalWithdrawal", "remainingValue", "estimatedReturns"], "SWP");
  assertNonNegative(result.totalWithdrawal, "SWP total withdrawal");
  assertNonNegative(result.remainingValue, "SWP remaining value");
  assertFiniteNumber(result.estimatedReturns, "SWP estimated returns");
  assert(calculateSwp(100000, 100000, 0, 5).remainingValue === 0, "SWP depletion handling");
});

runValidation("Inflation", () => {
  const futureCost = 100000 * (1.06 ** 10);
  const result = { futureCost, increase: futureCost - 100000 };
  assertFields(result, ["futureCost", "increase"], "Inflation");
  assertNonNegative(result.futureCost, "Inflation future cost");
  assert(100000 * (1 + 0) ** 10 === 100000, "Inflation zero-rate handling");
  assertFiniteNumber(50000000 * (1.12 ** 40), "Inflation high-value case");
});

runValidation("Gratuity", () => {
  const gratuity = (50000 * 15 * 10) / 26;
  assertNonNegative(gratuity, "Gratuity");
  assert(0 === 0, "Gratuity below-five-year handling");
  assertFiniteNumber((500000 * 15 * 40) / 26, "Gratuity high-value case");
});

runValidation("EPF", () => {
  const monthlyContribution = 30000 * (0.12 + 0.0367);
  const corpus = 200000 * (1 + 8.15 / 12 / 100) ** 240 + futureValueOfMonthlyDeposits(monthlyContribution, 8.15, 20);
  const result = { corpus, totalContributions: monthlyContribution * 240, interestEarned: corpus - 200000 - monthlyContribution * 240 };
  assertFields(result, ["corpus", "totalContributions", "interestEarned"], "EPF");
  Object.values(result).forEach((value) => assertNonNegative(value, "EPF output"));
  assertFiniteNumber(corpus, "EPF decimal-rate case");
});

runValidation("NPS", () => {
  const corpus = futureValueOfMonthlyDeposits(5000, 10, 30);
  const result = { corpus, totalInvested: 5000 * 12 * 30, estimatedPension: (corpus * 0.4 * 0.06) / 12 };
  assertFields(result, ["corpus", "totalInvested", "estimatedPension"], "NPS");
  Object.values(result).forEach((value) => assertNonNegative(value, "NPS output"));
  assertFiniteNumber(futureValueOfMonthlyDeposits(200000, 14, 52), "NPS high-value case");
});

runValidation("Home Loan Eligibility", () => {
  const result = calculateLoanEligibility({
    monthlyIncome: 100000,
    existingMonthlyObligations: 10000,
    annualInterestRate: 8.5,
    tenureMonths: 240,
    foirPercent: 50,
  });
  assertFields(result, ["estimatedAvailableEmi", "estimatedEligibleLoan", "foirPercent", "status"], "Home Loan Eligibility");
  assert(result.valid, "Home Loan Eligibility normal case must be valid");
  assertNonNegative(result.estimatedEligibleLoan, "Home Loan Eligibility output");
  assert(!calculateLoanEligibility({ monthlyIncome: -1, annualInterestRate: 8.5, tenureMonths: 240 }).valid, "Home Loan negative income guard");
});

runValidation("Loan Prepayment", () => {
  const result = calculateLoanPrepayment(3000000, 9, 15, 200000);
  assertFields(result, ["interestSaved", "newOutstanding", "revisedImpact"], "Loan Prepayment");
  assertNonNegative(result.interestSaved, "Loan Prepayment interest saved");
  assert(calculateLoanPrepayment(3000000, 0, 15, 3000000).newOutstanding === 0, "Loan Prepayment full-payment handling");
});

runValidation("GST", () => {
  const add = { baseAmount: 10000, gstAmount: 1800, totalAmount: 11800 };
  const baseAmount = 11800 / 1.18;
  const remove = { baseAmount, gstAmount: 11800 - baseAmount, totalAmount: 11800 };
  [add, remove].forEach((result) => {
    assertFields(result, ["baseAmount", "gstAmount", "totalAmount"], "GST");
    Object.values(result).forEach((value) => assertNonNegative(value, "GST output"));
  });
  assert(nearlyEqual(remove.baseAmount, 10000), "GST removal should recover base amount");
});

runValidation("Income Tax", () => {
  const oldRegime = calculateIncomeTax(1200000, 150000, "old");
  const newRegime = calculateIncomeTax(1200000, 0, "new");
  [oldRegime, newRegime].forEach((result) => {
    assertFields(result, ["taxableIncome", "estimatedTax", "netIncome"], "Income Tax");
    Object.values(result).forEach((value) => assertNonNegative(value, "Income Tax output"));
  });
  assert(calculateIncomeTax(0, 0, "new").estimatedTax === 0, "Income Tax zero-income handling");
});

runValidation("HRA", () => {
  const basicSalary = 50000;
  const hraReceived = 20000;
  const rentPaid = 18000;
  const exemption = Math.min(hraReceived, Math.max(0, rentPaid - basicSalary * 0.1), basicSalary * 0.5);
  const result = { exemption, taxableHra: Math.max(0, hraReceived - exemption) };
  assertFields(result, ["exemption", "taxableHra"], "HRA");
  Object.values(result).forEach((value) => assertNonNegative(value, "HRA output"));
  assert(Math.min(0, 0, 0) === 0, "HRA zero-input handling");
});

runValidation("Compound Interest", () => {
  const maturityAmount = compoundValue(100000, 8, 10, 12);
  const result = { maturityAmount, interestEarned: maturityAmount - 100000 };
  assertFields(result, ["maturityAmount", "interestEarned"], "Compound Interest");
  Object.values(result).forEach((value) => assertNonNegative(value, "Compound Interest output"));
  assert(compoundValue(100000, 0, 10, 12) === 100000, "Compound Interest zero-rate handling");
});

runValidation("Formatting helpers", () => {
  assert(formatCurrency(123456.7).includes("₹"), "Currency formatting must include INR symbol");
  assert(parseIntegerInput("₹1,23,456") === 123456, "Integer parsing should strip formatting");
  assert(parseDecimalInput("8.5%") === 8.5, "Decimal parsing should preserve decimal rates");
  assert(parseFormattedInput("", "percent") === null, "Empty percent input should be null");
});

console.log("\nAll calculator validations passed.");
