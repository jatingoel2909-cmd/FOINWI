import Navbar from "../components/Navbar";
import FdCalculator from "../components/FdCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function FdCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <FdCalculator />
      <Footer />
    </div>
  );
}

export default FdCalculatorPage;
