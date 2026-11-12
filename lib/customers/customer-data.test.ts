import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { CustomerDataError } from '@/lib/customers/access'
import { MappingRequiredError } from '@/lib/customers/csv'
import { meanIndex, ratingToIndex } from '@/lib/customers/metrics'
import { buildReport } from '@/lib/customers/report'
import {
  createCustomer,
  customerRoot,
  demoCatalog,
  importCsv,
  operatorUser,
  readCatalog,
  readWorkspace,
  writeDemoSeed,
} from '@/lib/customers/store'
import type { UserRecord } from '@/lib/customers/types'

const firstWave = `response_id,region,role,process_clarity,tool_burden,support_speed,open_friction
A-1,North,AE,4,2,N/A,Legal review is slow
A-2,South,AE,4,,1,CRM is heavy
`
const sameWave = firstWave
const secondWave = `response_id,region,role,process_clarity,tool_burden,support_speed
B-1,North,AE,5,5,5
`
const badWave = `response_id,process_clarity
A-9,6
`
const partial = `response_id,process_clarity,tool_burden
P-1,5,1
`

function tempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'su-customers-'))
  writeDemoSeed(root)
  return root
}

test('a rating of 4 on a 1–5 scale is 75', () => {
  assert.equal(ratingToIndex(4, 1, 5, true), 75)
  assert.equal(ratingToIndex(2, 1, 5, true), 25)
  assert.equal(ratingToIndex(2, 1, 5, false), 75)
})

test('missing answers are excluded and an empty set is not zero', () => {
  assert.equal(meanIndex([4, null, undefined]), 75)
  assert.equal(meanIndex([null, undefined]), null)
  assert.equal(meanIndex([]), null)
  assert.throws(() => ratingToIndex(6, 1, 5, true), /outside the scale/)
})

test('customers do not share responses and an empty customer has no demo data', () => {
  const root = tempRoot()
  const admin = operatorUser(root)
  const alpha = createCustomer(root, admin, {
    name: 'Alpha Co',
    industry: 'Software',
    contactName: 'Ada Admin',
    contactEmail: 'ada@alpha.example',
    csv: firstWave,
    sourceName: 'alpha.csv',
  })
  const beta = createCustomer(root, admin, {
    name: 'Beta Co',
    industry: 'Services',
    contactName: 'Ben Admin',
    contactEmail: 'ben@beta.example',
    csv: secondWave,
  })
  const empty = createCustomer(root, admin, {
    name: 'Empty Co',
    industry: 'Hardware',
    contactName: 'Eve Admin',
    contactEmail: 'eve@empty.example',
  })

  const alphaReport = buildReport({ root, user: admin, slug: alpha.organization.slug, strict: true })
  const betaReport = buildReport({ root, user: admin, slug: beta.organization.slug, strict: true })
  const emptyReport = buildReport({ root, user: admin, slug: empty.organization.slug, strict: true })

  assert.deepEqual(alphaReport.responses.map((row) => row.id).sort(), ['A-1', 'A-2'])
  assert.deepEqual(betaReport.responses.map((row) => row.id), ['B-1'])
  assert.equal(betaReport.responses.some((row) => row.id.startsWith('A-')), false)
  assert.notEqual(alphaReport.health.score, betaReport.health.score)
  assert.equal(alphaReport.benchmark.available, false)
  assert.equal(alphaReport.benchmark.peerMedian, null)
  assert.equal(emptyReport.published, false)
  assert.equal(emptyReport.responses.length, 0)
  assert.equal(emptyReport.pillars.length, 0)
  assert.equal(emptyReport.recommendations.length, 0)
  assert.equal(emptyReport.actions.length, 0)
  assert.equal(emptyReport.summary.includes('DemoTech'), false)
  assert.equal(emptyReport.health.score, null)

  const catalog = readCatalog(root)
  const ada = catalog.users.find((user) => user.email === 'ada@alpha.example')
  assert.ok(ada)
  assert.throws(
    () => buildReport({ root, user: ada, slug: beta.organization.slug, strict: true }),
    (error: unknown) => error instanceof CustomerDataError && error.status === 403,
  )
  const own = buildReport({ root, user: ada, slug: alpha.organization.slug, strict: true })
  assert.equal(own.organizationName, 'Alpha Co')

  const stranger: UserRecord = { id: 'user_stranger', email: 'nope@example.com', name: 'No Access', status: 'active' }
  assert.throws(
    () => buildReport({ root, user: stranger, slug: alpha.organization.slug, strict: true }),
    (error: unknown) => error instanceof CustomerDataError && error.status === 403,
  )
})

