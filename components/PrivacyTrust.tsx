import SectionEyebrow from '@/components/SectionEyebrow'
import { AI_GOVERNANCE_CHIPS } from '@/lib/landing/agentic'

const LEADERSHIP_SEES = [
  'Aggregated scores',
  'Segment-level trends',
  'Theme prevalence',
  'Benchmark gaps',
  'System-level recommendations',
  'Minimum cohort-size reporting',
]

const LEADERSHIP_NOT = [
  'Individual attributed responses',
  'Private kit contents by seller',
  'Personal progress as a manager scorecard',
  'Verbatim quotes tied to names',
  'Rep-by-rep coaching assignments',
]

const SELLERS_SEE = [
  'Their own snapshot',
  'Their own focus areas',
  'Their own recommended modules',
  'Their own open-text reflection',
  'Optional manager-share prompt',
]

export default function PrivacyTrust() {
  return (
    <section id="privacy" className="section-padding bg-paper">
      <div className="container-wide">
        <SectionEyebrow>Privacy & trust</SectionEyebrow>
        <h2 className="text-section font-bold text-ink text-center max-w-2xl mx-auto">
          Private for Sellers. Aggregated for Leadership.
        </h2>
        <p className="mt-6 text-lg text-warm-600 text-center max-w-2xl mx-auto">
          SellerUnblocked is designed to help sellers without turning feedback into individual surveillance.
        </p>

        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-warm-400/25 bg-cream/40 p-8">
            <h3 className="text-lg font-semibold text-ink">Leadership sees</h3>
            <ul className="mt-5 space-y-2.5">
              {LEADERSHIP_SEES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-warm-600">
                  <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <h4 className="mt-8 text-sm font-semibold text-warm-500 uppercase tracking-wide">Does not see</h4>
            <ul className="mt-4 space-y-2.5">
              {LEADERSHIP_NOT.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-warm-500">
                  <span className="text-warm-400 font-bold mt-0.5">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent-soft/30 to-paper p-8">
            <h3 className="text-lg font-semibold text-ink">Sellers see</h3>
            <ul className="mt-5 space-y-2.5">
              {SELLERS_SEE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink">
                  <span className="text-accent-dark font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-xl bg-ink px-5 py-4">
              <p className="text-sm font-semibold text-accent-light">
                Leadership gets patterns. Sellers get personal help.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 max-w-3xl mx-auto rounded-2xl border border-warm-400/25 bg-cream/40 p-8">
          <h3 className="text-lg font-semibold text-ink text-center">AI remains inside the trust model.</h3>
          <p className="mt-4 text-sm text-warm-600 text-center leading-relaxed">
            SellerUnblocked&apos;s AI layer uses approved company knowledge and the seller&apos;s own private context to
            provide support. It does not expose individual feedback to leadership, create rep rankings, or make
            employment decisions.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {AI_GOVERNANCE_CHIPS.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-accent/25 bg-accent-soft/40 px-3 py-1.5 text-xs font-medium text-accent-dark"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
