import type { Insight } from '@/lib/types/platform'
import { PILLAR_LABELS } from '@/lib/customers/schema'
import AskButton from '@/components/app/unblocked-ai/AskButton'

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
      <div className="mt-4">
        <AskButton
          label="Ask about this"
          question={insight.pillarKey ? `Why is ${PILLAR_LABELS[insight.pillarKey].toLowerCase()} low?` : 'What should we fix first?'}
          intent={insight.pillarKey ? 'explain' : 'priority'}
          pillarKey={insight.pillarKey}
          surface="insights"
        />
      </div>
    </article>
  )
}
