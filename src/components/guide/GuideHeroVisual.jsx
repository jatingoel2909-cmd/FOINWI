function GuideHeroVisual() {
  return (
    <div className="guide-hero__visual" aria-hidden="true">
      <svg
        className="guide-hero__graphic"
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="guide-path-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.25)" />
            <stop offset="100%" stopColor="rgba(166, 124, 0, 0.55)" />
          </linearGradient>
          <linearGradient id="guide-node-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff9f0" />
            <stop offset="100%" stopColor="#f3e8d8" />
          </linearGradient>
        </defs>

        <path
          d="M48 220 C 80 180, 120 190, 148 150 S 210 90, 268 48"
          stroke="url(#guide-path-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 8"
        />

        <circle cx="48" cy="220" r="22" fill="url(#guide-node-gradient)" stroke="rgba(212,175,55,0.45)" strokeWidth="2" />
        <circle cx="48" cy="220" r="8" fill="rgba(212,175,55,0.35)" />

        <circle cx="148" cy="150" r="26" fill="url(#guide-node-gradient)" stroke="rgba(212,175,55,0.55)" strokeWidth="2" />
        <circle cx="148" cy="150" r="10" fill="rgba(212,175,55,0.45)" />

        <circle cx="268" cy="48" r="30" fill="url(#guide-node-gradient)" stroke="rgba(166,124,0,0.65)" strokeWidth="2" />
        <circle cx="268" cy="48" r="12" fill="rgba(166,124,0,0.35)" />

        <rect x="72" y="72" width="88" height="56" rx="14" fill="rgba(255,252,247,0.92)" stroke="rgba(212,175,55,0.25)" strokeWidth="1.5" />
        <rect x="84" y="88" width="48" height="6" rx="3" fill="rgba(212,175,55,0.35)" />
        <rect x="84" y="102" width="64" height="4" rx="2" fill="rgba(92,79,66,0.12)" />

        <rect x="188" y="108" width="72" height="48" rx="12" fill="rgba(255,252,247,0.88)" stroke="rgba(212,175,55,0.2)" strokeWidth="1.5" />
        <path d="M204 132 L224 132 M214 122 L214 142" stroke="rgba(166,124,0,0.45)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default GuideHeroVisual;
