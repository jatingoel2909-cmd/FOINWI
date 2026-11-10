import { Link, Navigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getLessonById, getLessonByRoute, getLearningPathBySlug, LEARN_ACADEMY_NOTICE } from "../data/learnAcademy";
import { getCalculatorsByPaths } from "../utils/learnHelpers";
import "../styles/global.css";
import "../styles/learn-academy.css";

function LessonCopy({ text }) {
  const blocks = String(text ?? "")
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return blocks.map((paragraph) => <p key={paragraph}>{paragraph}</p>);
}

function LessonList({ items }) {
  if (!items?.length) return null;

  return (
    <ul>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function LearnLessonPage() {
  const { pathSlug, lessonSlug } = useParams();
  const path = getLearningPathBySlug(pathSlug);
  const lesson = getLessonByRoute(pathSlug, lessonSlug);

  if (!path || !lesson || lesson.contentStatus !== "complete") {
    return <Navigate to={path ? `/learn/${path.slug}` : "/learn"} replace />;
  }

  const calculators = getCalculatorsByPaths(lesson.calculatorLinks);
  const lessonIndex = path.lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = lessonIndex > 0 ? path.lessons[lessonIndex - 1] : null;
  const nextLesson = path.lessons[lessonIndex + 1] ?? null;
  const relatedLessons = lesson.relatedLessonIds.map(getLessonById).filter(Boolean);

  return (
    <div className="shrix-app">
      <a className="shrix-skip-link" href="#main-content">Skip to main content</a>
      <Navbar />

      <main id="main-content">
        <section className="la-hero la-hero--path" aria-labelledby="learn-lesson-title">
          <div className="la-hero__inner">
            <Link to={`/learn/${path.slug}`} className="la-back-link">← {path.title}</Link>
            <p className="shrix-section-label">{lesson.level} lesson · about {lesson.estimatedMinutes} minutes</p>
            <h1 id="learn-lesson-title">{lesson.title}</h1>
            <p>{lesson.summary}</p>
          </div>
        </section>

        <div className="la-main la-main--path">
          <article className="la-lesson">
            <section aria-labelledby="lesson-means">
              <h2 id="lesson-means">What this means</h2>
              <LessonCopy text={lesson.simpleExplanation} />
            </section>
            <section aria-labelledby="lesson-matters">
              <h2 id="lesson-matters">Why it matters</h2>
              <LessonCopy text={lesson.whyItMatters} />
            </section>
            <section aria-labelledby="lesson-ideas">
              <h2 id="lesson-ideas">Key ideas</h2>
              <LessonList items={lesson.keyIdeas} />
            </section>
            <section aria-labelledby="lesson-example">
              <h2 id="lesson-example">Simple example</h2>
              <LessonCopy text={lesson.example} />
            </section>
            {lesson.workedIllustration ? (
              <section aria-labelledby="lesson-worked">
                <h2 id="lesson-worked">Worked illustration</h2>
                <LessonCopy text={lesson.workedIllustration} />
              </section>
            ) : null}
            {lesson.assumptions?.length ? (
              <section aria-labelledby="lesson-assumptions">
                <h2 id="lesson-assumptions">Assumptions</h2>
                <LessonList items={lesson.assumptions} />
              </section>
            ) : null}
            {lesson.commonMistakes?.length ? (
              <section aria-labelledby="lesson-mistakes">
                <h2 id="lesson-mistakes">Common mistakes</h2>
                <LessonList items={lesson.commonMistakes} />
              </section>
            ) : null}
            <section aria-labelledby="lesson-deeper">
              <h2 id="lesson-deeper">A closer look</h2>
              <LessonCopy text={lesson.deeperExplanation} />
            </section>
            {lesson.limitations?.length ? (
              <section aria-labelledby="lesson-limits">
                <h2 id="lesson-limits">Limitations</h2>
                <LessonList items={lesson.limitations} />
              </section>
            ) : null}
            {lesson.sources?.length ? (
              <section aria-labelledby="lesson-sources">
                <h2 id="lesson-sources">Sources to check</h2>
                <p>These are starting points for the named authority or for the FOINWI notes already on a calculator. They are not a filing position.</p>
                <LessonList items={lesson.sources} />
              </section>
            ) : null}
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
              <nav className="la-lesson-nav" aria-label="Lesson sequence">
                {previousLesson ? (
                  <Link to={`/learn/${path.slug}/${previousLesson.slug}`} className="la-btn la-btn--ghost">
                    ← Previous: {previousLesson.title}
                  </Link>
                ) : null}
                <Link to={nextLesson ? `/learn/${path.slug}/${nextLesson.slug}` : `/learn/${path.slug}`} className="la-btn la-btn--primary">
                  {nextLesson ? "Open next lesson →" : `Return to ${path.title} →`}
                </Link>
              </nav>
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
        </div>

        <p className="la-notice">{LEARN_ACADEMY_NOTICE}</p>
      </main>

      <Footer />
    </div>
  );
}

export default LearnLessonPage;
