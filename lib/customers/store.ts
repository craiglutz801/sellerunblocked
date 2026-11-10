import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'
import { assertCanAdmin, CustomerDataError, isSafeSlug } from '@/lib/customers/access'
import { parseBaselineCsv, submissionHash } from '@/lib/customers/csv'
import { BASELINE_TEMPLATE, DEMO_TEMPLATE, MAX_IMPORT_BYTES } from '@/lib/customers/schema'
import type {
  Catalog,
  ImportIssue,
  ImportMode,
  OrganizationRecord,
  RevisionMeta,
  RevisionPayload,
  StoredSubmission,
  UserRecord,
  WorkspaceFile,
} from '@/lib/customers/types'

export const OPERATOR_ID = 'user_operator'

export function customerRoot(): string {
  return path.join(process.cwd(), 'data', 'customers')
}

export function demoCatalog(): Catalog {
  return {
    users: [
      {
        id: OPERATOR_ID,
        email: 'operator@sellerunblocked.local',
        name: 'Workspace operator',
        status: 'active',
        platformAdmin: true,
      },
    ],
    organizations: [
      {
        id: 'org_demotech',
        name: 'DemoTech',
        slug: 'demotech',
        status: 'active',
        industry: 'B2B software',
        sellerCountBand: '500',
        region: 'North America',
        benchmarkEligible: false,
        isDemo: true,
        createdAt: '2025-04-01T00:00:00.000Z',
        createdBy: OPERATOR_ID,
      },
    ],
    memberships: [
      {
        id: 'mem_operator_demotech',
        userId: OPERATOR_ID,
        organizationId: 'org_demotech',
        role: 'admin',
      },
    ],
  }
}

export function demoWorkspace(): WorkspaceFile {
  return {
    project: {
      id: 'prj_demotech',
      name: 'Revenue org pulse',
      templateKey: DEMO_TEMPLATE,
      status: 'active',
    },
    dataset: {
      id: 'ds_demotech_q2_2025',
      name: 'Q2 2025 pulse',
      periodLabel: 'Apr 1 — May 31, 2025',
    },
    activeRevisionId: 'rev_demotech_q2_2025',
    revisions: [
      {
        id: 'rev_demotech_q2_2025',
        templateKey: DEMO_TEMPLATE,
        status: 'published',
        publishedAt: '2025-06-01T00:00:00.000Z',
        publishedBy: 'operator@sellerunblocked.local',
        submissionCount: 500,
        contentHash: 'demotech-responses-json',
        mode: 'seed',
        sourceName: 'lib/data/demotech/responses.json',
      },
    ],
  }
}

function orgDir(root: string, slug: string): string {
  if (!isSafeSlug(slug)) throw new CustomerDataError('Invalid customer id.')
  const dir = path.resolve(root, slug)
  const base = path.resolve(root)
  if (dir !== base && !dir.startsWith(base + path.sep)) throw new CustomerDataError('Invalid customer id.')
  return dir
}

