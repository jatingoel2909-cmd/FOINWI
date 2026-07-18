import { useState } from "react";
import CalculatorLayout from "./ui/CalculatorLayout";
import CalculatorResults from "./ui/CalculatorResults";
import CurrencyInput from "./ui/CurrencyInput";
import InputField from "./ui/InputField";
import { formatCurrency } from "../utils/calculatorFormat";

const LIMITS = {
  salary: { min: 5000, max: 150000, step: 1000 },
  balance: { min: 0, max: 50000000, step: 10000 },
  rate: { min: 5, max: 12, step: 0.1 },
  years: { min: 1, max: 40, step: 1 },
};

const EPF_EMPLOYEE_RATE = 0.12;
const EPF_EMPLOYER_RATE = 0.0367;

function calculateEpfCorpus(basicSalary, currentBalance, rate, years) {
  const months = years * 12;
  const monthlyRate = rate / 12 / 100;
  const monthlyContribution = basicSalary * (EPF_EMPLOYEE_RATE + EPF_EMPLOYER_RATE);

  if (monthlyRate === 0) {
    return currentBalance + monthlyContribution * months;
  }

  const balanceGrowth = currentBalance * Math.pow(1 + monthlyRate, months);
  const contributionGrowth =
    monthlyContribution *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

  return balanceGrowth + contributionGrowth;
}

function EpfCalculator({
  defaultSalary = 30000,
  defaultBalance = 200000,
  defaultRate = 8.15,
  defaultYears = 20,
  className = "",
  showHeader = true,
}) {
  const [salary, setSalary] = useState(defaultSalary);
  const [balance, setBalance] = useState(defaultBalance);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);

  const monthlyContribution = salary * (EPF_EMPLOYEE_RATE + EPF_EMPLOYER_RATE);
  const totalContributions = monthlyContribution * years * 12;
  const corpus = calculateEpfCorpus(salary, balance, rate, years);
  const interestEarned = corpus - balance - totalContributions;

  return (
    <CalculatorLayout
      label="EPF Calculator"
      title="Project your EPF retirement corpus"
      description="Estimate EPF balance growth based on monthly basic salary, current balance, interest rate, and remaining service years."
      showHeader={showHeader}
      variant="default"
      className={className}
      calculatorId="/epf-calculator"
      form={
        <>
          <CurrencyInput
            id="epf-salary"
            label="Monthly Basic Salary"
            value={salary}
            onChange={setSalary}
            limits={LIMITS.salary}
          />
          <CurrencyInput
            id="epf-balance"
            label="Current EPF Balance"
            value={balance}
            onChange={setBalance}
            limits={LIMITS.balance}
          />
          <InputField
            id="epf-rate"
            label="Interest Rate (%)"
            value={rate}
            onChange={setRate}
            format="percent"
            limits={LIMITS.rate}
          />
          <InputField
            id="epf-years"
            label="Years Until Retirement"
            value={years}
            onChange={setYears}
            format="years"
            limits={LIMITS.years}
          />
        </>
      }
      results={
        <CalculatorResults
          primary={{ label: "Estimated EPF Corpus", value: formatCurrency(corpus) }}
          metrics={[
            { label: "Current Balance", value: formatCurrency(balance) },
            { label: "Total Contributions", value: formatCurrency(totalContributions) },
            { label: "Interest Earned", value: formatCurrency(interestEarned) },
            { label: "Years Until Retirement", value: `${years} years` },
          ]}
          story="EPF corpus grows from existing balance plus ongoing contributions. Interest rate assumptions can change over long service periods."
        />
      }
    />
  );
}

export default EpfCalculator;
