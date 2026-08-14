import { Link } from "react-router-dom";
import { getCalculatorsByPaths } from "../../utils/learnHelpers";

function LessonTimeline({ pathSlug, lessons }) {
  return (
    <ol className="la-timeline">
      {lessons.map((lesson, index) => {
        const calculators = getCalculatorsByPaths(lesson.calculators);
        const isLast = index === lessons.length - 1;

        return (
          <li
            key={lesson.id}
            className={`la-timeline__item${isLast ? " la-timeline__item--last" : ""}`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="la-timeline__marker" aria-hidden="true">
              <span className="la-timeline__preview-dot" title="Lesson indicator" />
            </div>

            <article className="la-timeline__card">
              <div className="la-timeline__head">
                <span className="la-timeline__number">Lesson {index + 1}</span>
                <span className="la-timeline__preview-badge">{lesson.estimatedMinutes} min</span>
              </div>
              <h3>
                {lesson.contentStatus === "complete" ? (
                  <Link to={`/learn/${pathSlug}/${lesson.slug}`} className="la-lesson-link">
                    {lesson.title}
                  </Link>
                ) : lesson.title}
              </h3>
              <p>{lesson.summary}</p>
              {lesson.contentStatus === "complete" ? (
                <Link to={`/learn/${pathSlug}/${lesson.slug}`} className="la-lesson-open">
                  Open lesson →
                </Link>
              ) : null}

              {calculators.length > 0 && (
                <div className="la-timeline__tools">
                  <span className="la-timeline__tools-label">Related tools</span>
                  <div className="la-chip-row">
                    {calculators.map((calc) => (
                      <Link key={calc.path} to={calc.path} className="la-chip">
                        {calc.icon} {calc.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export default LessonTimeline;
