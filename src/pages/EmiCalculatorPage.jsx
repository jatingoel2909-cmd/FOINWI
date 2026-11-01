import EmiCalculator from "../components/EmiCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function EmiCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <EmiCalculator />
    </CalculatorPageFrame>
  );
}

export default EmiCalculatorPage;
