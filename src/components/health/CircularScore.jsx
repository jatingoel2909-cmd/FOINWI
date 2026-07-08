import { useEffect, useState } from "react";

function CircularScore({ score, label, size = 200 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const elapsed = now - start;
      const progressRatio = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progressRatio) ** 3;
      setAnimatedScore(Math.round(score * eased));
      if (progressRatio < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [score]);

  return (
    <div
      className="fhs-circular-score"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Financial health score ${score} out of 100`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="fhs-circular-score__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="fhs-circular-score__progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="fhs-circular-score__content">
        <span className="fhs-circular-score__value">{animatedScore}</span>
        <span className="fhs-circular-score__max">/ 100</span>
        {label && <span className="fhs-circular-score__label">{label}</span>}
      </div>
    </div>
  );
}

export default CircularScore;
