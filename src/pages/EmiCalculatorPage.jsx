import Navbar from "../components/Navbar";
import EmiCalculator from "../components/EmiCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function EmiCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <EmiCalculator />
      <Footer />
    </div>
  );
}

export default EmiCalculatorPage;
