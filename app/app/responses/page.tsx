import SectionHeader from '@/components/app/SectionHeader'
import EmptyWorkspace from '@/components/app/EmptyWorkspace'
import { loadReport } from '@/lib/customers/active'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Responses',
}

const sentimentClass = {
  positive: 'bg-emerald-500/10 text-emerald-800',
  neutral: 'bg-warm-400/20 text-warm-800',
  negative: 'bg-rose-500/10 text-rose-800',
} as const

export default function ResponsesPage() {
  const report = loadReport()
  if (!report.published) return <EmptyWorkspace name={report.organizationName} />

  return (
    <>
      <SectionHeader
        eyebrow="Responses"
        title="Explore qualitative evidence with restraint."
        description={`${report.submissionCount} published responses in ${report.organizationName}. Excerpts come from that revision only.`}
      />

      {report.responses.length ? (
        <div className="app-card overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm">
            <thead>
              <tr className="border-b border-warm-400/30 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                <th className="p-4 w-[44%]">Excerpt</th>
                <th className="p-4">Role</th>
                <th className="p-4">Region</th>
                <th className="p-4">Team</th>
                <th className="p-4">Themes</th>
                <th className="p-4">Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {report.responses.map((row) => (
                <tr key={row.id} className="border-b border-warm-400/15 last:border-0 align-top">
                  <td className="p-4 text-warm-600 leading-relaxed">{row.excerpt}</td>
                  <td className="p-4 text-ink font-medium whitespace-nowrap">{row.role}</td>
                  <td className="p-4 text-warm-600 whitespace-nowrap">{row.region}</td>
                  <td className="p-4 text-warm-600 whitespace-nowrap">{row.team}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {row.themes.map((theme) => (
                        <span key={theme} className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-warm-800 border border-warm-400/30">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${sentimentClass[row.sentiment]}`}>
                      {row.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-warm-600">This wave has no response rows to show.</p>
      )}
    </>
  )
}
