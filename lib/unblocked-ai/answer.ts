import { PILLAR_LABELS } from '@/lib/customers/schema'
import { eligibleComments, mentionsDelay, quoteExceptionDelay, selectComments, type SelectedComment } from '@/lib/unblocked-ai/comments'
import { resolveCohort, supportedGroups } from '@/lib/unblocked-ai/intent'
import {
  INDEX_FORMULA,
  MAX_EXCERPTS,
  MIN_COHORT_CONTRIBUTORS,
  MIN_VALID_RATINGS,
  OWNER_FUNCTION,
  PRIORITY_RULE,
} from '@/lib/unblocked-ai/policy'
import type { AnalysisContent, AskBody, ClarifyOption, DraftAction, EvidenceItem, IntentHint, ScopeRef } from '@/lib/unblocked-ai/types'
import { isGrounded } from '@/lib/unblocked-ai/validate'
import {
  distinctContributors,
  measurePillar,
  overallIndex,
  questionFor,
  type WaveData,
  type WaveRow,
} from '@/lib/unblocked-ai/wave'
import type { PillarKey } from '@/lib/types/platform'
import type { ResolvedIntent } from '@/lib/unblocked-ai/intent'

const PILLARS = Object.keys(PILLAR_LABELS) as PillarKey[]

type Built = {
  kind: AskBody['kind']
  message?: string
  content?: AnalysisContent
  evidence: EvidenceItem[]
  clarify?: AskBody['clarify']
  draft?: DraftAction
  coverageNote?: string
  rule?: string
}

function scopeFor(wave: WaveData, filter?: ScopeRef['filter']): ScopeRef {
  return {
    workspaceSlug: wave.workspaceSlug,
    revisionId: wave.revisionId,
    ...(filter ? { filter } : {}),
  }
}

class Packet {
  items: EvidenceItem[] = []
  constructor(
    private scope: ScopeRef,
    private listed: Set<string>,
    private periodLabels: string[],
  ) {}

  context(): string[] {
    return this.periodLabels
  }

  metric(input: Omit<Extract<EvidenceItem, { kind: 'metric' }>, 'id' | 'kind' | 'scope'>): string {
    const id = `metric:${this.scope.revisionId}:${input.metricKey}`
    this.items.push({ id, kind: 'metric', scope: this.scope, ...input })
    return id
  }

  excerpt(comment: SelectedComment): string {
    const id = `excerpt:${this.scope.revisionId}:${comment.responseId}:${comment.questionKey}`
    this.items.push({
      id,
      kind: 'excerpt',
      scope: this.scope,
      redactedText: comment.text,
      questionKey: comment.questionKey,
      questionLabel: comment.questionLabel,
      stance: comment.contrary ? 'contrary' : 'reported',
      listed: this.listed.has(comment.responseId),
    })
    return id
  }
}

function rank(rows: WaveRow[]) {
  return PILLARS.map((pillar) => ({ pillar, ...measurePillar(rows, pillar) }))
    .filter((item) => item.score != null && item.validCount >= MIN_VALID_RATINGS)
    .sort((a, b) => a.score! - b.score! || b.validCount - a.validCount || a.pillar.localeCompare(b.pillar))
}

function finish(built: Built, periods: string[]): Built {
  const texts = [built.content?.finding.summary, built.content?.interpretation?.hypothesis, built.content?.nextStep?.firstStep, built.content?.nextStep?.title, built.content?.followUpQuestion, built.draft?.measure, built.draft?.baseline, built.draft?.firstStep, built.message]
    .filter((text): text is string => Boolean(text))
  for (const text of texts) {
    if (!isGrounded(text, built.evidence, periods)) {
      throw new Error(`Ungrounded number in UnblockedAI copy: ${text}`)
    }
  }
  return built
}

function pillarDetail(wave: WaveData, pillar: PillarKey, valid: number, eligible: number, score: number): string {
  const question = wave.templateKey === 'seller-baseline' ? questionFor(pillar).prompt : `Demo pulse questions for ${PILLAR_LABELS[pillar]}. Demo data.`
  return `${question} ${valid} valid ratings across ${eligible} submissions. ${INDEX_FORMULA}`
}

function supportBundle(wave: WaveData): boolean {
  if (wave.templateKey !== 'seller-baseline') return false
  const prompt = questionFor('support').prompt.toLowerCase()
  return prompt.includes('deal desk') && prompt.includes('legal') && prompt.includes('specialist')
}

