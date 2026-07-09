export const EXPLAIN_DISCLAIMER =
  "FOINWI explanations are educational only. They describe how calculator results relate to your inputs — not financial, investment, tax, loan, or legal advice.";

export const CALCULATOR_EXPLAINS = {
  "/sip-calculator": {
    whyGenerated:
      "This result shows the projected future value of investing a fixed amount every month at a steady annual return, compounded monthly. The formula treats each SIP instalment as a separate growing stream.",
    keyInputs: [
      "Monthly investment amount — directly scales the final corpus",
      "Expected annual return — small changes compound significantly over long tenures",
      "Investment tenure — longer periods allow more instalments and more compounding",
    ],
    ifInputsChange: [
      "Higher monthly SIP → corpus rises roughly in proportion to the amount invested",
      "Higher return assumption → corpus grows faster, especially over 10+ years",
      "Longer tenure → more contributions and more time for compounding",
      "Lower return or shorter tenure → projected value falls; actual markets vary",
    ],
    beginnerMistakes: [
      "Assuming the same return every year — real returns fluctuate",
      "Ignoring inflation when judging whether the corpus is enough",
      "Stopping SIP during market dips and missing lower average purchase prices",
      "Comparing SIP projection to a lumpsum without matching the total amount invested",
    ],
    relatedCalculators: ["/lumpsum-calculator", "/cagr-calculator", "/goal-planner", "/inflation-calculator"],
    relatedLessons: ["mutual-funds-sip", "investing-fundamentals"],
    relatedMissions: ["build-wealth", "retirement-planning"],
  },
  "/emi-calculator": {
    whyGenerated:
      "The EMI is calculated so that equal monthly payments over the loan tenure fully repay principal plus interest. Early payments include more interest; later payments include more principal.",
    keyInputs: [
      "Loan amount — larger principal means higher EMI",
      "Annual interest rate — rate has a strong effect on EMI and total interest",
      "Loan tenure — longer tenure lowers EMI but increases total interest paid",
    ],
    ifInputsChange: [
      "Higher loan amount → EMI increases",
      "Higher interest rate → EMI and total interest both rise",
      "Longer tenure → EMI falls but total interest often rises",
      "Shorter tenure → EMI rises but total interest usually falls",
    ],
    beginnerMistakes: [
      "Choosing the longest tenure only to lower EMI without checking total interest",
      "Comparing loans using EMI alone instead of total cost",
      "Forgetting processing fees, insurance, and other charges",
      "Not stress-testing EMI if rates rise on floating loans",
    ],
    relatedCalculators: ["/loan-prepayment-calculator", "/home-loan-eligibility-calculator"],
    relatedLessons: ["loans-emi"],
    relatedMissions: ["buy-dream-home", "become-debt-free", "buy-your-car"],
  },
  "/fd-calculator": {
    whyGenerated:
      "This estimates maturity value by applying compound interest on a fixed deposit for the chosen tenure and compounding frequency, with optional periodic interest payouts affecting reinvestment.",
    keyInputs: [
      "Deposit amount — scales maturity value linearly at a given rate",
      "Interest rate — higher bank FD rates increase maturity",
      "Tenure and compounding frequency — longer tenure and more frequent compounding help growth",
    ],
    ifInputsChange: [
      "Higher deposit → higher maturity",
      "Higher rate → faster growth over the same period",
      "Quarterly compounding typically yields slightly more than annual",
      "Shorter tenure → less interest earned overall",
    ],
    beginnerMistakes: [
      "Ignoring tax on FD interest for your slab",
      "Comparing FD returns to equity without considering risk differences",
      "Not checking premature withdrawal penalties",
      "Assuming today's FD rates will stay unchanged for years",
    ],
    relatedCalculators: ["/rd-calculator", "/compound-interest-calculator", "/inflation-calculator"],
    relatedLessons: ["saving-budgeting", "investing-fundamentals"],
    relatedMissions: ["build-wealth"],
  },
  "/ppf-calculator": {
    whyGenerated:
      "PPF growth is modelled with annual compounding on contributions within the yearly deposit limit, reflecting the long-term, tax-efficient structure of the account.",
    keyInputs: [
      "Annual contribution — up to the statutory limit each year",
      "Interest rate — set by government and revised periodically",
      "Investment period — PPF has a minimum lock-in and 15-year cycle",
    ],
    ifInputsChange: [
      "Higher yearly deposits → larger corpus at maturity",
      "Higher assumed rate → faster growth (rate is not guaranteed forever)",
      "Longer holding period → more years of compounding",
      "Missed contributions → lower corpus than the projection",
    ],
    beginnerMistakes: [
      "Forgetting the annual deposit cap when planning",
      "Treating PPF as a short-term fund despite long lock-in",
      "Not linking PPF to overall asset allocation",
      "Assuming the current rate will never change",
    ],
    relatedCalculators: ["/fd-calculator", "/goal-planner", "/retirement-calculator"],
    relatedLessons: ["income-tax-basics", "retirement-planning"],
    relatedMissions: ["save-tax", "retirement-planning"],
  },
  "/retirement-calculator": {
    whyGenerated:
      "This compares inflated future expenses against a projected retirement corpus built from current savings and monthly SIP, using a simplified planning framework for educational illustration.",
    keyInputs: [
      "Current monthly expenses — base for estimating retirement need",
      "Inflation rate — raises future expense requirements",
      "Expected return on savings — affects projected corpus growth",
      "Years to retirement — determines contribution period and expense inflation",
    ],
    ifInputsChange: [
      "Higher inflation → larger corpus needed at retirement",
      "Higher monthly SIP → improves projected corpus",
      "Longer time to retire → more years to save but also more inflated expenses",
      "Lower return assumption → larger gap between need and projection",
    ],
    beginnerMistakes: [
      "Ignoring healthcare costs in retirement estimates",
      "Using today's expenses without inflation adjustment",
      "Relying only on EPF without additional savings",
      "Treating the projection as a guarantee rather than an estimate",
    ],
    relatedCalculators: ["/nps-calculator", "/epf-calculator", "/swp-calculator", "/inflation-calculator"],
    relatedLessons: ["retirement-planning"],
    relatedMissions: ["retirement-planning"],
  },
  "/goal-planner": {
    whyGenerated:
      "The planner projects wealth from current savings plus monthly SIP and compares it to your target goal amount at the chosen horizon.",
    keyInputs: [
      "Target goal amount — defines the finish line",
      "Monthly SIP and current savings — drive the projected corpus",
      "Expected return and time horizon — determine compounding effect",
    ],
    ifInputsChange: [
      "Higher goal → larger gap if savings stay the same",
      "Higher SIP → closes the gap faster",
      "Longer horizon → more time to compound but goal may also need inflation adjustment separately",
      "Lower return → projected value falls",
    ],
    beginnerMistakes: [
      "Setting a goal without a timeline",
      "Not revisiting the plan after salary changes",
      "Ignoring inflation on long-term goals like education or home",
      "Stopping SIP when markets fall temporarily",
    ],
    relatedCalculators: ["/sip-calculator", "/inflation-calculator", "/lumpsum-calculator"],
    relatedLessons: ["money-basics", "mutual-funds-sip"],
    relatedMissions: ["build-wealth", "child-education", "buy-dream-home"],
  },
  "/cagr-calculator": {
    whyGenerated:
      "CAGR smooths an investment's growth into one annualised percentage between a starting value and ending value over the selected number of years.",
    keyInputs: [
      "Beginning value and ending value — define total growth",
      "Number of years — longer periods with same total return mean lower CAGR",
    ],
    ifInputsChange: [
      "Higher ending value → higher CAGR",
      "Longer time with same absolute gain → lower CAGR",
      "Volatile paths with the same start and end can show the same CAGR as steady growth",
    ],
    beginnerMistakes: [
      "Expecting the same CAGR every future year",
      "Using CAGR from a short bull period to plan decades ahead",
      "Ignoring fees and taxes when comparing investments",
      "Confusing CAGR with average simple returns",
    ],
    relatedCalculators: ["/sip-calculator", "/lumpsum-calculator", "/compound-interest-calculator"],
    relatedLessons: ["mutual-funds-sip", "investing-fundamentals"],
    relatedMissions: ["build-wealth"],
  },
  "/lumpsum-calculator": {
    whyGenerated:
      "This projects how a one-time investment grows with compound interest at the stated annual return over the selected period.",
    keyInputs: [
      "Investment amount — starting principal",
      "Expected annual return — drives compounding speed",
      "Investment period — more years allow more compounding",
    ],
    ifInputsChange: [
      "Larger lumpsum → proportionally larger maturity value",
      "Higher return → faster growth",
      "Longer period → significantly higher outcome due to compounding",
    ],
    beginnerMistakes: [
      "Investing a lumpsum without an emergency fund first",
      "Comparing lumpsum results to SIP without equal total cash flow",
      "Assuming fixed returns in volatile assets",
      "Ignoring entry timing risk in equity lumpsum",
    ],
    relatedCalculators: ["/sip-calculator", "/cagr-calculator", "/goal-planner"],
    relatedLessons: ["mutual-funds-sip", "investing-fundamentals"],
    relatedMissions: ["build-wealth"],
  },
  "/rd-calculator": {
    whyGenerated:
      "Recurring deposit maturity is calculated from equal monthly deposits earning compound interest at the stated rate for the full tenure.",
    keyInputs: [
      "Monthly deposit — each instalment adds to the corpus",
      "Interest rate — bank RD rate for the tenure",
      "Tenure — number of months deposits continue",
    ],
    ifInputsChange: [
      "Higher monthly deposit → higher maturity",
      "Higher rate → more interest earned",
      "Longer tenure → more deposits and more compounding",
    ],
    beginnerMistakes: [
      "Missing a monthly deposit and not checking bank rules",
      "Comparing RD to equity without risk context",
      "Ignoring tax on RD interest",
      "Choosing tenure without matching the goal date",
    ],
    relatedCalculators: ["/fd-calculator", "/goal-planner", "/sip-calculator"],
    relatedLessons: ["saving-budgeting"],
    relatedMissions: ["build-wealth"],
  },
  "/swp-calculator": {
    whyGenerated:
      "SWP models regular withdrawals from an existing corpus while the remaining balance continues to earn returns, showing how long the corpus may last.",
    keyInputs: [
      "Starting corpus — pool available for withdrawals",
      "Monthly withdrawal — cash taken out each month",
      "Expected return — growth on the remaining balance",
      "Withdrawal period — duration of the SWP plan",
    ],
    ifInputsChange: [
      "Higher withdrawals → corpus depletes faster",
      "Higher return → may sustain withdrawals longer",
      "Larger starting corpus → supports higher or longer withdrawals",
    ],
    beginnerMistakes: [
      "Setting withdrawals too high for the corpus size",
      "Ignoring inflation on post-retirement expenses",
      "Assuming fixed returns during withdrawal years",
      "Not keeping an emergency buffer outside the SWP corpus",
    ],
    relatedCalculators: ["/retirement-calculator", "/nps-calculator", "/inflation-calculator"],
    relatedLessons: ["retirement-planning"],
    relatedMissions: ["retirement-planning"],
  },
  "/inflation-calculator": {
    whyGenerated:
      "Future cost is calculated by growing today's amount at the inflation rate over the selected years — showing how purchasing power erodes.",
    keyInputs: [
      "Current amount — today's price or expense",
      "Inflation rate — annual price rise assumption",
      "Number of years — how long inflation compounds",
    ],
    ifInputsChange: [
      "Higher inflation → much higher future cost over long periods",
      "Longer horizon → greater gap between today and future amount",
      "Lower inflation assumption → smaller future figure",
    ],
    beginnerMistakes: [
      "Planning long-term goals using today's prices only",
      "Using one inflation rate for all expense types",
      "Ignoring that salaries may rise but not always match inflation",
      "Confusing nominal investment returns with real returns",
    ],
    relatedCalculators: ["/goal-planner", "/retirement-calculator", "/sip-calculator"],
    relatedLessons: ["money-basics", "investing-fundamentals"],
    relatedMissions: ["retirement-planning", "child-education"],
  },
  "/gratuity-calculator": {
    whyGenerated:
      "Gratuity is estimated using the standard formula for eligible employees based on monthly salary and years of completed service.",
    keyInputs: [
      "Monthly basic salary — base for the calculation",
      "Years of service — must meet eligibility rules for gratuity",
    ],
    ifInputsChange: [
      "Higher salary → higher gratuity",
      "More years of service → higher payout up to formula limits",
    ],
    beginnerMistakes: [
      "Assuming gratuity applies before completing eligible service years",
      "Mixing gross salary with basic salary for the formula",
      "Not confirming employer-specific gratuity rules",
      "Relying on gratuity alone for retirement corpus",
    ],
    relatedCalculators: ["/epf-calculator", "/retirement-calculator"],
    relatedLessons: ["retirement-planning"],
    relatedMissions: ["retirement-planning"],
  },
  "/epf-calculator": {
    whyGenerated:
      "This projects EPF corpus from employee and employer contributions on basic salary, plus growth on the current balance over the remaining service period.",
    keyInputs: [
      "Monthly basic salary — determines contribution amounts",
      "Current EPF balance — starting corpus",
      "Years until retirement — contribution period",
      "Interest rate — EPF rate declared annually",
    ],
    ifInputsChange: [
      "Higher basic salary → larger monthly contributions",
      "Longer service → more contributions and compounding",
      "Higher interest rate → faster corpus growth",
    ],
    beginnerMistakes: [
      "Forgetting that EPF alone may not cover full retirement needs",
      "Not tracking passbook balance against projections",
      "Ignoring voluntary PF top-ups in planning",
      "Assuming the current EPF rate forever",
    ],
    relatedCalculators: ["/nps-calculator", "/gratuity-calculator", "/retirement-calculator"],
    relatedLessons: ["retirement-planning"],
    relatedMissions: ["retirement-planning"],
  },
  "/nps-calculator": {
    whyGenerated:
      "NPS corpus is projected from monthly contributions and growth rate; estimated pension applies a simplified annuity conversion for educational illustration.",
    keyInputs: [
      "Monthly NPS contribution — regular investment",
      "Current age and retirement age — investment horizon",
      "Expected return — growth assumption on NPS investments",
    ],
    ifInputsChange: [
      "Higher contribution → larger corpus",
      "Longer horizon → more compounding",
      "Higher return assumption → higher projected corpus and pension estimate",
    ],
    beginnerMistakes: [
      "Confusing NPS corpus with fully withdrawable amount",
      "Ignoring annuity purchase rules at retirement",
      "Not claiming additional tax deduction where eligible",
      "Comparing NPS to EPF without understanding different structures",
    ],
    relatedCalculators: ["/epf-calculator", "/retirement-calculator", "/swp-calculator"],
    relatedLessons: ["retirement-planning"],
    relatedMissions: ["retirement-planning", "save-tax"],
  },
  "/home-loan-eligibility-calculator": {
    whyGenerated:
      "Eligible loan amount is derived from income-based EMI capacity after existing obligations, then converted to a maximum loan using standard amortisation.",
    keyInputs: [
      "Monthly income — primary driver of eligibility",
      "Existing EMIs — reduce available capacity",
      "Interest rate and tenure — convert affordable EMI into loan amount",
    ],
    ifInputsChange: [
      "Higher income → higher eligible loan",
      "More existing EMIs → lower eligibility",
      "Longer tenure → may increase eligible amount at same EMI capacity",
      "Higher interest rate → lowers eligible loan for same EMI",
    ],
    beginnerMistakes: [
      "Borrowing the maximum eligible amount without buffer",
      "Not including all EMIs and credit card minimums",
      "Ignoring down payment and registration costs",
      "Assuming eligibility equals comfortable affordability",
    ],
    relatedCalculators: ["/emi-calculator", "/goal-planner", "/loan-prepayment-calculator"],
    relatedLessons: ["loans-emi"],
    relatedMissions: ["buy-dream-home"],
  },
  "/loan-prepayment-calculator": {
    whyGenerated:
      "This compares total interest on the original loan schedule against a reduced balance after prepayment, typically with the same EMI and shorter tenure.",
    keyInputs: [
      "Outstanding principal — base for remaining interest",
      "Prepayment amount — reduces balance",
      "Interest rate and remaining tenure — drive interest savings",
    ],
    ifInputsChange: [
      "Larger prepayment → more interest saved",
      "Higher rate loans → prepayment saves more interest",
      "Earlier prepayment in the loan → often greater savings",
    ],
    beginnerMistakes: [
      "Prepaying without checking lender charges or rules",
      "Draining emergency fund to prepay low-priority debt",
      "Not comparing prepayment benefit with alternative investments educationally",
      "Assuming all lenders recalculate the same way",
    ],
    relatedCalculators: ["/emi-calculator", "/home-loan-eligibility-calculator"],
    relatedLessons: ["loans-emi"],
    relatedMissions: ["become-debt-free", "buy-dream-home"],
  },
  "/gst-calculator": {
    whyGenerated:
      "GST amount is computed from the entered value and rate — either adding tax to a base price or extracting tax from a tax-inclusive price.",
    keyInputs: [
      "Amount entered — base or inclusive price depending on mode",
      "GST rate — percentage applied or extracted",
      "Add vs remove mode — changes which formula is used",
    ],
    ifInputsChange: [
      "Higher amount → higher GST value",
      "Higher rate → more tax",
      "Switching inclusive vs exclusive changes how base and tax split",
    ],
    beginnerMistakes: [
      "Applying GST twice on the same amount",
      "Using the wrong rate for goods vs services categories",
      "Confusing CGST/SGST components with the total rate",
      "Not checking whether a quote is inclusive of GST",
    ],
    relatedCalculators: ["/income-tax-calculator"],
    relatedLessons: ["income-tax-basics"],
    relatedMissions: ["save-tax"],
  },
  "/income-tax-calculator": {
    whyGenerated:
      "Tax is estimated by applying slab rates to taxable income after regime-specific deductions, plus applicable cess for educational comparison.",
    keyInputs: [
      "Annual income — starting point for tax",
      "Tax regime — Old vs New changes deductions and slabs",
      "Deductions — reduce taxable income in Old regime; New has standard deduction",
    ],
    ifInputsChange: [
      "Higher income → higher tax across slabs",
      "More deductions (Old regime) → lower taxable income",
      "Regime choice can change total tax significantly at same income",
    ],
    beginnerMistakes: [
      "Comparing regimes without full deduction picture",
      "Ignoring surcharge and cess at higher incomes",
      "Using calculator output as final filing figure",
      "Missing eligible deductions like 80C, 80D, or NPS",
    ],
    relatedCalculators: ["/hra-calculator", "/ppf-calculator", "/nps-calculator"],
    relatedLessons: ["income-tax-basics"],
    relatedMissions: ["save-tax"],
  },
  "/hra-calculator": {
    whyGenerated:
      "HRA exemption is the minimum of three eligible amounts based on actual HRA received, rent paid, and salary structure under common Indian rules.",
    keyInputs: [
      "Basic salary — used in percentage-based limits",
      "HRA received — actual allowance component",
      "Rent paid and metro vs non-metro — affect exemption ceiling",
    ],
    ifInputsChange: [
      "Higher rent → may increase exemption up to the three-way minimum",
      "Higher basic salary → changes percentage-based limits",
      "Metro status → 50% vs 40% of basic limit applies",
    ],
    beginnerMistakes: [
      "Claiming HRA without valid rent documentation",
      "Using gross salary instead of basic for the formula",
      "Forgetting that only the minimum of three amounts is exempt",
      "Not checking employer payroll vs independent calculation",
    ],
    relatedCalculators: ["/income-tax-calculator"],
    relatedLessons: ["income-tax-basics"],
    relatedMissions: ["save-tax"],
  },
  "/compound-interest-calculator": {
    whyGenerated:
      "Maturity value applies compound interest on principal at the chosen annual rate and compounding frequency over the selected years.",
    keyInputs: [
      "Principal — starting amount",
      "Annual interest rate — return assumption",
      "Compounding frequency — more frequent compounding slightly increases outcome",
      "Time period — years money remains invested",
    ],
    ifInputsChange: [
      "Higher principal or rate → higher maturity",
      "More compounding periods per year → slightly higher result",
      "Longer time → exponential effect from compounding",
    ],
    beginnerMistakes: [
      "Using simple interest intuition for long periods",
      "Ignoring taxes on interest income",
      "Assuming any investment compounds at a fixed guaranteed rate",
      "Not matching compounding frequency to the actual product",
    ],
    relatedCalculators: ["/fd-calculator", "/sip-calculator", "/cagr-calculator"],
    relatedLessons: ["money-basics", "investing-fundamentals"],
    relatedMissions: ["build-wealth"],
  },
};

export function getCalculatorExplain(calculatorId) {
  return CALCULATOR_EXPLAINS[calculatorId] ?? null;
}
