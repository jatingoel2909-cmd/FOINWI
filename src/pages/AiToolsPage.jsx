import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import guideMascot from "../assets/guide/fg-money-tree.png";
import "../styles/global.css";
import "../styles/ai-guide.css";

const INTELLIGENCE_LAYERS = [
  { icon: "🧮", title: "Calculators", description: "Estimate EMI, SIP, tax, and other common money questions.", to: "/calculators", ariaLabel: "Open Calculators" },
  { icon: "📚", title: "Learning", description: "Beginner-friendly lessons on core financial topics.", to: "/learn", ariaLabel: "Open Learning" },
  { icon: "🧭", title: "Journeys", description: "Explore practical paths across planning milestones.", to: "/journeys/build-wealth", ariaLabel: "Open Build Wealth Journey" },
  { icon: "♥", title: "Financial Health Score", description: "An educational snapshot of planning habits you can use today.", to: "/financial-health-score", ariaLabel: "Open Financial Health Score" },
];

const GUIDED_FLOWS = [
  {
    id: "loan",
    icon: "🏠",
    title: "Loan / EMI",
    options: [
      { id: "estimate-emi", label: "Estimate monthly EMI", links: [["Open EMI Calculator", "/emi-calculator"], ["Loans & EMI lesson", "/learn/loans-emi"]] },
      { id: "compare-tenure", label: "Compare loan tenure", links: [["Open EMI Calculator", "/emi-calculator"], ["Explore Prepayment", "/loan-prepayment-calculator"]] },
      { id: "understand-interest", label: "Understand total interest", links: [["Loans & EMI lesson", "/learn/loans-emi"], ["Open EMI Calculator", "/emi-calculator"]] },
      { id: "prepayment", label: "Explore prepayment impact", links: [["Explore Prepayment", "/loan-prepayment-calculator"], ["Open EMI Calculator", "/emi-calculator"]] },
    ],
  },
  {
    id: "sip",
    icon: "📈",
    title: "SIP / Investment",
    options: [
      { id: "sip-growth", label: "Estimate SIP growth", links: [["Open SIP Calculator", "/sip-calculator"], ["Mutual Funds & SIP lesson", "/learn/mutual-funds-sip"]] },
      { id: "compounding", label: "Understand compounding", links: [["Mutual Funds & SIP lesson", "/learn/mutual-funds-sip"], ["Open Lumpsum Calculator", "/lumpsum-calculator"]] },
      { id: "plan-goal", label: "Plan a goal", links: [["Open Goal Planner", "/goal-planner"], ["Open SIP Calculator", "/sip-calculator"]] },
      { id: "inflation", label: "Understand inflation impact", links: [["Open Inflation Calculator", "/inflation-calculator"], ["Mutual Funds & SIP lesson", "/learn/mutual-funds-sip"]] },
    ],
  },
  {
    id: "tax",
    icon: "🧾",
    title: "Income Tax",
    options: [
      { id: "estimate-tax", label: "Estimate tax", links: [["Open Income Tax Calculator", "/income-tax-calculator"], ["Income Tax Basics lesson", "/learn/income-tax-basics"]] },
      { id: "taxable-income", label: "Understand taxable income", links: [["Income Tax Basics lesson", "/learn/income-tax-basics"], ["Open Income Tax Calculator", "/income-tax-calculator"]] },
      { id: "deductions", label: "Compare deductions", links: [["Open HRA Calculator", "/hra-calculator"], ["Income Tax Basics lesson", "/learn/income-tax-basics"]] },
      { id: "tax-basics", label: "Learn tax basics", links: [["Income Tax Basics lesson", "/learn/income-tax-basics"], ["Open GST Calculator", "/gst-calculator"]] },
    ],
  },
  {
    id: "goals",
    icon: "🎯",
    title: "Goal Planning",
    options: [
      { id: "future-goal", label: "Plan a future goal", links: [["Open Goal Planner", "/goal-planner"], ["Build Wealth Journey", "/journeys/build-wealth"]] },
      { id: "monthly-savings", label: "Estimate monthly savings", links: [["Open Goal Planner", "/goal-planner"], ["Open SIP Calculator", "/sip-calculator"]] },
      { id: "shortfall", label: "Understand shortfall", links: [["Open Goal Planner", "/goal-planner"], ["Open Inflation Calculator", "/inflation-calculator"]] },
      { id: "learn-goals", label: "Learn goal planning", links: [["Build Wealth Journey", "/journeys/build-wealth"], ["Explore Learning", "/learn"]] },
    ],
  },
  {
    id: "retirement",
    icon: "🌿",
    title: "Retirement",
    options: [
      { id: "retirement-corpus", label: "Estimate retirement corpus", links: [["Open Retirement Calculator", "/retirement-calculator"], ["Retirement Planning lesson", "/learn/retirement-planning"]] },
      { id: "retirement-inflation", label: "Understand inflation", links: [["Open Inflation Calculator", "/inflation-calculator"], ["Retirement Planning lesson", "/learn/retirement-planning"]] },
      { id: "pension", label: "Estimate pension needs", links: [["Open NPS Calculator", "/nps-calculator"], ["Open Retirement Calculator", "/retirement-calculator"]] },
      { id: "long-term", label: "Learn long-term planning", links: [["Retirement Planning lesson", "/learn/retirement-planning"], ["Open PPF Calculator", "/ppf-calculator"]] },
    ],
  },
  {
    id: "health",
    icon: "♥",
    title: "Financial Health",
    options: [
      { id: "savings", label: "Understand savings", links: [["Open Financial Health Score", "/financial-health-score"], ["Open Goal Planner", "/goal-planner"]] },
      { id: "debt", label: "Review debt comfort", links: [["Open Financial Health Score", "/financial-health-score"], ["Open EMI Calculator", "/emi-calculator"]] },
      { id: "protection", label: "Check protection gaps", links: [["Open Financial Health Score", "/financial-health-score"], ["Explore Learning", "/learn"]] },
      { id: "habits", label: "Improve planning habits", links: [["Open Financial Health Score", "/financial-health-score"], ["Explore Learning", "/learn"]] },
    ],
  },
];

