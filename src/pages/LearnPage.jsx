import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LearningPathCard from "../components/learn/LearningPathCard";
import IntelligenceSection from "../components/intelligence/IntelligenceSection";
import RecommendationPanel from "../components/intelligence/RecommendationPanel";
import {
  LEARN_ACADEMY_NOTICE,
  LEARN_DISCOVERY_TOPICS,
  LEARN_SEARCH_SYNONYMS,
  LEARN_START_OPTIONS,
  LEARNING_PATHS,
} from "../data/learnAcademy";
import "../styles/global.css";
import "../styles/learn-academy.css";

const SEARCH_ALIASES = Object.freeze({ budjet: "budget", retirment: "retirement", insurence: "insurance" });

function normalizeLearnSearch(value = "") {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/u)
    .filter(Boolean)
    .map((term) => SEARCH_ALIASES[term] ?? term);
}

function LearnPage() {
  const featuredPath = LEARNING_PATHS[0];
  const continuePath = LEARNING_PATHS[1];
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const visiblePaths = useMemo(() => {
    const terms = normalizeLearnSearch(query);
    const topic = LEARN_DISCOVERY_TOPICS.find((item) => item.id === activeTopic);
    const topicPaths = topic?.pathSlugs ?? LEARNING_PATHS.map((path) => path.slug);

    return LEARNING_PATHS.filter((path) => {
      if (!topicPaths.includes(path.slug)) return false;
      if (!terms.length) return true;

      const searchText = [
        path.title,
        path.description,
        ...path.lessons.flatMap((lesson) => [lesson.title, lesson.summary]),
      ].join(" ").toLowerCase();
      return terms.every((term) => (
        searchText.includes(term)
        || (LEARN_SEARCH_SYNONYMS[term] ?? []).includes(path.slug)
      ));
    });
  }, [activeTopic, query]);

  return (
    <div className="shrix-app">
      <a className="shrix-skip-link" href="#main-content">Skip to main content</a>
      <Navbar />

      <main id="main-content">
        <section className="la-hero" aria-labelledby="learn-hero-title">
          <div className="la-hero__inner">
            <p className="shrix-section-label">FOINWI Learn Academy</p>
            <h1 id="learn-hero-title">Learn Finance Step by Step</h1>
            <p>
              Understand money through structured learning paths, practical examples,
              calculators, and structured learning guidance.
            </p>
          </div>
        </section>

        <div className="la-main">
          <section className="la-start" aria-labelledby="learn-start-title">
            <div className="la-section__head">
              <p className="shrix-section-label">Start here</p>
              <h2 id="learn-start-title">What would you like to understand?</h2>
              <p>Choose a topic to begin with a structured educational path.</p>
            </div>
            <div className="la-start__options">
              {LEARN_START_OPTIONS.map((option) => (
                <Link key={option.label} to={`/learn/${option.pathSlug}`} className="la-start__option">
                  {option.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="la-section">
            <div className="la-section__head">
              <h2>Learning Paths</h2>
              <p>
                Choose a structured track. Each path includes lessons, related FOINWI
                calculators, and a clear progression from fundamentals to applied topics.
              </p>
            </div>
            <div className="la-discovery">
              <label htmlFor="learn-search">Search learning paths and lessons</label>
              <input
                id="learn-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try “budget”, “EMI”, “SIP”, or “retirement”"
              />
              <div className="la-discovery__filters" aria-label="Filter learning paths">
                {LEARN_DISCOVERY_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    className={activeTopic === topic.id ? "is-active" : ""}
                    aria-pressed={activeTopic === topic.id}
                    onClick={() => setActiveTopic(topic.id)}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
              <p className="la-discovery__status" aria-live="polite">
                {visiblePaths.length} {visiblePaths.length === 1 ? "learning path" : "learning paths"} found
              </p>
            </div>
            <div className="la-path-grid">
              {visiblePaths.map((path) => (
                <LearningPathCard key={path.slug} path={path} />
              ))}
            </div>
            {!visiblePaths.length ? (
              <div className="la-discovery__empty">
                <h3>Try a broader topic</h3>
                <p>Try money, saving, investing, loans, tax, protection, or retirement.</p>
                <button type="button" onClick={() => { setQuery(""); setActiveTopic("all"); }}>
                  Show all learning paths
                </button>
              </div>
            ) : null}
          </section>

          <IntelligenceSection
            pathname="/learn"
            difficulty="beginner"
            className="fi-intelligence-section--learn"
          />

          <RecommendationPanel
            pathname="/learn"
            sourceType="lesson"
            difficulty="beginner"
            className="fi-rec-panel--learn"
          />

          <section className="la-continue">
            <div className="la-continue__copy">
              <p className="shrix-section-label">Continue the learning sequence</p>
              <h2>Next: {continuePath.title}</h2>
              <p>
                {continuePath.title} follows {featuredPath.title} in the suggested
                curriculum order, with practical saving and budgeting habits.
              </p>
              <Link to={`/learn/${continuePath.slug}`} className="la-btn la-btn--primary">
                Explore {continuePath.title} →
              </Link>
            </div>
            <article className="la-continue__card">
              <span aria-hidden="true">{continuePath.icon}</span>
              <h3>{continuePath.title}</h3>
              <p>{continuePath.description}</p>
              <ul className="la-continue__stats">
                <li>{continuePath.duration}</li>
                <li>{continuePath.difficulty}</li>
                <li>{continuePath.lessons.length} lessons</li>
              </ul>
            </article>
          </section>
        </div>

        <p className="la-notice">{LEARN_ACADEMY_NOTICE}</p>
      </main>

      <Footer />
    </div>
  );
}

export default LearnPage;
