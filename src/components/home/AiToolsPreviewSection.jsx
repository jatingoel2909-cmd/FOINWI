import { Link } from "react-router-dom";

const chatPreview = [
  {
    user: "How much SIP do I need for ₹1 crore?",
    ai: "I’ll help estimate the monthly SIP and explain the result step by step.",
  },
  {
    user: "Can I afford this EMI?",
    ai: "I’ll help compare EMI, income, tenure, and affordability in simple language.",
  },
  {
    user: "How should I plan retirement?",
    ai: "I’ll help understand inflation, monthly savings gap, and long-term planning direction.",
  },
];

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

      <article className="shrix-ai-assistant-preview">
        <div className="shrix-ai-assistant-preview__header">
          <h2>FOINWI AI Money Guide</h2>
          <span className="shrix-ai-assistant-preview__badge">Coming Soon</span>
        </div>

        <p className="shrix-ai-assistant-preview__subtitle">
          A future AI assistant to help users understand calculators, compare options,
          and plan smarter money decisions.
        </p>

        <div className="shrix-ai-assistant-preview__chat">
          {chatPreview.map((exchange) => (
            <div className="shrix-ai-assistant-preview__exchange" key={exchange.user}>
              <div className="shrix-ai-chat-bubble shrix-ai-chat-bubble--user">
                <span className="shrix-ai-chat-bubble__label">User</span>
                <p>{exchange.user}</p>
              </div>
              <div className="shrix-ai-chat-bubble shrix-ai-chat-bubble--ai">
                <span className="shrix-ai-chat-bubble__label">FOINWI AI</span>
                <p>{exchange.ai}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="shrix-ai-assistant-preview__disclaimer">
          Educational guidance only. Not financial advice.
        </p>
      </article>

      <div className="shrix-home-grid shrix-home-grid--4 shrix-ai-preview-grid">
        {aiTools.map((tool) => (
          <article className="shrix-home-card shrix-ai-preview-card" key={tool.title}>
            <h3>{tool.title}</h3>
            <p>{tool.text}</p>
            <span className="shrix-home-badge shrix-ai-preview-badge">Coming Soon</span>
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