function AiToolsPage() {
  const [selectedFlowId, setSelectedFlowId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectedFlow = GUIDED_FLOWS.find((flow) => flow.id === selectedFlowId);
  const selectedOptionData = selectedFlow?.options.find((option) => option.id === selectedOption);

  function selectFlow(flowId) {
    setSelectedFlowId(flowId);
    setSelectedOption(null);
  }

  return (
    <div className="shrix-app">
      <a className="shrix-skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="fi-ai">
        <section className="fi-ai__hero" aria-labelledby="fi-ai-title">
          <div className="fi-ai__hero-inner">
            <div className="fi-ai__hero-copy">
              <p className="shrix-section-label">Educational tools</p>
              <h1 id="fi-ai-title">FOINWI Intelligence</h1>
              <p className="fi-ai__lead">
                Choose a calculator, lesson, journey, or the Financial Health Score. FOINWI does not provide a live AI assistant.
              </p>
              <p className="fi-ai__intro">
                What you select stays in this browser. It is not sent to an AI model, and it is not personalised advice.
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
            <aside className="fi-ai__hero-panel fi-ai__hero-guide" aria-label="FOINWI Guide">
              <img
                src={guideMascot}
                alt="FOINWI Guide, a money-tree learning companion"
                className="fi-ai__hero-mascot"
                width="640"
                height="640"
              />
              <p>FOINWI Guide — the visual learning companion for FOINWI Intelligence.</p>
              <span className="fi-ai__hero-guide-note">
                It represents the guide experience, not the underlying intelligence engine.
              </span>
            </aside>
          </div>
        </section>

        <section className="fi-ai__section fi-ai__layer" aria-labelledby="fi-ai-layer-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Explore FOINWI</p>
            <h2 id="fi-ai-layer-title">FOINWI Knowledge &amp; Planning Surfaces</h2>
            <p>These are live FOINWI areas you can use today. The Financial Health Score tool itself is available today. They are educational tools, not a live assistant.</p>
          </div>
          <div className="fi-ai__layer-grid">
            {INTELLIGENCE_LAYERS.map((layer) => (
              <Link key={layer.title} to={layer.to} aria-label={layer.ariaLabel} className="fi-ai__layer-card">
                <span aria-hidden="true">{layer.icon}</span>
                <h3>{layer.title}</h3>
                <p>{layer.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="fi-ai__section fi-ai__assist" aria-labelledby="fi-ai-assist-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Available tools</p>
            <h2 id="fi-ai-assist-title">Open a tool for this question</h2>
            <p>Open a calculator, lesson, or journey for the question in front of you.</p>
            <p>These links stay on FOINWI. This section does not chat, and it does not send a question to an AI model.</p>
          </div>
          <div className="fi-ai__assist-grid">
            <article className="fi-ai__assist-card">
              <span className="fi-ai__assist-icon" aria-hidden="true">⌁</span>
              <h3>Understand Loan Results</h3>
              <p>See why EMI, tenure, interest, and repayment amount move together, and explore calculators that explain the trade-off.</p>
              <div className="fi-ai__assist-actions">
                <Link to="/emi-calculator">Open EMI Calculator <span aria-hidden="true">→</span></Link>
                <Link to="/loan-prepayment-calculator">Explore Prepayment <span aria-hidden="true">→</span></Link>
              </div>
            </article>
            <article className="fi-ai__assist-card">
              <span className="fi-ai__assist-icon" aria-hidden="true">↗</span>
              <h3>Start Investing Step by Step</h3>
              <p>Learn how SIP, compounding, inflation, and goals connect before making long-term financial plans.</p>
              <div className="fi-ai__assist-actions">
                <Link to="/sip-calculator">Open SIP Calculator <span aria-hidden="true">→</span></Link>
                <Link to="/learn">Start Learning <span aria-hidden="true">→</span></Link>
              </div>
            </article>
            <article className="fi-ai__assist-card">
              <span className="fi-ai__assist-icon" aria-hidden="true">⌘</span>
              <h3>Choose a Useful Tool</h3>
              <p>Start with your financial question, then move toward the calculator, lesson, or guided journey that fits your need.</p>
              <div className="fi-ai__assist-actions">
                <Link to="/calculators">Explore Calculators <span aria-hidden="true">→</span></Link>
                <Link to="/learn">Explore Learning <span aria-hidden="true">→</span></Link>
              </div>
            </article>
          </div>
        </section>

        <section className="fi-ai__section fi-ai__guided" aria-labelledby="fi-ai-guided-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Static Guided Preview</p>
            <h2 id="fi-ai-guided-title">Explore the Guided Preview</h2>
            <p>Choose a topic, then open related FOINWI calculators, lessons, or journeys. This is a fixed educational map, not a live assistant.</p>
          </div>
          <div className="fi-ai__guided-shell">
            <div className="fi-ai__guided-brand">
              <img
                src={guideMascot}
                alt=""
                className="fi-ai__guided-mark"
                width="80"
                height="80"
                aria-hidden="true"
              />
              <p className="fi-ai__guided-step">Step 1 of 2 · Choose a topic</p>
            </div>
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
                      key={option.id}
                      type="button"
                      className={`fi-ai__guided-option${selectedOption === option.id ? " is-selected" : ""}`}
                      aria-pressed={selectedOption === option.id}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {selectedOptionData ? (
                  <div className="fi-ai__guided-recommendations">
                    <p><strong>Based on what you selected, start here.</strong><span> These are educational FOINWI resources.</span></p>
                    <div>
                      {selectedOptionData.links.map(([label, path]) => <Link key={label} to={path}>{label}<span aria-hidden="true"> →</span></Link>)}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            <p className="fi-ai__guided-safety">
              This is a fixed educational topic-to-resource map. It is not a live assistant,
              not a live AI assistant, not personalized, not stored, and not sent to a backend.
              Educational guidance only — not financial, investment, tax, legal, or loan advice.
            </p>
          </div>
        </section>

        <section className="fi-ai__section fi-ai__trust" aria-labelledby="fi-ai-trust-title">
          <div className="fi-ai__section-head">
            <p className="shrix-section-label">Trust &amp; Safety</p>
            <h2 id="fi-ai-trust-title">Built With Financial Trust Boundaries</h2>
            <p>FOINWI Intelligence helps you find live educational tools. It does not replace qualified professionals or make decisions for you.</p>
          </div>
          <ul className="fi-ai__trust-list">
            <li>Educational guidance only</li>
            <li>No live AI assistant</li>
            <li>Returns are not assured</li>
            <li>No loan-approval claims</li>
            <li>No personalized financial, legal, tax, or investment advice</li>
            <li>This preview does not collect sensitive financial data</li>
          </ul>
        </section>
        <section className="fi-ai__final" aria-labelledby="fi-ai-final-title">
          <div>
            <p className="shrix-section-label">Start Here</p>
            <h2 id="fi-ai-final-title">Start With Clarity Today</h2>
            <p>You can use calculators, Learn, Journeys, and the Financial Health Score today. FOINWI does not provide a live AI assistant.</p>
          </div>
          <div className="fi-ai__actions">
            <Link to="/calculators" className="fi-ai__button fi-ai__button--primary">Explore Calculators</Link>
            <Link to="/learn" className="fi-ai__button fi-ai__button--secondary">Explore Learning</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AiToolsPage;
