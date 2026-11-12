import { CustomerDataError } from '@/lib/customers/access'
import { selectWorkspace } from '@/lib/customers/report'
import type { UserRecord } from '@/lib/customers/types'
import { buildAnswer } from '@/lib/unblocked-ai/answer'
import { resolveIntent, type ResolvedIntent } from '@/lib/unblocked-ai/intent'
import { MAX_HISTORY_TURNS, MAX_QUESTION_CHARS } from '@/lib/unblocked-ai/policy'
import type { NarrativeDraft, NarrativeProvider } from '@/lib/unblocked-ai/provider'
import type { AskBody, AskRequest, EvidenceItem, IntentHint } from '@/lib/unblocked-ai/types'
import { citesKnownEvidence, evidenceIds, isGrounded } from '@/lib/unblocked-ai/validate'
import { loadWave, type WaveData } from '@/lib/unblocked-ai/wave'
import type { PillarKey } from '@/lib/types/platform'

const PILLARS = new Set<PillarKey>(['process', 'tools', 'enablement', 'alignment', 'support', 'compensation'])
const HINTS = new Set<IntentHint>(['priority', 'explain', 'segment', 'change', 'benchmark', 'follow_up', 'action'])

const buckets = new Map<string, { count: number; reset: number }>()

export type AskInput = {
  root: string
  user: UserRecord | null
  cookieSlug?: string
  request: AskRequest
  provider?: NarrativeProvider | null
  enrich?: boolean
  rateLimit?: boolean
}

function allowlisted(slug: string): boolean {
  const raw = process.env.UNBLOCKED_AI_WORKSPACES?.trim()
  if (!raw) return true
  return raw.split(',').map((item) => item.trim()).filter(Boolean).includes(slug)
}

