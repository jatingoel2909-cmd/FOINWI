import { Link } from "react-router-dom";
import BrandWordmark from "./BrandWordmark";

function Footer() {
  return (
    <footer className="shrix-footer" id="about">
      <BrandWordmark className="foinwi-wordmark--footer" />
      <p>Premium educational finance platform for Indian users.</p>
      <nav className="shrix-footer__links" aria-label="Footer links">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-and-conditions">Terms & Conditions</Link>
        <Link to="/disclaimer">Disclaimer</Link>
        <Link to="/#contact">Contact</Link>
      </nav>
      <p className="shrix-footer__contact" id="contact">
        For general queries, feedback, calculator issues, partnership requests, or
        collaboration, contact us at{" "}
        <a href="mailto:support@foinwi.com">support@foinwi.com</a>.
      </p>
      <small>
        FOINWI provides educational financial tools only. We do not provide
        personalized investment, tax, loan, legal, or financial advice.
      </small>
    </footer>
  );
}

export default Footer;
