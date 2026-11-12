import fs from 'fs'
import path from 'path'
import { createHash } from 'crypto'
import { CustomerDataError, canWriteActions } from '@/lib/customers/access'
import { readCatalog, readRevision, readWorkspace } from '@/lib/customers/store'
import type { Catalog, UserRecord } from '@/lib/customers/types'
import { measurePillar } from '@/lib/unblocked-ai/wave'
import type { ActionItem, PillarKey } from '@/lib/types/platform'

export type SavedAction = {
  id: string
  idempotencyKey: string
  title: string
  promptedBy: string
  ownerFunction: string
  assignee: string
  dueDate: string
  status: ActionItem['status']
  firstStep: string
  measure: string
  baseline: string
  baselineScore: number | null
  baselineValidCount: number | null
  baselineRevisionId: string
  sourceWave: string
  evidenceIds: string[]
  pillarKey?: PillarKey
  recommendationId?: string
  followUpQuestion?: string
  templateKey: string
  createdAt: string
}

export type ActionDraftInput = {
  idempotencyKey: string
  title: string
  promptedBy: string
  ownerFunction: string
  assignee?: string
  dueDate?: string
  firstStep: string
  measure: string
  baseline: string
  baselineScore?: number | null
  baselineValidCount?: number | null
  sourceWave: string
  evidenceIds?: string[]
  pillarKey?: PillarKey
  recommendationId?: string
  followUpQuestion?: string
  workspaceSlug: string
  revisionId: string
}

function actionsPath(root: string, slug: string): string {
  return path.join(root, slug, 'actions.json')
}

export function actionsWritable(root: string): boolean {
  try {
    fs.accessSync(root, fs.constants.W_OK)
    return true
  } catch {
    return false
  }
}

export function readSavedActions(root: string, slug: string): SavedAction[] {
  const file = actionsPath(root, slug)
  if (!fs.existsSync(file)) return []
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as SavedAction[]
  return Array.isArray(parsed) ? parsed : []
}

export function saveAction(root: string, user: UserRecord, input: ActionDraftInput): SavedAction {
  if (!actionsWritable(root)) {
    throw new CustomerDataError('Action storage is not writable in this environment. Copy the draft instead.', 409)
  }
  const catalog = readCatalog(root)
  const organization = catalog.organizations.find((item) => item.slug === input.workspaceSlug)
  if (!organization) throw new CustomerDataError('Unknown customer.', 404)
  if (!canWriteActions(user, organization.id, catalog.memberships)) {
    throw new CustomerDataError('You do not have access to save actions for that customer.', 403)
  }
  const workspace = readWorkspace(root, organization.slug)
  if (workspace.activeRevisionId !== input.revisionId) {
    throw new CustomerDataError("You're viewing a new wave. Ask again to use its results.", 409)
  }
  const key = input.idempotencyKey.trim()
  if (!key || key.length > 80) throw new CustomerDataError('The draft could not be saved.')
  const existing = readSavedActions(root, organization.slug)
  const prior = existing.find((item) => item.idempotencyKey === key)
  if (prior) return prior
  const saved: SavedAction = {
    id: `act_${createHash('sha256').update(key).digest('hex').slice(0, 12)}`,
    idempotencyKey: key,
    title: required(input.title, 'Title'),
    promptedBy: clip(input.promptedBy, 500),
    ownerFunction: required(input.ownerFunction, 'Owner function'),
    assignee: clip(input.assignee || 'Unassigned', 80),
    dueDate: clip(input.dueDate || '', 40),
    status: 'todo',
    firstStep: required(input.firstStep, 'First step'),
    measure: clip(input.measure, 300),
    baseline: clip(input.baseline, 200),
    baselineScore: numberOrNull(input.baselineScore),
    baselineValidCount: numberOrNull(input.baselineValidCount),
    baselineRevisionId: input.revisionId,
    sourceWave: clip(input.sourceWave, 200),
    evidenceIds: (input.evidenceIds ?? []).slice(0, 24),
    pillarKey: input.pillarKey,
    recommendationId: input.recommendationId,
    followUpQuestion: input.followUpQuestion ? clip(input.followUpQuestion, 300) : undefined,
    templateKey: workspace.project.templateKey,
    createdAt: new Date().toISOString(),
  }
  const file = actionsPath(root, organization.slug)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify([...existing, saved], null, 2)}\n`)
  return saved
}

function required(value: string, label: string): string {
  const trimmed = value.trim()
  if (trimmed.length < 2) throw new CustomerDataError(`${label} is required.`)
  return trimmed.slice(0, 240)
}

function clip(value: string, max: number): string {
  return value.trim().slice(0, max)
}

function numberOrNull(value: number | null | undefined): number | null {
  return value == null || !Number.isFinite(value) ? null : value
}

export function measurementFor(root: string, slug: string, action: SavedAction): string {
  if (!action.pillarKey || action.baselineScore == null) return 'Awaiting comparable wave'
  const workspace = readWorkspace(root, slug)
  if (!workspace.activeRevisionId || workspace.activeRevisionId === action.baselineRevisionId) return 'Awaiting comparable wave'
  if (workspace.project.templateKey !== action.templateKey || workspace.project.templateKey !== 'seller-baseline') {
    return 'Awaiting comparable wave'
  }
  const revision = readRevision(root, slug, workspace.activeRevisionId)
  const rows = revision.submissions.map((submission) => ({
    responseId: submission.responseId,
    contributorKey: submission.responseId,
    role: submission.role,
    region: submission.region,
    ratings: {
      process: [submission.ratings.process_clarity],
      tools: [submission.ratings.tool_burden],
      enablement: [submission.ratings.enablement_readiness],
      alignment: [submission.ratings.message_alignment],
      support: [submission.ratings.support_speed],
      compensation: [submission.ratings.comp_clarity],
    },
    comments: [],
  }))
  const current = measurePillar(rows, action.pillarKey)
  if (current.score == null || current.validCount < 5) return 'Awaiting comparable wave'
  const delta = current.score - action.baselineScore
  const sign = delta > 0 ? '+' : ''
  return `Baseline ${action.baselineScore}/100 · Current ${current.score}/100 · ${sign}${delta}`
}

export function toActionItem(action: SavedAction, measurementNote: string): ActionItem {
  return {
    id: action.id,
    title: action.title,
    recommendationId: action.recommendationId || '',
    owner: action.ownerFunction,
    assignee: action.assignee || 'Unassigned',
    dueDate: action.dueDate || '—',
    status: action.status,
    priority: 'P1',
    notesCount: 0,
    lastNote: action.firstStep,
    slackChannel: '',
    lastSlackMessageAt: '',
    measurementNote,
    sourceNote: action.sourceWave,
  }
}

export function memberNames(catalog: Catalog, organizationId: string): { id: string; name: string }[] {
  const ids = new Set(
    catalog.memberships.filter((membership) => membership.organizationId === organizationId).map((membership) => membership.userId),
  )
  return catalog.users
    .filter((user) => user.status === 'active' && (ids.has(user.id) || user.platformAdmin))
    .map((user) => ({ id: user.id, name: user.name }))
}
