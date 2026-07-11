export const JOURNEY_ENGINE_DISCLAIMER =
  "Financial Journey content is for educational planning only. It is not financial, investment, tax, loan, or legal advice. Consult qualified professionals before making financial decisions.";

export const FINANCIAL_JOURNEY_ENGINE = {
  "build-wealth": {
    slug: "build-wealth",
    icon: "📈",
    title: "Build Wealth",
    subtitle:
      "Build a structured path from first investment to long-term compounding with the right habits, tools, and learning.",
    overview:
      "Wealth building is less about timing the market and more about consistent investing, realistic return assumptions, and staying invested through market cycles. This journey guides you through SIP planning, lumpsum decisions, CAGR understanding, and goal-linked investing for Indian savers.",
    estimatedTime: "6–8 weeks",
    skillsLearned: [
      "SIP and compounding",
      "Goal-based investing",
      "Return assumptions",
      "Asset allocation basics",
      "Investing discipline",
    ],
    timeline: [
      {
        id: "define-goal",
        title: "Define your wealth goal",
        description: "Set a target corpus, timeline, and purpose for the wealth you want to build.",
        phase: "Week 1",
      },
      {
        id: "estimate-sip",
        title: "Estimate monthly SIP",
        description: "Calculate the contribution needed to move toward your goal with realistic return assumptions.",
        phase: "Week 2",
      },
      {
        id: "compare-scenarios",
        title: "Compare return scenarios",
        description: "Use CAGR and lumpsum tools to understand how different paths affect long-term outcomes.",
        phase: "Week 3–4",
      },
      {
        id: "build-discipline",
        title: "Build investing discipline",
        description: "Automate contributions, separate emergency savings, and commit to a review rhythm.",
        phase: "Week 5–6",
      },
      {
        id: "review-rebalance",
        title: "Review and rebalance",
        description: "Adjust contributions and allocation as income, goals, and market conditions evolve.",
        phase: "Ongoing",
      },
    ],
    progressSteps: [
      { id: "wealth-target", label: "Defined a clear wealth target and time horizon" },
      { id: "sip-estimate", label: "Estimated monthly SIP for my goal" },
      { id: "return-scenarios", label: "Compared realistic return scenarios" },
      { id: "emergency-fund", label: "Set up emergency fund separate from investments" },
      { id: "annual-review", label: "Scheduled an annual portfolio review" },
    ],
    modules: [
      {
        id: "compounding",
        title: "Power of compounding and rupee-cost averaging",
        description:
          "See how time and consistent investing reduce the impact of market timing on long-term wealth.",
        learnSlug: "mutual-funds-sip",
        duration: "20 min",
        difficulty: "Beginner",
      },
      {
        id: "sip-lumpsum",
        title: "SIP vs lumpsum — when each approach fits",
        description:
          "Match your investment method to cash flow, risk comfort, and market context.",
        learnSlug: "investing-fundamentals",
        duration: "15 min",
        difficulty: "Beginner",
      },
      {
        id: "asset-classes",
        title: "Equity, debt, and hybrid funds for Indian investors",
        description:
          "Understand asset classes commonly used for long-term wealth building in India.",
        learnSlug: "investing-fundamentals",
        duration: "18 min",
        difficulty: "Intermediate",
      },
      {
        id: "rebalancing",
        title: "Rebalancing and reviewing your portfolio annually",
        description:
          "Keep risk aligned with goals as markets and life stages change over time.",
        learnSlug: "mutual-funds-sip",
        duration: "12 min",
        difficulty: "Intermediate",
      },
    ],
    calculatorPaths: [
      "/sip-calculator",
      "/lumpsum-calculator",
      "/cagr-calculator",
      "/goal-planner",
    ],
    missionSlug: "build-wealth",
    healthScore: {
      title: "Check your investing readiness",
      description:
        "The Financial Health Score helps you reflect on savings, protection, debt, and planning habits — useful before committing to a long-term wealth plan.",
      focusAreas: ["Savings habits", "Investment readiness", "Emergency buffer", "Long-term planning"],
    },
    completion: {
      title: "You have completed the Build Wealth journey",
      description:
        "You have worked through goal-setting, SIP planning, scenario comparison, and review habits. Keep learning and use FOINWI tools to stay on track.",
      celebration: "Wealth habits built with clarity.",
    },
    nextJourney: {
      slug: "retirement-planning",
      title: "Retirement Planning",
      description:
        "Once wealth habits are in place, channel long-term investing toward retirement security and income planning.",
      icon: "🌅",
    },
  },
};

export function getEngineJourneySlugs() {
  return Object.keys(FINANCIAL_JOURNEY_ENGINE);
}
