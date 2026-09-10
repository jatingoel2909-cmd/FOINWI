/**
 * FOINWI Knowledge Graph — financial concepts (not pages).
 * Phase 4 Sprint 1: foundational concept registry.
 */

export const CONCEPT_CATEGORIES = [
  "savings",
  "investing",
  "debt",
  "protection",
  "planning",
  "tax",
];

export const CONCEPT_DIFFICULTIES = ["beginner", "intermediate", "advanced"];

export const FINANCIAL_CONCEPTS = {
  savings: {
    id: "savings",
    title: "Savings",
    description:
      "The habit of setting aside part of income before spending. Savings create the foundation for emergency buffers, goals, and future investing.",
    difficulty: "beginner",
    category: "savings",
    tags: ["income", "habits", "foundation", "cash-flow"],
    relatedConcepts: ["budgeting", "emergency-fund", "goal-planning", "fd", "rd"],
    relatedCalculators: ["/goal-planner", "/fd-calculator", "/rd-calculator"],
    relatedLessons: ["money-basics", "saving-budgeting"],
    relatedJourneys: ["build-wealth", "protect-your-family"],
    relatedHealthTopics: ["savings", "planning"],
    learningOrder: 1,
  },

  budgeting: {
    id: "budgeting",
    title: "Budgeting",
    description:
      "Mapping income to expense categories so spending aligns with priorities. A budget makes saving intentional rather than accidental.",
    difficulty: "beginner",
    category: "savings",
    tags: ["expenses", "income", "50-30-20", "tracking"],
    relatedConcepts: ["savings", "emergency-fund", "debt", "goal-planning"],
    relatedCalculators: ["/goal-planner"],
    relatedLessons: ["saving-budgeting", "money-basics"],
    relatedJourneys: ["build-wealth", "become-debt-free"],
    relatedHealthTopics: ["savings", "debt"],
    learningOrder: 2,
  },

  "emergency-fund": {
    id: "emergency-fund",
    title: "Emergency Fund",
    description:
      "A dedicated reserve for unexpected expenses — typically discussed as three to six months of essential costs — kept separate from long-term investments.",
    difficulty: "beginner",
    category: "protection",
    tags: ["liquidity", "safety-net", "buffer", "resilience"],
    relatedConcepts: ["savings", "budgeting", "insurance", "fd", "goal-planning"],
    relatedCalculators: ["/goal-planner", "/fd-calculator", "/rd-calculator"],
    relatedLessons: ["saving-budgeting", "insurance-planning"],
    relatedJourneys: ["protect-your-family", "build-wealth"],
    relatedHealthTopics: ["savings", "protection"],
    learningOrder: 3,
  },

  inflation: {
    id: "inflation",
    title: "Inflation",
    description:
      "The gradual rise in prices over time, which reduces the purchasing power of money. Inflation is central to retirement, goal, and return planning.",
    difficulty: "beginner",
    category: "planning",
    tags: ["purchasing-power", "real-returns", "cost-of-living"],
    relatedConcepts: ["compounding", "retirement", "goal-planning", "savings"],
    relatedCalculators: ["/inflation-calculator", "/retirement-calculator", "/goal-planner"],
    relatedLessons: ["money-basics", "investing-fundamentals", "retirement-planning"],
    relatedJourneys: ["retirement-planning", "build-wealth"],
    relatedHealthTopics: ["planning", "investments"],
    learningOrder: 4,
  },

  compounding: {
    id: "compounding",
    title: "Compounding",
    description:
      "Earning returns on both principal and accumulated returns. Over long periods, compounding can grow wealth faster than linear saving alone.",
    difficulty: "beginner",
    category: "investing",
    tags: ["time", "growth", "reinvestment", "exponential"],
    relatedConcepts: ["sip", "mutual-funds", "ppf", "fd", "retirement", "inflation"],
    relatedCalculators: [
      "/compound-interest-calculator",
      "/sip-calculator",
      "/lumpsum-calculator",
      "/cagr-calculator",
    ],
    relatedLessons: ["money-basics", "investing-fundamentals", "mutual-funds-sip"],
    relatedJourneys: ["build-wealth", "retirement-planning"],
    relatedHealthTopics: ["investments", "planning"],
    learningOrder: 5,
  },

  sip: {
    id: "sip",
    title: "SIP",
    description:
      "Systematic Investment Plan — investing a fixed amount at regular intervals, often monthly. SIPs spread entry points and support rupee-cost averaging.",
    difficulty: "beginner",
    category: "investing",
    tags: ["mutual-funds", "monthly-investing", "rca", "discipline"],
    relatedConcepts: ["mutual-funds", "compounding", "goal-planning", "asset-allocation"],
    relatedCalculators: ["/sip-calculator", "/goal-planner", "/cagr-calculator"],
    relatedLessons: ["mutual-funds-sip", "investing-fundamentals"],
    relatedJourneys: ["build-wealth", "retirement-planning"],
    relatedHealthTopics: ["investments", "savings"],
    learningOrder: 6,
  },

  "mutual-funds": {
    id: "mutual-funds",
    title: "Mutual Funds",
    description:
      "Pooled investment vehicles that invest across stocks, bonds, or other assets. Indian investors often access equity and debt markets through mutual funds and SIPs.",
    difficulty: "intermediate",
    category: "investing",
    tags: ["equity", "debt", "hybrid", "amc", "nav"],
    relatedConcepts: ["sip", "asset-allocation", "compounding", "retirement"],
    relatedCalculators: ["/sip-calculator", "/lumpsum-calculator", "/cagr-calculator"],
    relatedLessons: ["mutual-funds-sip", "investing-fundamentals"],
    relatedJourneys: ["build-wealth", "retirement-planning"],
    relatedHealthTopics: ["investments"],
    learningOrder: 7,
  },

  "asset-allocation": {
    id: "asset-allocation",
    title: "Asset Allocation",
    description:
      "Dividing money across asset classes such as equity, debt, gold, and cash based on goals, time horizon, and risk comfort.",
    difficulty: "intermediate",
    category: "investing",
    tags: ["diversification", "risk", "rebalancing", "portfolio"],
    relatedConcepts: ["mutual-funds", "sip", "ppf", "fd", "retirement"],
    relatedCalculators: ["/sip-calculator", "/ppf-calculator", "/fd-calculator", "/cagr-calculator"],
    relatedLessons: ["investing-fundamentals", "mutual-funds-sip", "retirement-planning"],
    relatedJourneys: ["build-wealth", "retirement-planning"],
    relatedHealthTopics: ["investments", "planning"],
    learningOrder: 8,
  },

  fd: {
    id: "fd",
    title: "FD",
    description:
      "Fixed Deposit — a bank deposit with a locked tenure and stated interest rate. FDs are often used for capital preservation and short-to-medium-term savings.",
    difficulty: "beginner",
    category: "savings",
    tags: ["fixed-deposit", "interest", "bank", "tenure"],
    relatedConcepts: ["rd", "savings", "emergency-fund", "compounding", "inflation"],
    relatedCalculators: ["/fd-calculator", "/compound-interest-calculator"],
    relatedLessons: ["money-basics", "saving-budgeting", "investing-fundamentals"],
    relatedJourneys: ["build-wealth", "protect-your-family"],
    relatedHealthTopics: ["savings", "investments"],
    learningOrder: 9,
  },

  rd: {
    id: "rd",
    title: "RD",
    description:
      "Recurring Deposit — a monthly deposit scheme with a fixed tenure and interest rate. RDs help build disciplined saving habits with predictable maturity values.",
    difficulty: "beginner",
    category: "savings",
    tags: ["recurring-deposit", "monthly-saving", "bank"],
    relatedConcepts: ["fd", "savings", "budgeting", "goal-planning"],
    relatedCalculators: ["/rd-calculator", "/goal-planner"],
    relatedLessons: ["saving-budgeting", "money-basics"],
    relatedJourneys: ["build-wealth", "protect-your-family"],
    relatedHealthTopics: ["savings"],
    learningOrder: 10,
  },

  ppf: {
    id: "ppf",
    title: "PPF",
    description:
      "Public Provident Fund — a long-term government-backed savings scheme. Contribution limits, notified rates, and maturity follow current scheme rules and can change. Tax treatment depends on applicable income-tax rules and tax regime.",
    difficulty: "intermediate",
    category: "investing",
    tags: ["government-scheme", "tax-benefit", "long-term", "eighty-c"],
    relatedConcepts: ["epf", "nps", "retirement", "tax", "compounding"],
    relatedCalculators: ["/ppf-calculator", "/goal-planner"],
    relatedLessons: ["investing-fundamentals", "retirement-planning", "income-tax-basics"],
    relatedJourneys: ["build-wealth", "retirement-planning", "save-tax"],
    relatedHealthTopics: ["investments", "planning"],
    learningOrder: 11,
  },

  epf: {
    id: "epf",
    title: "EPF",
    description:
      "Employees' Provident Fund — a mandatory retirement savings scheme for salaried employees in India, with employer matching and long-term compounding.",
    difficulty: "intermediate",
    category: "planning",
    tags: ["salary", "retirement", "employer-match", "provident-fund"],
    relatedConcepts: ["nps", "ppf", "retirement", "tax"],
    relatedCalculators: ["/epf-calculator", "/retirement-calculator"],
    relatedLessons: ["retirement-planning", "income-tax-basics"],
    relatedJourneys: ["retirement-planning", "save-tax"],
    relatedHealthTopics: ["investments", "planning"],
    learningOrder: 12,
  },

  nps: {
    id: "nps",
    title: "NPS",
    description:
      "National Pension System — a voluntary, market-linked retirement savings scheme. Exit and annuity treatment depend on subscriber type and current PFRDA rules, and are not a single universal split.",
    difficulty: "intermediate",
    category: "planning",
    tags: ["pension", "annuity", "retirement", "market-linked"],
    relatedConcepts: ["epf", "ppf", "retirement", "asset-allocation"],
    relatedCalculators: ["/nps-calculator", "/retirement-calculator", "/swp-calculator"],
    relatedLessons: ["retirement-planning"],
    relatedJourneys: ["retirement-planning"],
    relatedHealthTopics: ["investments", "planning"],
    learningOrder: 13,
  },

  "goal-planning": {
    id: "goal-planning",
    title: "Goal Planning",
    description:
      "Defining financial targets with amounts and timelines, then estimating the saving or investing needed to reach them.",
    difficulty: "beginner",
    category: "planning",
    tags: ["targets", "timeline", "corpus", "milestones"],
    relatedConcepts: ["savings", "sip", "budgeting", "inflation", "retirement"],
    relatedCalculators: ["/goal-planner", "/sip-calculator", "/inflation-calculator"],
    relatedLessons: ["money-basics", "saving-budgeting", "mutual-funds-sip"],
    relatedJourneys: ["build-wealth", "buy-dream-home", "child-education"],
    relatedHealthTopics: ["planning", "savings"],
    learningOrder: 14,
  },

  retirement: {
    id: "retirement",
    title: "Retirement",
    description:
      "Planning for income and corpus needs when regular salary stops. Retirement planning accounts for inflation, longevity, and withdrawal needs.",
    difficulty: "intermediate",
    category: "planning",
    tags: ["corpus", "pension", "withdrawal", "longevity"],
    relatedConcepts: ["nps", "epf", "ppf", "inflation", "asset-allocation"],
    relatedCalculators: [
      "/retirement-calculator",
      "/nps-calculator",
      "/epf-calculator",
      "/swp-calculator",
      "/inflation-calculator",
    ],
    relatedLessons: ["retirement-planning"],
    relatedJourneys: ["retirement-planning", "build-wealth"],
    relatedHealthTopics: ["planning", "investments"],
    learningOrder: 15,
  },

  debt: {
    id: "debt",
    title: "Debt",
    description:
      "Borrowed money that must be repaid with interest. Managing debt involves understanding EMI burden, total interest cost, and repayment strategy.",
    difficulty: "beginner",
    category: "debt",
    tags: ["borrowing", "loans", "interest", "repayment"],
    relatedConcepts: ["emi", "credit-score", "budgeting"],
    relatedCalculators: [
      "/emi-calculator",
      "/loan-prepayment-calculator",
      "/home-loan-eligibility-calculator",
    ],
    relatedLessons: ["loans-emi"],
    relatedJourneys: ["become-debt-free", "buy-dream-home", "buy-your-car"],
    relatedHealthTopics: ["debt"],
    learningOrder: 16,
  },

  emi: {
    id: "emi",
    title: "EMI",
    description:
      "Equated Monthly Installment — a fixed monthly loan repayment that includes principal and interest. EMI size depends on loan amount, rate, and tenure.",
    difficulty: "beginner",
    category: "debt",
    tags: ["loan-repayment", "amortisation", "tenure", "interest"],
    relatedConcepts: ["debt", "credit-score", "budgeting"],
    relatedCalculators: [
      "/emi-calculator",
      "/loan-prepayment-calculator",
      "/home-loan-eligibility-calculator",
    ],
    relatedLessons: ["loans-emi"],
    relatedJourneys: ["become-debt-free", "buy-dream-home", "buy-your-car"],
    relatedHealthTopics: ["debt"],
    learningOrder: 17,
  },

  "credit-score": {
    id: "credit-score",
    title: "Credit Score",
    description:
      "A numerical summary of creditworthiness based on repayment history, utilisation, and credit mix. A healthy score can affect loan access and terms.",
    difficulty: "intermediate",
    category: "debt",
    tags: ["cibil", "creditworthiness", "repayment-history", "utilisation"],
    relatedConcepts: ["debt", "emi", "budgeting"],
    relatedCalculators: ["/emi-calculator", "/home-loan-eligibility-calculator"],
    relatedLessons: ["loans-emi"],
    relatedJourneys: ["become-debt-free", "buy-your-car"],
    relatedHealthTopics: ["debt"],
    learningOrder: 18,
  },

  insurance: {
    id: "insurance",
    title: "Insurance",
    description:
      "Financial protection against defined risks through premiums paid to an insurer. Term life and health cover are common planning topics in India.",
    difficulty: "beginner",
    category: "protection",
    tags: ["term-life", "health-cover", "premium", "risk-transfer"],
    relatedConcepts: ["emergency-fund", "goal-planning", "retirement"],
    relatedCalculators: ["/goal-planner", "/inflation-calculator"],
    relatedLessons: ["insurance-planning"],
    relatedJourneys: ["protect-your-family"],
    relatedHealthTopics: ["protection"],
    learningOrder: 19,
  },

  tax: {
    id: "tax",
    title: "Tax",
    description:
      "Government levies on income and transactions. Indian earners often compare tax regimes and provisions such as section 80C and House Rent Allowance, where the applicable regime and conditions permit.",
    difficulty: "intermediate",
    category: "tax",
    tags: ["income-tax", "regime", "deductions", "hra", "gst"],
    relatedConcepts: ["ppf", "epf", "nps", "budgeting"],
    relatedCalculators: [
      "/income-tax-calculator",
      "/hra-calculator",
      "/gst-calculator",
      "/ppf-calculator",
    ],
    relatedLessons: ["income-tax-basics"],
    relatedJourneys: ["save-tax"],
    relatedHealthTopics: ["planning"],
    learningOrder: 20,
  },
};

export const CONCEPT_IDS = Object.keys(FINANCIAL_CONCEPTS);

export function getConceptById(id) {
  return FINANCIAL_CONCEPTS[id] ?? null;
}

export function getAllConcepts() {
  return Object.values(FINANCIAL_CONCEPTS);
}
