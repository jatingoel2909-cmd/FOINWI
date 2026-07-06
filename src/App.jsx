import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import SipCalculatorPage from "./pages/SipCalculatorPage";
import EmiCalculatorPage from "./pages/EmiCalculatorPage";
import FdCalculatorPage from "./pages/FdCalculatorPage";
import PpfCalculatorPage from "./pages/PpfCalculatorPage";
import CagrCalculatorPage from "./pages/CagrCalculatorPage";
import LumpsumCalculatorPage from "./pages/LumpsumCalculatorPage";
import SwpCalculatorPage from "./pages/SwpCalculatorPage";
import RdCalculatorPage from "./pages/RdCalculatorPage";
import InflationCalculatorPage from "./pages/InflationCalculatorPage";
import GratuityCalculatorPage from "./pages/GratuityCalculatorPage";
import EpfCalculatorPage from "./pages/EpfCalculatorPage";
import NpsCalculatorPage from "./pages/NpsCalculatorPage";
import GoalPlannerCalculatorPage from "./pages/GoalPlannerCalculatorPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import LearnPage from "./pages/LearnPage";
import AiToolsPage from "./pages/AiToolsPage";
import AboutPage from "./pages/AboutPage";
import RetirementCalculatorPage from "./pages/RetirementCalculatorPage";
import HomeLoanEligibilityCalculatorPage from "./pages/HomeLoanEligibilityCalculatorPage";
import LoanPrepaymentCalculatorPage from "./pages/LoanPrepaymentCalculatorPage";
import GstCalculatorPage from "./pages/GstCalculatorPage";
import IncomeTaxCalculatorPage from "./pages/IncomeTaxCalculatorPage";
import HraCalculatorPage from "./pages/HraCalculatorPage";
import CompoundInterestCalculatorPage from "./pages/CompoundInterestCalculatorPage";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculators" element={<CalculatorsPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/ai-tools" element={<AiToolsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sip-calculator" element={<SipCalculatorPage />} />
        <Route path="/emi-calculator" element={<EmiCalculatorPage />} />
        <Route path="/fd-calculator" element={<FdCalculatorPage />} />
        <Route path="/ppf-calculator" element={<PpfCalculatorPage />} />
        <Route path="/cagr-calculator" element={<CagrCalculatorPage />} />
        <Route path="/lumpsum-calculator" element={<LumpsumCalculatorPage />} />
        <Route path="/swp-calculator" element={<SwpCalculatorPage />} />
        <Route path="/rd-calculator" element={<RdCalculatorPage />} />
        <Route path="/inflation-calculator" element={<InflationCalculatorPage />} />
        <Route path="/gratuity-calculator" element={<GratuityCalculatorPage />} />
        <Route path="/epf-calculator" element={<EpfCalculatorPage />} />
        <Route path="/nps-calculator" element={<NpsCalculatorPage />} />
        <Route path="/goal-planner" element={<GoalPlannerCalculatorPage />} />
        <Route path="/retirement-calculator" element={<RetirementCalculatorPage />} />
        <Route path="/home-loan-eligibility-calculator" element={<HomeLoanEligibilityCalculatorPage />} />
        <Route path="/loan-prepayment-calculator" element={<LoanPrepaymentCalculatorPage />} />
        <Route path="/gst-calculator" element={<GstCalculatorPage />} />
        <Route path="/income-tax-calculator" element={<IncomeTaxCalculatorPage />} />
        <Route path="/hra-calculator" element={<HraCalculatorPage />} />
        <Route path="/compound-interest-calculator" element={<CompoundInterestCalculatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
