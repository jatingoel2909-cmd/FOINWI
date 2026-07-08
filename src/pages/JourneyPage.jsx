import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getJourneyBySlug } from "../data/journeys";
import "../styles/global.css";
import "../styles/journey.css";

function JourneyPage() {
  const { slug } = useParams();
  const journey = getJourneyBySlug(slug);

  if (!journey) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="shrix-app">
      <Navbar />

      <header className="shrix-journey-hero">
        <div className="shrix-journey-hero__inner">
          <Link to="/#journeys" className="shrix-journey-hero__back">
            ← All Journeys
          </Link>
          <div className="shrix-journey-hero__badge" aria-hidden="true">
            <span>{journey.icon}</span>
          </div>
          <p className="shrix-section-label">Financial Journey</p>
          <h1>{journey.title}</h1>
          <p className="shrix-journey-hero__subtitle">{journey.heroSubtitle}</p>
          <span className="shrix-journey-hero__duration">{journey.duration}</span>
        </div>
      </header>

      <main className="shrix-journey-page">
        <section className="shrix-journey-block shrix-journey-animate">
          <h2>Journey Overview</h2>
          <p>{journey.overview}</p>
        </section>

        <section className="shrix-journey-block shrix-journey-animate">
          <h2>Required Calculators</h2>
          <p className="shrix-journey-block__intro">
            Use these FOINWI tools to estimate numbers and compare scenarios for this journey.
          </p>
          <div className="shrix-journey-calc-grid">
            {journey.calculators.map((calc) => (
              <Link to={calc.path} className="shrix-journey-calc-card" key={calc.path}>
                <h3>{calc.title}</h3>
                <p>{calc.desc}</p>
                <span>Open calculator →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="shrix-journey-block shrix-journey-animate">
          <h2>Learning Modules</h2>
          <ul className="shrix-journey-list">
            {journey.learningModules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ul>
          <Link to="/learn" className="shrix-journey-inline-link">
            Explore learning paths →
          </Link>
        </section>

        <section className="shrix-journey-block shrix-journey-block--ai shrix-journey-animate">
          <div className="shrix-journey-ai">
            <span className="shrix-journey-ai__badge">Coming Soon</span>
            <h2>AI Guidance Preview</h2>
            <p>{journey.aiPreview}</p>
            <Link to="/ai-tools" className="shrix-journey-inline-link">
              View AI Roadmap →
            </Link>
          </div>
        </section>

        <section className="shrix-journey-block shrix-journey-animate">
          <h2>Checklist</h2>
          <ul className="shrix-journey-checklist">
            {journey.checklist.map((item) => (
              <li key={item}>
                <span className="shrix-journey-checklist__mark" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="shrix-journey-block shrix-journey-animate">
          <h2>Your Progress Timeline</h2>
          <ol className="shrix-journey-timeline">
            {journey.timeline.map((step, index) => (
              <li className="shrix-journey-timeline__step" key={step.title}>
                <span className="shrix-journey-timeline__num">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="shrix-journey-next shrix-journey-animate">
          <p className="shrix-journey-next__label">Recommended Next Step</p>
          <h2>{journey.nextStep.title}</h2>
          <p>{journey.nextStep.text}</p>
          <Link to={journey.nextStep.path} className="shrix-journey-next__btn">
            {journey.nextStep.cta}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default JourneyPage;
