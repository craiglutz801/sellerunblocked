/** Stylized product mock — leadership view + seller kit branching from diagnostic spine */
export default function HeroDualMock({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden>
      <div className="absolute inset-0 rounded-3xl bg-accent/10 blur-3xl opacity-60" />
      <div className="relative rounded-2xl border border-white/10 bg-ink-light/90 backdrop-blur-sm p-5 sm:p-6 shadow-2xl">
        <div className="flex justify-center mb-5">
          <div className="rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-xs font-semibold text-accent-light">
            SellerUnblocked Diagnostic Spine
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-[0.625rem] font-bold uppercase tracking-wider text-warm-400">Leadership view</p>
            <p className="mt-3 text-2xl font-bold text-white tabular-nums">72</p>
            <p className="text-xs text-warm-400">Org Health Score</p>
            <ul className="mt-4 space-y-2 text-xs text-warm-400">
              <li className="flex justify-between gap-2">
                <span>Top friction</span>
                <span className="text-white font-medium">Deal Support</span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Recommended</span>
                <span className="text-accent-light font-medium">Tighten SLA</span>
              </li>
              <li className="flex justify-between gap-2">
                <span>Benchmark gap</span>
                <span className="text-amber-300/90 font-medium">−9 pts</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/20 to-white/5 p-4 ring-1 ring-accent/20">
            <p className="text-[0.625rem] font-bold uppercase tracking-wider text-accent-light">Your enablement kit</p>
            <p className="mt-1 text-[0.625rem] text-warm-400">Private to you</p>
            <p className="mt-3 text-xs font-semibold text-white">Focus: Pricing Confidence</p>
            <ul className="mt-3 space-y-1.5">
              {['CFO ROI Template', 'Negotiation Drill', 'Deal Desk Playbook'].map((m) => (
                <li key={m} className="flex items-center gap-2 text-[0.6875rem] text-warm-400">
                  <span className="h-1 w-1 rounded-full bg-accent shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.625rem] text-accent-light/80">Continue learning →</p>
          </div>
        </div>
        <svg className="absolute left-1/2 top-[4.5rem] -translate-x-1/2 w-24 h-8 text-accent/30 hidden sm:block" viewBox="0 0 96 32">
          <path d="M48 0 V12 M20 12 H76 M20 12 V24 M76 12 V24" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        <div className="absolute left-1/2 top-[3.75rem] -translate-x-1/2 hidden sm:block group">
          <span
            className="inline-flex rounded-full border border-accent/30 bg-ink/90 px-2.5 py-0.5 text-[0.625rem] font-medium text-accent-light/90 cursor-default"
            title="Turns seller signals into leadership priorities and private seller guidance."
          >
            AI action layer
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-52 -translate-x-1/2 rounded-lg border border-white/10 bg-ink px-3 py-2 text-[0.625rem] text-warm-300 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          >
            Turns seller signals into leadership priorities and private seller guidance.
          </span>
        </div>
      </div>
    </div>
  )
}
