import { FINANCIAL_JOURNEYS } from "../data/journeys";
import { ALL_CALCULATORS } from "../data/calculators";

const MISSION_META = {
  "buy-dream-home": {
    difficulty: "Intermediate",
    nextMission: {
      slug: "protect-your-family",
      title: "Protect Your Family",
      description: "After planning a home purchase, strengthen emergency cover and family financial protection.",
    },
    aiGuide: {
      intro: "FOINWI AI will guide you through home-buying numbers — without replacing a loan officer or financial advisor.",
      points: [
        "Explain home loan eligibility results in plain language",
        "Compare EMI scenarios across tenure and rate changes",
        "Highlight down payment gaps and savings timelines",
        "Summarise affordability trade-offs before you apply",
      ],
    },
    extraMilestones: [
      { title: "Review total cost", detail: "Include registration, stamp duty, and interior setup." },
      { title: "Shortlist properties", detail: "Compare listings with your estimated planning range." },
    ],
    learningDetails: {
      "How home loan eligibility is assessed in India":
        "Learn how banks evaluate income, existing EMIs, credit score, and co-applicant strength.",
      "Down payment, registration, and hidden home-buying costs":
        "Understand costs beyond property price that affect your upfront cash need.",
      "Fixed vs floating interest rates for home loans":
        "Compare rate stability, EMI predictability, and long-term interest cost.",
      "When to prepay vs invest surplus cash":
        "Decide whether extra payments or investments fit your situation better.",
    },
  },
  "build-wealth": {
    difficulty: "Beginner",
    nextMission: {
      slug: "retirement-planning",
      title: "Retirement Planning",
      description: "Once wealth habits are in place, channel long-term investing toward retirement security.",
    },
    aiGuide: {
      intro: "FOINWI AI will help you interpret wealth-building projections and stay focused on disciplined investing.",
      points: [
        "Break down SIP calculator outputs step by step",
        "Compare lumpsum vs SIP paths toward the same goal",
        "Explain CAGR and realistic return assumptions",
        "Identify contribution gaps for your target corpus",
      ],
    },
    extraMilestones: [
      { title: "Open investment account", detail: "Choose platforms and fund types aligned to your goal." },
      { title: "Automate contributions", detail: "Set SIP dates aligned with salary credits." },
      { title: "Track quarterly progress", detail: "Review corpus growth and adjust if needed." },
    ],
    learningDetails: {
      "Power of compounding and rupee-cost averaging":
        "See how time and consistent investing reduce the impact of market timing.",
      "SIP vs lumpsum — when each approach fits":
        "Match investment method to cash flow, risk comfort, and market context.",
      "Equity, debt, and hybrid funds for Indian investors":
        "Understand asset classes commonly used for long-term wealth building.",
      "Rebalancing and reviewing your portfolio annually":
        "Keep risk aligned with goals as markets and life stages change.",
    },
  },
  "save-tax": {
    difficulty: "Intermediate",
    nextMission: {
      slug: "build-wealth",
      title: "Build Wealth",
      description: "After optimising tax savings, redirect surplus into long-term wealth-building plans.",
    },
    aiGuide: {
      intro: "FOINWI AI will simplify tax concepts and calculator outputs for salaried Indian earners.",
      points: [
        "Explain Old vs New regime comparison results",
        "Clarify HRA exemption calculations and inputs",
        "Summarise common deduction categories and limits",
        "Help plan year-end tax-saving actions educationally",
      ],
    },
    extraMilestones: [
      { title: "Verify Form 16 details", detail: "Cross-check salary components and TDS entries." },
      { title: "Collect deduction proofs", detail: "Organise 80C, 80D, and rent documents early." },
    ],
    learningDetails: {
      "Old vs New tax regime — which fits your profile":
        "Compare liability with and without deductions to pick the better regime.",
      "Section 80C, 80D, and common salary deductions":
        "Learn eligible investments and expenses that reduce taxable income.",
      "HRA exemption rules for metro and non-metro cities":
        "Understand rent, salary structure, and city classification rules.",
      "Tax planning vs tax evasion — staying compliant":
        "Use legitimate planning tools while meeting disclosure requirements.",
    },
  },
  "child-education": {
    difficulty: "Intermediate",
    nextMission: {
      slug: "protect-your-family",
      title: "Protect Your Family",
      description: "Education planning works best alongside adequate family protection and emergency savings.",
    },
    aiGuide: {
      intro: "FOINWI AI will help parents understand education costs, inflation, and savings gaps clearly.",
      points: [
        "Project inflation-adjusted education targets",
        "Explain monthly SIP needed for school or college goals",
        "Compare timeline changes when fees rise faster than expected",
        "Balance education funding with other family priorities",
      ],
    },
    extraMilestones: [
      { title: "Choose investment mix", detail: "Balance growth and stability for the goal timeline." },
      { title: "Set annual review date", detail: "Update targets when fees or courses change." },
    ],
    learningDetails: {
      "Projecting school and college fees 10–15 years ahead":
        "Apply education inflation to today’s fees for realistic future targets.",
      "SIP-based education funds vs traditional deposits":
        "Compare growth potential and liquidity for long education horizons.",
      "Balancing child education with retirement savings":
        "Avoid sacrificing your own retirement while funding education goals.",
      "Insurance and contingency planning for education goals":
        "Protect the plan against income disruption or emergencies.",
    },
  },
  "buy-your-car": {
    difficulty: "Beginner",
    nextMission: {
      slug: "become-debt-free",
      title: "Become Debt Free",
      description: "After a car purchase, build habits to manage loans efficiently and reduce interest burden.",
    },
    aiGuide: {
      intro: "FOINWI AI will help you evaluate car loan affordability and ownership costs before you commit.",
      points: [
        "Explain EMI breakdown across loan amounts and tenures",
        "Compare down payment levels and interest savings",
        "Highlight affordability relative to monthly income",
        "Summarise total ownership cost beyond the loan EMI",
      ],
    },
    extraMilestones: [
      { title: "Compare loan offers", detail: "Review processing fees, rates, and prepayment terms." },
      { title: "Budget running costs", detail: "Plan fuel, service, insurance, and parking expenses." },
    ],
    learningDetails: {
      "On-road price vs ex-showroom — full cost breakdown":
        "Understand every charge that makes up the final car purchase price.",
      "New vs used car loan considerations":
        "Compare loan terms, interest rates, and depreciation trade-offs.",
      "Ideal EMI-to-income ratio for car loans":
        "Keep vehicle EMIs from crowding out savings and essentials.",
      "Total cost of ownership over 5 years":
        "See the full financial picture beyond the monthly EMI.",
    },
  },
  "retirement-planning": {
    difficulty: "Advanced",
    nextMission: {
      slug: "protect-your-family",
      title: "Protect Your Family",
      description: "Retirement planning pairs naturally with insurance and emergency planning for family security.",
    },
    aiGuide: {
      intro: "FOINWI AI will help translate retirement numbers into actionable, understandable planning steps.",
      points: [
        "Explain corpus targets and monthly savings gaps",
        "Break down EPF and NPS projection outputs",
        "Illustrate inflation impact on post-retirement expenses",
        "Compare withdrawal strategies using SWP concepts",
      ],
    },
    extraMilestones: [
      { title: "Estimate post-retirement expenses", detail: "Define monthly lifestyle costs in today’s rupees." },
      { title: "Stress-test longevity", detail: "Plan for a longer retirement horizon than expected." },
      { title: "Document pension accounts", detail: "Track EPF, NPS, and other retirement balances centrally." },
    ],
    learningDetails: {
      "How much corpus do you need for retirement in India":
        "Estimate replacement income needs using lifestyle and inflation assumptions.",
      "EPF, NPS, and PPF roles in retirement planning":
        "Understand how each instrument contributes to your retirement stack.",
      "Inflation impact on post-retirement expenses":
        "See why today’s expenses underestimate tomorrow’s needs.",
      "Creating income from corpus with SWP strategies":
        "Learn how systematic withdrawals can fund monthly retirement income.",
    },
  },
  "become-debt-free": {
    difficulty: "Intermediate",
    nextMission: {
      slug: "build-wealth",
      title: "Build Wealth",
      description: "Once debt reduces, redirect freed-up EMI capacity toward long-term wealth building.",
    },
    aiGuide: {
      intro: "FOINWI AI will help you compare debt repayment strategies and understand interest savings clearly.",
      points: [
        "Explain prepayment calculator savings in simple terms",
        "Compare avalanche vs snowball repayment approaches",
        "Highlight total EMI burden across all outstanding loans",
        "Suggest when investing may compete with prepayment",
      ],
    },
    extraMilestones: [
      { title: "Negotiate or refinance", detail: "Explore lower rates where eligible." },
      { title: "Close highest-cost loan", detail: "Eliminate the most expensive debt first." },
    ],
    learningDetails: {
      "Good debt vs bad debt — prioritisation framework":
        "Separate productive loans from high-cost consumer debt.",
      "Avalanche vs snowball debt repayment methods":
        "Choose between mathematical efficiency and motivational wins.",
      "When prepayment makes sense over investing":
        "Compare interest saved from prepayment vs potential investment returns.",
      "Rebuilding credit health after debt clearance":
        "Restore financial flexibility and healthy borrowing habits.",
    },
  },
  "protect-your-family": {
    difficulty: "Beginner",
    nextMission: {
      slug: "build-wealth",
      title: "Build Wealth",
      description: "With protection in place, focus on growing long-term family wealth with disciplined investing.",
    },
    aiGuide: {
      intro: "FOINWI AI will help families understand protection gaps, emergency targets, and planning priorities.",
      points: [
        "Explain emergency fund targets based on expenses",
        "Summarise term cover and income replacement concepts",
        "Compare protection vs investment trade-offs",
        "Guide annual family finance review checkpoints",
      ],
    },
    extraMilestones: [
      { title: "Review nominee details", detail: "Ensure policies and accounts have updated nominees." },
      { title: "Store documents securely", detail: "Keep policies and key records accessible to family." },
    ],
    learningDetails: {
      "How much term insurance cover families typically need":
        "Estimate cover based on income replacement and outstanding liabilities.",
      "Building a 6–12 month emergency fund":
        "Set a liquid buffer for job loss, medical events, or repairs.",
      "Health insurance vs medical emergency savings":
        "Combine insurance with cash reserves for deductibles and gaps.",
      "Estate planning basics for Indian families":
        "Organise nominees, wills, and account access for dependents.",
    },
  },
};

