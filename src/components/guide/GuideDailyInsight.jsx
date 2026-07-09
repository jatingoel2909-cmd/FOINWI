import { Link } from "react-router-dom";

function GuideDailyInsight({ insight }) {
  const insightLink = insight.link ?? (insight.learnSlug ? `/learn/${insight.learnSlug}` : null);

  return (
    <article className="guide-daily-insight" aria-labelledby="guide-daily-insight-title">
      <div className="guide-daily-insight__header">
        <p className="shrix-section-label">{insight.sectionTitle}</p>
        <span className="guide-daily-insight__time">{insight.readingTime}</span>
      </div>
      <h3 id="guide-daily-insight-title">{insight.title}</h3>
      <p>{insight.body}</p>
      {insightLink && (
        <Link to={insightLink} className="guide-daily-insight__cta">
          Read Insight →
        </Link>
      )}
    </article>
  );
}

export default GuideDailyInsight;
