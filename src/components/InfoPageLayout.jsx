import "./InfoPageLayout.css";

function InfoPageLayout({
  label,
  title,
  subtitle,
  variant = "default",
  centered = false,
  children,
}) {
  return (
    <>
      <a className="shrix-skip-link" href="#main-content">Skip to main content</a>
      <main
        id="main-content"
        className={`shrix-info-page${variant === "alt" ? " shrix-info-page--alt" : ""}${
          centered ? " shrix-info-page--centered" : ""
        }`}
        aria-labelledby="info-page-title"
      >
        <p className="shrix-section-label">{label}</p>
        <h1 id="info-page-title">{title}</h1>
        {subtitle && <p className="shrix-info-page__subtitle">{subtitle}</p>}
        <div className="shrix-info-page__content">{children}</div>
      </main>
    </>
  );
}

export default InfoPageLayout;
