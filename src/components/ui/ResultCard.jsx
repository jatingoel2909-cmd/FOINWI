function ResultCard({ label, value, highlight = false }) {
  return (
    <div
      className={`calc-result-card${highlight ? " calc-result-card--highlight" : ""}`}
    >
      <span className="calc-result-card__label">{label}</span>
      <strong className="calc-result-card__value">{value}</strong>
    </div>
  );
}

export default ResultCard;
