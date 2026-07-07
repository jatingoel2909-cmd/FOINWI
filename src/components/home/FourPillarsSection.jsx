const pillars = [
  {
    title: "Calculate",
    text: "Use easy financial calculators for SIP, EMI, FD, tax, retirement, loans, and long-term goals.",
  },
  {
    title: "Learn",
    text: "Understand money concepts through simple learning paths made for students, professionals, families, and retirees.",
  },
  {
    title: "Plan with AI",
    text: "Upcoming AI tools will help explain results, compare options, and guide users toward smarter financial planning.",
  },
  {
    title: "Grow",
    text: "Build confidence in saving, investing, borrowing, and planning for future financial goals.",
  },
];

function FourPillarsSection() {
  return (
    <section className="shrix-home-section" id="pillars">
      <p className="shrix-section-label">Our Approach</p>
      <h2>Calculate. Learn. Plan with AI. Grow.</h2>
      <p className="shrix-home-section__subtitle">
        FOINWI helps India calculate, learn, and plan smarter financial decisions.
      </p>
      <div className="shrix-home-grid shrix-home-grid--4">
        {pillars.map((pillar) => (
          <article className="shrix-home-card" key={pillar.title}>
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FourPillarsSection;
