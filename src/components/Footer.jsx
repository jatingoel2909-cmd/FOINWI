import logo from "../assets/shrix-logo.png";

function Footer() {
  return (
    <footer className="shrix-footer" id="about">
      <img src={logo} alt="Shrix icon" />
      <p>Premium Financial Platform for Indian Investors.</p>
      <small id="contact">Educational purpose only. Not financial advice.</small>
    </footer>
  );
}

export default Footer;
