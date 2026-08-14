export const LEARN_ACADEMY_NOTICE =
  "Learning content is for educational purposes only and should not be considered financial, investment, tax, legal, or loan advice.";

const RAW_LEARNING_PATHS = [
  {
    slug: "money-basics",
    icon: "💡",
    title: "Money Basics",
    description:
      "Build a clear foundation — what money is, how inflation erodes value, and why compounding and goals matter.",
    duration: "45 min",
    difficulty: "Beginner",
    relatedCalculators: [
      "/inflation-calculator",
      "/compound-interest-calculator",
      "/goal-planner",
    ],
    nextPath: "saving-budgeting",
    lessons: [
      {
        id: 1,
        title: "What is Money?",
        summary:
          "Money is a medium of exchange, a store of value, and a unit of account. Understanding these three roles helps explain why saving, spending, and planning all connect to everyday decisions.",
        calculators: [],
      },
      {
        id: 2,
        title: "Inflation",
        summary:
          "Inflation means prices rise over time, so the same amount of money buys less in the future. This is why long-term goals need to account for rising costs, not just today's prices.",
        calculators: ["/inflation-calculator"],
      },
      {
        id: 3,
        title: "Compounding",
        summary:
          "Compounding means earning returns on both your original amount and on accumulated returns. Over long periods, even modest rates can grow significantly — patience matters more than timing.",
        calculators: ["/compound-interest-calculator", "/sip-calculator"],
      },
      {
        id: 4,
        title: "Time Value of Money",
        summary:
          "A rupee today is worth more than a rupee later because it can be saved or invested. Time value of money is the idea behind interest, EMIs, and comparing options across different time horizons.",
        calculators: ["/compound-interest-calculator", "/fd-calculator"],
      },
      {
        id: 5,
        title: "Financial Goals",
        summary:
          "Goals give direction to saving and spending. Short-term goals (1–3 years), medium-term (3–7 years), and long-term (7+ years) often need different approaches and time horizons.",
        calculators: ["/goal-planner"],
      },
    ],
  },
  {
    slug: "saving-budgeting",
    icon: "💰",
    title: "Saving & Budgeting",
    description:
      "Learn practical habits for tracking income, controlling expenses, and building an emergency buffer before investing.",
    duration: "50 min",
    difficulty: "Beginner",
    relatedCalculators: ["/goal-planner", "/rd-calculator", "/fd-calculator"],
    nextPath: "investing-fundamentals",
    lessons: [
      {
        id: 1,
        title: "Needs vs Wants",
        summary:
          "Needs are essentials for living and working; wants improve comfort or lifestyle. Separating the two makes it easier to decide what to cut when income is limited.",
        calculators: [],
      },
      {
        id: 2,
        title: "Building a Monthly Budget",
        summary:
          "A budget maps income to categories — rent, food, transport, savings, and discretionary spending. The 50-30-20 rule is one common educational framework, though personal ratios vary.",
        calculators: ["/goal-planner"],
      },
      {
        id: 3,
        title: "Emergency Funds",
        summary:
          "An emergency fund covers unexpected expenses or income loss. Many educational guides suggest 3–6 months of essential expenses kept in accessible savings.",
        calculators: ["/goal-planner", "/fd-calculator"],
      },
      {
        id: 4,
        title: "Saving Strategies",
        summary:
          "Pay-yourself-first, automated transfers, and separate accounts for goals can make saving more consistent. Small, regular amounts often beat irregular large deposits.",
        calculators: ["/rd-calculator", "/fd-calculator"],
      },
      {
        id: 5,
        title: "Tracking Expenses",
        summary:
          "Reviewing spending monthly reveals patterns — subscriptions, dining, or impulse purchases. Awareness alone often helps redirect money toward priorities.",
        calculators: ["/goal-planner"],
      },
    ],
  },
  {
    slug: "investing-fundamentals",
    icon: "📊",
    title: "Investing Fundamentals",
    description:
      "Understand risk, return, asset classes, and how inflation affects real wealth over time.",
    duration: "55 min",
    difficulty: "Beginner",
    relatedCalculators: [
      "/cagr-calculator",
      "/inflation-calculator",
      "/compound-interest-calculator",
    ],
    nextPath: "mutual-funds-sip",
    lessons: [
      {
        id: 1,
        title: "Risk and Return",
        summary:
          "Higher potential returns usually come with higher uncertainty. Equity tends to be more volatile than fixed deposits, but may offer higher long-term growth — neither is guaranteed.",
        calculators: ["/cagr-calculator"],
      },
      {
        id: 2,
        title: "Asset Classes in India",
        summary:
          "Common asset classes include equity, debt, gold, and real estate. Each behaves differently across market cycles, which is why diversification is often discussed in educational material.",
        calculators: ["/fd-calculator", "/ppf-calculator"],
      },
      {
        id: 3,
        title: "Power of Compounding",
        summary:
          "Starting early gives your money more time to compound. Two investors with the same monthly amount can end up with very different outcomes based on duration and consistency.",
        calculators: ["/compound-interest-calculator", "/sip-calculator"],
      },
      {
        id: 4,
        title: "Inflation and Real Returns",
        summary:
          "Nominal returns look good on paper, but inflation reduces purchasing power. Real return is roughly nominal return minus inflation — a useful way to compare options.",
        calculators: ["/inflation-calculator", "/cagr-calculator"],
      },
      {
        id: 5,
        title: "Getting Started with Investing",
        summary:
          "Many beginners start with emergency savings, then explore SIP, PPF, or FD based on goals and comfort with risk. Understanding concepts before committing capital is a sensible first step.",
        calculators: ["/sip-calculator", "/lumpsum-calculator", "/goal-planner"],
      },
    ],
  },
  {
    slug: "mutual-funds-sip",
    icon: "📈",
    title: "Mutual Funds & SIP",
    description:
      "Explore how mutual funds pool money, how SIP automates investing, and how to compare growth scenarios.",
    duration: "60 min",
    difficulty: "Intermediate",
    relatedCalculators: [
      "/sip-calculator",
      "/lumpsum-calculator",
      "/cagr-calculator",
      "/goal-planner",
    ],
    nextPath: "loans-emi",
    lessons: [
      {
        id: 1,
        title: "What Are Mutual Funds?",
        summary:
          "Mutual funds collect money from many investors and invest in a portfolio of stocks, bonds, or other assets. A fund manager (or index rules) decides allocation based on the fund's objective.",
        calculators: [],
      },
      {
        id: 2,
        title: "How SIP Works",
        summary:
          "A Systematic Investment Plan (SIP) invests a fixed amount at regular intervals — often monthly. Rupee-cost averaging means you buy more units when prices are lower and fewer when higher.",
        calculators: ["/sip-calculator"],
      },
      {
        id: 3,
        title: "Lumpsum vs SIP",
        summary:
          "Lumpsum means investing a single amount at once; SIP spreads investments over time. Each approach has different timing and cash-flow implications worth modelling before deciding.",
        calculators: ["/sip-calculator", "/lumpsum-calculator"],
      },
      {
        id: 4,
        title: "Understanding CAGR",
        summary:
          "Compound Annual Growth Rate (CAGR) smooths returns into a single annualised figure. It helps compare investments over different periods, though past CAGR does not predict future results.",
        calculators: ["/cagr-calculator"],
      },
      {
        id: 5,
        title: "Reviewing Fund Performance",
        summary:
          "Performance should be viewed over full market cycles, not just recent months. Expense ratio, consistency, and alignment with your goal horizon matter alongside raw returns.",
        calculators: ["/cagr-calculator", "/goal-planner"],
      },
    ],
  },
  {
    slug: "loans-emi",
    icon: "💳",
    title: "Loans & EMI",
    description:
      "Understand borrowing costs, EMI structure, prepayment impact, and how to compare loan options.",
    duration: "45 min",
    difficulty: "Beginner",
    relatedCalculators: [
      "/emi-calculator",
      "/loan-prepayment-calculator",
      "/home-loan-eligibility-calculator",
    ],
    nextPath: "income-tax-basics",
    lessons: [
      {
        id: 1,
        title: "How Loans Work",
        summary:
          "A loan gives you money upfront; you repay principal plus interest over a tenure. The interest rate, tenure, and fees together determine total cost — not just the EMI amount.",
        calculators: ["/emi-calculator"],
      },
      {
        id: 2,
        title: "Understanding EMI",
        summary:
          "EMI (Equated Monthly Installment) splits repayment into equal monthly payments. Early EMIs include more interest; later ones include more principal — a pattern visible in amortisation schedules.",
        calculators: ["/emi-calculator"],
      },
      {
        id: 3,
        title: "Fixed vs Floating Rates",
        summary:
          "Fixed rates stay constant for a defined period; floating rates change with benchmark rates. Floating EMIs can rise or fall over time, affecting monthly cash flow planning.",
        calculators: ["/emi-calculator", "/home-loan-eligibility-calculator"],
      },
      {
        id: 4,
        title: "Prepayment Basics",
        summary:
          "Prepaying part of a loan reduces outstanding principal, which can lower total interest paid or shorten tenure. Lenders may have prepayment rules or charges worth checking.",
        calculators: ["/loan-prepayment-calculator"],
      },
      {
        id: 5,
        title: "Managing Debt Wisely",
        summary:
          "Keeping total EMIs within a comfortable share of income, avoiding unnecessary high-interest debt, and prioritising repayment order are common educational themes for debt management.",
        calculators: ["/emi-calculator", "/home-loan-eligibility-calculator"],
      },
    ],
  },
  {
    slug: "income-tax-basics",
    icon: "🧾",
    title: "Income Tax Basics",
    description:
      "Learn how Indian income tax works, regime choices, common deductions, and everyday GST.",
    duration: "50 min",
    difficulty: "Intermediate",
    relatedCalculators: [
      "/income-tax-calculator",
      "/hra-calculator",
      "/gst-calculator",
    ],
    nextPath: "insurance-planning",
    lessons: [
      {
        id: 1,
        title: "Income Tax Overview in India",
        summary:
          "Income tax applies to earnings above basic exemption limits, with progressive slab rates. Surcharges and cess may apply at higher income levels — rules change periodically.",
        calculators: ["/income-tax-calculator"],
      },
      {
        id: 2,
        title: "Old vs New Tax Regime",
        summary:
          "India offers two regimes: the old regime allows many deductions but has higher slab rates; the new regime has lower rates but fewer deductions. The better choice depends on your deductions.",
        calculators: ["/income-tax-calculator"],
      },
      {
        id: 3,
        title: "Section 80C Deductions",
        summary:
          "Section 80C allows deductions up to ₹1.5 lakh for eligible investments and expenses — PPF, ELSS, life insurance premiums, and others. This is one of the most discussed tax-saving areas.",
        calculators: ["/ppf-calculator", "/income-tax-calculator"],
      },
      {
        id: 4,
        title: "HRA Exemption Basics",
        summary:
          "House Rent Allowance (HRA) may be partially exempt if you pay rent and meet conditions. The exempt amount is the lowest of three calculated values — a common salary-planning topic.",
        calculators: ["/hra-calculator", "/income-tax-calculator"],
      },
      {
        id: 5,
        title: "GST in Everyday Purchases",
        summary:
          "Goods and Services Tax (GST) is included in many prices. Understanding whether a quoted price is inclusive or exclusive of GST helps compare costs and read invoices clearly.",
        calculators: ["/gst-calculator"],
      },
    ],
  },
  {
    slug: "insurance-planning",
    icon: "🛡️",
    title: "Insurance Planning",
    description:
      "Understand why insurance exists, how term and health cover work, and how to think about coverage needs.",
    duration: "40 min",
    difficulty: "Beginner",
    relatedCalculators: ["/goal-planner"],
    nextPath: "retirement-planning",
    lessons: [
      {
        id: 1,
        title: "Why Insurance Matters",
        summary:
          "Insurance transfers financial risk from you to an insurer for a premium. It protects against events that could otherwise wipe out savings — illness, accidents, or loss of income.",
        calculators: [],
      },
      {
        id: 2,
        title: "Term Life Insurance",
        summary:
          "Term insurance provides a death benefit for a fixed period at relatively low cost. It is often discussed as pure protection without an investment component.",
        calculators: ["/goal-planner"],
      },
      {
        id: 3,
        title: "Health Insurance",
        summary:
          "Health insurance covers hospitalisation and treatment costs. Medical inflation in India makes standalone health cover an important part of financial planning discussions.",
        calculators: ["/inflation-calculator"],
      },
      {
        id: 4,
        title: "Evaluating Coverage Needs",
        summary:
          "Coverage amounts depend on dependents, liabilities, income, and existing assets. Educational frameworks often suggest term cover as a multiple of annual income — actual needs vary.",
        calculators: ["/goal-planner"],
      },
    ],
  },
  {
    slug: "retirement-planning",
    icon: "🌅",
    title: "Retirement Planning",
    description:
      "Estimate retirement needs, explore EPF, NPS, SWP, and build a long-term corpus timeline.",
    duration: "55 min",
    difficulty: "Intermediate",
    relatedCalculators: [
      "/retirement-calculator",
      "/epf-calculator",
      "/nps-calculator",
      "/swp-calculator",
    ],
    nextPath: "money-basics",
    lessons: [
      {
        id: 1,
        title: "Retirement Corpus Basics",
        summary:
          "Retirement planning estimates how much you need when regular salary income stops. Expenses, inflation, and life expectancy all affect the corpus target — often modelled over decades.",
        calculators: ["/retirement-calculator", "/inflation-calculator"],
      },
      {
        id: 2,
        title: "EPF and Employer Benefits",
        summary:
          "Employee Provident Fund (EPF) is a mandatory retirement savings scheme for eligible salaried employees. Employer and employee contributions build a corpus with tax benefits on withdrawal.",
        calculators: ["/epf-calculator", "/gratuity-calculator"],
      },
      {
        id: 3,
        title: "NPS Overview",
        summary:
          "National Pension System (NPS) is a voluntary retirement scheme with market-linked returns. A portion of the corpus must be used to purchase an annuity at retirement under current rules.",
        calculators: ["/nps-calculator"],
      },
      {
        id: 4,
        title: "SWP for Retirement Income",
        summary:
          "Systematic Withdrawal Plan (SWP) allows regular withdrawals from mutual fund investments. It is one educational approach to generating post-retirement income from a corpus.",
        calculators: ["/swp-calculator", "/retirement-calculator"],
      },
      {
        id: 5,
        title: "Planning Your Retirement Timeline",
        summary:
          "Starting early, increasing contributions with salary growth, and reviewing assumptions every few years are common educational themes. Small changes in return or inflation assumptions can shift outcomes significantly.",
        calculators: ["/retirement-calculator", "/goal-planner"],
      },
    ],
  },
];

