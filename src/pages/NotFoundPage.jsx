import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/InfoPageLayout.css";

function NotFoundPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <main className="shrix-info-page" aria-labelledby="not-found-title">
        <p className="shrix-section-label">Page not found</p>
        <h1 id="not-found-title">We could not find that page</h1>
        <p className="shrix-info-page__subtitle">
          The page may have moved, or the address may be incorrect. You can return to a current FOINWI section below.
        </p>
        <div className="shrix-info-page__content">
          <section className="shrix-info-card shrix-info-card--wide" aria-labelledby="not-found-recovery">
            <h2 id="not-found-recovery">Continue with FOINWI</h2>
            <ul className="shrix-info-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/calculators">Calculators</Link></li>
              <li><Link to="/learn">Learn</Link></li>
              <li><Link to="/financial-health-score">Financial Health Score</Link></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
