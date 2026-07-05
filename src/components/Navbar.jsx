import logo from "../assets/shrix-logo.png";
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
        <img src={logo} alt="Shrix logo" />
      </div>

      <nav className="shrix-nav-links">
        <Link to="/calculators">Calculators</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/ai-tools">AI Tools</Link>
        <Link to="/about">About</Link>
        <a href="#contact" onClick={handleContactClick}>
          Contact
        </a>
      </nav>

      <button className="shrix-nav-btn">Get Started</button>
    </header>
  );
}

export default Navbar;
