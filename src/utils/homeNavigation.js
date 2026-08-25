function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToSection(id) {
  const behavior = prefersReducedMotion() ? "auto" : "smooth";
  document.getElementById(id)?.scrollIntoView({ behavior });
}

export function navigateToHomeSection(navigate, pathname, id) {
  if (pathname === "/") {
    scrollToSection(id);
    return;
  }

  navigate(`/#${id}`);
}
