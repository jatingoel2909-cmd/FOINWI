import GstCalculator from "../components/GstCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function GstCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <GstCalculator />
    </CalculatorPageFrame>
  );
}

export default GstCalculatorPage;
