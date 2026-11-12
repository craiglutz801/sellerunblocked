import { buildBenchmark, buildMockPillars, buildStageFriction } from '@/lib/data/demotech/aggregates'
import { DEMOTECH_CYCLE, PILLAR_QUESTION_MAP, STAGE_QUESTIONS } from '@/lib/data/demotech/config'
import { getAllResponses } from '@/lib/data/demotech/load'
import { meanIndex } from '@/lib/customers/metrics'
import { PILLAR_LABELS, RATING_COLUMNS, ratingsForPillar } from '@/lib/customers/schema'
import { readRevision } from '@/lib/customers/store'
import type { OrganizationRecord, RevisionMeta, StoredSubmission, WorkspaceFile } from '@/lib/customers/types'
import { redactSellerText } from '@/lib/unblocked-ai/redact'
import type { PillarKey } from '@/lib/types/platform'

export type WaveComment = {
  questionKey: string
  questionLabel: string
  text: string
}

export type WaveRow = {
  responseId: string
  contributorKey: string
  role: string
  region: string
  ratings: Record<PillarKey, Array<number | null>>
  comments: WaveComment[]
}

export type PillarSnapshot = {
  score: number | null
  validCount: number
}

export type PriorLink = {
  revisionId: string
  period: string
  kind: 'wave' | 'revision' | 'demo_series'
  sampleKnown: boolean
  pillars: Partial<Record<PillarKey, PillarSnapshot>>
  demoDelta?: Partial<Record<PillarKey, number>>
}

export type WaveData = {
  organizationId: string
  organizationName: string
  workspaceSlug: string
  projectId: string
  datasetId: string
  revisionId: string
  templateKey: 'seller-baseline' | 'demotech-pulse'
  isDemo: boolean
  period: string
  publishedAt: string
  textProcessing: boolean
  commentsWithheld: boolean
  rows: WaveRow[]
  prior: PriorLink | null
  benchmark: {
    available: boolean
    demo: boolean
    yourScore: number | null
    peerMedian: number | null
    label: string
  }
  stages: { name: string; score: number; validCount: number }[]
  listedIds: Set<string>
}

const PILLARS = Object.keys(PILLAR_LABELS) as PillarKey[]

export function questionFor(pillar: PillarKey): { key: string; prompt: string } {
  const column = RATING_COLUMNS.find((item) => item.pillar === pillar)
  return {
    key: column?.key ?? pillar,
    prompt: column?.prompt ?? PILLAR_LABELS[pillar],
  }
}

export function measurePillar(rows: WaveRow[], pillar: PillarKey): PillarSnapshot & { eligibleCount: number } {
  const values = rows.flatMap((row) => row.ratings[pillar] ?? [])
  const validCount = values.filter((value) => value != null && Number.isFinite(value)).length
  return {
    score: meanIndex(values),
    validCount,
    eligibleCount: rows.length,
  }
}

export function distinctContributors(rows: WaveRow[]): number {
  return new Set(rows.map((row) => row.contributorKey)).size
}

function emptyRatings(): Record<PillarKey, Array<number | null>> {
  return {
    process: [],
    tools: [],
    enablement: [],
    alignment: [],
    support: [],
    compensation: [],
  }
}

function dateSpan(dates: Array<string | null>): string | null {
  const present = dates.filter((date): date is string => Boolean(date)).sort()
  if (!present.length) return null
  if (present[0] === present[present.length - 1]) return present[0]
  return `${present[0]} – ${present[present.length - 1]}`
}

function spansOverlap(current: StoredSubmission[], prior: StoredSubmission[]): boolean {
  const left = dateSpan(current.map((row) => row.responseDate))
  const right = dateSpan(prior.map((row) => row.responseDate))
  if (!left || !right) return true
  const [leftStart, leftEnd] = left.split(' – ')
  const [rightStart, rightEnd] = right.split(' – ')
  const a0 = leftStart
  const a1 = leftEnd ?? leftStart
  const b0 = rightStart
  const b1 = rightEnd ?? rightStart
  return a0 <= b1 && b0 <= a1
}

function contributorOf(respondentId: string, responseId: string): string {
  const respondent = respondentId.trim()
  return respondent ? `respondent:${respondent}` : `response:${responseId}`
}

function baselineRow(submission: StoredSubmission, textProcessing: boolean): WaveRow {
  const ratings = emptyRatings()
  for (const pillar of PILLARS) {
    ratings[pillar] = ratingsForPillar(pillar).map((key) => submission.ratings[key])
  }
  const comments: WaveComment[] = []
  const raw = submission.openFriction.trim()
  if (textProcessing && raw) {
    comments.push({
      questionKey: 'open_friction',
      questionLabel: 'Open comment',
      text: redactSellerText(raw),
    })
  }
  return {
    responseId: submission.responseId,
    contributorKey: contributorOf(submission.respondentId, submission.responseId),
    role: submission.role.trim(),
    region: submission.region.trim(),
    ratings,
    comments,
  }
}

function priorPillars(rows: WaveRow[]): Partial<Record<PillarKey, PillarSnapshot>> {
  const pillars = {} as Partial<Record<PillarKey, PillarSnapshot>>
  for (const pillar of PILLARS) {
    const measure = measurePillar(rows, pillar)
    pillars[pillar] = { score: measure.score, validCount: measure.validCount }
  }
  return pillars
}

export function loadWave(root: string, organization: OrganizationRecord, workspace: WorkspaceFile): WaveData | null {
  if (!workspace.activeRevisionId) return null
  if (workspace.project.templateKey === 'demotech-pulse') return loadDemotech(organization, workspace)
  return loadBaseline(root, organization, workspace)
}

