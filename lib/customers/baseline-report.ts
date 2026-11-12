import type { Insight, PillarKey, Recommendation } from '@/lib/types/platform'
import { meanIndex } from '@/lib/customers/metrics'
import { PILLAR_LABELS, ratingsForPillar } from '@/lib/customers/schema'
import type {
  CustomerSummary,
  OrganizationRecord,
  RevisionMeta,
  StoredSubmission,
  WorkspaceReport,
} from '@/lib/customers/types'

const PILLARS = Object.keys(PILLAR_LABELS) as PillarKey[]

const THEME_RULES: { label: string; pattern: RegExp }[] = [
  { label: 'Deal desk and legal', pattern: /deal desk|legal|contract|security review/i },
  { label: 'Tools and admin', pattern: /crm|spreadsheet|\btools?\b|admin/i },
  { label: 'Manager coaching', pattern: /coach|manager|enablement|objection/i },
  { label: 'Compensation', pattern: /comp|spiff|quota|accelerator/i },
  { label: 'Handoffs and pipeline', pattern: /handoff|\bsdr\b|inbound|pipeline/i },
  { label: 'Message and proof', pattern: /marketing|message|proof|\broi\b|\bmql\b/i },
]

const ACTIONS: Record<PillarKey, { title: string; owner: string; metric: string }> = {
  process: {
    title: 'Clarify the stages sellers rated as least consistent',
    owner: 'Sales leadership',
    metric: 'Process clarity index on the next wave',
  },
  tools: {
    title: 'Cut the tool and admin load in the lowest-scoring workflows',
    owner: 'RevOps',
    metric: 'Tool index on the next wave',
  },
  enablement: {
    title: 'Put practice in front of sellers before the next live deals',
    owner: 'Enablement',
    metric: 'Enablement index on the next wave',
  },
  alignment: {
    title: 'Close the gap between the stated message and what sellers hear',
    owner: 'Product marketing',
    metric: 'Alignment index on the next wave',
  },
  support: {
    title: 'Shorten the support waits sellers rated most painful',
    owner: 'RevOps',
    metric: 'Support index on the next wave',
  },
  compensation: {
    title: 'Make the pay plan understandable before the next quota cycle',
    owner: 'Sales leadership',
    metric: 'Compensation clarity index on the next wave',
  },
}

type Wave = { meta: RevisionMeta; submissions: StoredSubmission[] }

function pillarMap(submissions: StoredSubmission[]): Record<PillarKey, number | null> {
  const scores = {} as Record<PillarKey, number | null>
  for (const pillar of PILLARS) {
    const keys = ratingsForPillar(pillar)
    const values = submissions.flatMap((submission) => keys.map((key) => submission.ratings[key]))
    scores[pillar] = meanIndex(values)
  }
  return scores
}

function overallFrom(pillars: Record<PillarKey, number | null>): number | null {
  const present = PILLARS.map((pillar) => pillars[pillar]).filter((score): score is number => score != null)
  if (!present.length) return null
  return Math.round(present.reduce((sum, score) => sum + score, 0) / present.length)
}

function validCount(submissions: StoredSubmission[], pillar: PillarKey): number {
  const keys = ratingsForPillar(pillar)
  return submissions.reduce(
    (count, submission) => count + keys.filter((key) => submission.ratings[key] != null).length,
    0,
  )
}

function confidence(count: number): 'high' | 'medium' | 'low' {
  if (count >= 30) return 'high'
  if (count >= 10) return 'medium'
  return 'low'
}

function rowMean(submission: StoredSubmission): number | null {
  return meanIndex(Object.values(submission.ratings))
}

function formatWhen(iso: string): string {
  return iso.slice(0, 10)
}

function segmentSpread(submissions: StoredSubmission[], key: 'region' | 'role') {
  const groups = new Map<string, StoredSubmission[]>()
  for (const submission of submissions) {
    const label = submission[key].trim()
    if (!label) continue
    const rows = groups.get(label) ?? []
    rows.push(submission)
    groups.set(label, rows)
  }
  const scored = Array.from(groups.entries())
    .map(([label, rows]) => ({ label, n: rows.length, score: overallFrom(pillarMap(rows)) }))
    .filter((group): group is { label: string; n: number; score: number } => group.n >= 3 && group.score != null)
  if (scored.length < 2) return null
  const ranked = [...scored].sort((a, b) => a.score - b.score)
  const low = ranked[0]
  const high = ranked[ranked.length - 1]
  if (high.score - low.score < 8) return null
  return { key, low, high }
}

