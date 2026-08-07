import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/global.css";
import "../styles/ai-guide.css";

const INTELLIGENCE_LAYERS = [
  { icon: "🧮", title: "Calculators", description: "Explain results and trade-offs behind each estimate." },
  { icon: "📚", title: "Learning", description: "Simplify concepts into clear, beginner-friendly language." },
  { icon: "🧭", title: "Journeys", description: "Guide practical next steps across planning milestones." },
  { icon: "♥", title: "Financial Health Score", description: "Explain weak areas and possible improvement paths." },
];

const MODULES = [
  {
    icon: "🏠", title: "EMI Intelligence",
    description: "Understand EMI, tenure, interest burden, prepayment impact, and loan trade-offs.",
  },
  {
    icon: "📈", title: "Investment Intelligence",
    description: "Understand SIP, compounding, inflation, goal planning, and long-term wealth-building concepts.",
  },
  {
    icon: "🧾", title: "Tax Intelligence",
    description: "Understand tax calculator results, taxable income, deductions, and regime comparison in simple language.",
  },
  {
    icon: "🎯", title: "Goal Intelligence",
    description: "Break large financial goals into smaller monthly planning steps.",
  },
  {
    icon: "📚", title: "Learning Intelligence",
    description: "Convert finance terms into simple explanations for beginners.",
  },
  {
    icon: "♥", title: "Financial Health Intelligence",
    description: "Help users understand savings, debt, protection, and planning gaps from future health-score insights.",
  },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Intelligence Mission Page", copy: "Explain the mission and safety boundaries.", status: "Current" },
  { phase: "Phase 2", title: "Guided Calculator Assistant", copy: "Help users choose calculators and understand results.", status: "Planned" },
  { phase: "Phase 3", title: "Controlled AI Chat Beta", copy: "Allow limited educational AI conversations with guardrails.", status: "Planned" },
  { phase: "Phase 4", title: "Personalized Dashboard Intelligence", copy: "Connect user goals, calculators, and learning journeys.", status: "Future" },
  { phase: "Phase 5", title: "Verified Partner Pathways", copy: "Explore verified provider discovery only after trust processes are ready.", status: "Future" },
];

const GUIDED_FLOWS = [
  {
    id: "loan",
    icon: "🏠",
    title: "Loan / EMI",
    options: ["Estimate monthly EMI", "Compare loan tenure", "Understand total interest", "Explore prepayment impact"],
    links: [
      ["EMI Calculator", "/emi-calculator"],
      ["Loan Prepayment Calculator", "/loan-prepayment-calculator"],
      ["Home Loan Eligibility Calculator", "/home-loan-eligibility-calculator"],
      ["Loans & EMI lesson", "/learn"],
    ],
  },
  {
    id: "sip",
    icon: "📈",
    title: "SIP / Investment",
    options: ["Estimate SIP growth", "Understand compounding", "Plan a goal", "Understand inflation impact"],
    links: [["SIP Calculator", "/sip-calculator"], ["Lumpsum Calculator", "/lumpsum-calculator"], ["Goal Planner", "/goal-planner"], ["Inflation Calculator", "/inflation-calculator"], ["Mutual Funds & SIP lesson", "/learn"]],
  },
  {
    id: "tax",
    icon: "🧾",
    title: "Income Tax",
    options: ["Estimate tax", "Understand taxable income", "Compare deductions", "Learn tax basics"],
    links: [["Income Tax Calculator", "/income-tax-calculator"], ["HRA Calculator", "/hra-calculator"], ["GST Calculator", "/gst-calculator"], ["Taxes & Salary guide", "/learn"]],
  },
  {
    id: "goals",
    icon: "🎯",
    title: "Goal Planning",
    options: ["Plan a future goal", "Estimate monthly savings", "Understand shortfall", "Learn goal planning"],
    links: [["Goal Planner", "/goal-planner"], ["SIP Calculator", "/sip-calculator"], ["Inflation Calculator", "/inflation-calculator"], ["Build Wealth journey", "/learn"]],
  },
  {
    id: "retirement",
    icon: "🌿",
    title: "Retirement",
    options: ["Estimate retirement corpus", "Understand inflation", "Estimate pension needs", "Learn long-term planning"],
    links: [["Retirement Calculator", "/retirement-calculator"], ["NPS Calculator", "/nps-calculator"], ["PPF Calculator", "/ppf-calculator"], ["Retirement Planning lesson", "/learn"]],
  },
  {
    id: "health",
    icon: "♥",
    title: "Financial Health",
    options: ["Understand savings", "Review debt comfort", "Check protection gaps", "Improve planning habits"],
    links: [["Financial Health Score", "/financial-health-score"], ["EMI Calculator", "/emi-calculator"], ["Goal Planner", "/goal-planner"], ["FOINWI Guide", "/learn"]],
  },
];

