import { scrollToSection } from "../utils/homeNavigation";

function Hero() {
  const scrollToCalculators = () => {
    scrollToSection("calculators");
  };

  return (
    <section className="shrix-hero">
      <div className="shrix-hero-left">
        <p className="shrix-badge">India’s Smart Financial Platform</p>
        <p className="shrix-hero-welcome">Welcome to Shrix</p>

        <h1>
          Grow Beyond <span>Numbers.</span>
        </h1>

        <p className="shrix-hero-text">
          Plan SIP, EMI, FD, PPF, retirement and wealth goals with simple,
          accurate and premium financial calculators built for Indian users.
        </p>

        <div className="shrix-hero-actions">
          <button type="button" className="shrix-primary" onClick={scrollToCalculators}>
            Explore Calculators
          </button>
          <button type="button" className="shrix-secondary" onClick={scrollToCalculators}>
            View Tools
          </button>
        </div>
      </div>

      <div className="shrix-dashboard">
        <p>SIP Growth Preview</p>
        <h3>₹10,000/month</h3>

        <div className="shrix-bars">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="shrix-row">
          <span>Invested</span>
          <strong>₹18.0L</strong>
        </div>

        <div className="shrix-row">
          <span>Estimated Value</span>
          <strong>₹50.4L</strong>
        </div>
      </div>
    </section>
  );
}

export default Hero;