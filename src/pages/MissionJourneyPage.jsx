import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMissionBySlug } from "../utils/missionHelpers";
import { getJourneyEducation } from "../data/journeyEducation";
import RecommendationPanel from "../components/intelligence/RecommendationPanel";
import "../styles/global.css";
import "../styles/journey.css";

function getChecklistStorageKey(slug) {
  return `foinwi-mission-checklist-${slug}`;
}

function EducationList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function JourneyEducation({ mission, education }) {
  if (!education) return null;

  return (
    <section
      className="shrix-mission-block shrix-mission-guidance shrix-mission-animate"
      aria-labelledby="mission-education-title"
    >
      <h2 id="mission-education-title">How to read this mission</h2>
      {education.purpose.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <h3>Assumptions</h3>
      <EducationList items={education.assumptions} />

      <h3>Illustrative scenario</h3>
      <div className="shrix-mission-scenario">
        {education.scenario.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <h3>Risks and limitations</h3>
      <EducationList items={education.limitations} />

      <h3>Common planning mistakes</h3>
      <EducationList items={education.mistakes} />

      <h3>Next learning step</h3>
      <p>{education.nextLesson.note}</p>
      <div className="shrix-mission-guidance__links">
        <Link to={education.nextLesson.path} className="shrix-mission-inline-link">
          {education.nextLesson.title} →
        </Link>
        {education.alsoRead?.map((lesson) => (
          <Link key={lesson.path} to={lesson.path} className="shrix-mission-inline-link">
            {lesson.title} →
          </Link>
        ))}
      </div>
      {mission.nextStep ? (
        <>
          <p>{mission.nextStep.text}</p>
          <div className="shrix-mission-guidance__links">
            <Link to={mission.nextStep.path} className="shrix-mission-inline-link">
              {mission.nextStep.cta}
            </Link>
          </div>
        </>
      ) : null}
    </section>
  );
}

function MissionJourneyPage({ slug }) {
  const mission = getMissionBySlug(slug);
  const education = getJourneyEducation(slug);
  const progressRef = useRef(null);

  const [checkedItems, setCheckedItems] = useState({});
  const [checklistReady, setChecklistReady] = useState(false);

  useLayoutEffect(() => {
    if (!slug) {
      setChecklistReady(true);
      return undefined;
    }

    let restored = {};
    try {
      const stored = localStorage.getItem(getChecklistStorageKey(slug));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          restored = parsed;
        }
      }
    } catch {
      restored = {};
    }

    setCheckedItems(restored);
    setChecklistReady(true);
    return undefined;
  }, [slug]);

  useEffect(() => {
    if (!slug || !checklistReady) return;
    try {
      localStorage.setItem(getChecklistStorageKey(slug), JSON.stringify(checkedItems));
    } catch {
      // Persistence is best-effort when storage is blocked.
    }
  }, [checkedItems, slug, checklistReady]);

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
      <a className="shrix-skip-link" href="#main-content">
        Skip to main content
      </a>
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

      <main id="main-content" tabIndex={-1} className="shrix-mission-page">
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
              <span
                className="shrix-mission-progress__value"
                style={{ minWidth: `${String(mission.checklist.length).length}ch` }}
              >
                {completedCount}
              </span>
              /{mission.checklist.length} tasks complete
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
          {education ? (
            <p className="shrix-mission-block__intro">
              Open a related lesson where FOINWI already teaches this topic.
            </p>
          ) : null}
          <div className="shrix-mission-learn-grid">
            {mission.learningModules.map((module) => {
              const lesson = education?.moduleLessons?.[module.title];
              return (
                <article className="shrix-mission-learn-card" key={module.title}>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  {lesson ? (
                    <Link to={lesson.path} className="shrix-mission-learn-card__lesson">
                      {lesson.title} →
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
          <Link to="/learn" className="shrix-mission-inline-link">
            Explore learning paths →
          </Link>
        </section>

        <JourneyEducation mission={mission} education={education} />

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

        <p className="shrix-mission-ai-note">
          A future assistant is not available on this page. The calculators and
          lessons above are what you can use today. This is not a chatbot and
          not live advice.{" "}
          <Link to="/ai-tools">AI Tools shows the live map and what remains planned.</Link>
        </p>

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

        <RecommendationPanel
          pathname={`/journeys/${mission.slug}`}
          journeySlug={mission.slug}
          missionSlug={mission.slug}
          sourceType="mission"
          className="fi-rec-panel--journey"
          compact
        />
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
