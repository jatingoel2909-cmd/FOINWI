import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/global.css";
import "../styles/ai-guide.css";

const INTELLIGENCE_LAYERS = [
  { icon: "🧮", title: "Calculators", description: "Explain results and trade-offs behind each estimate.", to: "/calculators", ariaLabel: "Open Calculators" },
  { icon: "📚", title: "Learning", description: "Simplify concepts into clear, beginner-friendly language.", to: "/learn", ariaLabel: "Open Learning" },
  { icon: "🧭", title: "Journeys", description: "Explore practical paths across planning milestones.", to: "/journeys/build-wealth", ariaLabel: "Open Build Wealth Journey" },
  { icon: "♥", title: "Financial Health Score", description: "Explain weak areas and possible improvement paths.", to: "/financial-health-score", ariaLabel: "Open Financial Health Score" },
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
      <Navbar />
      <main className="fi-ai">
        <section className="fi-ai__hero" aria-labelledby="fi-ai-title">
          <div className="fi-ai__hero-inner">
            <div className="fi-ai__hero-copy">
              <p className="shrix-section-label">In Development</p>
              <h1 id="fi-ai-title">FOINWI Intelligence</h1>
              <p className="fi-ai__lead">
                Educational financial intelligence, built for clearer decisions.
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
              <div className="fi-ai__node-map">
                {INTELLIGENCE_LAYERS.map((layer) => (
                  <Link key={layer.title} to={layer.to} aria-label={layer.ariaLabel}>
                    {layer.title === "Financial Health Score" ? "Health Score" : layer.title}
                  </Link>
                ))}
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
            <p className="shrix-section-label">Planned Assistance</p>
            <h2 id="fi-ai-assist-title">How FOINWI Intelligence Will Assist</h2>
            <p>FOINWI Intelligence is planned to explain financial concepts, calculator results, and next steps in a calm, educational way.</p>
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
            <h2 id="fi-ai-guided-title">Try the Guided Assistant Preview</h2>
            <p>Choose what you want to understand, then explore relevant FOINWI calculators, lessons, or journeys — educationally and safely.</p>
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
        <section className="fi-ai__final" aria-labelledby="fi-ai-final-title">
          <div>
            <p className="shrix-section-label">Start Here</p>
            <h2 id="fi-ai-final-title">Start With Clarity Today</h2>
            <p>While FOINWI Intelligence is being built, you can already explore calculators, learning paths, and guided journeys designed to make money decisions easier to understand.</p>
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
