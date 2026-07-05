import Navbar from "../components/Navbar";
import InfoPageLayout from "../components/InfoPageLayout";
import Footer from "../components/Footer";
import "../styles/global.css";

const topics = [
  {
    title: "SIP Basics",
    text: "Understand how systematic investment plans work, how monthly investing builds wealth, and how to estimate long-term returns with clarity.",
  },
  {
    title: "Investing Basics",
    text: "Learn core ideas like risk, return, compounding, asset allocation, and how to evaluate investment choices with confidence.",
  },
  {
    title: "FD, PPF, EPF & NPS",
    text: "Explore how popular Indian savings and retirement products work, including fixed deposits, PPF, EPF, and National Pension System.",
  },
  {
    title: "Loan & EMI Education",
    text: "Understand borrowing costs, EMI structure, interest impact, and how to compare loan options before making financial decisions.",
  },
  {
    title: "Tax & Salary Planning",
    text: "Build awareness around salary components, deductions, tax planning concepts, and how financial choices affect take-home outcomes.",
  },
  {
    title: "Retirement Planning",
    text: "Learn how to estimate retirement needs, plan long-term corpus targets, and use calculators to prepare for life after work.",
  },
];

function LearnPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <InfoPageLayout
        label="Learn"
        title="Financial Learning for Indian Investors"
        subtitle="Clear, practical education to help you understand money, investments, loans, and long-term planning."
      >
        <div className="shrix-info-grid">
          {topics.map((topic) => (
            <article className="shrix-info-card" key={topic.title}>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </article>
          ))}
        </div>
      </InfoPageLayout>
      <Footer />
    </div>
  );
}

export default LearnPage;
