const createInsight = (id, title, body) => ({ id, title, body });

/**
 * Returns educational observations from caller-supplied SIP context.
 * This module does not select products or prescribe a return assumption.
 */
export function getSipEducationalInsights(context) {
  const insights = [
    createInsight(
      "illustrative-value",
      "Illustrative projection",
      "A SIP projection is an educational estimate based on the inputs and assumptions shown in the calculator. Actual market outcomes can differ."
    ),
  ];

  if (context.derived.investmentYears !== null && context.derived.investmentYears >= 10) {
    insights.push(
      createInsight(
        "compounding-time",
        "Time and compounding",
        "A longer investment period can increase the effect of compounding in an illustrative calculation."
      )
    );
  }

  if (context.derived.annualRate !== null && context.derived.annualRate > 0) {
    insights.push(
      createInsight(
        "assumed-return",
        "Return assumption",
        "A higher assumed return produces a higher illustrative future value when other inputs remain the same."
      )
    );
  }

  if (context.derived.inflationRate !== null && context.derived.inflationRate > 0) {
    insights.push(
      createInsight(
        "inflation",
        "Purchasing power",
        "Inflation can reduce the future purchasing power of money over time."
      )
    );
  }

  return insights;
}
