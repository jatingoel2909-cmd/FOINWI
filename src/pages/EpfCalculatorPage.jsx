import EpfCalculator from "../components/EpfCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function EpfCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <EpfCalculator />
    </CalculatorPageFrame>
  );
}

export default EpfCalculatorPage;
