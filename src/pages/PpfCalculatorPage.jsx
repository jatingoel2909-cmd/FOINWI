import Navbar from "../components/Navbar";
import PpfCalculator from "../components/PpfCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function PpfCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <PpfCalculator />
      <Footer />
    </div>
  );
}

export default PpfCalculatorPage;
