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
      "Buying a home in India means balancing property cost, down payment savings, home loan EMI, registration charges, and future cash flow. This journey helps you estimate what you can afford, how much to save before applying, and whether the EMI fits your income comfortably.",
    calculators: [
      { title: "Home Loan Eligibility", path: "/home-loan-eligibility-calculator", desc: "Estimate the loan amount you may qualify for based on income." },
      { title: "EMI Calculator", path: "/emi-calculator", desc: "See monthly EMI across loan amount, rate, and tenure." },
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan your down payment target with a monthly savings path." },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator", desc: "Understand how prepayments can reduce interest over time." },
    ],
    learningModules: [
      "How home loan eligibility is assessed in India",
      "Down payment, registration, and hidden home-buying costs",
      "Fixed vs floating interest rates for home loans",
      "When to prepay vs invest surplus cash",
    ],
    aiPreview:
      "Soon, FOINWI AI will help compare property budget, EMI stress, and down payment timelines in plain language — educational guidance only.",
    checklist: [
      "Estimate total property budget including registration and interiors",
      "Calculate required down payment and monthly savings needed",
      "Check home loan eligibility against current income",
      "Stress-test EMI at higher interest rates",
      "Review emergency fund before committing to a long loan",
    ],
    nextStep: {
      title: "Check your home loan eligibility",
      text: "Start with the Home Loan Eligibility Calculator to see a realistic borrowing range before you shortlist properties.",
      path: "/home-loan-eligibility-calculator",
      cta: "Open Eligibility Calculator →",
    },
    timeline: [
      { title: "Set property budget", detail: "Define total cost range including taxes and setup expenses." },
      { title: "Plan down payment", detail: "Use Goal Planner to map monthly savings toward your target." },
      { title: "Check loan eligibility", detail: "Estimate sanctioned amount based on income and obligations." },
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
      "Wealth building is less about timing the market and more about consistent investing, realistic return assumptions, and staying invested through market cycles. This journey covers SIP planning, lumpsum decisions, CAGR understanding, and goal-linked investing for Indian savers.",
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
      "Tax planning for salaried professionals in India involves choosing the right regime, maximising eligible deductions, understanding HRA rules, and planning investments under sections like 80C. This journey helps you estimate liability and identify planning levers without overcomplicating returns filing.",
    calculators: [
      { title: "Income Tax Calculator", path: "/income-tax-calculator", desc: "Compare Old and New regime tax estimates." },
      { title: "HRA Calculator", path: "/hra-calculator", desc: "Calculate HRA exemption and taxable portion." },
      { title: "GST Calculator", path: "/gst-calculator", desc: "Understand GST on purchases and invoices." },
      { title: "PPF Calculator", path: "/ppf-calculator", desc: "Plan 80C-linked long-term tax-efficient savings." },
    ],
    learningModules: [
      "Old vs New tax regime — which fits your profile",
      "Section 80C, 80D, and common salary deductions",
      "HRA exemption rules for metro and non-metro cities",
      "Tax planning vs tax evasion — staying compliant",
    ],
    aiPreview:
      "Soon, FOINWI AI will help explain tax calculator results, regime trade-offs, and deduction concepts in simple language.",
    checklist: [
      "Collect salary structure, rent receipts, and investment proofs",
      "Compare Old vs New regime estimated tax",
      "Calculate HRA exemption if applicable",
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
      { title: "Optimise deductions", detail: "Review HRA, 80C, 80D, and NPS contributions." },
      { title: "Plan year-end actions", detail: "Align investments and proofs before March." },
      { title: "File with confidence", detail: "Use estimates to prepare documentation for filing." },
    ],
  },
  {
    slug: "child-education",
    icon: "👶",
    title: "Child Education",
    description: "Plan school, college, and study-abroad costs with inflation-aware savings.",
    duration: "6–12 months to start",
    heroSubtitle:
      "Estimate future education costs and build a savings plan that keeps pace with rising fees.",
    overview:
      "Education costs in India rise faster than general inflation, especially for professional degrees and study abroad. This journey helps you project future fees, calculate required SIP or lumpsum savings, and align investments with your child's timeline.",
    calculators: [
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan education corpus with target date and amount." },
      { title: "SIP Calculator", path: "/sip-calculator", desc: "Estimate monthly savings needed for the goal." },
      { title: "Inflation Calculator", path: "/inflation-calculator", desc: "See how inflation affects future education costs." },
      { title: "PPF Calculator", path: "/ppf-calculator", desc: "Explore long-term tax-efficient savings options." },
    ],
    learningModules: [
      "Projecting school and college fees 10–15 years ahead",
      "SIP-based education funds vs traditional deposits",
      "Balancing child education with retirement savings",
      "Insurance and contingency planning for education goals",
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
      "A car purchase involves on-road price, down payment, loan EMI, insurance, fuel, and maintenance. This journey helps you estimate affordable loan terms, compare tenure options, and avoid overextending monthly cash flow for a vehicle.",
    calculators: [
      { title: "EMI Calculator", path: "/emi-calculator", desc: "Calculate car loan EMI across amounts and tenures." },
      { title: "Goal Planner", path: "/goal-planner", desc: "Save for down payment before taking a loan." },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator", desc: "See interest saved by early loan closure." },
      { title: "Compound Interest", path: "/compound-interest-calculator", desc: "Compare saving vs borrowing for the purchase." },
    ],
    learningModules: [
      "On-road price vs ex-showroom — full cost breakdown",
      "New vs used car loan considerations",
      "Ideal EMI-to-income ratio for car loans",
      "Total cost of ownership over 5 years",
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
    description: "Estimate retirement corpus, EPF/NPS growth, and monthly income after retirement.",
    duration: "4–8 weeks",
    heroSubtitle:
      "Build a retirement plan that accounts for inflation, longevity, and post-retirement income needs.",
    overview:
      "Retirement planning in India combines EPF, NPS, PPF, mutual funds, and other savings to replace your salary after you stop working. This journey helps you estimate the corpus needed, project existing benefits, and identify the monthly savings gap.",
    calculators: [
      { title: "Retirement Calculator", path: "/retirement-calculator", desc: "Estimate corpus needed for retirement income." },
      { title: "EPF Calculator", path: "/epf-calculator", desc: "Project Employee Provident Fund growth." },
      { title: "NPS Calculator", path: "/nps-calculator", desc: "Plan National Pension System contributions." },
      { title: "SWP Calculator", path: "/swp-calculator", desc: "Plan systematic withdrawals from retirement corpus." },
    ],
    learningModules: [
      "How much corpus do you need for retirement in India",
      "EPF, NPS, and PPF roles in retirement planning",
      "Inflation impact on post-retirement expenses",
      "Creating income from corpus with SWP strategies",
    ],
    aiPreview:
      "Soon, FOINWI AI will help explain retirement gaps, inflation impact, and savings direction for long-term planning.",
    checklist: [
      "Estimate monthly expenses needed after retirement",
      "Project EPF, NPS, and existing investments",
      "Calculate inflation-adjusted retirement corpus",
      "Identify monthly savings gap to close the target",
      "Review plan every 2–3 years or after major life changes",
    ],
    nextStep: {
      title: "Estimate your retirement corpus",
      text: "Start with the Retirement Calculator to see how much you may need and what to save monthly.",
      path: "/retirement-calculator",
      cta: "Open Retirement Calculator →",
    },
    timeline: [
      { title: "Define retirement age", detail: "Set target age and expected lifestyle costs." },
      { title: "Project existing benefits", detail: "Include EPF, NPS, and current investments." },
      { title: "Calculate corpus gap", detail: "Find the shortfall between need and projected savings." },
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
      "Managing multiple loans — home, car, personal, or credit — requires knowing total EMI outflow, interest cost, and prepayment benefits. This journey helps prioritise high-interest debt, plan prepayments, and restore financial flexibility.",
    calculators: [
      { title: "EMI Calculator", path: "/emi-calculator", desc: "Break down EMI into principal and interest." },
      { title: "Loan Prepayment", path: "/loan-prepayment-calculator", desc: "See interest saved from partial or full prepayment." },
      { title: "Compound Interest", path: "/compound-interest-calculator", desc: "Compare cost of debt vs investment returns." },
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan targeted savings for loan closure." },
    ],
    learningModules: [
      "Good debt vs bad debt — prioritisation framework",
      "Avalanche vs snowball debt repayment methods",
      "When prepayment makes sense over investing",
      "Rebuilding credit health after debt clearance",
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
      "Ensure your family is financially protected with the right insurance mindset, emergency fund, and goal planning.",
    overview:
      "Financial protection goes beyond buying policies — it means adequate term life cover, health emergency buffer, income replacement planning, and organised family goals. This journey helps you quantify protection needs and align savings with family security.",
    calculators: [
      { title: "Goal Planner", path: "/goal-planner", desc: "Plan emergency fund and protection targets." },
      { title: "Retirement Calculator", path: "/retirement-calculator", desc: "Ensure retirement savings protect spouse long-term." },
      { title: "Inflation Calculator", path: "/inflation-calculator", desc: "Project future family expense needs." },
      { title: "SIP Calculator", path: "/sip-calculator", desc: "Build long-term family wealth alongside protection." },
    ],
    learningModules: [
      "How much term insurance cover families typically need",
      "Building a 6–12 month emergency fund",
      "Health insurance vs medical emergency savings",
      "Estate planning basics for Indian families",
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
