import { Link } from "react-router-dom";
import { useMemo } from "react";
import CircularScore from "./CircularScore";
import RecommendationPanel from "../intelligence/RecommendationPanel";
import { HEALTH_SCORE_DISCLAIMER } from "../../data/healthScoreQuestions";

function CategoryBar({ label, icon, score }) {
  return (
    <div className="fhs-category-bar">
      <div className="fhs-category-bar__head">
        <span>
          {icon} {label}
        </span>
        <strong>{score} / 100</strong>
      </div>
      <div className="fhs-category-bar__track" aria-hidden="true">
        <div
          className="fhs-category-bar__fill"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function HealthScoreDashboard({ result, onRetake }) {
  const {
    overallScore,
    band,
    categoryScores,
    strengths,
    improvements,
    recommendations,
    suggestedMission,
    suggestedCalculators,
    suggestedLearn,
  } = result;

  const focusHealthTopic = useMemo(() => {
    if (!categoryScores?.length) return "savings";
    const lowest = [...categoryScores].sort((a, b) => a.score - b.score)[0];
    return lowest?.id ?? "savings";
  }, [categoryScores]);

  return (
    <div className="fhs-dashboard">
      <section className="fhs-dashboard__hero">
        <article className="fhs-score-card">
          <div className="fhs-score-card__gauge">
            <CircularScore score={overallScore} label={band.label} />
          </div>
          <div className="fhs-score-card__copy">
            <p className="shrix-section-label">Your Financial Health Score</p>
            <h2>Overall Score</h2>
            <p className={`fhs-score-card__band fhs-score-card__band--${band.tone}`}>
              {band.label}
            </p>
            <p className="fhs-score-card__text">
              This can help you understand how your current saving, investing,
              protection, debt, and planning habits compare across common
              financial wellness areas. Results depend on your answers and
              assumptions.
            </p>
            <button type="button" className="fhs-btn fhs-btn--ghost" onClick={onRetake}>
              Retake Assessment
            </button>
          </div>
        </article>
      </section>

      <section className="fhs-dashboard__section">
        <h3>Category Scores</h3>
        <div className="fhs-dashboard__grid fhs-dashboard__grid--categories">
          {categoryScores.map((category) => (
            <CategoryBar key={category.id} {...category} />
          ))}
        </div>
      </section>

      <div className="fhs-dashboard__grid fhs-dashboard__grid--split">
        <section className="fhs-panel fhs-panel--strength">
          <h3>Financial Strengths</h3>
          <ul>
            {strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="fhs-panel fhs-panel--improve">
          <h3>Areas to Improve</h3>
          <ul>
            {improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="fhs-panel fhs-panel--wide">
        <h3>How this score is built</h3>
        <p className="fhs-score-method">
          This questionnaire has 12 answers. One income question is context-only
          and does not affect the score. The remaining answers contribute to one
          of five categories. Each category is shown from 0–100. The overall
          score is the equal average of those five category scores. The result is
          an educational reflection, not a financial verdict.
        </p>
      </section>

      <section className="fhs-panel fhs-panel--wide">
        <h3>Educational Recommendations</h3>
        <ul className="fhs-recommendations">
          {recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="fhs-suggest-card">
        <p className="shrix-section-label">Suggested learning journey</p>
        <div className="fhs-suggest-card__body">
          <span className="fhs-suggest-card__icon" aria-hidden="true">
            {suggestedMission.icon}
          </span>
          <div>
            <h3>{suggestedMission.title}</h3>
            <p>{suggestedMission.description}</p>
            <Link to={`/journeys/${suggestedMission.slug}`} className="fhs-link-btn">
              Start Journey →
            </Link>
          </div>
        </div>
      </section>

      <div className="fhs-dashboard__grid fhs-dashboard__grid--split">
        <section className="fhs-panel">
          <h3>Suggested Calculators</h3>
          <div className="fhs-chip-links">
            {suggestedCalculators.map((calc) => (
              <Link key={calc.path} to={calc.path} className="fhs-chip-link">
                {calc.icon} {calc.title}
              </Link>
            ))}
          </div>
        </section>

        <section className="fhs-panel">
          <h3>Suggested Learn Modules</h3>
          <div className="fhs-chip-links">
            {suggestedLearn.map((module) => (
              <Link key={module.title} to={module.path} className="fhs-chip-link">
                📚 {module.title}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <RecommendationPanel
        pathname="/financial-health-score"
        healthTopic={focusHealthTopic}
        sourceType="health-score"
        className="fi-rec-panel--health"
        compact
      />

      <p className="fhs-disclaimer">{HEALTH_SCORE_DISCLAIMER}</p>
    </div>
  );
}

export default HealthScoreDashboard;
