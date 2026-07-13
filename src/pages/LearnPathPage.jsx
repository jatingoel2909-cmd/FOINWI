import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LessonTimeline from "../components/learn/LessonTimeline";
import {
  getLearningPathBySlug,
  LEARN_ACADEMY_NOTICE,
  LEARNING_PATHS,
} from "../data/learnAcademy";
import { getCalculatorsByPaths } from "../utils/learnHelpers";
import "../styles/global.css";
import "../styles/learn-academy.css";

const BUILD_WEALTH_LEARN_PATHS = new Set([
  "money-basics",
  "saving-budgeting",
  "investing-fundamentals",
  "mutual-funds-sip",
]);

function LearnPathPage() {
  const { slug } = useParams();
  const path = getLearningPathBySlug(slug);

  if (!path) {
    return <Navigate to="/learn" replace />;
  }

  const nextPath = getLearningPathBySlug(path.nextPath);
  const pathCalculators = getCalculatorsByPaths(path.relatedCalculators);
  const showBuildWealthJourney = BUILD_WEALTH_LEARN_PATHS.has(path.slug);

  return (
    <div className="shrix-app">
      <Navbar />

      <header className="la-hero la-hero--path">
        <div className="la-hero__inner">
          <Link to="/learn" className="la-back-link">
            ← All Learning Paths
          </Link>
          <div className="la-hero__path-top">
            <span className="la-hero__icon" aria-hidden="true">
              {path.icon}
            </span>
            <div>
              <p className="shrix-section-label">Learning Path</p>
              <h1>{path.title}</h1>
            </div>
          </div>
          <p>{path.description}</p>
          <ul className="la-hero__stats">
            <li>
              <strong>{path.duration}</strong>
              <span>Estimated time</span>
            </li>
            <li>
              <strong>{path.difficulty}</strong>
              <span>Difficulty</span>
            </li>
            <li>
              <strong>{path.lessons.length}</strong>
              <span>Lessons</span>
            </li>
          </ul>
        </div>
      </header>

      <main className="la-main la-main--path">
        <section className="la-section">
          <div className="la-section__head">
            <h2>Curriculum Preview</h2>
            <p>
              A structured sequence of lessons with related FOINWI calculators. Completion
              indicators are preview-only — no account or progress tracking required.
            </p>
          </div>
          <LessonTimeline lessons={path.lessons} />
        </section>

        {pathCalculators.length > 0 && (
          <section className="la-tools-panel">
            <h2>Related Tools</h2>
            <p>
              Explore FOINWI calculators connected to this path. Results are estimates
              based on your inputs and assumptions.
            </p>
            <div className="la-chip-row la-chip-row--wide">
              {pathCalculators.map((calc) => (
                <Link key={calc.path} to={calc.path} className="la-tool-card">
                  <span aria-hidden="true">{calc.icon}</span>
                  <div>
                    <strong>{calc.title}</strong>
                    <p>{calc.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {nextPath && (
          <section className="la-continue la-continue--inline">
            <div className="la-continue__copy">
              <p className="shrix-section-label">Continue Learning</p>
              <h2>Up Next: {nextPath.title}</h2>
              <p>{nextPath.description}</p>
              <Link to={`/learn/${nextPath.slug}`} className="la-btn la-btn--primary">
                Start {nextPath.title} →
              </Link>
            </div>
            <article className="la-continue__card">
              <span aria-hidden="true">{nextPath.icon}</span>
              <h3>{nextPath.title}</h3>
              <ul className="la-continue__stats">
                <li>{nextPath.duration}</li>
                <li>{nextPath.difficulty}</li>
                <li>{nextPath.lessons.length} lessons</li>
              </ul>
            </article>
          </section>
        )}

        {showBuildWealthJourney && (
          <section className="la-journey-cta" aria-labelledby="la-journey-cta-title">
            <span className="la-journey-cta__icon" aria-hidden="true">
              📈
            </span>
            <div>
              <p className="shrix-section-label">Financial Journey</p>
              <h2 id="la-journey-cta-title">Start Build Wealth Journey</h2>
              <p>
                Apply what you learned with a guided path for SIP planning, goal-based
                investing, and long-term wealth habits.
              </p>
              <Link to="/journeys/build-wealth" className="la-btn la-btn--primary">
                Start Build Wealth Journey →
              </Link>
            </div>
          </section>
        )}

        <section className="la-more-paths">
          <h2>Explore Other Paths</h2>
          <div className="la-more-paths__grid">
            {LEARNING_PATHS.filter((item) => item.slug !== path.slug)
              .slice(0, 4)
              .map((item) => (
                <Link key={item.slug} to={`/learn/${item.slug}`} className="la-more-path">
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <p className="la-notice">{LEARN_ACADEMY_NOTICE}</p>
      <Footer />
    </div>
  );
}

export default LearnPathPage;
