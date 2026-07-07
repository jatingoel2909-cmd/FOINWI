import Navbar from "../components/Navbar";
import InfoPageLayout from "../components/InfoPageLayout";
import Footer from "../components/Footer";
import "../styles/global.css";

function TermsAndConditionsPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InfoPageLayout
        label="Legal"
        title="Terms & Conditions"
        subtitle="Please read these terms before using FOINWI calculators and educational content."
        centered
        variant="alt"
      >
        <article className="shrix-info-card shrix-info-card--wide">
          <p>
            By using FOINWI at foinwi.com, you agree to these Terms & Conditions.
            If you do not agree, please do not use the website.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Educational and Informational Use</h2>
          <p>
            FOINWI is for educational and informational use. We provide
            financial calculators, learning content, and tools to help Indian
            users understand money — not to replace professional advice.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Calculator Results Are Estimates</h2>
          <p>
            Calculator results are estimates based on user inputs and simplified
            assumptions. Actual bank, tax, investment, or loan outcomes may
            differ. We do not guarantee accuracy, completeness, or suitability
            for your situation.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>No Professional Advice</h2>
          <p>
            FOINWI does not provide investment, tax, loan, legal, or personalized
            financial advice. Nothing on this website should be treated as a
            recommendation to buy, sell, hold, borrow, or invest in any product.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>User Responsibility</h2>
          <p>
            Users are responsible for verifying information before making
            financial decisions. Consult qualified financial, tax, and legal
            professionals for advice suited to your personal circumstances.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Intellectual Property</h2>
          <p>
            Content, calculators, branding, and design belong to FOINWI. You may
            not copy, republish, scrape, or commercially exploit our materials
            without permission.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Limitation of Liability</h2>
          <p>
            FOINWI is not liable for losses from decisions made using website
            information, calculator outputs, or educational content. Use the
            platform at your own discretion and risk, to the fullest extent
            permitted by applicable law.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Contact</h2>
          <p>
            For questions about these terms, contact{" "}
            <a href="mailto:support@foinwi.com">support@foinwi.com</a>.
          </p>
        </article>
      </InfoPageLayout>
      <Footer />
    </div>
  );
}

export default TermsAndConditionsPage;
