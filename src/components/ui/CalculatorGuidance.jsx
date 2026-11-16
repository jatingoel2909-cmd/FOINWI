import { Link } from "react-router-dom";
import { getCalculatorGuidance } from "../../data/calculatorGuidance";
import { getCalculatorExplain } from "../../data/calculatorExplains";
import { getCalculatorInsights } from "../../data/calculatorInsights";

function GuidanceList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function CalculatorGuidance({ calculatorId }) {
  const guidance = getCalculatorGuidance(calculatorId);
  const insights = getCalculatorInsights(calculatorId);
  const explain = getCalculatorExplain(calculatorId);
  const assumptions = insights?.howCalculated?.inputs ?? [];
  const limitations = explain?.beginnerMistakes ?? [];
  const summary = insights?.howCalculated?.summary ?? "";

  if (!guidance || !summary || assumptions.length === 0 || limitations.length === 0) {
    return null;
  }

  const headingId = "calc-guidance-title";

  return (
    <section className="calc-guidance" aria-labelledby={headingId}>
      <p className="shrix-section-label">Educational guidance</p>
      <h2 id={headingId} className="calc-guidance__title">
        How to read this estimate
      </h2>
      <div className="calc-guidance__grid">
        <article className="calc-guidance__card">
          <h3>Assumptions</h3>
          <p>{summary}</p>
          <GuidanceList items={assumptions} />
        </article>
        <article className="calc-guidance__card">
          <h3>Worked example</h3>
          <p>These are the starting inputs already shown on this calculator.</p>
          <GuidanceList items={guidance.lines} />
          <p className="calc-guidance__result">{guidance.outcome}</p>
        </article>
        <article className="calc-guidance__card">
          <h3>Limitations</h3>
          <GuidanceList items={limitations} />
        </article>
        <article className="calc-guidance__card">
          <h3>Related lesson</h3>
          <p>This lesson already discusses this calculator.</p>
          <Link to={guidance.lesson.path} className="calc-guidance__link">
            {guidance.lesson.title} →
          </Link>
        </article>
      </div>
    </section>
  );
}

export default CalculatorGuidance;
