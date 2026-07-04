import Navbar from "../components/Navbar";
import SipCalculator from "../components/SipCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function SipCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <SipCalculator />
      <Footer />
    </div>
  );
}

export default SipCalculatorPage;
