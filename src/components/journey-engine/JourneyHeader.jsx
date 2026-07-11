function JourneyHeader({ journey }) {
  return (
    <header className="fje-hero">
      <div className="fje-hero__inner">
        <a href="/#journeys" className="fje-hero__back">
          ← All Journeys
        </a>
        <div className="fje-hero__top">
          <div className="fje-hero__icon" aria-hidden="true">
            <span>{journey.icon}</span>
          </div>
          <div className="fje-hero__meta">
            <p className="shrix-section-label">Financial Journey</p>
            <h1>{journey.title}</h1>
            <p className="fje-hero__subtitle">{journey.subtitle}</p>
            <div className="fje-hero__badges">
              <span className="fje-badge">{journey.estimatedTime}</span>
              <span className="fje-badge fje-badge--muted">Self-paced</span>
            </div>
          </div>
        </div>

        <section className="fje-hero__overview" aria-labelledby="fje-overview-title">
          <h2 id="fje-overview-title">Overview</h2>
          <p>{journey.overview}</p>
        </section>

        <div className="fje-hero__skills">
          <h3>Skills you will learn</h3>
          <ul>
            {journey.skillsLearned.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default JourneyHeader;
