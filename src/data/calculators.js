export const ALL_CALCULATORS = [
  { icon: "📈", title: "SIP Calculator", desc: "Estimate SIP returns and future wealth.", path: "/sip-calculator" },
  { icon: "💳", title: "EMI Calculator", desc: "Plan loan EMI and repayment.", path: "/emi-calculator" },
  { icon: "🏦", title: "FD Calculator", desc: "Calculate fixed deposit maturity value.", path: "/fd-calculator" },
  { icon: "💰", title: "PPF Calculator", desc: "Estimate long-term PPF growth.", path: "/ppf-calculator" },
  { icon: "🌅", title: "Retirement Calculator", desc: "Estimate retirement corpus needs.", path: "/retirement-calculator" },
  { icon: "🎯", title: "Goal Planner", desc: "Plan financial goals with clarity.", path: "/goal-planner" },
  { icon: "📊", title: "CAGR Calculator", desc: "Measure annualized investment return.", path: "/cagr-calculator" },
  { icon: "💵", title: "Lumpsum Calculator", desc: "Project one-time investment growth.", path: "/lumpsum-calculator" },
  { icon: "🏖️", title: "RD Calculator", desc: "Calculate recurring deposit maturity.", path: "/rd-calculator" },
  { icon: "🔁", title: "SWP Calculator", desc: "Plan systematic withdrawals.", path: "/swp-calculator" },
  { icon: "📉", title: "Inflation Calculator", desc: "See how inflation affects costs over time.", path: "/inflation-calculator" },
  { icon: "🎁", title: "Gratuity Calculator", desc: "Estimate gratuity payout after service.", path: "/gratuity-calculator" },
  { icon: "🏛️", title: "EPF Calculator", desc: "Project your EPF retirement corpus.", path: "/epf-calculator" },
  { icon: "🛡️", title: "NPS Calculator", desc: "Plan National Pension System growth.", path: "/nps-calculator" },
];

export const POPULAR_CALCULATOR_TITLES = [
  "SIP Calculator",
  "EMI Calculator",
  "FD Calculator",
  "PPF Calculator",
  "Retirement Calculator",
  "Goal Planner",
];

export function getPopularCalculators({ shortTitles = false } = {}) {
  const shortTitleMap = {
    "SIP Calculator": "SIP",
    "EMI Calculator": "EMI",
    "FD Calculator": "FD",
    "PPF Calculator": "PPF",
    "Retirement Calculator": "Retirement",
    "Goal Planner": "Goal Planner",
  };

  return POPULAR_CALCULATOR_TITLES.map((title) => {
    const calculator = ALL_CALCULATORS.find((item) => item.title === title);
    if (!calculator) return null;

    if (!shortTitles) return calculator;

    return {
      ...calculator,
      cardTitle: shortTitleMap[title] || title,
    };
  }).filter(Boolean);
}
