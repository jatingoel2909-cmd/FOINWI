import Navbar from "../components/Navbar";
import InfoPageLayout from "../components/InfoPageLayout";
import Footer from "../components/Footer";
import "../styles/global.css";

function PrivacyPolicyPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InfoPageLayout
        label="Legal"
        title="Privacy Policy"
        subtitle="How FOINWI handles information on our educational financial platform for users in India."
        centered
      >
        <article className="shrix-info-card shrix-info-card--wide">
          <p>
            FOINWI (“we”, “us”, “our”) operates foinwi.com to provide educational
            financial calculators, learning content, and tools. This Privacy
            Policy explains how we handle information in simple terms.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Information We Collect</h2>
          <p>
            FOINWI currently receives information primarily when you choose to
            contact us by email. This may include:
          </p>
          <ul className="shrix-info-list">
            <li>Your name and email address</li>
            <li>The content of your message or enquiry</li>
          </ul>
          <p className="shrix-info-card__follow">
            Calculator inputs are processed in your browser for educational
            estimates. Some on-device progress features may save your own
            selections locally in the browser. The Guide Trial conversation stays
            only in its page and is not saved after refresh.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Analytics and Cookies</h2>
          <p>
            Google Analytics and behavioral tracking are not currently enabled.
            If analytics, cookies, forms, or related services are introduced in
            future, we may update this policy before or with that implementation.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>We Do Not Sell Personal Information</h2>
          <p>
            We do not sell your personal information. FOINWI is built for
            education and clarity, not for trading user data.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Third-Party Services</h2>
          <p>
            Email providers may process information you choose to send through
            email under their own policies. If other third-party services are
            introduced in future, we may update this policy before or with that
            implementation.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Sensitive Information</h2>
          <p>
            Users should not submit sensitive financial information through
            contact forms or general email messages — such as bank account
            numbers, passwords, Aadhaar, PAN, or full investment details —
            unless we specifically request it for a defined purpose.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Contact</h2>
          <p>
            For privacy-related questions, contact us at{" "}
            <a href="mailto:support@foinwi.com">support@foinwi.com</a>.
          </p>
        </article>
      </InfoPageLayout>
      <Footer />
    </div>
  );
}

export default PrivacyPolicyPage;
