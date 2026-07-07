import { Link } from "react-router-dom";

const learningPaths = [
  "Money Basics",
  "Investing Basics",
  "Loans & Debt",
  "Tax & Salary",
  "Retirement Planning",
];

function LearnPreviewSection() {
  return (
    <section className="shrix-home-section" id="learn-preview">
      <p className="shrix-section-label">Learn</p>
      <h2>Learn Finance Step by Step</h2>
      <p className="shrix-home-section__subtitle">
        From money basics to investing, loans, tax, and retirement, FOINWI will help
        users learn finance in simple language.
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
