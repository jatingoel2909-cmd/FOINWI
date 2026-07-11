const MILESTONE_ICONS = {
  "define-goal": "🎯",
  "estimate-sip": "💰",
  "compare-scenarios": "📊",
  "build-discipline": "🔄",
  "review-rebalance": "✨",
};

function JourneyTimeline({ timeline, currentIndex = 0 }) {
  return (
    <section className="fje-block fje-block--timeline" aria-labelledby="fje-timeline-title">
      <div className="fje-block__head">
        <h2 id="fje-timeline-title">Journey Timeline</h2>
        <p>Your guided path from first step to long-term wealth habits.</p>
      </div>

      <div className="fje-timeline-stage">
        <aside className="fje-timeline-rail" aria-hidden="true">
          <div className="fje-timeline-rail__line" />
          <ol className="fje-timeline-rail__nodes">
            {timeline.map((step, index) => {
              const state =
                index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming";
              return (
                <li key={step.id} className={`fje-timeline-rail__node fje-timeline-rail__node--${state}`}>
                  <span>{state === "completed" ? "✓" : index + 1}</span>
                </li>
              );
            })}
          </ol>
        </aside>

        <ol className="fje-timeline-cards">
          {timeline.map((step, index) => {
            const state =
              index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming";
            const icon = step.icon ?? MILESTONE_ICONS[step.id] ?? "◆";
            return (
              <li key={step.id} className={`fje-timeline__item fje-timeline__item--${state}`}>
                <article className="fje-timeline__card">
                  <div className="fje-timeline__card-top">
                    <span className="fje-timeline__milestone-icon" aria-hidden="true">
                      {icon}
                    </span>
                    <span className="fje-timeline__phase">{step.phase}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default JourneyTimeline;
