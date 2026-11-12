import Link from 'next/link'
import type { Metadata } from 'next'
import SectionHeader from '@/components/app/SectionHeader'
import EmptyWorkspace from '@/components/app/EmptyWorkspace'
import FrictionHeatmap from '@/components/app/FrictionHeatmap'
import PillarCard from '@/components/app/cards/PillarCard'
import ScoreCard from '@/components/app/cards/ScoreCard'
import TrendSparkline from '@/components/app/charts/TrendSparkline'
import AskButton from '@/components/app/unblocked-ai/AskButton'
import { loadReport } from '@/lib/customers/active'
import { pillarKeyForRecommendation } from '@/lib/unblocked-ai/policy'

export const metadata: Metadata = {
  title: 'Overview',
}

function ThemeClusterCard({
  label,
  prevalence,
  sentiment,
  quotes,
}: {
  label: string
  prevalence: number
  sentiment: string
  quotes: string[]
}) {
  return (
    <div className="app-card p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        <span className="text-xs font-semibold text-warm-500 tabular-nums">{prevalence}% prevalence</span>
      </div>
      <p className="mt-1 text-xs text-warm-500 capitalize">{sentiment} sentiment</p>
      <ul className="mt-4 space-y-3">
        {quotes.map((q) => (
          <li key={q} className="text-sm text-warm-600 leading-relaxed border-l-2 border-accent/60 pl-3">
            {q}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function OverviewPage() {
  const report = loadReport()
  if (!report.published) {
    return <EmptyWorkspace name={report.organizationName} />
  }
  const health = report.health

  return (
    <>
      <SectionHeader eyebrow={report.eyebrow} title={report.headline} description={report.description} />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
        <div className="app-card flex h-full min-h-full flex-col p-6 md:p-8">
          <p className="app-eyebrow text-warm-500">Executive summary</p>
          <p className="mt-4 text-lg text-ink leading-relaxed">{health.narrative}</p>
          <div className="min-h-6 flex-1" aria-hidden />
          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/diagnostics"
              className="inline-flex items-center rounded-full bg-accent-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink transition-colors"
            >
              View diagnostics
            </Link>
            <Link
              href="/app/recommendations"
              className="inline-flex items-center rounded-full border border-accent/35 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-accent/10 transition-colors"
            >
              See recommendations
            </Link>
            <Link
              href="/app/unblocked-ai"
              className="inline-flex items-center rounded-full border border-accent/35 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-accent/10 transition-colors"
            >
              View UnblockedAI readout
            </Link>
          </div>
        </div>
        {health.score == null ? (
          <div className="app-card flex h-full items-center p-6 md:p-8">
            <p className="text-sm leading-relaxed text-warm-600">No valid ratings in this wave, so the index is not shown as zero.</p>
          </div>
        ) : (
          <ScoreCard
            label="Seller Experience Overall Index Score"
            score={health.score}
            deltaCycle={health.deltaCycle ?? undefined}
            deltaBenchmark={health.deltaBenchmark ?? undefined}
            footnote={health.footnote}
            className="h-full min-h-full md:p-8"
            emphasized
          />
        )}
      </div>

      {report.sparkline.length ? (
        <div className="app-card mt-8 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="app-eyebrow text-warm-500">Trend</p>
              <p className="mt-1 text-sm font-medium text-ink">Seller Experience Index Score</p>
            </div>
          </div>
          <TrendSparkline data={report.sparkline} />
          {report.sparklineNote ? <p className="text-xs leading-relaxed text-warm-500">{report.sparklineNote}</p> : null}
        </div>
      ) : null}

      <section className="mt-14">
        <h2 className="section-title mb-6">Health pillars</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {report.pillars.map((p) => (
            <PillarCard key={p.key} pillar={p} />
          ))}
        </div>
      </section>

      {report.heatmap.length ? (
        <section className="mt-14">
          <h2 className="section-title mb-2">Friction concentration</h2>
          <p className="text-sm text-warm-600 max-w-2xl mb-6">{report.heatmapCaption}</p>
          <FrictionHeatmap cells={report.heatmap} />
        </section>
      ) : null}

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="section-title mb-2">Recommended actions this quarter</h2>
          <p className="text-sm text-warm-600 mb-6">Opinionated, evidence-linked priorities — not a task list.</p>
          {report.recommendations.length ? (
            <ul className="space-y-4">
              {report.recommendations.map((r) => (
                <li key={r.id} className="app-card p-5">
                  <p className="text-xs font-semibold text-accent-dark">{r.priority}</p>
                  <p className="mt-1 font-semibold text-ink">{r.title}</p>
                  <p className="mt-2 text-sm text-warm-600 leading-relaxed">{r.issue}</p>
                  <p className="mt-3 text-xs text-warm-500">{r.evidenceSummary}</p>
                  {pillarKeyForRecommendation(r.id) ? (
                    <div className="mt-3 flex flex-wrap gap-4">
                      <AskButton
                        label="View evidence"
                        question={`Why is ${r.category.toLowerCase()} low?`}
                        intent="explain"
                        pillarKey={pillarKeyForRecommendation(r.id)}
                        surface="overview"
                        mode="evidence"
                      />
                      <AskButton
                        label="Draft an action"
                        question="Draft an action for this."
                        intent="action"
                        pillarKey={pillarKeyForRecommendation(r.id)}
                        recommendationId={r.id}
                        surface="overview"
                        mode="draft"
                      />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-warm-600">No recommendation until a pillar has valid ratings.</p>
          )}
          <Link href="/app/recommendations" className="inline-block mt-6 text-sm font-semibold text-accent-dark hover:text-ink">
            Open recommendations →
          </Link>
        </div>
        <div>
          <h2 className="section-title mb-2">Benchmark context</h2>
          <p className="text-sm text-warm-600 mb-6">{report.benchmark.label}</p>
          <div className="app-card space-y-6 p-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-warm-600">Your org</span>
              <span className="text-3xl font-semibold tabular-nums">{report.benchmark.yourScore ?? '—'}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-warm-600">
                <span>Peer median</span>
                <span className="font-medium text-ink tabular-nums">{report.benchmark.peerMedian ?? '—'}</span>
              </div>
              <div className="flex justify-between gap-4 text-warm-600">
                <span>{report.benchmark.internalLabel ?? 'Internal top teams'}</span>
                <span className="font-medium text-ink tabular-nums">{report.benchmark.internalTopTeam ?? '—'}</span>
              </div>
            </div>
            {report.benchmarkNote ? (
              <p className="text-xs text-warm-500 leading-relaxed border-t border-warm-400/30 pt-4">{report.benchmarkNote}</p>
            ) : null}
          </div>
          <Link href="/app/benchmarks" className="inline-block mt-6 text-sm font-semibold text-accent-dark hover:text-ink">
            Explore benchmarks →
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="section-title mb-2">Qualitative themes</h2>
        <p className="text-sm text-warm-600 mb-6">Clustered seller language. Production uses controlled disclosure, not raw dumps.</p>
        {report.themes.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {report.themes.map((t) => (
              <ThemeClusterCard key={t.id} label={t.label} prevalence={t.prevalence} sentiment={t.sentiment} quotes={t.quotes} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-warm-600">No open-text responses in this wave.</p>
        )}
      </section>
    </>
  )
}
