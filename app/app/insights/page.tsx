import SectionHeader from '@/components/app/SectionHeader'
import InsightCard from '@/components/app/insights/InsightCard'
import { MOCK_INSIGHTS } from '@/lib/data/mock/platform'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights',
}

export default function InsightsPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Insights"
        title="Patterns, variance, and risks — not another chart gallery."
        description="Insights layer turns diagnostics into executive meaning: themes, segment variance, benchmark context, and anomalies. When system evidence is connected, insights cite Salesforce, Gong, calendar metadata, and seller input — never named individuals."
      />

      <div className="rounded-2xl border border-accent/25 bg-accent/10 p-6 md:p-8 mb-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-wider text-warm-600">AI executive summary</p>
        <p className="mt-4 text-lg text-ink leading-relaxed">
          Revenue org health is improving modestly cycle-over-cycle, driven by enablement and process clarity. The dominant risk is{' '}
          <span className="font-semibold">late-stage confidence</span>: enterprise sellers report inconsistent manager coaching and slower
          support on complex pricing. Addressing these two drivers should reduce negotiated-stage stall and improve forecast reliability.
        </p>
        <p className="mt-4 text-xs text-warm-500">
          Production rule: every summary must link to underlying evidence (deltas, benchmark gaps, theme clusters, quotes).
        </p>
      </div>

      <h2 className="text-lg font-semibold text-ink mb-6">Active insights</h2>
      <div className="grid gap-5 md:grid-cols-2">
        {MOCK_INSIGHTS.map((i) => (
          <InsightCard key={i.id} insight={i} />
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6">
        <h3 className="text-sm font-semibold text-ink">Risk flags</h3>
        <ul className="mt-4 space-y-3 text-sm text-warm-600">
          <li className="flex gap-2">
            <span className="text-rose-600 font-bold">·</span>
            Support pillar divergence: Enterprise −12 pts vs Commercial over 2 cycles.
          </li>
          <li className="flex gap-2">
            <span className="text-rose-600 font-bold">·</span>
            Emerging qualitative cluster: “forecast pressure → bad hygiene” (+18% volume WoW).
          </li>
        </ul>
      </section>
    </>
  )
}
