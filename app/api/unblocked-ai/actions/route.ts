import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CustomerDataError } from '@/lib/customers/access'
import { selectWorkspace } from '@/lib/customers/report'
import { customerRoot, operatorUser } from '@/lib/customers/store'
import { saveAction, type ActionDraftInput } from '@/lib/unblocked-ai/actions'
import { sameOrigin } from '@/app/api/unblocked-ai/ask/route'
import type { PillarKey } from '@/lib/types/platform'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PILLARS = new Set<PillarKey>(['process', 'tools', 'enablement', 'alignment', 'support', 'compensation'])

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ ok: false, message: 'Cross-origin request refused.' }, { status: 403 })
  }
  let payload: Record<string, unknown>
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, message: 'The draft could not be saved.' }, { status: 400 })
  }
  const root = customerRoot()
  const user = operatorUser(root)
  const cookie = cookies().get('su-customer')?.value
  try {
    const selected = selectWorkspace({ root, user, slug: cookie, strict: false })
    if (payload.workspaceSlug !== selected.organization.slug || payload.revisionId !== selected.workspace.activeRevisionId) {
      return NextResponse.json(
        { ok: false, refresh: true, message: `You're viewing ${selected.organization.name}. Ask again to use its results.` },
        { status: 409 },
      )
    }
    const pillar = typeof payload.pillarKey === 'string' && PILLARS.has(payload.pillarKey as PillarKey) ? (payload.pillarKey as PillarKey) : undefined
    const input: ActionDraftInput = {
      idempotencyKey: text(payload.idempotencyKey, 80),
      title: text(payload.title, 240),
      promptedBy: text(payload.promptedBy, 500),
      ownerFunction: text(payload.ownerFunction, 120),
      assignee: text(payload.assignee, 80),
      dueDate: text(payload.dueDate, 40),
      firstStep: text(payload.firstStep, 500),
      measure: text(payload.measure, 300),
      baseline: text(payload.baseline, 200),
      baselineScore: typeof payload.baselineScore === 'number' ? payload.baselineScore : null,
      baselineValidCount: typeof payload.baselineValidCount === 'number' ? payload.baselineValidCount : null,
      sourceWave: text(payload.sourceWave, 200),
      evidenceIds: Array.isArray(payload.evidenceIds) ? payload.evidenceIds.filter((id) => typeof id === 'string').slice(0, 24) : [],
      pillarKey: pillar,
      recommendationId: text(payload.recommendationId, 80),
      followUpQuestion: text(payload.followUpQuestion, 300),
      workspaceSlug: selected.organization.slug,
      revisionId: selected.workspace.activeRevisionId || '',
    }
    const action = saveAction(root, user, input)
    return NextResponse.json({ ok: true, action, href: '/app/actions' })
  } catch (error) {
    if (error instanceof CustomerDataError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status })
    }
    return NextResponse.json({ ok: false, message: 'The draft could not be saved.' }, { status: 500 })
  }
}
