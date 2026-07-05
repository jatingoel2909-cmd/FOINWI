import logo from "../assets/shrix-logo.png";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="shrix-navbar">
      <div className="shrix-brand">
        <img src={logo} alt="Shrix logo" />
      </div>

      <nav className="shrix-nav-links">
        <a>Calculators</a>
        <a>Learn</a>
        <a>AI Tools</a>
        <a>About</a>
        <a>Contact</a>
      </nav>

      <button className="shrix-nav-btn">Get Started</button>
    </header>
  );
}

export default Navbar;