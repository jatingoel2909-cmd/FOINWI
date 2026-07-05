function TrustSection() {
  const data = [
    ["Top 20", "Financial Tools"],
    ["100%", "Free to Use"],
    ["Instant", "Results"],
    ["India", "Focused"],
  ];

  return (
    <section className="shrix-trust">
      {data.map(([value, label]) => (
        <div className="shrix-trust-card" key={label}>
          <h3>{value}</h3>
          <p>{label}</p>
        </div>
      ))}
    </section>
  );
}

export default TrustSection;