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
          <p className="shrix-info-card__follow">
            When you use Exchange Rates, your browser sends the selected currency
            codes to FOINWI&apos;s same-origin exchange-rate endpoint. The amount you
            enter remains in your browser. FOINWI&apos;s endpoint requests the
            corresponding reference rate from Frankfurter; it does not send your
            entered amount to that provider.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Analytics and Cookies</h2>
          <p>
            FOINWI can use Google Analytics 4 to count visits to public pages.
            Google is the recipient of that analytics data when collection is on.
            Collection stays off until you choose Accept. If you have not chosen,
            or you opt out by choosing Reject, FOINWI does not load Google
            Analytics scripts, does not send analytics requests, and does not keep
            analytics cookies for this purpose.
          </p>
          <p>
            When you accept on the production website, your browser may load
            Google Analytics 4 and store analytics cookies, including cookies
            whose names start with _ga. FOINWI sends the path of a public page.
            It does not send query strings, URL fragments, calculator values,
            income, Financial Health Score answers, search text, or Guide Trial
            content through this integration.
          </p>
          <p>
            You can change or withdraw that choice at any time through Privacy settings. Choosing Reject withdraws an earlier acceptance. Withdrawal
            stops further collection in this browser and clears analytics cookies
            that this site can remove. Withdrawal does not erase data Google may
            already have received.
          </p>
          <p>
            Google retention of analytics data depends on the retention settings
            in the Google Analytics property. This website cannot enforce or
            confirm that period. The tag is configured with automatic page views
            off and with advertising personalization signals off. Enhanced
            measurement is controlled in the Google Analytics property, not by
            this page, and it needs to stay off there so the tag does not collect
            extra interactions.
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
            email under their own policies. Exchange Rates uses Frankfurter as a
            reference-rate data provider through FOINWI&apos;s server-side endpoint.
            Frankfurter receives only the requested currency pair from that
            endpoint, subject to its own policies. If you accept analytics, Google
            may process the public page path described above under Google&apos;s own
            terms.
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
