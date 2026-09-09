export const CALCULATOR_DISCLAIMER =
  "FOINWI provides educational financial tools only. Results are estimates based on user inputs and assumptions. This is not financial, investment, tax, loan, or legal advice. Please consult qualified professionals before making financial decisions.";

export const CALCULATOR_INSIGHTS = {
  "/sip-calculator": {
    howCalculated: {
      formula: "Future Value = Monthly SIP × [((1 + r)^n − 1) / r] × (1 + r)",
      variables: [
        { symbol: "Monthly SIP", meaning: "Fixed amount invested each month" },
        {
          symbol: "r",
          meaning: "Monthly expected return rate (Annual Return ÷ 12 ÷ 100)",
        },
        { symbol: "n", meaning: "Total number of monthly instalments (Years × 12)" },
        { symbol: "Future Value", meaning: "Estimated maturity value of the SIP" },
      ],
      estimateNote:
        "This formula estimates how a regular monthly investment may grow when contributions are made at the beginning of each month and returns compound monthly under a constant rate assumption.",
      summary:
        "This calculator projects SIP maturity value using your monthly contribution, expected annual return, and investment period. Contributions are assumed at the beginning of each month and returns compound monthly.",
      inputs: [
        "Monthly investment amount",
        "Expected annual return (assumed constant)",
        "Investment period in years",
      ],
    },
    meaning:
      "This can help you understand how regular monthly investing may grow over time and how much of the final value comes from contributions versus estimated returns.",
    relatedTools: [
      { title: "Lumpsum Calculator", path: "/lumpsum-calculator" },
      { title: "CAGR Calculator", path: "/cagr-calculator" },
      { title: "Goal Planner", path: "/goal-planner" },
      { title: "SWP Calculator", path: "/swp-calculator" },
    ],
  },
  "/emi-calculator": {
    howCalculated: {
      formula: "EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]",
      variables: [
        { symbol: "P", meaning: "Principal (Loan Amount)" },
        {
          symbol: "r",
          meaning: "Monthly Interest Rate (Annual Interest Rate ÷ 12 ÷ 100)",
        },
        {
          symbol: "n",
          meaning: "Total Number of Monthly Instalments (Loan Tenure in Months)",
        },
        { symbol: "EMI", meaning: "Equated Monthly Instalment" },
      ],
      estimateNote:
        "This formula estimates the fixed monthly payment needed to repay a reducing-balance loan over the selected tenure.",
      summary:
        "This calculator estimates equated monthly instalment (EMI) from loan amount, annual interest rate, and tenure. It assumes a standard reducing-balance loan structure.",
      inputs: ["Loan amount", "Annual interest rate", "Loan tenure in years"],
    },
    meaning:
      "This can help you understand monthly repayment size and how interest rate or tenure changes may affect total loan cost.",
    relatedTools: [
      { title: "Home Loan Eligibility", path: "/home-loan-eligibility-calculator" },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator" },
      { title: "Compound Interest", path: "/compound-interest-calculator" },
      { title: "Goal Planner", path: "/goal-planner" },
    ],
  },
  "/fd-calculator": {
    howCalculated: {
      formula: "Maturity = Principal × (1 + r/n)^(n × t)",
      variables: [
        { symbol: "Principal", meaning: "Deposit amount invested in the FD" },
        { symbol: "r", meaning: "Annual interest rate in decimal form" },
        { symbol: "n", meaning: "Number of compounding periods in a year" },
        { symbol: "t", meaning: "Tenure in years" },
        { symbol: "Maturity", meaning: "Estimated value at the end of the FD tenure" },
      ],
      estimateNote:
        "This formula estimates cumulative FD maturity value when interest is reinvested at a chosen frequency over the selected tenure.",
      summary:
        "This calculator provides an illustrative cumulative FD estimate using deposit amount, selected annual rate, tenure, and compounding frequency.",
      inputs: [
        "Deposit amount",
        "Annual interest rate",
        "Tenure in years",
        "Compounding frequency",
      ],
    },
    meaning:
      "This can help you understand estimated FD maturity value and how much interest may be earned over the selected period.",
    relatedTools: [
      { title: "RD Calculator", path: "/rd-calculator" },
      { title: "PPF Calculator", path: "/ppf-calculator" },
      { title: "Compound Interest", path: "/compound-interest-calculator" },
    ],
  },
  "/ppf-calculator": {
    howCalculated: {
      formulaLabel: "Simplified calculation expression",
      formula: "Maturity = Yearly Contribution × [((1 + r)^n − 1) / r] × (1 + r)",
      variables: [
        { symbol: "Maturity", meaning: "Estimated PPF balance at the end of the period" },
        {
          symbol: "Yearly Contribution",
          meaning: "Amount deposited into PPF each year",
        },
        {
          symbol: "r",
          meaning: "Illustrative annual interest rate in decimal form",
        },
        {
          symbol: "n",
          meaning: "Investment period in years",
        },
      ],
      estimateNote:
        "This estimate projects PPF growth from steady yearly contributions and an assumed interest rate over the selected duration.",
      summary:
        "This calculator projects PPF balance growth from annual contributions, expected interest rate, and investment duration.",
      inputs: [
        "Yearly contribution",
        "Expected annual interest rate",
        "Investment period in years",
      ],
    },
    meaning:
      "This can help you understand long-term PPF corpus growth under steady contribution and rate assumptions.",
    relatedTools: [
      { title: "FD Calculator", path: "/fd-calculator" },
      { title: "RD Calculator", path: "/rd-calculator" },
      { title: "Retirement Calculator", path: "/retirement-calculator" },
    ],
  },
  "/retirement-calculator": {
    howCalculated: {
      formula: "Corpus Needed = Inflated Monthly Expense × 12 × 25",
      variables: [
        {
          symbol: "Corpus Needed",
          meaning: "Estimated retirement savings target",
        },
        {
          symbol: "Inflated Monthly Expense",
          meaning: "Today’s monthly expense grown for inflation until retirement",
        },
        { symbol: "12", meaning: "Converts monthly expense into an annual amount" },
        {
          symbol: "25",
          meaning: "Common rule-of-thumb multiplier for annual retirement expense",
        },
      ],
      estimateNote:
        "This formula estimates a simplified retirement corpus target using inflated expenses and the 25× annual-expense rule of thumb.",
      summary:
        "This calculator estimates retirement corpus using the 25× annual expense rule of thumb, inflation until retirement, current savings, and monthly SIP.",
      inputs: [
        "Current age and retirement age",
        "Current monthly expenses",
        "Expected inflation and return rates",
        "Current savings and monthly SIP",
      ],
    },
    meaning:
      "This can help you understand a simplified retirement target, projected savings, and the estimated gap that may remain.",
    relatedTools: [
      { title: "NPS Calculator", path: "/nps-calculator" },
      { title: "EPF Calculator", path: "/epf-calculator" },
      { title: "Inflation Calculator", path: "/inflation-calculator" },
      { title: "SWP Calculator", path: "/swp-calculator" },
    ],
  },
  "/goal-planner": {
    howCalculated: {
      formula: "Projected = [Current Savings × (1 + r)^n] + [Monthly SIP × ((1 + r)^n − 1) / r × (1 + r)]",
      variables: [
        {
          symbol: "FV(Current Savings)",
          meaning: "Estimated future value of money already saved, compounded monthly",
        },
        {
          symbol: "FV(Monthly SIP)",
          meaning: "Estimated future value of ongoing monthly contributions",
        },
        {
          symbol: "r",
          meaning: "Monthly expected return rate (Annual Return ÷ 12 ÷ 100)",
        },
        { symbol: "n", meaning: "Total number of months (Years × 12)" },
        {
          symbol: "Projected",
          meaning: "Combined estimated amount available at the goal date",
        },
        { symbol: "Goal", meaning: "Target amount you want to reach" },
        {
          symbol: "Gap",
          meaning: "Shortfall or surplus between the goal and the projected amount",
        },
      ],
      estimateNote:
        "This estimate compares your goal amount with current savings compounded monthly and monthly contributions assumed at the beginning of each month.",
      summary:
        "This calculator compounds current savings and monthly contributions using the same monthly rate before comparing the projection against your target goal amount and timeline.",
      inputs: [
        "Goal amount and target years",
        "Current savings",
        "Monthly SIP contribution",
        "Expected annual return",
      ],
    },
    meaning:
      "This can help you understand whether your current plan may reach a goal and how much shortfall or surplus the estimate shows.",
    relatedTools: [
      { title: "SIP Calculator", path: "/sip-calculator" },
      { title: "Lumpsum Calculator", path: "/lumpsum-calculator" },
      { title: "Inflation Calculator", path: "/inflation-calculator" },
    ],
  },
  "/cagr-calculator": {
    howCalculated: {
      formula: "CAGR = (Ending Value / Beginning Value)^(1 / Years) − 1",
      variables: [
        { symbol: "CAGR", meaning: "Compound Annual Growth Rate" },
        { symbol: "Ending Value", meaning: "Value at the end of the period" },
        { symbol: "Beginning Value", meaning: "Value at the start of the period" },
        { symbol: "Years", meaning: "Number of years between the two values" },
      ],
      estimateNote:
        "This formula estimates the constant annual growth rate that would take the beginning value to the ending value over the selected years.",
      summary:
        "This calculator measures compound annual growth rate between a starting value, ending value, and number of years.",
      inputs: ["Beginning value", "Ending value", "Number of years"],
    },
    meaning:
      "This can help you understand average annualised growth between two values without assuming every year grew evenly.",
    relatedTools: [
      { title: "SIP Calculator", path: "/sip-calculator" },
      { title: "Lumpsum Calculator", path: "/lumpsum-calculator" },
      { title: "Compound Interest", path: "/compound-interest-calculator" },
    ],
  },
  "/lumpsum-calculator": {
    howCalculated: {
      formula: "Future Value = Principal × (1 + r)^t",
      variables: [
        { symbol: "Principal", meaning: "One-time investment amount" },
        { symbol: "r", meaning: "Expected annual return rate in decimal form" },
        { symbol: "t", meaning: "Investment period in years" },
        { symbol: "Future Value", meaning: "Estimated value at the end of the period" },
      ],
      estimateNote:
        "This formula estimates how a one-time investment may grow when returns compound annually at a constant rate.",
      summary:
        "This calculator projects one-time investment growth using principal, expected annual return, and investment period.",
      inputs: ["Investment amount", "Expected annual return", "Time period in years"],
    },
    meaning:
      "This can help you understand how a single investment may compound over time under constant return assumptions.",
    relatedTools: [
      { title: "SIP Calculator", path: "/sip-calculator" },
      { title: "CAGR Calculator", path: "/cagr-calculator" },
      { title: "Goal Planner", path: "/goal-planner" },
    ],
  },
  "/rd-calculator": {
    howCalculated: {
      formulaLabel: "Simplified calculation expression",
      formula: "Maturity = Monthly Deposit × [((1 + r)^n − 1) / r] × (1 + r)",
      variables: [
        { symbol: "Maturity", meaning: "Estimated RD value at the end of the tenure" },
        {
          symbol: "Monthly Deposit",
          meaning: "Fixed amount assumed to be deposited at the beginning of every month",
        },
        {
          symbol: "r",
          meaning: "Monthly interest rate (Annual Interest Rate ÷ 12 ÷ 100)",
        },
        {
          symbol: "n",
          meaning: "Total number of monthly deposits (Years × 12)",
        },
      ],
      estimateNote:
        "This simplified expression uses fixed monthly deposits made at the beginning of each month and monthly compounding for educational planning.",
      summary:
        "FOINWI uses a simplified monthly-compounding model for learning and planning. Actual bank RD maturity may differ.",
      inputs: ["Monthly deposit", "Annual interest rate", "Tenure in years"],
    },
    meaning:
      "This can help you understand how regular monthly deposits may accumulate into a maturity value over time.",
    relatedTools: [
      { title: "FD Calculator", path: "/fd-calculator" },
      { title: "PPF Calculator", path: "/ppf-calculator" },
      { title: "Compound Interest", path: "/compound-interest-calculator" },
    ],
  },
  "/swp-calculator": {
    howCalculated: {
      formulaLabel: "Calculation approach",
      formula: "Next Balance = Available Balance − Actual Withdrawal | Actual Withdrawal = lesser of requested withdrawal and available balance",
      variables: [
        { symbol: "Available Balance", meaning: "Corpus remaining after monthly growth and before that month’s withdrawal" },
        {
          symbol: "r",
          meaning: "Monthly expected return rate (Annual Return ÷ 12 ÷ 100)",
        },
        {
          symbol: "Actual Withdrawal",
          meaning: "Requested monthly withdrawal, limited to the balance available after monthly growth",
        },
        {
          symbol: "Next Balance",
          meaning: "Corpus left after each withdrawal",
        },
      ],
      estimateNote:
        "This constant-return educational estimate applies monthly growth before each withdrawal and stops when the corpus reaches zero.",
      summary:
        "This calculator projects what may remain after periodic withdrawals and shows whether the corpus lasts through the selected tenure.",
      inputs: [
        "Starting corpus",
        "Monthly withdrawal amount",
        "Expected annual return",
        "Withdrawal period",
      ],
    },
    meaning:
      "This can help you understand how systematic withdrawals may affect corpus longevity in a simplified scenario.",
    relatedTools: [
      { title: "Retirement Calculator", path: "/retirement-calculator" },
      { title: "SIP Calculator", path: "/sip-calculator" },
      { title: "Inflation Calculator", path: "/inflation-calculator" },
    ],
  },
  "/inflation-calculator": {
    howCalculated: {
      formula: "Future Cost = Current Amount × (1 + Inflation Rate)^Years",
      variables: [
        { symbol: "Future Cost", meaning: "Estimated cost after inflation" },
        { symbol: "Current Amount", meaning: "Today’s price or expense amount" },
        {
          symbol: "Inflation Rate",
          meaning: "Assumed annual rise in prices (in decimal form)",
        },
        { symbol: "Years", meaning: "Number of years into the future" },
      ],
      estimateNote:
        "This formula estimates how today’s amount may translate into a higher future cost under a constant inflation assumption.",
      summary:
        "This calculator estimates how today's amount may translate into a higher future cost at a given illustrative inflation rate.",
      inputs: ["Current amount", "Expected inflation rate", "Number of years"],
    },
    meaning:
      "This can help you understand why future expenses may be higher than today's prices even without changing lifestyle.",
    relatedTools: [
      { title: "Retirement Calculator", path: "/retirement-calculator" },
      { title: "Goal Planner", path: "/goal-planner" },
      { title: "SIP Calculator", path: "/sip-calculator" },
    ],
  },
  "/gratuity-calculator": {
    howCalculated: {
      formulaLabel: "Calculation approach",
      formula:
        "Qualifying years = completed years + (additional months > 6 ? 1 : 0) | Uncapped gratuity = (Last drawn statutory wages × 15 × qualifying years) / 26 | Estimated gratuity = min(uncapped gratuity, ceiling used in this estimate)",
      variables: [
        {
          symbol: "Last drawn statutory wages",
          meaning: "Monthly wage amount entered for this simplified labour-code estimate; this may differ from Basic + DA where statutory allowance-add-back rules apply",
        },
        {
          symbol: "Completed years",
          meaning: "Whole completed years of service used in this estimate",
        },
        {
          symbol: "Additional months",
          meaning: "0 to 11 extra months; more than 6 months adds one qualifying year, and exactly 6 months does not",
        },
        {
          symbol: "Qualifying years",
          meaning: "Completed years plus at most one extra year under the >6-month rule",
        },
        {
          symbol: "15 / 26",
          meaning: "Monthly-rated employee days factor used in this simplified statutory estimate",
        },
        {
          symbol: "Ceiling used in this estimate",
          meaning: "₹20,00,000. This simplified estimate currently uses ₹20 lakh as the gratuity ceiling. The amount is time-sensitive and should be rechecked if Government notifications change.",
        },
      ],
      estimateNote:
        "This is a simplified statutory estimate under the Code on Social Security, 2020, modelled as effective from 21 November 2025, for a monthly-rated employee in an ordinary retirement, resignation, or superannuation scenario. The Code on Social Security, 2020 provides that gratuity is subject to an amount notified by the Central Government. This calculator currently models ₹20 lakh, consistent with the earlier notified ceiling and current Ministry guidance. Under the general rule, five years of continuous service is required. The five-year condition does not apply in certain cases such as death or disablement. Fixed-term employment can have different gratuity eligibility rules and is not modelled by this calculator. Better gratuity terms may apply under an award, agreement or employment contract. Estimated gratuity may differ based on employment terms and eligibility facts.",
      summary:
        "This calculator estimates gratuity for a monthly-rated employee using last drawn statutory wages, the 15/26 formula, the >6-month qualifying-year rule, and the ₹20 lakh ceiling used in this estimate.",
      inputs: [
        "Last drawn statutory wages",
        "Completed years of service",
        "Additional months of service",
      ],
    },
    meaning:
      "This can help you understand an estimated gratuity figure under a simplified Code on Social Security, 2020 model. It is not a payout confirmation.",
    relatedTools: [
      { title: "EPF Calculator", path: "/epf-calculator" },
      { title: "Retirement Calculator", path: "/retirement-calculator" },
      { title: "NPS Calculator", path: "/nps-calculator" },
    ],
  },
  "/epf-calculator": {
    howCalculated: {
      formulaLabel: "Simplified calculation expression",
      formula:
        "contributionWage = min(Monthly PF wages, ₹15,000). employeeEPF and employerTotal = rounded contributionWage × 12%. employerEPS = rounded contributionWage × 8.33%. employerEPF = employerTotal − employerEPS. Projected balance uses a monthly running-balance approximation on employeeEPF + employerEPF only.",
      variables: [
        {
          symbol: "Monthly PF wages",
          meaning: "Visitor-entered wage amount applicable for provident-fund contribution purposes. This may differ from Basic salary alone.",
        },
        {
          symbol: "contributionWage",
          meaning: "Lower of Monthly PF wages and the ₹15,000 statutory wage ceiling used in this estimate (S.O. 2702(E), 29 May 2026)",
        },
        {
          symbol: "12%",
          meaning: "General employee and employer contribution rates used in this estimate, consistent with current EPFO operational treatment",
        },
        {
          symbol: "8.33%",
          meaning: "Employer share diverted to EPS and excluded from the projected EPF balance",
        },
        {
          symbol: "employerEPF",
          meaning: "Residual employer amount entering the projected EPF corpus after EPS diversion",
        },
        {
          symbol: "Projected balance",
          meaning: "Illustrative EPF accumulation from the current balance plus employee EPF and residual employer EPF",
        },
      ],
      estimateNote:
        "Educational EPF accumulation estimate for a standard already-enrolled EPF/EPS member under the Code on Social Security, 2020. The Employees' Provident Fund Scheme, 2026 has been issued under the current framework. This simplified calculator uses the standard contribution assumptions described here and does not model every membership or payroll case. 8.25% is the last Government-approved/notified rate verified for FY 2024-25 and is used only as an illustrative interest assumption. Specified 10% establishments, higher-wage contribution, voluntary provident-fund top-ups, and a new joiner above ₹15,000 who is not an EPS member are outside this default estimate.",
      summary:
        "This calculator uses a simplified projection using a monthly running-balance approximation and a constant illustrative annual interest assumption. EPS is not added to the projected EPF corpus.",
      inputs: [
        "Monthly PF wages",
        "Current EPF balance",
        "Years remaining",
        "Illustrative EPF interest assumption",
      ],
    },
    meaning:
      "This can help you explore how statutory-ceiling EPF contributions and an illustrative interest assumption may shape an estimated EPF balance over time.",
    relatedTools: [
      { title: "NPS Calculator", path: "/nps-calculator" },
      { title: "Retirement Calculator", path: "/retirement-calculator" },
      { title: "Gratuity Calculator", path: "/gratuity-calculator" },
    ],
  },
  "/nps-calculator": {
    howCalculated: {
      formulaLabel: "Simplified calculation expression",
      formula: "Corpus = Monthly SIP FV. Pension ≈ 40% of corpus × 6% annuity / 12",
      variables: [
        {
          symbol: "Corpus",
          meaning: "Estimated NPS accumulation at retirement from monthly contributions",
        },
        {
          symbol: "Monthly SIP FV",
          meaning: "Future value of regular monthly NPS contributions",
        },
        {
          symbol: "40% of corpus",
          meaning: "Illustrative annuity purchase portion used in the estimate",
        },
        {
          symbol: "6% annuity",
          meaning: "Assumed annual annuity rate used for pension illustration",
        },
        {
          symbol: "Pension",
          meaning: "Estimated monthly pension from the assumed annuity portion",
        },
      ],
      estimateNote:
        "This estimate projects NPS accumulation and a simplified monthly pension using assumed contribution growth and annuity rates.",
      summary:
        "This calculator projects NPS corpus from monthly contributions and estimates annuity pension using simplified assumptions.",
      inputs: [
        "Monthly NPS contribution",
        "Current age and retirement age",
        "Expected annual return",
      ],
    },
    meaning:
      "This can help you understand estimated NPS accumulation and a simplified view of potential annuity income after retirement.",
    relatedTools: [
      { title: "EPF Calculator", path: "/epf-calculator" },
      { title: "Retirement Calculator", path: "/retirement-calculator" },
      { title: "SWP Calculator", path: "/swp-calculator" },
    ],
  },
  "/home-loan-eligibility-calculator": {
    howCalculated: {
      formula: "Eligible EMI = (Income × 50%) − Existing EMI | Loan from EMI, rate, tenure",
      variables: [
        { symbol: "Income", meaning: "Monthly net income used in the estimate" },
        {
          symbol: "50%",
          meaning: "Illustrative fixed-obligation ratio used for available EMI capacity",
        },
        {
          symbol: "Existing EMI",
          meaning: "Current monthly loan obligations already being paid",
        },
        {
          symbol: "Eligible EMI",
          meaning: "Estimated EMI capacity available for a new loan",
        },
        {
          symbol: "Loan",
          meaning: "Estimated principal supportable by the Eligible EMI at the chosen rate and tenure",
        },
      ],
      estimateNote:
        "This estimate converts assumed EMI capacity into an illustrative loan amount using income, existing obligations, rate and tenure.",
      summary:
        "This calculator estimates eligible loan amount using income, existing EMIs, interest rate, and tenure with a common 50% obligation ratio.",
      inputs: [
        "Monthly income",
        "Existing monthly EMIs",
        "Interest rate and loan tenure",
      ],
    },
    meaning:
      "This can help you understand a rough borrowing range before property search. Actual lender eligibility may differ.",
    relatedTools: [
      { title: "EMI Calculator", path: "/emi-calculator" },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator" },
      { title: "Goal Planner", path: "/goal-planner" },
    ],
  },
  "/loan-prepayment-calculator": {
    howCalculated: {
      formula: "Interest Saved = Original Total Interest − New Total Interest",
      variables: [
        {
          symbol: "Original Total Interest",
          meaning: "Estimated interest if the loan continues on the original schedule",
        },
        {
          symbol: "New Total Interest",
          meaning: "Estimated interest after the prepayment scenario",
        },
        {
          symbol: "Interest Saved",
          meaning: "Difference between the original and new estimated interest totals",
        },
      ],
      estimateNote:
        "This estimate compares total interest before and after a prepayment to show how much interest cost may reduce under simplified assumptions.",
      summary:
        "This calculator compares total interest under the original schedule versus after a prepayment, assuming EMI stays unchanged and tenure reduces.",
      inputs: [
        "Outstanding loan amount",
        "Interest rate and remaining tenure",
        "Prepayment amount",
      ],
    },
    meaning:
      "This can help you understand how a prepayment may reduce interest cost and loan duration under simplified assumptions.",
    relatedTools: [
      { title: "EMI Calculator", path: "/emi-calculator" },
      { title: "Home Loan Eligibility", path: "/home-loan-eligibility-calculator" },
      { title: "Compound Interest", path: "/compound-interest-calculator" },
    ],
  },
  "/gst-calculator": {
    howCalculated: {
      formula: "Add GST: GST = Amount × Rate / 100 | Remove GST: Base = Amount / (1 + Rate / 100)",
      variables: [
        { symbol: "Amount", meaning: "Base amount (add GST) or tax-inclusive amount (remove GST)" },
        { symbol: "Rate", meaning: "Selected GST percentage" },
        { symbol: "GST", meaning: "Estimated tax amount when GST is added" },
        {
          symbol: "Base",
          meaning: "Estimated pre-tax amount when GST is removed from an inclusive total",
        },
      ],
      estimateNote:
        "These formulas estimate GST-inclusive or GST-exclusive amounts for a selected rate under simplified tax assumptions.",
      summary:
        "This calculator adds GST to a base amount or removes GST from a tax-inclusive amount using the selected GST rate.",
      inputs: ["Amount", "GST rate", "Add or remove GST mode"],
    },
    meaning:
      "This can help you understand tax-inclusive and tax-exclusive amounts for invoices, purchases, or basic GST checks.",
    relatedTools: [
      { title: "Income Tax Calculator", path: "/income-tax-calculator" },
      { title: "HRA Calculator", path: "/hra-calculator" },
    ],
  },
  "/income-tax-calculator": {
    howCalculated: {
      formulaLabel: "Calculation approach",
      formula:
        "Taxable Income = Salary − salary standard deduction − entered deductions (Old only) | Tax = Slab tax − 87A rebate − 87A marginal relief + 4% cess",
      variables: [
        {
          symbol: "Salary",
          meaning: "Annual salary income considered for this educational estimate",
        },
        {
          symbol: "Salary standard deduction",
          meaning: "Section 16(ia) amount limited to salary: up to ₹75,000 in the new regime and up to ₹50,000 in the old regime for AY 2026-27",
        },
        {
          symbol: "Entered deductions",
          meaning: "Additional amounts the visitor asks the old-regime estimate to consider after the salary standard deduction; not a legal confirmation",
        },
        {
          symbol: "Taxable Income",
          meaning: "Income remaining after the supported deduction steps; never below zero",
        },
        {
          symbol: "87A rebate",
          meaning: "Educational rebate estimate for eligible resident-individual normal-rate income at or below the modelled threshold, applied before cess",
        },
        {
          symbol: "87A marginal relief",
          meaning: "Educational relief estimate for eligible new-regime normal-rate income just above ₹12,00,000, applied before cess",
        },
        {
          symbol: "4% cess",
          meaning: "Health and education cess on tax after rebate or marginal relief. Surcharge is not modelled.",
        },
      ],
      estimateNote:
        "This is a simplified FY 2025-26 (AY 2026-27) educational estimate for salary income. Old-regime slabs are for an individual below 60 years. Surcharge is not modelled. Special-rate income such as capital gains is outside this calculator's scope. A salary standard deduction of up to ₹75,000 (new) or ₹50,000 (old), limited to salary, is applied. New-regime Section 87A rebate may apply up to ₹12,00,000 taxable income. Section 87A marginal relief may apply just above that threshold for eligible normal-rate income.",
      summary:
        "This calculator estimates income tax for FY 2025-26 (AY 2026-27) using supported salary deductions, progressive slabs, an educational 87A rebate or marginal-relief step, and 4% cess.",
      inputs: [
        "Annual salary income",
        "Tax regime selection",
        "Eligible deductions considered for the old-regime estimate",
      ],
    },
    meaning:
      "This can help you compare a simplified old-regime and new-regime estimate for salary income. It is not a filing tool and does not identify a recommended regime.",
    relatedTools: [
      { title: "HRA Calculator", path: "/hra-calculator" },
      { title: "GST Calculator", path: "/gst-calculator" },
      { title: "PPF Calculator", path: "/ppf-calculator" },
    ],
  },
  "/hra-calculator": {
    howCalculated: {
      formula: "Exemption = Minimum of (Actual HRA, Rent − 10% of Basic, 50%/40% of Basic)",
      variables: [
        { symbol: "Exemption", meaning: "Estimated HRA amount that may be exempt from tax" },
        { symbol: "Actual HRA", meaning: "HRA received as part of salary" },
        {
          symbol: "Rent − 10% of Basic",
          meaning: "Rent paid minus ten percent of basic salary",
        },
        {
          symbol: "50%/40% of Basic",
          meaning: "City-based limit: 50% for metro and 40% for non-metro in this estimate",
        },
        { symbol: "Basic", meaning: "Basic salary used in the HRA rules" },
      ],
      estimateNote:
        "This formula estimates HRA exemption as the least of the eligible calculation values under simplified salary assumptions.",
      summary:
        "This calculator estimates HRA exemption using salary components, rent paid, and metro or non-metro city rules.",
      inputs: [
        "Basic salary and HRA received",
        "Rent paid",
        "Metro or non-metro city",
      ],
    },
    meaning:
      "This can help you understand how much HRA may be exempt versus taxable under common salary structures.",
    relatedTools: [
      { title: "Income Tax Calculator", path: "/income-tax-calculator" },
      { title: "GST Calculator", path: "/gst-calculator" },
    ],
  },
  "/compound-interest-calculator": {
    howCalculated: {
      formula: "A = P × (1 + r / n)^(n × t)",
      variables: [
        { symbol: "A", meaning: "Estimated final amount after compounding" },
        { symbol: "P", meaning: "Principal (starting amount)" },
        { symbol: "r", meaning: "Annual interest rate in decimal form" },
        { symbol: "n", meaning: "Number of compounding periods in a year" },
        { symbol: "t", meaning: "Time period in years" },
      ],
      estimateNote:
        "This formula estimates how principal may grow when interest compounds at a chosen frequency over the selected time period.",
      summary:
        "This calculator projects compound growth using principal, annual rate, compounding frequency, and time period.",
      inputs: [
        "Principal amount",
        "Annual interest rate",
        "Compounding frequency per year",
        "Time period in years",
      ],
    },
    meaning:
      "This can help you understand how compounding frequency and time may affect final value compared with simple interest.",
    relatedTools: [
      { title: "FD Calculator", path: "/fd-calculator" },
      { title: "RD Calculator", path: "/rd-calculator" },
      { title: "Lumpsum Calculator", path: "/lumpsum-calculator" },
    ],
  },
};

export function getCalculatorInsights(calculatorId) {
  return CALCULATOR_INSIGHTS[calculatorId] || null;
}