const FULL_LESSON_CONTENT = Object.freeze({
  "money-basics/what-is-money": {
    simpleExplanation:
      "Money is something people accept to buy and sell goods or services. It also gives us a common way to compare prices and plan for future needs.",
    whyItMatters:
      "Understanding money makes everyday choices about spending, saving, borrowing, and planning easier to compare.",
    keyIdeas: [
      "Money makes exchange easier than direct barter.",
      "A price helps compare the value of different things.",
      "Saving is setting aside money for a future purpose.",
    ],
    deeperExplanation:
      "Money is often described as a medium of exchange, a unit of account, and a store of value. Inflation matters because it can reduce what the same amount buys over time.",
    example:
      "If a bus ticket costs ₹20 and a notebook costs ₹50, money gives you one common way to compare and pay for both without exchanging another item directly.",
    nextSteps: ["Learn how inflation can change the future cost of everyday items."],
    relatedLessonRefs: ["money-basics/inflation"],
  },
  "mutual-funds-sip/how-sip-works": {
    simpleExplanation:
      "A SIP is a way to put a chosen amount into a market-linked investment at regular intervals, often each month. It describes a contribution pattern, not a promised result.",
    whyItMatters:
      "Knowing the contribution pattern helps you understand calculator illustrations without treating them as market predictions.",
    keyIdeas: [
      "A SIP uses regular contributions instead of one single contribution.",
      "Market values can move up or down between contribution dates.",
      "An assumed return in a calculator is an illustration, not a prediction.",
    ],
    deeperExplanation:
      "Because the contribution amount is regular, the number of units bought can vary with the price at each contribution date. This is often called rupee-cost averaging, but it does not remove investment risk.",
    example:
      "If you illustrate a ₹2,000 monthly SIP, the calculator can show how contribution amount, time, and an assumed return affect a future-value scenario. Actual outcomes can differ.",
    nextSteps: ["Compare a regular SIP contribution with a one-time lumpsum illustration."],
    relatedLessonRefs: ["mutual-funds-sip/lumpsum-vs-sip", "investing-fundamentals/risk-and-return"],
  },
  "loans-emi/understanding-emi": {
    simpleExplanation:
      "An EMI is the regular amount paid to repay a loan. Each payment usually includes both interest and part of the original loan amount.",
    whyItMatters:
      "Understanding an EMI helps you compare educational loan scenarios beyond the monthly amount alone.",
    keyIdeas: [
      "EMI means Equated Monthly Instalment.",
      "A loan’s amount, interest rate, and tenure affect the estimated EMI.",
      "Earlier payments can include more interest than later payments.",
    ],
    deeperExplanation:
      "Many loans use a reducing-balance structure. Interest is calculated on the outstanding balance, so the principal part of an EMI can grow over time while the interest part falls.",
    example:
      "Two loans with the same amount and rate can have different estimated EMIs if one is repaid over fewer months. The shorter period can raise the monthly amount while reducing months in which interest is charged.",
    nextSteps: ["Explore how tenure and prepayment can change an educational loan illustration."],
    relatedLessonRefs: ["loans-emi/how-loans-work", "loans-emi/prepayment-basics"],
  },
  "money-basics/inflation": {
    simpleExplanation: "Inflation means prices can rise over time, so the same money may buy less in the future.",
    whyItMatters: "It helps explain why future goals need more than today’s price.",
    keyIdeas: ["Prices and purchasing power can move in opposite directions.", "Inflation is an assumption in a planning illustration.", "Long time periods make the effect easier to notice."],
    deeperExplanation: "Inflation is not identical for every household or product. A calculator can illustrate a chosen rate, while actual future prices can differ.",
    example: "If a course costs ₹1,000 today, an illustration can show how a selected inflation assumption changes its future cost.",
    nextSteps: ["Explore how inflation connects to saving for a future goal."],
    relatedLessonRefs: ["money-basics/financial-goals", "investing-fundamentals/inflation-and-real-returns"],
  },
  "money-basics/compounding": {
    simpleExplanation: "Compounding means growth can build on both the original amount and earlier growth.",
    whyItMatters: "Time can make a small repeated effect more visible in an illustration.",
    keyIdeas: ["Compounding depends on time and the assumed rate.", "It does not make an outcome certain.", "Contributions and withdrawals can change the illustration."],
    deeperExplanation: "A compounding model applies growth to an evolving balance. Actual market-linked outcomes can vary instead of following one steady rate.",
    example: "A calculator can compare the same starting amount over different time periods using one assumed rate.",
    nextSteps: ["See how regular contributions use the same compounding idea."],
    relatedLessonRefs: ["mutual-funds-sip/how-sip-works", "investing-fundamentals/power-of-compounding"],
  },
  "money-basics/time-value-of-money": {
    simpleExplanation: "A rupee today can be used, saved, or invested before a rupee received later.",
    whyItMatters: "It helps compare costs and goals that happen at different times.",
    keyIdeas: ["Time affects what money can do.", "Inflation can reduce future purchasing power.", "Interest and EMIs use time in different ways."],
    deeperExplanation: "Time value is a framework, not a promise of growth. It is useful when comparing future costs, savings, and borrowing schedules.",
    example: "Paying ₹500 now and ₹500 after a year can have different practical effects because prices and opportunities may change.",
    nextSteps: ["Connect time value to inflation and loan repayments."],
    relatedLessonRefs: ["money-basics/inflation", "loans-emi/how-loans-work"],
  },
  "money-basics/financial-goals": {
    simpleExplanation: "A financial goal names something you want to pay for and the time you have to prepare for it.",
    whyItMatters: "A clear goal makes saving and calculator assumptions easier to discuss.",
    keyIdeas: ["A goal needs a future cost and time horizon.", "Existing savings can reduce a planning gap.", "Plans can be reviewed as circumstances change."],
    deeperExplanation: "Goals can be short, medium, or long term. Different timelines can make inflation, accessibility, and uncertainty matter in different ways.",
    example: "For a future laptop purchase, you can note today’s approximate cost, when you need it, and what you can set aside.",
    nextSteps: ["Try turning a future cost into an educational monthly-saving illustration."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "money-basics/inflation"],
  },
  "saving-budgeting/needs-vs-wants": {
    simpleExplanation: "Needs are essential costs; wants are costs that may improve comfort or enjoyment but can often be adjusted.",
    whyItMatters: "This distinction can make a monthly budget easier to review without judging every purchase.",
    keyIdeas: ["Categories can change with a person’s situation.", "Essential costs deserve attention first.", "A budget is a tool for awareness, not a punishment."],
    deeperExplanation: "The same expense may be a need for one household and a want for another. The value is in discussing priorities openly.",
    example: "Rent and basic food may be needs, while an extra streaming subscription may be a flexible cost.",
    nextSteps: ["Use the distinction to build a simple monthly budget."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "saving-budgeting/tracking-expenses"],
  },
  "saving-budgeting/building-a-monthly-budget": {
    simpleExplanation: "A budget is a simple plan for assigning income to essential costs, flexible costs, saving, and goals.",
    whyItMatters: "It can reveal whether money has a clear purpose before it is spent.",
    keyIdeas: ["Start with income and regular essentials.", "Include irregular costs where possible.", "Any ratio is an educational starting point, not a rule."],
    deeperExplanation: "A budget can be adjusted when income, family needs, or costs change. Tracking actual spending helps improve the next version.",
    example: "List monthly rent, food, travel, bills, savings, and flexible spending to see what remains.",
    nextSteps: ["Review how an emergency fund can fit into a budget."],
    relatedLessonRefs: ["saving-budgeting/emergency-funds", "saving-budgeting/tracking-expenses"],
  },
  "saving-budgeting/emergency-funds": {
    simpleExplanation: "An emergency fund is accessible money set aside for unexpected expenses or a temporary loss of income.",
    whyItMatters: "It can reduce the need to rely immediately on borrowing when an unexpected cost appears.",
    keyIdeas: ["Accessibility matters for an emergency fund.", "Building gradually is still progress.", "The suitable amount depends on personal circumstances."],
    deeperExplanation: "Educational guides often discuss several months of essential expenses, but the appropriate approach can vary with income stability, dependents, debt, and support systems.",
    example: "A repair bill can be handled from money set aside for emergencies instead of changing a long-term goal plan.",
    nextSteps: ["See how regular saving habits can help build a buffer."],
    relatedLessonRefs: ["saving-budgeting/saving-strategies", "saving-budgeting/building-a-monthly-budget"],
  },
  "saving-budgeting/saving-strategies": {
    simpleExplanation: "Saving strategies are repeatable habits that set money aside before flexible spending uses it.",
    whyItMatters: "A regular process can be easier to maintain than relying on a large leftover amount.",
    keyIdeas: ["Small regular amounts can add up.", "Separate goal money can improve visibility.", "A strategy should fit changing circumstances."],
    deeperExplanation: "Automation can support consistency, but it should leave room for essentials and unexpected changes. It is a habit, not a guarantee of reaching a goal.",
    example: "Setting aside a chosen amount after income arrives can make the remaining spending limit clearer.",
    nextSteps: ["Track spending to identify a realistic amount to save."],
    relatedLessonRefs: ["saving-budgeting/tracking-expenses", "money-basics/financial-goals"],
  },
  "saving-budgeting/tracking-expenses": {
    simpleExplanation: "Tracking expenses means recording where money goes so spending patterns become visible.",
    whyItMatters: "Patterns are easier to change after they are seen clearly.",
    keyIdeas: ["Use categories that make sense to you.", "Review both small and recurring costs.", "Compare plans with actual spending without blame."],
    deeperExplanation: "A short review period can be enough to find recurring subscriptions, timing issues, or costs that need a better category.",
    example: "Recording food, transport, bills, and optional purchases for a month can show which categories vary most.",
    nextSteps: ["Use what you notice to revise a monthly budget."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "saving-budgeting/needs-vs-wants"],
  },
  "investing-fundamentals/risk-and-return": {
    simpleExplanation: "Risk is the possibility that an outcome differs from what you expected; return is the change in value or income over time.",
    whyItMatters: "Understanding both helps you read an investment illustration without treating a higher number as certain.",
    keyIdeas: ["Potential return and uncertainty often move together.", "Past results do not predict future outcomes.", "Time horizon can affect how people discuss volatility."],
    deeperExplanation: "Different assets can behave differently in changing conditions. Risk also includes needing money sooner than planned, not only market movement.",
    example: "A market-linked illustration can show several assumptions, while a deposit illustration uses stated deposit assumptions.",
    nextSteps: ["Learn how asset classes can behave differently."],
    relatedLessonRefs: ["investing-fundamentals/asset-classes-in-india", "investing-fundamentals/inflation-and-real-returns"],
  },
  "investing-fundamentals/asset-classes-in-india": {
    simpleExplanation: "Asset classes are broad groups of investments, such as equity, debt, gold, real estate, and deposits.",
    whyItMatters: "The label helps explain why two investments may have different risks, access rules, and return patterns.",
    keyIdeas: ["Each asset class has different characteristics.", "Diversification means not relying on one type alone.", "A category does not guarantee a result."],
    deeperExplanation: "Assets can react differently to economic conditions. Learning the terms first is different from selecting an investment.",
    example: "A fixed deposit and an equity fund use different return structures and may behave differently over time.",
    nextSteps: ["Explore how compounding and inflation affect long-term illustrations."],
    relatedLessonRefs: ["investing-fundamentals/risk-and-return", "investing-fundamentals/power-of-compounding"],
  },
  "investing-fundamentals/power-of-compounding": {
    simpleExplanation: "Compounding can make earlier contributions matter for longer because growth is calculated on an evolving balance.",
    whyItMatters: "It explains why time is a useful input in educational investment calculators.",
    keyIdeas: ["Earlier contributions have more time in an illustration.", "Assumed returns are not actual results.", "Regular contributions can change the balance over time."],
    deeperExplanation: "The effect depends on contribution timing, withdrawals, fees, taxes, and actual performance. A simple model cannot represent every real-world change.",
    example: "Two equal monthly contributions can produce different illustrated values when one continues for more years.",
    nextSteps: ["Compare how inflation affects the value of a future amount."],
    relatedLessonRefs: ["money-basics/compounding", "investing-fundamentals/inflation-and-real-returns"],
  },
  "investing-fundamentals/inflation-and-real-returns": {
    simpleExplanation: "Real return looks at growth after considering how inflation can reduce purchasing power.",
    whyItMatters: "A future amount may be larger in rupees while buying power changes differently.",
    keyIdeas: ["Nominal return is before inflation.", "Real return is an educational comparison concept.", "Inflation is not fixed."],
    deeperExplanation: "Subtracting inflation from return is a simple approximation. Taxes, fees, timing, and changing prices can make real outcomes more complex.",
    example: "An illustration with 8% growth and 5% inflation suggests a rough 3% real change before other factors.",
    nextSteps: ["Connect inflation to a long-term financial goal."],
    relatedLessonRefs: ["money-basics/inflation", "money-basics/financial-goals"],
  },
  "investing-fundamentals/getting-started-with-investing": {
    simpleExplanation: "Getting started means first understanding goals, time horizon, uncertainty, and accessible savings before making decisions.",
    whyItMatters: "It encourages learning before acting on a product or a short-term market movement.",
    keyIdeas: ["Goals and timelines shape questions.", "Emergency savings can be considered separately from long-term plans.", "A calculator illustrates assumptions, not suitability."],
    deeperExplanation: "There is no universal starting product. Educational tools can help compare concepts without selecting an investment.",
    example: "A learner can first compare a goal timeline, a regular contribution illustration, and the effect of inflation.",
    nextSteps: ["Learn how mutual funds and SIP contribution patterns work."],
    relatedLessonRefs: ["mutual-funds-sip/what-are-mutual-funds", "mutual-funds-sip/how-sip-works"],
  },
  "mutual-funds-sip/what-are-mutual-funds": {
    simpleExplanation: "A mutual fund pools money from many investors and invests it according to a stated objective.",
    whyItMatters: "It introduces the difference between a fund structure and the contribution method called a SIP.",
    keyIdeas: ["Funds can hold different types of assets.", "A fund objective describes its intended approach.", "Market-linked values can change."],
    deeperExplanation: "Some funds are managed by a fund manager while others follow an index methodology. Learning the structure does not select a fund for anyone.",
    example: "A fund may hold many securities, so one contribution can be connected to a portfolio rather than one company share.",
    nextSteps: ["See how a SIP is a regular contribution pattern."],
    relatedLessonRefs: ["mutual-funds-sip/how-sip-works", "investing-fundamentals/asset-classes-in-india"],
  },
  "mutual-funds-sip/lumpsum-vs-sip": {
    simpleExplanation: "A lumpsum is one contribution at a time; a SIP uses regular contributions over time.",
    whyItMatters: "The difference is about contribution timing, not a universal winner.",
    keyIdeas: ["Both approaches can use market-linked investments.", "Cash-flow timing differs.", "Illustrations depend on assumptions and dates."],
    deeperExplanation: "Different contribution patterns can experience different market conditions. Neither approach removes uncertainty or guarantees an outcome.",
    example: "A calculator can compare an assumed monthly contribution with one assumed one-time amount over a chosen period.",
    nextSteps: ["Learn how CAGR describes growth across a period."],
    relatedLessonRefs: ["mutual-funds-sip/how-sip-works", "mutual-funds-sip/understanding-cagr"],
  },
  "mutual-funds-sip/understanding-cagr": {
    simpleExplanation: "CAGR is an annualised rate that connects a starting value to an ending value over a period.",
    whyItMatters: "It gives one way to compare growth across periods of different lengths.",
    keyIdeas: ["CAGR smooths a path into one annual figure.", "It does not show year-to-year movement.", "Past CAGR does not predict future returns."],
    deeperExplanation: "CAGR can hide volatility and the order of returns. It is a comparison measure, not a forecast.",
    example: "If one amount grows from ₹100 to ₹121 over two years, CAGR describes the steady annual rate that would connect those values.",
    nextSteps: ["Use a calculator to explore annualised growth across a period."],
    relatedLessonRefs: ["investing-fundamentals/risk-and-return", "mutual-funds-sip/reviewing-fund-performance"],
  },
  "mutual-funds-sip/reviewing-fund-performance": {
    simpleExplanation: "Reviewing performance means looking beyond one recent return number and understanding the period and context.",
    whyItMatters: "Short periods can be noisy and may not explain how a fund behaved across changing conditions.",
    keyIdeas: ["Compare like with like.", "Costs and objective matter alongside returns.", "Past performance is not a promise."],
    deeperExplanation: "A complete review can involve benchmark, risk, portfolio, costs, and time horizon. This lesson explains what to ask, not what to choose.",
    example: "A five-year return can describe one past period, while a different five-year period may have looked different.",
    nextSteps: ["Return to investing fundamentals to revisit risk and return."],
    relatedLessonRefs: ["mutual-funds-sip/understanding-cagr", "investing-fundamentals/risk-and-return"],
  },
  "loans-emi/how-loans-work": {
    simpleExplanation: "A loan provides money now that is repaid over time, usually with interest and possible charges.",
    whyItMatters: "Looking beyond the monthly payment helps explain the total borrowing cost.",
    keyIdeas: ["Principal is the amount borrowed.", "Interest is the borrowing cost.", "Tenure is the repayment period."],
    deeperExplanation: "Loan terms can vary by lender and product. Educational calculators simplify the relationship between amount, rate, and tenure.",
    example: "Two loans with the same amount can have different total interest when their repayment periods differ.",
    nextSteps: ["Learn how an EMI divides a repayment into regular payments."],
    relatedLessonRefs: ["loans-emi/understanding-emi", "loans-emi/fixed-vs-floating-rates"],
  },
  "loans-emi/fixed-vs-floating-rates": {
    simpleExplanation: "A fixed rate stays unchanged for a stated period, while a floating rate can change under the loan’s terms.",
    whyItMatters: "A changing rate can affect future repayment assumptions and monthly cash-flow planning.",
    keyIdeas: ["Terms define how a rate may change.", "A fixed period may not last for the full loan.", "Loan documents matter."],
    deeperExplanation: "Floating-rate changes can affect EMI, tenure, or both depending on lender terms. An educational calculator cannot replace those terms.",
    example: "A higher assumed loan rate can show a higher estimated EMI for the same amount and tenure.",
    nextSteps: ["Explore how prepayment changes an outstanding loan illustration."],
    relatedLessonRefs: ["loans-emi/understanding-emi", "loans-emi/prepayment-basics"],
  },
  "loans-emi/prepayment-basics": {
    simpleExplanation: "Prepayment is an additional payment toward a loan before its scheduled end date.",
    whyItMatters: "It can change the remaining balance and future interest in an illustration.",
    keyIdeas: ["Timing and amount can matter.", "Lender charges or rules may apply.", "A prepayment may affect tenure or EMI under lender terms."],
    deeperExplanation: "Actual prepayment outcomes depend on the outstanding balance and loan agreement. The calculator is educational, not a lender statement.",
    example: "Entering an assumed extra payment can illustrate how reducing the balance earlier may change future interest.",
    nextSteps: ["Review how loan terms and debt habits affect repayment planning."],
    relatedLessonRefs: ["loans-emi/how-loans-work", "loans-emi/managing-debt-wisely"],
  },
  "loans-emi/managing-debt-wisely": {
    simpleExplanation: "Managing debt means understanding what is owed, when payments are due, and how borrowing fits within the rest of a budget.",
    whyItMatters: "Clear information can make repayment questions less overwhelming.",
    keyIdeas: ["List repayments and their terms.", "Separate monthly payment from total cost.", "Avoid treating a calculator result as lender approval."],
    deeperExplanation: "Repayment priorities and affordability depend on individual circumstances. This lesson provides concepts, not a personal repayment instruction.",
    example: "Writing down each payment date, balance, and rate can show which questions need more information.",
    nextSteps: ["Return to budgeting to connect repayments with monthly cash flow."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "loans-emi/prepayment-basics"],
  },
  "income-tax-basics/income-tax-overview-in-india": {
    simpleExplanation: "Income tax is a tax on eligible income under rules that can change over time.",
    whyItMatters: "Knowing the basic terms helps you read a salary document or calculator result more carefully.",
    keyIdeas: ["Taxable income is not always the same as total income.", "Rules and thresholds can change.", "A calculator is an educational estimate."],
    deeperExplanation: "Tax outcomes can depend on income type, deductions, exemptions, and current law. Official sources or qualified support are appropriate for a personal filing question.",
    example: "A calculator can illustrate how selected income and deduction inputs affect an estimated tax result.",
    nextSteps: ["Learn how regime comparisons use different assumptions."],
    relatedLessonRefs: ["income-tax-basics/old-vs-new-tax-regime", "income-tax-basics/hra-exemption-basics"],
  },
  "income-tax-basics/old-vs-new-tax-regime": {
    simpleExplanation: "Tax regimes can apply different rates, deductions, and exemptions under current rules.",
    whyItMatters: "It explains why two people with similar income may need different information before comparing an estimate.",
    keyIdeas: ["Rules can change.", "Deductions and exemptions can affect a comparison.", "A general lesson cannot determine a personal tax choice."],
    deeperExplanation: "A comparison should use the rules and documents applicable to the relevant period. Verify current official guidance before filing or acting.",
    example: "Two illustrative calculator scenarios can differ when one includes eligible deductions and the other does not.",
    nextSteps: ["Understand common deduction terminology before using a calculator."],
    relatedLessonRefs: ["income-tax-basics/section-80c-deductions", "income-tax-basics/income-tax-overview-in-india"],
  },
  "income-tax-basics/section-80c-deductions": {
    simpleExplanation: "Section 80C is a commonly discussed tax provision that may allow deductions for eligible items under current rules.",
    whyItMatters: "It helps explain why some savings and protection products appear in tax discussions.",
    keyIdeas: ["Eligibility and limits can change.", "Not every payment qualifies.", "Documentation matters."],
    deeperExplanation: "This lesson does not calculate eligibility or tell you what to use. Check current official information for the relevant assessment period.",
    example: "A tax calculator may ask for an eligible deduction input as part of an educational estimate.",
    nextSteps: ["Learn how a tax estimate differs from filing a return."],
    relatedLessonRefs: ["income-tax-basics/income-tax-overview-in-india", "income-tax-basics/old-vs-new-tax-regime"],
  },
  "income-tax-basics/hra-exemption-basics": {
    simpleExplanation: "HRA is a salary component that may receive tax treatment when conditions under current rules are met.",
    whyItMatters: "It explains why rent, salary components, and location details can appear in an HRA illustration.",
    keyIdeas: ["Eligibility depends on applicable conditions.", "The calculation uses multiple inputs.", "Official verification is important."],
    deeperExplanation: "HRA treatment can depend on records and current tax provisions. A calculator explains the arithmetic but cannot confirm a personal exemption.",
    example: "Entering illustrative salary and rent details can show how the calculator compares its stated inputs.",
    nextSteps: ["Explore the difference between tax concepts and compliance."],
    relatedLessonRefs: ["income-tax-basics/income-tax-overview-in-india", "income-tax-basics/gst-in-everyday-purchases"],
  },
  "income-tax-basics/gst-in-everyday-purchases": {
    simpleExplanation: "GST is a tax that may be included in, or added to, the price of many goods and services.",
    whyItMatters: "It helps you read whether a quoted amount already includes tax.",
    keyIdeas: ["Inclusive and exclusive prices mean different things.", "Applicable rates can vary by transaction.", "A calculator performs arithmetic, not compliance."],
    deeperExplanation: "GST treatment depends on the nature of the supply and current rules. Use official guidance for an invoicing or compliance question.",
    example: "A GST calculator can add or remove an assumed GST percentage from an illustrative amount.",
    nextSteps: ["Return to money basics to connect price, tax, and budgeting."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "income-tax-basics/income-tax-overview-in-india"],
  },
  "insurance-planning/why-insurance-matters": {
    simpleExplanation: "Insurance is a contract that can transfer specified financial risks to an insurer in return for a premium.",
    whyItMatters: "It helps separate protection planning from saving or investing.",
    keyIdeas: ["Policies have conditions and exclusions.", "Cover is not the same as every possible expense.", "Reading terms matters."],
    deeperExplanation: "Insurance can address particular risks, but policy benefits depend on the contract and claim conditions. This lesson does not select a policy.",
    example: "A policy may specify what event is covered, what documents are needed, and what exclusions apply.",
    nextSteps: ["Learn how life and health cover address different types of risk."],
    relatedLessonRefs: ["insurance-planning/term-life-insurance", "insurance-planning/health-insurance"],
  },
  "insurance-planning/term-life-insurance": {
    simpleExplanation: "Term life insurance generally provides a stated death benefit during a chosen cover period, subject to policy terms.",
    whyItMatters: "It explains why protection products are discussed separately from investment products.",
    keyIdeas: ["Cover period and policy terms matter.", "A premium is not an investment return.", "Claims depend on policy conditions."],
    deeperExplanation: "The suitable type or amount of cover depends on personal circumstances and policy terms. This is educational information, not an insurance recommendation.",
    example: "A learner can compare the meaning of cover period, premium, nominee, and exclusion without selecting a provider.",
    nextSteps: ["Explore how dependents and liabilities affect protection questions."],
    relatedLessonRefs: ["insurance-planning/evaluating-coverage-needs", "insurance-planning/why-insurance-matters"],
  },
  "insurance-planning/health-insurance": {
    simpleExplanation: "Health insurance can help with eligible medical costs according to a policy’s coverage, limits, and exclusions.",
    whyItMatters: "Medical costs can disrupt a budget, so understanding policy terms is part of financial awareness.",
    keyIdeas: ["Coverage and exclusions must be read together.", "Waiting periods and limits can matter.", "A policy is not a guarantee that every bill is paid."],
    deeperExplanation: "Medical and policy situations vary. Use the insurer’s current policy wording and qualified support for a claim or product question.",
    example: "A policy may cover an eligible hospital expense while applying a stated limit or exclusion.",
    nextSteps: ["Learn how to frame protection needs as questions rather than assumptions."],
    relatedLessonRefs: ["insurance-planning/evaluating-coverage-needs", "insurance-planning/why-insurance-matters"],
  },
  "insurance-planning/evaluating-coverage-needs": {
    simpleExplanation: "Evaluating coverage needs means identifying financial risks, people who depend on income, and existing protection.",
    whyItMatters: "It helps turn a vague protection question into information you can review carefully.",
    keyIdeas: ["Dependents and liabilities can matter.", "Existing employer benefits may have limits.", "A framework is not a personal recommendation."],
    deeperExplanation: "Educational heuristics can be useful prompts, but they cannot determine an appropriate cover amount or policy for an individual.",
    example: "A household can list recurring expenses, dependents, debts, and existing benefits as questions to investigate.",
    nextSteps: ["Return to budgeting to see how protection fits into broader planning."],
    relatedLessonRefs: ["saving-budgeting/building-a-monthly-budget", "insurance-planning/term-life-insurance"],
  },
  "retirement-planning/retirement-corpus-basics": {
    simpleExplanation: "A retirement corpus is money set aside to support spending after regular work income changes or stops.",
    whyItMatters: "It connects future living costs, time, inflation, and saving assumptions in one planning question.",
    keyIdeas: ["Future expenses can differ from today’s expenses.", "Inflation can affect future costs.", "A corpus estimate is illustrative."],
    deeperExplanation: "Retirement projections depend on lifespan, spending, inflation, contribution timing, and assumed returns. They are scenarios, not fixed targets.",
    example: "A calculator can illustrate how changing a future monthly expense or timeline affects a corpus estimate.",
    nextSteps: ["Explore how EPF and other retirement-related concepts fit into a plan."],
    relatedLessonRefs: ["retirement-planning/epf-and-employer-benefits", "retirement-planning/planning-your-retirement-timeline"],
  },
  "retirement-planning/epf-and-employer-benefits": {
    simpleExplanation: "EPF is a retirement-related savings arrangement for eligible employees under rules that can change.",
    whyItMatters: "It helps explain why employee and employer contributions may appear in long-term planning.",
    keyIdeas: ["Eligibility and rules are statutory.", "Account details matter.", "A calculator is not an account statement."],
    deeperExplanation: "Contribution treatment, interest crediting, and withdrawal rules should be checked against current official information and account records.",
    example: "An EPF calculator can illustrate contributions under its stated assumptions without confirming an account balance.",
    nextSteps: ["Learn how NPS is another retirement-related concept with different rules."],
    relatedLessonRefs: ["retirement-planning/nps-overview", "retirement-planning/retirement-corpus-basics"],
  },
  "retirement-planning/nps-overview": {
    simpleExplanation: "NPS is a retirement-focused scheme with features and rules that require current official verification.",
    whyItMatters: "It introduces how a long-term retirement scheme can differ from a simple savings account.",
    keyIdeas: ["Outcomes can be market-linked.", "Scheme rules can change.", "Calculator results are educational illustrations."],
    deeperExplanation: "Contribution, withdrawal, tax, and annuity treatment depend on current scheme terms. This lesson does not provide an NPS action or suitability recommendation.",
    example: "An NPS calculator can show how selected contribution and return assumptions change an illustrative long-term value.",
    nextSteps: ["Understand how a withdrawal plan can be modelled from a retirement corpus."],
    relatedLessonRefs: ["retirement-planning/swp-for-retirement-income", "retirement-planning/epf-and-employer-benefits"],
  },
  "retirement-planning/swp-for-retirement-income": {
    simpleExplanation: "An SWP is a pattern of taking regular withdrawals from an investment corpus under chosen assumptions.",
    whyItMatters: "It helps explain why retirement income depends on both withdrawals and how the remaining corpus changes.",
    keyIdeas: ["Withdrawal amount and timing matter.", "Actual returns can vary.", "A corpus may not last as an illustration assumes."],
    deeperExplanation: "Changing returns, taxes, fees, and withdrawal sequence can affect results. An SWP model is not a pension guarantee.",
    example: "A calculator can illustrate regular withdrawals from an assumed corpus over a selected period.",
    nextSteps: ["Review the assumptions behind a retirement timeline."],
    relatedLessonRefs: ["retirement-planning/retirement-corpus-basics", "retirement-planning/planning-your-retirement-timeline"],
  },
  "retirement-planning/planning-your-retirement-timeline": {
    simpleExplanation: "A retirement timeline links the years until retirement, future spending, existing savings, and regular contributions.",
    whyItMatters: "It makes a distant goal easier to break into assumptions that can be reviewed over time.",
    keyIdeas: ["Timelines can change.", "Inflation and return assumptions matter.", "Reviewing a plan can be more useful than relying on one result."],
    deeperExplanation: "A longer timeline can increase the effect of assumptions, but it also increases uncertainty. Educational models should be revisited when circumstances change.",
    example: "Changing the assumed retirement age in a calculator can show how a different contribution period affects an illustration.",
    nextSteps: ["Return to financial goals and inflation for the building blocks of long-term planning."],
    relatedLessonRefs: ["money-basics/financial-goals", "money-basics/inflation"],
  },
});

function toLessonSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/(^-|-$)/gu, "");
}

function createLesson(path, lesson) {
  const slug = lesson.slug ?? toLessonSlug(lesson.title);
  const contentKey = `${path.slug}/${slug}`;
  const fullContent = FULL_LESSON_CONTENT[contentKey] ?? null;

  return {
    ...lesson,
    id: `${path.slug}:${slug}`,
    slug,
    pathSlug: path.slug,
    level: path.difficulty,
    estimatedMinutes: lesson.estimatedMinutes ?? 5,
    calculatorLinks: lesson.calculators ?? [],
    relatedLessonIds: fullContent?.relatedLessonRefs?.map((reference) => reference.replace("/", ":")) ?? [],
    contentStatus: fullContent ? "complete" : "preview",
    simpleExplanation: fullContent?.simpleExplanation ?? null,
    whyItMatters: fullContent?.whyItMatters ?? null,
    keyIdeas: fullContent?.keyIdeas ?? [],
    deeperExplanation: fullContent?.deeperExplanation ?? null,
    example: fullContent?.example ?? null,
    nextSteps: fullContent?.nextSteps ?? [],
  };
}

export const LEARNING_PATHS = RAW_LEARNING_PATHS.map((path) => ({
  ...path,
  lessons: path.lessons.map((lesson) => createLesson(path, lesson)),
}));

