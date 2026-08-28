const BUSINESS = [
  'Identify operational barriers earlier',
  'Increase seller productivity',
  'Reduce avoidable attrition risk',
  'Improve sales execution consistency',
  'Make better operations and enablement decisions',
  'Track improvement over time',
]

const FIELD = [
  'Get targeted help based on actual friction',
  'Reduce time wasted searching for resources',
  'Build confidence in weak sales stages',
  'Turn feedback into a useful development path',
  'Access practical playbooks, templates, and drills',
  'Choose what to share with managers',
]

export default function Benefits() {
  return (
    <section id="outcomes" className="section-padding bg-cream">
      <div className="container-wide">
        <h2 className="text-section font-bold text-ink text-center max-w-3xl mx-auto">
          A Better Way to Improve the Sales Organization and the Seller Experience
        </h2>
        <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-warm-500 mb-6">For the business</h3>
            <ul className="space-y-4">
              {BUSINESS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-white" aria-hidden>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-ink font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-dark mb-6">For the field</h3>
            <ul className="space-y-4">
              {FIELD.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white" aria-hidden>
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-ink font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-14 text-warm-600 text-lg text-center font-medium max-w-2xl mx-auto leading-relaxed">
          When the seller experience improves, performance improves with it. When feedback turns into help, sellers are
          more likely to trust the system.
        </p>
      </div>
    </section>
  )
}
