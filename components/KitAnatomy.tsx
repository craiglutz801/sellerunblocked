import SectionEyebrow from '@/components/SectionEyebrow'

const STEPS = [
  {
    num: '1',
    title: 'Acknowledgment',
    subtitle: 'The seller sees that their experience was heard.',
    body: 'SellerUnblocked mirrors the seller’s feedback in supportive language, externalizes systemic friction, and sets the expectation that the kit is designed to help — not judge.',
    example: '“You flagged that pricing guidance changes depending on who reviews the deal. That kind of inconsistency creates real drag.”',
  },
  {
    num: '2',
    title: 'Focus Areas',
    subtitle: 'The kit identifies where support will matter most.',
    body: 'SellerUnblocked highlights up to three focus areas based on personal scores, stage confidence, and gaps versus relevant peer averages.',
    example: 'Support: 42 vs 48 org avg · Alignment: 38 vs 57 · Negotiate stage: confidence gap',
  },
  {
    num: '3',
    title: 'Direct Help',
    subtitle: 'The seller receives practical resources they can use this week.',
    body: 'Each kit includes 3–5 modules such as playbooks, checklists, templates, videos, and live drills — sequenced into a lightweight learning path.',
    example: 'Deal desk escalation playbook · CFO-ready ROI template · Pricing objection drill',
  },
]

export default function KitAnatomy() {
  return (
    <section id="kit-anatomy" className="section-padding bg-cream">
      <div className="container-wide">
        <SectionEyebrow>Kit anatomy</SectionEyebrow>
        <h2 className="text-section font-bold text-ink text-center max-w-2xl mx-auto">
          What Each Seller Receives
        </h2>
        <p className="mt-6 text-lg text-warm-600 text-center max-w-xl mx-auto">
          A kit is not a course catalog. It is a focused packet of context, diagnosis, and direct help.
        </p>
        <div className="mt-16 grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl bg-paper border border-warm-400/20 p-8 flex flex-col hover:border-accent/30 hover:shadow-md transition-all"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white font-bold text-sm">
                {step.num}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-1 text-sm font-medium text-accent-dark">{step.subtitle}</p>
              <p className="mt-4 text-sm text-warm-600 leading-relaxed flex-1">{step.body}</p>
              <p className="mt-5 text-xs text-warm-500 leading-relaxed border-t border-warm-400/20 pt-4 italic">
                {step.example}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-14 text-center text-lg font-medium text-ink max-w-2xl mx-auto">
          Empathy without action feels hollow. Action without empathy feels punitive. SellerUnblocked combines both.
        </p>
      </div>
    </section>
  )
}