type Narrative = {
  finding: string
  hypothesis?: string
  title: string
  owner: string
  firstStep: string
  followUp?: string
  delay: boolean
}

function narrativeFor(wave: WaveData, pillar: PillarKey, comments: SelectedComment[]): Narrative {
  const label = PILLAR_LABELS[pillar]
  const delay = pillar === 'support' && mentionsDelay(comments)
  const pattern = pillar === 'support' && quoteExceptionDelay(comments) && supportBundle(wave)
  const finding = delay
    ? `Start with ${label.toLowerCase()} delays. ${label} is the lowest measured area in this wave.`
    : `${label} is the lowest measured area in this wave.`
  if (pattern) {
    const contrary = comments.some((comment) => comment.contrary)
    return {
      finding: 'Start with support delays. Support is the lowest measured area in this wave.',
      hypothesis: `Sellers describe delays after a quote needs an exception. This wave combines deal desk, legal, and specialist support in one rating, so the specific handoff needs confirmation.${
        contrary ? ' One comment describes a faster path.' : ''
      }`,
      title: 'Walk through a quote exception',
      owner: 'RevOps',
      firstStep: 'Have RevOps and Deal Desk walk through one recent quote exception and identify where it waited.',
      followUp: 'When a quote needs an exception, which approval step takes the longest?',
      delay: true,
    }
  }
  const owner = OWNER_FUNCTION[pillar]
  const commentNote = comments.length
    ? 'Sellers left comments on this pillar. They illustrate what people wrote. They are not a prevalence estimate.'
    : undefined
  return {
    finding,
    hypothesis: commentNote,
    title: `Review ${label.toLowerCase()}`,
    owner,
    firstStep: `Have ${owner} walk through one recent example behind the ${label.toLowerCase()} score and name the first handoff to change.`,
    followUp: `Which part of ${label.toLowerCase()} should the next wave ask about on its own?`,
    delay,
  }
}

function attachComments(packet: Packet, wave: WaveData, rows: WaveRow[], pillar: PillarKey): { ids: string[]; comments: SelectedComment[]; note?: string } {
  if (!wave.textProcessing) {
    return { ids: [], comments: [], note: wave.commentsWithheld ? 'Seller comments are not processed for this workspace.' : undefined }
  }
  const eligible = eligibleComments(rows)
  if (!eligible) return { ids: [], comments: [], note: 'This wave has no seller comments.' }
  const comments = selectComments(rows, pillar, MAX_EXCERPTS)
  if (!comments.length) return { ids: [], comments: [], note: 'No seller comments match this question.' }
  const reviewedId = packet.metric({
    metricKey: `${pillar}:comments`,
    label: 'comments reviewed',
    value: comments.length,
    unit: 'count',
    eligibleCount: eligible,
    detail: `${comments.length} of ${eligible} eligible comments were reviewed for this answer.`,
  })
  const ids = [reviewedId, ...comments.map((comment) => packet.excerpt(comment))]
  const note = `${comments.length} of ${eligible} eligible comments were reviewed. A recurring pattern needs more than one contributor. Snippets are not a prevalence estimate.`
  return { ids, comments, note }
}

function measureLine(label: string, score: number, valid: number): string {
  return `${label} index on the next comparable wave. Baseline ${score}/100 from ${valid} valid ratings.`
}

function draftFrom(input: {
  wave: WaveData
  pillar: PillarKey
  title: string
  owner: string
  firstStep: string
  promptedBy: string
  score: number
  valid: number
  evidenceIds: string[]
  followUp?: string
  recommendationId?: string
}): DraftAction {
  const label = PILLAR_LABELS[input.pillar]
  return {
    title: input.title,
    promptedBy: input.promptedBy,
    suggestedOwnerFunction: input.owner,
    firstStep: input.firstStep,
    measure: measureLine(label, input.score, input.valid),
    baseline: `${input.score}/100 from ${input.valid} valid ratings`,
    sourceWave: `${input.wave.organizationName} · ${input.wave.period} · ${input.wave.revisionId}`,
    evidenceIds: input.evidenceIds,
    followUpQuestion: input.followUp,
    pillarKey: input.pillar,
    recommendationId: input.recommendationId ?? `rec-${input.pillar}`,
    baselineScore: input.score,
    baselineValidCount: input.valid,
  }
}

