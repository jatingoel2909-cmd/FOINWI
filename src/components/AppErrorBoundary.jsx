import { Component } from "react";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="shrix-info-page" aria-labelledby="app-error-title">
          <p className="shrix-section-label">FOINWI</p>
          <h1 id="app-error-title">Something did not load as expected</h1>
          <p className="shrix-info-page__subtitle">
            Please try reloading the page. You can also return to the FOINWI home page.
          </p>
          <div className="shrix-info-page__content">
            <section className="shrix-info-card shrix-info-card--wide">
              <button type="button" className="fje-btn fje-btn--primary" onClick={() => window.location.reload()}>
                Reload page
              </button>
              <a className="fje-btn" href="/">Return home</a>
            </section>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
