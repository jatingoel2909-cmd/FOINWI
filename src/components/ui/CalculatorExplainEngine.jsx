import { useState } from "react";
import { Link } from "react-router-dom";
import { EXPLAIN_DISCLAIMER } from "../../data/calculatorExplains";
import { resolveExplainLinks } from "../../utils/explainHelpers";

const SECTIONS = [
  { id: "why", title: "Why this result was generated", key: "whyGenerated", type: "text" },
  { id: "inputs", title: "Which inputs affected it most", key: "keyInputs", type: "list" },
  { id: "change", title: "What happens if inputs change", key: "ifInputsChange", type: "list" },
  { id: "mistakes", title: "Common beginner mistakes", key: "beginnerMistakes", type: "list" },
  { id: "calculators", title: "Related calculators", key: "relatedCalculators", type: "calculators" },
  { id: "lessons", title: "Related Learn Academy lessons", key: "relatedLessons", type: "lessons" },
  { id: "missions", title: "Related Financial Missions", key: "relatedMissions", type: "missions" },
];

function ExplainAccordionItem({ id, title, isOpen, onToggle, children }) {
  return (
    <div className={`calc-explain__accordion${isOpen ? " calc-explain__accordion--open" : ""}`}>
      <button
        type="button"
        className="calc-explain__accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={`calc-explain-panel-${id}`}
        id={`calc-explain-trigger-${id}`}
        onClick={onToggle}
      >
        <span>{title}</span>
        <span className="calc-explain__accordion-icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div
          className="calc-explain__accordion-panel"
          id={`calc-explain-panel-${id}`}
          role="region"
          aria-labelledby={`calc-explain-trigger-${id}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function CalculatorExplainEngine({ explain }) {
  const [expanded, setExpanded] = useState(false);
  const [openSection, setOpenSection] = useState("why");
  const links = resolveExplainLinks(explain);

  if (!explain) return null;

  function renderSectionContent(section) {
    if (section.type === "text") {
      return <p>{explain[section.key]}</p>;
    }

    if (section.type === "list") {
      const items = explain[section.key] ?? [];
      return (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }

    if (section.type === "calculators") {
      return (
        <div className="calc-explain__links">
          {links.calculators.map((calc) => (
            <Link key={calc.path} to={calc.path} className="calc-explain__link">
              {calc.icon} {calc.title} →
            </Link>
          ))}
        </div>
      );
    }

    if (section.type === "lessons") {
      return (
        <div className="calc-explain__links">
          {links.lessons.map((lesson) => (
            <Link key={lesson.slug} to={`/learn/${lesson.slug}`} className="calc-explain__link">
              {lesson.icon} {lesson.title} →
            </Link>
          ))}
        </div>
      );
    }

    if (section.type === "missions") {
      return (
        <div className="calc-explain__links">
          {links.missions.map((mission) => (
            <Link key={mission.slug} to={`/journeys/${mission.slug}`} className="calc-explain__link">
              {mission.icon} {mission.title} →
            </Link>
          ))}
        </div>
      );
    }

    return null;
  }

  return (
    <aside className="calc-explain" aria-label="Explain my result">
      <div className={`calc-explain__card${expanded ? " calc-explain__card--open" : ""}`}>
        <button
          type="button"
          className="calc-explain__header"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <div className="calc-explain__header-text">
            <span className="calc-explain__eyebrow">Educational guide</span>
            <h3>Explain My Result</h3>
            <p>Structured breakdown of how your inputs shaped this estimate — no AI, no advice.</p>
          </div>
          <span className="calc-explain__toggle" aria-hidden="true">
            {expanded ? "Hide" : "Expand"}
          </span>
        </button>

        {expanded && (
          <div className="calc-explain__body">
            <div className="calc-explain__accordions">
              {SECTIONS.map((section) => (
                <ExplainAccordionItem
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  isOpen={openSection === section.id}
                  onToggle={() =>
                    setOpenSection((prev) => (prev === section.id ? null : section.id))
                  }
                >
                  {renderSectionContent(section)}
                </ExplainAccordionItem>
              ))}
            </div>

            <p className="calc-explain__disclaimer">{EXPLAIN_DISCLAIMER}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default CalculatorExplainEngine;
