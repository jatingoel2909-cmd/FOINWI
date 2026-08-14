import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getFallbackOptions, getGuideFollowUps, getGuideTopicLabel, getGuideResponseForIntent, matchGuideQuery } from "./guideEngine";
import { getGuideResources } from "./guideResources";
import "./guide-trial.css";

const STARTER_PROMPTS = [
  "How much EMI can I afford?",
  "I can invest ₹10,000 every month.",
  "What is CAGR?",
  "I want to plan my retirement.",
  "My salary comes but nothing remains.",
  "Which calculator should I use?",
];

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "guide",
  response: {
    responseType: "SUPPORTED",
    confidence: "welcome",
    intent: {
      topic: "Welcome",
      simpleAnswer: "Welcome to FOINWI Guide — Trial. Ask about money in your own words, and I’ll offer a reviewed educational explanation with FOINWI tools to explore.",
      deeperExplanation: "This is an experimental local experience. It does not use external AI, collect financial details, or save this conversation after you refresh the page.",
      resourceIds: ["calculators", "learn"],
      actions: ["Explore"],
    },
  },
};

function GuideAvatar() {
  return <span className="guide-trial__avatar" aria-hidden="true">FG</span>;
}

function ResourceCards({ resourceIds }) {
  const resources = getGuideResources(resourceIds);
  if (!resources.length) return null;

  return (
    <div className="guide-trial__resources" aria-label="Relevant FOINWI resources">
      {resources.map((resource, index) => (
        <Link key={resource.path} to={resource.path} className="guide-trial__resource">
          <span className="guide-trial__resource-type">{index === 0 ? "SUGGESTED STARTING POINT" : resource.type}</span>
          <strong>{resource.title}</strong>
          <span>{resource.description}</span>
          <span className="guide-trial__resource-arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}

function NextActionBar({ actions = [], resourceIds, onAskMore }) {
  const resources = getGuideResources(resourceIds);
  const actionType = { "Calculate it": "CALCULATE", "Understand it": "LEARN", "Plan it": "PLAN", Check: "CHECK", Explore: "EXPLORE" };

  return (
    <div className="guide-trial__next-actions">
      <p>What would you like to do next?</p>
      <div>
        {actions.map((action) => {
          const resource = resources.find((item) => item.type === actionType[action]);
          return resource ? <Link key={action} to={resource.path}>{action}</Link> : null;
        })}
        <button type="button" onClick={onAskMore}>Ask something else</button>
      </div>
    </div>
  );
}

function GuideResponse({ response, onFollowUp, onAskMore, focusRef }) {
  const [expanded, setExpanded] = useState(false);
  const intent = response.intent;
  const isFallback = response.responseType === "FALLBACK";
  const isClarification = response.responseType === "CLARIFY";
  const followUps = isFallback ? getFallbackOptions() : getGuideFollowUps(intent);

  if (isClarification) {
    return (
      <article className="guide-trial__message guide-trial__message--guide" ref={focusRef} tabIndex="-1">
        <GuideAvatar />
        <div className="guide-trial__bubble">
          <span className="guide-trial__indicator">{getGuideTopicLabel(response.family)}</span>
          <p>I can help you understand {getGuideTopicLabel(response.family).toLowerCase()}. What are you trying to work out?</p>
          <div className="guide-trial__follow-ups">
            <div className="guide-trial__chips">
              {response.clarificationOptions.map((option) => (
                <button key={option.id} type="button" onClick={() => onFollowUp(option.id)}>{option.label}</button>
              ))}
            </div>
          </div>
          <NextActionBar actions={["Explore"]} resourceIds={[]} onAskMore={onAskMore} />
        </div>
      </article>
    );
  }

  if (isFallback) {
    return (
      <article className="guide-trial__message guide-trial__message--guide" ref={focusRef} tabIndex="-1">
        <GuideAvatar />
        <div className="guide-trial__bubble">
          <span className="guide-trial__indicator">Educational guide</span>
          <p>I&apos;m not confident I understood that yet.</p>
          <p>You can ask me about loans, investing, goals, retirement, deposits, tax basics, or financial health.</p>
          <div className="guide-trial__chips">
            {followUps.map((option) => <button key={option.intentId} type="button" onClick={() => onFollowUp(option.intentId)}>{option.label}</button>)}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="guide-trial__message guide-trial__message--guide" ref={focusRef} tabIndex="-1">
      <GuideAvatar />
      <div className="guide-trial__bubble">
        <span className="guide-trial__indicator">{response.responseType === "SAFETY" ? "Educational boundary" : getGuideTopicLabel(intent.topic)}</span>
        <p>{intent.simpleAnswer}</p>
        <button type="button" className="guide-trial__explain" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
          {expanded ? "Show less" : "Explain more"}
        </button>
        {expanded ? <p className="guide-trial__deeper">{intent.deeperExplanation}</p> : null}
        <ResourceCards resourceIds={intent.resourceIds} />
        {followUps.length ? (
          <div className="guide-trial__follow-ups">
            <p>What would you like to understand first?</p>
            <div className="guide-trial__chips">
              {followUps.map((option) => <button key={option.id} type="button" onClick={() => onFollowUp(option.id)}>{option.label}</button>)}
            </div>
          </div>
        ) : null}
        <NextActionBar actions={intent.actions} resourceIds={intent.resourceIds} onAskMore={onAskMore} />
      </div>
    </article>
  );
}

function GuideTrialPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [lastResult, setLastResult] = useState(INITIAL_MESSAGE.response);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef(null);
  const responseRef = useRef(null);

  useEffect(() => {
    if (messages.length > 1 && responseRef.current) {
      responseRef.current.focus({ preventScroll: true });
      responseRef.current.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  }, [messages]);

  function addResponse(response, userText = null) {
    const nextMessages = userText ? [...messages, { id: `user-${Date.now()}`, role: "user", text: userText }] : [...messages];
    const guideMessage = { id: `guide-${Date.now()}`, role: "guide", response };
    setMessages([...nextMessages, guideMessage]);
    setLastResult(response);
    setAnnouncement(
      response.responseType === "CLARIFY"
        ? "Guide recognised a topic and has clarification choices."
        : response.responseType === "FALLBACK"
          ? "Guide needs a little more detail."
          : "Guide response added.",
    );
  }

  function submitQuery(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    addResponse(matchGuideQuery(trimmed), trimmed);
    setQuery("");
  }

  function chooseFollowUp(intentId) {
    const response = getGuideResponseForIntent(intentId);
    const intent = response.intent;
    addResponse(response, intent?.phrases?.[0] ?? "Choose this topic");
  }

  function startOver() {
    setMessages([INITIAL_MESSAGE]);
    setLastResult(INITIAL_MESSAGE.response);
    setQuery("");
    setAnnouncement("Guide Trial conversation reset.");
    inputRef.current?.focus();
  }

  return (
    <main className="guide-trial">
      <div className="guide-trial__shell">
        <header className="guide-trial__header">
          <div className="guide-trial__identity">
            <GuideAvatar />
            <div>
              <div className="guide-trial__title-row"><h1>FOINWI Guide</h1><span>TRIAL</span></div>
              <p>Ask about money in your own words.</p>
            </div>
          </div>
          <button type="button" className="guide-trial__reset" onClick={startOver}>Start over</button>
        </header>

        <section className="guide-trial__intro" aria-label="Trial boundaries">
          <p>Experimental educational guidance powered by FOINWI&apos;s local structured intelligence.</p>
          <span>No external AI is used in this trial.</span>
        </section>

        <p className="guide-trial__status" aria-live="polite" aria-atomic="true">{announcement}</p>
        <section className="guide-trial__conversation" aria-label="FOINWI Guide conversation">
          {messages.map((message, index) => message.role === "user" ? (
            <article key={message.id} className="guide-trial__message guide-trial__message--user"><div className="guide-trial__user-bubble">{message.text}</div></article>
          ) : (
            <GuideResponse key={message.id} response={message.response} onFollowUp={chooseFollowUp} onAskMore={() => inputRef.current?.focus()} focusRef={index === messages.length - 1 ? responseRef : null} />
          ))}
        </section>

        <section className="guide-trial__composer-section" aria-label="Ask FOINWI Guide">
          <form className="guide-trial__composer" onSubmit={submitQuery}>
            <label htmlFor="guide-trial-input">Ask FOINWI Guide</label>
            <div>
              <textarea id="guide-trial-input" ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) submitQuery(event); }} placeholder="Ask a money question in your own words…" rows="2" />
              <button type="submit">Ask</button>
            </div>
          </form>
          <div className="guide-trial__starters" aria-label="Starter prompts">
            {STARTER_PROMPTS.map((prompt) => <button key={prompt} type="button" onClick={() => { setQuery(prompt); inputRef.current?.focus(); }}>{prompt}</button>)}
          </div>
          <p className="guide-trial__privacy">Your Guide Trial conversation stays only in this page and is not saved after refresh.</p>
        </section>

        <details className="guide-trial__debug">
          <summary>Trial details</summary>
          <dl>
            <div><dt>Detected topic</dt><dd>{lastResult.intent?.topic ?? (lastResult.family ? getGuideTopicLabel(lastResult.family) : "No confident match")}</dd></div>
            <div><dt>Detected intent</dt><dd>{lastResult.intent?.id ?? "None"}</dd></div>
            <div><dt>Confidence</dt><dd>{lastResult.confidence}</dd></div>
            <div><dt>Response type</dt><dd>{lastResult.responseType}</dd></div>
          </dl>
        </details>
      </div>
    </main>
  );
}

export default GuideTrialPage;
