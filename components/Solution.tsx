import { CAPABILITIES } from '@/lib/landing/content'

export default function Solution() {
  return (
    <section id="solution" className="section-padding bg-cream">
      <div className="container-wide">
        <h2 className="text-section font-bold text-ink text-center max-w-3xl mx-auto">
          SellerUnblocked Is a Closed-Loop Revenue Organization Intelligence Platform
        </h2>
        <div className="mt-10 max-w-2xl mx-auto space-y-4 text-warm-600 text-lg text-center leading-relaxed">
          <p>
            SellerUnblocked helps leadership understand whether the sales organization is truly set up to win — and helps
            sellers act on the specific friction affecting their performance.
          </p>
          <p>
            The platform combines structured seller insight, operational diagnostics, advanced analytics, benchmarking,
            AI recommendations, and private IC enablement kits.
          </p>
        </div>
        <p className="mt-10 text-center font-semibold text-ink text-lg max-w-xl mx-auto">
          Not another survey tool. Not another LMS. A system for diagnosing the sales organization and helping sellers
          improve inside it.
        </p>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.title}
              className={`group rounded-2xl bg-paper border p-6 md:p-7 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                cap.featured
                  ? 'border-accent/40 bg-gradient-to-br from-white to-accent-soft/30 shadow-md ring-1 ring-accent/20'
                  : 'border-warm-400/20 hover:border-accent/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-bold text-sm group-hover:bg-accent/25 transition-colors">
                  {i + 1}
                </span>
                {'badge' in cap && cap.badge ? (
                  <span className="rounded-full bg-accent-dark px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-white">
                    {cap.badge}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 font-semibold text-ink">{cap.title}</h3>
              <p className="mt-2 text-sm text-warm-600 leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
