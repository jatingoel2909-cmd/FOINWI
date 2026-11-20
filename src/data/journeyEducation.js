/**
 * Educational guidance for the seven mission journeys.
 * build-wealth is intentionally absent. It already uses the fuller journey page.
 *
 * Illustrative figures are the calculators' own starting results, or, for the
 * car comparison, the EMI engine at the inputs named in the sentence.
 * Lesson paths point at complete Learn lessons.
 */

export const JOURNEY_EDUCATION = {
  "buy-dream-home": {
    purpose: [
      "Buying with a home loan means taking a large balance now and repaying it in monthly instalments. The useful question is not only the EMI. It is how much cash you still need before borrowing, and how much interest the full tenure illustrates.",
      "This mission uses the eligibility, EMI, goal, and prepayment calculators already linked on the page. An eligibility figure is an educational estimate from the inputs you type. It is not a lender decision.",
    ],
    assumptions: [
      "The eligibility illustration uses that calculator's starting inputs: monthly income ₹1,00,000, existing monthly EMI ₹10,000, annual rate 8.5%, tenure 20 years, and an affordability ratio of 50%.",
      "The EMI illustration uses that calculator's starting inputs: loan ₹50,00,000, annual rate 8.5%, and tenure 20 years.",
      "Both illustrations treat the annual rate as constant and convert it to a monthly rate.",
      "Registration, stamp duty, insurance, and interiors are outside both figures.",
    ],
    limitations: [
      "A floating rate can change a later instalment. The Fixed vs Floating Rates lesson explains that difference.",
      "Fees and insurance are not inside the EMI.",
      "A lender can ask for a different income multiple, a credit check, or a different tenure.",
      "The two illustrations are separate. The ₹50,00,000 EMI example is not the eligible-loan result.",
    ],
    mistakes: [
      "Reading the eligible-loan figure as a lender's offer.",
      "Comparing houses by EMI alone and skipping total interest.",
      "Lengthening tenure only to shrink the monthly figure, without reading the interest.",
      "Treating the down payment as the only cash needed before the purchase.",
    ],
    scenario: [
      "Illustrative scenario from the Home Loan Eligibility Calculator's starting inputs. Illustrative available EMI ₹40,000. Illustrative eligible loan ₹46,09,234. This is not a lender decision.",
      "A separate illustration, from the EMI Calculator's starting inputs, shows EMI ₹43,391, total interest ₹54,13,879, and total repayment ₹1,04,13,879.",
    ],
    nextLesson: {
      path: "/learn/loans-emi/understanding-emi",
      title: "Understanding EMI",
      note: "Next, read how one instalment is split between interest and principal. Then open the eligibility calculator with your own income, not these starting inputs.",
    },
    moduleLessons: {
      "How home loan eligibility is assessed in India": {
        path: "/learn/loans-emi/how-loans-work",
        title: "How Loans Work",
      },
      "Cash a buyer still needs before borrowing": {
        path: "/learn/money-basics/financial-goals",
        title: "Financial Goals",
      },
      "Fixed vs floating interest rates for home loans": {
        path: "/learn/loans-emi/fixed-vs-floating-rates",
        title: "Fixed vs Floating Rates",
      },
      "What one prepayment changes on a loan": {
        path: "/learn/loans-emi/prepayment-basics",
        title: "Prepayment Basics",
      },
    },
  },
  "save-tax": {
    purpose: [
      "A salary-tax estimate is a decision about which year, which regime, and which deductions to enter. Take-home pay, CTC, and the income used in the calculator are different numbers.",
      "This mission does not choose a regime or file a return. It shows how to read the labels already printed on the income-tax, HRA, GST, and PPF calculators, including where those labels differ.",
    ],
    assumptions: [
      "The income-tax illustration is the New Regime starting example for FY 2025-26 · AY 2026-27, with annual salary income ₹12,00,000 and other deductions entered as ₹0.",
      "Surcharge is not modelled in that example.",
      "The HRA illustration is a different tool. Its page period is FY / Tax year 2026-27. It is not added to the income-tax example.",
      "The GST illustration uses the calculator's starting value of 18% on a taxable value of ₹10,000.00 in add mode. That rate is a starting input, not a classification of a purchase.",
    ],
    limitations: [
      "Bonus, perquisites, and other income can change the figure that belongs in the calculator.",
      "A named deduction applies only when the selected regime and the relevant conditions allow it. Paying into PPF is not, by itself, a tax refund.",
      "The PPF calculator's 7.1% figure is the illustrative rate already shown on that page for 1 October–31 December 2026.",
      "These pages do not prepare a return.",
    ],
    mistakes: [
      "Comparing regimes with different income figures and treating the gap as the regime difference.",
      "Adding the HRA page's year to the income-tax page's year as if they were one combined result.",
      "Treating a deduction as cash returned to you.",
      "Using the GST example as an income-tax result.",
    ],
    scenario: [
      "Illustrative scenario from the Income Tax Calculator's New Regime starting inputs. Income considered ₹12,00,000. Salary standard deduction ₹75,000. Estimated taxable income ₹11,25,000. Slab tax ₹52,500. Section 87A rebate ₹52,500. Health & Education Cess ₹0. Estimated total tax ₹0. Surcharge is not modelled.",
      "Separately, the HRA Calculator's starting inputs are monthly basic salary ₹50,000, qualifying dearness allowance ₹0, monthly HRA received ₹20,000, monthly rent paid ₹18,000, and residence in the 50% cities. Rule 279 salary ₹50,000. Estimated monthly HRA exemption ₹13,000. Monthly taxable HRA ₹7,000.",
      "Separately, the GST Calculator's add-mode starting inputs show a GST component of ₹1,800.00 and a GST-inclusive invoice value of ₹11,800.00.",
    ],
    nextLesson: {
      path: "/learn/income-tax-basics/old-vs-new-tax-regime",
      title: "Old vs New Tax Regime",
      note: "Next, read how the two regime illustrations can diverge before any product is chosen. Then rerun the income-tax calculator for the year printed on that page.",
    },
    moduleLessons: {
      "How two tax-regime illustrations differ": {
        path: "/learn/income-tax-basics/old-vs-new-tax-regime",
        title: "Old vs New Tax Regime",
      },
      "How a named deduction appears in an estimate": {
        path: "/learn/income-tax-basics/section-80c-deductions",
        title: "Section 80C Deductions",
      },
      "HRA exemption under Rule 279 for FY 2026-27": {
        path: "/learn/income-tax-basics/hra-exemption-basics",
        title: "HRA Exemption Basics",
      },
      "How a salary estimate differs from take-home pay": {
        path: "/learn/income-tax-basics/income-tax-overview-in-india",
        title: "Income Tax Overview in India",
      },
    },
  },
  "child-education": {
    purpose: [
      "An education goal is a date, a target amount, and the monthly contribution you can keep aside. The decision is whether that contribution closes the illustrated gap, or whether the target, the date, or the return input needs another look.",
      "Fee inflation is something you type. FOINWI does not publish a school-fee forecast. The numbers below are the Inflation Calculator and Goal Planner starting illustrations, not a college bill.",
    ],
    assumptions: [
      "The inflation illustration starts at ₹1,00,000, uses an illustrative inflation rate of 6%, and runs for 10 years.",
      "The goal illustration starts at a target of ₹50,00,000, current savings of ₹2,00,000, a monthly investment of ₹15,000, an expected annual return input of 12%, and 10 years.",
      "The 12% and 6% figures are starting inputs. They are not a market result and not a fee index.",
      "The goal illustration compounds monthly, with contributions at the beginning of each month, which is the pattern that calculator already uses.",
    ],
    limitations: [
      "Scholarships, loans, and family support can change the amount you still need.",
      "A market-linked path can finish below the 12% input, including a loss.",
      "A deposit and a SIP illustration do not carry the same risk.",
      "Money kept for this goal and money kept for retirement are easier to read when they stay in separate targets.",
    ],
    mistakes: [
      "Saving only for today's fee and leaving the future price unexamined.",
      "Raising the return input until the gap disappears on the screen.",
      "Spending the education balance on household costs and still counting it as saved.",
      "Funding this goal by stopping every retirement contribution without writing that trade-off down.",
    ],
    scenario: [
      "Illustrative scenario from the Inflation Calculator's starting inputs. Future cost ₹1,79,085. Increase ₹79,085. This is what 6% compounded yearly does to ₹1,00,000 over 10 years in that tool. It is not a prediction of school or college fees.",
      "A separate Goal Planner starting illustration shows a projected value of ₹41,45,164 and a goal gap of ₹8,54,836 for the inputs listed above.",
    ],
    nextLesson: {
      path: "/learn/money-basics/financial-goals",
      title: "Financial Goals",
      note: "Next, name the education cost in today's rupees and the year you hope to pay it. Then open the Goal Planner and replace the starting target with that amount.",
    },
    moduleLessons: {
      "How a typed inflation rate changes an amount": {
        path: "/learn/money-basics/inflation",
        title: "Inflation",
      },
      "How a monthly investment differs from a deposit": {
        path: "/learn/mutual-funds-sip/how-sip-works",
        title: "How SIP Works",
      },
      "Keeping an education target separate from retirement": {
        path: "/learn/retirement-planning/planning-your-retirement-timeline",
        title: "Planning Your Retirement Timeline",
      },
      "Why insurance is a different question from the savings target": {
        path: "/learn/insurance-planning/why-insurance-matters",
        title: "Why Insurance Matters",
      },
    },
  },
  "buy-your-car": {
    purpose: [
      "A car loan is a choice about the monthly instalment, the interest over the full tenure, and the cash you pay before the loan. The showroom figure is only one of those numbers.",
      "This mission does not compare lenders and does not price insurance, fuel, or registration. The illustration below uses the same EMI formula as the EMI Calculator, at a smaller loan than that page's home-sized starting example.",
    ],
    assumptions: [
      "The loan amount in this illustration is ₹8,00,000 and the annual rate is a constant 9%.",
      "Tenure is compared at 5 years and at 7 years. Nothing else changes between the two rows.",
      "EMI uses the reducing-balance monthly formula from the EMI engine.",
      "Insurance, fuel, registration, and fees are excluded.",
    ],
    limitations: [
      "A lender's rate, fees, and minimum down payment can differ from 9% and from this loan amount.",
      "A new vehicle and a used vehicle can change the price and the tenure on offer. They do not change the formula.",
      "The checklist mentions 15–20% of monthly income as a prompt. That is not a lender limit, and a comfortable share can be different.",
      "Running costs continue after the loan ends or while it is still being repaid.",
    ],
    mistakes: [
      "Choosing the longer tenure only because the EMI is smaller.",
      "Ignoring that the longer row illustrates more total interest.",
      "Budgeting the EMI and leaving fuel, service, and insurance renewals out of the month.",
      "Treating the calculator result as a loan offer.",
    ],
    scenario: [
      "Illustrative scenario, constant rate, not a lender quote. On ₹8,00,000 at 9% for 5 years, the estimated EMI is ₹16,607, estimated interest is ₹1,96,401, and estimated total repayment is ₹9,96,401.",
      "The same amount and rate for 7 years shows an estimated EMI of ₹12,871, estimated interest of ₹2,81,186, and estimated total repayment of ₹10,81,186. In this illustration the longer tenure lowers the monthly figure and raises total interest.",
    ],
    nextLesson: {
      path: "/learn/loans-emi/understanding-emi",
      title: "Understanding EMI",
      note: "Next, read how early instalments contain more interest. Then enter your own loan amount in the EMI Calculator. The ₹8,00,000 rows above are only this explanation.",
    },
    moduleLessons: {
      "What a loan illustration leaves out of a vehicle price": {
        path: "/learn/loans-emi/how-loans-work",
        title: "How Loans Work",
      },
      "Why a new or used label does not change the EMI formula": {
        path: "/learn/loans-emi/understanding-emi",
        title: "Understanding EMI",
      },
      "How an instalment sits beside other monthly costs": {
        path: "/learn/loans-emi/managing-debt-wisely",
        title: "Managing Debt Wisely",
      },
      "Why a rupee now and a rupee later differ": {
        path: "/learn/money-basics/time-value-of-money",
        title: "Time Value of Money",
      },
    },
  },
  "retirement-planning": {
    purpose: [
      "A retirement illustration asks what today's monthly spending could look like later, and what share of that picture is already saved. The result is a gap under the assumptions you leave in the calculator.",
      "EPF, NPS, and a mutual-fund withdrawal are different arrangements. This mission keeps the retirement-calculator illustration separate from the EPF calculator's starting illustration.",
    ],
    assumptions: [
      "The retirement illustration uses that calculator's starting inputs: current age 30, retirement age 60, current monthly expense ₹50,000, illustrative inflation until retirement 6%, illustrative return until retirement 10%, current retirement savings ₹5,00,000, 25 illustrated years in retirement, illustrative inflation during retirement 5%, and illustrative return during retirement 7%.",
      "The 25× comparison on that page is not the primary corpus estimate.",
      "The EPF illustration uses monthly PF wages entered as ₹30,000, current balance ₹2,00,000, an illustrative annual rate of 8.25%, and 20 years.",
      "NPS and SWP have their own starting illustrations on those calculators. They are not added into the corpus figure below.",
    ],
    limitations: [
      "A constant inflation rate and a constant return are teaching assumptions. Lived results can be higher or lower.",
      "The EPF result is not a passbook. In that starting illustration the contribution wage used is ₹25,000, which is lower than the ₹30,000 entered.",
      "An NPS exit and a systematic withdrawal follow different rules. The lessons linked below keep them separate.",
      "The illustration does not know how long someone will live. The 25 years are an input.",
    ],
    mistakes: [
      "Using today's monthly expense as if it were the spending level at retirement.",
      "Treating the 25× figure as the main corpus.",
      "Adding the EPF projection, the NPS projection, and this corpus together without checking that the same savings were counted once.",
      "Raising the return input until the funding gap disappears.",
    ],
    scenario: [
      "Illustrative scenario from the Retirement Calculator's starting inputs. Monthly expense at retirement ₹2,87,175. Illustrative retirement corpus ₹6,79,30,310. Projected value of current retirement savings ₹87,24,701. Illustrative funding gap ₹5,92,05,609. Illustrative monthly contribution ₹25,975. The 25× simple comparison on that page is ₹8,61,52,368 and is not the primary corpus estimate.",
      "Separately, the EPF Calculator's starting illustration shows a contribution wage of ₹25,000, combined monthly EPF entering the projected corpus of ₹3,917, and a projected EPF balance of ₹34,32,102.",
    ],
    nextLesson: {
      path: "/learn/retirement-planning/retirement-corpus-basics",
      title: "Retirement Corpus Basics",
      note: "Next, read how a corpus illustration is built from future spending, inflation, and a chosen number of years. Then replace the starting age and expense with your own.",
    },
    alsoRead: [
      {
        path: "/learn/retirement-planning/nps-overview",
        title: "NPS Overview",
      },
    ],
    moduleLessons: {
      "How a retirement corpus estimate can be illustrated": {
        path: "/learn/retirement-planning/retirement-corpus-basics",
        title: "Retirement Corpus Basics",
      },
      "EPF, NPS, and PPF roles in retirement planning": {
        path: "/learn/retirement-planning/epf-and-employer-benefits",
        title: "EPF and Employer Benefits",
      },
      "Inflation impact on post-retirement expenses": {
        path: "/learn/money-basics/inflation",
        title: "Inflation",
      },
      "How a systematic withdrawal differs from a pension": {
        path: "/learn/retirement-planning/swp-for-retirement-income",
        title: "SWP for Retirement Income",
      },
    },
  },
  "become-debt-free": {
    purpose: [
      "Becoming debt-free is a decision about which balance to reduce, and whether an extra payment changes interest or the time left. A lower EMI is not the same fact as lower total interest.",
      "FOINWI does not have a lesson that defines avalanche and snowball by those names. Managing Debt Wisely discusses keeping instalments within a comfortable share of income and choosing a repayment order. The numbers below are one prepayment illustration, not a plan for every loan you hold.",
    ],
    assumptions: [
      "The illustration uses the Loan Prepayment Calculator's starting inputs: outstanding ₹30,00,000, annual rate 9%, remaining tenure 15 years, and a prepayment of ₹2,00,000.",
      "The EMI stays on the original schedule. The prepayment reduces the outstanding balance, and the calculator then estimates the shorter time at that same EMI.",
      "The rate stays constant.",
      "Charges for prepaying, and any tax effect, are not in the figure.",
    ],
    limitations: [
      "A second loan is not included. Listing every balance, with its own rate and tenure, still has to be done outside this one example.",
      "If the rate changes, the interest and the time saved can change.",
      "There is no FOINWI lesson that scores credit. This page does not describe how a bureau score is built.",
      "An emergency reserve and a prepayment use the same cash. Spending it on the loan means it is no longer a reserve.",
    ],
    mistakes: [
      "Ranking loans by the EMI and ignoring the interest rate and the years left.",
      "Prepaying the last cash set aside for a short-term shock.",
      "Reading 1.9 years saved as a result that survives a rate change.",
      "Adding two loans into this single outstanding amount and treating the answer as exact.",
    ],
    scenario: [
      "Illustrative scenario from the Loan Prepayment Calculator's starting inputs. EMI on the original schedule ₹30,428. New outstanding amount ₹28,00,000. Interest saved ₹4,99,844. Revised loan impact: 1.9 years saved. This is a constant-rate illustration of one loan.",
    ],
    nextLesson: {
      path: "/learn/loans-emi/prepayment-basics",
      title: "Prepayment Basics",
      note: "Next, read what an extra principal payment changes. Then list each loan separately before you reuse this ₹30,00,000 example.",
    },
    moduleLessons: {
      "How a lesson discusses repayment order": {
        path: "/learn/loans-emi/managing-debt-wisely",
        title: "Managing Debt Wisely",
      },
      "Payoff method names this page does not define": {
        path: "/learn/loans-emi/managing-debt-wisely",
        title: "Managing Debt Wisely",
      },
      "What an extra principal payment changes": {
        path: "/learn/loans-emi/prepayment-basics",
        title: "Prepayment Basics",
      },
    },
  },
  "protect-your-family": {
    purpose: [
      "Protection is a set of separate questions: what a term policy pays if the insured person dies during the term, what a health policy may pay toward a medical bill, and what cash is kept where you can reach it. One product does not answer all three.",
      "This mission does not calculate a personal cover amount. Evaluating Coverage Needs explains that cover depends on dependents, liabilities, income, and existing assets. There is no FOINWI lesson that drafts a will or sets a cover multiple.",
    ],
    assumptions: [
      "A term benefit is the amount stated in a policy, subject to that policy. The Term Life Insurance lesson describes it as cover, not as a maturity value.",
      "A health sum is a policy limit. The Health Insurance lesson says a headline sum is not a promise that every bill is paid.",
      "The FD illustration uses that calculator's starting inputs: deposit ₹5,00,000, annual rate 7%, tenure 5 years, quarterly compounding.",
      "The inflation illustration uses ₹1,00,000, an illustrative rate of 6%, and 10 years. It is not a family budget.",
    ],
    limitations: [
      "Waiting periods, exclusions, and sub-limits sit in the policy, not in these calculators.",
      "The FD maturity is not an insurance premium and not a required emergency fund. The Emergency Funds lesson discusses a reserve of a few months of essential expenses. This page's checklist mentions 6–12 months. Neither line is a personal requirement.",
      "Nominees and wills are legal arrangements. This page does not prepare them.",
      "The documents card has no matching Learn lesson. The linked lessons stop at insurance and the emergency reserve.",
    ],
    mistakes: [
      "Choosing a policy because it shows a maturity value and calling that the family's protection.",
      "Counting one balance as both the emergency reserve and the long-term investment.",
      "Assuming the sum insured is the amount a hospital will receive for every bill.",
      "Leaving the document list on the checklist unchecked and assuming the policy alone is enough for the family to find.",
    ],
    scenario: [
      "Illustrative scenario from the FD Calculator's starting inputs, shown here only as a cash-reserve style deposit. Estimated maturity ₹7,07,389. Estimated interest ₹2,07,389. This is not a premium and not a recommended emergency fund.",
      "Separately, the Inflation Calculator's starting inputs show a future cost of ₹1,79,085 and an increase of ₹79,085. That is 6% a year on ₹1,00,000 for 10 years, not a forecast of household expenses.",
    ],
    nextLesson: {
      path: "/learn/insurance-planning/evaluating-coverage-needs",
      title: "Evaluating Coverage Needs",
      note: "Next, read the questions that lesson asks about dependents, liabilities, income, and assets. FOINWI does not turn those questions into a cover amount on this page.",
    },
    moduleLessons: {
      "What a term benefit covers during the policy term": {
        path: "/learn/insurance-planning/term-life-insurance",
        title: "Term Life Insurance",
      },
      "What a cash reserve is for": {
        path: "/learn/saving-budgeting/emergency-funds",
        title: "Emergency Funds",
      },
      "What a health policy limit does not promise": {
        path: "/learn/insurance-planning/health-insurance",
        title: "Health Insurance",
      },
    },
  },
};

export function getJourneyEducation(slug) {
  return JOURNEY_EDUCATION[slug] ?? null;
}
