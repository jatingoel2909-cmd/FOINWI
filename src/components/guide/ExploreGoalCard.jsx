import { Link } from "react-router-dom";

function ExploreGoalCard({ goal }) {
  return (
    <article className="guide-explore-card">
      <span className="guide-icon-wrap guide-explore-card__icon" aria-hidden="true">
        {goal.icon}
      </span>
      <h3>{goal.title}</h3>
      <p>{goal.description}</p>
      <Link to={`/journeys/${goal.missionSlug}`} className="guide-explore-card__cta">
        Explore Journey →
      </Link>
    </article>
  );
}

export default ExploreGoalCard;
