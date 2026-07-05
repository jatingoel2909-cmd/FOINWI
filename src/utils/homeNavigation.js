export function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function navigateToHomeSection(navigate, pathname, id) {
  if (pathname === "/") {
    scrollToSection(id);
    return;
  }

  navigate(`/#${id}`);
}
