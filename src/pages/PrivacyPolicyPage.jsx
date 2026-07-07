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
            FOINWI collects limited information only when users contact us or use
            forms on the website. This may include:
          </p>
          <ul className="shrix-info-list">
            <li>Your name and email address</li>
            <li>The content of your message or enquiry</li>
            <li>Basic technical details needed to respond to you</li>
          </ul>
          <p className="shrix-info-card__follow">
            Calculator inputs you enter are generally processed in your browser
            for estimates and are not stored by us unless clearly stated
            otherwise.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Analytics and Cookies</h2>
          <p>
            We may use analytics and cookies in future to improve website
            experience, understand usage patterns, and make FOINWI easier to
            use. If we introduce these tools, we will update this policy as
            needed.
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
            Third-party services like hosting, email routing, analytics, ads, or
            payment tools may be used in future to operate and improve FOINWI.
            These providers may process limited data under their own policies.
            We choose services carefully but do not control all third-party
            practices.
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
