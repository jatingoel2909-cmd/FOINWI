import { Link } from "react-router-dom";

function JourneyModules({ modules }) {
  return (
    <section className="fje-block" aria-labelledby="fje-modules-title">
      <div className="fje-block__head">
        <h2 id="fje-modules-title">Learning Modules</h2>
        <p>Structured lessons connected to FOINWI Learn Academy paths.</p>
      </div>
      <div className="fje-modules-grid">
        {modules.map((module) => (
          <article className="fje-module-card" key={module.id}>
            <div className="fje-module-card__meta">
              <span className="fje-module-card__time">{module.duration}</span>
              <span className="fje-module-card__difficulty">{module.difficulty}</span>
            </div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            {module.learnSlug && (
              <Link to={`/learn/${module.learnSlug}`} className="fje-module-card__cta">
                Continue learning →
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default JourneyModules;
