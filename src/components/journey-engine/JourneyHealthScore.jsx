import { Link } from "react-router-dom";

function JourneyHealthScore({ healthScore }) {
  return (
    <section className="fje-block fje-block--health" aria-labelledby="fje-health-title">
      <div className="fje-block__head">
        <h2 id="fje-health-title">Health Score Recommendation</h2>
        <p>{healthScore.description}</p>
      </div>
      <article className="fje-health-card">
        <h3>{healthScore.title}</h3>
        <ul className="fje-health-card__areas">
          {healthScore.focusAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
        <Link to="/financial-health-score" className="fje-btn fje-btn--primary">
          Take Financial Health Score →
        </Link>
      </article>
    </section>
  );
}

export default JourneyHealthScore;
