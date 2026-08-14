import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getLessonById, getLessonByRoute, getLearningPathBySlug } from "../data/learnAcademy";
import { getCalculatorsByPaths } from "../utils/learnHelpers";
import "../styles/global.css";
import "../styles/learn-academy.css";

function LearnLessonPage() {
  const { pathSlug, lessonSlug } = useParams();
  const path = getLearningPathBySlug(pathSlug);
  const lesson = getLessonByRoute(pathSlug, lessonSlug);

  if (!path || !lesson || lesson.contentStatus !== "complete") {
    return <Navigate to={path ? `/learn/${path.slug}` : "/learn"} replace />;
  }

  const calculators = getCalculatorsByPaths(lesson.calculatorLinks);
  const lessonIndex = path.lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = path.lessons[lessonIndex + 1] ?? null;
  const relatedLessons = lesson.relatedLessonIds.map(getLessonById).filter(Boolean);

  return (
    <div className="shrix-app">
      <Navbar />
      <header className="la-hero la-hero--path">
        <div className="la-hero__inner">
          <Link to={`/learn/${path.slug}`} className="la-back-link">← {path.title}</Link>
          <p className="shrix-section-label">{lesson.level} lesson · about {lesson.estimatedMinutes} minutes</p>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
        </div>
      </header>

      <main className="la-main la-main--path">
        <article className="la-lesson">
          <section aria-labelledby="lesson-means">
            <h2 id="lesson-means">What this means</h2>
            <p>{lesson.simpleExplanation}</p>
          </section>
          <section aria-labelledby="lesson-matters">
            <h2 id="lesson-matters">Why it matters</h2>
            <p>{lesson.whyItMatters}</p>
          </section>
          <section aria-labelledby="lesson-ideas">
            <h2 id="lesson-ideas">Key ideas</h2>
            <ul>
              {lesson.keyIdeas.map((idea) => <li key={idea}>{idea}</li>)}
            </ul>
          </section>
          <section aria-labelledby="lesson-example">
            <h2 id="lesson-example">Simple example</h2>
            <p>{lesson.example}</p>
          </section>
          <details className="la-lesson__deeper">
            <summary>Go deeper</summary>
            <p>{lesson.deeperExplanation}</p>
          </details>
        </article>

        {calculators.length > 0 ? (
          <section className="la-tools-panel" aria-labelledby="lesson-tools">
            <h2 id="lesson-tools">Try a tool</h2>
            <p>Use these calculators to explore educational scenarios using your own assumptions.</p>
            <div className="la-chip-row la-chip-row--wide">
              {calculators.map((calculator) => (
                <Link key={calculator.path} to={calculator.path} className="la-tool-card">
                  <span aria-hidden="true">{calculator.icon}</span>
                  <div>
                    <strong>{calculator.title}</strong>
                    <p>{calculator.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="la-continue la-continue--inline" aria-labelledby="lesson-continue">
          <div className="la-continue__copy">
            <p className="shrix-section-label">Continue learning</p>
            <h2 id="lesson-continue">{nextLesson ? `Up next: ${nextLesson.title}` : `Continue with ${path.title}`}</h2>
            <p>{lesson.nextSteps[0]}</p>
            <Link to={nextLesson ? `/learn/${path.slug}/${nextLesson.slug}` : `/learn/${path.slug}`} className="la-btn la-btn--primary">
              {nextLesson ? "Open next lesson →" : `Return to ${path.title} →`}
            </Link>
          </div>
        </section>

        {relatedLessons.length > 0 ? (
          <section className="la-more-paths" aria-labelledby="lesson-related">
            <h2 id="lesson-related">Related learning</h2>
            <div className="la-more-paths__grid">
              {relatedLessons.map((relatedLesson) => (
                <Link key={relatedLesson.id} to={`/learn/${relatedLesson.pathSlug}/${relatedLesson.slug}`} className="la-more-path">
                  <span>{relatedLesson.title}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <p className="la-notice">Learning content is educational only and does not provide financial, investment, tax, legal, or loan advice.</p>
      <Footer />
    </div>
  );
}

export default LearnLessonPage;
