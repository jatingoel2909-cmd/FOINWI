import { FULL_LESSON_CONTENT } from "./learnLessonContent.js";

export const LEARN_ACADEMY_NOTICE =
  "Learning content is for educational purposes only and should not be considered financial, investment, tax, legal, or loan advice.";

const RAW_LEARNING_PATHS = [
  {
    slug: "money-basics",
    icon: "💡",
    title: "Money Basics",
    description:
      "Build a clear foundation — what money is, how inflation erodes value, and why compounding and goals matter.",
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
          "Higher potential gains usually come with a wider range of outcomes, including losses. Equity prices can move more than a fixed deposit's contracted terms. Neither result is assured in advance.",
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
          "A nominal rupee gain can still buy less if prices rise. Subtracting an inflation assumption from a growth assumption is only a shortcut. The lesson shows a closer one-year comparison.",
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
          "For a salaried person, CTC, take-home pay, and the income used in a tax estimate are different figures. FOINWI's income-tax calculator prints the year it illustrates. Slab numbers and deductions can change.",
        calculators: ["/income-tax-calculator"],
      },
      {
        id: 2,
        title: "Old vs New Tax Regime",
        summary:
          "A default regime and an opt-out regime can treat deductions differently, so the same salary can produce two educational estimates. Compare them for the year printed on the tool. The tool does not choose a regime for you.",
        calculators: ["/income-tax-calculator"],
      },
      {
        id: 3,
        title: "Section 80C Deductions",
        summary:
          "People often use the name section 80C for payments that may reduce taxable income under a regime that allows them. A qualifying deduction is not a refund of the amount paid. The cap and the eligible list have to be read for the relevant year.",
        calculators: ["/ppf-calculator", "/income-tax-calculator"],
      },
      {
        id: 4,
        title: "HRA Exemption Basics",
        summary:
          "House Rent Allowance may be partly excluded under Rule 279 for FY 2026-27 where a person has opted out of the default tax regime under section 202, actually pays rent for occupied accommodation, and meets the other applicable conditions. The estimated exempt amount is the smaller of three Rule 279 figures.",
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
          "Term life insurance pays a stated death benefit if the insured person dies during the term, subject to the policy. A pure term premium buys that cover. It is not a maturity value.",
        calculators: ["/goal-planner"],
      },
      {
        id: 3,
        title: "Health Insurance",
        summary:
          "Health insurance can pay eligible medical costs up to a policy limit, after waiting periods, exclusions, and sub-limits. A headline sum is not a promise that every bill is paid.",
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
      "Explore retirement illustrations, EPF, NPS, SWP, and a long-term corpus timeline.",
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
          "Retirement planning illustrations often start from future spending, inflation, and a visitor-selected number of years in retirement. These are educational scenarios, not a prediction of how long savings will last.",
        calculators: ["/retirement-calculator", "/inflation-calculator"],
      },
      {
        id: 2,
        title: "EPF and Employer Benefits",
        summary:
          "EPF is a retirement-related scheme for many eligible salaried employees. The passbook is the balance record. FOINWI's EPF calculator is an illustration of one membership pattern, not that passbook, and it does not compute withdrawal tax.",
        calculators: ["/epf-calculator", "/gratuity-calculator"],
      },
      {
        id: 3,
        title: "NPS Overview",
        summary:
          "National Pension System (NPS) is a voluntary retirement scheme with market-linked returns. Exit and annuity rules depend on subscriber type, exit path, and corpus size. FOINWI’s calculator illustrates one non-Government All Citizen normal-exit case.",
        calculators: ["/nps-calculator"],
      },
      {
        id: 4,
        title: "SWP for Retirement Income",
        summary:
          "A systematic withdrawal plan takes a chosen amount out of a mutual-fund corpus on a schedule. It is not a pension. Costs, tax, and market values can shrink what remains.",
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

function toLessonSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/(^-|-$)/gu, "");
}

function countWords(value) {
  return String(value ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function lessonReadingMinutes(summary, fullContent) {
  const words = [
    summary,
    fullContent?.simpleExplanation,
    fullContent?.whyItMatters,
    ...(fullContent?.keyIdeas ?? []),
    fullContent?.deeperExplanation,
    fullContent?.example,
    fullContent?.workedIllustration,
    ...(fullContent?.assumptions ?? []),
    ...(fullContent?.commonMistakes ?? []),
    ...(fullContent?.limitations ?? []),
    ...(fullContent?.sources ?? []),
    ...(fullContent?.nextSteps ?? []),
  ].reduce((sum, part) => sum + countWords(part), 0);

  return Math.max(2, Math.round(words / 200));
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
    estimatedMinutes: fullContent
      ? lessonReadingMinutes(lesson.summary, fullContent)
      : (lesson.estimatedMinutes ?? 5),
    calculatorLinks: lesson.calculators ?? [],
    relatedLessonIds: fullContent?.relatedLessonRefs?.map((reference) => reference.replace("/", ":")) ?? [],
    contentStatus: fullContent ? "complete" : "preview",
    simpleExplanation: fullContent?.simpleExplanation ?? null,
    whyItMatters: fullContent?.whyItMatters ?? null,
    keyIdeas: fullContent?.keyIdeas ?? [],
    deeperExplanation: fullContent?.deeperExplanation ?? null,
    example: fullContent?.example ?? null,
    workedIllustration: fullContent?.workedIllustration ?? "",
    assumptions: fullContent?.assumptions ?? [],
    commonMistakes: fullContent?.commonMistakes ?? [],
    limitations: fullContent?.limitations ?? [],
    sources: fullContent?.sources ?? [],
    nextSteps: fullContent?.nextSteps ?? [],
  };
}

export function getPathDurationMinutes(lessons = []) {
  return lessons.reduce((sum, lesson) => (
    sum + (Number.isFinite(lesson.estimatedMinutes) ? lesson.estimatedMinutes : 0)
  ), 0);
}

export const LEARNING_PATHS = RAW_LEARNING_PATHS.map((path) => {
  const lessons = path.lessons.map((lesson) => createLesson(path, lesson));
  const durationMinutes = getPathDurationMinutes(lessons);

  return {
    ...path,
    lessons,
    durationMinutes,
    duration: `${durationMinutes} min`,
  };
});

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