export function buildBaselineReport(input: {
  organization: OrganizationRecord
  customers: CustomerSummary[]
  waves: Wave[]
  activeRevisionId: string
}): WorkspaceReport {
  const { organization, customers } = input
  const active = input.waves.find((wave) => wave.meta.id === input.activeRevisionId) ?? input.waves[input.waves.length - 1]
  const prior = input.waves
    .filter((wave) => wave.meta.id !== active.meta.id)
    .sort((a, b) => b.meta.publishedAt.localeCompare(a.meta.publishedAt))[0]
  const submissions = active.submissions
  const currentPillars = pillarMap(submissions)
  const priorPillars = prior ? pillarMap(prior.submissions) : null
  const overall = overallFrom(currentPillars)
  const priorOverall = priorPillars ? overallFrom(priorPillars) : null
  const hasPriorWave = priorOverall != null && overall != null
  const scored = PILLARS.map((key) => ({ key, score: currentPillars[key] })).filter(
    (pillar): pillar is { key: PillarKey; score: number } => pillar.score != null,
  )
  const weakest = [...scored].sort((a, b) => a.score - b.score)[0]
  const strongest = [...scored].sort((a, b) => b.score - a.score)[0]
  const totalValid = PILLARS.reduce((sum, pillar) => sum + validCount(submissions, pillar), 0)

  const pillars = PILLARS.map((key) => {
    const score = currentPillars[key]
    const valid = validCount(submissions, key)
    const priorScore = priorPillars?.[key]
    const available = score != null
    return {
      key,
      label: PILLAR_LABELS[key],
      score: score ?? 0,
      available,
      hasPriorWave: hasPriorWave && priorScore != null && available,
      showBenchmark: false,
      deltaCycle: hasPriorWave && priorScore != null && score != null ? score - priorScore : 0,
      deltaBenchmark: 0,
      narrative: available
        ? `${PILLAR_LABELS[key]} is ${score}/100 from ${valid} valid rating${valid === 1 ? '' : 's'}.${
            submissions.length - valid > 0
              ? ` ${submissions.length - valid} left it blank or marked N/A, and those were not scored as zero.`
              : ''
          }`
        : `${PILLAR_LABELS[key]} has no valid ratings in this wave, so it is not scored and it is not treated as zero.`,
    }
  })

  const history = [...input.waves].sort((a, b) => a.meta.publishedAt.localeCompare(b.meta.publishedAt))
  const sparkline = history
    .map((wave) => {
      const score = overallFrom(pillarMap(wave.submissions))
      return score == null ? null : { cycle: formatWhen(wave.meta.publishedAt), y: score }
    })
    .filter((point): point is { cycle: string; y: number } => point != null)

  const textRows = submissions.filter((submission) => submission.openFriction.trim())
  const themeBuckets = THEME_RULES.map((rule) => {
    const rows = textRows.filter((submission) => rule.pattern.test(submission.openFriction))
    return { ...rule, rows }
  }).filter((bucket) => bucket.rows.length > 0)
  const themes = themeBuckets.map((bucket) => {
    const sentiments = bucket.rows.map((row) => rowMean(row))
    const negative = sentiments.filter((score) => score != null && score <= 50).length
    const positive = sentiments.filter((score) => score != null && score >= 80).length
    const sentiment = negative > positive ? 'negative' : positive > negative ? 'positive' : 'mixed'
    return {
      id: bucket.label.toLowerCase().replace(/[^a-z]+/g, '-'),
      label: bucket.label,
      prevalence: Math.round((bucket.rows.length / textRows.length) * 100),
      sentiment: sentiment as 'mixed' | 'negative' | 'positive',
      quotes: bucket.rows.slice(0, 2).map((row) => `“${row.openFriction.trim().slice(0, 180)}”`),
    }
  })

  const spread = segmentSpread(submissions, 'region') ?? segmentSpread(submissions, 'role')
  const insights: Insight[] = []
  if (overall != null && strongest && weakest) {
    insights.push({
      id: 'baseline-overall',
      type: 'Baseline',
      headline: `${organization.name} is ${overall}/100 on the published wave`,
      body: `The index gives equal weight to each pillar that has at least one valid rating. Strongest is ${strongest.score} on ${PILLAR_LABELS[strongest.key].toLowerCase()}. Weakest is ${weakest.score} on ${PILLAR_LABELS[weakest.key].toLowerCase()}.`,
      severity: weakest.score < 60 ? 'risk' : 'neutral',
    })
  }
  if (spread) {
    insights.push({
      id: 'baseline-segment',
      type: 'Segment variance',
      headline: `${spread.high.label} scores higher than ${spread.low.label}`,
      body: `${spread.high.label} is ${spread.high.score}/100 (n=${spread.high.n}) and ${spread.low.label} is ${spread.low.score}/100 (n=${spread.low.n}), using the same pillar index.`,
      severity: 'risk' as const,
    })
  }

  const riskFlags = [
    ...scored.filter((pillar) => pillar.score < 60).map((pillar) => `${PILLAR_LABELS[pillar.key]} is ${pillar.score}/100.`),
    ...(totalValid < 5 ? ['Fewer than 5 valid ratings. Treat the index as a starting point, not a stable score.'] : []),
    ...(textRows.length === 0 ? ['No open-text answers in this wave, so themes are empty.'] : []),
  ]

  const ranked = [...scored].sort((a, b) => a.score - b.score).slice(0, 3)
  const recommendations: Recommendation[] = ranked.map((pillar) => {
    const action = ACTIONS[pillar.key]
    const valid = validCount(submissions, pillar.key)
    const priority = pillar.score < 60 ? 'P0' : pillar.score < 75 ? 'P1' : 'P2'
    const roles = Array.from(new Set(submissions.map((submission) => submission.role.trim()).filter(Boolean))).slice(0, 3)
    return {
      id: `rec-${pillar.key}`,
      title: action.title,
      issue: `${PILLAR_LABELS[pillar.key]} is ${pillar.score}/100 from ${valid} valid rating${valid === 1 ? '' : 's'}.${
        valid < 5 ? ' The sample is small.' : ''
      }`,
      whyItMatters: 'This is one of the lowest pillar indexes in the published wave.',
      expectedImpact: 'A later wave can show whether the index moves. This view does not predict a point lift.',
      affectedTeams: roles.length ? roles : ['All respondents'],
      owner: action.owner,
      priority,
      effort: pillar.score < 70 ? 'Medium' : 'Low',
      effortAxis: pillar.score < 70 ? 2 : 1,
      impactAxis: pillar.score < 60 ? 5 : pillar.score < 75 ? 4 : 3,
      confidence: Math.min(90, 35 + valid * 3),
      category: PILLAR_LABELS[pillar.key],
      evidenceSummary: `${valid} valid rating${valid === 1 ? '' : 's'} out of ${submissions.length} responses. Missing answers were excluded.`,
      followUpMetric: action.metric,
    }
  })

  const internal = spread
    ? { score: spread.high.score, label: `${spread.high.label} (n=${spread.high.n})` }
    : { score: null, label: null }

  const regions = new Set(submissions.map((submission) => submission.region.trim()).filter(Boolean))
  const summary =
    overall == null
      ? `${organization.name} has a published wave, but no valid 1–5 ratings yet. Blank and N/A answers were not turned into zeros.`
      : `${organization.name} scores ${overall}/100 on the seller baseline. ${PILLAR_LABELS[strongest.key]} is strongest at ${strongest.score}. ${PILLAR_LABELS[weakest.key]} is weakest at ${weakest.score}. External benchmarks are not applied to this account.`

  return {
    slug: organization.slug,
    organizationName: organization.name,
    industry: organization.industry,
    isDemo: false,
    published: true,
    hasPriorWave,
    badge: `${organization.name} · Executive`,
    customers,
    eyebrow: `${organization.name} · Seller baseline`,
    headline:
      overall == null
        ? 'Responses are published, and there are no valid ratings to score yet.'
        : `${organization.name} scores ${overall}/100 on the published baseline.`,
    description:
      'Every rating uses the same 0–100 index. A 4 on a 1–5 scale is 75. Blank, N/A, and Don\'t know stay out of the average.',
    cycle: {
      id: active.meta.id,
      label: `${organization.name} baseline`,
      period: `${submissions.length} response${submissions.length === 1 ? '' : 's'} · ${active.meta.id}`,
    },
    health: {
      score: overall,
      deltaCycle: hasPriorWave && priorOverall != null && overall != null ? overall - priorOverall : null,
      deltaBenchmark: null,
      narrative: summary,
      footnote: `${totalValid} valid ratings across ${submissions.length} responses. Pillars with no valid answers are omitted from the overall index.`,
    },
    sparkline,
    sparklineNote: hasPriorWave
      ? 'Each point is a published revision of this customer. DemoTech history is not included.'
      : 'First published wave. A later replace or append can show whether the index moves.',
    pillars,
    heatmap: pillars
      .filter((pillar) => pillar.available)
      .map((pillar) => ({
        dimension: pillar.label,
        stage: 'Baseline',
        intensity: 100 - pillar.score,
      })),
    heatmapCaption:
      'One column, because this template does not ask stage questions. Color is 100 minus the pillar index, so a lower score reads as more friction.',
    recommendations,
    benchmark: {
      available: false,
      release: 'none',
      label: organization.benchmarkEligible
        ? 'This account is marked benchmark-eligible, and no external benchmark release is loaded. DemoTech peer figures are not used.'
        : 'External benchmark unavailable. New customers are benchmark-ineligible until an explicit release exists. DemoTech figures stay inside the demo workspace.',
      yourScore: overall,
      peerMedian: null,
      internalTopTeam: internal.score,
      internalLabel: internal.label,
    },
    benchmarkNote: 'Peer medians are not estimated for this customer.',
    themes,
    insights,
    summary,
    riskFlags,
    dimensions: pillars
      .filter((pillar) => pillar.available)
      .map((pillar) => ({
        dimension: pillar.label,
        score: pillar.score,
        deltaCycle: pillar.deltaCycle,
        benchmarkGap: 0,
        confidence: confidence(validCount(submissions, pillar.key)),
      })),
    drivers: [...scored]
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((pillar) => ({
        driver: PILLAR_LABELS[pillar.key],
        severity: 100 - pillar.score,
        prevalence: `${validCount(submissions, pillar.key)} valid ratings`,
        ownerHint: ACTIONS[pillar.key].owner,
      })),
    driverCaption: 'Severity is 100 minus the pillar index. It is the same score, shown as friction.',
    stageFriction: [],
    stageCaption: 'This template has no stage questions, so stage friction is not scored.',
    programs: [
      {
        id: `prg_${organization.slug}`,
        name: `${organization.name} seller baseline`,
        status: 'closed',
        cohorts: Math.max(1, regions.size),
        responseRate: 0,
        targetRate: 0,
        closesOn: formatWhen(active.meta.publishedAt),
        participationNote: `${submissions.length} published responses. No invited population was provided, so a response rate is not shown.`,
      },
    ],
    responses: submissions.slice(0, 100).map((submission) => {
      const score = rowMean(submission)
      const matched = THEME_RULES.filter((rule) => rule.pattern.test(submission.openFriction)).map((rule) => rule.label)
      return {
        id: submission.responseId,
        excerpt: submission.openFriction.trim()
          ? `“${submission.openFriction.trim().slice(0, 220)}”`
          : 'No open text. This row contributed ratings only.',
        role: submission.role || '—',
        region: submission.region || '—',
        team: '—',
        themes: matched.length ? matched : ['Uncoded'],
        sentiment: score == null ? 'neutral' : score >= 80 ? 'positive' : score <= 50 ? 'negative' : 'neutral',
      }
    }),
    benchmarkDimensions: [],
    benchmarkInternal: [],
    actions: [],
    submissionCount: submissions.length,
    revisionId: active.meta.id,
    templateKey: 'seller-baseline',
  }
}
