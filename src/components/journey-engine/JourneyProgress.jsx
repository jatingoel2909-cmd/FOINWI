function JourneyProgress({ progressSteps, checkedItems, onToggle, progressPercent }) {
  const completedCount = progressSteps.filter((step) => checkedItems[step.id]).length;

  return (
    <section className="fje-block fje-block--progress" id="journey-progress" aria-labelledby="fje-progress-title">
      <div className="fje-block__head">
        <h2 id="fje-progress-title">Journey Progress</h2>
        <span className="fje-progress__count">
          {completedCount}/{progressSteps.length} complete · {progressPercent}%
        </span>
      </div>

      <div className="fje-progress__bar" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
        <span className="fje-progress__fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <ul className="fje-progress__list">
        {progressSteps.map((step) => {
          const isChecked = Boolean(checkedItems[step.id]);
          return (
            <li key={step.id}>
              <button
                type="button"
                className={`fje-progress__item${isChecked ? " fje-progress__item--done" : ""}`}
                onClick={() => onToggle(step.id)}
                aria-pressed={isChecked}
              >
                <span className="fje-progress__box" aria-hidden="true">
                  {isChecked ? "✓" : ""}
                </span>
                <span>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default JourneyProgress;
