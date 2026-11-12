import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CustomerDataError } from '@/lib/customers/access'
import { customerRoot, operatorUser } from '@/lib/customers/store'
import { askWave } from '@/lib/unblocked-ai/ask'
import { providerFromEnv } from '@/lib/unblocked-ai/provider'
import type { AskRequest, IntentHint, Surface } from '@/lib/unblocked-ai/types'
import type { PillarKey } from '@/lib/types/platform'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PILLARS = new Set<PillarKey>(['process', 'tools', 'enablement', 'alignment', 'support', 'compensation'])
const SURFACES = new Set<Surface>(['overview', 'diagnostics', 'insights', 'recommendations', 'unblocked_ai', 'benchmarks', 'responses'])
const HINTS = new Set<IntentHint>(['priority', 'explain', 'segment', 'change', 'benchmark', 'follow_up', 'action'])

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  if (!host) return true
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function parseAsk(body: unknown): AskRequest | null {
  if (!body || typeof body !== 'object') return null
  const record = body as Record<string, unknown>
  const scope = record.scope
  if (!scope || typeof scope !== 'object') return null
  const scopeRecord = scope as Record<string, unknown>
  if (typeof scopeRecord.workspaceSlug !== 'string' || typeof scopeRecord.revisionId !== 'string') return null
  if (typeof record.question !== 'string' || typeof record.requestId !== 'string') return null
  const filterRecord = scopeRecord.filter
  let filter: AskRequest['scope']['filter']
  if (filterRecord && typeof filterRecord === 'object') {
    const filterBody = filterRecord as Record<string, unknown>
    if ((filterBody.field === 'region' || filterBody.field === 'role') && typeof filterBody.value === 'string') {
      filter = { field: filterBody.field, value: filterBody.value.slice(0, 80) }
    }
  }
  const entryRecord = record.entry
  let entry: AskRequest['entry']
  if (entryRecord && typeof entryRecord === 'object') {
    const entryBody = entryRecord as Record<string, unknown>
    if (typeof entryBody.surface === 'string' && SURFACES.has(entryBody.surface as Surface)) {
      const pillarKey = typeof entryBody.pillarKey === 'string' && PILLARS.has(entryBody.pillarKey as PillarKey) ? (entryBody.pillarKey as PillarKey) : undefined
      entry = {
        surface: entryBody.surface as Surface,
        pillarKey,
        recommendationId: typeof entryBody.recommendationId === 'string' ? entryBody.recommendationId.slice(0, 80) : undefined,
      }
    }
  }
  const history = Array.isArray(record.history)
    ? record.history.slice(-6).flatMap((turn) => {
        if (!turn || typeof turn !== 'object') return []
        const item = turn as Record<string, unknown>
        if ((item.role !== 'user' && item.role !== 'assistant') || typeof item.content !== 'string') return []
        return [{ role: item.role === 'assistant' ? 'assistant' as const : 'user' as const, content: item.content.slice(0, 500) }]
      })
    : undefined
  const intentHint = typeof record.intentHint === 'string' && HINTS.has(record.intentHint as IntentHint) ? (record.intentHint as IntentHint) : undefined
  return {
    scope: { workspaceSlug: scopeRecord.workspaceSlug, revisionId: scopeRecord.revisionId, filter },
    question: record.question,
    requestId: record.requestId.slice(0, 80),
    intentHint,
    entry,
    history,
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ kind: 'unavailable', source: 'report', message: 'Cross-origin request refused.' }, { status: 403 })
  }
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ kind: 'unavailable', source: 'report', message: 'Ask a question about this wave.' }, { status: 400 })
  }
  const parsed = parseAsk(payload)
  if (!parsed) {
    return NextResponse.json({ kind: 'unavailable', source: 'report', message: 'Ask a question about this wave.' }, { status: 400 })
  }
  try {
    const root = customerRoot()
    const result = await askWave({
      root,
      user: operatorUser(root),
      cookieSlug: cookies().get('su-customer')?.value,
      request: parsed,
      provider: providerFromEnv(),
      enrich: !parsed.intentHint || parsed.intentHint === 'priority' || parsed.intentHint === 'explain' || parsed.intentHint === 'action' || parsed.intentHint === 'follow_up',
    })
    return NextResponse.json(result.body, { status: result.status })
  } catch (error) {
    if (error instanceof CustomerDataError) {
      return NextResponse.json({ kind: 'unavailable', source: 'report', message: error.message }, { status: error.status })
    }
    return NextResponse.json({ kind: 'unavailable', source: 'report', message: 'AI analysis is temporarily unavailable.' }, { status: 500 })
  }
}
