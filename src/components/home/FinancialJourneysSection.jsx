import { Link } from "react-router-dom";
import { FINANCIAL_JOURNEYS } from "../../data/journeys";
import { enrichMission } from "../../utils/missionHelpers";
import { hasFinancialJourney } from "../../utils/journeyEngineHelpers";
import "../../styles/journey-home.css";

function FinancialJourneysSection() {
  return (
    <section className="shrix-journey-section" id="journeys">
      <p className="shrix-section-label">Financial Missions</p>
      <h2>Choose Your Financial Mission</h2>
      <p className="shrix-journey-section__subtitle">
        Each mission combines learning modules, calculators, and planning steps
        around one money goal — so you can explore at your own pace.
      </p>

      <div className="shrix-journey-grid">
        {FINANCIAL_JOURNEYS.map((journey) => {
          const mission = enrichMission(journey);
          const lessonCount = mission.learningModules?.length ?? 0;
          const calculatorCount = mission.calculators?.length ?? 0;
          const hasEngine = hasFinancialJourney(journey.slug);

          return (
            <article
              className="shrix-journey-card"
              key={journey.slug}
            >
              <div className="shrix-journey-card__icon" aria-hidden="true">
                <span>{journey.icon}</span>
              </div>
              <h3>{journey.title}</h3>
              <p>{journey.description}</p>

              <ul className="shrix-journey-card__stats" aria-label={`${journey.title} overview`}>
                <li>
                  <span className="shrix-journey-card__stat-label">Duration</span>
                  <strong>{journey.duration}</strong>
                </li>
                <li>
                  <span className="shrix-journey-card__stat-label">Lessons</span>
                  <strong>{lessonCount}</strong>
                </li>
                <li>
                  <span className="shrix-journey-card__stat-label">Calculators</span>
                  <strong>{calculatorCount}</strong>
                </li>
                <li>
                  <span className="shrix-journey-card__stat-label">Path</span>
                  <strong>{hasEngine ? "Full journey" : "Mission"}</strong>
                </li>
              </ul>

              <Link to={`/journeys/${journey.slug}`} className="shrix-journey-card__cta">
                {hasEngine ? "Start Journey →" : "Start Mission →"}
              </Link>
            </article>
          );
        })}
      </div>

      <p className="shrix-section-bridge shrix-section-bridge--on-alt">
        Prefer a shorter path? Follow the FOINWI approach below — calculate, learn,
        plan, then grow.
      </p>
    </section>
  );
}

export default FinancialJourneysSection;
