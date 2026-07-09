export function isNavLinkActive(pathname, href) {
  switch (href) {
    case "/":
      return pathname === "/";
    case "/calculators":
      return (
        pathname === "/calculators" ||
        pathname === "/goal-planner" ||
        pathname.endsWith("-calculator")
      );
    case "/financial-health-score":
      return pathname === "/financial-health-score";
    case "/learn":
      return pathname.startsWith("/learn");
    case "/ai-tools":
      return pathname === "/ai-tools";
    case "/about":
      return pathname === "/about";
    default:
      return false;
  }
}

export function getNavLinkClass(pathname, href) {
  return isNavLinkActive(pathname, href) ? "shrix-nav-link--active" : undefined;
}
