import LoanPrepaymentCalculator from "../components/LoanPrepaymentCalculator";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";

function LoanPrepaymentCalculatorPage() {
  return (
    <CalculatorPageFrame>
      <LoanPrepaymentCalculator />
    </CalculatorPageFrame>
  );
}

export default LoanPrepaymentCalculatorPage;