function priorityBuilt(wave: WaveData, rows: WaveRow[], scope: ScopeRef, pillar?: PillarKey): Built {
  const packet = new Packet(scope, wave.listedIds, [wave.period, wave.prior?.period ?? ''])
  const ordered = rank(rows)
  if (!ordered.length) {
    const comments = wave.textProcessing ? eligibleComments(rows) : 0
    return finish(
      {
        kind: 'insufficient',
        message: comments
          ? 'More ratings are needed to rank these areas.'
          : 'More ratings are needed to rank these areas. This wave has no seller comments.',
        evidence: [],
        rule: PRIORITY_RULE,
      },
      packet.context(),
    )
  }
  const focus = pillar ? ordered.find((item) => item.pillar === pillar) ?? ordered[0] : ordered[0]
  const label = PILLAR_LABELS[focus.pillar]
  const score = focus.score as number
  const metricId = packet.metric({
    metricKey: focus.pillar,
    label,
    value: score,
    unit: 'index_0_100',
    validCount: focus.validCount,
    eligibleCount: focus.eligibleCount,
    detail: pillarDetail(wave, focus.pillar, focus.validCount, focus.eligibleCount, score),
  })
  const attached = attachComments(packet, wave, rows, focus.pillar)
  const story = narrativeFor(wave, focus.pillar, attached.comments)
  const isTop = focus.pillar === ordered[0].pillar
  const finding = isTop ? story.finding : `${label} is ${score}/100 from ${focus.validCount} valid ratings.`
  const evidenceIds = [metricId, ...attached.ids]
  const content: AnalysisContent = {
    finding: { evidenceIds, summary: finding },
    nextStep: {
      title: story.title,
      evidenceIds,
      suggestedOwnerFunction: story.owner,
      firstStep: story.firstStep,
      measureEvidenceId: metricId,
    },
    followUpQuestion: story.followUp,
  }
  if (story.hypothesis) content.interpretation = { evidenceIds: attached.ids.length ? attached.ids : [metricId], hypothesis: story.hypothesis }
  return finish(
    {
      kind: 'answered',
      content,
      evidence: packet.items,
      draft: draftFrom({
        wave,
        pillar: focus.pillar,
        title: story.title,
        owner: story.owner,
        firstStep: story.firstStep,
        promptedBy: finding,
        score,
        valid: focus.validCount,
        evidenceIds,
        followUp: story.followUp,
      }),
      coverageNote: attached.note,
      rule: PRIORITY_RULE,
    },
    packet.context(),
  )
}

function explainBuilt(wave: WaveData, rows: WaveRow[], scope: ScopeRef, pillar: PillarKey | undefined): Built {
  if (!pillar) {
    return {
      kind: 'clarify',
      message: 'Which area should we look at?',
      evidence: [],
      clarify: {
        question: 'Which area should we look at?',
        options: PILLARS.map((key) => ({ label: PILLAR_LABELS[key], pillarKey: key, intent: 'explain' as IntentHint })),
      },
    }
  }
  const measure = measurePillar(rows, pillar)
  if (measure.score == null) {
    return finish(
      {
        kind: 'insufficient',
        message: `${PILLAR_LABELS[pillar]} has no valid ratings in this wave, so it is not scored as zero.`,
        evidence: [],
      },
      [wave.period],
    )
  }
  const packet = new Packet(scope, wave.listedIds, [wave.period])
  const metricId = packet.metric({
    metricKey: pillar,
    label: PILLAR_LABELS[pillar],
    value: measure.score,
    unit: 'index_0_100',
    validCount: measure.validCount,
    eligibleCount: measure.eligibleCount,
    detail: pillarDetail(wave, pillar, measure.validCount, measure.eligibleCount, measure.score),
  })
  const attached = attachComments(packet, wave, rows, pillar)
  const story = narrativeFor(wave, pillar, attached.comments)
  const summary = `${PILLAR_LABELS[pillar]} is ${measure.score}/100 from ${measure.validCount} valid ratings.`
  const limited = measure.validCount < MIN_VALID_RATINGS ? ' Limited sample.' : ''
  const content: AnalysisContent = {
    finding: { evidenceIds: [metricId, ...attached.ids], summary: `${summary}${limited}` },
    nextStep: {
      title: story.title,
      evidenceIds: [metricId, ...attached.ids],
      suggestedOwnerFunction: story.owner,
      firstStep: story.firstStep,
      measureEvidenceId: metricId,
    },
    followUpQuestion: story.followUp,
  }
  if (story.hypothesis) content.interpretation = { evidenceIds: attached.ids.length ? attached.ids : [metricId], hypothesis: story.hypothesis }
  else if (supportBundle(wave) && pillar === 'support') {
    content.interpretation = {
      evidenceIds: [metricId],
      hypothesis: 'This rating combines deal desk, legal, and specialist support, so a low score does not name the handoff.',
    }
  }
  return finish(
    {
      kind: 'answered',
      content,
      evidence: packet.items,
      coverageNote: attached.note,
      draft: draftFrom({
        wave,
        pillar,
        title: story.title,
        owner: story.owner,
        firstStep: story.firstStep,
        promptedBy: summary,
        score: measure.score,
        valid: measure.validCount,
        evidenceIds: [metricId, ...attached.ids],
        followUp: story.followUp,
      }),
      rule: PRIORITY_RULE,
    },
    packet.context(),
  )
}

