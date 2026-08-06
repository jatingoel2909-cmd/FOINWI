import { useMemo, useState } from "react";
import CurrencyInput from "../ui/CurrencyInput";
import InputField from "../ui/InputField";
import EmiLoanTypeSelector from "./EmiLoanTypeSelector";
import LoanEligibilitySummary from "./LoanEligibilitySummary";
import LoanEligibilityComparison from "./LoanEligibilityComparison";
import LoanEligibilityInsights from "./LoanEligibilityInsights";
import {
  DEFAULT_LOAN_TYPE_ID,
  getLoanTypeById,
} from "../../data/loanTypes";
import {
  DEFAULT_FOIR_PERCENT,
  ELIGIBILITY_ASSUMPTIONS,
  FOIR_HELPER_TEXT,
  FOIR_MAX,
  FOIR_MIN,
  buildEligibilityInsights,
  buildEligibilityTenureComparison,
  calculateLoanEligibility,
} from "../../utils/loanEligibilityEngine";
import "./loan-eligibility.css";

const INCOME_LIMITS = { min: 10000, max: 10000000, step: 1000 };
const OBLIGATION_LIMITS = { min: 0, max: 5000000, step: 500 };
const CO_INCOME_LIMITS = { min: 0, max: 10000000, step: 1000 };
const RATE_LIMITS = { min: 0, max: 20, step: 0.1 };
const FOIR_LIMITS = { min: FOIR_MIN, max: FOIR_MAX, step: 1 };
const DOWN_LIMITS = { min: 0, max: 50000000, step: 10000 };
const YEARS_LIMITS = { min: 1, max: 30, step: 1 };
const MONTHS_LIMITS = { min: 6, max: 36, step: 1 };

function LoanEligibilityCalculator({
  defaultLoanTypeId = DEFAULT_LOAN_TYPE_ID,
  defaultRate,
  defaultTenureYears = 20,
}) {
  const initialType = getLoanTypeById(defaultLoanTypeId) ?? getLoanTypeById(DEFAULT_LOAN_TYPE_ID);
  const initialRate = initialType?.defaultRate ?? defaultRate ?? 8.5;

  const [loanTypeId, setLoanTypeId] = useState(initialType?.id ?? DEFAULT_LOAN_TYPE_ID);
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingObligations, setExistingObligations] = useState(20000);
  const [coApplicantIncome, setCoApplicantIncome] = useState(0);
  const [annualRate, setAnnualRate] = useState(initialRate);
  const [tenureYears, setTenureYears] = useState(defaultTenureYears);
  const [tenureMonthsGold, setTenureMonthsGold] = useState(24);
  const [foirPercent, setFoirPercent] = useState(DEFAULT_FOIR_PERCENT);
  const [downPayment, setDownPayment] = useState(0);

  const loanType = getLoanTypeById(loanTypeId);
  const isGold = loanType?.tenureUnit === "months";

  const handleLoanTypeChange = (nextId) => {
    setLoanTypeId(nextId);
    const nextType = getLoanTypeById(nextId);
    if (nextType?.defaultRate != null) {
      setAnnualRate(nextType.defaultRate);
    }
  };

  const tenureMonths = isGold
    ? Math.round(tenureMonthsGold)
    : Math.round(Number(tenureYears) * 12);

  const result = useMemo(
    () =>
      calculateLoanEligibility({
        monthlyIncome,
        existingMonthlyObligations: existingObligations,
        annualInterestRate: annualRate,
        tenureMonths,
        foirPercent,
        downPayment,
        coApplicantMonthlyIncome: coApplicantIncome,
      }),
    [
      monthlyIncome,
      existingObligations,
      annualRate,
      tenureMonths,
      foirPercent,
      downPayment,
      coApplicantIncome,
    ],
  );

  const comparison = useMemo(
    () =>
      buildEligibilityTenureComparison({
        monthlyIncome,
        existingMonthlyObligations: existingObligations,
        annualInterestRate: annualRate,
        foirPercent,
        downPayment,
        coApplicantMonthlyIncome: coApplicantIncome,
        loanTypeId,
      }),
    [
      monthlyIncome,
      existingObligations,
      annualRate,
      foirPercent,
      downPayment,
      coApplicantIncome,
      loanTypeId,
    ],
  );

  const insights = useMemo(
    () =>
      buildEligibilityInsights(result, {
        hasCoApplicant: coApplicantIncome > 0,
        hasDownPayment: downPayment > 0,
      }),
    [result, coApplicantIncome, downPayment],
  );

  return (
    <section className="emi-elig" aria-labelledby="emi-elig-title">
      <header className="emi-elig__header">
        <div className="emi-elig__header-text">
          <h3 id="emi-elig-title">Estimate Loan Eligibility</h3>
          <p>
            Explore an illustrative borrowing-capacity estimate from income, obligations and an
            editable FOIR assumption. Educational only — not a lender assessment or credit decision.
          </p>
        </div>
      </header>

      <div className="emi-elig__panel is-expanded">
        <div className="emi-elig__form">
          <EmiLoanTypeSelector value={loanTypeId} onChange={handleLoanTypeChange} />
          <CurrencyInput
            id="emi-elig-income"
            label="Monthly net income"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            limits={INCOME_LIMITS}
          />
          <CurrencyInput
            id="emi-elig-obligations"
            label="Existing monthly EMIs / obligations"
            value={existingObligations}
            onChange={setExistingObligations}
            limits={OBLIGATION_LIMITS}
          />
          <CurrencyInput
            id="emi-elig-co-income"
            label="Co-applicant monthly income (optional)"
            value={coApplicantIncome}
            onChange={setCoApplicantIncome}
            limits={CO_INCOME_LIMITS}
          />
          <InputField
            id="emi-elig-rate"
            label="Illustrative annual interest rate"
            value={annualRate}
            onChange={setAnnualRate}
            format="percent"
            limits={RATE_LIMITS}
          />
          {isGold ? (
            <InputField
              id="emi-elig-tenure-months"
              label="Preferred tenure (months)"
              value={tenureMonthsGold}
              onChange={setTenureMonthsGold}
              format="number"
              limits={MONTHS_LIMITS}
            />
          ) : (
            <InputField
              id="emi-elig-tenure-years"
              label="Preferred tenure (years)"
              value={tenureYears}
              onChange={setTenureYears}
              format="years"
              limits={YEARS_LIMITS}
            />
          )}
          <InputField
            id="emi-elig-foir"
            label="FOIR assumption"
            value={foirPercent}
            onChange={setFoirPercent}
            format="percent"
            limits={FOIR_LIMITS}
          />
          <p className="emi-elig__foir-help" id="emi-elig-foir-help">
            {FOIR_HELPER_TEXT}
          </p>
          <CurrencyInput
            id="emi-elig-down"
            label="Down payment (optional)"
            value={downPayment}
            onChange={setDownPayment}
            limits={DOWN_LIMITS}
          />
        </div>

        <LoanEligibilitySummary result={result} />
        <LoanEligibilityComparison comparison={comparison} />
        <LoanEligibilityInsights statements={insights} />

        <aside
          className="emi-elig__assumptions"
          aria-labelledby="emi-elig-assumptions-title"
        >
          <h4 id="emi-elig-assumptions-title">Calculation assumptions</h4>
          <ul>
            {ELIGIBILITY_ASSUMPTIONS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}

export default LoanEligibilityCalculator;
