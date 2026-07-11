import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMissionBySlug } from "../utils/missionHelpers";
import "../styles/global.css";
import "../styles/journey.css";

function getChecklistStorageKey(slug) {
  return `foinwi-mission-checklist-${slug}`;
}

function MissionJourneyPage({ slug }) {
  const mission = getMissionBySlug(slug);
  const progressRef = useRef(null);

  const [checkedItems, setCheckedItems] = useState(() => {
    if (!slug) return {};
    try {
      const stored = localStorage.getItem(getChecklistStorageKey(slug));
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!slug) return;
    localStorage.setItem(getChecklistStorageKey(slug), JSON.stringify(checkedItems));
  }, [checkedItems, slug]);

  const completedCount = useMemo(() => {
    if (!mission) return 0;
    return mission.checklist.filter((item) => checkedItems[item.id]).length;
  }, [checkedItems, mission]);

  const currentMilestoneIndex = useMemo(() => {
    if (!mission?.milestones.length) return 0;
    if (completedCount === 0) return 0;
    const ratio = completedCount / mission.checklist.length;
    return Math.min(mission.milestones.length - 1, Math.floor(ratio * mission.milestones.length));
  }, [completedCount, mission]);

  if (!mission) {
    return <Navigate to="/" replace />;
  }

  const toggleChecklistItem = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToProgress = () => {
    progressRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getMilestoneState = (index) => {
    if (index < currentMilestoneIndex) return "completed";
    if (index === currentMilestoneIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="shrix-app">
      <Navbar />

      <header className="shrix-mission-hero">
        <div className="shrix-mission-hero__inner shrix-mission-animate">
          <Link to="/#journeys" className="shrix-mission-hero__back">
            ← All Missions
          </Link>
          <div className="shrix-mission-hero__top">
            <div className="shrix-mission-hero__icon" aria-hidden="true">
              <span>{mission.icon}</span>
            </div>
            <div className="shrix-mission-hero__meta">
              <p className="shrix-section-label">Financial Mission</p>
              <h1>{mission.title}</h1>
              <p className="shrix-mission-hero__subtitle">{mission.heroSubtitle}</p>
              <div className="shrix-mission-hero__badges">
                <span className="shrix-mission-badge">{mission.duration}</span>
                <span className="shrix-mission-badge shrix-mission-badge--difficulty">
                  {mission.difficulty}
                </span>
              </div>
            </div>
          </div>
          <button type="button" className="shrix-mission-hero__start" onClick={scrollToProgress}>
            Start Mission →
          </button>
        </div>
      </header>

      <main className="shrix-mission-page">
        <section className="shrix-mission-block shrix-mission-block--brief shrix-mission-animate">
          <h2>Mission Brief</h2>
          <p>{mission.overview}</p>
        </section>

        <section
          className="shrix-mission-block shrix-mission-animate"
          ref={progressRef}
          id="mission-progress"
        >
          <div className="shrix-mission-block__head">
            <h2>Mission Progress</h2>
            <span className="shrix-mission-progress__count">
              {completedCount}/{mission.checklist.length} tasks complete
            </span>
          </div>
          <div className="shrix-mission-track">
            <div className="shrix-mission-track__line" aria-hidden="true" />
            <ol className="shrix-mission-track__steps">
              {mission.milestones.map((milestone, index) => {
                const state = getMilestoneState(index);
                return (
                  <li
                    className={`shrix-mission-track__step shrix-mission-track__step--${state}`}
                    key={milestone.title}
                  >
                    <span className="shrix-mission-track__dot">
                      {state === "completed" ? "✓" : index + 1}
                    </span>
                    <div className="shrix-mission-track__content">
                      <strong>{milestone.title}</strong>
                      <p>{milestone.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="shrix-mission-block shrix-mission-animate">
          <h2>Required Calculators</h2>
          <p className="shrix-mission-block__intro">
            Open FOINWI calculators to estimate numbers for this mission.
          </p>
          <div className="shrix-mission-calc-grid">
            {mission.calculators.map((calc) => (
              <Link to={calc.path} className="shrix-mission-calc-card" key={calc.path}>
                <span className="shrix-mission-calc-card__icon" aria-hidden="true">
                  {calc.icon}
                </span>
                <div>
                  <h3>{calc.title}</h3>
                  <p>{calc.desc}</p>
                  <span className="shrix-mission-calc-card__link">Open calculator →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="shrix-mission-block shrix-mission-animate">
          <h2>Learning Modules</h2>
          <div className="shrix-mission-learn-grid">
            {mission.learningModules.map((module) => (
              <article className="shrix-mission-learn-card" key={module.title}>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </article>
            ))}
          </div>
          <Link to="/learn" className="shrix-mission-inline-link">
            Explore learning paths →
          </Link>
        </section>

        <section className="shrix-mission-block shrix-mission-block--ai shrix-mission-animate">
          <span className="shrix-mission-ai__badge">Coming Soon</span>
          <h2>AI Guide</h2>
          <p className="shrix-mission-ai__intro">{mission.aiGuide.intro}</p>
          <ul className="shrix-mission-ai__list">
            {mission.aiGuide.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="shrix-mission-ai__note">
            Coming Soon preview only — not live advice, not a chatbot, and not
            financial, tax, investment, or loan advice.
          </p>
          <Link to="/ai-tools" className="shrix-mission-inline-link">
            View AI Roadmap →
          </Link>
        </section>

        <section className="shrix-mission-block shrix-mission-animate">
          <h2>Mission Checklist</h2>
          <ul className="shrix-mission-checklist">
            {mission.checklist.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`shrix-mission-checklist__item${isChecked ? " shrix-mission-checklist__item--done" : ""}`}
                    onClick={() => toggleChecklistItem(item.id)}
                    aria-pressed={isChecked}
                  >
                    <span className="shrix-mission-checklist__box" aria-hidden="true">
                      {isChecked ? "✓" : ""}
                    </span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {mission.nextMission && (
          <section className="shrix-mission-next shrix-mission-animate">
            <p className="shrix-mission-next__label">Suggested Next Mission</p>
            <div className="shrix-mission-next__card">
              <h2>{mission.nextMission.title}</h2>
              <p>{mission.nextMission.description}</p>
              <Link to={`/journeys/${mission.nextMission.slug}`} className="shrix-mission-next__btn">
                Start Next Mission →
              </Link>
            </div>
          </section>
        )}
      </main>

      <p className="shrix-mission-page-disclaimer">
        Mission content is for educational planning only. It is not financial, tax,
        investment, loan, or legal advice. Calculator results and milestones depend
        on your inputs and assumptions. Consult qualified professionals before making
        financial decisions.
      </p>

      <Footer />
    </div>
  );
}

export default MissionJourneyPage;
