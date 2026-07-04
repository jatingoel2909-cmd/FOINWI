import { Link } from "react-router-dom";
import "./CalculatorGrid.css";

function CalculatorGrid() {
  const calculators = [
    { icon: "📈", title: "SIP Calculator", desc: "Estimate SIP returns and future wealth.", path: "/sip-calculator" },
    { icon: "🏦", title: "FD Calculator", desc: "Calculate fixed deposit maturity value.", path: "/fd-calculator" },
    { icon: "💳", title: "EMI Calculator", desc: "Plan loan EMI and repayment.", path: "/emi-calculator" },
    { icon: "💰", title: "PPF Calculator", desc: "Estimate long-term PPF growth.", path: "/ppf-calculator" },
    { icon: "📊", title: "CAGR Calculator", desc: "Measure annualized investment return." },
    { icon: "🎯", title: "Goal Planner", desc: "Plan financial goals with clarity." },
    { icon: "🏖️", title: "Retirement", desc: "Estimate retirement corpus needs." },
    { icon: "🔁", title: "SWP Calculator", desc: "Plan systematic withdrawals." },
  ];

  return (
    <section className="shrix-calculators">
      <p className="shrix-section-label">Powerful Tools</p>
      <h2>Popular Financial Calculators</h2>

      <div className="shrix-grid">
        {calculators.map(({ icon, title, desc, path }) => (
          <div className="shrix-card" key={title}>
            <div className="shrix-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
            {path ? (
              <Link to={path} className="shrix-card-link">Calculate →</Link>
            ) : (
              <button>Calculate →</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default CalculatorGrid;
