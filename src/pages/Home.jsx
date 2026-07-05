import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TrustSection from "../components/TrustSection";
import CalculatorGrid, { getPopularCalculators } from "../components/CalculatorGrid";
import Footer from "../components/Footer";
import { scrollToSection } from "../utils/homeNavigation";
import "../styles/global.css";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const sectionId = location.hash.replace("#", "");
    const timer = window.setTimeout(() => scrollToSection(sectionId), 100);
    return () => window.clearTimeout(timer);
  }, [location]);

  return (
    <div className="shrix-app">
      <Navbar />
      <Hero />
      <TrustSection />
      <CalculatorGrid
        calculators={getPopularCalculators({ shortTitles: true })}
        showSectionLabel={false}
        title="Popular Calculators"
        subtitle="Everything you need to plan your finances."
        showViewAll
        className="shrix-calculators--home"
      />
      <Footer />
    </div>
  );
}

export default Home;