function segmentBuilt(wave: WaveData, rows: WaveRow[], scope: ScopeRef, query: string, pillar?: PillarKey): Built {
  const resolved = resolveCohort({ ...wave, rows }, query)
  if (resolved.ambiguous) {
    return {
      kind: 'clarify',
      evidence: [],
      clarify: {
        question: 'Which group do you mean?',
        options: resolved.ambiguous.map((option) => ({
          label: `${option.value} (${option.field})`,
          field: option.field,
          value: option.value,
        })),
      },
    }
  }
  if (!resolved.cohort) {
    const roles = supportedGroups(wave, 'role')
    const regions = supportedGroups(wave, 'region')
    const options: ClarifyOption[] = [
      ...roles.map((group) => ({ label: group.value, field: 'role' as const, value: group.value })),
      ...regions.map((group) => ({ label: group.value, field: 'region' as const, value: group.value })),
    ]
    return {
      kind: 'insufficient',
      message: 'This wave collected pillar ratings and role and region when provided.',
      evidence: [],
      clarify: options.length ? { question: 'Ask about a group this wave can show.', options } : undefined,
    }
  }
  const cohort = resolved.cohort
  const rest = rows.filter((row) => !cohort.rows.includes(row))
  if (cohort.contributors < MIN_COHORT_CONTRIBUTORS || distinctContributors(rest) < MIN_COHORT_CONTRIBUTORS) {
    return smallGroup(wave)
  }
  const packet = new Packet(
    { ...scope, filter: { field: cohort.field, value: cohort.values.length === 1 ? cohort.values[0] : query } },
    wave.listedIds,
    [wave.period],
  )
  if (pillar) {
    const left = measurePillar(cohort.rows, pillar)
    const right = measurePillar(rest, pillar)
    if (left.score == null || right.score == null || left.validCount < MIN_VALID_RATINGS || right.validCount < MIN_VALID_RATINGS) {
      return smallGroup(wave)
    }
    const leftId = packet.metric({
      metricKey: `${pillar}:${cohort.label}`,
      label: `${PILLAR_LABELS[pillar]} · ${cohort.label}`,
      value: left.score,
      unit: 'index_0_100',
      validCount: left.validCount,
      eligibleCount: left.eligibleCount,
      detail: pillarDetail(wave, pillar, left.validCount, left.eligibleCount, left.score),
    })
    const rightId = packet.metric({
      metricKey: `${pillar}:rest`,
      label: `${PILLAR_LABELS[pillar]} · everyone else`,
      value: right.score,
      unit: 'index_0_100',
      validCount: right.validCount,
      eligibleCount: right.eligibleCount,
    })
    const relation = left.score < right.score ? 'lower' : left.score > right.score ? 'higher' : 'the same'
    const summary = `${cohort.label} is ${left.score}/100 from ${left.validCount} valid ratings. Everyone else is ${right.score}/100 from ${right.validCount} valid ratings. ${cohort.label} is ${relation}.`
    return finish(
      {
        kind: 'answered',
        content: { finding: { evidenceIds: [leftId, rightId], summary } },
        evidence: packet.items,
        rule: `A group is shown only with at least ${MIN_COHORT_CONTRIBUTORS} distinct contributors and ${MIN_VALID_RATINGS} valid ratings.`,
      },
      packet.context(),
    )
  }
  const left = overallIndex(cohort.rows)
  const right = overallIndex(rest)
  const leftValid = PILLARS.reduce((sum, key) => sum + measurePillar(cohort.rows, key).validCount, 0)
  const rightValid = PILLARS.reduce((sum, key) => sum + measurePillar(rest, key).validCount, 0)
  if (left.score == null || right.score == null || leftValid < MIN_VALID_RATINGS || rightValid < MIN_VALID_RATINGS) return smallGroup(wave)
  const leftId = packet.metric({
    metricKey: `overall:${cohort.label}`,
    label: cohort.label,
    value: left.score,
    unit: 'index_0_100',
    validCount: leftValid,
    eligibleCount: cohort.rows.length,
    detail: 'Equal weight across pillars that have a score. The same index as the baseline overall score.',
  })
  const rightId = packet.metric({
    metricKey: 'overall:rest',
    label: 'Everyone else',
    value: right.score,
    unit: 'index_0_100',
    validCount: rightValid,
    eligibleCount: rest.length,
  })
  const relation = left.score < right.score ? 'lower' : left.score > right.score ? 'higher' : 'the same'
  return finish(
    {
      kind: 'answered',
      content: {
        finding: {
          evidenceIds: [leftId, rightId],
          summary: `${cohort.label} is ${left.score}/100 across ${cohort.rows.length} submissions. Everyone else is ${right.score}/100 across ${rest.length} submissions. ${cohort.label} is ${relation}.`,
        },
      },
      evidence: packet.items,
    },
    packet.context(),
  )
}

