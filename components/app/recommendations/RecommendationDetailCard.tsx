import type { Recommendation } from '@/lib/types/platform'
import EvidenceSourceChips from '@/components/app/EvidenceSourceChips'

const priorityStyles: Record<Recommendation['priority'], string> = {
  P0: 'bg-rose-500/10 text-rose-800 border-rose-500/20',
  P1: 'bg-amber-500/10 text-amber-900 border-amber-500/20',
  P2: 'bg-warm-400/20 text-warm-800 border-warm-400/30',
}

export default function RecommendationDetailCard({ rec }: { rec: Recommendation }) {
  return (
    <article className="app-card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">{rec.category}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{rec.title}</h2>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${priorityStyles[rec.priority]}`}
        >
          {rec.priority}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-500">Issue</h3>
            <p className="mt-2 text-sm text-warm-600 leading-relaxed">{rec.issue}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-500">Why it matters</h3>
            <p className="mt-2 text-sm text-warm-600 leading-relaxed">{rec.whyItMatters}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-500">Expected impact</h3>
            <p className="mt-2 text-sm text-warm-600 leading-relaxed">{rec.expectedImpact}</p>
          </div>
          <div className="rounded-xl border border-warm-400/30 bg-cream/30 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-warm-500">Linked evidence</h3>
            <p className="mt-2 text-sm text-ink leading-relaxed">{rec.evidenceSummary}</p>
            {rec.evidenceSources?.length ? (
              <div className="mt-4">
                <EvidenceSourceChips sources={rec.evidenceSources} showDetail />
              </div>
            ) : null}
          </div>
          {rec.targetedQuestion ? (
            <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-dark">
                Targeted question
              </h3>
              <p className="mt-2 text-sm font-medium text-ink leading-relaxed">“{rec.targetedQuestion}”</p>
              <p className="mt-2 text-xs text-warm-500">
                Asked of the affected cohort only because system evidence could not settle the cause. Answers stay
                aggregated.
              </p>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-warm-400/30 bg-paper p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">Owner</p>
            <p className="mt-2 text-sm font-medium text-ink">{rec.owner}</p>
          </div>
          <div className="rounded-xl border border-warm-400/30 bg-paper p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">Effort / confidence</p>
            <p className="mt-2 text-sm text-warm-600">
              <span className="font-medium text-ink">{rec.effort}</span> effort ·{' '}
              <span className="font-medium text-ink">{rec.confidence}%</span> model confidence
            </p>
          </div>
          <div className="rounded-xl border border-warm-400/30 bg-paper p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">Affected teams</p>
            <ul className="mt-2 space-y-1 text-sm text-warm-600">
              {rec.affectedTeams.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">Follow-up metric</p>
            <p className="mt-2 text-sm font-medium text-ink">{rec.followUpMetric}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
