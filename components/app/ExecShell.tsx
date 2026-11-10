'use client'

import AppShell from '@/components/app/AppShell'
import CustomerSwitcher from '@/components/app/CustomerSwitcher'
import type { CustomerSummary } from '@/lib/customers/types'
import type { MeasurementCycle } from '@/lib/types/platform'

export default function ExecShell({
  children,
  cycle,
  badge,
  customers,
  activeSlug,
}: {
  children: React.ReactNode
  cycle: MeasurementCycle
  badge: string
  customers: CustomerSummary[]
  activeSlug: string
}) {
  return (
    <AppShell
      portal="exec"
      cycle={cycle}
      portalBadge={badge}
      topbarExtra={<CustomerSwitcher customers={customers} activeSlug={activeSlug} />}
    >
      {children}
    </AppShell>
  )
}
