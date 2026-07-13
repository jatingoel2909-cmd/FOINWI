import { Link } from "react-router-dom";
import { ALL_CALCULATORS } from "../data/calculators";
import "./CalculatorGrid.css";

function CalculatorGrid({
  calculators = ALL_CALCULATORS,
  sectionLabel = "Powerful Tools",
  showSectionLabel = true,
  title = "Popular Financial Calculators",
  subtitle = null,
  sectionId = "calculators",
  showViewAll = false,
  className = "",
}) {
  return (
    <section
      id={sectionId || undefined}
      className={`shrix-calculators${className ? ` ${className}` : ""}`}
    >
      {showSectionLabel && (
        <p className="shrix-section-label">{sectionLabel}</p>
      )}
      <h2>{title}</h2>
      {subtitle && <p className="shrix-calculators__subtitle">{subtitle}</p>}

      <div className="shrix-grid">
        {calculators.map(({ icon, title: calcTitle, cardTitle, desc, path }) => (
          <div className="shrix-card" key={calcTitle}>
            <div className="shrix-icon">{icon}</div>
            <h3>{cardTitle || calcTitle}</h3>
            <p>{desc}</p>
            {path ? (
              <Link to={path} className="shrix-card-link">
                Calculate →
              </Link>
            ) : (
              <button type="button">Calculate →</button>
            )}
          </div>
        ))}
      </div>

      {showViewAll && (
        <div className="shrix-calculators__actions">
          <Link to="/calculators" className="shrix-view-all-btn">
            View All Calculators →
          </Link>
        </div>
      )}
    </section>
  );
}

export default CalculatorGrid;
