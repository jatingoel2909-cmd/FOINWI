import { useParams } from "react-router-dom";
import FinancialJourneyPage from "./FinancialJourneyPage";
import MissionJourneyPage from "./MissionJourneyPage";
import { getFinancialJourney, hasFinancialJourney } from "../utils/journeyEngineHelpers";

function JourneyPage() {
  const { slug } = useParams();

  if (hasFinancialJourney(slug)) {
    return <FinancialJourneyPage journey={getFinancialJourney(slug)} />;
  }

  return <MissionJourneyPage slug={slug} />;
}

export default JourneyPage;
