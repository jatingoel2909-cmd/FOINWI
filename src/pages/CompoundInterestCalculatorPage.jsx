import CompoundInterestCalculator from "../components/CompoundInterestCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function CompoundInterestCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <CompoundInterestCalculator />
    </CalculatorPageFrame>
  );
}

export default CompoundInterestCalculatorPage;
