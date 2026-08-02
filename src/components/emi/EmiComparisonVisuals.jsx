import { formatCurrency } from "../../utils/calculatorFormat";
import {
  BALANCED_OPTION_NOTE,
  scaleBarPercent,
} from "../../utils/emiComparisonEngine";

function MetricChart({ title, metricKey, options, getValue, getMarkers }) {
  const max = Math.max(...options.map(getValue), 0);

  const summary = options
    .map((option) => {
      const markers = getMarkers(option);
      const markerText = markers.length ? ` (${markers.join(", ")})` : "";
      return `${option.tenureLabel}: ${formatCurrency(getValue(option))}${markerText}`;
    })
    .join(". ");

  return (
    <section className="emi-visuals__chart" aria-labelledby={`emi-chart-${metricKey}`}>
      <h4 id={`emi-chart-${metricKey}`} className="emi-visuals__chart-title">
        {title}
      </h4>
      <p className="sr-only">{summary}</p>
      <ul className="emi-visuals__bars">
        {options.map((option) => {
          const value = getValue(option);
          const width = scaleBarPercent(value, max);
          const markers = getMarkers(option);
          const label = `${option.tenureLabel}: ${formatCurrency(value)}${
            markers.length ? `, ${markers.join(", ")}` : ""
          }`;

          return (
            <li key={`${metricKey}-${option.id}`} className="emi-visuals__row">
              <div className="emi-visuals__row-meta">
                <span className="emi-visuals__tenure">{option.tenureLabel}</span>
                {markers.length > 0 ? (
                  <span className="emi-visuals__markers">{markers.join(" · ")}</span>
                ) : null}
              </div>
              <div
                className="emi-visuals__track"
                role="img"
                aria-label={label}
              >
                <div
                  className={`emi-visuals__fill${
                    markers.length ? " emi-visuals__fill--highlight" : ""
                  }`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="emi-visuals__amount">{formatCurrency(value)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function QuickSummaryCards({ highlights }) {
  if (!highlights) return null;

  const cards = [
    {
      id: "lowest-emi",
      title: "Lowest Monthly EMI",
      option: highlights.lowestEmi,
      explanation: "Lowest monthly payment among the displayed tenures.",
    },
    {
      id: "lowest-interest",
      title: "Lowest Total Interest",
      option: highlights.lowestInterest,
      explanation: "Lowest estimated interest cost among the displayed tenures.",
    },
    {
      id: "balanced",
      title: "Balanced Option",
      option: highlights.balanced,
      explanation:
        "Middle ground based on relative EMI and total-interest burden in this comparison.",
    },
  ].filter((card) => card.option);

  return (
    <div className="emi-quick-cards" aria-label="Quick comparison highlights">
      {cards.map((card) => (
        <article
          key={card.id}
          className={`emi-quick-card${card.id === "balanced" ? " emi-quick-card--balanced" : ""}`}
        >
          <h4 className="emi-quick-card__title">{card.title}</h4>
          <p className="emi-quick-card__tenure">{card.option.tenureLabel}</p>
          <dl className="emi-quick-card__stats">
            <div>
              <dt>EMI</dt>
              <dd>{formatCurrency(card.option.monthlyEmi)}</dd>
            </div>
            <div>
              <dt>Total interest</dt>
              <dd>{formatCurrency(card.option.totalInterest)}</dd>
            </div>
          </dl>
          <p className="emi-quick-card__note">{card.explanation}</p>
          {card.id === "balanced" ? (
            <p className="emi-quick-card__balanced-note">{BALANCED_OPTION_NOTE}</p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function EmiComparisonVisuals({ comparison }) {
  const options = comparison?.options ?? [];
  const highlights = comparison?.highlights;

  if (!comparison?.valid || !options.length) {
    return null;
  }

  const getEmiMarkers = (option) => {
    const markers = [];
    if (option.isLowestEmi) markers.push("Lowest EMI");
    if (option.isBalanced) markers.push("Balanced Option");
    return markers;
  };

  const getInterestMarkers = (option) => {
    const markers = [];
    if (option.isLowestInterest) markers.push("Lowest Interest");
    if (option.isBalanced) markers.push("Balanced Option");
    return markers;
  };

  const getRepaymentMarkers = (option) => {
    const markers = [];
    if (option.isLowestInterest) markers.push("Lowest Interest");
    if (option.isBalanced) markers.push("Balanced Option");
    if (option.isLowestEmi) markers.push("Lowest EMI");
    return markers;
  };

  return (
    <div className="emi-visuals">
      <QuickSummaryCards highlights={highlights} />

      <div className="emi-visuals__charts">
        <MetricChart
          title="Monthly EMI by tenure"
          metricKey="emi"
          options={options}
          getValue={(option) => option.monthlyEmi}
          getMarkers={getEmiMarkers}
        />
        <MetricChart
          title="Total interest by tenure"
          metricKey="interest"
          options={options}
          getValue={(option) => option.totalInterest}
          getMarkers={getInterestMarkers}
        />
        <MetricChart
          title="Total repayment by tenure"
          metricKey="repayment"
          options={options}
          getValue={(option) => option.totalRepayment}
          getMarkers={getRepaymentMarkers}
        />
      </div>
    </div>
  );
}

export default EmiComparisonVisuals;
