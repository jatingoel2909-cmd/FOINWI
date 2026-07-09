import { Link } from "react-router-dom";

function GuideToolCard({ calculator }) {
  return (
    <article className="guide-tool-card">
      <span className="guide-tool-card__icon" aria-hidden="true">
        {calculator.icon}
      </span>
      <h3>{calculator.title}</h3>
      <p>{calculator.desc}</p>
      <Link to={calculator.path} className="guide-tool-card__cta">
        Open tool →
      </Link>
    </article>
  );
}

export default GuideToolCard;
