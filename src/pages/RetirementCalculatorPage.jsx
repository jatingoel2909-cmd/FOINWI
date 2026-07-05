import Navbar from "../components/Navbar";
import RetirementCalculator from "../components/RetirementCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function RetirementCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <RetirementCalculator />
      <Footer />
    </div>
  );
}

export default RetirementCalculatorPage;