function AiToolsPage() {
  const [selectedFlowId, setSelectedFlowId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectedFlow = GUIDED_FLOWS.find((flow) => flow.id === selectedFlowId);

  function selectFlow(flowId) {
    setSelectedFlowId(flowId);
    setSelectedOption(null);
  }

  return (
    <div className="shrix-app">
      <Navbar />
      <main className="fi-ai">
        <section className="fi-ai__hero" aria-labelledby="fi-ai-title">
          <div className="fi-ai__hero-inner">
            <div className="fi-ai__hero-copy">
              <p className="shrix-section-label">In Development</p>
              <h1 id="fi-ai-title">FOINWI Intelligence</h1>
              <p className="fi-ai__lead">
                AI-powered financial clarity for every stage of your money journey.
              </p>
              <p className="fi-ai__intro">
                FOINWI Intelligence is being designed to help users understand calculators, compare
                scenarios, learn financial concepts, and move from confusion to clarity — without
                hype, pressure, or misleading advice.
              </p>
              <div className="fi-ai__actions">
                <Link to="/calculators" className="fi-ai__button fi-ai__button--primary">
                  Explore Calculators
                </Link>
                <Link to="/learn" className="fi-ai__button fi-ai__button--secondary">
                  Start Learning
                </Link>
              </div>
            </div>
            <aside className="fi-ai__hero-panel" aria-label="FOINWI Intelligence preview">
              <p>FOINWI Intelligence</p>
              <strong>Calculator + Learning + Journey + Health Score</strong>
              <div className="fi-ai__node-map" aria-hidden="true">
                <span>Calculators</span><span>Learning</span><span>Journeys</span><span>Health Score</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="fi-ai__section fi-ai__layer" aria-labelledby="fi-ai-layer-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Planned Intelligence Layer</p>
            <h2 id="fi-ai-layer-title">The Intelligence Layer Behind FOINWI</h2>
            <p>FOINWI Intelligence is not being designed as a random chatbot. It is planned as a guided explanation layer across calculators, learning paths, financial journeys, and future dashboards.</p>
          </div>
          <div className="fi-ai__layer-grid">
            {INTELLIGENCE_LAYERS.map((layer) => (
              <article key={layer.title} className="fi-ai__layer-card">
                <span aria-hidden="true">{layer.icon}</span>
                <h3>{layer.title}</h3>
                <p>{layer.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fi-ai__section fi-ai__section--chat" aria-labelledby="fi-ai-chat-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Static Preview</p>
            <h2 id="fi-ai-chat-title">A Preview of How FOINWI Intelligence Will Help</h2>
            <p>Preview only. FOINWI Intelligence is planned, not a live chat service today.</p>
          </div>
          <div className="fi-ai__chat-shell">
            <div className="fi-ai__chat-bar">
              <span className="fi-ai__chat-dot" aria-hidden="true" />
              <span>FOINWI Intelligence</span>
              <span className="fi-ai__chat-status">Educational explanation</span>
            </div>
            <div className="fi-ai__messages">
              <div className="fi-ai__message fi-ai__message--user">
                <span>User</span>
                <p>Why is my EMI affordable but total interest high?</p>
              </div>
              <div className="fi-ai__message fi-ai__message--assistant">
                <span>FOINWI Intelligence</span>
                <p>
                  Your EMI may feel comfortable because the loan is spread over many months. But the
                  longer the tenure, the longer interest is charged. Compare shorter tenure and
                  prepayment scenarios to understand the trade-off.
                </p>
              </div>
              <div className="fi-ai__message fi-ai__message--user">
                <span>User</span>
                <p>I am new to investing. Where should I start?</p>
              </div>
              <div className="fi-ai__message fi-ai__message--assistant">
                <span>FOINWI Intelligence</span>
                <p>
                  Start with money basics, emergency fund planning, and goal clarity. Then explore
                  SIP, inflation, and retirement calculators to understand long-term planning step by step.
                </p>
              </div>
              <div className="fi-ai__message fi-ai__message--user"><span>User</span><p>Which calculator should I use first?</p></div>
              <div className="fi-ai__message fi-ai__message--assistant"><span>FOINWI Intelligence</span><p>Start with your financial question. If you are planning a loan, use EMI. If you invest monthly, use SIP. If you want to estimate tax impact, use Income Tax.</p></div>
            </div>
            <div className="fi-ai__console-labels"><span>Educational explanation</span><span>No personal advice</span><span>Calculator-linked guidance</span></div>
          </div>
        </section>

        <section className="fi-ai__section fi-ai__guided" aria-labelledby="fi-ai-guided-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Static Guided Preview</p>
            <h2 id="fi-ai-guided-title">Try the Guided Assistant Preview</h2>
            <p>Choose what you want to understand. FOINWI will guide you toward the right calculator, lesson, or journey — educationally and safely.</p>
          </div>
          <div className="fi-ai__guided-shell">
            <p className="fi-ai__guided-step">Step 1 of 2 · Choose a topic</p>
            <div className="fi-ai__guided-topic-grid" role="group" aria-label="Choose a financial topic">
              {GUIDED_FLOWS.map((flow) => (
                <button
                  key={flow.id}
                  type="button"
                  className={`fi-ai__guided-topic${selectedFlowId === flow.id ? " is-selected" : ""}`}
                  aria-pressed={selectedFlowId === flow.id}
                  onClick={() => selectFlow(flow.id)}
                >
                  <span aria-hidden="true">{flow.icon}</span>
                  {flow.title}
                </button>
              ))}
            </div>

            {selectedFlow ? (
              <div className="fi-ai__guided-next" aria-live="polite">
                <div className="fi-ai__guided-next-head">
                  <div>
                    <p className="fi-ai__guided-step">Step 2 of 2 · {selectedFlow.title}</p>
                    <h3>What would you like to understand?</h3>
                  </div>
                  <button type="button" className="fi-ai__guided-reset" onClick={() => selectFlow(null)}>Change topic</button>
                </div>
                <div className="fi-ai__guided-option-grid" role="group" aria-label={`${selectedFlow.title} options`}>
                  {selectedFlow.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`fi-ai__guided-option${selectedOption === option ? " is-selected" : ""}`}
                      aria-pressed={selectedOption === option}
                      onClick={() => setSelectedOption(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {selectedOption ? (
                  <div className="fi-ai__guided-recommendations">
                    <p><strong>Explore these FOINWI resources</strong><span> based on your selected topic.</span></p>
                    <div>
                      {selectedFlow.links.map(([label, path]) => <Link key={label} to={path}>{label}<span aria-hidden="true"> →</span></Link>)}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            <p className="fi-ai__guided-safety">Educational guidance only. This guided assistant preview does not provide personalized financial, investment, tax, legal, or loan advice.</p>
          </div>
        </section>

        <section className="fi-ai__section" aria-labelledby="fi-ai-modules-title">
          <div className="fi-ai__section-head"><p className="shrix-section-label">Coming Soon</p><h2 id="fi-ai-modules-title">What FOINWI Intelligence Will Power</h2></div>
          <div className="fi-ai__capability-grid">
            {MODULES.map((module) => (
              <article key={module.title} className="fi-ai__capability">
                <div className="fi-ai__capability-top"><span className="fi-ai__capability-icon" aria-hidden="true">{module.icon}</span><span className="fi-ai__badge">Coming Soon</span></div>
                <h3>{module.title}</h3><p>{module.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fi-ai__section fi-ai__trust" aria-labelledby="fi-ai-trust-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Trust &amp; Safety</p>
            <h2 id="fi-ai-trust-title">Built With Financial Trust Boundaries</h2>
            <p>FOINWI Intelligence is planned to explain and guide users educationally. It will not replace qualified professionals or make final decisions for users.</p>
          </div>
          <ul className="fi-ai__trust-list">
            <li>Educational explanations only</li>
            <li>Returns are not assured</li>
            <li>No loan-approval claims</li>
            <li>No personalized financial, legal, tax, or investment advice</li>
            <li>Human review for official financial data</li>
            <li>Clear disclaimers and source-aware content</li>
          </ul>
        </section>

        <section className="fi-ai__section fi-ai__roadmap" aria-labelledby="fi-ai-roadmap-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Roadmap</p>
            <h2 id="fi-ai-roadmap-title">FOINWI Intelligence Roadmap</h2>
          </div>
          <ol className="fi-ai__roadmap-list">
            {ROADMAP.map((item, index) => (
              <li key={item.phase} className={index === 0 ? "is-current" : ""}>
                <span className="fi-ai__roadmap-number">{index + 1}</span>
                <div>
                  <p>{item.phase}</p>
                  <h3>{item.title}</h3>
                  <span className="fi-ai__roadmap-copy">{item.copy}</span>
                </div>
                <span className="fi-ai__roadmap-status">{item.status}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="fi-ai__final">
          <div>
            <p className="shrix-section-label">Start Here</p>
            <h2>Start With Clarity Today</h2>
            <p>While FOINWI Intelligence is being built, you can already explore calculators, learning paths, and guided journeys designed to make money decisions easier to understand.</p>
          </div>
          <div className="fi-ai__actions">
            <Link to="/calculators" className="fi-ai__button fi-ai__button--primary">Explore Calculators</Link>
            <Link to="/learn" className="fi-ai__button fi-ai__button--secondary">Open FOINWI Guide</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AiToolsPage;