function smallGroup(wave: WaveData): Built {
  const options: ClarifyOption[] = [
    { label: 'Whole wave', clearFilter: true },
    ...supportedGroups(wave, 'role').map((group) => ({ label: group.value, field: 'role' as const, value: group.value })),
    ...supportedGroups(wave, 'region').map((group) => ({ label: group.value, field: 'region' as const, value: group.value })),
  ]
  return {
    kind: 'insufficient',
    message: 'Too few responses to show this comparison.',
    evidence: [],
    clarify: { question: 'You can ask about the whole wave or a group with enough responses.', options },
  }
}

function changeBuilt(wave: WaveData, rows: WaveRow[], scope: ScopeRef, pillar?: PillarKey): Built {
  const target = pillar ?? rank(rows)[0]?.pillar ?? 'support'
  const current = measurePillar(rows, target)
  if (current.score == null) {
    return { kind: 'insufficient', message: 'A later comparable wave will show change.', evidence: [] }
  }
  const packet = new Packet(scope, wave.listedIds, [wave.period, wave.prior?.period ?? ''])
  const metricId = packet.metric({
    metricKey: target,
    label: PILLAR_LABELS[target],
    value: current.score,
    unit: 'index_0_100',
    validCount: current.validCount,
    eligibleCount: current.eligibleCount,
    detail: pillarDetail(wave, target, current.validCount, current.eligibleCount, current.score),
  })
  if (!wave.prior) {
    return finish(
      {
        kind: 'answered',
        message: 'A later comparable wave will show change.',
        content: {
          finding: {
            evidenceIds: [metricId],
            summary: `${PILLAR_LABELS[target]} is ${current.score}/100 from ${current.validCount} valid ratings. A later comparable wave will show change.`,
          },
        },
        evidence: packet.items,
      },
      packet.context(),
    )
  }
  if (wave.prior.kind === 'demo_series' || !wave.prior.sampleKnown) {
    const delta = wave.prior.demoDelta?.[target]
    const deltaId =
      delta != null
        ? packet.metric({
            metricKey: `${target}:demo-delta`,
            label: 'Demo series change',
            value: delta,
            unit: 'points',
            detail: 'Seeded DemoTech series. Not a prior published revision, and not used for any other customer.',
          })
        : undefined
    const summary =
      delta == null
        ? `${PILLAR_LABELS[target]} is ${current.score}/100 from ${current.validCount} valid ratings. The earlier demo point has no measured sample.`
        : `${PILLAR_LABELS[target]} is ${current.score}/100 from ${current.validCount} valid ratings. The demo series shows a change of ${delta} points. The earlier point is not a published revision.`
    return finish(
      {
        kind: 'answered',
        content: { finding: { evidenceIds: deltaId ? [metricId, deltaId] : [metricId], summary } },
        evidence: packet.items,
        coverageNote: 'DemoTech · Demo data. Demo series and demo benchmarks stay inside this workspace.',
      },
      packet.context(),
    )
  }
  const prior = wave.prior.pillars[target]
  if (prior?.score == null || prior.validCount < MIN_VALID_RATINGS || current.validCount < MIN_VALID_RATINGS) {
    return finish(
      {
        kind: 'answered',
        message: 'A later comparable wave will show change.',
        content: {
          finding: {
            evidenceIds: [metricId],
            summary: `${PILLAR_LABELS[target]} is ${current.score}/100 from ${current.validCount} valid ratings. The earlier revision does not have enough coverage to compare.`,
          },
        },
        evidence: packet.items,
      },
      packet.context(),
    )
  }
  const delta = current.score - prior.score
  const compared: EvidenceItem = {
    id: metricId,
    kind: 'metric',
    scope,
    metricKey: target,
    label: PILLAR_LABELS[target],
    value: current.score,
    unit: 'index_0_100',
    validCount: current.validCount,
    eligibleCount: current.eligibleCount,
    comparison: {
      scope: { workspaceSlug: wave.workspaceSlug, revisionId: wave.prior.revisionId },
      label: wave.prior.kind === 'wave' ? `Earlier wave · ${wave.prior.period}` : `Earlier revision · ${wave.prior.period}`,
      value: prior.score,
      validCount: prior.validCount,
    },
    detail: pillarDetail(wave, target, current.validCount, current.eligibleCount, current.score),
  }
  packet.items[0] = compared
  const deltaId = packet.metric({
    metricKey: `${target}:delta`,
    label: wave.prior.kind === 'wave' ? 'Wave-to-wave change' : 'Revision comparison',
    value: delta,
    unit: 'points',
    detail:
      wave.prior.kind === 'wave'
        ? 'Distinct periods and the same question. Both samples are shown.'
        : 'This comparison overlaps the previous snapshot. Both samples are shown. It is a revision comparison, not a clean wave-to-wave change.',
  })
  const kindLabel = wave.prior.kind === 'wave' ? 'wave-to-wave change' : 'revision comparison'
  const summary = `${PILLAR_LABELS[target]} is ${current.score}/100 from ${current.validCount} valid ratings. The earlier sample is ${prior.score}/100 from ${prior.validCount} valid ratings. The ${kindLabel} is ${delta} points.`
  return finish(
    {
      kind: 'answered',
      content: { finding: { evidenceIds: [metricId, deltaId], summary } },
      evidence: packet.items,
    },
    packet.context(),
  )
}

