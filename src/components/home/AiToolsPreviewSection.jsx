import { Link } from "react-router-dom";

function AiToolsPreviewSection() {
  return (
    <section
      className="shrix-home-section shrix-home-section--alt shrix-ai-preview"
      id="ai-preview"
    >
      <p className="shrix-section-label">FOINWI Intelligence</p>

      <article className="shrix-ai-assistant-preview">
        <div className="shrix-ai-assistant-preview__header">
          <h2>Study a money question with live tools</h2>
        </div>

        <p className="shrix-ai-assistant-preview__subtitle">
          Calculators, lessons, journeys, and the Financial Health Score are available today.
          FOINWI does not provide a live AI assistant.
        </p>

        <p className="shrix-ai-assistant-preview__disclaimer">
          The Intelligence page is a fixed educational map. It does not chat, and it does not send a question to an AI model.
        </p>
      </article>

      <div className="shrix-home-section__action">
        <Link to="/ai-tools" className="shrix-view-all-btn">
          Explore FOINWI Intelligence →
        </Link>
      </div>
    </section>
  );
}

export default AiToolsPreviewSection;
