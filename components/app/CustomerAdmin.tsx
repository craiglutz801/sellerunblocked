'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { MappingReview } from '@/lib/customers/csv'
import type { CustomerSummary, TemplateKey } from '@/lib/customers/types'

type Issue = { row?: number; column?: string; message: string }

type PendingMap = {
  action: 'create' | 'import'
  file: File
  fields: Record<string, string>
  review: MappingReview
}

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

async function postCustomers(body: FormData) {
  const response = await fetch('/api/customers', { method: 'POST', body })
  return (await response.json()) as {
    ok?: boolean
    needsMapping?: boolean
    review?: MappingReview
    name?: string
    submissionCount?: number
    idempotent?: boolean
    warnings?: Issue[]
    errors?: Issue[]
  }
}

function resultMessage(body: { name?: string; submissionCount?: number; idempotent?: boolean; warnings?: Issue[] }) {
  const count = body.submissionCount ?? 0
  const warning = body.warnings?.length ? ` ${body.warnings.length} warning${body.warnings.length === 1 ? '' : 's'}.` : ''
  return count
    ? `${body.idempotent ? 'Already published' : 'Published'} ${count} responses for ${body.name}.${warning}`
    : `Added ${body.name}. No responses yet.${warning}`
}

function formFields(form: HTMLFormElement): Record<string, string> {
  const fields: Record<string, string> = {}
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') fields[key] = value
  })
  return fields
}

function MappingPanel({
  review,
  choices,
  pending,
  onChoice,
  onConfirm,
  onCancel,
}: {
  review: MappingReview
  choices: Record<string, string>
  pending: boolean
  onChoice: (source: string, target: string) => void
  onConfirm: () => void
  onCancel: () => void
}) {
  const ready = review.columns.every((column) => choices[column.source])
  return (
    <div className="space-y-3 rounded-xl border border-warm-400/40 bg-paper p-4">
      <p className="text-sm font-semibold text-ink">Map these columns before publishing</p>
      <p className="text-xs leading-relaxed text-warm-500">
        These headers are not the baseline template. Nothing is published until each column is mapped or ignored.
      </p>
      {review.columns.map((column) => (
        <label key={column.source} className="block text-sm text-warm-600">
          <span className="font-medium text-ink">{column.source}</span>
          {column.samples.length ? <span className="mt-1 block text-xs text-warm-500">{column.samples.join(' · ')}</span> : null}
          <select
            className="mt-2 w-full rounded-xl border border-warm-400/40 bg-white px-3 py-2 text-sm text-ink"
            value={choices[column.source] ?? ''}
            onChange={(event) => onChoice(column.source, event.target.value)}
          >
            <option value="">Choose a field</option>
            {review.targets.map((target) => (
              <option key={target.key} value={target.key}>
                {target.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending || !ready}
          onClick={onConfirm}
          className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
        >
          Publish mapped CSV
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-warm-600 hover:text-ink">
          Cancel
        </button>
      </div>
    </div>
  )
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
  const [pendingMap, setPendingMap] = useState<PendingMap | null>(null)
  const [choices, setChoices] = useState<Record<string, string>>({})

  function showReview(next: PendingMap) {
    setPendingMap(next)
    setChoices(Object.fromEntries(next.review.columns.map((column) => [column.source, column.suggested ?? ''])))
  }

  async function publishMapped() {
    if (!pendingMap) return
    setPending(true)
    const body = new FormData()
    Object.entries(pendingMap.fields).forEach(([key, value]) => body.set(key, value))
    body.set('file', pendingMap.file)
    body.set(
      'mapping',
      JSON.stringify(pendingMap.review.columns.map((column) => ({ source: column.source, target: choices[column.source] ?? '' }))),
    )
    const setIssues = pendingMap.action === 'create' ? setCreateIssues : setImportIssues
    const setMessage = pendingMap.action === 'create' ? setCreateMessage : setImportMessage
    setIssues([])
    const result = await postCustomers(body)
    setPending(false)
    if (result.needsMapping && result.review) {
      showReview({ ...pendingMap, review: result.review })
      setIssues(result.errors ?? [])
      return
    }
    if (!result.ok) {
      setIssues(result.errors ?? [{ message: 'The customer could not be saved.' }])
      return
    }
    setPendingMap(null)
    setMessage(resultMessage(result))
    router.refresh()
  }

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
            const form = event.currentTarget
            const file = (form.elements.namedItem('file') as HTMLInputElement).files?.[0] ?? null
            setPending(true)
            setCreateIssues([])
            setCreateMessage('')
            const result = await postCustomers(new FormData(form))
            setPending(false)
            if (result.needsMapping && result.review && file) {
              showReview({ action: 'create', file, fields: formFields(form), review: result.review })
              setCreateIssues(result.errors ?? [])
              return
            }
            if (!result.ok) {
              setCreateIssues(result.errors ?? [{ message: 'The customer could not be saved.' }])
              return
            }
            setPendingMap(null)
            setCreateMessage(resultMessage(result))
            form.reset()
            router.refresh()
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
          {pendingMap?.action === 'create' ? (
            <MappingPanel
              review={pendingMap.review}
              choices={choices}
              pending={pending}
              onChoice={(source, target) => setChoices((current) => ({ ...current, [source]: target }))}
              onConfirm={publishMapped}
              onCancel={() => setPendingMap(null)}
            />
          ) : null}
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
              const form = event.currentTarget
              const file = (form.elements.namedItem('file') as HTMLInputElement).files?.[0] ?? null
              setPending(true)
              setImportIssues([])
              setImportMessage('')
              const result = await postCustomers(new FormData(form))
              setPending(false)
              if (result.needsMapping && result.review && file) {
                showReview({ action: 'import', file, fields: formFields(form), review: result.review })
                setImportIssues(result.errors ?? [])
                return
              }
              if (!result.ok) {
                setImportIssues(result.errors ?? [{ message: 'The customer could not be saved.' }])
                return
              }
              setPendingMap(null)
              setImportMessage(resultMessage(result))
              form.reset()
              router.refresh()
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
              A baseline CSV publishes immediately. Any other column name stops for a mapping. Ratings are whole numbers from 1 to
              5. Blank, N/A, and Don&apos;t know are skipped, not stored as zero.
            </p>
            <Issues issues={importIssues} />
            {pendingMap?.action === 'import' ? (
              <MappingPanel
                review={pendingMap.review}
                choices={choices}
                pending={pending}
                onChoice={(source, target) => setChoices((current) => ({ ...current, [source]: target }))}
                onConfirm={publishMapped}
                onCancel={() => setPendingMap(null)}
              />
            ) : null}
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
