import Link from 'next/link'
import EvidenceSourceChips from '@/components/app/EvidenceSourceChips'
import { FRICTION_DETECTIVE_CASE } from '@/lib/data/mock/platform'

export default function FrictionDetectivePanel() {
  const c = FRICTION_DETECTIVE_CASE
  const question = c.sources.find((s) => s.kind === 'question')

  return (
    <section className="mt-14">
      <h2 className="section-title mb-2">Friction Detective</h2>
      <p className="text-sm text-warm-600 max-w-2xl mb-6">
        Systems plus seller insight, then one question only if the cause is still unclear. Aggregated for leadership —
        never a named-rep investigation.
      </p>
      <div className="app-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="app-eyebrow text-accent-dark">{c.eyebrow}</p>
          <span className="rounded-full border border-warm-400/30 bg-cream/70 px-3 py-1 text-[0.6875rem] font-medium text-warm-600">
            {c.cohort}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-ink max-w-2xl">{c.headline}</h3>
        <p className="mt-3 text-sm text-warm-600 leading-relaxed max-w-2xl">{c.body}</p>
        <div className="mt-6">
          <EvidenceSourceChips sources={c.sources} showDetail />
        </div>
        {question ? (
          <blockquote className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3">
            <p className="text-[0.625rem] font-bold uppercase tracking-wider text-accent-dark">
              Asked only because systems could not settle the cause
            </p>
            <p className="mt-2 text-sm font-medium text-ink leading-relaxed">“{question.detail}”</p>
          </blockquote>
        ) : null}
        <Link
          href="/app/recommendations"
          className="inline-block mt-6 text-sm font-semibold text-accent-dark hover:text-ink"
        >
          Open linked recommendation →
        </Link>
      </div>
    </section>
  )
}
