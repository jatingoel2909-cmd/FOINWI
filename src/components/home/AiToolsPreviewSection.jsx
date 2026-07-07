import { Link } from "react-router-dom";

const aiTools = [
  {
    title: "AI SIP Explainer",
    text: "Understand SIP results, long-term wealth growth, investment gaps, and goal-based monthly contribution needs.",
  },
  {
    title: "AI EMI Guide",
    text: "Understand EMI, tenure, interest cost, repayment choices, and loan affordability in simple language.",
  },
  {
    title: "AI Tax Helper",
    text: "Learn salary, tax regime, deductions, HRA, and basic tax planning concepts for Indian users.",
  },
  {
    title: "AI Retirement Planner",
    text: "Estimate future retirement needs, inflation impact, monthly savings gap, and long-term planning direction.",
  },
];

function AiToolsPreviewSection() {
  return (
    <section
      className="shrix-home-section shrix-home-section--alt shrix-ai-preview"
      id="ai-preview"
    >
      <p className="shrix-section-label">Coming Soon</p>
      <h2>FOINWI AI Money Guide</h2>
      <p className="shrix-home-section__subtitle shrix-ai-preview__subtitle">
        We are building AI-powered tools to explain calculator results, simplify money
        concepts, compare choices, and help users plan financial goals step by step.
      </p>
      <p className="shrix-ai-preview__roadmap">
        AI tools will launch gradually, starting with simple explanations and later
        moving toward goal planning, reports, and smart financial journeys.
      </p>

      <div className="shrix-home-grid shrix-home-grid--4 shrix-ai-preview-grid">
        {aiTools.map((tool) => (
          <article className="shrix-home-card shrix-ai-preview-card" key={tool.title}>
            <h3>{tool.title}</h3>
            <p>{tool.text}</p>
            <span className="shrix-home-badge shrix-ai-preview-badge">Coming Soon</span>
          </article>
        ))}
      </div>

      <p className="shrix-ai-preview__disclaimer">
        AI tools will provide educational guidance only and will not replace qualified
        financial, tax, loan, legal, or investment professionals.
      </p>

      <div className="shrix-home-section__action">
        <Link to="/ai-tools" className="shrix-view-all-btn">
          View AI Roadmap →
        </Link>
      </div>
    </section>
  );
}

export default AiToolsPreviewSection;
