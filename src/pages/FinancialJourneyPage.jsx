import { useEffect, useMemo, useState } from "react";
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

function FinancialJourneyPage({ journey }) {
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const stored = localStorage.getItem(getJourneyProgressKey(journey.slug));
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(getJourneyProgressKey(journey.slug), JSON.stringify(checkedItems));
  }, [checkedItems, journey.slug]);

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
        />
        <JourneyModules modules={modules} />
        <JourneyCalculators calculators={calculators} />
        <JourneyMissionLink mission={mission} />
        <JourneyHealthScore healthScore={journey.healthScore} />
        {complete && <JourneyCompletion completion={journey.completion} />}
        <JourneyNextRecommendation nextJourney={journey.nextJourney} />
      </main>

      <p className="fje-disclaimer">{JOURNEY_ENGINE_DISCLAIMER}</p>
      <Footer />
    </div>
  );
}

export default FinancialJourneyPage;
