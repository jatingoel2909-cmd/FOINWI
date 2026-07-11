function JourneyCompletion({ completion }) {
  return (
    <section className="fje-completion" aria-labelledby="fje-completion-title">
      <p className="fje-completion__eyebrow">{completion.celebration}</p>
      <h2 id="fje-completion-title">{completion.title}</h2>
      <p>{completion.description}</p>
    </section>
  );
}

export default JourneyCompletion;
