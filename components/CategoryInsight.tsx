const MEASURED = ['Pipeline', 'Win rates', 'Forecast', 'Quota', 'Deal velocity']

const HIDDEN = ['Friction', 'Tool overload', 'Misalignment', 'Enablement quality', 'Support effectiveness', 'Organizational health']

const ACTIVATES = [
  'System-level priorities',
  'Enablement gaps',
  'Seller-specific help',
  'Action tracking',
  'Improvement over time',
]

export default function CategoryInsight() {
  return (
    <section id="category-insight" className="section-padding bg-paper">
      <div className="container-wide">
        <h2 className="text-section font-bold text-ink text-center max-w-3xl mx-auto">
          Revenue Teams Measure Outcomes. Almost None Measure the Environment Producing Them.
        </h2>
        <div className="mt-12 max-w-2xl mx-auto space-y-6 text-warm-600 text-lg leading-relaxed text-center">
          <p>
            Revenue leaders track pipeline, forecast accuracy, win rates, quota attainment, and deal velocity.
          </p>
          <p>
            But those metrics only show the result. They do not show whether the sales organization itself is
            structurally helping sellers succeed—or quietly making success harder.
          </p>
          <p>
            Measuring the environment is only half the opportunity. The bigger opportunity is closing the loop—turning
            those signals into targeted action for leadership and practical help for the sellers living inside that
            environment every day.
          </p>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="rounded-2xl bg-cream p-8 md:p-9 border border-warm-400/20">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-warm-500 mb-6">
              Outcomes leaders track
            </h3>
            <ul className="space-y-3">
              {MEASURED.map((item) => (
                <li key={item} className="flex items-center gap-3 text-ink font-medium">
                  <span className="h-2 w-2 rounded-full bg-warm-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-accent/10 border border-accent/30 p-8 md:p-9">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-dark mb-6">
              Friction they usually miss
            </h3>
            <ul className="space-y-3">
              {HIDDEN.map((item) => (
                <li key={item} className="flex items-center gap-3 text-ink font-medium">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-ink text-white p-8 md:p-9 border border-ink-light">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-light mb-6">
              Actions SellerUnblocked activates
            </h3>
            <ul className="space-y-3">
              {ACTIVATES.map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium text-warm-400">
                  <span className="h-2 w-2 rounded-full bg-accent-light" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
