import { useEffect, useState } from "react";
import BrandWordmark from "./BrandWordmark";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigateToHomeSection } from "../utils/homeNavigation";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleContactClick = (event) => {
    event.preventDefault();
    closeMenu();
    navigateToHomeSection(navigate, pathname, "contact");
  };

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={`shrix-navbar${menuOpen ? " shrix-navbar--menu-open" : ""}`}>
      <div className="shrix-brand">
        <BrandWordmark linked />
      </div>

      <button
        type="button"
        className="shrix-nav-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="shrix-nav-toggle__bar" />
        <span className="shrix-nav-toggle__bar" />
        <span className="shrix-nav-toggle__bar" />
      </button>

      <nav className="shrix-nav-links" aria-label="Main navigation">
        <Link to="/calculators">Calculators</Link>
        <Link to="/financial-health-score">Health Score</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/ai-tools">AI</Link>
        <Link to="/about">About</Link>
        <a href="#contact" onClick={handleContactClick}>
          Contact
        </a>
      </nav>

      <div
        className={`shrix-nav-drawer${menuOpen ? " shrix-nav-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="shrix-nav-drawer__links" aria-label="Mobile navigation">
          <Link to="/calculators" onClick={closeMenu}>
            Calculators
          </Link>
          <Link to="/financial-health-score" onClick={closeMenu}>
            Health Score
          </Link>
          <Link to="/learn" onClick={closeMenu}>
            Learn
          </Link>
          <Link to="/ai-tools" onClick={closeMenu}>
            AI
          </Link>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
          <a href="#contact" onClick={handleContactClick}>
            Contact
          </a>
        </nav>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="shrix-nav-overlay"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}

export default Navbar;
