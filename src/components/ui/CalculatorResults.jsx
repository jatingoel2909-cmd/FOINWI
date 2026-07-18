import ResultCard from "./ResultCard";

function CalculatorResults({
  primary,
  metrics = [],
  story,
  headerTitle = "Your Estimated Outcome",
  headerSubtitle = "Calculated using your current inputs.",
}) {
  if (!primary?.label || primary?.value == null) return null;

  return (
    <div className="calc-results-story">
      <header className="calc-results-story__header">
        <h3 className="calc-results-story__title">{headerTitle}</h3>
        <p className="calc-results-story__subtitle">{headerSubtitle}</p>
      </header>

      <div
        className="calc-results-story__outputs"
        aria-live="polite"
        aria-atomic="true"
        role="status"
        aria-label="Calculation results"
      >
        <div className="calc-results-story__primary">
          <ResultCard label={primary.label} value={primary.value} highlight />
        </div>

        {metrics.length > 0 ? (
          <div className="calc-results-story__metrics">
            {metrics.map((metric) => (
              <ResultCard
                key={`${metric.label}-${metric.value}`}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </div>
        ) : null}
      </div>

      {story ? <p className="calc-results-story__story">{story}</p> : null}
    </div>
  );
}

export default CalculatorResults;