export function getCalcIcon(path) {
  const calculator = ALL_CALCULATORS.find((item) => item.path === path);
  return calculator?.icon || "🧮";
}

export function enrichMission(journey) {
  const meta = MISSION_META[journey.slug] || {};
  const baseMilestones = journey.timeline || [];
  const extraMilestones = meta.extraMilestones || [];
  const milestones = [...baseMilestones, ...extraMilestones].slice(0, 8);

  const learningModules = journey.learningModules.map((module) => {
    if (typeof module === "object") return module;
    return {
      title: module,
      description:
        meta.learningDetails?.[module] ||
        `Build practical understanding of ${module.toLowerCase()}.`,
    };
  });

  const checklist = journey.checklist.map((item, index) => ({
    id: `${journey.slug}-check-${index}`,
    label: item,
  }));

  return {
    ...journey,
    difficulty: meta.difficulty || "Intermediate",
    milestones,
    calculators: journey.calculators.map((calc) => ({
      ...calc,
      icon: getCalcIcon(calc.path),
    })),
    learningModules,
    aiGuide: meta.aiGuide || {
      intro: journey.aiPreview,
      points: ["Explain calculator results in plain language", "Compare planning scenarios step by step"],
    },
    checklist,
    nextMission: meta.nextMission || null,
  };
}

export function getMissionBySlug(slug) {
  const journey = FINANCIAL_JOURNEYS.find((item) => item.slug === slug);
  return journey ? enrichMission(journey) : null;
}
