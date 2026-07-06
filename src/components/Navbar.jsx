import BrandWordmark from "./BrandWordmark";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigateToHomeSection } from "../utils/homeNavigation";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleContactClick = (event) => {
    event.preventDefault();
    navigateToHomeSection(navigate, pathname, "contact");
  };

  return (
    <header className="shrix-navbar">
      <div className="shrix-brand">
        <BrandWordmark linked />
      </div>

      <nav className="shrix-nav-links">
        <Link to="/calculators">Calculators</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/ai-tools">AI</Link>
        <Link to="/about">About</Link>
        <a href="#contact" onClick={handleContactClick}>
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
