import IncomeTaxCalculator from "../components/IncomeTaxCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function IncomeTaxCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <IncomeTaxCalculator />
    </CalculatorPageFrame>
  );
}

export default IncomeTaxCalculatorPage;
