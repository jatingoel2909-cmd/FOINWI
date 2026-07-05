import Navbar from "../components/Navbar";
import InfoPageLayout from "../components/InfoPageLayout";
import Footer from "../components/Footer";
import "../styles/global.css";

const tools = [
  {
    title: "AI Financial Explainer",
    text: "Get plain-language explanations of financial terms, products, and calculator results.",
  },
  {
    title: "AI SIP Planner",
    text: "Receive guided suggestions for SIP amount, tenure, and goal alignment based on your inputs.",
  },
  {
    title: "AI Loan Assistant",
    text: "Understand loan options, EMI impact, and repayment scenarios with simple AI-powered guidance.",
  },
  {
    title: "AI Retirement Guide",
    text: "Plan retirement milestones with structured prompts and educational insights tailored to Indian users.",
  },
  {
    title: "AI Tax Helper",
    text: "Explore tax-related concepts and planning questions with clear, educational AI support.",
  },
];

function AiToolsPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InfoPageLayout
        label="AI Tools"
        title="Smarter Financial Guidance, Coming Soon"
        subtitle="Shrix AI tools are planned to help you understand money decisions with clarity — without replacing professional advice."
        variant="alt"
      >
        <div className="shrix-info-grid">
          {tools.map((tool) => (
            <article className="shrix-info-card" key={tool.title}>
              <h3>{tool.title}</h3>
              <p>{tool.text}</p>
              <span className="shrix-info-card__badge">Coming Soon</span>
            </article>
          ))}
        </div>
      </InfoPageLayout>
      <Footer />
    </div>
  );
}

export default AiToolsPage;
