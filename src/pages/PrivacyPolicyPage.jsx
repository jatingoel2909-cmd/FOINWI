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
            Advertising on FOINWI is not currently enabled. foinwi.com does not
            load Google ad scripts, and FOINWI does not currently show
            advertisements.
          </p>
          <p className="shrix-info-card__follow">
            FOINWI can use Google Analytics 4 to count visits to public pages.
            Google is the recipient of that analytics data when collection is on.
            Collection stays off until you choose Accept. If you have not chosen,
            or you opt out by choosing Reject, FOINWI does not load Google
            Analytics scripts, does not send analytics requests, and does not keep
            analytics cookies for this purpose.
          </p>
          <p className="shrix-info-card__follow">
            When you accept on the production website, your browser may load
            Google Analytics 4 and store analytics cookies, including cookies
            whose names start with _ga. FOINWI sends the path of a public page.
            It does not send query strings, URL fragments, calculator values,
            income, Financial Health Score answers, search text, or Guide Trial
            content through this integration.
          </p>
          <p className="shrix-info-card__follow">
            You can change or withdraw that choice at any time through Privacy
            settings. Choosing Reject withdraws an earlier acceptance. Withdrawal
            stops further collection in this browser and clears analytics cookies
            that this site can remove. Withdrawal does not erase data Google may
            already have received.
          </p>
          <p className="shrix-info-card__follow">
            Google retention of analytics data depends on the retention settings
            in the Google Analytics property. This website cannot enforce or
            confirm that period. The tag is configured with automatic page views
            off and with advertising personalization signals off. Enhanced
            measurement is controlled in the Google Analytics property, not by
            this page, and it needs to stay off there so the tag does not collect
            extra interactions.
          </p>
          <p className="shrix-info-card__follow">
            Some educational features may store your own selections locally in
            your browser. That on-device storage is not an advertising cookie.
            Our hosting and security providers may also process technical
            information necessary to operate and protect the website.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Google AdSense verification is not advertising</h2>
          <p>
            The FOINWI homepage includes a Google AdSense site-ownership tag for
            publisher ID ca-pub-5613519608688017.             The tag lets Google check that
            FOINWI controls foinwi.com. It does not display ads or set an
            advertising cookie. The tag does not mean that advertisements are
            active.
          </p>
          <p className="shrix-info-card__follow">
            If FOINWI later enables Google AdSense, Google and other advertising
            partners may use cookies and similar technologies to serve ads,
            measure ads, limit how often an ad appears, and help detect invalid
            traffic. Personalized ads may use information about sites you have
            visited. Non-personalized ads are not based on that activity
            profile, but they can still use cookies for measurement, frequency
            limits, and fraud prevention.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Advertising choices</h2>
          <p>
            If ads are enabled later, you can review personalization in your
            Google account at{" "}
            <a href="https://adssettings.google.com/">Google Ads Settings</a>.
            Google describes these technologies in{" "}
            <a href="https://policies.google.com/technologies/ads">
              How Google uses information from sites or apps that use its
              services
            </a>
            . Industry choice pages include{" "}
            <a href="https://www.aboutads.info/choices">aboutads.info</a> and{" "}
            <a href="https://www.youronlinechoices.com/">Your Online Choices</a>.
            Those sites are operated by Google or industry groups, not by
            FOINWI.
          </p>
          <p className="shrix-info-card__follow">
            FOINWI shows an analytics choice for optional Google Analytics 4,
            described above. That choice is not advertising consent. Advertising
            is not currently enabled, and this Privacy Policy does not collect
            advertising consent. Before ads are enabled for visitors in the
            European Economic Area, the United Kingdom, or Switzerland, FOINWI
            must add any consent mechanism required by applicable law and by
            Google&apos;s advertising policies.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Cloudflare Web Analytics</h2>
          <p>
            FOINWI&apos;s Cloudflare hosting configuration includes Cloudflare Web
            Analytics. Cloudflare adds a beacon script from
            static.cloudflareinsights.com to pages it delivers. FOINWI&apos;s
            current Content-Security-Policy does not allow that script to load,
            so the beacon cannot run and is not collecting browser analytics
            while that policy stays in place.
          </p>
          <p className="shrix-info-card__follow">
            When Cloudflare Web Analytics is allowed to run, it is designed to
            count page visits without setting an advertising cookie. It is
            separate from Google advertising. Before FOINWI allows that beacon
            to run, or enables advertisements, FOINWI will update this Privacy
            Policy if those practices change and will implement any consent
            mechanism required by applicable law.
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
          <p className="shrix-info-card__follow">
            That security processing is separate from Cloudflare Web Analytics,
            described above. It can continue when the analytics beacon does not
            run.
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
