import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../styles/global.css";

function CalculatorPageFrame({ children, mainClassName = "" }) {
  return (
    <div className="shrix-app">
      <a className="shrix-skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className={mainClassName || undefined}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default CalculatorPageFrame;
