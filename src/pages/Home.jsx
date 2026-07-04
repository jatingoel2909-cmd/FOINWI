import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustSection from "../components/TrustSection";
import CalculatorGrid from "../components/CalculatorGrid";
import SipCalculator from "../components/SipCalculator";
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
      <Footer />
    </div>
  );
}

export default Home;