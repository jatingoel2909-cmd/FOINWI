import { Link } from "react-router-dom";

const aiTools = [
  {
    title: "AI SIP Explainer",
    text: "Get plain-language explanations of SIP results and long-term wealth scenarios.",
  },
  {
    title: "AI EMI Guide",
    text: "Understand loan EMI, tenure, and repayment choices with guided comparisons.",
  },
  {
    title: "AI Tax Helper",
    text: "Explore tax concepts and salary planning questions with educational support.",
  },
  {
    title: "AI Retirement Planner",
    text: "Plan retirement milestones with structured insights for Indian savers.",
  },
];

function AiToolsPreviewSection() {
  return (
    <section className="shrix-home-section shrix-home-section--alt" id="ai-preview">
      <p className="shrix-section-label">Coming Soon</p>
      <h2>FOINWI AI Money Guide — Coming Soon</h2>
      <p className="shrix-home-section__subtitle">
        We are building AI-powered tools that can explain calculator results, simplify
        money concepts, and help users plan financial goals step by step.
      </p>
      <div className="shrix-home-grid shrix-home-grid--4">
        {aiTools.map((tool) => (
          <article className="shrix-home-card" key={tool.title}>
            <h3>{tool.title}</h3>
            <p>{tool.text}</p>
            <span className="shrix-home-badge">Coming Soon</span>
          </article>
        ))}
      </div>
      <div className="shrix-home-section__action">
        <Link to="/ai-tools" className="shrix-view-all-btn">
          View AI Roadmap →
        </Link>
      </div>
    </section>
  );
}

export default AiToolsPreviewSection;