export const LEARN_DISCOVERY_TOPICS = Object.freeze([
  { id: "all", label: "All" },
  { id: "money", label: "Money", pathSlugs: ["money-basics"] },
  { id: "saving", label: "Saving", pathSlugs: ["saving-budgeting"] },
  { id: "investing", label: "Investing", pathSlugs: ["investing-fundamentals", "mutual-funds-sip"] },
  { id: "loans", label: "Loans", pathSlugs: ["loans-emi"] },
  { id: "tax", label: "Tax", pathSlugs: ["income-tax-basics"] },
  { id: "protection", label: "Protection", pathSlugs: ["insurance-planning"] },
  { id: "retirement", label: "Retirement", pathSlugs: ["retirement-planning"] },
]);

export const LEARN_START_OPTIONS = Object.freeze([
  { label: "Money basics", pathSlug: "money-basics" },
  { label: "Save and budget better", pathSlug: "saving-budgeting" },
  { label: "Start investing", pathSlug: "investing-fundamentals" },
  { label: "Understand loans", pathSlug: "loans-emi" },
  { label: "Understand taxes", pathSlug: "income-tax-basics" },
  { label: "Plan retirement", pathSlug: "retirement-planning" },
  { label: "Protect my finances", pathSlug: "insurance-planning" },
  { label: "I’m not sure where to start", pathSlug: "money-basics" },
]);

