import { HOW_IT_WORKS_STEPS } from '@/lib/landing/content'
import SectionEyebrow from '@/components/SectionEyebrow'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-paper">
      <div className="container-wide">
        <SectionEyebrow>How it works</SectionEyebrow>
        <h2 className="text-section font-bold text-ink text-center max-w-3xl mx-auto">
          A Continuous Intelligence Loop That Helps Leaders and Sellers Act
        </h2>

        <div className="mt-16 hidden lg:flex justify-center mb-12">
          <div className="rounded-2xl border border-warm-400/25 bg-cream/50 px-8 py-6 text-center max-w-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">The loop</p>
            <p className="mt-3 text-sm text-warm-600 leading-relaxed">
              Gather (insight + systems) → Diagnose →{' '}
              <span className="text-ink font-medium">AI-guided action for leaders</span> +{' '}
              <span className="text-accent-dark font-medium">private support for sellers</span> → Measure
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-4">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div
                className={`h-full rounded-2xl border-l-4 p-6 md:p-7 pl-7 ${
                  step.title === 'Generate Seller Kits'
                    ? 'border-accent bg-accent-soft/30'
                    : 'border-accent/60 bg-cream/50'
                }`}
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink leading-snug">{step.title}</h3>
                <p className="mt-3 text-sm text-warm-600 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
