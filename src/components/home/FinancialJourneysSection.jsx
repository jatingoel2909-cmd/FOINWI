import { Link } from "react-router-dom";

const journeys = [
  {
    title: "Build Wealth",
    text: "Start with SIP, lumpsum, and goal planning tools for long-term growth.",
    to: "/calculators",
  },
  {
    title: "Plan a Loan",
    text: "Estimate EMI, eligibility, and prepayment impact before you borrow.",
    to: "/emi-calculator",
  },
  {
    title: "Save Tax",
    text: "Explore income tax, HRA, and GST calculators for smarter tax planning.",
    to: "/income-tax-calculator",
  },
  {
    title: "Plan Retirement",
    text: "Estimate retirement corpus with EPF, NPS, and retirement planners.",
    to: "/retirement-calculator",
  },
  {
    title: "Learn Money Basics",
    text: "Build strong foundations with simple finance learning for every stage.",
    to: "/learn",
  },
  {
    title: "Family Financial Planning",
    text: "Plan for education, home, health, and family goals with clarity.",
    to: "/learn",
  },
];

function FinancialJourneysSection() {
  return (
    <section className="shrix-home-section shrix-home-section--alt" id="journeys">
      <h2>Choose Your Financial Journey</h2>
      <p className="shrix-home-section__subtitle">
        Pick the path that matches your goal and start with the right tools or learning content.
      </p>
      <div className="shrix-home-grid shrix-home-grid--3">
        {journeys.map((journey) => (
          <article className="shrix-home-card" key={journey.title}>
            <h3>{journey.title}</h3>
            <p>{journey.text}</p>
            <Link to={journey.to} className="shrix-home-card__link">
              Explore →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FinancialJourneysSection;
