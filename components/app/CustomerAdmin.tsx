'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { CustomerSummary, TemplateKey } from '@/lib/customers/types'

type Issue = { row?: number; column?: string; message: string }

type ActiveCustomer = {
  slug: string
  name: string
  industry: string
  isDemo: boolean
  published: boolean
  submissionCount: number
  revisionId: string | null
  templateKey: TemplateKey | null
}

async function submit(form: HTMLFormElement, setMessage: (value: string) => void, setIssues: (value: Issue[]) => void) {
  setMessage('')
  setIssues([])
  const response = await fetch('/api/customers', { method: 'POST', body: new FormData(form) })
  const body = (await response.json()) as {
    ok?: boolean
    name?: string
    submissionCount?: number
    idempotent?: boolean
    warnings?: Issue[]
    errors?: Issue[]
  }
  if (!response.ok || !body.ok) {
    setIssues(body.errors ?? [{ message: 'The customer could not be saved.' }])
    return false
  }
  const count = body.submissionCount ?? 0
  const warning = body.warnings?.length ? ` ${body.warnings.length} warning${body.warnings.length === 1 ? '' : 's'}.` : ''
    setMessage(
      count
        ? `${body.idempotent ? 'Already published' : 'Published'} ${count} responses for ${body.name}.${warning}`
        : `Added ${body.name}. No responses yet.${warning}`,
    )
    form.reset()
    return true
}

function Issues({ issues }: { issues: Issue[] }) {
  if (!issues.length) return null
  return (
    <ul className="space-y-1 text-sm text-rose-700">
      {issues.slice(0, 8).map((issue, index) => (
        <li key={`${issue.column ?? 'form'}-${index}`}>
          {issue.row ? `Row ${issue.row}: ` : ''}
          {issue.column ? `${issue.column}: ` : ''}
          {issue.message}
        </li>
      ))}
    </ul>
  )
}

export default function CustomerAdmin({
  active,
  customers,
}: {
  active: ActiveCustomer
  customers: CustomerSummary[]
}) {
  const router = useRouter()
  const [createMessage, setCreateMessage] = useState('')
  const [createIssues, setCreateIssues] = useState<Issue[]>([])
  const [importMessage, setImportMessage] = useState('')
  const [importIssues, setImportIssues] = useState<Issue[]>([])
  const [pending, setPending] = useState(false)

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="app-card space-y-4 p-6 md:p-8">
        <h2 className="text-sm font-semibold text-ink">This customer</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-warm-500">Name</dt>
            <dd className="font-semibold text-ink">{active.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-warm-500">Industry</dt>
            <dd className="font-medium text-ink">{active.industry || '—'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-warm-500">Published responses</dt>
            <dd className="font-medium text-ink tabular-nums">{active.published ? active.submissionCount : 'None'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-warm-500">Revision</dt>
            <dd className="font-medium text-ink">{active.revisionId ?? 'Not published'}</dd>
          </div>
        </dl>
        <p className="text-sm leading-relaxed text-warm-600">
          {active.isDemo
            ? 'DemoTech is the seeded demo. Its peer figures stay in this workspace. Add a customer for a real baseline.'
            : 'External benchmarks stay off until a real release is attached. DemoTech numbers are not used here.'}
        </p>
        <p className="text-xs leading-relaxed text-warm-500">
          {customers.filter((customer) => customer.slug !== active.slug).length
            ? `Other customers: ${customers
                .filter((customer) => customer.slug !== active.slug)
                .map((customer) => customer.name)
                .join(', ')}`
            : 'No other customers yet.'}
        </p>
      </section>

      <section className="app-card space-y-4 p-6 md:p-8">
        <h2 className="text-sm font-semibold text-ink">Add a customer</h2>
        <p className="text-sm leading-relaxed text-warm-600">
          Creates the account, an admin membership, and an optional first wave from the{' '}
          <a className="font-semibold text-accent-dark hover:text-ink" href="/templates/seller-baseline-responses.csv">
            baseline CSV
          </a>
          . Example rows in that file are not a real customer.
        </p>
        <form
          className="space-y-3"
          onSubmit={async (event) => {
            event.preventDefault()
            setPending(true)
            const ok = await submit(event.currentTarget, setCreateMessage, setCreateIssues)
            setPending(false)
            if (ok) router.refresh()
          }}
        >
          <input type="hidden" name="action" value="create" />
          <input name="name" required placeholder="Customer name" className="w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink" />
          <input name="industry" required placeholder="Industry" className="w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="region" placeholder="Region (optional)" className="w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink" />
            <input name="sellerCountBand" placeholder="Seller count (optional)" className="w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="contactName" required placeholder="Admin name" className="w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink" />
            <input name="contactEmail" type="email" required placeholder="Admin email" className="w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink" />
          </div>
          <input name="file" type="file" accept=".csv,text/csv" className="block w-full text-sm text-warm-600" />
          <Issues issues={createIssues} />
          {createMessage ? <p className="text-sm text-ink">{createMessage}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex rounded-full bg-accent-dark px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
          >
            Add customer
          </button>
        </form>
      </section>

      <section className="app-card space-y-4 p-6 md:p-8 lg:col-span-2">
        <h2 className="text-sm font-semibold text-ink">Publish a CSV to {active.name}</h2>
        {active.isDemo ? (
          <p className="text-sm leading-relaxed text-warm-600">
            The demo pulse stays as seeded. Create a customer above, then publish that account&apos;s baseline here.
          </p>
        ) : (
          <form
            className="space-y-3"
            onSubmit={async (event) => {
              event.preventDefault()
              setPending(true)
              const ok = await submit(event.currentTarget, setImportMessage, setImportIssues)
              setPending(false)
              if (ok) router.refresh()
            }}
          >
            <input type="hidden" name="action" value="import" />
            <input type="hidden" name="slug" value={active.slug} />
            <label className="block text-sm text-warm-600">
              Mode
              <select name="mode" className="mt-2 w-full rounded-xl border border-warm-400/40 bg-paper px-4 py-2.5 text-sm text-ink">
                <option value="replace">Replace — publish this file as the next wave and keep the prior revision</option>
                <option value="append">Append — add rows with new response ids</option>
              </select>
            </label>
            <input name="file" type="file" accept=".csv,text/csv" required className="block w-full text-sm text-warm-600" />
            <p className="text-xs leading-relaxed text-warm-500">
              Ratings are whole numbers from 1 to 5. Blank, N/A, and Don&apos;t know are skipped, not stored as zero. The same file
              published twice does not create a second revision.
            </p>
            <Issues issues={importIssues} />
            {importMessage ? <p className="text-sm text-ink">{importMessage}</p> : null}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
            >
              Publish CSV
            </button>
          </form>
        )}
        <p className="text-xs leading-relaxed text-warm-500">
          Files are written under data/customers. Commit that folder to keep a new customer on the next deploy. A hosted
          disk that cannot be written will refuse the upload instead of pretending it saved.
        </p>
      </section>
    </div>
  )
}
