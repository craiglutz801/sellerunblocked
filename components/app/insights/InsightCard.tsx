import type { Insight } from '@/lib/types/platform'
import EvidenceSourceChips from '@/components/app/EvidenceSourceChips'

const styles: Record<Insight['severity'], string> = {
  positive: 'border-emerald-500/20 bg-emerald-500/[0.06]',
  neutral: 'border-warm-400/30 bg-white',
  risk: 'border-rose-500/20 bg-rose-500/[0.04]',
}

export default function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className={`rounded-2xl border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${styles[insight.severity]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">{insight.type}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">{insight.headline}</h3>
      <p className="mt-3 text-sm text-warm-600 leading-relaxed">{insight.body}</p>
      {insight.sources?.length ? (
        <div className="mt-4">
          <EvidenceSourceChips sources={insight.sources} />
        </div>
      ) : null}
    </article>
  )
}
