import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JourneyHeader from "../components/journey-engine/JourneyHeader";
import JourneyTimeline from "../components/journey-engine/JourneyTimeline";
import JourneyProgress from "../components/journey-engine/JourneyProgress";
import JourneyModules from "../components/journey-engine/JourneyModules";
import JourneyCalculators from "../components/journey-engine/JourneyCalculators";
import JourneyMissionLink from "../components/journey-engine/JourneyMissionLink";
import JourneyHealthScore from "../components/journey-engine/JourneyHealthScore";
import JourneyCompletion from "../components/journey-engine/JourneyCompletion";
import JourneyNextRecommendation from "../components/journey-engine/JourneyNextRecommendation";
import IntelligenceSection from "../components/intelligence/IntelligenceSection";
import RecommendationPanel from "../components/intelligence/RecommendationPanel";
import { JOURNEY_ENGINE_DISCLAIMER } from "../data/financialJourneyEngine";
import {
  calculateJourneyProgress,
  getJourneyCalculators,
  getJourneyMission,
  getJourneyProgressKey,
  isJourneyComplete,
  resolveJourneyModules,
} from "../utils/journeyEngineHelpers";
import "../styles/global.css";
import "../styles/journey-engine.css";

function readStoredJourneyProgress(slug) {
  try {
    const stored = localStorage.getItem(getJourneyProgressKey(slug));
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function FinancialJourneyPage({ journey }) {
  const [checkedItems, setCheckedItems] = useState({});
  const [progressReady, setProgressReady] = useState(false);

  useLayoutEffect(() => {
    setCheckedItems(readStoredJourneyProgress(journey.slug));
    setProgressReady(true);
  }, [journey.slug]);

  useEffect(() => {
    if (!progressReady) return;
    try {
      localStorage.setItem(getJourneyProgressKey(journey.slug), JSON.stringify(checkedItems));
    } catch {
      // Progress remains available for the current page when browser storage is unavailable.
    }
  }, [checkedItems, journey.slug, progressReady]);

  function toggleProgressStep(stepId) {
    setCheckedItems((current) => ({ ...current, [stepId]: !current[stepId] }));
  }

  function resetProgress() {
    setCheckedItems({});
  }

  const calculators = getJourneyCalculators(journey.calculatorPaths);
  const modules = resolveJourneyModules(journey.modules);
  const mission = getJourneyMission(journey.missionSlug);

  const progressPercent = useMemo(
    () => calculateJourneyProgress(journey.progressSteps, checkedItems),
    [journey.progressSteps, checkedItems],
  );

  const currentTimelineIndex = useMemo(() => {
    if (!journey.timeline.length) return 0;
    if (progressPercent === 0) return 0;
    if (progressPercent === 100) return journey.timeline.length - 1;
    return Math.min(
      journey.timeline.length - 1,
      Math.floor((progressPercent / 100) * journey.timeline.length),
    );
  }, [journey.timeline.length, progressPercent]);

  const complete = isJourneyComplete(journey.progressSteps, checkedItems);

  return (
    <div className="shrix-app">
      <Navbar />
      <JourneyHeader journey={journey} />

      <main className="fje-main">
        <JourneyTimeline timeline={journey.timeline} currentIndex={currentTimelineIndex} />
        <JourneyProgress
          progressSteps={journey.progressSteps}
          checkedItems={checkedItems}
          progressPercent={progressPercent}
          onToggleStep={toggleProgressStep}
          onReset={resetProgress}
        />
        <JourneyModules modules={modules} />
        <JourneyCalculators calculators={calculators} />
        <IntelligenceSection
          pathname={`/journeys/${journey.slug}`}
          conceptId="goal-planning"
          difficulty="beginner"
          compact
          className="fi-intelligence-section--journey"
        />
        <JourneyMissionLink mission={mission} />
        <JourneyHealthScore healthScore={journey.healthScore} />
        {complete && <JourneyCompletion completion={journey.completion} />}
        <JourneyNextRecommendation nextJourney={journey.nextJourney} />
        <RecommendationPanel
          pathname={`/journeys/${journey.slug}`}
          journeySlug={journey.slug}
          conceptId="goal-planning"
          sourceType="journey"
          className="fi-rec-panel--journey"
          compact
        />
      </main>

      <p className="fje-disclaimer">{JOURNEY_ENGINE_DISCLAIMER}</p>
      <Footer />
    </div>
  );
}

export default FinancialJourneyPage;
