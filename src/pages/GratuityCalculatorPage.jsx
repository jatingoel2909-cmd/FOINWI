import Navbar from "../components/Navbar";
import GratuityCalculator from "../components/GratuityCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function GratuityCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <GratuityCalculator />
      <Footer />
    </div>
  );
}

export default GratuityCalculatorPage;
