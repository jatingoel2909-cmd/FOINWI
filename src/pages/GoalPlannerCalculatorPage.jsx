import Navbar from "../components/Navbar";
import GoalPlannerCalculator from "../components/GoalPlannerCalculator";
import Footer from "../components/Footer";
import "../styles/global.css";

function GoalPlannerCalculatorPage() {
  return (
    <div className="shrix-app">
      <Navbar />
      <GoalPlannerCalculator />
      <Footer />
    </div>
  );
}

export default GoalPlannerCalculatorPage;
