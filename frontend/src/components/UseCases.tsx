export default function UseCases() {
  const cases = [
    {
      title: "Startup",
      choice: "Open Source",
      reason: "Low cost, rapid iteration, and full flexibility.",
      color: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Enterprise",
      choice: "Closed Source",
      reason: "Managed infrastructure, SLAs, and predictable latency.",
      color: "text-rose-400 bg-rose-500/10",
    },
    {
      title: "Healthcare",
      choice: "Open Source",
      reason: "Data privacy, compliance, and on-prem deployment.",
      color: "text-indigo-400 bg-indigo-500/10",
    },
    {
      title: "Research",
      choice: "Open Source",
      reason: "Full model control, transparency, and experimentation.",
      color: "text-sky-400 bg-sky-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cases.map((c, i) => (
        <div
          key={i}
          className="glass-card rounded-2xl p-6 transition hover:-translate-y-1 hover:bg-white/5"
        >
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              {c.title}
            </h3>

            <span
              className={`inline-block rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wide ${c.color}`}
            >
              {c.choice}
            </span>

            <p className="text-sm text-slate-400 leading-relaxed">
              {c.reason}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

