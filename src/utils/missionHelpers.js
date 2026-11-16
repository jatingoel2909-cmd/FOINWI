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
        "The linked lesson explains principal, interest, tenure, and fees. The eligibility calculator is an illustration, not a lender decision.",
      "Cash a buyer still needs before borrowing":
        "The linked lesson is about naming a goal. Registration, stamp duty, and setup costs are outside the EMI figure.",
      "Fixed vs floating interest rates for home loans":
        "The linked lesson explains a rate that stays fixed for a period and a rate that can change later.",
      "What one prepayment changes on a loan":
        "The linked lesson explains an extra principal payment. It does not compare that payment with an investment.",
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
      description: "After the tax illustrations, the Build Wealth journey covers long-term investing.",
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
      "How two tax-regime illustrations differ":
        "The linked lesson shows how two regime illustrations can diverge. It does not choose a regime.",
      "How a named deduction appears in an estimate":
        "The linked lesson explains a named deduction. Paying it is not a cash refund.",
      "HRA exemption under Rule 279 for FY 2026-27":
        "The linked lesson explains the monthly HRA estimate and the conditions printed with it.",
      "How a salary estimate differs from take-home pay":
        "The linked lesson explains that difference. It is not a filing guide.",
    },
  },
  "child-education": {
    difficulty: "Intermediate",
    nextMission: {
      slug: "protect-your-family",
      title: "Protect Your Family",
      description: "After an education target, the Protect Your Family journey separates cover from a cash reserve.",
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
      "How a typed inflation rate changes an amount":
        "The linked lesson shows what a typed inflation rate does to an amount. It is not a school-fee forecast.",
      "How a monthly investment differs from a deposit":
        "The linked lesson explains a monthly investment pattern. A deposit is a different kind of product.",
      "Keeping an education target separate from retirement":
        "The linked lesson is a retirement timeline. Keeping that target separate from the education target makes both easier to read.",
      "Why insurance is a different question from the savings target":
        "The linked lesson explains why insurance is separate from the savings target. It does not set a cover amount.",
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
      "What a loan illustration leaves out of a vehicle price":
        "The linked lesson explains rate, tenure, and fees. It does not list vehicle charges.",
      "Why a new or used label does not change the EMI formula":
        "The linked lesson explains the instalment. It does not compare vehicle prices.",
      "How an instalment sits beside other monthly costs":
        "The linked lesson discusses keeping instalments within a comfortable share of income. A comfortable share can differ.",
      "Why a rupee now and a rupee later differ":
        "The linked lesson explains that difference. It does not add fuel or insurance.",
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
      "How a retirement corpus estimate can be illustrated":
        "The linked lesson explains a corpus illustration built from future spending, inflation, and a chosen number of years.",
      "EPF, NPS, and PPF roles in retirement planning":
        "The linked lesson explains an EPF illustration. NPS has its own lesson, linked in the guidance below.",
      "Inflation impact on post-retirement expenses":
        "The linked lesson shows what a typed inflation rate does to an amount. It is not a personal spending forecast.",
      "How a systematic withdrawal differs from a pension":
        "The linked lesson explains a systematic withdrawal. It is not a pension.",
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
      "How a lesson discusses repayment order":
        "The linked lesson discusses keeping instalments within a comfortable share of income and a repayment order. It does not label a loan good or bad.",
      "Payoff method names this page does not define":
        "FOINWI does not define avalanche or snowball in a lesson. The linked lesson discusses repayment order.",
      "What an extra principal payment changes":
        "The linked lesson explains an extra principal payment. It does not compare that payment with an investment return.",
      "Listing balances, without a credit score":
        "FOINWI does not publish a credit-score lesson or a score. This card is a reminder to list each balance, rate, and remaining time separately.",
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
      "What a term benefit covers during the policy term":
        "The linked lesson explains a term benefit during the policy term. It does not set a cover amount.",
      "What a cash reserve is for":
        "The linked lesson discusses a cash reserve. The 6–12 month line on this page is a checklist prompt, not a requirement.",
      "What a health policy limit does not promise":
        "The linked lesson says a headline sum is not a promise that every bill is paid.",
      "Recording documents, without drafting a will":
        "FOINWI does not have a lesson that drafts a will or names a lawyer. The checklist asks you to record policies, nominees, and where documents are kept.",
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