test('replace is idempotent, invalid rows do not publish, and append keeps the prior revision', () => {
  const root = tempRoot()
  const admin = operatorUser(root)
  const created = createCustomer(root, admin, {
    name: 'Retry Co',
    industry: 'Software',
    contactName: 'Rita Admin',
    contactEmail: 'rita@retry.example',
    csv: firstWave,
  })
  const again = importCsv(root, admin, { slug: created.organization.slug, csv: sameWave, mode: 'replace' })
  assert.equal(again.idempotent, true)
  assert.equal(again.revisionId, created.revisionId)
  assert.equal(readWorkspace(root, created.organization.slug).revisions.length, 1)

  assert.throws(
    () => importCsv(root, admin, { slug: created.organization.slug, csv: badWave, mode: 'replace' }),
    (error: unknown) => error instanceof CustomerDataError && error.errors.some((issue) => issue.column === 'process_clarity'),
  )
  assert.equal(readWorkspace(root, created.organization.slug).activeRevisionId, created.revisionId)
  assert.equal(readWorkspace(root, created.organization.slug).revisions.length, 1)

  const appended = importCsv(root, admin, { slug: created.organization.slug, csv: secondWave, mode: 'append' })
  assert.equal(appended.idempotent, false)
  assert.equal(appended.submissionCount, 3)
  assert.equal(readWorkspace(root, created.organization.slug).revisions.length, 2)
  assert.equal(fs.existsSync(path.join(root, created.organization.slug, 'revisions', `${created.revisionId}.json`)), true)
  const replay = importCsv(root, admin, { slug: created.organization.slug, csv: secondWave, mode: 'append' })
  assert.equal(replay.idempotent, true)
  assert.equal(readWorkspace(root, created.organization.slug).revisions.length, 2)

  const viewer: UserRecord = { id: 'user_viewer', email: 'view@retry.example', name: 'Viewer', status: 'active' }
  const catalog = readCatalog(root)
  catalog.users.push(viewer)
  catalog.memberships.push({
    id: 'mem_viewer',
    userId: viewer.id,
    organizationId: created.organization.id,
    role: 'viewer',
  })
  fs.writeFileSync(path.join(root, 'catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`)
  assert.throws(
    () => importCsv(root, viewer, { slug: created.organization.slug, csv: partial, mode: 'replace' }),
    (error: unknown) => error instanceof CustomerDataError && error.status === 403,
  )
})

test('a pillar with no valid answers is left out of the index', () => {
  const root = tempRoot()
  const admin = operatorUser(root)
  const created = createCustomer(root, admin, {
    name: 'Partial Co',
    industry: 'Software',
    contactName: 'Pat Admin',
    contactEmail: 'pat@partial.example',
    csv: partial,
  })
  const report = buildReport({ root, user: admin, slug: created.organization.slug, strict: true })
  assert.equal(report.health.score, 50)
  const process = report.pillars.find((pillar) => pillar.key === 'process')
  const tools = report.pillars.find((pillar) => pillar.key === 'tools')
  const support = report.pillars.find((pillar) => pillar.key === 'support')
  assert.equal(process?.score, 100)
  assert.equal(tools?.score, 0)
  assert.equal(support?.available, false)
  assert.equal(report.benchmark.release, 'none')
})

test('an unfamiliar header waits for a mapping and a saved mapping publishes the next match', () => {
  const root = tempRoot()
  const admin = operatorUser(root)
  const unfamiliar = `response_id,process_clarity,team_name
M-1,4,West
`
  assert.throws(
    () =>
      createCustomer(root, admin, {
        name: 'Mapped Co',
        industry: 'Software',
        contactName: 'Mia Admin',
        contactEmail: 'mia@mapped.example',
        csv: unfamiliar,
      }),
    (error: unknown) => error instanceof MappingRequiredError && error.review.columns.some((column) => column.source === 'team_name'),
  )
  assert.equal(readCatalog(root).organizations.some((organization) => organization.slug === 'mapped-co'), false)

  const created = createCustomer(root, admin, {
    name: 'Mapped Co',
    industry: 'Software',
    contactName: 'Mia Admin',
    contactEmail: 'mia@mapped.example',
    csv: unfamiliar,
    mapping: [
      { source: 'response_id', target: 'response_id' },
      { source: 'process_clarity', target: 'process_clarity' },
      { source: 'team_name', target: 'ignore' },
    ],
  })
  const report = buildReport({ root, user: admin, slug: created.organization.slug, strict: true })
  assert.equal(report.health.score, 75)
  assert.equal(report.responses[0]?.excerpt.includes('West'), false)

  const again = importCsv(root, admin, { slug: created.organization.slug, csv: unfamiliar, mode: 'replace' })
  assert.equal(again.idempotent, true)
  assert.equal(readWorkspace(root, created.organization.slug).revisions.length, 1)

  const renamed = `resp,clarity
R-1,4
`
  const renamedImport = importCsv(root, admin, {
    slug: created.organization.slug,
    csv: renamed,
    mode: 'replace',
    mapping: [
      { source: 'resp', target: 'response_id' },
      { source: 'clarity', target: 'process_clarity' },
    ],
  })
  assert.equal(renamedImport.submissionCount, 1)
  assert.equal(buildReport({ root, user: admin, slug: created.organization.slug, strict: true }).health.score, 75)

  const extra = `resp,clarity,note
R-2,5,Pricing exceptions take too long
`
  assert.throws(
    () => importCsv(root, admin, { slug: created.organization.slug, csv: extra, mode: 'replace' }),
    (error: unknown) => error instanceof MappingRequiredError,
  )
  assert.equal(readWorkspace(root, created.organization.slug).activeRevisionId, renamedImport.revisionId)

  assert.throws(
    () => importCsv(customerRoot(), admin, { slug: 'demotech', csv: unfamiliar, mode: 'replace' }),
    /seeded pulse/,
  )
})

test('the seeded catalog is the demo customer and imports cannot overwrite it', () => {
  const catalog = readCatalog(customerRoot())
  assert.deepEqual(catalog, demoCatalog())
  const admin = operatorUser(customerRoot())
  const report = buildReport({ root: customerRoot(), user: admin, slug: 'demotech', strict: true })
  assert.equal(report.isDemo, true)
  assert.equal(report.published, true)
  assert.equal(report.benchmark.release, 'demo')
  assert.equal(report.submissionCount, 500)
  assert.throws(
    () => importCsv(customerRoot(), admin, { slug: 'demotech', csv: firstWave, mode: 'replace' }),
    /seeded pulse/,
  )
})
