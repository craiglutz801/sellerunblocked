'use client'

import AppShell from '@/components/app/AppShell'
import CustomerSwitcher from '@/components/app/CustomerSwitcher'
import UnblockedAiProvider, { useUnblockedAi } from '@/components/app/unblocked-ai/assistant'
import { AskLauncher } from '@/components/app/unblocked-ai/AskButton'
import type { AssistantFrame } from '@/lib/unblocked-ai/types'
import type { CustomerSummary } from '@/lib/customers/types'
import type { MeasurementCycle } from '@/lib/types/platform'

export default function ExecShell({
  children,
  cycle,
  badge,
  customers,
  activeSlug,
  frame,
}: {
  children: React.ReactNode
  cycle: MeasurementCycle
  badge: string
  customers: CustomerSummary[]
  activeSlug: string
  frame: AssistantFrame
}) {
  return (
    <UnblockedAiProvider frame={frame}>
      <ExecFrame cycle={cycle} badge={badge} customers={customers} activeSlug={activeSlug}>
        {children}
      </ExecFrame>
    </UnblockedAiProvider>
  )
}

function ExecFrame({
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
  const ai = useUnblockedAi()
  return (
    <AppShell
      portal="exec"
      cycle={cycle}
      portalBadge={badge}
      topbarExtra={
        <>
          <CustomerSwitcher customers={customers} activeSlug={activeSlug} onBeforeChange={() => ai.clearNow()} />
          <AskLauncher />
        </>
      }
    >
      {children}
    </AppShell>
  )
}
