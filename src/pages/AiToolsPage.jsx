import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GuideHero from "../components/guide/GuideHero";
import ExploreGoalCard from "../components/guide/ExploreGoalCard";
import GuideLearningCard from "../components/guide/GuideLearningCard";
import GuideToolCard from "../components/guide/GuideToolCard";
import GuideHabitCard from "../components/guide/GuideHabitCard";
import GuideDailyInsight from "../components/guide/GuideDailyInsight";
import GuideFutureTimeline from "../components/guide/GuideFutureTimeline";
import { getLearningPathBySlug } from "../data/learnAcademy";
import { ALL_CALCULATORS } from "../data/calculators";
import {
  DAILY_FINANCIAL_INSIGHT,
  EXPLORE_GOALS,
  FEATURED_LEARNING_SLUGS,
  FEATURED_TOOL_PATHS,
  FINANCIAL_HABITS,
  GUIDE_DISCLAIMER,
} from "../data/foinwiGuide";
import "../styles/global.css";
import "../styles/ai-guide.css";

function AiToolsPage() {
  const learningPaths = FEATURED_LEARNING_SLUGS.map((slug) => getLearningPathBySlug(slug)).filter(
    Boolean,
  );

  const featuredTools = FEATURED_TOOL_PATHS.map((path) =>
    ALL_CALCULATORS.find((calc) => calc.path === path),
  ).filter(Boolean);

  return (
    <div className="shrix-app">
      <Navbar />
      <GuideHero />

      <main className="guide-main">
        <section
          className="guide-section"
          id="guide-explore"
          aria-labelledby="guide-explore-title"
        >
          <div className="guide-section__head">
            <h2 id="guide-explore-title">What would you like to explore today?</h2>
          </div>
          <div className="guide-explore-grid">
            {EXPLORE_GOALS.map((goal) => (
              <ExploreGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>

        <section
          className="guide-section"
          id="guide-continue"
          aria-labelledby="guide-continue-title"
        >
          <div className="guide-section__head">
            <h2 id="guide-continue-title">Continue Your Learning</h2>
          </div>
          <div className="guide-learning-grid">
            {learningPaths.map((path) => (
              <GuideLearningCard key={path.slug} path={path} />
            ))}
          </div>
        </section>

        <section className="guide-section guide-section--compact" aria-label="Daily financial insight">
          <GuideDailyInsight insight={DAILY_FINANCIAL_INSIGHT} />
        </section>

        <section className="guide-section" aria-labelledby="guide-tools-title">
          <div className="guide-section__head">
            <h2 id="guide-tools-title">Popular Financial Tools</h2>
            <p>Choose the right calculator to support your financial journey.</p>
          </div>
          <div className="guide-tools-grid">
            {featuredTools.map((calc) => (
              <GuideToolCard key={calc.path} calculator={calc} />
            ))}
          </div>
        </section>

        <section className="guide-section" aria-labelledby="guide-habits-title">
          <div className="guide-section__head">
            <h2 id="guide-habits-title">Build Better Financial Habits</h2>
          </div>
          <div className="guide-habits-grid">
            {FINANCIAL_HABITS.map((habit) => (
              <GuideHabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>

        <section className="guide-section" aria-labelledby="guide-future-title">
          <div className="guide-section__head">
            <h2 id="guide-future-title">The Future of FOINWI Guide</h2>
          </div>
          <GuideFutureTimeline />
        </section>
      </main>

      <p className="guide-notice">{GUIDE_DISCLAIMER}</p>
      <Footer />
    </div>
  );
}

export default AiToolsPage;
