import JourneyHeroVisual from "./JourneyHeroVisual";

function JourneyHeader({ journey }) {
  const achievements = [
    {
      icon: "⏱️",
      label: "Completion time",
      value: journey.estimatedTime,
    },
    {
      icon: "🧭",
      label: "Milestones",
      value: `${journey.timeline.length} guided phases`,
    },
    {
      icon: "📚",
      label: "Learning",
      value: `${journey.modules.length} modules`,
    },
    {
      icon: "🧮",
      label: "Practice",
      value: `${journey.calculatorPaths.length} calculators`,
    },
  ];

  return (
    <header className="fje-hero">
      <div className="fje-hero__shell">
        <a href="/#journeys" className="fje-hero__back">
          ← All Journeys
        </a>

        <div className="fje-hero__layout">
          <div className="fje-hero__content">
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

            <div className="fje-hero__achievements" aria-label="Journey overview">
              {achievements.map((item) => (
                <article className="fje-achievement-card" key={item.label}>
                  <span className="fje-achievement-card__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <div>
                    <p className="fje-achievement-card__label">{item.label}</p>
                    <p className="fje-achievement-card__value">{item.value}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="fje-hero__skills">
              <h3>Skills you will build</h3>
              <ul>
                {journey.skillsLearned.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>

          <JourneyHeroVisual />
        </div>
      </div>
    </header>
  );
}

export default JourneyHeader;