function loadBaseline(root: string, organization: OrganizationRecord, workspace: WorkspaceFile): WaveData {
  const revisionId = workspace.activeRevisionId as string
  const currentMeta = workspace.revisions.find((revision) => revision.id === revisionId) ?? workspace.revisions[workspace.revisions.length - 1]
  const current = readRevision(root, organization.slug, currentMeta.id)
  const textProcessing = workspace.settings?.textProcessing !== false
  const rawComments = current.submissions.some((submission) => submission.openFriction.trim())
  const rows = current.submissions.map((submission) => baselineRow(submission, textProcessing))
  const priorMeta = [...workspace.revisions]
    .filter((revision) => revision.id !== currentMeta.id)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]
  return {
    organizationId: organization.id,
    organizationName: organization.name,
    workspaceSlug: organization.slug,
    projectId: workspace.project.id,
    datasetId: workspace.dataset.id,
    revisionId: currentMeta.id,
    templateKey: 'seller-baseline',
    isDemo: false,
    period: dateSpan(current.submissions.map((submission) => submission.responseDate)) ?? workspace.dataset.periodLabel,
    publishedAt: currentMeta.publishedAt,
    textProcessing,
    commentsWithheld: !textProcessing && rawComments,
    rows,
    prior: priorMeta ? loadPrior(root, organization.slug, current.submissions, currentMeta, priorMeta) : null,
    benchmark: {
      available: false,
      demo: false,
      yourScore: null,
      peerMedian: null,
      label: 'Peer benchmark unavailable for this workspace.',
    },
    stages: [],
    listedIds: new Set(current.submissions.slice(0, 100).map((submission) => submission.responseId)),
  }
}

function loadPrior(
  root: string,
  slug: string,
  currentRows: StoredSubmission[],
  currentMeta: RevisionMeta,
  priorMeta: RevisionMeta,
): PriorLink {
  const prior = readRevision(root, slug, priorMeta.id)
  const rows = prior.submissions.map((submission) => baselineRow(submission, false))
  const shared = prior.submissions.some((submission) => currentRows.some((row) => row.responseId === submission.responseId))
  const overlap = spansOverlap(currentRows, prior.submissions)
  const kind = shared || overlap || currentMeta.mode === 'append' || priorMeta.mode === 'append' ? 'revision' : 'wave'
  return {
    revisionId: priorMeta.id,
    period: dateSpan(prior.submissions.map((submission) => submission.responseDate)) ?? priorMeta.publishedAt.slice(0, 10),
    kind,
    sampleKnown: true,
    pillars: priorPillars(rows),
  }
}

function loadDemotech(organization: OrganizationRecord, workspace: WorkspaceFile): WaveData {
  const responses = getAllResponses()
  const textProcessing = workspace.settings?.textProcessing !== false
  const rows = responses.map((row) => {
    const ratings = emptyRatings()
    for (const pillar of PILLARS) {
      ratings[pillar] = PILLAR_QUESTION_MAP[pillar].map((id) => {
        const value = Number(row[id])
        return Number.isFinite(value) ? value : null
      })
    }
    const comments: WaveComment[] = []
    if (textProcessing) {
      for (const key of ['L1', 'L2', 'L3'] as const) {
        const raw = String(row[key] ?? '').trim()
        if (!raw) continue
        comments.push({ questionKey: key, questionLabel: 'Open comment', text: redactSellerText(raw) })
      }
    }
    const employee = String(row.employee_id ?? '').trim()
    return {
      responseId: String(row.response_id),
      contributorKey: employee ? `respondent:${employee}` : `response:${row.response_id}`,
      role: String(row.title ?? '').trim(),
      region: String(row.location ?? '').trim(),
      ratings,
      comments,
    }
  })
  const reportPillars = buildMockPillars()
  const benchmark = buildBenchmark()
  const stages = buildStageFriction().map((stage) => ({
    name: stage.stage,
    score: stage.score,
    validCount: responses.length,
  }))
  const listed = new Set(
    responses
      .filter((row) => String(row.L1 ?? '').trim())
      .slice(0, 40)
      .map((row) => String(row.response_id)),
  )
  return {
    organizationId: organization.id,
    organizationName: organization.name,
    workspaceSlug: organization.slug,
    projectId: workspace.project.id,
    datasetId: workspace.dataset.id,
    revisionId: workspace.activeRevisionId as string,
    templateKey: 'demotech-pulse',
    isDemo: true,
    period: workspace.dataset.periodLabel || DEMOTECH_CYCLE.period,
    publishedAt: '2025-06-01T00:00:00.000Z',
    textProcessing,
    commentsWithheld: false,
    rows,
    prior: {
      revisionId: 'demo-series',
      period: 'Earlier DemoTech demo series',
      kind: 'demo_series',
      sampleKnown: false,
      pillars: {},
      demoDelta: Object.fromEntries(reportPillars.map((pillar) => [pillar.key, pillar.deltaCycle])) as Partial<
        Record<PillarKey, number>
      >,
    },
    benchmark: {
      available: true,
      demo: true,
      yourScore: benchmark.yourScore,
      peerMedian: benchmark.peerMedian,
      label: 'Demo benchmark. These peer figures exist only inside the DemoTech workspace.',
    },
    stages,
    listedIds: listed,
  }
}

export function overallIndex(rows: WaveRow[]): { score: number | null; pillars: number } {
  const scores = PILLARS.map((pillar) => measurePillar(rows, pillar).score).filter((score): score is number => score != null)
  if (!scores.length) return { score: null, pillars: 0 }
  return {
    score: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
    pillars: scores.length,
  }
}
