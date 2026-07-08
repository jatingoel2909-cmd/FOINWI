import { useMemo, useState } from "react";
import { HEALTH_SCORE_CATEGORIES, HEALTH_SCORE_QUESTIONS } from "../../data/healthScoreQuestions";
import { isQuestionAnswered } from "../../utils/healthScoreEngine";

function HealthScoreQuestionnaire({ answers, onChange, onComplete }) {
  const [step, setStep] = useState(0);
  const total = HEALTH_SCORE_QUESTIONS.length;
  const question = HEALTH_SCORE_QUESTIONS[step];
  const categoryLabel =
    HEALTH_SCORE_CATEGORIES.find((item) => item.id === question.category)?.label ??
    question.category;
  const progress = ((step + 1) / total) * 100;

  const answeredCount = useMemo(
    () =>
      HEALTH_SCORE_QUESTIONS.filter((item) =>
        isQuestionAnswered(item, answers[item.id]),
      ).length,
    [answers],
  );

  const currentAnswer = answers[question.id];
  const canProceed = isQuestionAnswered(question, currentAnswer);
  const isLast = step === total - 1;

  const handleNext = () => {
    if (!canProceed) return;
    if (isLast) {
      onComplete();
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="fhs-questionnaire">
      <div className="fhs-questionnaire__progress-wrap">
        <div className="fhs-questionnaire__progress-meta">
          <span>
            Question {step + 1} of {total}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="fhs-questionnaire__progress-bar" aria-hidden="true">
          <div
            className="fhs-questionnaire__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <article className="fhs-question-card">
        <p className="fhs-question-card__category">{categoryLabel}</p>
        <h2>{question.title}</h2>
        <p className="fhs-question-card__helper">{question.helper}</p>

        {question.type === "radio" && (
          <fieldset className="fhs-options">
            <legend className="sr-only">{question.title}</legend>
            {question.options.map((option) => (
              <label
                key={option.value}
                className={`fhs-option${currentAnswer === option.value ? " fhs-option--selected" : ""}`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={currentAnswer === option.value}
                  onChange={() => onChange(question.id, option.value)}
                />
                <span className="fhs-option__indicator" aria-hidden="true" />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        )}

        {question.type === "slider" && (
          <div className="fhs-slider-block">
            <div className="fhs-slider-block__value">
              <span>{currentAnswer ?? question.defaultValue}</span>
              <span>{question.unit}</span>
            </div>
            <input
              className="fhs-slider"
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={currentAnswer ?? question.defaultValue}
              onChange={(event) => onChange(question.id, Number(event.target.value))}
              aria-label={question.title}
            />
            <div className="fhs-slider-block__range">
              <span>{question.min}{question.unit}</span>
              <span>{question.max}{question.unit}</span>
            </div>
          </div>
        )}
      </article>

      <div className="fhs-questionnaire__actions">
        <button
          type="button"
          className="fhs-btn fhs-btn--ghost"
          onClick={handleBack}
          disabled={step === 0}
        >
          Back
        </button>
        <button
          type="button"
          className="fhs-btn fhs-btn--primary"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {isLast ? "See My Score →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

export default HealthScoreQuestionnaire;
