const STATS = [
  'Less selling time',
  'Slower deal cycles',
  'Lower rep productivity',
  'Higher rep frustration',
  'Increased turnover risk',
  'Weaker revenue execution',
]

export default function CostOfFriction() {
  return (
    <section id="cost-of-friction" className="section-padding bg-ink bg-grid-subtle bg-[size:48px_48px]">
      <div className="container-wide relative">
        <h2 className="text-section font-bold text-white text-center max-w-2xl mx-auto">
          When Sellers Struggle Internally, Revenue Suffers Externally
        </h2>
        <div className="mt-10 max-w-2xl mx-auto space-y-5 text-warm-400 text-lg leading-relaxed text-center">
          <p>
            Operational friction slows sellers down every day. It shows up as wasted selling time, slower deal cycles,
            lower quota attainment, avoidable turnover, and inconsistent execution across teams.
          </p>
          <p>
            Most organizations discover these problems too late—after productivity slips, top performers disengage,
            pipeline quality weakens, or revenue targets are missed.
          </p>
          <p>
            And while leadership works on systemic fixes, sellers still need help today. A delayed deal desk SLA,
            confusing handoff process, weak ROI story, or unclear stage expectation can affect the next opportunity on
            their calendar. SellerUnblocked helps the organization improve while giving sellers practical support immediately.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {STATS.map((label) => (
            <div
              key={label}
              className="rounded-xl bg-ink-light/80 border border-white/10 px-5 py-5 text-center"
            >
              <span className="text-sm font-medium text-warm-400">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-12 max-w-2xl mx-auto rounded-2xl border border-accent/30 bg-accent/10 px-6 py-5 text-center">
          <p className="text-sm font-semibold text-accent-light uppercase tracking-wide mb-2">The key insight</p>
          <p className="text-warm-400 leading-relaxed">
            Some friction requires leadership action. Some friction can be reduced immediately with the right playbook,
            template, checklist, or drill.
          </p>
        </div>
      </div>
    </section>
  )
}
