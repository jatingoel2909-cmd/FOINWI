function JourneyTimeline({ timeline, currentIndex = 0 }) {
  return (
    <section className="fje-block" aria-labelledby="fje-timeline-title">
      <div className="fje-block__head">
        <h2 id="fje-timeline-title">Journey Timeline</h2>
        <p>Follow these phases at your own pace to build wealth with structure.</p>
      </div>
      <ol className="fje-timeline">
        {timeline.map((step, index) => {
          const state =
            index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming";
          return (
            <li key={step.id} className={`fje-timeline__item fje-timeline__item--${state}`}>
              <div className="fje-timeline__track" aria-hidden="true">
                <span className="fje-timeline__dot">
                  {state === "completed" ? "✓" : index + 1}
                </span>
                {index < timeline.length - 1 && <span className="fje-timeline__line" />}
              </div>
              <article className="fje-timeline__card">
                <span className="fje-timeline__phase">{step.phase}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default JourneyTimeline;
