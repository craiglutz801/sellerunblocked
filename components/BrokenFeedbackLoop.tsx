import SectionEyebrow from '@/components/SectionEyebrow'

function LoopColumn({
  label,
  variant,
  steps,
}: {
  label: string
  variant: 'before' | 'after'
  steps: string[]
}) {
  const isAfter = variant === 'after'
  return (
    <div
      className={`rounded-2xl p-8 md:p-10 h-full ${
        isAfter
          ? 'bg-accent/10 border-2 border-accent/35'
          : 'bg-cream border border-warm-400/25'
      }`}
    >
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          isAfter ? 'bg-accent/20 text-accent-dark' : 'bg-warm-400/20 text-warm-600'
        }`}
      >
        {label}
      </span>
      <ol className="mt-8 space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="relative pl-6">
            {i < steps.length - 1 ? (
              <span
                className={`absolute left-[7px] top-5 bottom-[-1rem] w-px ${
                  isAfter ? 'bg-accent/40' : 'bg-warm-400/40'
                }`}
                aria-hidden
              />
            ) : null}
            <span
              className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                isAfter ? 'border-accent bg-accent/30' : 'border-warm-400 bg-paper'
              }`}
              aria-hidden
            />
            <p className={`text-sm font-medium ${isAfter ? 'text-ink' : 'text-warm-600'}`}>{step}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function BrokenFeedbackLoop() {
  return (
    <section id="broken-loop" className="section-padding bg-paper">
      <div className="container-wide">
        <SectionEyebrow>The broken loop</SectionEyebrow>
        <h2 className="text-section font-bold text-ink text-center max-w-3xl mx-auto">
          Most Feedback Programs Stop Right When Sellers Need Help Most
        </h2>
        <p className="mt-6 text-lg text-warm-600 text-center max-w-2xl mx-auto leading-relaxed">
          Surveys produce dashboards. Dashboards produce meetings. But the individual seller who raised the issue often
          gets no immediate support.
        </p>
        <p className="mt-4 text-warm-600 text-center max-w-2xl mx-auto leading-relaxed">
          Most revenue organizations have two disconnected systems: feedback that tells leadership what sellers
          experience, and enablement that sends broad training to the field. SellerUnblocked connects them.
        </p>
        <div className="mt-16 grid md:grid-cols-2 gap-8 lg:gap-12">
          <LoopColumn
            label="Open loop"
            variant="before"
            steps={[
              'Seller feedback',
              'Dashboard',
              'Leadership discussion',
              'Maybe action later',
            ]}
          />
          <LoopColumn
            label="Closed loop"
            variant="after"
            steps={[
              'Seller feedback',
              'SellerUnblocked diagnostic spine',
              'Leadership intelligence + personalized seller kit',
              'System fixes + seller action',
            ]}
          />
        </div>
      </div>
    </section>
  )
}
