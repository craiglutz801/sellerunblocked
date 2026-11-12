import type { PillarScore } from '@/lib/types/platform'
import AskButton from '@/components/app/unblocked-ai/AskButton'

export default function PillarCard({ pillar }: { pillar: PillarScore }) {
  return (
    <div className="app-card flex flex-col h-full p-5" id={`pillar-${pillar.key}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{pillar.label}</h3>
        <span className="text-2xl font-semibold tabular-nums text-ink">{pillar.available === false ? '—' : pillar.score}</span>
      </div>
      <div className="mt-3 space-y-1 text-sm text-warm-600">
        {pillar.hasPriorWave === false ? (
          <p>No prior published wave</p>
        ) : (
          <p>
            <span className={pillar.deltaCycle >= 0 ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
              {pillar.deltaCycle >= 0 ? '+' : ''}
              {pillar.deltaCycle} pts
            </span>{' '}
            vs last cycle
          </p>
        )}
        {pillar.showBenchmark === false ? (
          <p>External benchmark unavailable</p>
        ) : (
          <p>
            <span className={pillar.deltaBenchmark >= 0 ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
              {pillar.deltaBenchmark >= 0 ? '+' : ''}
              {pillar.deltaBenchmark} pts
            </span>{' '}
            vs benchmark
          </p>
        )}
      </div>
      <p className="mt-4 text-sm text-warm-600 leading-relaxed flex-1">{pillar.narrative}</p>
      {pillar.available === false ? null : (
        <div className="mt-4">
          <AskButton
            label="Ask about this"
            question={`Why is ${pillar.label.toLowerCase()} low?`}
            intent="explain"
            pillarKey={pillar.key}
            surface="overview"
          />
        </div>
      )}
    </div>
  )
}
