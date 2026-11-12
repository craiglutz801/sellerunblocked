import Link from 'next/link'
import type { Metadata } from 'next'
import SectionHeader from '@/components/app/SectionHeader'
import EmptyWorkspace from '@/components/app/EmptyWorkspace'
import { loadReport } from '@/lib/customers/active'
import { readSavedActions, measurementFor, toActionItem } from '@/lib/unblocked-ai/actions'
import { customerRoot } from '@/lib/customers/store'

export const metadata: Metadata = {
  title: 'Actions',
}

const statusStyles = {
  todo: 'bg-warm-400/20 text-warm-800 border-warm-400/30',
  in_progress: 'bg-accent/15 text-ink border-accent/30',
  blocked: 'bg-rose-500/10 text-rose-800 border-rose-500/20',
  done: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
} as const

function StatusLabel({ status }: { status: keyof typeof statusStyles }) {
  const label = status.replace('_', ' ')
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>{label}</span>
}

export default function ActionsPage() {
  const report = loadReport()
  if (!report.published) return <EmptyWorkspace name={report.organizationName} />
  const saved = readSavedActions(customerRoot(), report.slug).map((action) =>
    toActionItem(action, measurementFor(customerRoot(), report.slug, action)),
  )
  const items = [...saved, ...report.actions]
  const totals = {
    open: items.filter((item) => item.status !== 'done').length,
    blocked: items.filter((item) => item.status === 'blocked').length,
    done: items.filter((item) => item.status === 'done').length,
  }
  const titleFor = (id: string) => report.recommendations.find((recommendation) => recommendation.id === id)?.title ?? 'Unmapped recommendation'

  return (
    <>
      <SectionHeader
        eyebrow="Execution"
        title="Action Items"
        description="Assigned work for this customer. A new account starts empty until someone records an owner and a due date."
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-10">
        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">Open</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-ink">{totals.open}</p>
        </div>
        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">Blocked</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-rose-700">{totals.blocked}</p>
        </div>
        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-warm-500">Completed</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-emerald-700">{totals.done}</p>
        </div>
      </div>

      {items.length ? (
        <section className="app-card overflow-x-auto">
          <table className="min-w-[1020px] w-full text-sm">
            <thead>
              <tr className="border-b border-warm-400/30 text-left text-xs font-semibold uppercase tracking-wider text-warm-500">
                <th className="p-4 w-[28%]">Action item</th>
                <th className="p-4">Linked recommendation</th>
                <th className="p-4">Assignee</th>
                <th className="p-4">Due</th>
                <th className="p-4">Status</th>
                <th className="p-4">Notes</th>
                <th className="p-4">Slack</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-warm-400/20 last:border-0 align-top">
                  <td className="p-4">
                    <p className="font-semibold text-ink">{item.title}</p>
                    <p className="mt-2 text-xs text-warm-500">
                      Owner: {item.owner} · {item.priority}
                    </p>
                    {item.measurementNote ? <p className="mt-2 text-xs tabular-nums text-ink">{item.measurementNote}</p> : null}
                    {item.sourceNote ? <p className="mt-1 text-xs text-warm-500">{item.sourceNote}</p> : null}
                  </td>
                  <td className="p-4 text-warm-600">{titleFor(item.recommendationId)}</td>
                  <td className="p-4 text-warm-700 font-medium">{item.assignee}</td>
                  <td className="p-4 text-warm-600 whitespace-nowrap">{item.dueDate}</td>
                  <td className="p-4">
                    <StatusLabel status={item.status} />
                  </td>
                  <td className="p-4">
                    <div className="rounded-xl border border-warm-400/30 bg-paper p-3">
                      <p className="text-xs text-warm-500 mb-1">{item.notesCount} notes</p>
                      <p className="text-sm text-warm-700 leading-relaxed">{item.lastNote}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    {item.slackChannel ? (
                      <>
                        <p className="text-xs text-warm-500">{item.slackChannel}</p>
                        <p className="text-[11px] text-warm-500">Last: {item.lastSlackMessageAt}</p>
                      </>
                    ) : (
                      <p className="text-xs text-warm-500">—</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="app-card p-6">
          <p className="text-sm leading-relaxed text-warm-600">
            No action items yet. Recommendations stay on the recommendations page until an owner records them here.
          </p>
        </section>
      )}

      <div className="mt-8 rounded-2xl border border-accent/25 bg-accent/10 p-5">
        <Link href="/app/recommendations" className="inline-flex text-sm font-semibold text-accent-dark hover:text-ink">
          ← Back to recommendations
        </Link>
      </div>
    </>
  )
}
