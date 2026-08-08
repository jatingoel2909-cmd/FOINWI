const createInsight = (id, title, body) => ({ id, title, body });

/**
 * Returns educational observations from caller-supplied EMI context.
 * This module does not calculate EMI, assess affordability, or recommend loans.
 */
export function getEmiEducationalInsights(context) {
  const insights = [
    createInsight(
      "principal-interest",
      "Principal and interest",
      "Principal is the amount borrowed. Interest is the cost charged for using that amount over time."
    ),
  ];

  if (context.derived.tenureMonths !== null && context.derived.tenureMonths >= 120) {
    insights.push(
      createInsight(
        "longer-tenure",
        "Loan tenure trade-off",
        "A longer tenure can reduce the estimated monthly EMI, while interest may be charged over more months."
      )
    );
  }

  if (context.derived.annualRate !== null && context.derived.annualRate > 0) {
    insights.push(
      createInsight(
        "interest-rate",
        "Interest rate impact",
        "A higher interest rate generally increases the estimated EMI and total borrowing cost when other inputs remain the same."
      )
    );
  }

  insights.push(
    createInsight(
      "prepayment",
      "Prepayment",
      "An extra payment may reduce future interest depending on the loan terms and how the lender applies the payment."
    )
  );

  return insights;
}
