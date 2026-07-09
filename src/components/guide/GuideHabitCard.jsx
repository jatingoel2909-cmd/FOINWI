import { Link } from "react-router-dom";

function GuideHabitCard({ habit }) {
  return (
    <article className="guide-habit-card">
      <span className="guide-icon-wrap guide-habit-card__icon" aria-hidden="true">
        {habit.icon}
      </span>
      <h3>{habit.title}</h3>
      <p>{habit.description}</p>
      <Link to={habit.link} className="guide-habit-card__cta">
        {habit.cta} →
      </Link>
    </article>
  );
}

export default GuideHabitCard;
