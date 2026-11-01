import GratuityCalculator from "../components/GratuityCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function GratuityCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <GratuityCalculator />
    </CalculatorPageFrame>
  );
}

export default GratuityCalculatorPage;
