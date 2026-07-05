import Navbar from "../components/Navbar";
import InflationCalculator from "../components/InflationCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function InflationCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InflationCalculator />
      <Footer />
    </div>
  );
}

export default InflationCalculatorPage;
