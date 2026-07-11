import { Link } from "react-router-dom";

function JourneyCalculators({ calculators }) {
  return (
    <section className="fje-block" aria-labelledby="fje-calculators-title">
      <div className="fje-block__head">
        <h2 id="fje-calculators-title">Related Calculators</h2>
        <p>Use FOINWI calculators to estimate numbers for this journey.</p>
      </div>
      <div className="fje-calc-grid">
        {calculators.map((calc) => (
          <Link to={calc.path} className="fje-calc-card" key={calc.path}>
            <span className="fje-calc-card__icon" aria-hidden="true">
              {calc.icon}
            </span>
            <div>
              <h3>{calc.title}</h3>
              <p>{calc.desc}</p>
              <span className="fje-calc-card__link">Open calculator →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default JourneyCalculators;
