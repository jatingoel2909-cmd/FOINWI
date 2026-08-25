import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ExchangeConverter from "../components/exchange-rates/ExchangeConverter";
import "../styles/global.css";
import "../styles/exchange-rates.css";

function ExchangeRatesPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <main className="er-page">
        <ExchangeConverter />
      </main>
      <Footer />
    </div>
  );
}

export default ExchangeRatesPage;
