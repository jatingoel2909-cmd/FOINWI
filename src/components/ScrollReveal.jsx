import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const REVEAL_SELECTORS = [
  ".shrix-home-section",
  ".shrix-home-card",
  ".shrix-journey-card",
  ".shrix-card",
  ".calculator-card",
  ".shrix-info-section",
  ".shrix-info-card",
  ".shrix-trust-card",
  ".shrix-dashboard",
  ".shrix-ai-assistant-preview",
  ".shrix-ai-preview-card",
  ".shrix-mission-calc-card",
  ".shrix-mission-next",
  ".la-path-card",
  ".la-continue",
  ".la-timeline__card",
  ".la-tools-panel",
  ".fhs-intro-card",
  ".fhs-question-card",
  ".fhs-score-card",
  ".fhs-panel",
  ".fhs-suggest-card",
  ".calc-result-support__card",
  ".calc-result-support",
  ".guide-explore-card",
  ".guide-learning-card",
  ".guide-tool-card",
  ".guide-habit-card",
  ".guide-daily-insight",
  ".guide-timeline",
  ".guide-hero__visual",
  ".guide-hero__content",
].join(",");

function ScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const elements = document.querySelectorAll(REVEAL_SELECTORS);
    elements.forEach((element, index) => {
      element.classList.remove("fw-scroll-reveal--visible");
      element.classList.add("fw-scroll-reveal");
      element.style.setProperty("--fw-reveal-delay", `${Math.min(index % 6, 5) * 60}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fw-scroll-reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

export default ScrollReveal;