function benchmarkBuilt(wave: WaveData, rows: WaveRow[], scope: ScopeRef): Built {
  const packet = new Packet(scope, wave.listedIds, [wave.period])
  const org = wave.benchmark.yourScore ?? overallIndex(rows).score
  if (org == null) {
    return { kind: 'insufficient', message: 'Peer benchmark unavailable for this workspace.', evidence: [] }
  }
  const yours = packet.metric({
    metricKey: 'overall',
    label: wave.isDemo ? 'DemoTech index' : 'Your organization',
    value: org,
    unit: 'index_0_100',
    eligibleCount: rows.length,
    detail: wave.isDemo ? 'DemoTech headline index. Demo data.' : 'Equal weight across pillars that have a score.',
  })
  if (!wave.benchmark.available || wave.benchmark.peerMedian == null) {
    return finish(
      {
        kind: 'answered',
        message: 'Peer benchmark unavailable for this workspace.',
        content: {
          finding: {
            evidenceIds: [yours],
            summary: `Peer benchmark unavailable for this workspace. The internal score is ${org}/100.`,
          },
        },
        evidence: packet.items,
      },
      packet.context(),
    )
  }
  const peer = packet.metric({
    metricKey: 'peer-median',
    label: 'Demo peer median',
    value: wave.benchmark.peerMedian,
    unit: 'index_0_100',
    detail: wave.benchmark.label,
  })
  return finish(
    {
      kind: 'answered',
      content: {
        finding: {
          evidenceIds: [yours, peer],
          summary: `Demo benchmark. DemoTech is ${org}/100 against a demo peer median of ${wave.benchmark.peerMedian}/100. This comparison is demo data.`,
        },
      },
      evidence: packet.items,
      coverageNote: 'DemoTech · Demo data.',
    },
    packet.context(),
  )
}

