import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HealthScoreQuestionnaire from "../components/health/HealthScoreQuestionnaire";
import HealthScoreDashboard from "../components/health/HealthScoreDashboard";
import {
  calculateHealthScore,
  getDefaultAnswers,
} from "../utils/healthScoreEngine";
import { HEALTH_SCORE_DISCLAIMER } from "../data/healthScoreQuestions";
import "../styles/global.css";
import "../styles/health-score.css";

function FinancialHealthScorePage() {
  const [answers, setAnswers] = useState(getDefaultAnswers);
  const [phase, setPhase] = useState("intro");
  const [result, setResult] = useState(null);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleStart = () => setPhase("questionnaire");

  const handleComplete = () => {
    setResult(calculateHealthScore(answers));
    setPhase("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    setAnswers(getDefaultAnswers());
    setResult(null);
    setPhase("questionnaire");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="shrix-app">
      <Navbar />

      <header className="fhs-hero">
        <div className="fhs-hero__inner">
          <p className="shrix-section-label">FOINWI Financial Health Score</p>
          <h1>Understand Your Financial Wellness</h1>
          <p>
            A 12-question educational assessment covering savings, investments,
            protection, debt, and planning — designed to help you reflect on
            your habits, not to provide advice.
          </p>
          {phase === "intro" && (
            <button type="button" className="fhs-btn fhs-btn--primary" onClick={handleStart}>
              Start Assessment →
            </button>
          )}
        </div>
      </header>

      <main className="fhs-main">
        {phase === "intro" && (
          <section className="fhs-intro-grid">
            <article className="fhs-intro-card">
              <span aria-hidden="true">💰</span>
              <h3>Savings</h3>
              <p>Monthly savings rate and budget tracking habits.</p>
            </article>
            <article className="fhs-intro-card">
              <span aria-hidden="true">📈</span>
              <h3>Investments</h3>
              <p>SIP participation, EPF, and NPS contributions.</p>
            </article>
            <article className="fhs-intro-card">
              <span aria-hidden="true">🛡️</span>
              <h3>Protection</h3>
              <p>Emergency fund reserves and insurance coverage.</p>
            </article>
            <article className="fhs-intro-card">
              <span aria-hidden="true">💳</span>
              <h3>Debt</h3>
              <p>Loan obligations and credit card usage patterns.</p>
            </article>
            <article className="fhs-intro-card">
              <span aria-hidden="true">🎯</span>
              <h3>Planning</h3>
              <p>Goals, retirement, tax planning, and income context.</p>
            </article>
            <article className="fhs-intro-card fhs-intro-card--note">
              <span aria-hidden="true">📋</span>
              <h3>Educational Only</h3>
              <p>No login, no backend, no AI — just transparent self-assessment.</p>
            </article>
          </section>
        )}

        {phase === "questionnaire" && (
          <HealthScoreQuestionnaire
            answers={answers}
            onChange={handleChange}
            onComplete={handleComplete}
          />
        )}

        {phase === "results" && result && (
          <HealthScoreDashboard result={result} onRetake={handleRetake} />
        )}
      </main>

      {phase !== "results" && (
        <p className="fhs-disclaimer fhs-disclaimer--page">{HEALTH_SCORE_DISCLAIMER}</p>
      )}

      <Footer />
    </div>
  );
}

export default FinancialHealthScorePage;
