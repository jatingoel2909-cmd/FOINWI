/**
 * Full lesson copy for the 39 public Learn routes.
 * Routes and slugs stay in learnAcademy.js.
 * Rates in these lessons are labeled illustrations. They are not live market,
 * tax, or scheme rates. Statutory items that still need owner verification
 * are listed in LESSON_REVIEW_FLAGS and are not presented as newly researched law.
 */

export const LESSON_REVIEW_FLAGS = Object.freeze([
  {
    route: "/learn/income-tax-basics/income-tax-overview-in-india",
    statement: "FOINWI's income-tax calculator is described as labeled FY 2025-26 · AY 2026-27, for salary income, without surcharge or special-rate income such as capital gains.",
    why: "This matches the estimator's existing code comments. It was not re-checked against the Gazette in this pass.",
  },
  {
    route: "/learn/income-tax-basics/old-vs-new-tax-regime",
    statement: "The lesson describes a default regime and an opt-out regime without listing slab numbers.",
    why: "Slab amounts, rebate thresholds, and which deductions each regime allows must be confirmed for the labeled year before any numeric slab is published.",
  },
  {
    route: "/learn/income-tax-basics/section-80c-deductions",
    statement: "The previous summary said section 80C allows deductions up to ₹1.5 lakh. That figure was removed from the public lesson.",
    why: "The income-tax estimator for FY 2025-26 follows Income-tax Act, 1961 section numbering. The cap, the section number, and the eligible list need owner verification before a rupee limit is stated again.",
  },
  {
    route: "/learn/income-tax-basics/hra-exemption-basics",
    statement: "The lesson keeps FOINWI's existing HRA frame: FY 2026-27, opt-out of the default regime under section 202, Rule 279, eight cities at half of simplified salary, other places at two-fifths, and rent minus one-tenth of that salary. Commission is described as not modelled. A rent-total note of ₹1,00,000 for landlord PAN on Form 124 is mentioned as documentation already described on the calculator, not as a fourth arithmetic limb.",
    why: "These points follow the calculator's locked educational scope. They need owner verification against the Income-tax Act, 2025 and the Income-tax Rules, 2026.",
  },
  {
    route: "/learn/income-tax-basics/gst-in-everyday-purchases",
    statement: "Eighteen per hundred is used only as a starting arithmetic example. No GST slab schedule was added.",
    why: "The applicable rate depends on the supply. Confirm any rate with the GST portal or the invoice rather than treating the example as a classification.",
  },
  {
    route: "/learn/retirement-planning/epf-and-employer-benefits",
    statement: "The lesson does not restate an employee or employer contribution percentage, a wage ceiling, or an EPF interest figure.",
    why: "Those amounts are statutory or notified and can change. Add them only after the owner checks EPFO material and the calculator's own disclosed assumption.",
  },
  {
    route: "/learn/retirement-planning/nps-overview",
    statement: "The lesson does not state an annuity-allocation share, a tax-free withdrawal share, or an annuity rate.",
    why: "Exit, annuity, and tax treatment depend on subscriber type, corpus, and the year's rules. The calculator already limits itself to one non-Government All Citizen normal-exit illustration and does not compute tax.",
  },
  {
    route: "/learn/loans-emi/understanding-emi",
    statement: "The worked EMI uses a standard reducing-balance identity: ₹10,00,000, nine per hundred a year, 240 months, giving ₹8,997.26 before fees.",
    why: "This is arithmetic for the lesson, not a lender quote. Confirm it still matches the on-screen calculator's rounding before calling it the page result.",
  },
]);

function lesson(fields) {
  return fields;
}

