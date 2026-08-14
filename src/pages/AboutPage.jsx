import Navbar from "../components/Navbar";
import InfoPageLayout from "../components/InfoPageLayout";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../styles/global.css";

const principles = [
  "Focus — clarity over complexity in every tool and explanation.",
  "Investment — building long-term wealth through thoughtful decisions.",
  "Willingly — helping you understand your options more clearly, without pressure.",
  "Education first — we explain concepts, not push products.",
  "Built for India — calculators and content reflect how Indians save, borrow, and plan.",
  "Transparency — no hidden agendas, no exaggerated claims.",
];

const roadmap = [
  "Expanded calculator library covering more Indian financial scenarios.",
  "Structured learning paths aligned to life stages and financial goals.",
  "More advanced AI-enabled assistance after safety review and product readiness.",
  "Richer content on tax, salary, retirement, and wealth planning.",
  "A platform that grows with you — from first SIP to retirement corpus.",
];

function AboutPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InfoPageLayout
        label="About FOINWI"
        title="Financial Clarity for Every Indian"
        subtitle="Premium calculators and educational tools from foinwi.com — designed to help you understand money, not overwhelm you with it."
      >
        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Who We Are</h2>
          <p>
            FOINWI is a premium financial platform built for Indian users who want
            clear, practical answers about money. We combine formula-based educational
            calculators
            with educational content so you can understand SIP, loans, deposits,
            retirement, tax planning, and everyday financial decisions — without
            wading through jargon or noise.
          </p>
        </article>

        <div className="shrix-info-grid">
          <article className="shrix-info-card">
            <h2>Our Mission</h2>
            <p>Build wealth through thoughtful financial decisions.</p>
          </article>

          <article className="shrix-info-card">
            <h2>Our Vision</h2>
            <p>
              Helping users explore financial concepts and compare scenarios with
              greater clarity.
            </p>
          </article>
        </div>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>What Makes Us Different</h2>
          <p>
            FOINWI is not another generic finance site. We focus on the products,
            scenarios, and questions that matter to Indian users — PPF, EPF, NPS,
            FD, EMI, SIP, gratuity, and more. Our black-and-gold experience is
            designed to feel premium, clear, and easy to use, with calculators that are
            fast, responsive, and easy to use on any device.
          </p>
          <p className="shrix-info-card__follow">
            We do not sell financial products, offer personalised advisory
            services, or claim regulated credentials. FOINWI is an educational
            platform — here to help you learn, compare scenarios, and think
            clearly about your money.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Our Principles</h2>
          <p className="shrix-info-card__follow">
            Our core philosophy is Focus. Investment. Willingly. — the foundation
            behind the FOINWI name and everything we build.
          </p>
          <ul className="shrix-info-list">
            {principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="shrix-info-card shrix-info-card--wide shrix-info-card--highlight">
          <h2>Grow Beyond Numbers</h2>
          <p>
            That is more than a tagline — it is how we think about financial
            planning. Numbers matter, but understanding what they mean matters
            more. FOINWI helps you see the story behind every calculation: how
            compounding builds wealth, how EMI affects cash flow, how retirement
            corpus targets take shape over time.
          </p>
          <p className="shrix-info-card__follow">
            When you Grow Beyond Numbers, you move from uncertainty toward clearer
            understanding and more informed action.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>What You Can Use Today</h2>
          <p>
            Today, you can explore educational financial calculators, the Learn
            Academy, Financial Health Score, financial Journeys, and FOINWI
            Intelligence for structured educational discovery and guidance.
          </p>
          <ul className="shrix-info-list">
            <li><Link to="/calculators">Explore Calculators</Link></li>
            <li><Link to="/learn">Learn with FOINWI</Link></li>
            <li><Link to="/financial-health-score">Financial Health Score</Link></li>
            <li><Link to="/ai-tools">FOINWI Intelligence</Link></li>
          </ul>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>What FOINWI Does Not Do</h2>
          <p>
            FOINWI does not provide personalised financial, tax, legal, or loan
            advice. We do not recommend investments or products, decide loan
            approvals, promise investment outcomes, or claim regulated advisory
            credentials.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>How Intelligence Works Today</h2>
          <p>
            FOINWI Intelligence uses structured educational content, search,
            explanations, and guided discovery to help you explore concepts and
            tools. More advanced AI-enabled assistance may be introduced later
            after safety review and product readiness.
          </p>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Support and Trust Information</h2>
          <p>
            Questions, feedback, or something unclear? Contact us at{" "}
            <a href="mailto:support@foinwi.com">support@foinwi.com</a>.
          </p>
          <ul className="shrix-info-list">
            <li><Link to="/disclaimer">Disclaimer</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
          </ul>
        </article>

        <article className="shrix-info-card shrix-info-card--wide">
          <h2>Future Roadmap</h2>
          <p>
            FOINWI is actively evolving. Here is what we are working toward:
          </p>
          <ul className="shrix-info-list">
            {roadmap.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </InfoPageLayout>
      <Footer />
    </div>
  );
}

export default AboutPage;
