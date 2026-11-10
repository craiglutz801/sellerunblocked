import SectionHeader from '@/components/app/SectionHeader'
import CustomerAdmin from '@/components/app/CustomerAdmin'
import { loadReport } from '@/lib/customers/active'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function SettingsPage() {
  const report = loadReport()
  return (
    <>
      <SectionHeader
        eyebrow="Settings"
        title="Add a customer"
        description="A new customer gets its own account, membership, and published wave. Dashboards read that wave. They do not fall back to DemoTech."
      />
      <CustomerAdmin
        customers={report.customers}
        active={{
          slug: report.slug,
          name: report.organizationName,
          industry: report.industry,
          isDemo: report.isDemo,
          published: report.published,
          submissionCount: report.submissionCount,
          revisionId: report.revisionId,
          templateKey: report.templateKey,
        }}
      />
    </>
  )
}
