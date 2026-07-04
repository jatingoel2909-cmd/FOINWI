import { useState } from "react";

function SipCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  const futureValue =
    monthly *
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate));

  const invested = monthly * months;
  const returns = futureValue - invested;

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="sip-section">
      <div className="sip-left">
        <p className="shrix-section-label">SIP Calculator</p>
        <h2>Plan your wealth with clarity</h2>
        <p>
          Calculate estimated SIP returns based on monthly investment, expected
          annual return and investment period.
        </p>

        <div className="sip-form">
          <label>
            Monthly Investment
            <input
              type="number"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
            />
          </label>

          <label>
            Expected Return (% yearly)
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </label>

          <label>
            Time Period (Years)
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="sip-result">
        <div>
          <span>Total Invested</span>
          <strong>{formatMoney(invested)}</strong>
        </div>

        <div>
          <span>Estimated Returns</span>
          <strong>{formatMoney(returns)}</strong>
        </div>

        <div className="sip-total">
          <span>Future Value</span>
          <strong>{formatMoney(futureValue)}</strong>
        </div>
      </div>
    </section>
  );
}

export default SipCalculator;