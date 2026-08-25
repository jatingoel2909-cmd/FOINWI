import { Link } from "react-router-dom";

const learningPaths = [
  "Money Basics",
  "Investing Fundamentals",
  "Loans & EMI",
  "Income Tax Basics",
  "Retirement Planning",
];

function LearnPreviewSection() {
  return (
    <section className="shrix-home-section" id="learn-preview">
      <p className="shrix-section-label">Learn</p>
      <h2>Continue with Structured Learning</h2>
      <p className="shrix-home-section__subtitle">
        After calculators and insights, deepen the fundamentals — money basics,
        investing, loans, tax, and retirement — in plain language.
      </p>
      <div className="shrix-home-paths">
        {learningPaths.map((path) => (
          <span className="shrix-home-path" key={path}>
            {path}
          </span>
        ))}
      </div>
      <div className="shrix-home-section__action">
        <Link to="/learn" className="shrix-view-all-btn">
          Start Learning →
        </Link>
      </div>
    </section>
  );
}

export default LearnPreviewSection;
