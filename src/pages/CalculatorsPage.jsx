import Navbar from "../components/Navbar";
import CalculatorGrid from "../components/CalculatorGrid";
import Footer from "../components/Footer";
import "../styles/global.css";

function CalculatorsPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <CalculatorGrid
        sectionLabel="Complete Toolkit"
        title="All Financial Calculators"
        subtitle="Explore all financial planning, investment, loan, retirement and tax calculators."
        sectionId={null}
      />
      <Footer />
    </div>
  );
}

export default CalculatorsPage;
