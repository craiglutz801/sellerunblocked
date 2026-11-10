import type { Metadata } from 'next'
import ExecShell from '@/components/app/ExecShell'
import { loadReport } from '@/lib/customers/active'

export const metadata: Metadata = {
  title: 'Leadership',
}

export const dynamic = 'force-dynamic'

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  const report = loadReport()
  return (
    <ExecShell cycle={report.cycle} badge={report.badge} customers={report.customers} activeSlug={report.slug}>
      {children}
    </ExecShell>
  )
}
