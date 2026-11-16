/**
 * Visible worked examples for the 20 public calculators.
 *
 * Each example uses that calculator's existing starting inputs.
 * Displayed results are the same figures the page already shows for those
 * inputs. Assumptions and limitations stay in the existing insight and
 * explain data and are not copied here.
 * Lesson routes are existing Learn lessons that already name the calculator.
 */

export const CALCULATOR_GUIDANCE = {
  "/sip-calculator": {
    lines: [
      "Monthly investment: ₹10,000",
      "Expected annual return: 12%",
      "Time period: 15 years",
    ],
    outcome:
      "Estimated wealth ₹50,45,760. Total invested ₹18,00,000. Estimated returns ₹32,45,760.",
    lesson: {
      path: "/learn/mutual-funds-sip/how-sip-works",
      title: "How SIP Works",
    },
  },
  "/emi-calculator": {
    lines: [
      "Loan amount: ₹50,00,000",
      "Annual interest rate: 8.5%",
      "Loan tenure: 20 years",
    ],
    outcome:
      "EMI ₹43,391. Total interest ₹54,13,879. Total repayment ₹1,04,13,879.",
    lesson: {
      path: "/learn/loans-emi/understanding-emi",
      title: "Understanding EMI",
    },
  },
  "/fd-calculator": {
    lines: [
      "Deposit amount: ₹5,00,000",
      "Annual interest rate: 7%",
      "Tenure: 5 years",
      "Compounding: quarterly",
    ],
    outcome: "Estimated maturity ₹7,07,389. Estimated interest ₹2,07,389.",
    lesson: {
      path: "/learn/money-basics/time-value-of-money",
      title: "Time Value of Money",
    },
  },
  "/ppf-calculator": {
    lines: [
      "Annual contribution: ₹1,50,000",
      "Illustrative annual rate: 7.1%",
      "Contribution years: 15",
    ],
    outcome:
      "Estimated PPF balance ₹40,68,209. Total contributed ₹22,50,000. Illustrative interest ₹18,18,209. The 7.1% figure is the illustrative rate already shown on this page for 1 July–30 September 2026.",
    lesson: {
      path: "/learn/investing-fundamentals/asset-classes-in-india",
      title: "Asset Classes in India",
    },
  },
  "/retirement-calculator": {
    lines: [
      "Current age: 30",
      "Retirement age: 60",
      "Current monthly expense: ₹50,000",
      "Illustrative inflation until retirement: 6%",
      "Illustrative return until retirement: 10%",
      "Current retirement savings: ₹5,00,000",
      "Illustrated years in retirement: 25",
      "Illustrative inflation during retirement: 5%",
      "Illustrative return during retirement: 7%",
    ],
    outcome:
      "Monthly expense at retirement ₹2,87,175. Illustrative retirement corpus ₹6,79,30,310. Projected value of current retirement savings ₹87,24,701. Illustrative funding gap ₹5,92,05,609. Illustrative monthly contribution ₹25,975. The 25× simple comparison on this page is ₹8,61,52,368 and is not the primary corpus estimate.",
    lesson: {
      path: "/learn/retirement-planning/retirement-corpus-basics",
      title: "Retirement Corpus Basics",
    },
  },
  "/goal-planner": {
    lines: [
      "Target goal: ₹50,00,000",
      "Current savings: ₹2,00,000",
      "Monthly investment: ₹15,000",
      "Expected annual return: 12%",
      "Time period: 10 years",
    ],
    outcome: "Projected value ₹41,45,164. Goal gap ₹8,54,836.",
    lesson: {
      path: "/learn/money-basics/financial-goals",
      title: "Financial Goals",
    },
  },
  "/cagr-calculator": {
    lines: [
      "Beginning value: ₹1,00,000",
      "Ending value: ₹2,50,000",
      "Time period: 5 years",
    ],
    outcome: "CAGR 20.11%. Absolute change ₹1,50,000.",
    lesson: {
      path: "/learn/mutual-funds-sip/understanding-cagr",
      title: "Understanding CAGR",
    },
  },
  "/lumpsum-calculator": {
    lines: [
      "Investment amount: ₹5,00,000",
      "Expected annual return: 12%",
      "Time period: 10 years",
    ],
    outcome: "Estimated future value ₹15,52,924. Estimated gain ₹10,52,924.",
    lesson: {
      path: "/learn/mutual-funds-sip/lumpsum-vs-sip",
      title: "Lumpsum vs SIP",
    },
  },
  "/rd-calculator": {
    lines: [
      "Monthly deposit: ₹5,000",
      "Annual interest rate: 7%",
      "Tenure: 5 years",
    ],
    outcome:
      "Estimated maturity ₹3,60,053. Total deposited ₹3,00,000. Estimated interest ₹60,053.",
    lesson: {
      path: "/learn/saving-budgeting/saving-strategies",
      title: "Saving Strategies",
    },
  },
  "/swp-calculator": {
    lines: [
      "Initial corpus: ₹50,00,000",
      "Monthly withdrawal: ₹25,000",
      "Expected annual return: 10%",
      "Time period: 15 years",
    ],
    outcome:
      "Remaining value ₹1,19,07,839. Total withdrawal ₹45,00,000. In this constant-return illustration the corpus lasts through the selected tenure.",
    lesson: {
      path: "/learn/retirement-planning/swp-for-retirement-income",
      title: "SWP for Retirement Income",
    },
  },
  "/inflation-calculator": {
    lines: [
      "Current amount: ₹1,00,000",
      "Illustrative inflation rate: 6%",
      "Time period: 10 years",
    ],
    outcome: "Future cost ₹1,79,085. Increase ₹79,085.",
    lesson: {
      path: "/learn/money-basics/inflation",
      title: "Inflation",
    },
  },
  "/gratuity-calculator": {
    lines: [
      "Last drawn statutory wages: ₹50,000",
      "Completed years of service: 10",
      "Additional months of service: 0",
    ],
    outcome:
      "Qualifying years used in this estimate: 10. Estimated gratuity ₹2,88,462. This example stays under the ₹20 lakh ceiling already used on this page.",
    lesson: {
      path: "/learn/retirement-planning/epf-and-employer-benefits",
      title: "EPF and Employer Benefits",
    },
  },
  "/epf-calculator": {
    lines: [
      "Monthly PF wages entered: ₹30,000",
      "Current EPF balance: ₹2,00,000",
      "Illustrative annual rate: 8.25%",
      "Years remaining: 20",
    ],
    outcome:
      "Contribution wage used in this estimate ₹15,000. Combined monthly EPF entering the projected corpus ₹2,350. Projected EPF balance ₹24,73,352.",
    lesson: {
      path: "/learn/retirement-planning/epf-and-employer-benefits",
      title: "EPF and Employer Benefits",
    },
  },
  "/nps-calculator": {
    lines: [
      "Monthly contribution: ₹5,000",
      "Illustrative annual return: 10%",
      "Current age: 30",
      "Exit age: 60",
      "Annuity allocation: 20%",
      "Illustrative annuity rate: 6%",
    ],
    outcome:
      "Estimated projected NPS corpus ₹1,13,96,627. Total contributed ₹18,00,000. Annuity allocation ₹22,79,325. Illustrative lump sum ₹91,17,301. Illustrative monthly annuity income ₹11,397.",
    lesson: {
      path: "/learn/retirement-planning/nps-overview",
      title: "NPS Overview",
    },
  },
  "/home-loan-eligibility-calculator": {
    lines: [
      "Monthly income: ₹1,00,000",
      "Existing monthly EMI: ₹10,000",
      "Annual interest rate: 8.5%",
      "Loan tenure: 20 years",
      "Affordability ratio: 50%",
    ],
    outcome:
      "Illustrative available EMI ₹40,000. Illustrative eligible loan ₹46,09,234. This is not a lender decision.",
    lesson: {
      path: "/learn/loans-emi/fixed-vs-floating-rates",
      title: "Fixed vs Floating Rates",
    },
  },
  "/loan-prepayment-calculator": {
    lines: [
      "Outstanding loan amount: ₹30,00,000",
      "Annual interest rate: 9%",
      "Remaining tenure: 15 years",
      "Prepayment amount: ₹2,00,000",
    ],
    outcome:
      "EMI on the original schedule ₹30,428. New outstanding amount ₹28,00,000. Interest saved ₹4,99,844. Revised loan impact: 1.9 years saved.",
    lesson: {
      path: "/learn/loans-emi/prepayment-basics",
      title: "Prepayment Basics",
    },
  },
  "/gst-calculator": {
    lines: [
      "Mode: add GST to taxable value",
      "Taxable value: ₹10,000.00",
      "Visitor-entered rate: 18%",
    ],
    outcome:
      "GST component ₹1,800.00. GST-inclusive invoice value ₹11,800.00. 18% is only this calculator's starting value. It is not FOINWI's classification of your transaction.",
    lesson: {
      path: "/learn/income-tax-basics/gst-in-everyday-purchases",
      title: "GST in Everyday Purchases",
    },
  },
  "/income-tax-calculator": {
    lines: [
      "Period: FY 2025-26 · AY 2026-27",
      "Regime: New Regime",
      "Annual salary income: ₹12,00,000",
      "Other deductions entered: ₹0",
    ],
    outcome:
      "Income considered ₹12,00,000. Salary standard deduction ₹75,000. Estimated taxable income ₹11,25,000. Slab tax ₹52,500. Section 87A rebate ₹52,500. Health & Education Cess ₹0. Estimated total tax ₹0. Surcharge is not modelled.",
    lesson: {
      path: "/learn/income-tax-basics/income-tax-overview-in-india",
      title: "Income Tax Overview in India",
    },
  },
  "/hra-calculator": {
    lines: [
      "Monthly basic salary: ₹50,000",
      "Qualifying dearness allowance: ₹0",
      "Monthly HRA received: ₹20,000",
      "Monthly rent paid: ₹18,000",
      "Residence: 50% cities",
      "Period on this page: FY / Tax year 2026-27",
    ],
    outcome:
      "Rule 279 salary ₹50,000. Estimated monthly HRA exemption ₹13,000. Monthly taxable HRA ₹7,000.",
    lesson: {
      path: "/learn/income-tax-basics/hra-exemption-basics",
      title: "HRA Exemption Basics",
    },
  },
  "/compound-interest-calculator": {
    lines: [
      "Principal: ₹1,00,000",
      "Annual rate: 8%",
      "Time period: 10 years",
      "Compounding: yearly",
    ],
    outcome: "Estimated maturity ₹2,15,892. Estimated interest ₹1,15,892.",
    lesson: {
      path: "/learn/money-basics/compounding",
      title: "Compounding",
    },
  },
};

export function getCalculatorGuidance(calculatorId) {
  return CALCULATOR_GUIDANCE[calculatorId] ?? null;
}
