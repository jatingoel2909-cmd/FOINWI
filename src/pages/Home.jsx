import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyFoinwiSection from "../components/home/WhyFoinwiSection";
import FourPillarsSection from "../components/home/FourPillarsSection";
import FinancialJourneysSection from "../components/home/FinancialJourneysSection";
import CalculatorGrid from "../components/CalculatorGrid";
import { getPopularCalculators } from "../data/calculators";
import AiToolsPreviewSection from "../components/home/AiToolsPreviewSection";
import LearnPreviewSection from "../components/home/LearnPreviewSection";
import HomeClaritySection from "../components/home/HomeClaritySection";
import IntelligenceSection from "../components/intelligence/IntelligenceSection";
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
      <a className="shrix-skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WhyFoinwiSection />
        <FinancialJourneysSection />
        <FourPillarsSection />
        <CalculatorGrid
          calculators={getPopularCalculators({ shortTitles: true })}
          showSectionLabel={false}
          title="Start with Useful Calculators"
          subtitle="Practice the Calculate step — estimate SIP, EMI, savings, tax, and retirement scenarios with clear educational tools."
          showViewAll
          className="shrix-calculators--home"
        />
        <IntelligenceSection
          pathname="/"
          className="fi-intelligence-section--home fi-intelligence-section--home-featured"
        />
        <AiToolsPreviewSection />
        <LearnPreviewSection />
        <HomeClaritySection />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
