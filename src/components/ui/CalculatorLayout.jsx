import CalculatorExplainEngine from "./CalculatorExplainEngine";
import CalculatorResultSupport from "./CalculatorResultSupport";
import CalcSectionAccordion from "./CalcSectionAccordion";
import ContinueJourneyCard from "./ContinueJourneyCard";
import DailyInsightCard from "../intelligence/DailyInsightCard";
import RecommendationPanel from "../intelligence/RecommendationPanel";
import { getCalculatorExplain } from "../../data/calculatorExplains";
import { getCalculatorInsights } from "../../data/calculatorInsights";
import { CALCULATOR_CONCEPT_MAP } from "../../intelligence/recommendation/recommendationRules.js";
import { getConceptById } from "../../intelligence/knowledge/financialConcepts.js";
import { getPrimaryJourneyForCalculator } from "../../utils/journeyEngineHelpers";
import "./calculator-ui.css";

const SIMPLIFIED_MODEL_NOTICE =
  "This estimate is for educational purposes and is based on simplified assumptions. Actual results may vary depending on individual circumstances.";

function CalculatorLayout({
  label,
  title,
  description,
  showHeader = true,
  variant = "default",
  className = "",
  calculatorId,
  form,
  results,
  formula,
  extension = null,
  simplifiedModelNotice = false,
  collapseResultSupport = false,
}) {
  const insights = calculatorId ? getCalculatorInsights(calculatorId) : null;
  const explain = calculatorId ? getCalculatorExplain(calculatorId) : null;
  const conceptId = calculatorId ? CALCULATOR_CONCEPT_MAP[calculatorId] ?? null : null;
  const concept = conceptId ? getConceptById(conceptId) : null;
  const difficulty = concept?.difficulty ?? undefined;
  const continueJourney = calculatorId
    ? getPrimaryJourneyForCalculator(calculatorId)
    : null;
  const excludeRecommendationPaths = continueJourney
    ? [`/journeys/${continueJourney.slug}`]
    : [];

  const resultSupport = insights ? (
    <CalculatorResultSupport {...insights} />
  ) : (
    <p className="calc-layout__disclaimer">
      Results are illustrative estimates based on your inputs and assumptions. For educational
      purposes only. Not financial, tax, investment, or loan advice. Consult qualified
      professionals before making financial decisions.
    </p>
  );

  return (
    <section
      className={`calc-layout calc-layout--${variant}${className ? ` ${className}` : ""}`}
    >
      {showHeader && (
        <div className="calc-layout__header">
          <p className="shrix-section-label">{label}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      )}

      <div className="calc-layout__body">
        <div className="calc-layout__form">{form}</div>
        <div className="calc-layout__results">
          {results}
          {simplifiedModelNotice ? (
            <p className="calc-simplified-notice">{SIMPLIFIED_MODEL_NOTICE}</p>
          ) : null}
        </div>
        {formula}
      </div>

      {extension}

      {explain ? <CalculatorExplainEngine explain={explain} /> : null}

      {collapseResultSupport && insights ? (
        <CalcSectionAccordion
          id="calc-formula-support"
          className="calc-section-accordion--support"
          title="How was this calculated?"
          description="Review the formula used, what each variable means, and how to read this estimate."
        >
          {resultSupport}
        </CalcSectionAccordion>
      ) : (
        resultSupport
      )}

      {calculatorId ? (
        <div className="calc-daily-insight">
          <DailyInsightCard
            pathname={calculatorId}
            conceptId={conceptId}
            difficulty={difficulty}
            compact
          />
        </div>
      ) : null}

      {continueJourney ? (
        <ContinueJourneyCard calculatorId={calculatorId} journey={continueJourney} />
      ) : null}

      {calculatorId ? (
        <RecommendationPanel
          calculatorPath={calculatorId}
          pathname={calculatorId}
          conceptId={conceptId}
          difficulty={difficulty}
          sourceType="calculator"
          className="fi-rec-panel--calc"
          compact
          excludePaths={excludeRecommendationPaths}
          excludeTypes={["dailyInsight"]}
        />
      ) : null}
    </section>
  );
}

export default CalculatorLayout;
