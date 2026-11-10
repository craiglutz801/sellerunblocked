import type { Metadata } from 'next'
import SectionHeader from '@/components/app/SectionHeader'
import BenchmarkExplorer from '@/components/app/benchmarks/BenchmarkExplorer'
import ScoreCard from '@/components/app/cards/ScoreCard'
import EmptyWorkspace from '@/components/app/EmptyWorkspace'
import { loadReport } from '@/lib/customers/active'

export const metadata: Metadata = {
  title: 'Benchmarks',
}

export default function BenchmarksPage() {
  const report = loadReport()
  if (!report.published) return <EmptyWorkspace name={report.organizationName} />
  const benchmark = report.benchmark

  return (
    <>
      <SectionHeader
        eyebrow="Benchmarks"
        title={benchmark.available ? 'Contextualize scores without overclaiming.' : 'No external benchmark for this account.'}
        description={benchmark.label}
      />

      {benchmark.available && benchmark.yourScore != null && benchmark.peerMedian != null && benchmark.internalTopTeam != null ? (
        <>
          <div className="grid gap-6 sm:grid-cols-3 mb-10">
            <ScoreCard label="Your org" score={benchmark.yourScore} footnote="Headline index vs the demo peer median." />
            <ScoreCard label="Peer median" score={benchmark.peerMedian} footnote="Demo benchmark release. Not a customer benchmark." />
            <ScoreCard label="Top internal teams" score={benchmark.internalTopTeam} footnote={benchmark.internalLabel ?? 'Demo internal cohort.'} />
          </div>
          <BenchmarkExplorer external={report.benchmarkDimensions} internal={report.benchmarkInternal} />
        </>
      ) : (
        <section className="app-card space-y-4 p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-warm-600">Your org</span>
            <span className="text-3xl font-semibold tabular-nums text-ink">{benchmark.yourScore ?? '—'}</span>
          </div>
          <p className="text-sm leading-relaxed text-warm-600">
            Peer median is unavailable.{' '}
            {benchmark.internalLabel
              ? `Highest group in this wave: ${benchmark.internalLabel}, score ${benchmark.internalTopTeam}.`
              : 'No internal group has enough responses to compare.'}
          </p>
        </section>
      )}
    </>
  )
}
