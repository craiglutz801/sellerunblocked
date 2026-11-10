import Link from 'next/link'
import SectionHeader from '@/components/app/SectionHeader'
import EmptyWorkspace from '@/components/app/EmptyWorkspace'
import ImpactEffortMatrix from '@/components/app/recommendations/ImpactEffortMatrix'
import RecommendationDetailCard from '@/components/app/recommendations/RecommendationDetailCard'
import { loadReport } from '@/lib/customers/active'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recommendations',
}

export default function RecommendationsPage() {
  const report = loadReport()
  if (!report.published) return <EmptyWorkspace name={report.organizationName} />

  return (
    <>
      <SectionHeader
        eyebrow="Recommendations"
        title={report.recommendations[0]?.title ?? 'No recommendation until the wave has valid ratings'}
        description="Each recommendation ties to the published scores, an owner, and the evidence behind it."
      />

      {report.recommendations.length ? (
        <div className="grid gap-8 lg:grid-cols-5 mb-12">
          <div className="lg:col-span-2">
            <ImpactEffortMatrix items={report.recommendations} />
          </div>
          <div className="lg:col-span-3 app-card p-6">
            <h3 className="text-sm font-semibold text-ink">How to use this view</h3>
            <ul className="mt-4 space-y-3 text-sm text-warm-600 leading-relaxed">
              <li>Start with the lowest pillar indexes in this published wave.</li>
              <li>Assign a single accountable owner before the item becomes tracked work.</li>
              <li>Use the follow-up metric on the next wave. This view does not invent a point lift.</li>
            </ul>
            <div className="mt-6 pt-5 border-t border-warm-400/30">
              <p className="text-sm text-warm-600">Assigned work for this customer lives on the actions page.</p>
              <Link
                href="/app/actions"
                className="inline-flex mt-3 items-center rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-dark transition-colors"
              >
                Open Action Items
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-8">
        {report.recommendations.map((rec) => (
          <RecommendationDetailCard key={rec.id} rec={rec} />
        ))}
      </div>
    </>
  )
}
