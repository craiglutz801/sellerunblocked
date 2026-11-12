import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { customerRoot, operatorUser } from '@/lib/customers/store'
import { askWave } from '@/lib/unblocked-ai/ask'
import { providerFromEnv } from '@/lib/unblocked-ai/provider'
import { parseAsk, sameOrigin } from '@/app/api/unblocked-ai/ask/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ kind: 'unavailable', source: 'report', message: 'Cross-origin request refused.' }, { status: 403 })
  }
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }
  const parsed = parseAsk({
    ...(payload && typeof payload === 'object' ? payload : {}),
    question: 'What should we fix first?',
    intentHint: 'priority',
    requestId: typeof (payload as { requestId?: string })?.requestId === 'string' ? (payload as { requestId: string }).requestId : 'analyze',
  })
  if (!parsed) {
    return NextResponse.json({ kind: 'unavailable', source: 'report', message: 'Choose a published wave first.' }, { status: 400 })
  }
  const root = customerRoot()
  const result = await askWave({
    root,
    user: operatorUser(root),
    cookieSlug: cookies().get('su-customer')?.value,
    request: { ...parsed, question: 'What should we fix first?', intentHint: 'priority' },
    provider: providerFromEnv(),
    enrich: true,
  })
  return NextResponse.json(result.body, { status: result.status })
}
