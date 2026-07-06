import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToTopInstant() {
  try {
    window.scrollTo({ top: 0, behavior: "instant" });
  } catch {
    window.scrollTo(0, 0);
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTopInstant();
  }, [pathname]);

  return null;
}

export default ScrollToTop;
