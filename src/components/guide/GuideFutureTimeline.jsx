import { GUIDE_FUTURE_STAGES } from "../../data/foinwiGuide";

function GuideFutureTimeline() {
  return (
    <div className="guide-timeline" aria-label="The future of FOINWI Guide">
      <ol className="guide-timeline__list">
        {GUIDE_FUTURE_STAGES.map((stage, index) => (
          <li
            key={stage.label}
            className={`guide-timeline__item${stage.isCurrent ? " guide-timeline__item--current" : ""}`}
          >
            <div className="guide-timeline__track" aria-hidden="true">
              <span className="guide-timeline__node" />
              {index < GUIDE_FUTURE_STAGES.length - 1 && (
                <span className="guide-timeline__connector" />
              )}
            </div>
            <div className="guide-timeline__label">
              <span>{stage.label}</span>
              {index < GUIDE_FUTURE_STAGES.length - 1 && (
                <span className="guide-timeline__arrow" aria-hidden="true">
                  ↓
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GuideFutureTimeline;
