function JourneyMissionLink({ mission }) {
  if (!mission) return null;

  return (
    <section className="fje-block fje-block--mission" aria-labelledby="fje-mission-title">
      <div className="fje-block__head">
        <h2 id="fje-mission-title">Financial Mission</h2>
        <p>This journey connects to your {mission.title} mission on FOINWI.</p>
      </div>
      <article className="fje-mission-card">
        <span className="fje-mission-card__icon" aria-hidden="true">
          {mission.icon}
        </span>
        <div>
          <h3>{mission.title}</h3>
          <p>{mission.description}</p>
          <ul className="fje-mission-card__list">
            {mission.checklist.slice(0, 3).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="fje-mission-card__note">
            Use the mission checklist alongside this journey to turn learning into action.
          </p>
        </div>
      </article>
    </section>
  );
}

export default JourneyMissionLink;
