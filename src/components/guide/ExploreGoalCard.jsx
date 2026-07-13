import { Link } from "react-router-dom";

function ExploreGoalCard({ goal }) {
  const isBuildWealth = goal.missionSlug === "build-wealth";
  const ctaLabel = isBuildWealth ? "Start Journey →" : "Explore Journey →";

  return (
    <Link
      to={`/journeys/${goal.missionSlug}`}
      className="guide-explore-card"
      aria-label={`${goal.title}: ${ctaLabel.replace(" →", "")}`}
    >
      <span className="guide-icon-wrap guide-explore-card__icon" aria-hidden="true">
        {goal.icon}
      </span>
      <h3>{goal.title}</h3>
      <p>{goal.description}</p>
      <span className="guide-explore-card__cta">{ctaLabel}</span>
    </Link>
  );
}

export default ExploreGoalCard;
