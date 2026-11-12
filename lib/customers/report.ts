import { CustomerDataError, isSafeSlug, readableOrganizations } from '@/lib/customers/access'
import { buildBaselineReport } from '@/lib/customers/baseline-report'
import { buildDemotechReport } from '@/lib/customers/demotech-report'
import { buildEmptyReport } from '@/lib/customers/empty-report'
import { readCatalog, readRevision, readWorkspace } from '@/lib/customers/store'
import type { Catalog, CustomerSummary, OrganizationRecord, UserRecord, WorkspaceFile, WorkspaceReport } from '@/lib/customers/types'

export type SelectedWorkspace = {
  organization: OrganizationRecord
  workspace: WorkspaceFile
  catalog: Catalog
  customers: CustomerSummary[]
}

/**
 * The same customer choice the leadership pages use.
 * Strict mode refuses an unknown or unauthorized slug instead of falling back.
 * It does not read revision files.
 */
export function selectWorkspace(input: {
  root: string
  user: UserRecord
  slug?: string
  strict?: boolean
}): SelectedWorkspace {
  const catalog = readCatalog(input.root)
  const readable = readableOrganizations(input.user, catalog)
  if (!readable.length) throw new CustomerDataError('No customer access.', 403)

  const requested = input.slug?.trim()
  let organization = requested ? catalog.organizations.find((candidate) => candidate.slug === requested) : undefined
  if (requested && (!isSafeSlug(requested) || !organization)) {
    if (input.strict) throw new CustomerDataError('Unknown customer.', 404)
    organization = undefined
  }
  if (organization && !readable.some((candidate) => candidate.id === organization?.id)) {
    if (input.strict) throw new CustomerDataError('You do not have access to that customer.', 403)
    organization = undefined
  }
  if (!organization) organization = readable.find((candidate) => candidate.slug === 'demotech') ?? readable[0]

  const customers: CustomerSummary[] = readable.map((candidate) => ({
    slug: candidate.slug,
    name: candidate.name,
    isDemo: candidate.isDemo,
  }))
  const workspace = readWorkspace(input.root, organization.slug)
  return { organization, workspace, catalog, customers }
}

export function buildReport(input: {
  root: string
  user: UserRecord
  slug?: string
  strict?: boolean
}): WorkspaceReport {
  const { organization, workspace, customers } = selectWorkspace(input)
  if (workspace.project.templateKey === 'demotech-pulse' && workspace.activeRevisionId) {
    return buildDemotechReport(organization, customers)
  }
  if (!workspace.activeRevisionId) return buildEmptyReport(organization, customers)

  const waves = workspace.revisions.map((meta) => ({
    meta,
    submissions: readRevision(input.root, organization.slug, meta.id).submissions,
  }))
  return buildBaselineReport({
    organization,
    customers,
    waves,
    activeRevisionId: workspace.activeRevisionId,
  })
}