function writeJson(file: string, value: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`)
  fs.renameSync(tmp, file)
}

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, 'utf8')) as T
}

export function writeDemoSeed(root: string) {
  writeJson(path.join(root, 'catalog.json'), demoCatalog())
  writeJson(path.join(root, 'demotech', 'workspace.json'), demoWorkspace())
}

export function readCatalog(root: string): Catalog {
  return readJson<Catalog>(path.join(root, 'catalog.json'))
}

export function readWorkspace(root: string, slug: string): WorkspaceFile {
  return readJson<WorkspaceFile>(path.join(orgDir(root, slug), 'workspace.json'))
}

export function readRevision(root: string, slug: string, revisionId: string): RevisionPayload {
  if (!/^rev_[a-z0-9_]+$/.test(revisionId)) throw new CustomerDataError('Invalid revision.')
  return readJson<RevisionPayload>(path.join(orgDir(root, slug), 'revisions', `${revisionId}.json`))
}

export function operatorUser(root: string): UserRecord {
  const catalog = readCatalog(root)
  const user = catalog.users.find((candidate) => candidate.id === OPERATOR_ID && candidate.platformAdmin)
  if (!user) throw new CustomerDataError('Workspace operator is missing from the catalog.', 500)
  return user
}

function withLock<T>(root: string, fn: () => T): T {
  fs.mkdirSync(root, { recursive: true })
  const lock = path.join(root, '.lock')
  const started = Date.now()
  for (;;) {
    try {
      fs.mkdirSync(lock)
      break
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code !== 'EEXIST') throw error
      let stale = false
      try {
        stale = Date.now() - fs.statSync(lock).mtimeMs > 30_000
      } catch {
        stale = true
      }
      if (stale) {
        fs.rmSync(lock, { recursive: true, force: true })
        continue
      }
      if (Date.now() - started > 5_000) {
        throw new CustomerDataError('Another customer write is in progress. Try again.', 409)
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 40)
    }
  }
  try {
    return fn()
  } finally {
    fs.rmSync(lock, { recursive: true, force: true })
  }
}

export function slugify(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/g, '')
  if (!isSafeSlug(slug)) throw new CustomerDataError('Use a customer name with at least two letters or numbers.')
  return slug
}

function userIdForEmail(email: string): string {
  return `user_${createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 10)}`
}

function requireField(value: string, label: string, max: number): string {
  const trimmed = value.trim()
  if (trimmed.length < 2) throw new CustomerDataError(`${label} is required.`)
  if (trimmed.length > max) throw new CustomerDataError(`${label} must be ${max} characters or fewer.`)
  return trimmed
}

function periodLabel(submissions: StoredSubmission[]): string {
  const dates = submissions
    .map((submission) => submission.responseDate)
    .filter((date): date is string => Boolean(date))
    .sort()
  if (!dates.length) return 'Undated wave'
  if (dates[0] === dates[dates.length - 1]) return dates[0]
  return `${dates[0]} – ${dates[dates.length - 1]}`
}

export type PublishResult = {
  organization: OrganizationRecord
  revisionId: string | null
  submissionCount: number
  idempotent: boolean
  warnings: ImportIssue[]
}

function publishRevision(
  root: string,
  slug: string,
  workspace: WorkspaceFile,
  submissions: StoredSubmission[],
  mode: ImportMode,
  sourceName: string,
  actorEmail: string,
): { workspace: WorkspaceFile; revisionId: string; idempotent: boolean } {
  const hash = submissionHash(submissions)
  const existing = workspace.revisions.find((revision) => revision.contentHash === hash)
  if (existing) {
    workspace.activeRevisionId = existing.id
    workspace.dataset.periodLabel = periodLabel(submissions)
    return { workspace, revisionId: existing.id, idempotent: true }
  }
  const id = `rev_${hash.slice(0, 12)}`
  const meta: RevisionMeta = {
    id,
    templateKey: BASELINE_TEMPLATE,
    status: 'published',
    publishedAt: new Date().toISOString(),
    publishedBy: actorEmail,
    submissionCount: submissions.length,
    contentHash: hash,
    mode,
    sourceName,
  }
  writeJson(path.join(orgDir(root, slug), 'revisions', `${id}.json`), { id, submissions } satisfies RevisionPayload)
  workspace.revisions.push(meta)
  workspace.activeRevisionId = id
  workspace.dataset.periodLabel = periodLabel(submissions)
  return { workspace, revisionId: id, idempotent: false }
}

export function createCustomer(
  root: string,
  actor: UserRecord,
  input: {
    name: string
    industry: string
    region?: string
    sellerCountBand?: string
    contactName: string
    contactEmail: string
    csv?: string | null
    sourceName?: string
  },
): PublishResult {
  if (actor.status !== 'active' || !actor.platformAdmin) {
    throw new CustomerDataError('Only a platform admin can add a customer.', 403)
  }
  const name = requireField(input.name, 'Customer name', 80)
  const industry = requireField(input.industry, 'Industry', 80)
  const contactName = requireField(input.contactName, 'Admin name', 80)
  const contactEmail = input.contactEmail.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) throw new CustomerDataError('Admin email is not valid.')
  const region = (input.region ?? '').trim().slice(0, 80)
  const sellerCountBand = (input.sellerCountBand ?? '').trim().slice(0, 40)
  const slug = slugify(name)
  let parsedWarnings: ImportIssue[] = []
  let submissions: StoredSubmission[] | null = null
  if (input.csv && input.csv.trim()) {
    if (Buffer.byteLength(input.csv) > MAX_IMPORT_BYTES) {
      throw new CustomerDataError(`CSV is larger than ${MAX_IMPORT_BYTES} bytes.`)
    }
    const parsed = parseBaselineCsv(input.csv)
    if (parsed.errors.length) throw new CustomerDataError('The CSV could not be published.', 400, parsed.errors)
    submissions = parsed.submissions
    parsedWarnings = parsed.warnings
  }

  return withLock(root, () => {
    const catalog = readCatalog(root)
    if (catalog.organizations.some((organization) => organization.slug === slug)) {
      throw new CustomerDataError('A customer with this name already exists.')
    }
    const now = new Date().toISOString()
    const organization: OrganizationRecord = {
      id: `org_${slug}`,
      name,
      slug,
      status: 'active',
      industry,
      sellerCountBand,
      region,
      benchmarkEligible: false,
      isDemo: false,
      createdAt: now,
      createdBy: actor.id,
    }
    const contactId = userIdForEmail(contactEmail)
    if (!catalog.users.some((user) => user.id === contactId)) {
      catalog.users.push({
        id: contactId,
        email: contactEmail,
        name: contactName,
        status: 'active',
      })
    }
    catalog.organizations.push(organization)
    catalog.memberships.push({
      id: `mem_${contactId}_${organization.id}`,
      userId: contactId,
      organizationId: organization.id,
      role: 'admin',
    })
    if (!catalog.memberships.some((membership) => membership.userId === actor.id && membership.organizationId === organization.id)) {
      catalog.memberships.push({
        id: `mem_${actor.id}_${organization.id}`,
        userId: actor.id,
        organizationId: organization.id,
        role: 'admin',
      })
    }

    const workspace: WorkspaceFile = {
      project: {
        id: `prj_${slug}`,
        name: 'Seller baseline',
        templateKey: BASELINE_TEMPLATE,
        status: 'active',
      },
      dataset: {
        id: `ds_${slug}_baseline`,
        name: 'Seller baseline',
        periodLabel: 'Not published',
      },
      activeRevisionId: null,
      revisions: [],
    }
    let revisionId: string | null = null
    let idempotent = false
    if (submissions) {
      const published = publishRevision(root, slug, workspace, submissions, 'replace', input.sourceName || 'upload.csv', actor.email)
      revisionId = published.revisionId
      idempotent = published.idempotent
    }
    writeJson(path.join(orgDir(root, slug), 'workspace.json'), workspace)
    writeJson(path.join(root, 'catalog.json'), catalog)
    return {
      organization,
      revisionId,
      submissionCount: submissions?.length ?? 0,
      idempotent,
      warnings: parsedWarnings,
    }
  })
}

export function importCsv(
  root: string,
  actor: UserRecord,
  input: { slug: string; csv: string; mode: ImportMode; sourceName?: string },
): PublishResult {
  if (!isSafeSlug(input.slug)) throw new CustomerDataError('Unknown customer.', 404)
  if (Buffer.byteLength(input.csv) > MAX_IMPORT_BYTES) {
    throw new CustomerDataError(`CSV is larger than ${MAX_IMPORT_BYTES} bytes.`)
  }
  const parsed = parseBaselineCsv(input.csv)
  if (parsed.errors.length) throw new CustomerDataError('The CSV could not be published.', 400, parsed.errors)

  return withLock(root, () => {
    const catalog = readCatalog(root)
    const organization = catalog.organizations.find((candidate) => candidate.slug === input.slug)
    if (!organization) throw new CustomerDataError('Unknown customer.', 404)
    assertCanAdmin(actor, organization, catalog)
    const workspace = readWorkspace(root, organization.slug)
    if (workspace.project.templateKey !== BASELINE_TEMPLATE) {
      throw new CustomerDataError('DemoTech keeps its seeded pulse. Add a customer for a real baseline.')
    }
    let submissions = parsed.submissions
    if (input.mode === 'append') {
      if (!workspace.activeRevisionId) {
        throw new CustomerDataError('Nothing is published yet. Use replace to publish the first wave.')
      }
      const current = readRevision(root, organization.slug, workspace.activeRevisionId).submissions
      const known = new Set(current.map((submission) => submission.responseId))
      const overlap = submissions.filter((submission) => known.has(submission.responseId))
      if (overlap.length === submissions.length) {
        return {
          organization,
          revisionId: workspace.activeRevisionId,
          submissionCount: current.length,
          idempotent: true,
          warnings: parsed.warnings,
        }
      }
      if (overlap.length) {
        throw new CustomerDataError(
          'Append found response ids that are already published.',
          400,
          overlap.slice(0, 10).map((submission) => ({
            column: 'response_id',
            message: `${submission.responseId} is already in the published wave.`,
          })),
        )
      }
      submissions = [...current, ...submissions]
    }
    const published = publishRevision(
      root,
      organization.slug,
      workspace,
      submissions,
      input.mode,
      input.sourceName || 'upload.csv',
      actor.email,
    )
    writeJson(path.join(orgDir(root, organization.slug), 'workspace.json'), published.workspace)
    return {
      organization,
      revisionId: published.revisionId,
      submissionCount: submissions.length,
      idempotent: published.idempotent,
      warnings: parsed.warnings,
    }
  })
}
