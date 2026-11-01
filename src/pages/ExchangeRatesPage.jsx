import ExchangeConverter from "../components/exchange-rates/ExchangeConverter";
import CalculatorPageFrame from "../components/ui/CalculatorPageFrame";
import "../styles/global.css";
import "../styles/exchange-rates.css";

function ExchangeRatesPage() {
  return (
    <CalculatorPageFrame mainClassName="er-page">
      <ExchangeConverter />
    </CalculatorPageFrame>
  );
}

export default ExchangeRatesPage;
