import FdCalculator from "../components/FdCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function FdCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <FdCalculator />
    </CalculatorPageFrame>
  );
}

export default FdCalculatorPage;
