/**
 * FOINWI Recommendation Panel — reusable next-steps experience.
 * Uses getRecommendations() only. No hardcoded recommendations.
 */

import { useMemo } from "react";
import { getRecommendations } from "../../intelligence/recommendation/recommendationEngine.js";
import RecommendationGroup from "./RecommendationGroup";
import "./recommendation-ui.css";

const GROUP_DEFS = [
  {
    key: "learning",
    title: "Learning",
    types: new Set(["nextLesson", "continueLearning", "relatedConcepts"]),
  },
  {
    key: "calculator",
    title: "Calculator",
    types: new Set(["nextCalculator"]),
  },
  {
    key: "journey",
    title: "Journey",
    types: new Set(["nextJourney", "nextMission"]),
  },
  {
    key: "health",
    title: "Health",
    types: new Set(["nextHealthAction"]),
  },
  {
    key: "insight",
    title: "Insight",
    types: new Set(["dailyInsight"]),
  },
];

const MAX_PER_GROUP = 3;

function collectItems(result) {
  if (!result) return [];
  return [
    ...(result.primary ?? []),
    ...(result.secondary ?? []),
    ...(result.learning ?? []),
    ...(result.tools ?? []),
    ...(result.journeys ?? []),
    ...(result.health ?? []),
    ...(result.insights ?? []),
  ];
}

function buildGroups(result, pathname, excludePaths = [], excludeTypes = []) {
  const excludedPathSet = new Set(excludePaths.filter(Boolean));
  const excludedTypeSet = new Set(excludeTypes.filter(Boolean));
  const seen = new Set();
  const items = collectItems(result).filter((item) => {
    if (!item?.id || !item.path) return false;
    if (pathname && item.path === pathname) return false;
    if (excludedPathSet.has(item.path)) return false;
    if (excludedTypeSet.has(item.type)) return false;
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return GROUP_DEFS.map((group) => ({
    key: group.key,
    title: group.title,
    items: items.filter((item) => group.types.has(item.type)).slice(0, MAX_PER_GROUP),
  })).filter((group) => group.items.length > 0);
}

function RecommendationPanel({
  pathname,
  calculatorPath,
  lessonSlug,
  journeySlug,
  missionSlug,
  healthTopic,
  conceptId,
  difficulty,
  sourceType,
  className = "",
  compact = false,
  excludePaths = [],
  excludeTypes = [],
}) {
  const result = useMemo(
    () =>
      getRecommendations({
        calculatorPath,
        lessonSlug,
        journeySlug,
        missionSlug,
        healthTopic,
        conceptId,
        difficulty,
        sourceType,
      }),
    [
      calculatorPath,
      lessonSlug,
      journeySlug,
      missionSlug,
      healthTopic,
      conceptId,
      difficulty,
      sourceType,
    ],
  );

  const groups = useMemo(
    () => buildGroups(result, pathname ?? calculatorPath, excludePaths, excludeTypes),
    [result, pathname, calculatorPath, excludePaths, excludeTypes],
  );

  if (!groups.length) return null;

  return (
    <section
      className={`fi-rec-panel${compact ? " fi-rec-panel--compact" : ""}${className ? ` ${className}` : ""}`}
      aria-labelledby="fi-rec-panel-title"
    >
      <div className="fi-rec-panel__inner">
        <header className="fi-rec-panel__header">
          <p className="shrix-section-label">Next Steps</p>
          <h2 id="fi-rec-panel-title">Continue Your Financial Journey</h2>
          <p className="fi-rec-panel__subtitle">
            Based on what you&apos;re exploring, here are the best next steps.
          </p>
        </header>

        <div className="fi-rec-panel__groups">
          {groups.map((group) => (
            <RecommendationGroup key={group.key} title={group.title} items={group.items} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecommendationPanel;
