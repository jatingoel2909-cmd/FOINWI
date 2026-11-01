import NpsCalculator from "../components/NpsCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function NpsCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <NpsCalculator />
    </CalculatorPageFrame>
  );
}

export default NpsCalculatorPage;
