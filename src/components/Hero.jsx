import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigateToHomeSection } from "../utils/homeNavigation";

function Hero() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleStartJourney = (event) => {
    event.preventDefault();
    navigateToHomeSection(navigate, pathname, "journeys");
  };

  return (
    <section className="shrix-hero">
      <div className="shrix-hero-left">
        <p className="shrix-badge">India’s Smart Financial Platform</p>
        <p className="shrix-hero-welcome">Welcome to FOINWI</p>

        <h1>
          <span className="shrix-hero-headline">Grow Beyond</span>{" "}
          <span>Numbers.</span>
        </h1>

        <p className="shrix-hero-text">
          Learn finance with clarity through educational calculators, structured
          learning, guided journeys, and practical insights — so you understand
          before you decide.
        </p>

        <div className="shrix-hero-actions">
          <a
            href="/#journeys"
            className="shrix-primary shrix-hero-cta-link"
            onClick={handleStartJourney}
          >
            Start Your Journey
          </a>
          <Link to="/calculators" className="shrix-secondary shrix-hero-cta-link">
            Explore Calculators
          </Link>
        </div>
      </div>

      <div className="shrix-dashboard">
        <p>SIP Growth Preview</p>
        <p className="shrix-dashboard__note">Illustrative example only. Not a forecast.</p>
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
