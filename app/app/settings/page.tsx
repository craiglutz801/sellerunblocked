import SectionHeader from '@/components/app/SectionHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-warm-500">{label}</span>
      <input
        readOnly
        value={value}
        className="mt-2 w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink"
      />
    </label>
  )
}

const INTEGRATIONS = [
  {
    name: 'Salesforce',
    status: 'Connected · metadata',
    metadata: 'Opportunity-change history, stage dwell, approval timestamps',
    content: 'Off — no opportunity notes or chatter unless explicitly granted',
  },
  {
    name: 'Gong',
    status: 'Connected · metadata',
    metadata: 'Topics, trackers, and scorecards',
    content: 'Off — transcripts require explicit workspace permission',
  },
  {
    name: 'Microsoft 365',
    status: 'Connected · metadata',
    metadata: 'Permitted calendar and usage metadata (meeting load, not titles of 1:1s)',
    content: 'Off — meeting content and mail are not ingested',
  },
  {
    name: 'Seismic',
    status: 'Not connected',
    metadata: 'Content-view and usage history',
    content: 'Off until connected — never used to score individual sellers',
  },
]

export default function SettingsPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Settings"
        title="Workspace administration"
        description="Connect integrations, permissions, benchmark sources, and AI preferences. Form fields are static placeholders until auth and API layers land."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="app-card space-y-5 p-6 md:p-8">
          <h2 className="text-sm font-semibold text-ink">Workspace</h2>
          <Field label="Organization name" value="Acme Revenue Co." />
          <Field label="Default measurement cycle" value="Quarterly + monthly manager pulse" />
        </section>
        <section className="app-card space-y-5 p-6 md:p-8">
          <h2 className="text-sm font-semibold text-ink">Roles & permissions</h2>
          <Field label="Admin contact" value="revops@acme.example" />
          <p className="text-sm text-warm-600">
            Production: row-level access by team / region, auditor read-only, executive roll-ups.
          </p>
        </section>
        <section className="app-card space-y-5 p-6 md:p-8">
          <h2 className="text-sm font-semibold text-ink">Benchmarks</h2>
          <Field label="Primary peer cohort" value="B2B SaaS · 200–800 sellers" />
          <p className="text-sm text-warm-600">Disclose methodology, sample size, and refresh cadence in-app.</p>
        </section>
        <section className="app-card space-y-5 p-6 md:p-8">
          <h2 className="text-sm font-semibold text-ink">AI / insights</h2>
          <Field label="Executive summary tone" value="Board-ready · conservative claims" />
          <p className="text-sm text-warm-600">
            Require citations to scores, benchmarks, quotes, and permitted system metadata for every generated insight.
            Never rank individual sellers from calendar or call data.
          </p>
        </section>
      </div>

      <section className="app-card mt-8 space-y-5 p-6 md:p-8">
        <div>
          <h2 className="text-sm font-semibold text-ink">Integrations</h2>
          <p className="mt-2 text-sm text-warm-600 leading-relaxed">
            Analyze metadata first. Use content only with explicit permission. Leadership receives aggregated systemic
            findings — not individual surveillance. Connectors below are placeholders until OAuth lands.
          </p>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {INTEGRATIONS.map((item) => (
            <li key={item.name} className="rounded-xl border border-warm-400/30 bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{item.name}</p>
                <span className="rounded-full border border-warm-400/30 bg-cream/70 px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-warm-600">
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-warm-500">Metadata</p>
              <p className="mt-1 text-sm text-warm-600 leading-relaxed">{item.metadata}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-warm-500">Content</p>
              <p className="mt-1 text-sm text-warm-600 leading-relaxed">{item.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
