function JourneyHeroVisual() {
  return (
    <div className="fje-hero__visual" aria-hidden="true">
      <svg
        className="fje-hero__graphic"
        viewBox="0 0 360 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fje-arc-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0.2)" />
            <stop offset="100%" stopColor="rgba(166, 124, 0, 0.5)" />
          </linearGradient>
          <linearGradient id="fje-glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffaf5" />
            <stop offset="100%" stopColor="#efe2cf" />
          </linearGradient>
        </defs>

        <ellipse cx="180" cy="150" rx="130" ry="110" fill="rgba(212,175,55,0.06)" />
        <path
          d="M40 230 C 90 170, 150 200, 200 130 S 290 60, 320 40"
          stroke="url(#fje-arc-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <circle cx="40" cy="230" r="24" fill="url(#fje-glow-gradient)" stroke="rgba(212,175,55,0.5)" strokeWidth="2" />
        <circle cx="200" cy="130" r="30" fill="url(#fje-glow-gradient)" stroke="rgba(212,175,55,0.6)" strokeWidth="2" />
        <circle cx="320" cy="40" r="26" fill="url(#fje-glow-gradient)" stroke="rgba(166,124,0,0.65)" strokeWidth="2" />

        <rect x="108" y="88" width="96" height="64" rx="16" fill="rgba(255,252,247,0.95)" stroke="rgba(212,175,55,0.28)" strokeWidth="1.5" />
        <rect x="122" y="108" width="52" height="7" rx="3.5" fill="rgba(212,175,55,0.4)" />
        <rect x="122" y="124" width="68" height="5" rx="2.5" fill="rgba(92,79,66,0.12)" />
        <rect x="122" y="136" width="44" height="5" rx="2.5" fill="rgba(92,79,66,0.1)" />

        <path
          d="M248 178 L268 158 L288 178 L268 198 Z"
          fill="rgba(212,175,55,0.18)"
          stroke="rgba(212,175,55,0.45)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export default JourneyHeroVisual;
