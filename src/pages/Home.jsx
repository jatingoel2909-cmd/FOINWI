import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FourPillarsSection from "../components/home/FourPillarsSection";
import FinancialJourneysSection from "../components/home/FinancialJourneysSection";
import CalculatorGrid from "../components/CalculatorGrid";
import { getPopularCalculators } from "../data/calculators";
import AiToolsPreviewSection from "../components/home/AiToolsPreviewSection";
import LearnPreviewSection from "../components/home/LearnPreviewSection";
import HomeClaritySection from "../components/home/HomeClaritySection";
import Footer from "../components/Footer";
import { scrollToSection } from "../utils/homeNavigation";
import "../styles/global.css";
import "../styles/home-sections.css";

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
      <FinancialJourneysSection />
      <FourPillarsSection />
      <CalculatorGrid
        calculators={getPopularCalculators({ shortTitles: true })}
        showSectionLabel={false}
        title="Popular Financial Calculators"
        subtitle="Start with the tools most Indian users need for investment, loans, savings, tax, and retirement planning."
        showViewAll
        className="shrix-calculators--home"
      />
      <AiToolsPreviewSection />
      <LearnPreviewSection />
      <HomeClaritySection />
      <Footer />
    </div>
  );
}

export default Home;
