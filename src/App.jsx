import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SipCalculatorPage from "./pages/SipCalculatorPage";
import EmiCalculatorPage from "./pages/EmiCalculatorPage";
import FdCalculatorPage from "./pages/FdCalculatorPage";
import PpfCalculatorPage from "./pages/PpfCalculatorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sip-calculator" element={<SipCalculatorPage />} />
        <Route path="/emi-calculator" element={<EmiCalculatorPage />} />
        <Route path="/fd-calculator" element={<FdCalculatorPage />} />
        <Route path="/ppf-calculator" element={<PpfCalculatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
