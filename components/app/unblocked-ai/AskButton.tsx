'use client'

import type { IntentHint, Surface } from '@/lib/unblocked-ai/types'
import type { PillarKey } from '@/lib/types/platform'
import { useUnblockedAi } from '@/components/app/unblocked-ai/assistant'

export default function AskButton({
  label,
  question,
  intent,
  pillarKey,
  recommendationId,
  surface,
  mode,
}: {
  label: string
  question?: string
  intent?: IntentHint
  pillarKey?: PillarKey
  recommendationId?: string
  surface: Surface
  mode?: 'answer' | 'evidence' | 'draft'
}) {
  const ai = useUnblockedAi()
  return (
    <button
      type="button"
      className="text-sm font-semibold text-accent-dark hover:text-ink"
      onClick={(event) =>
        ai.open({
          question,
          intent,
          pillarKey,
          recommendationId,
          surface,
          mode,
          launcher: event.currentTarget,
        })
      }
    >
      {label}
    </button>
  )
}

export function AskLauncher() {
  const ai = useUnblockedAi()
  return (
    <button
      type="button"
      className="inline-flex shrink-0 items-center rounded-full border border-accent/40 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-accent-soft/70"
      onClick={(event) => ai.open({ surface: 'unblocked_ai', launcher: event.currentTarget })}
    >
      <span className="sm:hidden">Ask</span>
      <span className="hidden sm:inline">Ask UnblockedAI</span>
    </button>
  )
}
