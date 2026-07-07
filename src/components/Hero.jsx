function Hero() {
  return (
    <section className="shrix-hero">
      <div className="shrix-hero-left">
        <p className="shrix-badge">India’s Smart Financial Platform</p>
        <p className="shrix-hero-welcome">Welcome to FOINWI</p>

        <h1>
          <span className="shrix-hero-headline">Grow Beyond</span>{" "}
          <span>Numbers.</span>
        </h1>
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
