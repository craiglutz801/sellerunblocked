import type { Metadata } from 'next'
import ExecShell from '@/components/app/ExecShell'
import { loadReport } from '@/lib/customers/active'
import { loadAssistantFrame } from '@/lib/unblocked-ai/readout'

export const metadata: Metadata = {
  title: 'Leadership',
}

export const dynamic = 'force-dynamic'

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  const report = loadReport()
  const frame = loadAssistantFrame()
  return (
    <ExecShell cycle={report.cycle} badge={report.badge} customers={report.customers} activeSlug={report.slug} frame={frame}>
      {children}
    </ExecShell>
  )
}
