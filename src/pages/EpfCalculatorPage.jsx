import Navbar from "../components/Navbar";
import EpfCalculator from "../components/EpfCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function EpfCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <EpfCalculator />
      <Footer />
    </div>
  );
}

export default EpfCalculatorPage;
