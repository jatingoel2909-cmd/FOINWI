import { useEffect, useState } from "react";
import BrandWordmark from "./BrandWordmark";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navigateToHomeSection } from "../utils/homeNavigation";
import { getNavLinkClass } from "../utils/navHelpers";
import "./Navbar.css";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  { href: "/financial-health-score", label: "Health Score" },
  { href: "/learn", label: "Learn" },
  { href: "/ai-tools", label: "AI" },
  { href: "/about", label: "About" },
];

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

      <nav className="shrix-nav-links" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link key={href} to={href} className={getNavLinkClass(pathname, href)}>
            {label}
          </Link>
        ))}
        <a href="#contact" onClick={handleContactClick}>
          Contact
        </a>
      </nav>

      <div className="shrix-nav-spacer" aria-hidden="true">
        <span className="foinwi-wordmark shrix-nav-spacer__mark">FOINWI</span>
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

      <div
        className={`shrix-nav-drawer${menuOpen ? " shrix-nav-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="shrix-nav-drawer__links" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              onClick={closeMenu}
              className={getNavLinkClass(pathname, href)}
            >
              {label}
            </Link>
          ))}
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
