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
            FOINWI INDIA DIGITAL TOOLS LLP (“we”, “us”, “our”) operates FOINWI —
            Grow Beyond Numbers and foinwi.com to provide educational financial
            calculators, learning content, and tools. This Privacy Policy
            explains how we handle information in simple terms.
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
          <p className="shrix-info-card__follow">
            When you use Exchange Rates, your browser sends the selected currency
            codes to FOINWI&apos;s same-origin exchange-rate endpoint. The amount you
            enter remains in your browser. FOINWI&apos;s endpoint requests the
            corresponding reference rate from Frankfurter; it does not send your
            entered amount to that provider.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Analytics, Cookies and Advertising</h2>
          <p>
            FOINWI may introduce website analytics and advertising services to
            understand website usage, improve our educational platform, and
            support its operation.
          </p>
          <p className="shrix-info-card__follow">
            Certain educational features may store selections locally in your
            browser. Our hosting and security providers may also process
            technical information necessary to operate and protect the website.
          </p>
          <p className="shrix-info-card__follow">
            Before activating new analytics or advertising technologies, we will
            update this Privacy Policy and implement any notices or consent
            mechanisms required by applicable law.
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
            FOINWI uses certain external services to operate its educational
            tools. Email providers may process information you choose to send
            through email.
          </p>
          <p className="shrix-info-card__follow">
            Our Exchange Rates tool uses Frankfurter, an external reference-rate
            data provider. FOINWI requests exchange-rate information through its
            server-side service. The amount you enter is not sent to Frankfurter
            as part of that request.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Website Hosting and Security</h2>
          <p>
            FOINWI uses Cloudflare to operate, deliver, and help protect our
            website. During normal website use, technical information such as IP
            addresses and browser details may be processed for operational and
            security purposes.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Information Security and User Privacy</h2>
          <p>
            FOINWI is committed to handling user information responsibly and
            respecting user privacy.
          </p>
          <p className="shrix-info-card__follow">
            We encourage users to share only the information necessary when
            contacting us or using our educational tools. Confidential personal
            or financial information should not be submitted through general
            enquiries or email communications.
          </p>
          <p className="shrix-info-card__follow">
            As FOINWI introduces new features or services, including user
            accounts and premium offerings, we will update this Privacy Policy
            to explain what additional information is collected, how it is used,
            and how it is protected, as applicable.
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
