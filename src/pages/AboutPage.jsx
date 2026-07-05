import Navbar from "../components/Navbar";
import InfoPageLayout from "../components/InfoPageLayout";
import Footer from "../components/Footer";
import "../styles/global.css";

function AboutPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InfoPageLayout
        label="About Shrix"
        title="Built for Financial Clarity"
        subtitle="Shrix helps Indian users Grow Beyond Numbers with premium calculators and educational financial tools."
      >
        <p className="shrix-info-copy">
          Shrix is a premium financial platform designed for Indian investors,
          professionals, and families who want clear answers without complexity.
          We focus on practical tools that make SIP, loans, deposits, retirement,
          tax planning, and wealth decisions easier to understand.
        </p>
        <p className="shrix-info-copy">
          Our calculators are built to be accurate, responsive, and easy to use.
          Whether you are planning a monthly SIP, estimating EMI, evaluating FD or
          PPF returns, or preparing for retirement, Shrix gives you instant clarity
          in a clean black-and-gold experience.
        </p>
        <p className="shrix-info-copy">
          Shrix is educational in nature. We help users learn how financial products
          work, compare scenarios, and make informed decisions — not replace
          professional financial, legal, or tax advice.
        </p>
        <article className="shrix-info-card">
          <h3>Grow Beyond Numbers</h3>
          <p>
            That is more than a tagline. It reflects our belief that smart financial
            planning is about understanding the story behind the numbers — and using
            that understanding to build confidence over time.
          </p>
        </article>
      </InfoPageLayout>
      <Footer />
    </div>
  );
}

export default AboutPage;
