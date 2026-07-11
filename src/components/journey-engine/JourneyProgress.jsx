function JourneyProgress({ progressSteps, checkedItems, progressPercent }) {
  const completedModules = progressSteps.filter((step) => checkedItems[step.id]);
  const remaining = progressSteps.filter((step) => !checkedItems[step.id]);
  const currentModule = remaining[0] ?? null;
  const nextModule = remaining[1] ?? null;

  return (
    <section
      className="fje-block fje-block--progress"
      id="journey-progress"
      aria-labelledby="fje-progress-title"
    >
      <div className="fje-progress-panel">
        <div className="fje-progress-panel__summary">
          <div className="fje-block__head fje-block__head--inline">
            <h2 id="fje-progress-title">Journey Progress</h2>
            <span className="fje-progress__percent">{progressPercent}%</span>
          </div>

          <div
            className="fje-progress__bar"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Journey ${progressPercent}% complete`}
          >
            <span className="fje-progress__fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <p className="fje-progress__meta">
            {completedModules.length} of {progressSteps.length} milestones completed
          </p>
        </div>

        <div className="fje-progress-panel__status">
          <article className="fje-progress-status fje-progress-status--current">
            <p className="fje-progress-status__label">Current module</p>
            <h3>{currentModule?.label ?? "Journey complete"}</h3>
          </article>

          <article className="fje-progress-status fje-progress-status--next">
            <p className="fje-progress-status__label">Next module</p>
            <h3>{nextModule?.label ?? "You are on the final stretch"}</h3>
          </article>
        </div>

        <div className="fje-progress-panel__completed">
          <p className="fje-progress-status__label">Completed modules</p>
          {completedModules.length > 0 ? (
            <ul className="fje-progress-completed">
              {completedModules.map((step) => (
                <li key={step.id}>{step.label}</li>
              ))}
            </ul>
          ) : (
            <p className="fje-progress-empty">Complete milestones as you move through the journey.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default JourneyProgress;