function withinRate(slug: string): boolean {
  const limit = Number(process.env.UNBLOCKED_AI_REQUESTS_PER_MINUTE || 30)
  const now = Date.now()
  const bucket = buckets.get(slug)
  if (!bucket || now > bucket.reset) {
    buckets.set(slug, { count: 1, reset: now + 60_000 })
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}

function stale(requestId: string, name: string, waveChanged: boolean): { status: number; body: AskBody } {
  return {
    status: 409,
    body: {
      requestId,
      kind: 'stale_context',
      source: 'report',
      refresh: true,
      workspaceName: name,
      message: waveChanged
        ? "You're viewing a new wave. Ask again to use its results."
        : `You're viewing ${name}. Ask again to use its results.`,
    },
  }
}

function applyNarrative(body: AskBody, draft: { hypothesis?: string; evidenceIds?: string[]; firstStep?: string; followUpQuestion?: string }, periods: string[]): boolean {
  if (!body.content || !body.evidence) return false
  const known = evidenceIds(body.evidence)
  const hypothesis = draft.hypothesis?.trim()
  const firstStep = draft.firstStep?.trim()
  const followUp = draft.followUpQuestion?.trim()
  const ids = draft.evidenceIds?.filter(Boolean) ?? []
  if (hypothesis && (!isGrounded(hypothesis, body.evidence, periods) || !citesKnownEvidence(ids, known))) return false
  if (firstStep && !isGrounded(firstStep, body.evidence, periods)) return false
  if (followUp && !isGrounded(followUp, body.evidence, periods)) return false
  if (!hypothesis && !firstStep && !followUp) return false
  if (hypothesis) {
    body.content.interpretation = { evidenceIds: ids.length ? ids : body.content.finding.evidenceIds, hypothesis }
  }
  if (firstStep && body.content.nextStep) body.content.nextStep.firstStep = firstStep
  if (followUp) body.content.followUpQuestion = followUp
  if (body.draft) {
    if (firstStep) body.draft.firstStep = firstStep
    if (followUp) body.draft.followUpQuestion = followUp
    if (hypothesis) body.draft.promptedBy = hypothesis
  }
  body.source = 'unblocked_ai'
  body.analysisAt = new Date().toISOString()
  return true
}

export async function askWave(input: AskInput): Promise<{ status: number; body: AskBody }> {
  const started = Date.now()
  const requestId = input.request.requestId || 'request'
  try {
    if (!input.user || input.user.status !== 'active') {
      return { status: 403, body: { requestId, kind: 'unavailable', source: 'report', message: 'You do not have access to that customer.' } }
    }
    const question = input.request.question?.trim() ?? ''
    if (!question || question.length > MAX_QUESTION_CHARS) {
      return { status: 400, body: { requestId, kind: 'unavailable', source: 'report', message: 'Ask a question about this wave.' } }
    }
    if (input.request.intentHint && !HINTS.has(input.request.intentHint)) {
      return { status: 400, body: { requestId, kind: 'unavailable', source: 'report', message: 'That question type is not supported.' } }
    }
    const selected = selectWorkspace({ root: input.root, user: input.user, slug: input.cookieSlug, strict: false })
    if (!allowlisted(selected.organization.slug)) {
      return { status: 403, body: { requestId, kind: 'unavailable', source: 'report', message: 'UnblockedAI is not available for this workspace.' } }
    }
    if (input.rateLimit !== false && !withinRate(selected.organization.slug)) {
      return { status: 429, body: { requestId, kind: 'unavailable', source: 'report', message: 'AI analysis is temporarily unavailable.' } }
    }
    const submittedSlug = input.request.scope?.workspaceSlug
    const submittedRevision = input.request.scope?.revisionId
    if (submittedSlug !== selected.organization.slug) return stale(requestId, selected.organization.name, false)
    if (!selected.workspace.activeRevisionId) {
      return {
        status: 200,
        body: {
          requestId,
          kind: 'insufficient',
          source: 'report',
          message: 'Publish a wave to use UnblockedAI.',
          workspaceName: selected.organization.name,
        },
      }
    }
    if (submittedRevision !== selected.workspace.activeRevisionId) return stale(requestId, selected.organization.name, true)

    const wave = loadWave(input.root, selected.organization, selected.workspace)
    if (!wave) {
      return { status: 200, body: { requestId, kind: 'insufficient', source: 'report', message: 'Publish a wave to use UnblockedAI.' } }
    }
    const history = (input.request.history ?? []).slice(-MAX_HISTORY_TURNS).map((turn) => ({
      role: turn.role === 'assistant' ? 'assistant' as const : 'user' as const,
      content: String(turn.content ?? '').slice(0, 500),
    }))
    let intent = resolveIntent(question, input.request.intentHint, input.request.entry?.pillarKey)
    const provider = input.provider
    if (intent.type === 'unsupported' && provider && input.enrich !== false) {
      intent = (await classifiedIntent(provider, question, history)) ?? intent
    }
    const built = buildAnswer(wave, intent, input.request.scope.filter)
    const body: AskBody = {
      requestId,
      kind: built.kind,
      source: 'report',
      message: built.message,
      workspaceName: wave.organizationName,
      scope: {
        workspaceSlug: wave.workspaceSlug,
        revisionId: wave.revisionId,
        filter: input.request.scope.filter,
        organizationName: wave.organizationName,
        period: wave.period,
        isDemo: wave.isDemo,
        templateKey: wave.templateKey,
      },
      content: built.content,
      evidence: built.evidence,
      clarify: built.clarify,
      draft: built.draft,
      coverageNote: built.coverageNote,
      rule: built.rule,
    }
    const shouldEnrich = Boolean(provider) && input.enrich !== false && built.kind === 'answered' && built.content
    if (shouldEnrich && provider) {
      const enriched = await enrich(provider, question, body, history, wave)
      if (!enriched) body.message = body.message ?? 'AI analysis is temporarily unavailable.'
    }
    logAsk(requestId, body, Date.now() - started)
    return { status: 200, body }
  } catch (error) {
    if (error instanceof CustomerDataError) {
      return {
        status: error.status,
        body: { requestId, kind: 'unavailable', source: 'report', message: error.message },
      }
    }
    console.info(JSON.stringify({ event: 'unblocked_ai', requestId, status: 'error', durationMs: Date.now() - started }))
    return { status: 500, body: { requestId, kind: 'unavailable', source: 'report', message: 'AI analysis is temporarily unavailable.' } }
  }
}

async function classifiedIntent(
  provider: NarrativeProvider,
  question: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<ResolvedIntent | null> {
  try {
    const draft = await provider.complete({ mode: 'classify', question, evidence: [], history })
    if (!draft || !('intent' in draft) || typeof draft.intent !== 'string') return null
    if (!HINTS.has(draft.intent as IntentHint)) return null
    const pillar = typeof draft.pillar === 'string' && PILLARS.has(draft.pillar as PillarKey) ? (draft.pillar as PillarKey) : undefined
    return resolveIntent(question, draft.intent as IntentHint, pillar)
  } catch {
    return null
  }
}

async function enrich(
  provider: NarrativeProvider,
  question: string,
  body: AskBody,
  history: { role: 'user' | 'assistant'; content: string }[],
  wave: WaveData,
): Promise<boolean> {
  const periods = [wave.period, wave.prior?.period ?? '']
  try {
    const first = await provider.complete({ mode: 'narrate', question, evidence: body.evidence ?? [], history })
    if (isNarrative(first) && applyNarrative(body, first, periods)) return true
    const second = await provider.complete({ mode: 'narrate', question, evidence: body.evidence ?? [], history, repair: true })
    if (isNarrative(second) && applyNarrative(body, second, periods)) return true
    return false
  } catch {
    return false
  }
}

function isNarrative(value: Awaited<ReturnType<NarrativeProvider['complete']>>): value is NarrativeDraft {
  return Boolean(value) && !('intent' in (value as object))
}

function logAsk(requestId: string, body: AskBody, durationMs: number) {
  console.info(
    JSON.stringify({
      event: 'unblocked_ai',
      requestId,
      status: body.kind,
      source: body.source,
      durationMs,
    }),
  )
}

export function publicEvidence(items: EvidenceItem[] | undefined): EvidenceItem[] {
  return items ?? []
}
