import GuideHeroVisual from "./GuideHeroVisual";

function GuideHero() {
  return (
    <header className="guide-hero">
      <div className="guide-hero__layout">
        <div className="guide-hero__content">
          <p className="shrix-section-label">FOINWI Guide</p>
          <h1>Welcome to the FOINWI Guide</h1>
          <p className="guide-hero__lead">Grow Beyond Numbers.</p>
          <p className="guide-hero__text">
            Start your financial journey with clear learning paths, practical tools,
            and guided experiences designed to help you build lifelong financial
            confidence.
          </p>
          <div className="guide-hero__actions">
            <a href="#guide-explore" className="guide-btn guide-btn--primary">
              Explore Your Journey
            </a>
            <a href="#guide-continue" className="guide-btn guide-btn--ghost">
              Continue Learning
            </a>
          </div>
        </div>
        <GuideHeroVisual />
      </div>
    </header>
  );
}

export default GuideHero;
