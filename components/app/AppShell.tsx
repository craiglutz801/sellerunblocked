'use client'

import { useState } from 'react'
import type { MeasurementCycle } from '@/lib/types/platform'
import { EXEC_PORTAL } from '@/lib/nav/exec'
import { REP_PORTAL } from '@/lib/nav/rep'
import AppSidebar from '@/components/app/AppSidebar'
import AppTopbar from '@/components/app/AppTopbar'

export type PortalId = 'exec' | 'rep'

const PORTAL_META = {
  exec: EXEC_PORTAL,
  rep: REP_PORTAL,
} as const

type Props = {
  portal: PortalId
  cycle: MeasurementCycle
  portalBadge?: string
  topbarExtra?: React.ReactNode
  children: React.ReactNode
}

export default function AppShell({ portal, cycle, portalBadge, topbarExtra, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const meta = PORTAL_META[portal]

  return (
    <div className="product-shell min-h-screen flex text-ink">
      <AppSidebar
        portal={portal}
        portalHomeHref={meta.homeHref}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 md:pl-0 app-shell-main">
        <AppTopbar
          cycle={cycle}
          portalBadge={portalBadge ?? meta.badge}
          onMenu={() => setMobileOpen(true)}
          extra={topbarExtra}
        />
        <div className="flex-1 px-4 py-8 sm:px-6 md:px-9 lg:px-11">
          <div className="max-w-[1440px] mx-auto w-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
