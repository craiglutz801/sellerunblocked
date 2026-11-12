import { cookies } from 'next/headers'
import { canAdminOrganization } from '@/lib/customers/access'
import { selectWorkspace } from '@/lib/customers/report'
import { customerRoot, operatorUser, readCatalog } from '@/lib/customers/store'
import { buildAnswer, prioritiesOf } from '@/lib/unblocked-ai/answer'
import { actionsWritable, memberNames } from '@/lib/unblocked-ai/actions'
import { eligibleComments, selectComments } from '@/lib/unblocked-ai/comments'
import { PRIORITY_RULE, MAX_EXCERPTS } from '@/lib/unblocked-ai/policy'
import type { AssistantFrame, DraftAction, EvidenceItem, PromptChoice } from '@/lib/unblocked-ai/types'
import { loadWave, type WaveData } from '@/lib/unblocked-ai/wave'
import { PILLAR_LABELS } from '@/lib/customers/schema'
import type { PillarKey } from '@/lib/types/platform'

export type PriorityRow = {
  pillarKey: PillarKey
  issue: string
  metric: string
  explanation?: string
  owner: string
  evidence: EvidenceItem[]
  draft: DraftAction
}

export type ReadoutModel = {
  published: boolean
  organizationName: string
  workspaceSlug: string
  isDemo: boolean
  period: string
  responseCount: number
  revisionId: string | null
  canPublish: boolean
  finding: string
  chips: string[]
  priorities: PriorityRow[]
  prompts: PromptChoice[]
  coverage: { label: string; body: string }[]
  gaps: string[]
  measure: string
  rule: string
  evidence: EvidenceItem[]
  actionsWritable: boolean
  members: { id: string; name: string }[]
  sourceLabel: string
}

function chipsFor(evidence: EvidenceItem[], ids: string[]): string[] {
  const chips: string[] = []
  for (const id of ids) {
    const item = evidence.find((entry) => entry.id === id)
    if (!item || item.kind !== 'metric') continue
    if (item.unit === 'index_0_100') {
      chips.push(`${item.label} ${item.value}/100`)
      if (item.validCount != null) chips.push(`${item.validCount} valid ratings`)
    } else if (item.unit === 'count') {
      chips.push(`${item.value} ${item.label}`)
    } else if (item.unit === 'points' && item.comparison) {
      chips.push(`${item.value} points`)
    }
  }
  return chips
}

function promptsFor(wave: WaveData | null): PromptChoice[] {
  const ranked = wave ? prioritiesOf(wave).length : 0
  const supportComments = wave && wave.textProcessing ? selectComments(wave.rows, 'support', MAX_EXCERPTS).length : 0
  const commentReason = !wave
    ? 'Publish a wave to use UnblockedAI.'
    : !wave.textProcessing
      ? 'Seller comments are not processed for this workspace.'
      : eligibleComments(wave.rows)
        ? 'No seller comments match support.'
        : 'This wave has no seller comments.'
  return [
    {
      id: 'priority',
      label: 'What should we fix first?',
      question: 'What should we fix first?',
      intent: 'priority',
      available: ranked > 0,
      reason: ranked > 0 ? undefined : 'More ratings are needed to rank these areas.',
    },
    {
      id: 'support',
      label: 'What are sellers saying about support?',
      question: 'What are sellers saying about support?',
      intent: 'explain',
      available: supportComments > 0,
      reason: supportComments > 0 ? undefined : commentReason,
    },
    {
      id: 'change',
      label: 'What changed since the previous wave?',
      question: 'What changed since the previous wave?',
      intent: 'change',
      available: Boolean(wave?.prior),
      reason: wave?.prior ? undefined : 'A later comparable wave will show change.',
    },
  ]
}

