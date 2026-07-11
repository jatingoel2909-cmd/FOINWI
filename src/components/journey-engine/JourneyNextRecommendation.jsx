import { Link } from "react-router-dom";

function JourneyNextRecommendation({ nextJourney }) {
  if (!nextJourney) return null;

  return (
    <section className="fje-next" aria-labelledby="fje-next-title">
      <p className="fje-next__label">Recommended Next Journey</p>
      <article className="fje-next__card">
        <span className="fje-next__icon" aria-hidden="true">
          {nextJourney.icon}
        </span>
        <div>
          <h2 id="fje-next-title">{nextJourney.title}</h2>
          <p>{nextJourney.description}</p>
          <Link to={`/journeys/${nextJourney.slug}`} className="fje-btn fje-btn--primary">
            Start Next Journey →
          </Link>
        </div>
      </article>
    </section>
  );
}

export default JourneyNextRecommendation;
