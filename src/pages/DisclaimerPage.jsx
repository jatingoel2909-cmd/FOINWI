import Navbar from "../components/Navbar";
import InfoPageLayout from "../components/InfoPageLayout";
import Footer from "../components/Footer";
import "../styles/global.css";

function DisclaimerPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InfoPageLayout
        label="Legal"
        title="Disclaimer"
        subtitle="Important information about how to use FOINWI responsibly."
        centered
      >
        <article className="shrix-info-card shrix-info-card--wide shrix-info-card--highlight">
          <p>
            FOINWI provides educational calculators, learning content, and
            financial tools only. This is not financial advice.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Estimates Only</h2>
          <p>
            Results are estimates and may differ from actual bank, tax,
            investment, or financial outcomes. Calculator outputs depend on the
            values you enter and standard formulas or simplified assumptions.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>No Personalized Advice</h2>
          <p>
            We do not provide personalized investment, tax, loan, legal, or
            financial advice. FOINWI content is general and educational,
            designed to help Indian users learn — not replace qualified
            professionals.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Consult Qualified Professionals</h2>
          <p>
            Users should consult qualified professionals before making financial
            decisions. Tax rules, interest rates, product terms, and regulations
            in India can change. Always verify information independently.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Contact</h2>
          <p>
            For questions about this disclaimer, contact{" "}
            <a href="mailto:support@foinwi.com">support@foinwi.com</a>.
          </p>
        </article>
      </InfoPageLayout>
      <Footer />
    </div>
  );
}

export default DisclaimerPage;