export function buildReadout(wave: WaveData | null, frame: AssistantFrame): ReadoutModel {
  if (!wave) {
    return {
      published: false,
      organizationName: frame.organizationName,
      workspaceSlug: frame.workspaceSlug,
      isDemo: frame.isDemo,
      period: frame.period,
      responseCount: 0,
      revisionId: null,
      canPublish: frame.canPublish,
      finding: '',
      chips: [],
      priorities: [],
      prompts: frame.prompts,
      coverage: [],
      gaps: [],
      measure: '',
      rule: PRIORITY_RULE,
      evidence: [],
      actionsWritable: frame.actionsWritable,
      members: frame.members,
      sourceLabel: 'From your report',
    }
  }
  const answer = buildAnswer(wave, { type: 'priority' })
  const ranked = prioritiesOf(wave)
  const priorities: PriorityRow[] = ranked.slice(0, 3).flatMap((item) => {
    const built = buildAnswer(wave, { type: 'action', pillar: item.pillar })
    if (!built.draft || !built.content) return []
    const label = PILLAR_LABELS[item.pillar]
    return [
      {
        pillarKey: item.pillar,
        issue: built.content.finding.summary,
        metric: `${label} ${item.score}/100 · ${item.validCount} valid ratings`,
        explanation: built.content.interpretation?.hypothesis,
        owner: built.draft.suggestedOwnerFunction,
        evidence: built.evidence,
        draft: built.draft,
      },
    ]
  })
  const top = answer.content
  const evidence = answer.evidence
  const measure = answer.draft?.measure ?? 'A later comparable wave will show change.'
  const gaps = [
    wave.prior ? null : 'A later comparable wave will show change.',
    wave.textProcessing ? (eligibleComments(wave.rows) ? null : 'This wave has no seller comments.') : 'Seller comments are not processed for this workspace.',
    wave.benchmark.available ? null : 'Peer benchmark unavailable for this workspace.',
    'No invited count was collected, so a response rate is not shown.',
  ].filter((gap): gap is string => Boolean(gap))
  const fields = wave.templateKey === 'demotech-pulse'
    ? 'Demo pulse ratings, stage questions, role, region, and comments. Comparisons on this page are demo data.'
    : 'Pillar ratings, role and region when provided, and an optional comment.'
  return {
    published: true,
    organizationName: wave.organizationName,
    workspaceSlug: wave.workspaceSlug,
    isDemo: wave.isDemo,
    period: wave.period,
    responseCount: wave.rows.length,
    revisionId: wave.revisionId,
    canPublish: frame.canPublish,
    finding: top?.finding.summary ?? answer.message ?? 'More ratings are needed to rank these areas.',
    chips: top ? chipsFor(evidence, top.finding.evidenceIds) : [],
    priorities,
    prompts: frame.prompts,
    coverage: [
      { label: 'Fields collected', body: fields },
      {
        label: 'Comparable waves',
        body: wave.prior
          ? wave.prior.kind === 'demo_series'
            ? 'DemoTech has a seeded demo series. It is not a prior published revision.'
            : wave.prior.kind === 'wave'
              ? `Earlier wave ${wave.prior.period}.`
              : `Earlier revision ${wave.prior.period}. Overlap is labeled as a revision comparison.`
          : 'This is the first published wave.',
      },
      { label: 'Next measure', body: measure },
    ],
    gaps,
    measure,
    rule: PRIORITY_RULE,
    evidence,
    actionsWritable: frame.actionsWritable,
    members: frame.members,
    sourceLabel: 'From your report',
  }
}

export function loadAssistantFrame(): AssistantFrame {
  const root = customerRoot()
  const user = operatorUser(root)
  const slug = cookies().get('su-customer')?.value
  const selected = selectWorkspace({ root, user, slug })
  const catalog = readCatalog(root)
  const wave = loadWave(root, selected.organization, selected.workspace)
  return {
    workspaceSlug: selected.organization.slug,
    revisionId: selected.workspace.activeRevisionId,
    organizationName: selected.organization.name,
    period: wave?.period ?? selected.workspace.dataset.periodLabel,
    published: Boolean(selected.workspace.activeRevisionId),
    isDemo: selected.organization.isDemo,
    responseCount: wave?.rows.length ?? 0,
    canPublish: canAdminOrganization(user, selected.organization.id, catalog.memberships),
    actionsWritable: actionsWritable(root),
    members: memberNames(catalog, selected.organization.id),
    prompts: promptsFor(wave),
  }
}

export function loadReadout(): ReadoutModel {
  const frame = loadAssistantFrame()
  const root = customerRoot()
  const user = operatorUser(root)
  const selected = selectWorkspace({ root, user, slug: frame.workspaceSlug, strict: true })
  const wave = loadWave(root, selected.organization, selected.workspace)
  return buildReadout(wave, frame)
}
