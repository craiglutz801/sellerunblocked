const SEES = [
  'Aggregated scores',
  'Segment-level trends',
  'Theme prevalence',
  'Benchmark gaps',
  'Anonymized evidence where appropriate',
  'System-level recommendations',
  'Minimum cohort-size reporting',
]

const DOES_NOT = [
  'Individual attributed responses',
  'Private seller support content',
  'Rep-by-rep AI rankings',
  'Private progress as a performance scorecard',
  'Verbatim comments tied to names',
  'Automated employment decisions',
]

const EVIDENCE = ['Prevalence', 'Trend', 'Segment', 'Supporting signals', 'Prior-cycle comparison', 'Confidence']

export default function TrustModel() {
  return (
    <section id="trust" className="landing-section bg-su-cream">
      <div className="landing-container">
        <div className="max-w-[46rem]">
          <h2 className="landing-h2 text-su-text">Built to find organizational friction — not surveil individual sellers.</h2>
          <p className="landing-body-lg mt-5 text-su-secondary">
            SellerUnblocked is most valuable when sellers trust the system enough to surface the friction leadership
            needs to hear.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <article className="landing-card p-6 sm:p-8">
            <h3 className="text-base font-semibold text-su-text">Leadership sees</h3>
            <ul className="mt-5 grid gap-3">
              {SEES.map((item) => (
                <li key={item} className="border-t border-su-text/10 pt-3 text-sm text-su-text">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="landing-card p-6 sm:p-8">
            <h3 className="text-base font-semibold text-su-text">Leadership does not see by default</h3>
            <ul className="mt-5 grid gap-3">
              {DOES_NOT.map((item) => (
                <li key={item} className="border-t border-su-text/10 pt-3 text-sm text-su-text">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <article className="mt-4 rounded-[28px] border border-su-text/10 bg-white p-6 sm:p-8">
          <p className="landing-eyebrow">Evidence before recommendation</p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-su-text">
            UnblockedAI should never ask leadership to trust a black box. Every important recommendation should point
            back to the evidence that produced it.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {EVIDENCE.map((item) => (
              <li key={item} className="rounded-full border border-su-text/10 bg-su-paper px-3 py-2 text-sm text-su-text">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}
