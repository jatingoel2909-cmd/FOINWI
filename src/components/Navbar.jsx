import logo from "../assets/shrix-logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { navigateToHomeSection } from "../utils/homeNavigation";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSectionClick = (event, id) => {
    event.preventDefault();
    navigateToHomeSection(navigate, pathname, id);
  };

  return (
    <header className="shrix-navbar">
      <div className="shrix-brand">
        <img src={logo} alt="Shrix logo" />
      </div>

      <nav className="shrix-nav-links">
        <a href="#calculators" onClick={(e) => handleSectionClick(e, "calculators")}>
          Calculators
        </a>
        <a href="#">Learn</a>
        <a href="#">AI Tools</a>
        <a href="#about" onClick={(e) => handleSectionClick(e, "about")}>
          About
        </a>
        <a href="#contact" onClick={(e) => handleSectionClick(e, "contact")}>
          Contact
        </a>
      </nav>

      <button className="shrix-nav-btn">Get Started</button>
    </header>
  );
}

export default Navbar;
