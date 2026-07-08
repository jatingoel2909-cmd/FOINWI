import { Link } from "react-router-dom";
import { FINANCIAL_JOURNEYS } from "../../data/journeys";
import "../../styles/journey-home.css";

function FinancialJourneysSection() {
  return (
    <section className="shrix-journey-section" id="journeys">
      <p className="shrix-section-label">Financial Journeys</p>
      <h2>Choose Your Financial Journey</h2>
      <p className="shrix-journey-section__subtitle">
        Structured paths with calculators, learning steps, and planning guidance for
        every major money goal.
      </p>

      <div className="shrix-journey-grid">
        {FINANCIAL_JOURNEYS.map((journey, index) => (
          <article
            className="shrix-journey-card"
            key={journey.slug}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="shrix-journey-card__icon" aria-hidden="true">
              <span>{journey.icon}</span>
            </div>
            <h3>{journey.title}</h3>
            <p>{journey.description}</p>
            <span className="shrix-journey-card__duration">{journey.duration}</span>
            <Link to={`/journeys/${journey.slug}`} className="shrix-journey-card__cta">
              Start Journey →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FinancialJourneysSection;