export const FULL_LESSON_CONTENT = Object.freeze({
  "income-tax-basics/income-tax-overview-in-india": lesson({
    simpleExplanation: "Income tax is a tax on income that the law treats as taxable. For a salaried person in India, the payslip is the usual starting point, but the figure called CTC, the amount credited to the bank, and the income used in a tax estimate are three different ideas.\n\nCTC can include employer contributions and benefits the employee does not receive as monthly cash. Take-home pay is what remains after deductions the employer has already made. A tax estimate starts from the income the estimator is built to accept, then applies only the adjustments that estimator includes.",
    whyItMatters: "People often compare a colleague's in-hand pay with their own and treat the gap as tax. The gap may be rent, provident fund, a loan instalment, or a different salary structure. Reading those lines separately makes a calculator result easier to question.\n\nFOINWI's income-tax calculator prints its own period on the tool: FY 2025-26 · AY 2026-27. That label is the period that estimator illustrates. It is a salary-income estimate. It does not model surcharge, and it does not model special-rate income such as capital gains.",
    keyIdeas: [
      "CTC, take-home pay, and taxable salary answer different questions.",
      "Tax deducted at source on a salary is a collection method, not the final word on a return.",
      "Slab numbers, rebates, and deductions can change. Read the year printed on the tool.",
      "A calculator result is an educational estimate for the cases it says it covers.",
    ],
    example: "An offer letter may show ₹12,00,000 as CTC while the monthly credit is lower because employer provident fund, professional tax, or a loan instalment never arrived as spendable cash.",
    workedIllustration: "Suppose the employer states annual CTC of ₹12,00,000. Inside it, ₹72,000 is an employer provident-fund contribution that is not paid to the employee as salary, and the employee also contributes ₹72,000 from pay. Those two lines are not 'extra tax'. They are savings entries with their own rules.\n\nIf the employee then types only the salary figure the FOINWI income-tax tool asks for, the estimate uses that input and the tool's stated scope. It does not reconstruct the whole offer letter, and it does not tell the person what to claim on a return.",
    assumptions: [
      "The illustration separates CTC from cash pay. It does not compute tax.",
      "The ₹72,000 lines are round teaching figures, not a statutory contribution rate.",
      "The tool's year label and scope are the ones already printed in FOINWI's income-tax estimator.",
    ],
    commonMistakes: [
      "Treating CTC as the income that will be taxed rupee for rupee.",
      "Assuming tax deducted by the employer equals the tax due on every kind of income.",
      "Mixing this calculator's year with the year printed on the HRA calculator.",
      "Using one estimate for capital gains, business income, or a non-resident salary case the tool does not claim to cover.",
    ],
    deeperExplanation: "Indian salary documents use names that sound similar. Basic salary, dearness allowance, house rent allowance, and a special allowance can all be part of pay, and each can be treated differently when someone later computes tax. A learning page cannot settle that treatment.\n\nWhat it can do is slow the reader down. Write down the document name, the period, and the line you are looking at. Then open the calculator and read its limit notes before trusting the number on the right-hand side. If the notes say surcharge is not modelled, a high-income illustration is incomplete even when the arithmetic on screen is tidy.",
    limitations: [
      "This lesson does not list slabs, rebate amounts, cess, or surcharge.",
      "It does not say whether a person should use one regime or another.",
      "Employer tax deduction can differ from a later return because information or income changed.",
    ],
    sources: [
      "Income Tax Department (incometaxindia.gov.in) for the forms, regimes, and thresholds of the relevant year.",
      "The year label and scope notes on FOINWI's income-tax calculator, which this lesson does not override.",
    ],
    nextSteps: ["See how two regime illustrations can diverge before any product is chosen."],
    relatedLessonRefs: ["income-tax-basics/old-vs-new-tax-regime", "income-tax-basics/hra-exemption-basics"],
  }),

  "income-tax-basics/old-vs-new-tax-regime": lesson({
    simpleExplanation: "India's income-tax discussion often compares two ways of computing tax for an individual. One is commonly called the default or new regime. The other is an opt-out, often still called the old regime, where more deductions and exemptions may be available and the rate schedule can differ.\n\nFOINWI does not decide which computation a person must use. The income-tax calculator can place the same typed salary into the two educational paths it supports and show how the results differ under its own assumptions.",
    whyItMatters: "A lower headline rate is not automatically a lower tax estimate. If one path allows a deduction and the other does not, the income that enters the rate schedule is different. Comparing only the rate tables, without the deductions the path actually permits, answers a different question from the one on the payslip.",
    keyIdeas: [
      "The two paths can treat deductions and exemptions differently.",
      "The same salary input can produce two different educational estimates.",
      "A regime comparison is for a stated year, not for every future year.",
      "The calculator does not file a return or choose a regime.",
    ],
    example: "Two colleagues with the same cash salary can see different estimates if one types an eligible deduction and the other leaves that input at zero.",
    workedIllustration: "Use ₹9,00,000 only as the annual salary typed into the estimator. In illustration A, the deduction inputs stay at zero. In illustration B, the person types a deduction the tool accepts for the opt-out path and leaves the default path without that deduction.\n\nThe useful comparison is the pair of estimates the tool shows, read with its year label FY 2025-26 · AY 2026-27. This lesson does not convert either estimate into a recommendation. If the tool's notes say a rebate or marginal relief is modelled only in a narrow case, that note is part of the result.",
    assumptions: [
      "Both illustrations use the same salary input so the deduction treatment is the thing that changes.",
      "No slab table is reproduced here.",
      "The person is within the salary-income scope printed on the calculator.",
    ],
    commonMistakes: [
      "Choosing a path because someone called it simpler, without reading which deductions it drops.",
      "Carrying last year's deduction list into a year whose rules changed.",
      "Comparing a colleague's estimate when the salary structures differ.",
      "Treating the on-screen difference as the tax that will be refunded.",
    ],
    deeperExplanation: "Employers may ask which path to use for monthly tax deduction. That choice affects the payslip during the year. A later return can still need a fresh look if rent, a loan certificate, or other income showed up after the employer locked the monthly deduction.\n\nFOINWI's HRA lesson uses a different printed period from this income-tax estimator. Using an HRA figure from one year inside a tax estimate labeled as another year mixes two illustrations. Read each tool's label before you combine them in a spreadsheet.",
    limitations: [
      "Rebate thresholds, cess, surcharge, and the exact deduction list are not stated here.",
      "Business income, capital gains, and non-salary cases are outside this explanation.",
      "A smaller estimate on one path is not advice to select that path.",
    ],
    sources: [
      "Income Tax Department (incometaxindia.gov.in) for the regime text that applies to the year being filed or deducted.",
      "FOINWI income-tax calculator notes for what that particular estimator includes.",
    ],
    nextSteps: ["Read how a named deduction differs from a cash refund before entering one."],
    relatedLessonRefs: ["income-tax-basics/section-80c-deductions", "income-tax-basics/income-tax-overview-in-india"],
  }),

  "income-tax-basics/section-80c-deductions": lesson({
    simpleExplanation: "People in India often use the name section 80C for a list of payments and investments that may be deducted when tax is computed under a regime that allows that list. The name is common in payslips, bank forms, and product brochures.\n\nA deduction is not a refund of the amount you paid. If a payment qualifies, it can reduce the income on which tax is computed. The tax difference, if any, is only a fraction of the qualifying amount, and only when that regime and that year allow it.",
    whyItMatters: "Brochures sometimes present a deposit as a way to 'save tax' equal to the deposit. That skips the regime, the cap printed in the official text, the lock-in, and the fact that the money has left your bank. Understanding the difference matters before a PPF deposit, an ELSS fund, or a life-insurance premium is treated as interchangeable.",
    keyIdeas: [
      "A qualifying deduction reduces computed income. It does not repay the whole payment.",
      "The default regime and the opt-out regime may not allow the same list.",
      "PPF, ELSS, and life-insurance premiums are often discussed. Discussion is not the same as eligibility.",
      "Lock-in, risk, and the reason you wanted the product still matter after the tax line is understood.",
    ],
    example: "Paying a ₹20,000 premium moves ₹20,000 out of the bank. It does not, by itself, put ₹20,000 back as a tax refund.",
    workedIllustration: "Start with the ₹20,000 premium. First ask whether the regime used for the estimate even accepts this kind of deduction. FOINWI's income-tax tool is where that switch is visible for its own educational estimate.\n\nIf the tool accepts ₹20,000 as a deduction input, the estimate can change by less than ₹20,000 because tax is computed on income, not as a full reimbursement. If the tool's path does not accept the input, the premium can still be a product you wanted, but it does not change that tax estimate. This lesson does not state a rupee cap. Confirm the cap, the section name, and the eligible list for the year you are using before you rely on a figure from a brochure.",
    assumptions: [
      "₹20,000 is a teaching premium, not a suggested policy.",
      "No tax rate is applied, so no refund amount is calculated.",
      "Eligibility, documents, and the overall cap are outside this page.",
    ],
    commonMistakes: [
      "Buying a product only because it is often named in deduction lists.",
      "Assuming every premium, tuition fee, or deposit qualifies.",
      "Entering the same deduction in a regime path that does not allow it.",
      "Ignoring the lock-in and then needing the cash for an emergency.",
    ],
    deeperExplanation: "ELSS is a market-linked mutual fund category with a lock-in. PPF is a government small-savings scheme with its own deposit rules and maturity rules. A life-insurance premium buys a contract; the protection and the deduction question are separate. Putting them in one sentence because they sometimes appear on the same form hides those differences.\n\nFOINWI's PPF calculator estimates an illustrative accumulation. It does not estimate a tax benefit. Use it to see how a deposit might grow under its stated assumptions, then keep the tax question on the tax calculator and the official text.",
    limitations: [
      "No cap, section number under the Income-tax Act, 2025, or eligible list is stated as law.",
      "The lesson does not say that a payment will qualify.",
      "It does not compare products or suggest a purchase.",
    ],
    sources: [
      "Income Tax Department (incometaxindia.gov.in) for the deduction section, cap, and eligible payments of the relevant year.",
      "Scheme or policy documents for lock-in and what the product actually does.",
    ],
    nextSteps: ["Return to the regime lesson and notice which path even asks for this deduction."],
    relatedLessonRefs: ["income-tax-basics/income-tax-overview-in-india", "income-tax-basics/old-vs-new-tax-regime"],
  }),

  "income-tax-basics/hra-exemption-basics": lesson({
    simpleExplanation: "House rent allowance is a salary line that may be partly non-taxable when the conditions in FOINWI's HRA estimate are met. That estimate is for FY 2026-27. It applies where a person has opted out of the default tax regime under section 202, actually pays rent for accommodation they occupy, and otherwise meets the conditions the calculator states.\n\nThe estimate is monthly. It uses a simplified salary of basic pay plus qualifying dearness allowance. Commission is not modelled. The educational result is the smaller of three figures described on the calculator, not a determination of the person's tax.",
    whyItMatters: "Rent is one of the largest cash outflows in many Indian cities. A payslip can show a large HRA line while the exempt portion is smaller because rent, salary, or the city category pulls the result down. Reading the three figures explains why the exempt amount is not 'whatever HRA the employer paid'.",
    keyIdeas: [
      "FOINWI's estimate is for the opt-out regime in its stated year, not the default regime.",
      "Simplified salary in the tool is basic pay plus qualifying dearness allowance. Commission is not modelled.",
      "The eight cities used for the half-salary figure are Mumbai, Kolkata, Delhi, Chennai, Hyderabad, Pune, Ahmedabad, and Bengaluru. Other places, including Gurugram and Noida, use two-fifths in this estimate.",
      "The result is a monthly illustration. A change of city, rent, or pay during the year needs a separate period.",
    ],
    example: "Two people with the same HRA can see different estimates if one lives in Bengaluru and the other in Noida, because this model uses a different fraction of simplified salary.",
    workedIllustration: "Monthly basic salary ₹50,000. Qualifying dearness allowance ₹0. Simplified salary in this model is ₹50,000. HRA received ₹20,000. Rent actually paid ₹18,000. Residence in one of the eight cities.\n\nFigure one is HRA received: ₹20,000. Figure two is rent minus one-tenth of simplified salary: ₹18,000 minus ₹5,000, which is ₹13,000. Figure three is half of simplified salary: ₹25,000. The smaller figure is ₹13,000. HRA received minus that figure is ₹7,000. On the calculator, that ₹7,000 is monthly taxable HRA for this scoped month. It is not total taxable income, and it is not a statement that the person has finished a return.\n\nIf rent were zero because the person lives in their own home, this estimate does not treat HRA as exempt.",
    assumptions: [
      "The person has opted out of the default regime for FY 2026-27 and occupies the rented home.",
      "Dearness allowance is included only where it matches the calculator's qualifying description.",
      "No commission is entered, because the estimator does not model commission.",
      "The numbers are monthly and constant for that month.",
    ],
    commonMistakes: [
      "Using the full HRA line as if it were exempt.",
      "Applying the eight-city fraction to a workplace city that is not the city of residence.",
      "Putting this monthly figure straight into the income-tax calculator without checking that tool's year label.",
      "Treating a landlord-PAN documentation note as if it changed the three-figure arithmetic.",
    ],
    deeperExplanation: "The calculator page also describes an employer-evidence form, Form 124, and a situation where aggregate rent during the tax year exceeds ₹1,00,000 and a landlord PAN is discussed. That note is about documentation. It is not a fourth mathematical limb of the estimate.\n\nDearness allowance belongs in the simplified salary only when it is provided for under the terms of employment in the way the calculator describes. Other allowances and perquisites are not part of this simplified input. If pay or rent changes in October, the April illustration should not be copied across the whole year.",
    limitations: [
      "This is not an annual exemption, a tax-payable figure, or an employer TDS calculation.",
      "Ownership of another property, a non-genuine tenancy, or a mid-year move is not settled here.",
      "The legal framing follows FOINWI's existing HRA estimator and still needs verification against the official text.",
    ],
    sources: [
      "Income Tax Department (incometaxindia.gov.in) to confirm the regime, rule, city list, and year before relying on an exemption.",
      "FOINWI's HRA calculator notes, which this worked illustration follows.",
    ],
    nextSteps: ["Keep this monthly figure separate from a GST arithmetic example on a rent invoice."],
    relatedLessonRefs: ["income-tax-basics/income-tax-overview-in-india", "income-tax-basics/gst-in-everyday-purchases"],
  }),

  "income-tax-basics/gst-in-everyday-purchases": lesson({
    simpleExplanation: "Goods and Services Tax can be inside a shop price or added on top of it. The same printed number means different things in those two cases. FOINWI's GST calculator does transaction-level GST arithmetic from an amount you type and a visitor-entered rate.\n\nFOINWI does not determine the legally applicable rate. It does not decide whether a supply is goods or services, interstate or intrastate, or exempt. Compensation cess, where applicable, is not included.",
    whyItMatters: "A phone quote, a restaurant bill, and a freelancer's invoice can all mention GST and still be hard to compare. Knowing whether you are looking at the taxable value or the invoice total stops a false comparison. It also stops a household budget from treating tax as a second copy of the same price.",
    keyIdeas: [
      "An exclusive price still needs the tax added. An inclusive price already contains it.",
      "The visitor enters the rate. The calculator does not classify the purchase.",
      "Eighteen per hundred appears on the tool only as a starting value for arithmetic.",
      "The tool does not calculate GST return liability or input tax credit.",
    ],
    example: "A repair quoted at ₹1,000 plus tax is not the same cash outlay as a repair quoted at ₹1,000 inclusive of tax.",
    workedIllustration: "Take a taxable value of ₹1,000 and a visitor-entered rate of eighteen per hundred, used here only because the calculator offers that figure as a starting value. Added tax is ₹180. The invoice total is ₹1,180.\n\nReverse the same invoice. From ₹1,180 inclusive, the arithmetic extracts a taxable value of ₹1,000 and tax of ₹180. That identity is the one the calculator documents for an inclusive amount. It is not a ruling that eighteen per hundred applies to the repair, the meal, or the laptop.\n\nA zero entry does not, by itself, mean the supply is exempt. The calculator does not determine whether a supply is exempt. Cess is still outside the result.",
    assumptions: [
      "One rate applies to the whole typed amount.",
      "The amount is either fully exclusive or fully inclusive, as the selected mode says.",
      "No discount, no cess, and no split between CGST, SGST, and IGST is calculated.",
    ],
    commonMistakes: [
      "Comparing an exclusive quote with an inclusive quote as if both were the final cash amount.",
      "Treating the starting value as the rate for your purchase.",
      "Using the arithmetic as a GST return or as input tax credit.",
      "Assuming a zero result proves an exemption.",
    ],
    deeperExplanation: "Household budgets usually need the cash that leaves the account, which is the invoice total. A business comparing margins may need the taxable value instead. The calculator asks which of those you typed so it does not apply the add-on identity to a price that already includes tax.\n\nInvoices in India also name the tax heads. This educational tool does not split those heads and does not decide them from your location. If a bill shows cess as its own line, add that line from the bill. It is not inside the calculator result.",
    limitations: [
      "No rate schedule is provided.",
      "Place of supply, registration, and return filing are outside this lesson.",
      "Paise on a real bill can differ slightly when a vendor rounds a line.",
    ],
    sources: [
      "GST portal (gst.gov.in) and the tax invoice for the rate and cess that apply to that supply.",
      "FOINWI's GST calculator notes for the arithmetic identities it actually uses.",
    ],
    nextSteps: ["Return to a monthly budget and record the cash total, not a second copy of the tax."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "income-tax-basics/income-tax-overview-in-india"],
  }),

  "loans-emi/how-loans-work": lesson({
    simpleExplanation: "A loan gives you money now in exchange for repayment later, usually with interest and sometimes with fees. In India this shows up as a home loan, a vehicle loan, an education loan, or a personal loan. The product names differ. The basic pieces are similar: amount borrowed, price of borrowing, time allowed, and charges that are not interest.",
    whyItMatters: "A monthly instalment is the number that has to fit in next month's bank balance. The total you repay can tell a different story. A loan that feels comfortable each month can still cost much more by the end if it runs for many extra years or carries fees at the start.",
    keyIdeas: [
      "Principal is what you borrow. Interest is a charge for time and risk. Tenure is how long repayment lasts.",
      "Processing fees, insurance bundled by a lender, and late charges are not the interest rate.",
      "A home loan is tied to a property and a lender's own checks. An educational calculator does not approve a loan.",
      "Comparing two loans needs the same fees and the same idea of total repayment, not only the monthly figure.",
    ],
    example: "Borrowing ₹5,00,000 for two years and borrowing the same amount for six years can both be called 'a five-lakh loan' while the total interest is not the same.",
    workedIllustration: "Write four lines before comparing offers. Line one: principal ₹5,00,000. Line two: the yearly rate the lender actually offered, which this lesson does not supply. Line three: tenure. Line four: fees due before the first instalment.\n\nIf one offer has a lower monthly request only because the tenure is longer, the fourth line and the total interest still need a look. FOINWI's EMI calculator can illustrate the monthly figure from the principal, rate, and tenure you type. It does not add stamp duty, a processing fee, or a lender's insurance unless you account for those outside the result.",
    assumptions: [
      "The example holds the principal still so tenure is the contrast.",
      "No lender is named and no approval is implied.",
      "Fees are acknowledged as separate from the interest identity.",
    ],
    commonMistakes: [
      "Signing because the monthly figure fits, without adding the fees.",
      "Comparing a flat-interest quote with a reducing-balance quote as if the labels meant the same thing.",
      "Forgetting that a floating rate can change after disbursement.",
      "Treating a calculator result as a sanction letter.",
    ],
    deeperExplanation: "Indian home loans often sit beside a down payment, registration, and GST on some property-related services. Those cash needs arrive before or around the purchase. They are not inside a plain EMI identity. A car loan can bundle the vehicle price, insurance, and a shorter tenure. A personal loan may have a higher price of borrowing and fewer questions about a pledged asset.\n\nThe educational point is the same. Name the principal, name the tenure, and put fees on their own line. Then the EMI page has a clean job: show how the typed rate and time turn that principal into a monthly request.",
    limitations: [
      "This lesson does not quote a lender, a repo rate, or a processing-fee schedule.",
      "It does not say how much someone can borrow.",
      "Prepayment rules and floating-rate resets are covered in the later loan lessons, not settled here.",
    ],
    sources: [
      "The loan agreement and the lender's key fact statement for fees, reset rules, and charges.",
      "Reserve Bank of India (rbi.org.in) for public material on fair lending practices. It does not price an individual loan.",
    ],
    nextSteps: ["Open the EMI lesson to see how one instalment is split between interest and principal."],
    relatedLessonRefs: ["loans-emi/understanding-emi", "loans-emi/fixed-vs-floating-rates"],
  }),

  "loans-emi/understanding-emi": lesson({
    simpleExplanation: "An equated monthly instalment is a level monthly payment designed so that a reducing-balance loan is repaid over a chosen number of months. Early payments contain more interest because the outstanding principal is still large. Later payments contain more principal because the balance has fallen.\n\nThe payment can stay level while the mix inside it changes. That is why 'the EMI is the same' does not mean 'each month reduces the loan by the same amount'.",
    whyItMatters: "People extending a home loan to shrink the monthly figure sometimes discover only at year five that most of what they paid went to interest. Seeing the first month's split makes that pattern visible without waiting for the lender's statement.",
    keyIdeas: [
      "The standard educational identity uses a monthly rate and the number of months.",
      "Interest for a month is the outstanding principal times the monthly rate.",
      "The principal portion is the instalment minus that interest, before fees.",
      "A longer tenure can lower the instalment and raise total interest. This lesson does not call either choice the right one.",
    ],
    example: "On a fresh loan, the first month's interest is simply the opening principal times the monthly rate. The rest of the instalment, if any, reduces principal.",
    workedIllustration: "Illustration, not a lender quote. Principal ₹10,00,000. Yearly rate nine per hundred, converted to a monthly rate by dividing by twelve. Tenure 240 months.\n\nThe reducing-balance identity produces an instalment of ₹8,997.26 before any fee. First-month interest is ₹7,500. The principal portion that month is ₹1,497.26. After that payment, the balance is about ₹9,98,502.74, and the next month's interest is calculated on the new balance.\n\nFOINWI's EMI calculator uses this kind of reducing-balance identity for the inputs you enter. Display rounding on the page can differ by a rupee from the paise shown here. Fees, insurance, and a later rate change are not inside this illustration.",
    assumptions: [
      "The rate stays constant for all 240 months.",
      "Payments are monthly and on time.",
      "No fee is deducted from the instalment and no part-payment occurs.",
    ],
    commonMistakes: [
      "Judging a loan only by the monthly figure.",
      "Dividing total interest by the number of months and expecting that to be the first month's interest.",
      "Forgetting that a missed payment can add charges the formula ignores.",
      "Assuming the illustration includes tax benefits on a home loan. It does not.",
    ],
    deeperExplanation: "A yearly rate of nine per hundred is a teaching assumption so the split can be seen in rupees. It is not a rate offered in the market this week, and it is not a forecast. If you type a different rate into the calculator, the instalment and the first-month split both move.\n\nOver a long tenure the early years clear principal slowly. That is ordinary arithmetic, not a trick. It becomes costly when the rate is high or when the borrower could have chosen a tenure they can still pay without emptying the emergency fund. The loan-eligibility tool on FOINWI is a separate illustration of affordability. It is not a bank's decision.",
    limitations: [
      "The figure ignores processing fees, legal charges, and insurance.",
      "It assumes a constant rate, so it is not a floating-rate forecast.",
      "It is not an amortisation statement from a lender.",
    ],
    sources: [
      "The loan agreement for the rate convention, due date, and whether the balance reduces monthly.",
      "FOINWI's EMI calculator to repeat the identity with your own inputs.",
    ],
    nextSteps: ["See what can change if the rate is fixed only for a period and floats afterward."],
    relatedLessonRefs: ["loans-emi/how-loans-work", "loans-emi/prepayment-basics"],
  }),

  "loans-emi/fixed-vs-floating-rates": lesson({
    simpleExplanation: "A fixed rate stays at the agreed figure for the period the contract names. A floating rate can move when the lender's benchmark moves, on the dates and by the method the contract describes. In Indian home loans, a floating rate is often linked to a benchmark the lender publishes, and the borrower's rate is that benchmark plus or minus a spread.",
    whyItMatters: "The monthly figure you qualify with is not always the monthly figure you will pay in year four. A reset can raise the instalment, lengthen the tenure, or do some combination the agreement allows. Households that budget to the rupee need to know which of those the lender will do.",
    keyIdeas: [
      "Fixed does not always mean fixed until the last month. Read the fixed period.",
      "Floating means the contract allows a change. It does not tell you the next number.",
      "A reset can affect the instalment, the tenure, or both, depending on the lender's terms.",
      "An educational calculator holds the rate you type. It does not predict the next reset.",
    ],
    example: "A contract that is fixed for three years and floating afterward is not the same product as a contract that can change every quarter from the first month.",
    workedIllustration: "Start from the earlier teaching loan: ₹10,00,000 for 240 months at a constant nine per hundred, instalment about ₹8,997 before fees. Now suppose the contract later sets the rate two percentage points higher and the lender keeps the tenure at 240 months. The instalment must rise, because the same principal path is being repriced. This lesson does not compute that second instalment as your loan. It shows why typing a higher rate into the EMI calculator is a useful stress test.\n\nIf the lender instead keeps the instalment unchanged and adds months, the monthly budget looks calm while the total interest and the end date move. Ask which method the agreement uses before you rely on either picture.",
    assumptions: [
      "The two-point gap is a stress test, not a forecast of a benchmark.",
      "No reset date, spread, or lender is named.",
      "Fees and part-payments stay out of the picture.",
    ],
    commonMistakes: [
      "Calling a loan fixed because the first year's instalment did not change.",
      "Stress-testing only a lower rate.",
      "Ignoring the spread the lender added on top of a benchmark.",
      "Assuming a calculator with a constant rate has priced the reset.",
    ],
    deeperExplanation: "Benchmarks and spreads are lender-specific. A public policy rate can move without your instalment moving on the same day, because the contract may reset on a quarter-end or an anniversary. The educational habit is to store the reset rule next to the loan, then rerun the EMI illustration at a higher typed rate to see whether the household surplus still covers it.\n\nA fixed loan can cost more at the start in exchange for a period with no reset. That trade is a preference and a contract comparison. It is not something this page can rank for you.",
    limitations: [
      "No current benchmark or spread is stated.",
      "The lesson does not say that floating will cost less or more than fixed.",
      "Switching products can involve charges the illustration ignores.",
    ],
    sources: [
      "The loan sanction letter and agreement for the benchmark, spread, reset date, and whether EMI or tenure absorbs a change.",
      "Reserve Bank of India (rbi.org.in) for public explanations of lending benchmarks, not for your spread.",
    ],
    nextSteps: ["Read how an extra principal payment can change the balance a later rate is applied to."],
    relatedLessonRefs: ["loans-emi/understanding-emi", "loans-emi/prepayment-basics"],
  }),

  "loans-emi/prepayment-basics": lesson({
    simpleExplanation: "A prepayment is money paid toward a loan in addition to the scheduled instalment, before the original end date. If the lender applies it to principal, later interest is calculated on a smaller balance. The contract may reduce the tenure, reduce the future instalment, or offer a choice. Some contracts also charge a fee on the extra payment.",
    whyItMatters: "An annual bonus is a common moment when Indian borrowers ask whether to prepay a home loan or keep the cash invested. The loan question can be illustrated. The investment question is separate and uncertain. Mixing them into one 'always prepay' rule ignores the emergency fund, the fee, and the rate on that particular loan.",
    keyIdeas: [
      "Interest after the prepayment depends on the new principal, not on the original schedule alone.",
      "A fee can absorb part of the extra payment before principal falls.",
      "Tenure reduction and instalment reduction are different outcomes.",
      "FOINWI's prepayment calculator is an educational illustration, not a lender statement.",
    ],
    example: "Paying an extra ₹50,000 does not automatically mean the principal falls by ₹50,000 if the contract deducts a charge first.",
    workedIllustration: "Outstanding principal ₹5,00,000. Extra payment ₹50,000. If the lender applies the full ₹50,000 to principal and charges nothing, the balance used for later interest is ₹4,50,000 until the next scheduled movement.\n\nIf the contract instead charges two per hundred of the extra amount as a fee, ₹1,000 of the ₹50,000 is a fee in this hypothetical and ₹49,000 reduces principal. The two-per-hundred fee is not a bank's schedule. It shows why the fee line belongs in the sum. Whether the lender then shortens the tenure or lowers the instalment is a term you have to read. FOINWI can illustrate an interest difference from the inputs it asks for. It cannot see your lender's posting date.",
    assumptions: [
      "The extra amount is accepted as a prepayment on the day you intend.",
      "The fee example is hypothetical.",
      "No tax consequence is calculated.",
    ],
    commonMistakes: [
      "Prepaying with the emergency fund and then borrowing again on a card.",
      "Ignoring a minimum prepayment amount or a notice period in the contract.",
      "Assuming every loan allows a free part-payment.",
      "Counting the entire extra payment as interest saved. The saving is the later interest that is no longer charged, which depends on the remaining rate and time.",
    ],
    deeperExplanation: "The earlier EMI illustration showed that the first months contain a large interest portion. A prepayment early in the loan removes principal that would otherwise have attracted interest for many remaining months. A prepayment near the end removes less future interest because fewer months remain. That timing intuition still depends on the rate staying near the one you typed.\n\nIf the rate is floating, a prepayment and a later reset both move the result. Run them as separate illustrations instead of adding the stories together in your head.",
    limitations: [
      "No lender's prepayment charge is quoted.",
      "The lesson does not compare prepayment with investing the same rupees.",
      "It does not calculate a tax deduction on home-loan interest.",
    ],
    sources: [
      "The loan agreement for part-payment rules, charges, and whether tenure or instalment changes.",
      "FOINWI's loan prepayment calculator for an illustration under the assumptions it prints.",
    ],
    nextSteps: ["Put the instalment back into the monthly budget before deciding the repayment can be larger."],
    relatedLessonRefs: ["loans-emi/how-loans-work", "loans-emi/managing-debt-wisely"],
  }),

  "loans-emi/managing-debt-wisely": lesson({
    simpleExplanation: "Managing debt means knowing what is owed, when it must be paid, and how those payments sit beside rent, food, and saving. A list beats a mood. The list needs the lender or card, the balance, the rate on that account, the instalment, and the due date.",
    whyItMatters: "In a salary month, several debits can hit before you notice: a home-loan ECS, a vehicle loan, a card minimum, and a buy-now-pay-later plan. Each one is affordable on its own in the brochure. Together they can crowd out the emergency fund. Writing them down is the educational step. It is not a repayment order prescribed for you.",
    keyIdeas: [
      "The monthly payment and the total cost are different facts.",
      "A revolving card balance and a home loan are different contracts. Read each rate on its own statement.",
      "A calculator does not approve a loan and does not rank your debts.",
      "An emergency buffer sits beside debt payments. Emptying it to look debt-free can create a new debt.",
    ],
    example: "A household can add three instalments and discover they already use a large part of take-home pay before groceries are bought.",
    workedIllustration: "Take-home pay ₹70,000. Home-loan instalment ₹22,000. Vehicle loan ₹8,000. Card minimum due ₹3,000, while the card statement also shows a revolving balance that will attract its own charge if only the minimum is paid. Essentials other than these debts ₹25,000.\n\nThe three debt debits are ₹33,000 before the revolving charge is even estimated. Essentials of ₹25,000 leave ₹12,000 for everything else, including saving. This arithmetic does not say which debt to pay first. It shows why 'the card minimum fits' can still be a strained month. FOINWI's EMI and eligibility calculators can illustrate a proposed new loan. They do not know this household's card contract.",
    assumptions: [
      "The rupee figures are a single teaching month.",
      "The card's revolving charge is not calculated, because the statement rate is unknown here.",
      "No new loan is recommended.",
    ],
    commonMistakes: [
      "Paying only card minimums and treating the card as a cheap loan.",
      "Taking a new personal loan to feel organised without reading its total cost.",
      "Using a debt-to-income rule of thumb as if it were a lender's decision.",
      "Forgetting annual charges and insurance renewals that are not monthly.",
    ],
    deeperExplanation: "A common classroom idea is to list high-priced revolving debt separately from a secured loan whose rate you already understand. The point of the list is visibility. Some people then pay extra toward the revolving balance. Some people pay extra toward the loan with the nearest end date so that one debit disappears. Those are methods you can learn. They are not instructions, because a prepayment penalty, a tax-linked home loan, or a missing emergency fund can change the sensible question.\n\nFOINWI's home-loan eligibility illustration uses an affordability ratio you can edit. The page says that ratio is not a regulator's rule. Keep that caution when a new EMI is about to join the list above.",
    limitations: [
      "No interest rate for cards or loans is stated.",
      "The lesson does not prescribe a repayment sequence.",
      "Legal remedies, settlement schemes, and credit scores are outside this explanation.",
    ],
    sources: [
      "Each lender or card statement for the balance, rate, minimum due, and charges.",
      "The monthly budget lesson for fitting those dues into take-home pay.",
    ],
    nextSteps: ["Build the month's budget with these dues written as their own lines."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "loans-emi/prepayment-basics"],
  }),

  "money-basics/what-is-money": lesson({
    simpleExplanation: "The Indian rupee is the money people in India commonly accept for wages, shop prices, rent, and bank transfers. Money does three jobs at once. It is a way to exchange goods without bartering, a unit that lets you compare a bus fare with a school fee, and a way to store purchasing power for later, though prices can change what 'later' can buy.",
    whyItMatters: "Most financial tools on FOINWI are rupee tools. If the rupee is only 'the number on the screen', a SIP illustration and a rent budget look like the same kind of fact. They are not. One is a price you may pay tomorrow. The other is a projection under assumptions you typed.",
    keyIdeas: [
      "Exchange, comparison, and storing value are the three everyday jobs of money.",
      "A bank balance is a claim recorded in rupees. It is not a pile of notes with your name on it.",
      "UPI, cash, and a salary credit are different ways of moving the same unit.",
      "What a rupee buys can change. That question belongs to the inflation lesson.",
    ],
    example: "A ₹20 bus ticket and a ₹50 notebook can be compared and paid for in rupees. Barter would need the bus operator to want the notebook.",
    workedIllustration: "A household receives ₹60,000 as a salary credit. The same week it pays ₹18,000 rent by UPI and keeps ₹5,000 in cash for small shops. Nothing in that story created or destroyed value by itself. It moved rupees between the employer, the landlord, the household, and the cash pocket.\n\nThe educational distinction comes next. If the household also types ₹5,000 a month into a compound-interest illustration, that screen is not a third payment. It is a picture of what could happen if a rate and a time period hold. The rupees are real only when a transfer actually happens.",
    assumptions: [
      "The rupee is the unit. No exchange into another currency is required for this lesson.",
      "The salary, rent, and cash figures are one teaching month.",
      "The Reserve Bank of India issues banknotes other than the one-rupee note. The Government of India issues coins and the one-rupee note. This page does not describe monetary policy.",
    ],
    commonMistakes: [
      "Treating every rupee figure on a website as cash already earned.",
      "Ignoring the difference between a price today and a projected price.",
      "Assuming money stored as cash keeps the same purchasing power for a decade.",
    ],
    deeperExplanation: "India's payment system lets a salary, a shop payment, and a mutual-fund debit all settle in rupees. That convenience hides the job you are asking money to do. Rent wants money as a medium of exchange this month. An emergency fund wants it as a store you can reach. A long illustration wants it as a unit you can project.\n\nWhen a later lesson talks about compounding or a loan, come back to this split. Ask whether the rupees have moved, or whether a calculator has only drawn a picture.",
    limitations: [
      "This lesson does not explain inflation statistics, interest, or tax.",
      "It does not describe how banks create deposits.",
      "Foreign currency and the exchange-rate tool are a separate topic.",
    ],
    sources: [
      "Reserve Bank of India (rbi.org.in) for public material on currency and payments.",
      "Your own bank or UPI statement for the transfers that actually occurred.",
    ],
    nextSteps: ["See how rising prices can change what the same rupee balance buys."],
    relatedLessonRefs: ["money-basics/inflation"],
  }),

  "money-basics/inflation": lesson({
    simpleExplanation: "Inflation means a typical basket of goods and services costs more rupees than it did earlier. The same bank balance then covers less of that basket. It is a statement about purchasing power, not a statement that every single price rose by the same amount.",
    whyItMatters: "A goal such as a child's college fee or a parent's medical buffer is a future purchase. If you save only the today's price, you can arrive with the right nominal rupees and the wrong purchasing power. Indian household budgets feel this in rent, school costs, and food even when a salary credit looks unchanged.",
    keyIdeas: [
      "Inflation is about a basket over time, not about one shopkeeper.",
      "A rupee target that ignores prices can be too small for the actual purchase.",
      "An inflation figure in a calculator is an assumption you should be able to name.",
      "FOINWI does not publish India's inflation as a live statistic.",
    ],
    example: "If a monthly grocery list costs more this year than last year, the same ₹8,000 transfer buys a shorter list.",
    workedIllustration: "A teaching basket costs ₹2,000 today. Assume, only for this illustration, that the basket's price rises by six per hundred over one year. The basket then costs ₹2,120. The old ₹2,000 covers about ninety-four per cent of it, which is another way of saying ₹2,000 is no longer the full price.\n\nSix per hundred is not a claim about India's latest price index. It is a round number so the rupee gap of ₹120 is easy to see. FOINWI's inflation calculator lets you replace that assumption with your own. Official price indices are published by the statistical system. Read those if you need the measured series, and do not paste a headline into a 20-year goal without saying you did that.",
    assumptions: [
      "One basket, one year, one constant illustrative rise.",
      "No change in the items inside the basket.",
      "Wages, taxes, and interest are left out on purpose.",
    ],
    commonMistakes: [
      "Using one vegetable's price jump as the inflation rate for a retirement goal.",
      "Treating a calculator's default inflation input as an official forecast.",
      "Forgetting that some prices, such as a loan instalment already contracted, may not move with the basket.",
    ],
    deeperExplanation: "Statisticians build a consumer price index by following a fixed-ish basket and publishing how its cost moves. The basket is not your household. A family that spends heavily on school fees and rent can experience a different change from a family that spends heavily on devices. That is why a personal goal sometimes uses a higher or lower assumption than a national index, as long as the assumption is labeled.\n\nThe investing lesson on real results uses this idea again, after a nominal growth figure exists. This page stops at the basket itself.",
    limitations: [
      "No current index value or forecast is stated.",
      "The six-per-hundred figure must not be reused as India's inflation.",
      "Quality changes and new products make long basket comparisons imperfect.",
    ],
    sources: [
      "Ministry of Statistics and Programme Implementation (mospi.gov.in) for consumer price index releases.",
      "Reserve Bank of India (rbi.org.in) for public commentary on inflation. It is not a personal forecast.",
    ],
    nextSteps: ["Use the basket idea when you set a financial goal in today's prices."],
    relatedLessonRefs: ["money-basics/financial-goals", "investing-fundamentals/inflation-and-real-returns"],
  }),

  "money-basics/compounding": lesson({
    simpleExplanation: "Compounding means the next period's growth is calculated on the original amount plus growth already added. The new part is not a bonus someone promises. It is what the arithmetic does when the balance is allowed to include earlier growth.\n\nThis lesson stays with that arithmetic. The investing lesson on the same word adds time, contributions, and the fact that market values do not follow a smooth curve.",
    whyItMatters: "A fixed deposit, a recurring deposit, and a SIP illustration all get described as 'compounding' in ordinary speech. The contracts differ. Seeing a two-year deposit-style example keeps the word attached to a balance you can recompute by hand.",
    keyIdeas: [
      "Growth in year two includes growth on the first year's growth.",
      "The rate in the example is an assumption, not a deposit rate on offer.",
      "More frequent compounding changes the path slightly. The direction of the idea stays the same.",
      "If the balance can fall, as with a market price, the smooth table does not apply.",
    ],
    example: "Interest credited back into a deposit becomes part of the balance that earns the next period's interest. Interest paid out to a savings account does not.",
    workedIllustration: "Start with ₹10,000. Assume a constant eight per hundred a year, added once at each year-end, and assume nothing is withdrawn.\n\nAfter year one the balance is ₹10,800. The growth is ₹800. After year two the balance is ₹11,664. The growth in year two is ₹864, which is ₹800 on the original ₹10,000 plus ₹64 on the first year's growth. That ₹64 is the part people mean by compounding in this simple case.\n\nEight per hundred is a teaching rate. A bank may offer something else, may compound quarterly, and may deduct tax. FOINWI's compound-interest calculator can change the rate, time, and frequency. It still will not know the tax on your interest.",
    assumptions: [
      "One deposit, no additions, no withdrawals.",
      "The rate is constant and credited yearly.",
      "Tax and penalties are excluded.",
    ],
    commonMistakes: [
      "Multiplying ₹10,000 by eight per hundred and by the number of years, which skips growth on growth.",
      "Expecting a market investment to match this smooth table.",
      "Calling the teaching rate a rate you can get on a deposit this week.",
    ],
    deeperExplanation: "Quarterly compounding would credit a smaller rate four times a year. The year-end balance would be a little different from ₹11,664 after two years. The lesson does not need that extra arithmetic to make the definition true. It needs the definition so that later tools are readable.\n\nWhen a SIP calculator shows a large future value, part of the figure is money you put in and part is the assumed growth. Compounding describes only the growth mechanic. It does not decide whether the assumption was reasonable.",
    limitations: [
      "No deposit scheme, tax rule, or market return is stated.",
      "The table stops at two years so it can be checked by hand.",
      "A loss-making period cannot be represented by this positive table.",
    ],
    sources: [
      "FOINWI's compound-interest calculator for a longer illustration under assumptions you edit.",
      "The deposit confirmation or scheme rules if you are looking at an actual account rather than a lesson.",
    ],
    nextSteps: ["Connect the same idea to a SIP contribution pattern, which adds new money as well as growth."],
    relatedLessonRefs: ["mutual-funds-sip/how-sip-works", "investing-fundamentals/power-of-compounding"],
  }),

  "money-basics/time-value-of-money": lesson({
    simpleExplanation: "A rupee you can use today is not identical to a rupee promised later. Today’s rupee can pay a bill, sit in a deposit, or be invested. Later’s rupee arrives after time has passed, and after prices may have changed. Time value of money is the name for that difference.",
    whyItMatters: "EMI, fixed deposits, and retirement illustrations are the same idea facing opposite directions. A loan asks what stream of future payments matches a sum received now. A deposit asks what a sum today might become later. If those tools feel unrelated, the monthly payment and the maturity value are harder to question.",
    keyIdeas: [
      "Earlier money can be used before later money arrives.",
      "A future rupee is usually discounted when you compare it with cash in hand.",
      "The rate you use for that comparison is an assumption.",
      "Inflation and interest are different reasons a future rupee can feel smaller. They can both matter.",
    ],
    example: "₹10,000 paid to you today can clear a bill today. ₹10,000 promised in three years cannot.",
    workedIllustration: "You will need ₹1,00,000 in three years for a planned expense, in future rupees. Someone offers to give you ₹1,00,000 today instead, with no strings. Those are not equal choices in the opposite direction either: the second amount can be set aside for three years, and the first amount arrives only when the bill is due.\n\nThis lesson does not pick a discount rate or tell you the present value. It asks you to notice that a calculator must be told a rate before it can turn one number into the other. FOINWI's goal planner and compound-interest tool make that rate visible. If the rate box is doing silent work, the result is not 'the' answer. It is the answer at that rate.",
    assumptions: [
      "No credit risk is priced. The promised rupees are assumed to arrive.",
      "No tax is applied.",
      "The example uses equal nominal amounts so the timing is the only difference.",
    ],
    commonMistakes: [
      "Adding money from different years as if the years did not matter.",
      "Using an inflation assumption in one tool and a deposit rate in another, then comparing the outputs as equals.",
      "Treating a lender's EMI quote and your own deposit illustration as two views of one rate.",
    ],
    deeperExplanation: "Suppose a relative offers ₹90,000 today or ₹1,00,000 after three years. You cannot choose from the lesson. You can ask what rate would make those two offers line up, and whether you can actually earn that rate without a risk you dislike. That question is the practical form of time value.\n\nLoans reverse it. The lender gives money now and asks for a stream later. The EMI identity is one way to set that stream. The inflation lesson is the reason a future expense may itself be larger in rupees than the price tag you see today.",
    limitations: [
      "No present-value number is calculated.",
      "Risk, tax, and liquidity are named only as reasons the simple comparison can mislead.",
      "The lesson does not value a business or a property.",
    ],
    sources: [
      "FOINWI's compound-interest and goal-planner calculators, where the rate assumption is visible.",
      "The inflation lesson for the separate effect of rising prices.",
    ],
    nextSteps: ["Name a goal in today's rupees and the year you hope to pay for it."],
    relatedLessonRefs: ["money-basics/inflation", "loans-emi/how-loans-work"],
  }),

  "money-basics/financial-goals": lesson({
    simpleExplanation: "A financial goal names a future use of money and the time available before that use. 'Save more' is a mood. '₹3,00,000 for a two-wheeler in three years' is a goal you can test. Indian households often mix short goals, such as a festival or an insurance premium, with long ones, such as a house down payment or retirement.",
    whyItMatters: "Money needed within a year or two usually cannot sit in a volatile market illustration and still be treated as available. Money needed after many years can tolerate more movement, if the household can leave it alone. The time horizon chooses the kind of question. It does not choose the product.",
    keyIdeas: [
      "A goal needs an amount, or a way to estimate it, and a date.",
      "Short goals, roughly inside three years, and long goals, beyond about seven years, raise different availability questions. The boundaries are teaching labels, not rules.",
      "A goal stated in today's prices may need an inflation assumption.",
      "The goal planner shows a savings path under inputs you type. It does not require you to follow it.",
    ],
    example: "A festival expense next April and a house fund fifteen years away should not be forced into one monthly product just because both are 'savings'.",
    workedIllustration: "Goal: a certificate course costing ₹60,000 in today's fees, needed in two years. The household can set aside ₹2,500 a month. Over 24 months that is ₹60,000 before any growth and before any fee increase.\n\nIf the institute raises the fee, ₹60,000 is no longer enough. If the household spends the pot in month ten, the goal slips. The illustration is deliberately flat, with no interest, so the gap is visible. FOINWI's goal planner can add a growth assumption. Turning the assumption on does not make the fee known in advance and does not make the monthly transfer automatic.",
    assumptions: [
      "The fee is ₹60,000 in today's money and might change.",
      "₹2,500 a month is available without new borrowing.",
      "No investment return is included in the 24-month sum.",
    ],
    commonMistakes: [
      "Saving for a long goal in a place you will raid for short expenses, with no separate pot.",
      "Copying a 15-year return illustration into a two-year goal.",
      "Forgetting an annual premium or school admission that is a goal even though it repeats.",
    ],
    deeperExplanation: "Label three jars, even if they are only columns in a notebook. One jar is bills due inside the year. One is the emergency reserve from the budgeting path. One is a named goal with a date. A SIP, an RD, or a deposit can sit behind a jar. The product is the container. The jar is the purpose.\n\nWhen two goals compete, the date usually tells you which rupees must stay easy to withdraw. A calculator can show a monthly figure for each goal. It cannot know that the same ₹2,500 was promised to both.",
    limitations: [
      "The two-year and seven-year labels are teaching boundaries.",
      "No product is selected.",
      "Inflation is identified as a possible adjustment, not applied in the flat example.",
    ],
    sources: [
      "FOINWI's goal planner for a path that includes a growth assumption you choose.",
      "The inflation lesson if the future price is likely to differ from today's fee.",
    ],
    nextSteps: ["Separate needs, wants, and the monthly transfer before adding another goal."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "money-basics/inflation"],
  }),

  "saving-budgeting/needs-vs-wants": lesson({
    simpleExplanation: "A need is a cost that keeps the household housed, fed, commuting to work, and meeting obligations it has already signed. A want is a cost that can be delayed, reduced, or skipped without immediately breaking those obligations. The line moves. School fees and medicine are needs for many families. A newer phone can be a need for someone's work and a want for someone else.",
    whyItMatters: "Indian city budgets often fail in the 'small' UPI payments: food delivery, auto rides, and subscriptions. Each one looks optional in isolation. Together they can be larger than the SIP the person meant to start. Naming needs and wants is how a budget becomes a choice instead of a guilt list.",
    keyIdeas: [
      "The label depends on the household's obligations, not on a universal shopping list.",
      "A want can be funded after needs, saving, and dues are covered.",
      "Cutting a want does not create an emergency fund by itself. The transfer still has to happen.",
      "A loan instalment you already owe is a need until the contract changes.",
    ],
    example: "Rent and the school fee are hard to skip this month. A weekend meal out can be moved to the home kitchen.",
    workedIllustration: "Monthly take-home ₹50,000. Rent ₹15,000, groceries ₹8,000, commute ₹3,000, school support ₹5,000, and a loan instalment ₹6,000. Those ₹37,000 keep the month's obligations going. The remaining ₹13,000 includes a streaming subscription of ₹500, eating out of ₹4,000, and clothes of ₹2,000.\n\nIf the household wants ₹5,000 to go to savings first, the flexible lines have to shrink by ₹5,000 in total or the savings will be whatever is left, which is often zero. Nothing here says eating out is wrong. It says the rupees have to be assigned before they are spent.",
    assumptions: [
      "One city household and one month.",
      "The loan instalment is already contracted.",
      "No new income arrives mid-month.",
    ],
    commonMistakes: [
      "Calling every pleasant expense a need because it is habitual.",
      "Cutting groceries below what the household actually eats, then spending the 'saving' on delivery.",
      "Ignoring annual needs such as insurance premiums because they are not in this month's UPI list.",
    ],
    deeperExplanation: "A useful test is the consequence of waiting 90 days. If waiting breaks housing, work, health, or a signed repayment, treat it as a need for this exercise. If waiting is uncomfortable, treat it as a want. Some items sit in between, such as a phone repair. Write those in the margin instead of forcing them.\n\nThe next lesson turns the labels into a full month. This one only earns the right to say which lines are negotiable.",
    limitations: [
      "The 90-day test is a learning device, not a definition in law.",
      "Dependents and medical needs can make another household's want into your need.",
      "The illustration does not include tax or festival months.",
    ],
    sources: [
      "A month of bank and UPI history for the lines that actually occurred.",
      "The budget lesson for assigning the remaining rupees.",
    ],
    nextSteps: ["Put the negotiable lines into a one-month plan with a savings transfer."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "saving-budgeting/tracking-expenses"],
  }),

  "saving-budgeting/building-a-monthly-budget": lesson({
    simpleExplanation: "A monthly budget assigns take-home income to categories before the month spends itself. It is a plan for one salary cycle. The 50-30-20 split, half needs, three-tenths wants, two-tenths savings, is one educational framework. It is not a rule, and it does not fit every Indian city rent.",
    whyItMatters: "Rent in a large city can already be more than half of take-home pay. Pretending the framework still 'should' hold makes people ignore a real budget that is less pretty and more useful. The useful version is the one whose lines add up to the salary credit.",
    keyIdeas: [
      "Start from take-home pay, not from CTC.",
      "A framework is a prompt. Your rent can force different shares.",
      "Savings works more reliably as a transfer on salary day than as a leftover.",
      "A budget that ignores annual premiums will break in the month those premiums are due.",
    ],
    example: "If rent is ₹28,000 and take-home pay is ₹50,000, a 'half for needs' slogan cannot describe the month without hiding the rent.",
    workedIllustration: "Take-home ₹60,000. Assign: rent ₹18,000, food ₹12,000, transport ₹4,000, family support ₹6,000, existing EMIs ₹8,000, a savings transfer ₹8,000 on salary day, and ₹4,000 for everything else. The lines add to ₹60,000.\n\nNeeds in this particular month are already ₹48,000 before the flexible ₹4,000. Savings are about thirteen per hundred of take-home, not two-tenths. That is not a failure. It is the arithmetic of this rent and these EMIs. If the family wants a larger savings transfer, one of the other lines has to move, or income has to change. FOINWI does not know which line they can move.",
    assumptions: [
      "One salary credit and no bonus.",
      "The EMI is already committed.",
      "Food includes groceries, not a separate dining line.",
    ],
    commonMistakes: [
      "Budgeting CTC instead of the amount that reaches the bank.",
      "Forcing 50-30-20 when rent makes it impossible, then abandoning the budget.",
      "Leaving savings as 'whatever remains' after UPI spending.",
      "Forgetting insurance premiums and school admissions because they are not monthly.",
    ],
    deeperExplanation: "Build a second tiny list for non-monthly costs. An annual premium of ₹12,000 is ₹1,000 a month if you park it. If you do not, the budget looks fine for eleven months and collapses in one. The parking can be a separate savings account or a recurring deposit. The product matters less than the fact that the rupees are not still in the spending balance.\n\nWhen income is irregular, a monthly budget can use a cautious income, not a high recent month. This lesson uses a salaried example because the credit date is clear.",
    limitations: [
      "The shares are this household's, not a target for every reader.",
      "Tax planning and investment selection are not part of the assignment.",
      "A spouse's income, if any, is not included.",
    ],
    sources: [
      "Bank and UPI statements for a recent month, to replace the teaching numbers.",
      "The emergency-fund lesson for what the savings transfer is for.",
    ],
    nextSteps: ["Decide how many months of essentials the savings transfer is trying to build."],
    relatedLessonRefs: ["saving-budgeting/emergency-funds", "saving-budgeting/tracking-expenses"],
  }),

  "saving-budgeting/emergency-funds": lesson({
    simpleExplanation: "An emergency fund is money you can reach quickly for a surprise expense or a short loss of income. It is not an investment goal and not a down payment. Many educational guides suggest about three to six months of essential expenses. That range is a prompt. A single-income household supporting parents may want more. A person with a secure notice period and low essentials may cope with less.",
    whyItMatters: "Without a separate pot, a medical bill or a delayed salary becomes a credit-card balance or a broken SIP. In India the bill might be a hospital deposit, a bike repair needed for work, or a relative's travel. The fund's job is to take that shock without a new high-cost debt.",
    keyIdeas: [
      "Count essentials, not the full lifestyle, when you size the fund.",
      "The money should be reachable in a few days without a market sale.",
      "A deposit that charges a penalty or locks the money for years is a poor emergency pot.",
      "Three to six months is a common teaching range, not a requirement.",
    ],
    example: "Essentials of ₹30,000 a month point to about ₹90,000 for a three-month buffer and about ₹1,80,000 for six months.",
    workedIllustration: "List essentials: rent ₹15,000, food ₹8,000, utilities and commute ₹4,000, medicine ₹3,000. The total is ₹30,000. School fees, if they must continue during a job gap, belong on the list too. A vacation does not.\n\nThree times ₹30,000 is ₹90,000. If the household already has ₹40,000 in a savings account they will not spend, the gap is ₹50,000. At ₹5,000 from each salary, the gap takes ten months, and only if the pot is not raided. A fixed deposit that can be broken online may be a reasonable container. An equity fund that can drop in the same month as a job loss is a mismatched container for this job.",
    assumptions: [
      "Essentials stay near ₹30,000 during the shock.",
      "The existing ₹40,000 is truly unspent.",
      "No insurance deductible or hospital deposit has been added yet. Those can raise the target.",
    ],
    commonMistakes: [
      "Counting a SIP portfolio as the emergency fund.",
      "Sizing the fund on wants as well as needs, then never starting because the number looks huge.",
      "Keeping the pot in the same account used for UPI, where it gets spent.",
      "Stopping once the account looks round, without checking it still covers three months after rent increased.",
    ],
    deeperExplanation: "Insurance and an emergency fund do different work. Health insurance may pay an eligible hospital bill later, while the hospital asks for a deposit now. The fund covers timing and costs the policy does not. Term insurance does not pay the grocery bill during a job search.\n\nRebuild the fund after you use it. A used fund is the system working, not a failed budget. The next salaries put the transfer back until the pot returns to the size you chose.",
    limitations: [
      "The three-to-six-month range is educational, not personal advice.",
      "No deposit rate is quoted.",
      "Job-loss length and medical costs are unknown. The fund is a buffer, not a complete answer.",
    ],
    sources: [
      "Your essentials list from the budget lesson.",
      "The account terms for any deposit you might use, especially withdrawal rules.",
    ],
    nextSteps: ["Choose a transfer that happens before flexible spending."],
    relatedLessonRefs: ["saving-budgeting/saving-strategies", "saving-budgeting/building-a-monthly-budget"],
  }),

  "saving-budgeting/saving-strategies": lesson({
    simpleExplanation: "A saving strategy is a repeatable way to move money aside before flexible spending uses it. The familiar version is 'pay yourself first': on salary day, transfer a chosen amount to a separate pot, then live on the rest. Automation helps because the decision is made once.",
    whyItMatters: "Waiting until the last day of the month usually means the transfer loses to UPI. Indian salary accounts are busy in the first week with rent, cards, and EMIs. A transfer that leaves with those debits has a better chance than one that depends on leftover willpower.",
    keyIdeas: [
      "The amount should be one you can repeat in an ordinary month.",
      "A separate account or RD makes the pot harder to spend by accident.",
      "Raising the transfer after a salary increase is easier than raising it by cutting a habit you never measured.",
      "A strategy is not a return. The destination still has to match the goal's time horizon.",
    ],
    example: "A standing instruction of ₹4,000 on the salary date moves the money before weekend spending begins.",
    workedIllustration: "Salary credit ₹55,000 on the 1st. Standing instruction ₹4,000 to a second savings account the same day. Rent ECS ₹16,000 on the 2nd. What remains in the spending account is ₹35,000 for the rest of the month's needs and wants.\n\nOver a year the instruction moves ₹48,000 if it runs twelve times. That total is contributions, not growth. If the second account is an RD, the deposit terms decide any interest, and this lesson does not quote a rate. If you skip two months, the year is ₹40,000. The strategy's weakness is skipped months, not the lack of a clever product.",
    assumptions: [
      "The ₹4,000 does not cause a missed rent or EMI.",
      "Twelve months are ordinary months, with no unpaid leave.",
      "Interest is ignored so the habit is visible on its own.",
    ],
    commonMistakes: [
      "Setting an ambitious transfer, reversing it every month, and calling the bank the problem.",
      "Automating a SIP before the emergency pot exists, then selling the SIP at a bad time.",
      "Using the second account for shopping because the debit card was issued automatically.",
    ],
    deeperExplanation: "Match the container to the job. Emergency money wants access. A goal three years away might use an RD or a deposit you will not break casually. A goal fifteen years away might later use a market-linked SIP, after the emergency question is handled. Starting with the product catalogue reverses that order.\n\nA salary increase is a specific moment. If take-home rises by ₹5,000, moving ₹2,000 of the increase into the existing instruction changes the savings rate without a new argument about coffee. It is still your choice.",
    limitations: [
      "No deposit or fund is recommended.",
      "The yearly ₹48,000 assumes every month succeeds.",
      "Irregular income needs a different trigger than the 1st of the month.",
    ],
    sources: [
      "Your bank's standing-instruction or RD terms for the account you actually open.",
      "The emergency-fund lesson for the first job of the transferred money.",
    ],
    nextSteps: ["Track one month so the ₹4,000 is not quietly offset by new spending."],
    relatedLessonRefs: ["saving-budgeting/tracking-expenses", "money-basics/financial-goals"],
  }),

  "saving-budgeting/tracking-expenses": lesson({
    simpleExplanation: "Tracking expenses means writing down where money went, soon enough that you still recognise the payment. A budget is the plan. Tracking is the record. Without the record, the plan cannot be corrected. It can only be repeated.",
    whyItMatters: "UPI makes small payments forgettable. A month of ₹200 and ₹400 transfers can exceed the SIP that felt difficult to start. Categories turn that blur into a few totals you can argue with: food cooked at home, food ordered in, transport, subscriptions, and family transfers.",
    keyIdeas: [
      "A category total is more useful than a perfect diary.",
      "Bank and UPI history already contain most salaried spending.",
      "Cash still needs a note, because it will not appear in the app.",
      "One honest month beats an abandoned system that tried to last a year.",
    ],
    example: "Five food-delivery payments of ₹350 are ₹1,750. They rarely feel like ₹1,750 at the moment of payment.",
    workedIllustration: "Export or scroll one month. Mark each debit as rent, groceries, eating out, transport, subscriptions, EMIs, family, or other. Suppose eating out totals ₹6,200 and subscriptions total ₹1,100. The budget had allowed ₹4,000 for everything flexible.\n\nThe gap is specific. It is not 'I am bad with money'. It is ₹3,300 of eating out and subscriptions above a flexible pot that was already small. Next month can cap eating out at a number you choose, or raise the flexible pot by lowering another line. Tracking did not make the choice. It made the choice about a real total.",
    assumptions: [
      "The month is typical enough to learn from. A wedding month is a poor template.",
      "Refunds are subtracted so a returned order is not counted as spending.",
      "Transfers to your own savings account are not expenses.",
    ],
    commonMistakes: [
      "Tracking only cash and missing UPI.",
      "Counting a transfer to your own RD as spending, then thinking you saved nothing.",
      "Building twelve categories and quitting in week two.",
      "Changing nothing after the totals are visible.",
    ],
    deeperExplanation: "Review on a fixed date, such as the evening before rent leaves. Look at three numbers only: take-home, the savings transfer, and the two largest surprise categories. A longer audit can wait. People abandon tracking when the review is a moral trial rather than a half-hour correction.\n\nIf a category is always over, the budget line was a wish. Rewrite the line or change the habit. Keeping a fictional line makes the next month's plan unbelievable, and unbelievable plans are ignored.",
    limitations: [
      "One month can be distorted by travel or a festival.",
      "The lesson does not value cash income that never entered the account.",
      "Shared family UPI handles can mix two people's spending.",
    ],
    sources: [
      "Your bank and UPI statement for the month you are reviewing.",
      "The budget lesson for the plan those totals should be compared with.",
    ],
    nextSteps: ["Rewrite one budget line that the month proved was unrealistic."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "saving-budgeting/needs-vs-wants"],
  }),

  "investing-fundamentals/risk-and-return": lesson({
    simpleExplanation: "Risk, in this lesson, means the result can differ from the result you pictured. Return means the change in value or the income you receive over a period you name. A fixed deposit can have a contracted rate and still carry the risk that you need the money early or that inflation reduces what the maturity buys. An equity price can rise or fall before you sell.",
    whyItMatters: "Indian savers often meet both products in the same month: an FD suggested at the bank counter and a mutual fund suggested in an app. They are not substitutes just because both are 'for the future'. The emergency fund and a near-term fee belong with money you can reach. A long goal can take more price movement if you can leave it alone.",
    keyIdeas: [
      "A contracted deposit rate and a market price that moves are different kinds of uncertainty.",
      "A higher possible gain usually comes with a wider range of outcomes, including losses.",
      "Past movement is a description of a period, not a forecast.",
      "FOINWI's CAGR tool measures a past or typed path. It does not predict next year.",
    ],
    example: "An FD that pays what the deposit receipt says can still be a poor match for money you are not allowed to lock.",
    workedIllustration: "Put two questions side by side for ₹1,00,000 you will not need for ten years, and ₹1,00,000 you may need for a hospital deposit. The second amount wants a place you can withdraw from. The first amount can be discussed as a market-linked investment only after that withdrawal need is handled.\n\nThis page does not assign a return to either rupee. It refuses the sentence 'equity will beat deposits'. Some periods it has. Some periods a deposit holder slept better and ended ahead. The educational test is whether you can hold through a fall without selling the emergency fund.",
    assumptions: [
      "No rate, index, or fund result is quoted.",
      "The hospital example is a liquidity test, not a medical plan.",
      "Tax on interest or on a sale is not calculated.",
    ],
    commonMistakes: [
      "Comparing an FD rate with a fund's most flattering one-year number from a brochure.",
      "Moving next month's rent into a volatile fund because the last year looked strong.",
      "Treating a calculator's typed return as something the market owes you.",
    ],
    deeperExplanation: "Risk is not a personality quiz result that tells you which fund to buy. It is a description of what can happen to a specific pot. One person can keep the emergency pot in a savings account and also hold an equity SIP for retirement. Those are two risks, not one label called 'moderate'.\n\nWhen you read a factsheet, look for the period, the fall from a peak if it is shown, and the costs. A smooth average can hide a year you would have sold. The performance-review lesson stays on that reading habit.",
    limitations: [
      "No asset is called suitable for a reader.",
      "Credit risk of a bond or a small deposit-taking firm is not scored here.",
      "Inflation's effect on a contracted rate is handled in the real-return lesson.",
    ],
    sources: [
      "Securities and Exchange Board of India (sebi.gov.in) for the public framework around mutual funds and market disclosures.",
      "The deposit receipt or scheme document for any contracted terms you are actually offered.",
    ],
    nextSteps: ["Name the main Indian asset groups before comparing their paperwork."],
    relatedLessonRefs: ["investing-fundamentals/asset-classes-in-india", "investing-fundamentals/inflation-and-real-returns"],
  }),

  "investing-fundamentals/asset-classes-in-india": lesson({
    simpleExplanation: "An asset class is a broad group of holdings that tend to be talked about together: equity, debt, gold, real estate, and cash or deposits. In India, EPF, PPF, and NPS are schemes with their own rules. They are not just nicknames for those groups. A mutual fund can hold equity, debt, or a stated mix. The fund is a vehicle. The asset class is what it holds.",
    whyItMatters: "A salary account, a PPF passbook, a gold loan, and an equity SIP can all be part of one household. If every rupee is in one contract, a problem in that contract becomes a problem for every goal. Spreading money across groups is a way to avoid that single point of failure. It does not remove risk, and it is not a recipe.",
    keyIdeas: [
      "Equity prices can move sharply. Deposit and debt values are usually steadier and can still disappoint after inflation or credit problems.",
      "Gold and property are familiar in Indian families and are not automatically 'safe' or easy to sell in a week.",
      "EPF and PPF follow scheme rules. A mutual fund follows its stated portfolio and market prices.",
      "Owning five funds that all hold the same large shares is not the same as spreading across asset classes.",
    ],
    example: "A PPF account and an equity index fund can both be long-term holdings while behaving differently in a bad share-market year.",
    workedIllustration: "Household pots, as labels only: ₹1,50,000 in a savings account for emergencies, a PPF account for a rule-bound long deposit, and a monthly SIP aimed at a goal fifteen years away. No rupee here is a recommended split.\n\nThe teaching point is the job of each pot. The savings account is for speed. The PPF illustration belongs to the PPF calculator's own assumptions, including its deposit calendar. The SIP belongs to a market price. If all three were instead three equity funds with different names, a market fall would hit the emergency money as well. Read the scheme or fund document to see what you actually hold.",
    assumptions: [
      "The amounts are labels, not a model portfolio.",
      "No expected return is attached to any pot.",
      "Tax treatment of each scheme is not stated.",
    ],
    commonMistakes: [
      "Calling PPF a mutual fund, or calling a debt fund the same thing as an FD.",
      "Buying property you cannot sell quickly and then counting it as the emergency fund.",
      "Collecting overlapping equity funds and believing the collection is diversified.",
    ],
    deeperExplanation: "Debt can mean a bank deposit, a government small-savings scheme, or a debt mutual fund whose price moves when interest rates or credit conditions change. Those are not one product. Equity can mean shares or a fund that holds shares. Gold can mean jewellery, a coin, or a fund. Jewellery includes making charges that a price chart ignores.\n\nUse the groups to ask a question: if this goal's date arrived during a weak share market, which pot would you spend? If the answer is 'the equity pot, because it is the only pot', the emergency lesson is still unfinished.",
    limitations: [
      "No allocation percentage is suggested.",
      "Scheme interest rates and tax rules are not quoted.",
      "Real estate legal checks are outside this lesson.",
    ],
    sources: [
      "The scheme or fund document for what that holding actually contains.",
      "SEBI (sebi.gov.in) for the mutual-fund disclosure framework, and the PPF or EPF authority for those schemes.",
    ],
    nextSteps: ["See why a smooth compounding table and a market path are different stories."],
    relatedLessonRefs: ["investing-fundamentals/risk-and-return", "investing-fundamentals/power-of-compounding"],
  }),

  "investing-fundamentals/power-of-compounding": lesson({
    simpleExplanation: "Time changes a compounding illustration because the same assumed rate has more years to apply. This is the long-horizon companion to the money-basics lesson, which stopped at a two-year deposit table you can check by hand. Here the point is the gap between a short period and a longer one, and the warning that a market path is not that smooth table.",
    whyItMatters: "Starting earlier is often discussed in Indian SIP conversations. The arithmetic can favour a longer period when the assumed rate stays positive and you do not withdraw. That is not a promise that an early investor will finish ahead. A bad sequence of market returns, or stopping contributions, can overwhelm a neat curve.",
    keyIdeas: [
      "More years of a positive assumed rate produce a larger balance in a smooth model.",
      "The model breaks if the rate is not earned or if you withdraw.",
      "Contributions you add later are not the same as growth on money already there.",
      "A SIP calculator is this model plus a contribution pattern. The rate box is still an assumption.",
    ],
    example: "₹10,000 left in a smooth eight-per-hundred illustration for ten years ends higher than the same ₹10,000 left for five years. The market may not cooperate.",
    workedIllustration: "Assume a constant eight per hundred a year, compounded once a year, with no additions and no tax. ₹10,000 for five years becomes about ₹14,693. The same ₹10,000 for ten years becomes about ₹21,589.\n\nThe extra five years are not 'free money from the government'. They are five more applications of an assumption that may be wrong. If the holding is an equity fund, the path can fall in year six and the ₹21,589 figure never appears. Use FOINWI's compound-interest or SIP calculator to change the rate and see how sensitive the picture is. Do not treat eight per hundred as a fund's future result.",
    assumptions: [
      "One starting amount, yearly compounding, no contributions, no tax.",
      "The rate stays at eight per hundred every year, which is the strong and unrealistic part.",
      "Figures are rounded to the nearest rupee from that identity.",
    ],
    commonMistakes: [
      "Quoting the ten-year figure as something a mutual fund will deliver.",
      "Ignoring that the five-year investor might have added new savings the early investor already spent.",
      "Stopping a long SIP in a fall and keeping only the memory of the smooth chart.",
    ],
    deeperExplanation: "The money-basics table showed ₹64 of growth-on-growth in year two. Stretching the same identity to ten years makes that effect larger, which is why posters love it. Posters rarely show the year the balance fell. A useful personal check is to rerun the calculator at a lower rate and at a shorter period you could actually leave untouched.\n\nIf two siblings invest the same monthly amount, the one who starts earlier has more contributions as well as more years. Do not give the early start all the credit for a gap that is partly extra money contributed.",
    limitations: [
      "Eight per hundred is a teaching assumption, not a market or deposit rate.",
      "The illustration has no SIP contributions. A SIP tool is required for that pattern.",
      "Inflation is not deducted. The real-return lesson does that job.",
    ],
    sources: [
      "FOINWI's compound-interest calculator to vary the rate and years.",
      "The money-basics compounding lesson for the two-year hand check.",
    ],
    nextSteps: ["Ask what the same growth is worth after a rise in prices."],
    relatedLessonRefs: ["money-basics/compounding", "investing-fundamentals/inflation-and-real-returns"],
  }),

  "investing-fundamentals/inflation-and-real-returns": lesson({
    simpleExplanation: "A nominal result is the rupee change before thinking about prices. A real result asks what that change can buy after inflation. Subtracting an inflation assumption from a nominal assumption is a classroom shortcut. The closer identity divides one growth factor by the other.",
    whyItMatters: "A deposit or a fund can show a gain in rupees while a household's basket has become more expensive. Indian goals such as higher education or a later rent are basket problems. A calculator that only grows the investment, and never grows the goal, can look more comforting than the purchase will feel.",
    keyIdeas: [
      "Nominal and real answer different questions.",
      "Subtraction is an approximation. The ratio of growth factors is the cleaner teaching identity.",
      "Both the return and the inflation number are assumptions unless you are measuring a finished period.",
      "A finished period still does not forecast the next period.",
    ],
    example: "A balance that rises while school fees rise faster can buy less schooling than the rupee gain suggests.",
    workedIllustration: "Assume a nominal gain of eight per hundred and an inflation assumption of six per hundred, both for one year, both illustrative. Subtraction suggests about two per hundred left. The cleaner identity is 1.08 divided by 1.06, minus one, which is about 1.9 per hundred, not two.\n\nThe gap between the shortcut and the identity is small in this pair of numbers and can be larger when the rates are larger. Neither number is India's inflation or a fund's return. If your goal is ₹2,000 of today's basket, the inflation lesson already turned a six-per-hundred year into a ₹2,120 basket. Grow the goal and the investment with assumptions you can say out loud.",
    assumptions: [
      "One year, two constant assumptions, no tax.",
      "The basket and the investment are both hit by the same illustrative inflation, which may be false for a real household.",
      "Rounding to 'about 1.9 per hundred' is enough for the comparison with subtraction.",
    ],
    commonMistakes: [
      "Calling an FD receipt a real gain without asking about prices.",
      "Using subtraction for a long period and treating it as exact.",
      "Taking a website's inflation box as a forecast because it was prefilled.",
    ],
    deeperExplanation: "Tax can reduce the nominal gain before inflation is even considered. This lesson leaves tax out so the price effect is visible. On a real deposit, interest may be taxable. On a fund, the tax depends on the product and the holding period, which this page will not summarise as a rule.\n\nWhen you use FOINWI's inflation calculator and a growth calculator side by side, write the two assumptions on paper. If they came from different decades or different brochures, the comparison is messy even when both screens look precise.",
    limitations: [
      "No current inflation rate or real-return league table is stated.",
      "Tax is identified and not calculated.",
      "Personal baskets can diverge from any national index.",
    ],
    sources: [
      "MOSPI (mospi.gov.in) if you need a published price index rather than an assumption.",
      "FOINWI's inflation and CAGR calculators for illustrations you label yourself.",
    ],
    nextSteps: ["Only after the emergency pot exists, look at how a first market investment is even opened."],
    relatedLessonRefs: ["money-basics/inflation", "money-basics/financial-goals"],
  }),

  "investing-fundamentals/getting-started-with-investing": lesson({
    simpleExplanation: "Getting started is the sequence, not a product list. First know which goal the money serves and when you will need it. Then keep a reachable emergency pot. Then, for money you can leave for the goal's horizon, learn what a mutual fund, PPF, or deposit actually does. KYC and a bank account are administrative steps. They are not a reason to buy the first fund on a screen.",
    whyItMatters: "App prompts in India often start at the fund, not at the goal. A first salary is a common moment. So is a bonus. The educational risk is investing money that was meant for rent or for a parent's hospital deposit, then selling during a fall because the money was needed after all.",
    keyIdeas: [
      "A goal and a date come before a product.",
      "Emergency money stays reachable.",
      "A deposit, PPF, and a mutual fund solve different jobs.",
      "An illustration with a typed return is not a plan you must obey.",
    ],
    example: "Opening an investment account does not require you to place next month's rent in an equity fund the same day.",
    workedIllustration: "A new earner can set aside ₹3,000 a month. For the first months, that ₹3,000 builds the emergency pot in a savings account until it covers a few months of essentials. Only the amount above that pot is a candidate for a longer product.\n\nIf they then try a SIP, they type their own assumed return into FOINWI's SIP calculator and read the contribution total separately from the growth total. They can also look at PPF if they want a long, rule-bound deposit instead of a market price. This lesson does not split the ₹3,000 between those products. It says the emergency job is unfinished while the pot is still zero.",
    assumptions: [
      "₹3,000 can be transferred without missing essentials.",
      "No employer stock or bonus is included.",
      "KYC is mentioned only as administration.",
    ],
    commonMistakes: [
      "Starting three SIPs before one month of expenses is set aside.",
      "Choosing a fund because an app ranked it.",
      "Using a ten-year illustration for money needed in a year.",
      "Skipping the scheme document because the button said continue.",
    ],
    deeperExplanation: "PPF has annual deposit rules and a long maturity. A deposit has a stated tenor. A mutual fund has a price that moves and an exit load or tax that the factsheet and the tax rules describe. Learning those shapes is the start. A large first instalment is not required for the learning.\n\nIf a parent is pushing a traditional insurance policy as a first investment, separate the protection question from the savings question. The insurance lessons do that. A policy can be the wrong container for a goal even when the salesperson calls the premium an investment.",
    limitations: [
      "No fund, deposit, or PPF deposit amount is recommended.",
      "Account-opening steps change and are not listed click by click.",
      "Tax-saving deadlines are not a reason, by themselves, to pick a product.",
    ],
    sources: [
      "The fund's scheme document or the deposit terms before any money moves.",
      "The emergency-fund and mutual-fund lessons for the two jobs people most often mix up.",
    ],
    nextSteps: ["Read what a mutual fund is before using a SIP illustration as a plan."],
    relatedLessonRefs: ["mutual-funds-sip/what-are-mutual-funds", "mutual-funds-sip/how-sip-works"],
  }),

  "mutual-funds-sip/what-are-mutual-funds": lesson({
    simpleExplanation: "A mutual fund pools money from many people and invests it according to a stated objective. You own units. The price per unit is the NAV. In India, funds are offered in direct and regular plans. A regular plan includes a distributor cost. A direct plan does not. The underlying portfolio can be the same while the costs differ.",
    whyItMatters: "The word 'mutual fund' is not an asset class and not a promise of growth. An equity fund, a debt fund, and a liquid fund can all be mutual funds. Buying one because a relative said 'mutual funds are good' skips the portfolio, the cost, and the time you can leave the money invested.",
    keyIdeas: [
      "The scheme document says what the fund is allowed to hold.",
      "NAV is a price. It moves. It is not a return by itself.",
      "Direct and regular plans are a cost distinction, not two different levels of safety.",
      "A fund is not a deposit. The value can fall.",
    ],
    example: "Two plans can hold the same shares while the regular plan's extra cost leaves a smaller balance over a long period, all else equal.",
    workedIllustration: "Suppose a fund's NAV is ₹20. An investment of ₹2,000 buys 100 units if there is no transaction charge in the example. If the NAV later is ₹18, the holding is worth ₹1,800. If it is ₹23, the holding is worth ₹2,300. Neither number was promised when the units were bought.\n\nThe illustration ignores exit load, tax, and the direct-versus-regular cost so the unit arithmetic stays visible. Those costs are real on an actual order. Read them on the scheme page before comparing a friend's NAV story with yours. SEBI's framework requires disclosures. The disclosure does not choose the fund.",
    assumptions: [
      "One purchase, one NAV, no stamp duty or load.",
      "The portfolio is not analysed.",
      "₹20, ₹18, and ₹23 are teaching prices.",
    ],
    commonMistakes: [
      "Treating a fund category ranking as a forecast.",
      "Assuming a debt fund cannot fall in price.",
      "Ignoring the plan type and then comparing returns that were not like for like.",
      "Counting employer talk about 'the market' as a reason to skip the scheme document.",
    ],
    deeperExplanation: "Index funds aim to follow an index. Active funds aim to choose securities. Either can be equity or, in other categories, something else. The educational distinction is the objective written down, not the adjective in an advertisement.\n\nDividends or IDCW payouts, if a scheme offers them, reduce the money left inside the fund. They are not extra return on top of an unchanged NAV. This lesson does not recommend a payout option. It warns you not to double-count.",
    limitations: [
      "No scheme is named or compared.",
      "Tax, exit load, and stamp duty are excluded from the unit example.",
      "The lesson does not explain how to open a demat or folio step by step.",
    ],
    sources: [
      "The scheme information document for the fund you are reading.",
      "SEBI (sebi.gov.in) for the regulatory framework around mutual fund disclosures.",
    ],
    nextSteps: ["See how a monthly purchase buys a different number of units when the NAV changes."],
    relatedLessonRefs: ["mutual-funds-sip/how-sip-works", "investing-fundamentals/asset-classes-in-india"],
  }),

  "mutual-funds-sip/how-sip-works": lesson({
    simpleExplanation: "A SIP is a pattern of putting a chosen amount into a fund at regular intervals, often every month. It is not a separate product with a promised result. Each date buys units at that date's NAV. When the NAV is lower, the same rupees buy more units. When it is higher, they buy fewer.",
    whyItMatters: "SIPs are widely offered to first-job earners in India. The useful part is the habit of investing a fixed rupee amount through different prices. The misleading part is a calculator that turns that habit into one smooth future value. The future value appears only if the return you typed is what actually happens.",
    keyIdeas: [
      "A SIP is a timetable of purchases.",
      "Unit count changes when NAV changes. Rupees invested do not, if you keep the instalment constant.",
      "An assumed return in a calculator is an illustration.",
      "Stopping, skipping, or changing the amount is allowed by the pattern. It changes the result.",
    ],
    example: "The same ₹2,000 buys 100 units at a NAV of ₹20 and 80 units at a NAV of ₹25.",
    workedIllustration: "Month one: ₹2,000 at NAV ₹20 buys 100 units. Month two: ₹2,000 at NAV ₹25 buys 80 units. Total invested ₹4,000. Total units 180. The average cost is ₹4,000 divided by 180, about ₹22.22 a unit.\n\nThat average is a description of these two purchases. It is not a profit. Profit or loss appears only when you compare a later NAV with that cost, after costs and tax. If you had invested ₹4,000 entirely at NAV ₹25, you would hold fewer units. That does not prove the SIP will finish ahead of a lumpsum. It proves the unit count depends on the prices on the purchase dates. FOINWI's SIP calculator adds an assumed growth rate on top of a contribution pattern. Read the rate before you read the big number.",
    assumptions: [
      "Two purchases, no exit load, no dividend, no tax.",
      "The instalment stays at ₹2,000.",
      "NAVs of ₹20 and ₹25 are chosen so the units divide cleanly.",
    ],
    commonMistakes: [
      "Treating the calculator's maturity figure as the SIP's contractual value.",
      "Believing a SIP removes the chance of loss.",
      "Forgetting that a skipped month is a skipped purchase, not a pause that the fund 'makes up'.",
    ],
    deeperExplanation: "Rupee-cost averaging is the name for buying more units when the price is down and fewer when it is up, given a fixed rupee instalment. It is a mechanical effect. It is not a reason the investment must end profitably. A long fall can mean you accumulated many units that are still worth less than you paid.\n\nUse the lumpsum lesson when you have a single amount instead of a timetable. Use the CAGR lesson when you want to describe a finished path as one annualised figure.",
    limitations: [
      "Two months are not a full SIP experience.",
      "No fund expense or exit load is deducted.",
      "The average cost is not a forecast of NAV.",
    ],
    sources: [
      "Your fund statement for the actual units and NAV on each SIP date.",
      "FOINWI's SIP calculator for a longer illustration under a return you type.",
    ],
    nextSteps: ["Compare that timetable with putting the whole amount in on one date."],
    relatedLessonRefs: ["mutual-funds-sip/lumpsum-vs-sip", "investing-fundamentals/risk-and-return"],
  }),

  "mutual-funds-sip/lumpsum-vs-sip": lesson({
    simpleExplanation: "A lumpsum is one contribution on one date. A SIP is many contributions over time. With the same total rupees, they buy units at different prices if the NAV moves. Neither pattern is the right pattern for every goal. The date you will need the money, and whether you already have the cash, matter more than a slogan.",
    whyItMatters: "A bonus, a maturity from a deposit, or a gift arrives as a lumpsum. A salary can fund a SIP. People often ask which one 'wins'. The honest answer is that the winner depends on the path of the NAV after the purchases, which you do not know when you choose.",
    keyIdeas: [
      "Same total money can mean different unit counts.",
      "A lumpsum is exposed to the price on one day for the whole amount.",
      "A SIP spreads the purchase dates and also delays some of the money.",
      "A calculator can illustrate both. It cannot tell you which path the market will reward.",
    ],
    example: "₹24,000 invested on day one is a different set of purchase prices from ₹2,000 a month for twelve months, even though both totals are ₹24,000.",
    workedIllustration: "Use the two-month unit example as a miniature. A lumpsum of ₹4,000 at NAV ₹25 buys 160 units. The two SIP purchases bought 180 units because one of them happened at NAV ₹20. If the later NAV is ₹25, the SIP units are worth ₹4,500 and the lumpsum units are worth ₹4,000, before costs. If the later NAV is ₹18, the SIP units are worth ₹3,240 and the lumpsum units are worth ₹2,880. In both imagined endings the SIP has more units, so it is ahead, but only because one purchase caught the lower NAV.\n\nChange the story so both SIP dates are expensive and the lumpsum date was the cheap one, and the ranking flips. The lesson's point is the flip, not a winner. FOINWI's lumpsum and SIP calculators let you type a rate. They do not replay your fund's future NAV.",
    assumptions: [
      "Costs and tax are ignored, so the ranking is about units and NAV only.",
      "The NAVs are invented so the arithmetic is easy to audit.",
      "Twelve-month behaviour is not claimed from a two-purchase sketch.",
    ],
    commonMistakes: [
      "Waiting forever for a perfect lumpsum day and never investing money that was meant to be long term.",
      "Starting a SIP with money needed in six months.",
      "Declaring a winner from one past year of one fund.",
    ],
    deeperExplanation: "There is a hybrid people actually use: invest a lumpsum you already hold in parts over several months, sometimes called a transfer. That is still a series of purchase dates. It reduces the chance that one unlucky day takes the whole amount, and it also means some money sits out of the market while you wait. Whether that trade appeals is a preference. It is not a formula with a known advantage.\n\nMatch the pattern to cash flow. Salary favours a SIP because the cash arrives monthly. A deposit maturity favours a decision about a lumpsum because the cash has already arrived.",
    limitations: [
      "The numerical ranking is only for the NAVs written above.",
      "No fund category is preferred.",
      "Exit load and tax can erase a small unit advantage.",
    ],
    sources: [
      "FOINWI's SIP and lumpsum calculators for rate-based illustrations, separate from this NAV sketch.",
      "The scheme document for the minimum SIP and lumpsum amounts, which vary by scheme.",
    ],
    nextSteps: ["Learn how a finished path can be summarised as one annualised figure."],
    relatedLessonRefs: ["mutual-funds-sip/how-sip-works", "mutual-funds-sip/understanding-cagr"],
  }),

  "mutual-funds-sip/understanding-cagr": lesson({
    simpleExplanation: "CAGR is the constant yearly rate that links a starting value to an ending value over a stated number of years. It smooths the path into one figure. It does not show the drops along the way, and it says nothing by itself about the next year.",
    whyItMatters: "Fund screens in India lead with one-year, three-year, and five-year CAGR figures. Those periods can rank funds differently. Reading CAGR as 'the return I will get' is the mistake. Reading it as 'the smooth annual rate that would connect these two dates' is the skill.",
    keyIdeas: [
      "CAGR needs a start value, an end value, and a time span.",
      "A smooth rate can hide a large fall in the middle.",
      "Two funds are comparable only when the period and the type of return match.",
      "FOINWI's CAGR calculator computes this link. It does not forecast.",
    ],
    example: "A value that goes from ₹100 to ₹121 in two years has a CAGR of ten per hundred a year, because 1.10 times 1.10 is 1.21.",
    workedIllustration: "Start ₹100. End ₹121. Time two years. The growth factor is 1.21. The yearly factor is the square root of 1.21, which is 1.10. Subtract one and the CAGR is ten per hundred a year.\n\nNow imagine the hidden path: ₹100 fell to ₹70 in year one and then rose to ₹121 in year two. The CAGR between the endpoints is still ten per hundred a year. An investor who sold at ₹70 never received that CAGR. This is why a single badge on a fund page is incomplete. Ask what happened inside the period, and do not paste the badge into FOINWI's SIP calculator as if it were next decade's rate.",
    assumptions: [
      "The ₹100 and ₹121 path is constructed so the square root is exact.",
      "No cash flows occur between the start and the end. Real SIPs have cash flows, so a simple CAGR on a SIP account needs care.",
      "Costs are already inside the ending value if you are looking at a published fund figure. This lesson's numbers are made up.",
    ],
    commonMistakes: [
      "Comparing a one-year CAGR with a five-year CAGR as if both were the same kind of promise.",
      "Using a CAGR that includes a lucky endpoint.",
      "Forgetting that your own SIP has many purchase dates, so the fund's point-to-point CAGR is not your personal result.",
    ],
    deeperExplanation: "With contributions along the way, people use other measures because a single start and end value ignores the dates money was added. You do not need the formula in this lesson. You need the warning: the number on the fund and the number on your statement can differ for a fair reason.\n\nA negative period has a negative CAGR. Screens that only advertise positive periods are showing a selection. The review lesson is about asking for the missing periods.",
    limitations: [
      "The lesson computes one constructed example, not a live fund.",
      "It does not adjust for inflation or tax.",
      "It is not a method for predicting a SIP maturity.",
    ],
    sources: [
      "The fund factsheet for any CAGR it publishes, including the dates.",
      "FOINWI's CAGR calculator to link a start and end value you type.",
    ],
    nextSteps: ["Ask what else, besides one CAGR, belongs in a review."],
    relatedLessonRefs: ["investing-fundamentals/risk-and-return", "mutual-funds-sip/reviewing-fund-performance"],
  }),

  "mutual-funds-sip/reviewing-fund-performance": lesson({
    simpleExplanation: "Reviewing a fund means reading a period in context. Look at the dates, the category, a relevant comparison index or benchmark if one is stated, the costs, and how severe the declines were. A recent strong number is one fact. It is not a summary of the fund.",
    whyItMatters: "Many Indian investors switch funds every year toward whatever topped a chart. The switch can reset a holding period, trigger tax or an exit load, and replace one unknown future with another. A review can also be a reason to stay, if the fund still matches the goal and the fall is one you can live with.",
    keyIdeas: [
      "Match the period to the goal's horizon.",
      "Compare like with like: category, plan type, and dates.",
      "Costs and the stated objective sit beside the return number.",
      "Your SIP result can differ from the fund's point-to-point figure.",
    ],
    example: "A one-year number can look strong because the end date was a rally, while a five-year number that includes a crash tells a different story.",
    workedIllustration: "Take a goal that is twelve years away and a factsheet that leads with a one-year figure. The one-year figure describes a period much shorter than the goal. Write down, from the same document, the longer periods it actually shows and the benchmark it names. If the document shows a large fall, decide whether you would have sold. That decision is about your emergency fund and your time, not about finding a replacement fund the same afternoon.\n\nThis lesson invents no fund's return. If a page will not show a long period or a benchmark, that absence is itself information. FOINWI does not rank funds.",
    assumptions: [
      "The reader can see a real factsheet. This page does not supply one.",
      "Tax and exit load are flags to check, not numbers computed here.",
      "The goal date is long enough that a one-year badge is obviously incomplete.",
    ],
    commonMistakes: [
      "Switching because of one year, without reading the cost of leaving.",
      "Comparing a regular plan's past result with a direct plan's chart.",
      "Treating FOINWI's CAGR tool as a fund rating.",
      "Reviewing only when markets are rising.",
    ],
    deeperExplanation: "A simple annual habit is enough. On a chosen date, read the goal, the fund objective, the cost, and one long period. If the objective changed or you needed the money sooner, the holding may no longer match. If nothing changed except a noisy year, constant switching is activity rather than a review.\n\nKeep the emergency pot outside this review. A fall in the fund is a poor moment to discover that the fund was the emergency pot.",
    limitations: [
      "No fund is graded.",
      "Benchmark choice can be debated. The lesson only says to notice whether one is shown.",
      "Past periods remain past.",
    ],
    sources: [
      "The scheme factsheet and statement for the periods, benchmark, and costs.",
      "SEBI disclosure material (sebi.gov.in) for what mutual fund documents are expected to contain.",
    ],
    nextSteps: ["Return to risk and the asset-class labels if the fund no longer matches the job you gave it."],
    relatedLessonRefs: ["mutual-funds-sip/understanding-cagr", "investing-fundamentals/risk-and-return"],
  }),

  "insurance-planning/why-insurance-matters": lesson({
    simpleExplanation: "Insurance is a contract that transfers a defined financial risk to an insurer in exchange for a premium. The insurer's promise is written in the policy. It is not a general promise to replace every loss. In India, insurers and many insurance products are regulated by the Insurance Regulatory and Development Authority of India. Regulation does not mean every policy fits every household.",
    whyItMatters: "A hospital admission or the death of an earning parent can cost more than a year of savings. A budget can handle a broken phone. It often cannot handle a large medical bill or the loss of the salary that paid the rent. Insurance is how households ask a contract to take some of that large, uncertain cost. It is not a substitute for an emergency fund, and a premium is not an investment return.",
    keyIdeas: [
      "The policy wording decides the event, the exclusions, and the limit.",
      "A premium is the price of that contract.",
      "Protection and saving are different jobs even when one sales conversation mixes them.",
      "An emergency fund covers timing and smaller shocks. Insurance is for the larger defined risks.",
    ],
    example: "A policy may pay for a listed hospitalisation and still exclude a condition, a waiting period, or a room category. The exclusion is part of the contract.",
    workedIllustration: "A household keeps ₹90,000 as an emergency pot and also pays a health-insurance premium. A planned dental cost might be paid from the pot or from income, depending on the policy. A large eligible hospital bill is the kind of event the policy was bought to address, subject to its limit and exclusions.\n\nIf they cancel the policy and call the ₹90,000 'enough insurance', the pot is being asked to do both jobs. ₹90,000 may not be a large hospital bill. This lesson does not price a policy and does not say the household must buy a particular one. It separates the jobs.",
    assumptions: [
      "The ₹90,000 pot is the emergency-fund illustration from the budgeting path, not a recommended cover.",
      "No disease, hospital, or insurer is named.",
      "Claim settlement is assumed to follow the contract, which real disputes can test.",
    ],
    commonMistakes: [
      "Buying a savings-linked policy because it was described as compulsory protection.",
      "Assuming a regulator's existence means the claim will be paid in full.",
      "Dropping the emergency fund because a premium is being paid.",
      "Ignoring exclusions until the week of a claim.",
    ],
    deeperExplanation: "Employers in India often provide some health cover that ends when the job ends. That cover can be useful and still be incomplete for parents or for a job change. Term life and health policies answer different events. One is about income that stops because the insured person dies during the term. The other is about medical costs described in the health contract.\n\nRead the free-look period and the grace period in the document you are offered. Those are contract features, not a recommendation to sign.",
    limitations: [
      "No cover amount, insurer, or premium is suggested.",
      "Claim rules and tax treatment of premiums are not stated as law.",
      "The IRDAI reference is to the regulator's role, not an endorsement of a product.",
    ],
    sources: [
      "IRDAI (irdai.gov.in) for public information on insurance regulation.",
      "The policy wording for exclusions, limits, and claim documents.",
    ],
    nextSteps: ["Separate a term-life contract from a policy that also tries to be an investment."],
    relatedLessonRefs: ["insurance-planning/term-life-insurance", "insurance-planning/health-insurance"],
  }),

  "insurance-planning/term-life-insurance": lesson({
    simpleExplanation: "Term life insurance pays a stated death benefit if the insured person dies during the chosen term, subject to the policy conditions. A pure term contract does not aim to return a maturity value. The premium pays for the cover during the term. If the person survives the term, a pure term policy typically ends without a savings balance.",
    whyItMatters: "Families in India are often offered endowment or other savings-linked policies in the same conversation as protection. Those contracts can cost more for the same death benefit because part of the premium is doing a different job. Seeing the split helps a household buy protection as protection, and do its saving in a savings tool it understands.",
    keyIdeas: [
      "The death benefit, the term, the premium, and the exclusions are the core terms.",
      "A premium is not an investment return.",
      "A nominee is the person named to receive the benefit. Naming a nominee is not the same as financial planning for dependants.",
      "Employer cover can end when the job ends.",
    ],
    example: "A policy with a death benefit and no maturity value is doing a different job from a policy that advertises a survival payout.",
    workedIllustration: "A household depends on one salary of ₹60,000 a month and has a home-loan balance. The educational question is: if that salary stopped because the earner died during a stated term, which costs would remain? Rent or the loan, school fees, and living costs are the list. A term policy is one contract that can name a death benefit for that event.\n\nThis page does not turn the salary into a required cover amount. Some classrooms mention a multiple of annual income. A multiple is a prompt that ignores existing savings, the loan, and other earners. Use it only as a question, then read a real quote and the exclusions. FOINWI's goal planner can hold a savings goal. It does not price a term premium.",
    assumptions: [
      "The contract described is pure term cover, not every product called 'life insurance'.",
      "The salary and loan are a scene, not a computed sum assured.",
      "Claim conditions are met in the story, which a real claim must still prove.",
    ],
    commonMistakes: [
      "Choosing a policy because the premium is small, without reading exclusions and the term end date.",
      "Treating a savings-linked policy's illustration as both full protection and a deposit rate.",
      "Forgetting to update the nominee after marriage or a child's birth.",
      "Letting employer cover be the only cover, then changing jobs.",
    ],
    deeperExplanation: "Riders, such as an add-on for a stated illness or disability, change the contract and the premium. They are optional extras with their own definitions. This lesson does not say to add or refuse them.\n\nA household with no dependants and no co-signed loan has a different protection question from a household with young children. The difference is the consequence of the lost income, not a moral ranking. Write the consequence down before comparing premiums.",
    limitations: [
      "No sum assured, insurer, or premium quote is given.",
      "Tax treatment of premiums and benefits is not stated.",
      "Underwriting, medical tests, and claim repudiation rules are policy-specific.",
    ],
    sources: [
      "The policy wording and benefit illustration for any contract you are offered.",
      "IRDAI (irdai.gov.in) for consumer information on life insurance.",
    ],
    nextSteps: ["Look at health cover as a different event from the death benefit."],
    relatedLessonRefs: ["insurance-planning/evaluating-coverage-needs", "insurance-planning/why-insurance-matters"],
  }),

  "insurance-planning/health-insurance": lesson({
    simpleExplanation: "Health insurance can pay eligible medical costs up to the policy's limit, after its conditions. The useful reading list is the sum insured, the waiting periods, the exclusions, the room-rent or procedure limits, and whether a cashless facility exists at hospitals you could actually use. A policy does not mean every bill is paid.",
    whyItMatters: "Hospital bills in India are often due before an insurer finishes a review. Families use an emergency fund or a deposit to bridge that gap. Employer group cover may be the only policy a salaried person has, and it may not include parents or may end with the job. Knowing those edges is more useful than a slogan about being covered.",
    keyIdeas: [
      "Sum insured is a ceiling, not an estimate of your future bill.",
      "Waiting periods and permanent exclusions can apply even after you have paid the premium.",
      "A sub-limit can cap a cheaper room or a procedure below the headline sum.",
      "Cashless is a payment convenience at network hospitals. It is not a promise that the claim is eligible.",
    ],
    example: "A policy with a large headline sum can still cap the room category. Choosing a more expensive room can change what gets paid.",
    workedIllustration: "A person has employer cover of ₹3,00,000 that ends if they resign, and no separate policy. A planned surgery is estimated by the hospital at ₹2,40,000, of which they do not yet know the eligible part. The educational steps are: read whether the employer policy covers that surgery, ask what deposit the hospital wants before admission, and compare that deposit with the emergency pot.\n\nThe ₹2,40,000 figure is the hospital's estimate in this story, not a claim result. A separate policy, if they buy one, may not cover the same surgery during a waiting period. This lesson does not say which policy to buy. It says the headline sum and the waiting period have to be read together.",
    assumptions: [
      "The employer cover and the surgery cost are a scene for reading a contract.",
      "No insurer is recommended.",
      "Parents and maternity, which many policies treat specially, are not ruled on here.",
    ],
    commonMistakes: [
      "Assuming employer cover includes parents or continues after resignation.",
      "Ignoring a waiting period for an existing condition.",
      "Choosing only on the premium and the headline sum.",
      "Cancelling a policy after one healthy year because 'it paid nothing'.",
    ],
    deeperExplanation: "Top-up or super top-up contracts sit on top of a threshold. They are not the same as raising the base sum, and the deductible wording matters. Family floaters share one sum across people. A large claim by one person can use the sum the others were counting on.\n\nRenewal terms matter because a lapse can bring waiting periods back. Put the renewal date next to the annual-premium line in the budget so it is not a surprise.",
    limitations: [
      "No product, sum, or hospital is recommended.",
      "The lesson does not interpret a real policy clause.",
      "Tax deductions sometimes linked to health premiums are not calculated.",
    ],
    sources: [
      "The policy schedule and wording for limits, waiting periods, and network hospitals.",
      "IRDAI (irdai.gov.in) for consumer guidance on health insurance.",
    ],
    nextSteps: ["Turn the household's risks into questions rather than a single cover number."],
    relatedLessonRefs: ["insurance-planning/evaluating-coverage-needs", "insurance-planning/why-insurance-matters"],
  }),

  "insurance-planning/evaluating-coverage-needs": lesson({
    simpleExplanation: "Evaluating coverage needs means listing the people who rely on an income, the debts that would remain, the medical costs that could arrive, and the cover or savings that already exist. The output is a set of questions for a policy document and for your budget. It is not a personal sum assured.",
    whyItMatters: "A single number from a social-media rule ignores a working spouse, a paid-off loan, or a parent who is not a dependant. Indian households also mix employer cover, an old savings-linked policy, and a new term quote. Listing them prevents buying a second contract for a risk the first one already covers, or assuming a risk is covered when it is not.",
    keyIdeas: [
      "Dependants, debts, and existing cover are the three lists.",
      "Employer benefits can be real and temporary.",
      "A multiple of income is only a prompt. It is not FOINWI's recommendation.",
      "Protection has to fit the same monthly budget as saving.",
    ],
    example: "A home loan with a co-borrower is a different gap from a home loan that only one income can service.",
    workedIllustration: "Write three columns. Column one: people who would lose income or unpaid care if a named adult died or were hospitalised. Column two: balances, such as a home loan of ₹20,00,000 in this example. Column three: cover already in force, such as employer health cover of ₹3,00,000 that ends with the job, and any term policy already owned.\n\nThe gap is a question: which of these costs would remain unpaid? A salesperson's multiple of salary does not answer it. A term quote and a health-policy schedule might. FOINWI's goal planner can show a savings path for a named goal. It does not calculate a human-life value, and this lesson will not invent one.",
    assumptions: [
      "The loan and employer-cover figures are carried from earlier illustrations so the lists connect.",
      "No probability of illness or death is estimated.",
      "Both spouses' incomes, if they exist, belong in column one rather than being ignored.",
    ],
    commonMistakes: [
      "Insuring a child heavily and leaving the earning parent with little term cover.",
      "Counting a savings-linked policy's death benefit without reading how small it is relative to the loan.",
      "Buying cover the budget will cancel next year.",
      "Treating a rule-of-thumb multiple as a measured need.",
    ],
    deeperExplanation: "After the lists, return to the monthly budget. A premium that displaces the emergency transfer or the loan instalment has created a new problem. It may still be worth paying. The point is to see the displacement on paper.\n\nReview the lists after marriage, a child, a new loan, or a job change. Those events change columns one to three. A policy bought for a previous life can be too small or pointed at the wrong risk.",
    limitations: [
      "No cover amount is calculated.",
      "Legal nomination and succession rules are not explained.",
      "The lesson does not say a household is underinsured or overinsured.",
    ],
    sources: [
      "Existing policy schedules and the loan statement for columns two and three.",
      "IRDAI consumer material (irdai.gov.in) if you want the regulator's public guidance before you speak to an insurer.",
    ],
    nextSteps: ["Return to the monthly budget and see whether the premium has a line of its own."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "insurance-planning/term-life-insurance"],
  }),

  "retirement-planning/retirement-corpus-basics": lesson({
    simpleExplanation: "A retirement corpus is money set aside so that spending can continue when work income falls or stops. The size people talk about depends on future spending, how long the spending might last, inflation, and what the money earns meanwhile. Change any one of those and the picture changes. A single target is an illustration, not a destiny.",
    whyItMatters: "In India, retirement may include EPF, NPS, a pension from an employer, family support, and personal investments at the same time. Looking only at a SIP maturity ignores the schemes already running. Looking only at EPF ignores inflation and the costs EPF was never meant to itemise, such as rent in a city where you may or may not own a home.",
    keyIdeas: [
      "Today's monthly spending is not automatically the future monthly spending.",
      "A corpus estimate is only as stable as its inflation, lifespan, and return assumptions.",
      "Existing EPF or NPS balances belong in the inventory before a new gap is declared.",
      "FOINWI's retirement calculator is an educational projection from inputs you type.",
    ],
    example: "A household that wants ₹40,000 a month in today's prices is describing a basket, not a corpus.",
    workedIllustration: "Start with ₹40,000 a month of today's essential retirement spending. If you assume prices rise by six per hundred for one year, that month's basket costs about ₹42,400 next year. This is the inflation lesson applied to one month. It is not a required corpus.\n\nTo turn a basket into a corpus you would also assume how many years the spending lasts and what the invested balance earns. Those assumptions do a lot of quiet work. Type them into the retirement calculator and change one at a time. If the result moves sharply, the sharp movement is the lesson. Six per hundred is not a forecast of inflation in your retirement.",
    assumptions: [
      "₹40,000 is today's basket for this illustration.",
      "One year of the inflation identity is shown. A multi-decade corpus is not computed here.",
      "EPF, NPS, and family support are named as inventory items, not valued.",
    ],
    commonMistakes: [
      "Inflating the investment illustration and forgetting to inflate the spending.",
      "Treating a calculator corpus as the amount a person must accumulate.",
      "Ignoring a spouse's separate EPF or pension.",
      "Planning as if work income stops on one birthday for every career.",
    ],
    deeperExplanation: "Owning a home can remove rent from the future basket and can also hide repair costs. A parent who might live with children has a different basket from a parent who will pay city rent. Those are personal facts. The calculator cannot see them unless you put them into the spending input.\n\nHealth costs are the line that most often breaks a smooth retirement spreadsheet. The health-insurance lesson is the contract side. The emergency fund is the cash side. A corpus that assumes medical costs are zero is an incomplete story even when the arithmetic is tidy.",
    limitations: [
      "No target corpus is stated.",
      "Lifespan, health inflation, and post-retirement tax are not modelled in this lesson.",
      "The one-year basket update must not be multiplied casually across 30 years without a stated assumption.",
    ],
    sources: [
      "FOINWI's retirement and inflation calculators for projections you can edit.",
      "The EPF and NPS lessons for schemes that may already be part of the inventory.",
    ],
    nextSteps: ["See what an EPF balance is, and what the calculator on this site does not copy from a passbook."],
    relatedLessonRefs: ["retirement-planning/epf-and-employer-benefits", "retirement-planning/planning-your-retirement-timeline"],
  }),

  "retirement-planning/epf-and-employer-benefits": lesson({
    simpleExplanation: "The Employees' Provident Fund is a retirement-related scheme for eligible salaried employees, administered through the EPFO framework. Contributions and interest follow rules and notifications that can change. Many employees also hear about the Employees' Pension Scheme and about gratuity. Those are related employment benefits with different formulas. They are not three names for one balance.",
    whyItMatters: "A payslip may show a provident-fund deduction that the employee never chose, plus an employer line that is part of CTC. People plan a retirement gap without opening the passbook, or they treat the passbook as spendable cash. Knowing which document is the balance, and which FOINWI screen is only an illustration, prevents both mistakes.",
    keyIdeas: [
      "Eligibility and wage treatment are statutory questions. This lesson does not restate a contribution percentage or a wage ceiling.",
      "FOINWI's EPF calculator illustrates one standard, already-enrolled membership pattern. It is not your passbook.",
      "The interest assumption used on that calculator is disclosed on the calculator. It can differ from a later notified rate.",
      "Gratuity, when it applies, is a separate estimate with its own rules.",
    ],
    example: "An employer contribution inside CTC is not the same figure as the employee's passbook balance, and neither figure is a full retirement plan.",
    workedIllustration: "Open a payslip and circle two lines: the employee's provident-fund deduction and any employer contribution shown. Then open the passbook or member portal, which is the balance record. FOINWI's calculator will not match that passbook unless the membership, wages, and rate path happen to match the calculator's narrow assumptions.\n\nThis lesson deliberately does not say what percentage is deducted. Contribution rates, wage ceilings, and interest notifications should be read from EPFO or the payslip for the month in question. Adding a number here would pretend those notifications cannot change.",
    assumptions: [
      "The reader may be in EPF, or may be outside it. Both are possible.",
      "The calculator's scope is the one already written on the EPF tool.",
      "No withdrawal tax is calculated.",
    ],
    commonMistakes: [
      "Planning as though every worker in India has EPF.",
      "Withdrawing the balance for a non-emergency want and assuming it will be rebuilt without cost.",
      "Adding gratuity, EPF, and NPS into one pot without noticing the different rules.",
      "Copying a colleague's employer contribution when the wage structures differ.",
    ],
    deeperExplanation: "Some establishments and some employees are outside the default pattern the calculator describes. A higher-wage arrangement, a voluntary top-up, or a new joiner who is not in the pension scheme can fall outside that pattern. The calculator page says so. If your payslip does not look like the story the calculator tells, trust the passbook and the official material, not the illustration.\n\nGratuity depends on eligibility and length of service. Use the gratuity calculator only with its own notes. Do not add a gratuity guess to an EPF illustration and call the sum a retirement corpus.",
    limitations: [
      "No contribution rate, interest rate, or withdrawal rule is stated.",
      "The lesson does not say a withdrawal will be tax-free.",
      "Employer pensions outside EPF are not described.",
    ],
    sources: [
      "Employees' Provident Fund Organisation (epfindia.gov.in) and your passbook for the figures that apply to you.",
      "FOINWI's EPF and gratuity calculators for what those specific illustrations include.",
    ],
    nextSteps: ["Contrast EPF with NPS, which is market-linked and not the same kind of balance."],
    relatedLessonRefs: ["retirement-planning/nps-overview", "retirement-planning/retirement-corpus-basics"],
  }),

  "retirement-planning/nps-overview": lesson({
    simpleExplanation: "The National Pension System is a retirement scheme in which the value of the savings can move with the market. It is not a bank deposit, and the growth assumption in an illustration is not a contracted deposit return. Rules differ for government employees and for other subscribers, and they differ again at exit. FOINWI's NPS calculator illustrates one non-Government All Citizen normal-exit case. It does not compute tax.",
    whyItMatters: "NPS is often introduced at a workplace or on a tax-saving checklist. Those entry points skip the exit structure. A person can contribute for years and only then read that part of the corpus may have to be used in a way the contributor did not expect, under the rules for that subscriber and that corpus. This lesson does not state those shares. It tells you where the question sits.",
    keyIdeas: [
      "The outcome is market-linked. An illustration is not a pension promise.",
      "Subscriber type and the exit path change the rules.",
      "FOINWI's screen covers one educational case and excludes tax.",
      "A contribution that also appears in a tax conversation is still a retirement contribution with a lock-in character. Read the actual exit rules.",
    ],
    example: "Two people can both say they 'have NPS' and be in different subscriber categories with different exit rules.",
    workedIllustration: "Suppose a subscriber types a monthly contribution and an illustrative market-linked return into FOINWI's NPS calculator, within the All Citizen normal-exit case the tool describes. The screen can show a projected corpus under those typed assumptions. It cannot show the tax on exit, and it cannot show every government employee's service rules.\n\nIf a brochure then converts part of that corpus into a monthly pension using a rate the brochure chose, that second step is another assumption. Do not import it into the FOINWI result. The tool's own notes are the boundary. PFRDA publishes the scheme framework. This page does not restate exit percentages that the owner still needs to verify against that framework.",
    assumptions: [
      "The reader is looking at FOINWI's stated All Citizen illustration, not every NPS case.",
      "The return typed into the tool is illustrative and market-linked.",
      "Tax is outside the calculator and outside this lesson.",
    ],
    commonMistakes: [
      "Describing the NPS illustration as deposit interest.",
      "Assuming every subscriber exits under the same annuity requirement.",
      "Treating a tax-saving conversation as proof that the exit will not be taxed.",
      "Using one calculator for a government employee and a private-sector subscriber without reading the label.",
    ],
    deeperExplanation: "NPS sits beside EPF for some employees and instead of it for others. Adding the two illustrations together double-counts if the same contribution was typed twice. Use the payslip to see what is actually deducted.\n\nBecause the value is market-linked, a statement balance can fall. That is a different experience from a provident-fund passbook that credits a notified rate. The asset-class lesson is the right companion: NPS is not 'the safe one' or 'the growth one' until you know which asset mix the subscriber actually selected.",
    limitations: [
      "No exit share, annuity rate, or tax treatment is stated.",
      "Charges inside NPS are not itemised here.",
      "The lesson does not say whether a person should join.",
    ],
    sources: [
      "Pension Fund Regulatory and Development Authority (pfrda.org.in) for the scheme framework.",
      "FOINWI's NPS calculator notes for the single case that screen illustrates.",
    ],
    nextSteps: ["See how regular withdrawals from an investment corpus differ from a pension contract."],
    relatedLessonRefs: ["retirement-planning/swp-for-retirement-income", "retirement-planning/epf-and-employer-benefits"],
  }),

  "retirement-planning/swp-for-retirement-income": lesson({
    simpleExplanation: "A systematic withdrawal plan is a pattern of taking a chosen amount out of a mutual-fund corpus at regular intervals. It is not a pension from the government or from an employer, and it is not a promise that the corpus will last. What remains depends on the withdrawals, the market values, the costs, and the taxes along the way.",
    whyItMatters: "Retirees in India sometimes want a monthly credit that feels like a salary. An SWP can be built to look like that credit. If the fund falls or the withdrawal is large relative to the corpus, the balance can shrink faster than a smooth illustration showed. Understanding that mechanism matters before a corpus is treated as a salary replacement.",
    keyIdeas: [
      "The withdrawal is chosen. The fund's future value is not.",
      "A constant-return illustration ignores bad years early in retirement.",
      "FOINWI's SWP calculator excludes taxes, exit loads, and inflation-adjusted withdrawals unless its notes say otherwise.",
      "A pension contract and an SWP are different promises.",
    ],
    example: "Taking ₹5,000 from a corpus without any market movement reduces the corpus by ₹5,000. A market move can add or subtract more.",
    workedIllustration: "Start with ₹10,00,000. Withdraw ₹5,000 at a moment when the market value has not changed and no cost is charged. The remaining value is ₹9,95,000. That is arithmetic, not a forecast.\n\nIf the fund then falls by a large amount, the next ₹5,000 comes out of a smaller balance. A smooth calculator that assumes a steady positive return will not show that sequence. FOINWI's SWP page is explicit that its constant-return picture excludes taxes, loads, and sequence-of-returns effects. Use it to see the steady case. Do not use it as evidence that a retirement salary has been secured.",
    assumptions: [
      "The first withdrawal happens before any market change and with no charge.",
      "₹5,000 and ₹10,00,000 are teaching figures.",
      "Inflation is not applied to the withdrawal in this step.",
    ],
    commonMistakes: [
      "Setting the withdrawal from a rosy return and never testing a flat or negative year.",
      "Calling an SWP a pension.",
      "Ignoring tax and exit load because the illustration left them out.",
      "Withdrawing so much that the emergency role of cash is destroyed.",
    ],
    deeperExplanation: "Sequence risk is the idea that poor returns early, while you are withdrawing, can damage a corpus more than the same poor returns later. You do not need a simulation to respect the idea. You need a withdrawal small enough that a bad year does not force you to sell everything, and a cash buffer so a bad year does not dictate the withdrawal.\n\nSome people keep one or two years of withdrawals in a steadier pot and let the rest stay invested. That is a design choice with its own costs. It is not calculated here.",
    limitations: [
      "No safe withdrawal rate is stated.",
      "The lesson does not model a fund's actual NAV path.",
      "Tax on redemptions is identified and not computed.",
    ],
    sources: [
      "FOINWI's SWP calculator notes for the constant-return limits.",
      "The fund statement for the units and value you would actually redeem.",
    ],
    nextSteps: ["Put the withdrawal idea on a timeline you can revisit when income or prices change."],
    relatedLessonRefs: ["retirement-planning/retirement-corpus-basics", "retirement-planning/planning-your-retirement-timeline"],
  }),

  "retirement-planning/planning-your-retirement-timeline": lesson({
    simpleExplanation: "A retirement timeline is a sequence of dates: when contributions can start, when they might rise with income, when work income may fall, and when you will review the assumptions. It is a calendar for decisions you can revisit. It is not a prediction that life will follow the calendar.",
    whyItMatters: "A 25-year illustration feels precise and is easy to forget. Indian careers include job changes, parental responsibilities, and breaks. A timeline with review dates survives those events better than a single corpus number saved in a screenshot. Each review can use the same calculators with new inputs instead of defending the old screenshot.",
    keyIdeas: [
      "Separate the contribution years from the withdrawal years.",
      "A review date is part of the plan. Once a decade is a long silence.",
      "Inflation and return assumptions should be reread, not memorised.",
      "Existing EPF, NPS, and personal investments are inputs, not decorations.",
    ],
    example: "A person who reviews the inputs after a salary change is using the timeline. A person who only looks at the original screenshot is not.",
    workedIllustration: "Suppose work income might continue for 20 years and the household can contribute ₹8,000 a month now. Put a review on the calendar in one year, not in twenty. At that review, check four things: the emergency fund, any EPF or NPS statement, the retirement calculator's spending input in today's prices, and whether ₹8,000 still fits the budget.\n\nIf the spending input should be ₹40,000 in today's prices, reread the corpus lesson before inflating it. If a job change pauses NPS, the timeline notes the pause instead of assuming the old contribution silently continued. FOINWI's goal planner can hold a nearer goal that competes with the ₹8,000. The timeline is where that competition becomes visible.",
    assumptions: [
      "Twenty years and ₹8,000 are a scene, not a required savings rate.",
      "The one-year review is a habit, not a product feature that stores your data.",
      "No career is assumed to be uninterrupted.",
    ],
    commonMistakes: [
      "Letting a calculator screenshot replace an annual look at the actual statements.",
      "Raising a retirement contribution by cutting the emergency fund to zero.",
      "Forgetting a spouse's timeline and planning as a single unbroken salary.",
      "Treating the first return assumption as something that must not be edited.",
    ],
    deeperExplanation: "A practical one-page timeline has only five rows: emergency fund, near goal, retirement contribution, insurance renewal, and the next review date. Everything else is optional detail. Calculators sit behind the rows that need arithmetic. The insurance and budget lessons sit behind the rows that are contracts and cash flow.\n\nWhen the review date arrives, change one assumption and notice the movement. If you change the return, the inflation, and the spending all at once, you will not know which edit mattered. The educational value of the timeline is that the edits stay separable.",
    limitations: [
      "No retirement age is called normal.",
      "The page does not store a personal plan.",
      "Health, inheritance, and annuity purchase decisions are outside the five rows.",
    ],
    sources: [
      "Your EPF, NPS, or investment statements at the review date.",
      "FOINWI's retirement calculator and goal planner for fresh illustrations, plus the inflation and goal lessons for the inputs.",
    ],
    nextSteps: ["Revisit what inflation does to a basket before the next time you edit a retirement input."],
    relatedLessonRefs: ["money-basics/financial-goals", "money-basics/inflation"],
  }),
});
