import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorFormula from "./ui/CalculatorFormula";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import ResultCard from "./ui/ResultCard";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  goal: { min: 100000, max: 100000000, step: 50000 },
  savings: { min: 0, max: 50000000, step: 10000 },
  monthly: { min: 500, max: 500000, step: 500 },
  rate: { min: 1, max: 30, step: 0.5 },
  years: { min: 1, max: 40, step: 1 },
};

function calculateSipFv(monthly, annualRate, years) {
  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return monthly * months;
  return (
    monthly *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate))
  );
}

function calculateGoalProjection(goal, savings, monthly, rate, years) {
  const savingsFv = savings * Math.pow(1 + rate / 100, years);
  const sipFv = calculateSipFv(monthly, rate, years);
  const projected = savingsFv + sipFv;
  const gap = goal - projected;
  return { projected, gap, savingsFv, sipFv };
}

function GoalPlannerCalculator({
  defaultGoal = 5000000,
  defaultSavings = 200000,
  defaultMonthly = 15000,
  defaultRate = 12,
  defaultYears = 10,
  className = "",
  showHeader = true,
}) {
  const [goal, setGoal] = useState(defaultGoal);
  const [savings, setSavings] = useState(defaultSavings);
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const { projected, gap } = calculateGoalProjection(goal, savings, monthly, rate, years);
  const gapLabel = gap > 0 ? "Goal Gap" : "Goal Surplus";
  const gapValue = formatCurrency(Math.abs(gap));

  return (
    <CalculatorLayout
      label="Goal Planner"
      title="Plan your financial goals with clarity"
      description="Project whether your current savings and monthly investments are on track to reach your target amount."
      showHeader={showHeader}
      variant="default"
      className={className}
      form={
        <>
          <CurrencyInput
            id="goal-target"
            label="Goal Amount"
            value={goal}
            onChange={setGoal}
            limits={LIMITS.goal}
          />
          <CurrencyInput
            id="goal-savings"
            label="Current Savings"
            value={savings}
            onChange={setSavings}
            limits={LIMITS.savings}
          />
          <CurrencyInput
            id="goal-monthly"
            label="Monthly Investment"
            value={monthly}
            onChange={setMonthly}
            limits={LIMITS.monthly}
          />
          <InputField
            id="goal-rate"
            label="Expected Return (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <InputField
            id="goal-years"
            label="Time Period (Years)"
            value={years}
            onChange={setYears}
            format="years"
            limits={LIMITS.years}
          />
        </>
      }
      results={
        <>
          <ResultCard
            key={formatCurrency(projected)}
            label="Projected Value"
            value={formatCurrency(projected)}
            highlight
          />
          <ResultCard key={gapValue} label={gapLabel} value={gapValue} />
          <ResultCard
            key={formatCurrency(goal)}
            label="Target Goal"
            value={formatCurrency(goal)}
          />
        </>
      }
      formula={
        <CalculatorFormula
          formula="Projected = FV(Current Savings) + FV(Monthly SIP). Gap = Goal − Projected."
          explanation="Compares your projected corpus against the target to show whether you are on track."
        />
      }
    />
  );
}

export default GoalPlannerCalculator;
