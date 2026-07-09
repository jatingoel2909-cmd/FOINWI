import { Link } from "react-router-dom";

function GuideLearningCard({ path }) {
  return (
    <article className="guide-learning-card">
      <div className="guide-learning-card__top">
        <span className="guide-icon-wrap guide-icon-wrap--sm guide-learning-card__icon" aria-hidden="true">
          {path.icon}
        </span>
      </div>
      <h3>{path.title}</h3>
      <p className="guide-learning-card__meta">
        <span className="guide-learning-card__time">
          <strong>Estimated reading time</strong> · {path.duration}
        </span>
        <span className="guide-learning-card__difficulty">{path.difficulty}</span>
      </p>
      <Link to={`/learn/${path.slug}`} className="guide-learning-card__cta">
        Continue →
      </Link>
    </article>
  );
}

export default GuideLearningCard;
