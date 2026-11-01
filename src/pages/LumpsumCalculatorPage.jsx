import LumpsumCalculator from "../components/LumpsumCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function LumpsumCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <LumpsumCalculator />
    </CalculatorPageFrame>
  );
}

export default LumpsumCalculatorPage;
