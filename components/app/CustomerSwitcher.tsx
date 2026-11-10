'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { CustomerSummary } from '@/lib/customers/types'

export default function CustomerSwitcher({
  customers,
  activeSlug,
}: {
  customers: CustomerSummary[]
  activeSlug: string
}) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function onChange(slug: string) {
    setPending(true)
    try {
      const response = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!response.ok) {
        const body = (await response.json()) as { errors?: { message: string }[] }
        window.alert(body.errors?.[0]?.message ?? 'The workspace could not be switched.')
        return
      }
      router.refresh()
    } finally {
      setPending(false)
    }
  }

  return (
    <label className="min-w-0">
      <span className="sr-only">Customer</span>
      <select
        key={activeSlug}
        defaultValue={activeSlug}
        disabled={pending}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-[9.5rem] truncate rounded-full border border-warm-400/40 bg-white px-3 py-1.5 text-xs font-semibold text-ink sm:max-w-[14rem]"
      >
        {customers.map((customer) => (
          <option key={customer.slug} value={customer.slug}>
            {customer.name}
            {customer.isDemo ? ' · Demo' : ''}
          </option>
        ))}
      </select>
    </label>
  )
}
