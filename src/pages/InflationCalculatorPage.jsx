import InflationCalculator from "../components/InflationCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function InflationCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <InflationCalculator />
    </CalculatorPageFrame>
  );
}

export default InflationCalculatorPage;
