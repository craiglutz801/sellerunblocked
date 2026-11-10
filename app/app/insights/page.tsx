import SectionHeader from '@/components/app/SectionHeader'
import EmptyWorkspace from '@/components/app/EmptyWorkspace'
import InsightCard from '@/components/app/insights/InsightCard'
import { loadReport } from '@/lib/customers/active'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights',
}

export default function InsightsPage() {
  const report = loadReport()
  if (!report.published) return <EmptyWorkspace name={report.organizationName} />

  return (
    <>
      <SectionHeader
        eyebrow="Insights"
        title="Patterns, variance, and risks — not another chart gallery."
        description="Insights turn the published wave into executive meaning: themes, segment variance, and the limits of the sample."
      />

      <div className="rounded-2xl border border-accent/25 bg-accent/10 p-6 md:p-8 mb-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-warm-600">Executive summary</p>
        <p className="mt-4 text-lg text-ink leading-relaxed">{report.summary}</p>
        <p className="mt-4 text-xs text-warm-500">Every summary on this page is tied to the published revision for {report.organizationName}.</p>
      </div>

      {report.insights.length ? (
        <>
          <h2 className="text-lg font-semibold text-ink mb-6">Active insights</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {report.insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-warm-600">No insight is available until the wave has valid ratings.</p>
      )}

      <section className="mt-12 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6">
        <h3 className="text-sm font-semibold text-ink">Risk flags</h3>
        {report.riskFlags.length ? (
          <ul className="mt-4 space-y-3 text-sm text-warm-600">
            {report.riskFlags.map((flag) => (
              <li key={flag} className="flex gap-2">
                <span className="text-rose-600 font-bold">·</span>
                {flag}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-warm-600">No risk flags from this wave.</p>
        )}
      </section>
    </>
  )
}