export const LEARN_PATH_CONNECTIONS = Object.freeze({
  "money-basics": { journeyPath: "/journeys/build-wealth" },
  "saving-budgeting": { healthPath: "/financial-health-score", journeyPath: "/journeys/build-wealth" },
  "investing-fundamentals": { journeyPath: "/journeys/build-wealth" },
  "mutual-funds-sip": { journeyPath: "/journeys/build-wealth" },
  "loans-emi": { healthPath: "/financial-health-score", journeyPath: "/journeys/become-debt-free" },
  "income-tax-basics": { journeyPath: "/journeys/save-tax" },
  "insurance-planning": { healthPath: "/financial-health-score" },
  "retirement-planning": { journeyPath: "/journeys/retirement-planning" },
});

export const LEARN_JOURNEY_DESTINATIONS = Object.freeze(
  [...new Set(Object.values(LEARN_PATH_CONNECTIONS).map((connection) => connection.journeyPath).filter(Boolean))],
);

export const LEARN_SEARCH_SYNONYMS = Object.freeze({
  budget: ["saving-budgeting"],
  savings: ["saving-budgeting"],
  emergency: ["saving-budgeting"],
  money: ["money-basics"],
  inflation: ["money-basics", "investing-fundamentals", "retirement-planning"],
  invest: ["investing-fundamentals", "mutual-funds-sip"],
  sip: ["mutual-funds-sip"],
  mutual: ["mutual-funds-sip"],
  emi: ["loans-emi"],
  loan: ["loans-emi"],
  tax: ["income-tax-basics"],
  hra: ["income-tax-basics"],
  gst: ["income-tax-basics"],
  insurance: ["insurance-planning"],
  retirement: ["retirement-planning"],
  pension: ["retirement-planning"],
});

export function getLearningPathBySlug(slug) {
  return LEARNING_PATHS.find((path) => path.slug === slug) ?? null;
}

export function getLessonByRoute(pathSlug, lessonSlug) {
  const path = getLearningPathBySlug(pathSlug);
  return path?.lessons.find((lesson) => lesson.slug === lessonSlug) ?? null;
}

export function getLessonById(lessonId) {
  return LEARNING_PATHS.flatMap((path) => path.lessons).find((lesson) => lesson.id === lessonId) ?? null;
}

export function getLessonCount(path) {
  return path.lessons.length;
}
