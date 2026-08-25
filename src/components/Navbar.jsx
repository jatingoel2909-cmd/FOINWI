import { useEffect, useRef, useState } from "react";
import BrandWordmark from "./BrandWordmark";
import { Link, useLocation } from "react-router-dom";
import { getNavLinkClass } from "../utils/navHelpers";
import SearchCommandCenter from "./intelligence/SearchCommandCenter";
import "./Navbar.css";

const MOBILE_NAV_ID = "foinwi-mobile-nav";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/calculators", label: "Calculators" },
  { href: "/financial-health-score", label: "Health Score" },
  { href: "/learn", label: "Learn" },
  { href: "/ai-tools", label: "Intelligence" },
  { href: "/about", label: "About" },
];

function Navbar() {
  const { pathname } = useLocation();
  const searchOpenerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const openSearch = () => {
    closeMenu();
    setSearchOpen(true);
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const shouldLock = menuOpen || searchOpen;

    if (shouldLock) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
        <Link to="/#contact">Contact</Link>
      </nav>

      <div className="shrix-nav-actions">
        <button
          ref={searchOpenerRef}
          type="button"
          className="shrix-nav-search"
          aria-label="Open FOINWI Command Center"
          aria-haspopup="dialog"
          aria-expanded={searchOpen}
          onClick={openSearch}
        >
          <span className="shrix-nav-search__icon" aria-hidden="true">
            ⌕
          </span>
        </button>
        <div className="shrix-nav-spacer" aria-hidden="true">
          <span className="foinwi-wordmark shrix-nav-spacer__mark">FOINWI</span>
        </div>
      </div>

      <button
        type="button"
        className="shrix-nav-toggle"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls={MOBILE_NAV_ID}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="shrix-nav-toggle__bar" />
        <span className="shrix-nav-toggle__bar" />
        <span className="shrix-nav-toggle__bar" />
      </button>

      <div
        id={MOBILE_NAV_ID}
        className={`shrix-nav-drawer${menuOpen ? " shrix-nav-drawer--open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
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
          <Link to="/#contact" onClick={closeMenu}>Contact</Link>
          <button
            type="button"
            className="shrix-nav-drawer__search"
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            onClick={openSearch}
          >
            Search FOINWI
          </button>
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

      <SearchCommandCenter
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        returnFocusRef={searchOpenerRef}
      />
    </header>
  );
}

export default Navbar;
