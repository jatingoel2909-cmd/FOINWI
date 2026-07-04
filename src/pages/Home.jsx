import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustSection from "../components/TrustSection";
import CalculatorGrid from "../components/CalculatorGrid";
import SipCalculator from "../components/SipCalculator";
import EmiCalculator from "../components/EmiCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function Home() {
  return (
    <div className="shrix-app">
      <Navbar />
      <Hero />
      <TrustSection />
      <CalculatorGrid />
      <SipCalculator />
      <EmiCalculator />
      <Footer />
    </div>
  );
}

export default Home;