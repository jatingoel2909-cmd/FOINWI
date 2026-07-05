import "./InfoPageLayout.css";

function InfoPageLayout({
  label,
  title,
  subtitle,
  variant = "default",
  children,
}) {
  return (
    <section
      className={`shrix-info-page${variant === "alt" ? " shrix-info-page--alt" : ""}`}
    >
      <p className="shrix-section-label">{label}</p>
      <h1>{title}</h1>
      {subtitle && <p className="shrix-info-page__subtitle">{subtitle}</p>}
      <div className="shrix-info-page__content">{children}</div>
    </section>
  );
}

export default InfoPageLayout;
