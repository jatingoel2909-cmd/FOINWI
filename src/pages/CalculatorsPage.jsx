import Navbar from "../components/Navbar";
import CalculatorGrid from "../components/CalculatorGrid";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../styles/global.css";

function CalculatorsPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <CalculatorGrid
        sectionLabel="Complete Toolkit"
        title="All Financial Calculators"
        subtitle="Explore financial planning, investment, loan, retirement, and tax calculators for educational estimates."
        sectionId={null}
      />
      <section className="shrix-live-tool" aria-labelledby="live-tool-title">
        <p className="shrix-section-label">Live Financial Tool</p>
        <h2 id="live-tool-title">Exchange Rates</h2>
        <p>
          Convert currencies using the latest available reference rate and clearly
          see its source and publication time.
        </p>
        <Link to="/exchange-rates" className="shrix-card-link">
          Open Exchange Rates →
        </Link>
      </section>
      <p className="shrix-info-disclaimer shrix-calculators-disclaimer">
        Calculator results are estimates only and depend on your inputs and assumptions.
        For educational purposes only. Not financial, tax, investment, or loan advice.
      </p>
      <Footer />
    </div>
  );
}

export default CalculatorsPage;
