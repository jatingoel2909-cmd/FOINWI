import { Link } from "react-router-dom";

const BUILD_WEALTH_JOURNEY_CALCULATORS = new Set([
  "/sip-calculator",
  "/lumpsum-calculator",
  "/cagr-calculator",
  "/compound-interest-calculator",
  "/fd-calculator",
  "/rd-calculator",
  "/ppf-calculator",
  "/swp-calculator",
  "/goal-planner",
  "/inflation-calculator",
]);

function ContinueJourneyCard({ calculatorId }) {
  if (!BUILD_WEALTH_JOURNEY_CALCULATORS.has(calculatorId)) return null;

  return (
    <aside className="calc-journey-promo" aria-label="Continue your journey">
      <p className="calc-journey-promo__label">Continue Your Journey</p>
      <article className="calc-journey-promo__card">
        <span className="calc-journey-promo__icon" aria-hidden="true">
          📈
        </span>
        <div>
          <h3>Continue with the Build Wealth Journey</h3>
          <p>
            Turn this estimate into a structured path for SIP planning, goal-based
            investing, and long-term wealth habits.
          </p>
          <Link to="/journeys/build-wealth" className="calc-journey-promo__cta">
            Start Build Wealth Journey →
          </Link>
        </div>
      </article>
    </aside>
  );
}

export default ContinueJourneyCard;
