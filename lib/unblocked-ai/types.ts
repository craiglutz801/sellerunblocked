import type { PillarKey } from '@/lib/types/platform'

export type FilterField = 'region' | 'role'
export type IntentHint = 'priority' | 'explain' | 'segment' | 'change' | 'benchmark' | 'follow_up' | 'action'
export type Surface = 'overview' | 'diagnostics' | 'insights' | 'recommendations' | 'unblocked_ai' | 'benchmarks' | 'responses'

export type ScopeRef = {
  workspaceSlug: string
  revisionId: string
  filter?: { field: FilterField; value: string }
}

export type AskEntry = {
  surface: Surface
  pillarKey?: PillarKey
  recommendationId?: string
}

export type AskRequest = {
  scope: ScopeRef
  question: string
  intentHint?: IntentHint
  entry?: AskEntry
  requestId: string
  history?: { role: 'user' | 'assistant'; content: string }[]
}

export type EvidenceItem =
  | {
      id: string
      kind: 'metric'
      scope: ScopeRef
      metricKey: string
      label: string
      value: number
      unit: 'index_0_100' | 'points' | 'count' | 'percent'
      validCount?: number
      eligibleCount?: number
      comparison?: { scope: ScopeRef; label: string; value: number; validCount: number }
      detail?: string
    }
  | {
      id: string
      kind: 'excerpt'
      scope: ScopeRef
      redactedText: string
      questionKey: string
      questionLabel?: string
      stance?: 'reported' | 'contrary'
      listed?: boolean
    }

export type AnalysisContent = {
  finding: { evidenceIds: string[]; summary: string }
  interpretation?: { evidenceIds: string[]; hypothesis: string }
  nextStep?: {
    title: string
    evidenceIds: string[]
    suggestedOwnerFunction: string
    firstStep: string
    measureEvidenceId?: string
  }
  followUpQuestion?: string
}

export type PromptChoice = {
  id: string
  label: string
  question: string
  intent: IntentHint
  available: boolean
  reason?: string
}

export type AssistantFrame = {
  workspaceSlug: string
  revisionId: string | null
  organizationName: string
  period: string
  published: boolean
  isDemo: boolean
  responseCount: number
  canPublish: boolean
  actionsWritable: boolean
  members: { id: string; name: string }[]
  prompts: PromptChoice[]
}

export type AnswerKind = 'answered' | 'clarify' | 'insufficient' | 'stale_context' | 'unavailable'

export type ClarifyOption = {
  label: string
  field?: FilterField
  value?: string
  clearFilter?: boolean
  pillarKey?: PillarKey
  intent?: IntentHint
}

export type DraftAction = {
  title: string
  promptedBy: string
  suggestedOwnerFunction: string
  firstStep: string
  measure: string
  baseline: string
  sourceWave: string
  evidenceIds: string[]
  followUpQuestion?: string
  pillarKey?: PillarKey
  recommendationId?: string
  baselineScore?: number
  baselineValidCount?: number
}

export type AskBody = {
  requestId: string
  kind: AnswerKind
  source: 'report' | 'unblocked_ai'
  message?: string
  refresh?: boolean
  workspaceName?: string
  scope?: ScopeRef & {
    organizationName: string
    period: string
    isDemo: boolean
    templateKey: string
  }
  content?: AnalysisContent
  evidence?: EvidenceItem[]
  clarify?: { question: string; options: ClarifyOption[] }
  draft?: DraftAction
  coverageNote?: string
  analysisAt?: string
  rule?: string
}
