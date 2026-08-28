import Link from 'next/link'
import type { Metadata } from 'next'
import SectionHeader from '@/components/app/SectionHeader'
import FrictionHeatmap from '@/components/app/FrictionHeatmap'
import FrictionDetectivePanel from '@/components/app/FrictionDetectivePanel'
import PillarCard from '@/components/app/cards/PillarCard'
import ScoreCard from '@/components/app/cards/ScoreCard'
import TrendSparkline from '@/components/app/charts/TrendSparkline'
import {
  MOCK_BENCHMARK,
  MOCK_HEALTH_INDEX,
  MOCK_HEATMAP,
  MOCK_PILLARS,
  MOCK_RECOMMENDATIONS,
  MOCK_SPARKLINE,
  MOCK_THEMES,
} from '@/lib/data/mock/platform'

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
  return (
    <>
      <SectionHeader
        eyebrow="DemoTech · Revenue organization health"
        title="Your revenue organization is healthy overall — but seller confidence is breaking down in key moments."
        description="This overview is a narrative-first executive view: overall health, where friction concentrates, what changed, how you compare, and what to do next."
      />

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
        <div className="app-card flex h-full min-h-full flex-col p-6 md:p-8">
          <p className="app-eyebrow text-warm-500">Executive summary</p>
          <p className="mt-4 text-lg text-ink leading-relaxed">{MOCK_HEALTH_INDEX.narrative}</p>
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
          </div>
        </div>
        <ScoreCard
          label="Seller Experience Overall Index Score"
          score={MOCK_HEALTH_INDEX.score}
          deltaCycle={MOCK_HEALTH_INDEX.deltaCycle}
          deltaBenchmark={MOCK_HEALTH_INDEX.deltaBenchmark}
          footnote="Normalized 0–100. In production, pair with sample size, confidence, and cycle context."
          className="h-full min-h-full md:p-8"
          emphasized
        />
      </div>

      <div className="app-card mt-8 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="app-eyebrow text-warm-500">Trend</p>
            <p className="mt-1 text-sm font-medium text-ink">Seller Experience Index Score</p>
          </div>
        </div>
        <TrendSparkline data={MOCK_SPARKLINE} />
      </div>

      <section className="mt-14">
        <h2 className="section-title mb-6">Health pillars</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {MOCK_PILLARS.map((p) => (
            <PillarCard key={p.key} pillar={p} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="section-title mb-2">Friction concentration</h2>
        <p className="text-sm text-warm-600 max-w-2xl mb-6">
          Stage × dimension heatmap shows where the operating environment adds drag. Drill into diagnostics for cohort splits.
        </p>
        <FrictionHeatmap cells={MOCK_HEATMAP} />
      </section>

      <FrictionDetectivePanel />

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="section-title mb-2">Recommended actions this quarter</h2>
          <p className="text-sm text-warm-600 mb-6">Opinionated, evidence-linked priorities — not a task list.</p>
          <ul className="space-y-4">
            {MOCK_RECOMMENDATIONS.map((r) => (
              <li
                key={r.id}
                className="app-card p-5"
              >
                <p className="text-xs font-semibold text-accent-dark">{r.priority}</p>
                <p className="mt-1 font-semibold text-ink">{r.title}</p>
                <p className="mt-2 text-sm text-warm-600 leading-relaxed">{r.issue}</p>
                <p className="mt-3 text-xs text-warm-500">{r.evidenceSummary}</p>
              </li>
            ))}
          </ul>
          <Link href="/app/recommendations" className="inline-block mt-6 text-sm font-semibold text-accent-dark hover:text-ink">
            Open recommendations →
          </Link>
        </div>
        <div>
          <h2 className="section-title mb-2">Benchmark context</h2>
          <p className="text-sm text-warm-600 mb-6">{MOCK_BENCHMARK.label}</p>
          <div className="app-card space-y-6 p-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-warm-600">Your org</span>
              <span className="text-3xl font-semibold tabular-nums">{MOCK_BENCHMARK.yourScore}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-warm-600">
                <span>Peer median</span>
                <span className="font-medium text-ink tabular-nums">{MOCK_BENCHMARK.peerMedian}</span>
              </div>
              <div className="flex justify-between gap-4 text-warm-600">
                <span>Internal top teams</span>
                <span className="font-medium text-ink tabular-nums">{MOCK_BENCHMARK.internalTopTeam}</span>
              </div>
            </div>
            <p className="text-xs text-warm-500 leading-relaxed border-t border-warm-400/30 pt-4">
              You outperform benchmark on ease of selling, but trail peers on manager confidence and support consistency — matching the qualitative themes below.
            </p>
          </div>
          <Link href="/app/benchmarks" className="inline-block mt-6 text-sm font-semibold text-accent-dark hover:text-ink">
            Explore benchmarks →
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="section-title mb-2">Qualitative themes</h2>
        <p className="text-sm text-warm-600 mb-6">
          Clustered seller language. Production uses controlled disclosure, not raw dumps.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {MOCK_THEMES.map((t) => (
            <ThemeClusterCard
              key={t.id}
              label={t.label}
              prevalence={t.prevalence}
              sentiment={t.sentiment}
              quotes={t.quotes}
            />
          ))}
        </div>
      </section>
    </>
  )
}
