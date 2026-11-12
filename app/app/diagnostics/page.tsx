import SectionHeader from '@/components/app/SectionHeader'
import EmptyWorkspace from '@/components/app/EmptyWorkspace'
import AskButton from '@/components/app/unblocked-ai/AskButton'
import { loadReport } from '@/lib/customers/active'
import { PILLAR_LABELS } from '@/lib/customers/schema'
import type { PillarKey } from '@/lib/types/platform'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diagnostics',
}

export default function DiagnosticsPage() {
  const report = loadReport()
  if (!report.published) return <EmptyWorkspace name={report.organizationName} />

  return (
    <>
      <SectionHeader
        eyebrow="Diagnostics"
        title="Where operational friction shows up — by dimension, stage, and driver."
        description="Structured assessment of the revenue operating environment: process, tools, enablement, alignment, support, and incentives."
      />

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-ink mb-4">Dimension scores</h2>
        {report.dimensions.length ? (
          <div className="app-card overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead>
                <tr className="border-b border-warm-400/30 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                  <th className="p-4">Dimension</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Δ last cycle</th>
                  <th className="p-4">Δ benchmark</th>
                  <th className="p-4">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {report.dimensions.map((row) => {
                  const pillarKey = (Object.keys(PILLAR_LABELS) as PillarKey[]).find((key) => PILLAR_LABELS[key] === row.dimension)
                  return (
                  <tr key={row.dimension} id={pillarKey} className="border-b border-warm-400/20 last:border-0">
                    <td className="p-4 font-medium text-ink">
                      {row.dimension}
                      {pillarKey ? (
                        <div className="mt-2">
                          <AskButton
                            label="Ask about this"
                            question={`Why is ${row.dimension.toLowerCase()} low?`}
                            intent="explain"
                            pillarKey={pillarKey}
                            surface="diagnostics"
                          />
                        </div>
                      ) : null}
                    </td>
                    <td className="p-4 tabular-nums font-semibold">{row.score}</td>
                    <td className={`p-4 tabular-nums ${report.hasPriorWave ? (row.deltaCycle >= 0 ? 'text-emerald-700' : 'text-rose-700') : 'text-warm-500'}`}>
                      {report.hasPriorWave ? `${row.deltaCycle >= 0 ? '+' : ''}${row.deltaCycle}` : '—'}
                    </td>
                    <td className={`p-4 tabular-nums ${report.benchmark.available ? (row.benchmarkGap >= 0 ? 'text-emerald-700' : 'text-rose-700') : 'text-warm-500'}`}>
                      {report.benchmark.available ? `${row.benchmarkGap >= 0 ? '+' : ''}${row.benchmarkGap}` : '—'}
                    </td>
                    <td className="p-4 text-warm-600 capitalize">{row.confidence}</td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-warm-600">No dimension has a valid rating yet.</p>
        )}
      </section>

      <section className="mb-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-ink mb-2">Friction by sales stage</h2>
          <p className="text-sm text-warm-600 mb-6">
            {report.stageCaption || 'Lower bars = more friction signal in the model.'}
          </p>
          {report.stageFriction.length ? (
            <div className="space-y-4">
              {report.stageFriction.map((s) => (
                <div key={s.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-ink">{s.stage}</span>
                    <span className="tabular-nums text-warm-600">{s.score}</span>
                  </div>
                  <div className="h-2 rounded-full bg-cream overflow-hidden border border-warm-400/20">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent-dark" style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-warm-600">Stage scores are not available for this wave.</p>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink mb-2">Driver ranking</h2>
          <p className="text-sm text-warm-600 mb-6">
            {report.driverCaption || 'Severity index × prevalence. Ownership hints route to recommendations.'}
          </p>
          <ul className="space-y-4">
            {report.drivers.map((d) => (
              <li key={d.driver} className="app-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-ink">{d.driver}</p>
                  <span className="text-sm font-bold tabular-nums text-accent-dark">{d.severity}</span>
                </div>
                <p className="mt-2 text-sm text-warm-600">{d.prevalence}</p>
                <p className="mt-2 text-xs text-warm-500">Suggested owner lens: {d.ownerHint}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
