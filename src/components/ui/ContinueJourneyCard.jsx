import { Link } from "react-router-dom";
import { getPrimaryJourneyForCalculator } from "../../utils/journeyEngineHelpers";

function ContinueJourneyCard({ calculatorId, journey: journeyProp }) {
  const journey = journeyProp ?? getPrimaryJourneyForCalculator(calculatorId);

  if (!journey?.slug) return null;

  return (
    <aside className="calc-journey-promo" aria-label="Continue your journey">
      <p className="calc-journey-promo__label">Continue Your Journey</p>
      <article className="calc-journey-promo__card">
        <span className="calc-journey-promo__icon" aria-hidden="true">
          {journey.icon}
        </span>
        <div>
          <h3>Continue with the {journey.title} Journey</h3>
          <p>{journey.description}</p>
          <Link to={`/journeys/${journey.slug}`} className="calc-journey-promo__cta">
            Start {journey.title} Journey →
          </Link>
        </div>
      </article>
    </aside>
  );
}

export default ContinueJourneyCard;
