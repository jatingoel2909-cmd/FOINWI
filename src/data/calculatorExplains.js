export const EXPLAIN_DISCLAIMER =
  "FOINWI explanations are educational only. They describe how calculator results relate to your inputs — not financial, investment, tax, loan, or legal advice.";

export const CALCULATOR_EXPLAINS = {
  "/sip-calculator": {
    whyGenerated:
      "This result shows the projected future value of investing a fixed amount at the beginning of every month at a steady annual return, compounded monthly. The formula treats each SIP instalment as a separate growing stream.",
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
      "This estimates cumulative maturity value by reinvesting interest on a fixed deposit for the chosen tenure and compounding frequency.",
    keyInputs: [
      "Deposit amount — scales maturity value linearly at a given rate",
      "Interest rate — a higher selected annual rate increases the illustration",
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
      "The planner compounds current savings and monthly SIP contributions at the same monthly rate, then compares the projected value to your target goal amount at the chosen horizon. Monthly contributions are assumed at the beginning of each month.",
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
      "This simplified RD estimate uses equal monthly deposits made at the beginning of each month and compounds them monthly for the selected tenure. Actual bank maturity may differ.",
    keyInputs: [
      "Monthly deposit — each instalment adds to the corpus",
      "Interest rate — selected annual rate used in this monthly-compounding estimate",
      "Tenure — number of months deposits continue",
    ],
    ifInputsChange: [
      "Higher monthly deposit → higher maturity",
      "Higher rate → more interest earned",
      "Longer tenure → more deposits and more compounding",
    ],
    beginnerMistakes: [
      "Assuming all banks use the same compounding or deposit-date rules",
      "Comparing RD to equity without risk context",
      "Ignoring TDS/tax, missed-instalment terms, penalties, or premature-closure rules",
      "Choosing tenure without matching the goal date",
    ],
    relatedCalculators: ["/fd-calculator", "/goal-planner", "/sip-calculator"],
    relatedLessons: ["saving-budgeting"],
    relatedMissions: ["build-wealth"],
  },
  "/swp-calculator": {
    whyGenerated:
      "SWP applies the selected monthly return to the corpus before each withdrawal, limits the final withdrawal to the available balance, and shows whether the corpus lasts through the selected tenure.",
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
      "Future cost is calculated by growing today's amount at the selected inflation rate over the selected years. It is a nominal future-cost estimate, not a purchasing-power calculation.",
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
      "This educational estimate applies the Code on Social Security, 2020 monthly-rated formula: last drawn statutory wages × 15 × qualifying years ÷ 26. The Code on Social Security, 2020 provides that gratuity is subject to an amount notified by the Central Government. This calculator currently models ₹20 lakh, consistent with the earlier notified ceiling and current Ministry guidance.",
    keyInputs: [
      "Last drawn statutory wages — monthly wage amount applicable for gratuity under the current labour-code wage definition; this may differ from Basic + DA where allowance-add-back rules apply",
      "Completed years of service — whole years only; decimal years are not rounded",
      "Additional months of service — 0 to 11; more than 6 months adds one qualifying year",
    ],
    ifInputsChange: [
      "Higher last drawn statutory wages → higher estimated gratuity before the ceiling used in this estimate",
      "More completed years → higher estimated gratuity before the ceiling used in this estimate",
      "Additional months above 6 → one extra qualifying year in this estimate",
      "Uncapped estimate above ₹20 lakh → this estimate is limited to the ₹20 lakh ceiling used here",
    ],
    beginnerMistakes: [
      "Treating the result as a payout confirmation",
      "Assuming Basic + DA is always equal to statutory wages",
      "Applying this ordinary five-year estimate to fixed-term employment",
      "Assuming ₹20,00,000 is an absolute maximum in every private arrangement",
    ],
    relatedCalculators: ["/epf-calculator", "/retirement-calculator"],
    relatedLessons: ["retirement-planning"],
    relatedMissions: ["retirement-planning"],
  },
  "/epf-calculator": {
    whyGenerated:
      "This is an educational EPF accumulation estimate for a standard already-enrolled EPF/EPS member using statutory contribution assumptions under the Code on Social Security, 2020. Contributions use Monthly PF wages up to the ₹15,000 statutory wage ceiling. Employer total contribution is 12% in this model; the EPS diversion is excluded from the projected EPF balance.",
    keyInputs: [
      "Monthly PF wages — wage amount applicable for provident-fund contribution purposes; this may differ from Basic salary alone",
      "Current EPF balance — starting balance used in the estimate",
      "Years remaining — contribution period used in the simplified projection",
      "Illustrative EPF interest assumption — 8.25% is the last Government-approved/notified rate verified for FY 2024-25",
    ],
    ifInputsChange: [
      "PF wages above ₹15,000 do not increase default statutory contributions in this estimate",
      "A longer remaining period typically increases estimated contributions and illustrative growth",
      "A higher illustrative interest assumption typically increases the projected EPF balance",
    ],
    beginnerMistakes: [
      "Treating PF wages as always equal to Basic salary",
      "Assuming contributions in this estimate are calculated on full wages above ₹15,000",
      "Treating the residual employer EPF amount as the full employer contribution",
      "Assuming this illustrative 8.25% rate is a guaranteed or future EPF rate",
      "Using this default estimate for 10% establishments, VPF, higher-wage contribution, or a new joiner above ₹15,000 who is not an EPS member",
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
      "This educational estimate applies FY 2025-26 (AY 2026-27) slabs to simplified taxable salary income, then applies an educational Section 87A rebate or Section 87A marginal relief where this normal-rate model supports it, then adds 4% cess.",
    keyInputs: [
      "Annual salary income — scoped as salary so a Section 16(ia) salary standard deduction can be applied",
      "Tax regime — New regime uses the ₹75,000 salary standard deduction; Old regime uses the ₹50,000 salary standard deduction plus entered deductions",
      "Eligible deductions considered — old-regime additional input only; not a second standard deduction and not a confirmation that every rupee is deductible",
    ],
    ifInputsChange: [
      "Higher salary → higher estimated taxable income after supported deductions",
      "More entered old-regime deductions → lower estimated taxable income in that regime only",
      "Crossing the new-regime ₹12,00,000 87A threshold — ordinary rebate no longer applies; Section 87A marginal relief may reduce estimated tax just above that threshold for eligible normal-rate income",
    ],
    beginnerMistakes: [
      "Treating the result as a filing-ready tax figure",
      "Assuming this estimate covers capital gains or other special-rate income",
      "Assuming old-regime slabs cover senior citizens or non-residents",
      "Using this estimate above ₹50 lakh, where surcharge is not modelled",
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