function followUpBuilt(wave: WaveData, rows: WaveRow[], scope: ScopeRef, pillar?: PillarKey): Built {
  const built = priorityBuilt(wave, rows, scope, pillar)
  if (!built.content) return built
  const question =
    built.content.followUpQuestion ??
    'Which handoff should the next wave ask about on its own?'
  built.content = {
    ...built.content,
    followUpQuestion: question,
    finding: {
      evidenceIds: built.content.finding.evidenceIds,
      summary: question,
    },
  }
  built.message = 'Draft for a future wave or interview.'
  return finish(built, [wave.period, wave.prior?.period ?? ''])
}

function stageBuilt(wave: WaveData, scope: ScopeRef, name?: string): Built {
  if (!wave.stages.length) {
    return {
      kind: 'insufficient',
      message: 'This wave collected pillar ratings and role and region when provided. Stage questions were not collected.',
      evidence: [],
      clarify: {
        question: 'A question this wave can answer:',
        options: [{ label: 'What should we fix first?', intent: 'priority' as IntentHint }],
      },
    }
  }
  const match = name ? wave.stages.find((stage) => stage.name.toLowerCase().includes(name)) : undefined
  const stage = match ?? wave.stages[0]
  const packet = new Packet(scope, wave.listedIds, [wave.period])
  const id = packet.metric({
    metricKey: `stage:${stage.name}`,
    label: stage.name,
    value: stage.score,
    unit: 'index_0_100',
    validCount: stage.validCount,
    detail: wave.isDemo ? 'DemoTech stage question. Demo data.' : 'Stage score from this wave.',
  })
  return finish(
    {
      kind: 'answered',
      content: {
        finding: {
          evidenceIds: [id],
          summary: wave.isDemo
            ? `${stage.name} is ${stage.score}/100 in the demo pulse. This is demo data, not a customer benchmark.`
            : `${stage.name} is ${stage.score}/100.`,
        },
      },
      evidence: packet.items,
      coverageNote: wave.isDemo ? 'DemoTech · Demo data.' : undefined,
    },
    packet.context(),
  )
}

function unsupported(wave: WaveData): Built {
  const stage = wave.stages.length ? ' Stage questions are available in this demo wave.' : ' Stage questions were not collected.'
  return {
    kind: 'insufficient',
    message: `This wave collected pillar ratings and role and region when provided.${wave.isDemo ? stage : ' Stage questions were not collected.'}`,
    evidence: [],
    clarify: {
      question: 'A question this wave can answer:',
      options: [{ label: 'What should we fix first?', intent: 'priority' as IntentHint }],
    },
  }
}

export function buildAnswer(wave: WaveData, intent: ResolvedIntent, filter?: ScopeRef['filter']): Built {
  let rows = wave.rows
  let scope = scopeFor(wave, filter)
  if (filter) {
    const matched = wave.rows.filter((row) => row[filter.field].toLowerCase() === filter.value.toLowerCase())
    const known = wave.rows.some((row) => row[filter.field].trim())
    if (!matched.length) {
      return {
        kind: 'insufficient',
        message: known
          ? 'This wave collected pillar ratings and role and region when provided.'
          : 'This wave collected pillar ratings and role and region when provided.',
        evidence: [],
      }
    }
    if (distinctContributors(matched) < MIN_COHORT_CONTRIBUTORS) return smallGroup(wave)
    rows = matched
    scope = scopeFor(wave, filter)
  }
  if (intent.type === 'priority') return priorityBuilt(wave, rows, scope)
  if (intent.type === 'explain') return explainBuilt(wave, rows, scope, intent.pillar)
  if (intent.type === 'segment') return segmentBuilt(wave, rows, scope, intent.query, intent.pillar)
  if (intent.type === 'change') return changeBuilt(wave, rows, scope, intent.pillar)
  if (intent.type === 'benchmark') return benchmarkBuilt(wave, rows, scope)
  if (intent.type === 'follow_up') return followUpBuilt(wave, rows, scope, intent.pillar)
  if (intent.type === 'action') {
    const built = priorityBuilt(wave, rows, scope, intent.pillar)
    return built
  }
  if (intent.type === 'stage') return stageBuilt(wave, scope, intent.name)
  return unsupported(wave)
}

export function prioritiesOf(wave: WaveData) {
  return rank(wave.rows).slice(0, 3)
}
