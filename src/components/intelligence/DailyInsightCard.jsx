/**
 * FOINWI Daily Insight Card — wires getDailyInsight() into the UI.
 * Educational display only. No advice language. No persistence.
 */

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDailyInsight } from "../../intelligence/insight/insightEngine.js";
import { getDateKey } from "../../intelligence/insight/insightHelpers.js";
import { PilotHydrationContext } from "../../pilot/PilotHydrationContext.js";
import "./intelligence-ui.css";

function msUntilNextUtcDate(now = new Date()) {
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(1000, next - now.getTime() + 20);
}

function DailyInsightCard({
  pathname,
  conceptId,
  healthTopic,
  difficulty,
  compact = false,
  title = "Today's Financial Insight",
}) {
  const pilot = useContext(PilotHydrationContext);
  const stampedDate = pilot?.route && pathname === pilot.route ? pilot.insightDate : null;
  const [freshDate, setFreshDate] = useState(null);
  const activeDate = freshDate || stampedDate || null;
  const renderedDateRef = useRef(activeDate);
  renderedDateRef.current = activeDate || getDateKey(new Date());

  useEffect(() => {
    let timer = 0;
    let stopped = false;

    const reconcile = () => {
      if (stopped) return;
      const today = getDateKey(new Date());
      if (renderedDateRef.current !== today) {
        setFreshDate(today);
      }
      timer = window.setTimeout(reconcile, msUntilNextUtcDate(new Date()));
    };

    reconcile();
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [stampedDate]);

  const result = useMemo(
    () =>
      getDailyInsight({
        pathname,
        conceptId,
        healthTopic,
        difficulty,
        ...(activeDate ? { date: activeDate } : {}),
      }),
    [pathname, conceptId, healthTopic, difficulty, activeDate],
  );

  const insight = result?.insight;
  if (!insight) return null;

  const recs = result.relatedRecommendations ?? {};
  const lesson = recs.lesson?.path && recs.lesson.path !== pathname ? recs.lesson : null;
  const calculator =
    recs.calculator?.path && recs.calculator.path !== pathname ? recs.calculator : null;
  const journey = recs.journey?.path && recs.journey.path !== pathname ? recs.journey : null;
  const headingId = `fi-insight-title-${insight.id}`;

  return (
    <article
      className={`fi-daily-insight${compact ? " fi-daily-insight--compact" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="fi-daily-insight__header">
        <p className="shrix-section-label">{title}</p>
        {insight.readingTime && (
          <span className="fi-daily-insight__time">{insight.readingTime}</span>
        )}
      </div>

      <h3 id={headingId}>{insight.title}</h3>
      <p className="fi-daily-insight__summary">{insight.summary}</p>

      <div className="fi-daily-insight__actions">
        {lesson?.path && (
          <Link to={lesson.path} className="fi-daily-insight__cta">
            Related lesson →
          </Link>
        )}
        {calculator?.path && (
          <Link to={calculator.path} className="fi-daily-insight__cta">
            Related calculator →
          </Link>
        )}
        {journey?.path && (
          <Link to={journey.path} className="fi-daily-insight__cta">
            Related journey →
          </Link>
        )}
      </div>

      {!compact && insight.educationalNotice && (
        <p className="fi-daily-insight__notice">{insight.educationalNotice}</p>
      )}
    </article>
  );
}

export default DailyInsightCard;
