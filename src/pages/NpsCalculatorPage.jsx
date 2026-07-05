import Navbar from "../components/Navbar";
import NpsCalculator from "../components/NpsCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function NpsCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <NpsCalculator />
      <Footer />
    </div>
  );
}

export default NpsCalculatorPage;
