export const FINANCIAL_JOURNEYS = [
  {
    slug: "buy-dream-home",
    icon: "🏠",
    title: "Buy Your Dream Home",
    description: "Plan down payment, loan eligibility, EMI comfort, and long-term affordability.",
    duration: "4–6 weeks",
    heroSubtitle:
      "Move from browsing listings to a clear home-buying plan with loan, savings, and affordability checks.",
    overview:
      "Buying a home in India means balancing property cost, down payment savings, home loan EMI, registration charges, and future cash flow. This mission helps you estimate what you can afford, how much to save before applying, and whether the EMI fits your income comfortably.",
    calculators: [
      { title: "Home Loan Eligibility", path: "/home-loan-eligibility-calculator", desc: "Explore an illustrative income-based loan-affordability estimate." },
      { title: "EMI Calculator", path: "/emi-calculator", desc: "See monthly EMI across loan amount, rate, and tenure." },
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan your down payment target with a monthly savings path." },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator", desc: "Understand how prepayments can reduce interest over time." },
    ],
    learningModules: [
      "How home loan eligibility is assessed in India",
      "Cash a buyer still needs before borrowing",
      "Fixed vs floating interest rates for home loans",
      "What one prepayment changes on a loan",
    ],
    aiPreview:
      "Soon, FOINWI AI will help compare property budget, EMI stress, and down payment timelines in plain language — educational guidance only.",
    checklist: [
      "Estimate total property budget including registration and interiors",
      "Calculate required down payment and monthly savings needed",
      "Explore an illustrative home-loan affordability estimate against current income",
      "Stress-test EMI at higher interest rates",
      "Review emergency fund before committing to a long loan",
    ],
    nextStep: {
      title: "Check your home loan eligibility",
      text: "Start with the Home Loan Eligibility Calculator to explore an illustrative borrowing range before you shortlist properties.",
      path: "/home-loan-eligibility-calculator",
      cta: "Open Eligibility Calculator →",
    },
    timeline: [
      { title: "Set property budget", detail: "Define total cost range including taxes and setup expenses." },
      { title: "Plan down payment", detail: "Use Goal Planner to map monthly savings toward your target." },
      { title: "Check loan eligibility", detail: "Compare an illustrative loan amount with income and obligations." },
      { title: "Compare EMI scenarios", detail: "Test tenure and rate combinations for comfortable repayment." },
      { title: "Prepare to apply", detail: "Organise documents, credit profile, and emergency buffer." },
    ],
  },
  {
    slug: "build-wealth",
    icon: "📈",
    title: "Build Wealth",
    description: "Grow long-term wealth with SIP, lumpsum planning, and disciplined investing.",
    duration: "Ongoing · 12+ months",
    heroSubtitle:
      "Build a structured path from first investment to long-term compounding with the right calculators and habits.",
    overview:
      "Wealth building is less about timing the market and more about consistent investing, realistic return assumptions, and staying invested through market cycles. This mission covers SIP planning, lumpsum decisions, CAGR understanding, and goal-linked investing for Indian savers.",
    calculators: [
      { title: "SIP Calculator", path: "/sip-calculator", desc: "Project wealth from regular monthly investments." },
      { title: "Lumpsum Calculator", path: "/lumpsum-calculator", desc: "Estimate growth from a one-time investment." },
      { title: "CAGR Calculator", path: "/cagr-calculator", desc: "Measure annualised returns across periods." },
      { title: "Goal Planner", path: "/goal-planner", desc: "Link investments to a specific wealth target." },
    ],
    learningModules: [
      "Power of compounding and rupee-cost averaging",
      "SIP vs lumpsum — when each approach fits",
      "Equity, debt, and hybrid funds for Indian investors",
      "Rebalancing and reviewing your portfolio annually",
    ],
    aiPreview:
      "Soon, FOINWI AI will explain SIP projections, compare investment scenarios, and highlight gaps toward your wealth goals.",
    checklist: [
      "Define a clear wealth target and time horizon",
      "Estimate monthly SIP needed for your goal",
      "Understand expected CAGR vs guaranteed returns",
      "Set up an emergency fund separate from investments",
      "Review asset allocation at least once a year",
    ],
    nextStep: {
      title: "Start with your SIP projection",
      text: "Use the SIP Calculator to see how regular investing can grow over 10–20 years with disciplined contributions.",
      path: "/sip-calculator",
      cta: "Open SIP Calculator →",
    },
    timeline: [
      { title: "Define wealth goal", detail: "Set a target corpus and investment timeline." },
      { title: "Estimate monthly SIP", detail: "Calculate required contribution for your goal." },
      { title: "Compare return scenarios", detail: "Use CAGR and lumpsum tools for realistic planning." },
      { title: "Build investing discipline", detail: "Automate SIPs and track progress quarterly." },
      { title: "Review and rebalance", detail: "Adjust contributions as income and goals evolve." },
    ],
  },
  {
    slug: "save-tax",
    icon: "💰",
    title: "Save Tax",
    description: "Understand salary tax, HRA, deductions, and regime choices for Indian earners.",
    duration: "2–4 weeks",
    heroSubtitle:
      "Navigate Old vs New tax regime, HRA exemption, and common deductions with clarity — not confusion.",
    overview:
      "A salaried tax estimate depends on the year, the regime, the income entered, and any deductions that regime allows. This mission walks through those inputs on the income-tax, HRA, GST, and PPF calculators. It does not file a return or choose a regime for you.",
    calculators: [
      { title: "Income Tax Calculator", path: "/income-tax-calculator", desc: "Compare Old and New regime tax estimates." },
      { title: "HRA Calculator", path: "/hra-calculator", desc: "Explore an educational monthly HRA exemption estimate for FY 2026-27." },
      { title: "GST Calculator", path: "/gst-calculator", desc: "Estimate GST arithmetic for a visitor-entered applicable rate." },
      { title: "PPF Calculator", path: "/ppf-calculator", desc: "Explore an illustrative PPF accumulation estimate." },
    ],
    learningModules: [
      "How two tax-regime illustrations differ",
      "How a named deduction appears in an estimate",
      "HRA exemption under Rule 279 for FY 2026-27",
      "How a salary estimate differs from take-home pay",
    ],
    aiPreview:
      "Soon, FOINWI AI will help explain tax calculator results, regime trade-offs, and deduction concepts in simple language.",
    checklist: [
      "Collect salary structure, rent receipts, and investment proofs",
      "Compare Old vs New regime estimated tax",
      "Explore an illustrative monthly HRA exemption if you have opted out of the default tax regime",
      "Review 80C and health insurance deductions",
      "Plan investments before the financial year ends",
    ],
    nextStep: {
      title: "Compare your tax regimes",
      text: "Run the Income Tax Calculator with your salary and deductions to see which regime may save more.",
      path: "/income-tax-calculator",
      cta: "Open Tax Calculator →",
    },
    timeline: [
      { title: "Gather income details", detail: "Salary, bonus, other income, and existing deductions." },
      { title: "Compare tax regimes", detail: "Estimate liability under Old and New regime." },
      { title: "Review deductions", detail: "Look at HRA, 80C, 80D, and NPS only where that regime asks for them." },
      { title: "Plan year-end actions", detail: "List investments and proofs before the year shown on the calculator." },
      { title: "Prepare for filing", detail: "Use the estimates to organise papers. The estimates are not a filed return." },
    ],
  },
  {
    slug: "child-education",
    icon: "👶",
    title: "Child Education",
    description: "Plan school, college, and study-abroad costs with inflation-aware savings.",
    duration: "6–12 months to start",
    heroSubtitle:
      "Put a date and a monthly contribution next to an education target, then read the gap the calculators show.",
    overview:
      "School, college, and study-abroad bills can differ from today's fees by the time they arrive. This mission helps you enter a target, a date, and a monthly contribution, then read the illustrated gap. It does not forecast a fee or an investment result.",
    calculators: [
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan education corpus with target date and amount." },
      { title: "SIP Calculator", path: "/sip-calculator", desc: "Estimate monthly savings needed for the goal." },
      { title: "Inflation Calculator", path: "/inflation-calculator", desc: "See how inflation affects future education costs." },
      { title: "PPF Calculator", path: "/ppf-calculator", desc: "Explore an illustrative PPF accumulation estimate." },
    ],
    learningModules: [
      "How a typed inflation rate changes an amount",
      "How a monthly investment differs from a deposit",
      "Keeping an education target separate from retirement",
      "Why insurance is a different question from the savings target",
    ],
    aiPreview:
      "Soon, FOINWI AI will help estimate education gaps, explain inflation impact, and suggest planning steps for parents.",
    checklist: [
      "Estimate current and future education costs with inflation",
      "Define target year for school or college funding",
      "Calculate monthly SIP required for the corpus",
      "Separate education fund from household expenses",
      "Review plan when fees or timeline changes",
    ],
    nextStep: {
      title: "Plan your education goal",
      text: "Use the Goal Planner with an inflation-adjusted target to see how much to save each month.",
      path: "/goal-planner",
      cta: "Open Goal Planner →",
    },
    timeline: [
      { title: "Estimate future fees", detail: "Apply inflation to today's education costs." },
      { title: "Set target date", detail: "Align savings timeline with school or college entry." },
      { title: "Calculate monthly SIP", detail: "Find the contribution needed to reach the corpus." },
      { title: "Choose saving instruments", detail: "Balance growth, safety, and tax efficiency." },
      { title: "Review annually", detail: "Update targets as fees and goals change." },
    ],
  },
  {
    slug: "buy-your-car",
    icon: "🚗",
    title: "Buy Your Car",
    description: "Compare car loan EMI, down payment, and total ownership cost before you buy.",
    duration: "2–3 weeks",
    heroSubtitle:
      "From on-road price to monthly EMI — plan a car purchase that fits your budget without strain.",
    overview:
      "A car purchase involves on-road price, down payment, loan EMI, insurance, fuel, and maintenance. This mission helps you estimate affordable loan terms, compare tenure options, and avoid overextending monthly cash flow for a vehicle.",
    calculators: [
      { title: "EMI Calculator", path: "/emi-calculator", desc: "Calculate car loan EMI across amounts and tenures." },
      { title: "Goal Planner", path: "/goal-planner", desc: "Save for down payment before taking a loan." },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator", desc: "See interest saved by early loan closure." },
      { title: "Compound Interest", path: "/compound-interest-calculator", desc: "Compare saving vs borrowing for the purchase." },
    ],
    learningModules: [
      "What a loan illustration leaves out of a vehicle price",
      "Why a new or used label does not change the EMI formula",
      "How an instalment sits beside other monthly costs",
      "Why a rupee now and a rupee later differ",
    ],
    aiPreview:
      "Soon, FOINWI AI will help compare car loan EMI options and explain affordability in simple terms.",
    checklist: [
      "Confirm on-road price including insurance and registration",
      "Decide down payment amount and savings timeline",
      "Calculate EMI for preferred loan tenure",
      "Ensure EMI fits within 15–20% of monthly income",
      "Budget for fuel, service, and insurance renewals",
    ],
    nextStep: {
      title: "Calculate your car loan EMI",
      text: "Enter expected loan amount and tenure in the EMI Calculator to find a comfortable monthly payment.",
      path: "/emi-calculator",
      cta: "Open EMI Calculator →",
    },
    timeline: [
      { title: "Set car budget", detail: "Include on-road price and ownership costs." },
      { title: "Plan down payment", detail: "Save upfront to reduce loan burden." },
      { title: "Compare EMI options", detail: "Test 3, 5, and 7-year tenure scenarios." },
      { title: "Check affordability", detail: "Ensure EMI leaves room for other goals." },
      { title: "Finalise loan terms", detail: "Compare bank offers before booking." },
    ],
  },
  {
    slug: "retirement-planning",
    icon: "👴",
    title: "Retirement Planning",
    description: "Explore illustrative retirement-corpus, EPF/NPS growth, and withdrawal ideas after retirement.",
    duration: "4–8 weeks",
    heroSubtitle:
      "Explore how inflation, illustrated retirement years, and post-retirement income assumptions can change a planning sketch.",
    overview:
      "Retirement planning in India often combines EPF, NPS, PPF, mutual funds, and other savings. This mission helps you explore an illustrative corpus estimate, project existing benefits, and review an illustrative monthly contribution against a modelled funding gap.",
    calculators: [
      { title: "Retirement Calculator", path: "/retirement-calculator", desc: "Explore an illustrative retirement-duration corpus estimate." },
      { title: "EPF Calculator", path: "/epf-calculator", desc: "Project Employee Provident Fund growth." },
      { title: "NPS Calculator", path: "/nps-calculator", desc: "Explore an educational NPS accumulation and normal-exit illustration." },
      { title: "SWP Calculator", path: "/swp-calculator", desc: "Plan systematic withdrawals from retirement corpus." },
    ],
    learningModules: [
      "How a retirement corpus estimate can be illustrated",
      "EPF, NPS, and PPF roles in retirement planning",
      "Inflation impact on post-retirement expenses",
      "How a systematic withdrawal differs from a pension",
    ],
    aiPreview:
      "Soon, FOINWI AI will help explain retirement gaps, inflation impact, and savings direction for long-term planning.",
    checklist: [
      "Estimate monthly expenses needed after retirement",
      "Project EPF, NPS, and existing investments",
      "Calculate inflation-adjusted retirement corpus",
      "Identify an illustrative monthly contribution against a modelled funding gap",
      "Review plan every 2–3 years or after major life changes",
    ],
    nextStep: {
      title: "Estimate your retirement corpus",
      text: "Start with the Retirement Calculator to explore an illustrative corpus, the projected value of current savings, and an illustrative monthly contribution.",
      path: "/retirement-calculator",
      cta: "Open Retirement Calculator →",
    },
    timeline: [
      { title: "Define retirement age", detail: "Set target age and expected lifestyle costs." },
      { title: "Project existing benefits", detail: "Include EPF, NPS, and current investments." },
      { title: "Calculate corpus gap", detail: "Compare the illustrated corpus with projected existing savings." },
      { title: "Plan monthly contributions", detail: "Set SIP or NPS contributions to close the gap." },
      { title: "Plan withdrawal strategy", detail: "Use SWP concepts for post-retirement income." },
    ],
  },
  {
    slug: "become-debt-free",
    icon: "💳",
    title: "Become Debt Free",
    description: "Map outstanding loans, prepayment impact, and a clear path to zero debt.",
    duration: "3–6 months",
    heroSubtitle:
      "Understand your total debt burden and create a practical plan to reduce interest and become debt-free faster.",
    overview:
      "Managing multiple loans — home, car, personal, or credit — requires knowing total EMI outflow, interest cost, and prepayment benefits. This mission helps prioritise high-interest debt, plan prepayments, and restore financial flexibility.",
    calculators: [
      { title: "EMI Calculator", path: "/emi-calculator", desc: "Break down EMI into principal and interest." },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator", desc: "See interest saved from partial or full prepayment." },
      { title: "Compound Interest", path: "/compound-interest-calculator", desc: "Compare cost of debt vs investment returns." },
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan targeted savings for loan closure." },
    ],
    learningModules: [
      "How a lesson discusses repayment order",
      "Payoff method names this page does not define",
      "What an extra principal payment changes",
      "Listing balances, without a credit score",
    ],
    aiPreview:
      "Soon, FOINWI AI will help compare loan scenarios, prepayment trade-offs, and debt-free timelines.",
    checklist: [
      "List all outstanding loans with interest rates",
      "Calculate total monthly EMI outflow",
      "Identify highest-interest debt to tackle first",
      "Simulate prepayment impact on interest saved",
      "Build emergency fund to avoid new debt cycles",
    ],
    nextStep: {
      title: "See prepayment savings",
      text: "Use the Loan Prepayment Calculator to find how much interest you can save with extra payments.",
      path: "/loan-prepayment-calculator",
      cta: "Open Prepayment Calculator →",
    },
    timeline: [
      { title: "Audit all debts", detail: "List balances, rates, and remaining tenure." },
      { title: "Prioritise repayment", detail: "Focus on high-interest or small-balance loans first." },
      { title: "Simulate prepayments", detail: "Calculate interest saved from extra payments." },
      { title: "Cut new borrowing", detail: "Pause non-essential loans until burden reduces." },
      { title: "Celebrate debt-free milestone", detail: "Redirect former EMI amounts toward savings." },
    ],
  },
  {
    slug: "protect-your-family",
    icon: "🛡",
    title: "Protect Your Family",
    description: "Plan term cover, health buffer, and emergency funds for financial security.",
    duration: "3–4 weeks",
    heroSubtitle:
      "Separate term cover, health cover, and a cash reserve before treating one policy as a complete plan.",
    overview:
      "Family protection starts by separating a term-life benefit, a health policy, and money kept aside for short-term shocks. This mission explains those differences and points to the lessons that already cover them. It does not calculate a personal cover amount.",
    calculators: [
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan emergency fund and protection targets." },
      { title: "Retirement Calculator", path: "/retirement-calculator", desc: "Explore an illustrative long-term savings estimate alongside family planning." },
      { title: "Inflation Calculator", path: "/inflation-calculator", desc: "Project future family expense needs." },
      { title: "SIP Calculator", path: "/sip-calculator", desc: "Build long-term family wealth alongside protection." },
    ],
    learningModules: [
      "What a term benefit covers during the policy term",
      "What a cash reserve is for",
      "What a health policy limit does not promise",
      "Recording documents, without drafting a will",
    ],
    aiPreview:
      "Soon, FOINWI AI will help explain protection gaps, emergency fund targets, and family planning priorities.",
    checklist: [
      "Estimate income replacement need for term cover",
      "Build or review 6–12 month emergency fund",
      "Ensure health insurance covers major family members",
      "Document policies, nominees, and key accounts",
      "Align investments with family goals and protection",
    ],
    nextStep: {
      title: "Plan your emergency fund",
      text: "Use the Goal Planner to set a target for 6 months of essential family expenses.",
      path: "/goal-planner",
      cta: "Open Goal Planner →",
    },
    timeline: [
      { title: "Assess protection gaps", detail: "Review life cover, health cover, and savings." },
      { title: "Build emergency fund", detail: "Target 6–12 months of essential expenses." },
      { title: "Organise family finances", detail: "Nominees, documents, and account access." },
      { title: "Align long-term goals", detail: "Balance protection with wealth building." },
      { title: "Review annually", detail: "Update cover as income and family needs grow." },
    ],
  },
];

export function getJourneyBySlug(slug) {
  return FINANCIAL_JOURNEYS.find((journey) => journey.slug === slug);
}
