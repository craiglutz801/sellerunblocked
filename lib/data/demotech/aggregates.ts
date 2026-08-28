import type {
  DimensionRow,
  DriverRow,
  EvidenceSource,
  FrictionCell,
  Insight,
  PillarKey,
  PillarScore,
  Program,
  Recommendation,
  ResponseRow,
  ThemeCluster,
} from '@/lib/types/platform'
import type { SurveyResponse } from '@/lib/types/rep'
import {
  PILLAR_LABELS,
  PILLAR_QUESTION_MAP,
  QUESTION_GROUPS,
  STAGE_QUESTIONS,
} from '@/lib/data/demotech/config'
import { getAllResponses, getIcResponses } from '@/lib/data/demotech/load'

const BENCHMARK_PILLARS: Record<PillarKey, number> = {
  process: 74,
  tools: 73,
  enablement: 72,
  alignment: 75,
  support: 76,
  compensation: 74,
}

function avg(ids: readonly string[], row: SurveyResponse): number {
  const vals = ids.map((id) => Number(row[id])).filter((n) => !Number.isNaN(n))
  if (!vals.length) return 3
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function likertToScore(likertAvg: number): number {
  return Math.round(((likertAvg - 1) / 4) * 100)
}

export function pillarAvg(responses: SurveyResponse[], key: PillarKey): number {
  const ids = PILLAR_QUESTION_MAP[key]
  const avgs = responses.map((r) => avg(ids, r))
  return avgs.reduce((a, b) => a + b, 0) / avgs.length
}

export function orgPillarScores(): Record<PillarKey, number> {
  const responses = getAllResponses()
  return (Object.keys(PILLAR_QUESTION_MAP) as PillarKey[]).reduce(
    (acc, key) => {
      acc[key] = likertToScore(pillarAvg(responses, key))
      return acc
    },
    {} as Record<PillarKey, number>,
  )
}

export function orgOverallScore(): number {
  const responses = getAllResponses()
  const avgs = responses.map((r) => avg(QUESTION_GROUPS.overall, r))
  const mean = avgs.reduce((a, b) => a + b, 0) / avgs.length
  return likertToScore(mean)
}

export function repPillarScores(row: SurveyResponse): Record<PillarKey, number> {
  return (Object.keys(PILLAR_QUESTION_MAP) as PillarKey[]).reduce(
    (acc, key) => {
      acc[key] = likertToScore(avg(PILLAR_QUESTION_MAP[key], row))
      return acc
    },
    {} as Record<PillarKey, number>,
  )
}

export function repStageScores(row: SurveyResponse): Record<string, number> {
  return Object.fromEntries(
    Object.entries(STAGE_QUESTIONS).map(([stage, qid]) => [
      stage,
      likertToScore(Number(row[qid])),
    ]),
  )
}

function narrativeForPillar(key: PillarKey, score: number): string {
  const narratives: Record<PillarKey, [string, string, string]> = {
    process: [
      'Stage definitions and handoffs still create avoidable deal friction.',
      'Process is understood; consistency across managers varies.',
      'Stages are clear and forecasting hygiene is improving.',
    ],
    tools: [
      'CRM and content findability tax selling time weekly.',
      'Demo platform lands well; reporting load remains heavy.',
      'Tooling supports the field motion with minimal workaround.',
    ],
    enablement: [
      'Playbooks exist but live practice on objections is thin.',
      'Enablement content is relevant; coaching depth varies by manager.',
      'Onboarding and playbooks are landing well with new hires.',
    ],
    alignment: [
      'Marketing proof and MQL quality misalign with field reality.',
      'Mid-funnel ROI narrative needs tighter PMM coordination.',
      'GTM messaging and campaigns reflect what sellers hear in market.',
    ],
    support: [
      'Deal desk and legal turnaround is the dominant late-stage drag.',
      'SE coverage and RevOps responsiveness are inconsistent under load.',
      'Support functions respond predictably when deals get complex.',
    ],
    compensation: [
      'SPIFF noise and plan complexity create quarterly confusion.',
      'Comp is understood; accelerator thresholds feel late.',
      'Comp plan clarity and transparency are strong.',
    ],
  }
  const tier = score < 65 ? 0 : score < 78 ? 1 : 2
  return narratives[key][tier]
}

export function buildMockPillars(): PillarScore[] {
  const scores = orgPillarScores()
  return (Object.keys(scores) as PillarKey[]).map((key) => {
    const score = scores[key]
    const benchmark = BENCHMARK_PILLARS[key]
    return {
      key,
      label: PILLAR_LABELS[key],
      score,
      deltaCycle: key === 'support' ? -4 : key === 'enablement' ? 3 : key === 'tools' ? -1 : 2,
      deltaBenchmark: score - benchmark,
      narrative: narrativeForPillar(key, score),
    }
  })
}

export function buildHealthIndex() {
  const score = orgOverallScore()
  const pillars = buildMockPillars()
  const weakest = [...pillars].sort((a, b) => a.score - b.score)[0]
  const strongest = [...pillars].sort((a, b) => b.score - a.score)[0]
  return {
    score,
    deltaCycle: 2,
    deltaBenchmark: score - 72,
    narrative: `DemoTech's revenue org scores ${score}/100 overall — strong on ${strongest.label.toLowerCase()}, but ${weakest.label.toLowerCase()} is the primary drag. Seller confidence drops in late-stage moments, especially around support turnaround and proof-point alignment.`,
  }
}

const STAGES = ['Discover', 'Qualify', 'Propose', 'Negotiate', 'Close']

export function buildHeatmap(pillars: PillarScore[]): FrictionCell[] {
  return pillars.flatMap((p) =>
    STAGES.map((stage, i) => ({
      dimension: p.label,
      stage,
      intensity: Math.min(
        100,
        Math.round(100 - p.score + (p.key === 'support' ? 15 : 0) + (stage === 'Negotiate' ? 12 : 0) + i * 2),
      ),
    })),
  )
}

export function buildDimensions(): DimensionRow[] {
  const responses = getAllResponses()
  const dims: { label: string; ids: readonly string[] }[] = [
    { label: 'Sales process effectiveness', ids: QUESTION_GROUPS.process },
    { label: 'Technology & tools', ids: QUESTION_GROUPS.tools },
    { label: 'Sales enablement', ids: QUESTION_GROUPS.enablement },
    { label: 'Marketing alignment', ids: QUESTION_GROUPS.marketing_alignment },
    { label: 'Lead quality & pipeline support', ids: QUESTION_GROUPS.pipeline },
    { label: 'Compensation & incentives', ids: QUESTION_GROUPS.compensation },
    { label: 'Internal support systems', ids: QUESTION_GROUPS.support },
    { label: 'Organizational alignment', ids: QUESTION_GROUPS.org_alignment },
  ]
  return dims.map((d) => {
    const mean = responses.map((r) => avg(d.ids, r)).reduce((a, b) => a + b, 0) / responses.length
    const score = likertToScore(mean)
    return {
      dimension: d.label,
      score,
      deltaCycle: d.label.includes('support') ? -4 : d.label.includes('enablement') ? 3 : 1,
      benchmarkGap: score - 72,
      confidence: responses.length >= 200 ? 'high' : 'medium',
    }
  })
}

export function buildStageFriction() {
  const responses = getAllResponses()
  return Object.entries(STAGE_QUESTIONS).map(([stage, qid]) => {
    const mean =
      responses.map((r) => Number(r[qid])).reduce((a, b) => a + b, 0) / responses.length
    return { stage: stage.replace(' / Negotiate', ''), score: likertToScore(mean) }
  })
}

function themeFromText(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('deal desk') || t.includes('legal') || t.includes('security')) return 'Support'
  if (t.includes('enablement') || t.includes('coaching') || t.includes('objection')) return 'Enablement'
  if (t.includes('marketing') || t.includes('mql') || t.includes('roi')) return 'Alignment'
  if (t.includes('handoff') || t.includes('stage') || t.includes('forecast')) return 'Process'
  if (t.includes('crm') || t.includes('demo') || t.includes('tool')) return 'Tools'
  if (t.includes('comp') || t.includes('spiff') || t.includes('accelerator')) return 'Compensation'
  if (t.includes('territory') || t.includes('pipeline') || t.includes('inbound')) return 'Pipeline'
  return 'General'
}

function sentimentFromScores(row: SurveyResponse): 'positive' | 'neutral' | 'negative' {
  const o = avg(QUESTION_GROUPS.overall, row)
  if (o >= 4) return 'positive'
  if (o <= 2.5) return 'negative'
  return 'neutral'
}

export function buildResponseRows(limit = 40): ResponseRow[] {
  return getIcResponses()
    .filter((r) => r.L1?.trim())
    .slice(0, limit)
    .map((r) => ({
      id: r.response_id,
      excerpt: r.L1.startsWith('"') ? r.L1 : `“${r.L1}”`,
      role: r.title,
      region: r.location.includes('Remote') ? r.location : r.location.split(',')[0],
      team: r.team_segment,
      themes: [themeFromText(r.L1), themeFromText(r.L3 || r.L2)].filter(
        (v, i, a) => v !== 'General' && a.indexOf(v) === i,
      ),
      sentiment: sentimentFromScores(r),
    }))
}

export function buildThemeClusters(): ThemeCluster[] {
  const responses = getIcResponses()
  const buckets = new Map<string, string[]>()

  for (const r of responses) {
    for (const text of [r.L1, r.L3].filter(Boolean)) {
      const theme = themeFromText(text)
      if (theme === 'General') continue
      const list = buckets.get(theme) ?? []
      if (list.length < 8) list.push(text.startsWith('"') ? text : `“${text}”`)
      buckets.set(theme, list)
    }
  }

  const labels: Record<string, string> = {
    Support: 'Deal desk & legal turnaround',
    Enablement: 'Coaching & objection-handling gaps',
    Alignment: 'Marketing proof & MQL quality',
    Process: 'Handoffs & stage definition drift',
    Tools: 'CRM burden & demo environment stability',
    Pipeline: 'Territory & inbound pipeline pressure',
    Compensation: 'Comp plan complexity & SPIFF noise',
  }

  const total = responses.length
  return Array.from(buckets.entries())
    .map(([key, quotes]) => ({
      id: `th-${key.toLowerCase()}`,
      label: labels[key] ?? key,
      prevalence: Math.round((quotes.length / total) * 100 * 2.2),
      sentiment: key === 'Tools' ? ('mixed' as const) : ('negative' as const),
      quotes: quotes.slice(0, 2),
    }))
    .sort((a, b) => b.prevalence - a.prevalence)
    .slice(0, 4)
}

export const DEAL_DESK_EVIDENCE: EvidenceSource[] = [
  {
    kind: 'system',
    label: 'Salesforce',
    detail: 'Enterprise deals lose ~8 days in discount approval versus commercial peers.',
  },
  {
    kind: 'system',
    label: 'Gong',
    detail: 'Topics and trackers fire on “I need to get that approved” in late-stage calls.',
  },
  {
    kind: 'system',
    label: 'Microsoft 365',
    detail: 'Enterprise AEs attend extra internal pricing meetings each week (calendar metadata).',
  },
  {
    kind: 'seller',
    label: 'Seller insight',
    detail: 'Support pillar is lowest; 22% of quotes mention legal / deal desk wait time.',
  },
  {
    kind: 'question',
    label: 'Targeted question',
    detail: 'Your quotes are taking four days longer than average — what happens after submission?',
  },
]

export const DEAL_DESK_QUESTION =
  'Your quotes are taking four days longer than average — what happens after submission?'

export const FRICTION_DETECTIVE_CASE = {
  eyebrow: 'Friction Detective',
  headline: 'Enterprise deals lose eight days in discount approval — not a seller skill gap.',
  body: 'Salesforce, Gong, calendar metadata, and seller insight agree. One targeted question confirmed where the breakdown occurs. Leadership sees the cohort pattern, not named reps.',
  cohort: 'Enterprise AEs · aggregated',
  recommendationId: 'rec-1' as const,
  sources: DEAL_DESK_EVIDENCE,
}

export function buildRecommendations(pillars: PillarScore[]): Recommendation[] {
  const sorted = [...pillars].sort((a, b) => a.score - b.score)
  const support = sorted.find((p) => p.key === 'support')!
  const alignment = sorted.find((p) => p.key === 'alignment')!
  const enablement = sorted.find((p) => p.key === 'enablement')!

  return [
    {
      id: 'rec-1',
      title: 'Cap deal desk & legal review SLA for enterprise deals',
      issue: `Support scores ${support.score}/100 — ${Math.abs(support.deltaBenchmark)} pts vs benchmark. Legal and pricing turnaround is the top open-text theme.`,
      whyItMatters: 'Late-stage champions go dark when reviews slip 2–3 weeks.',
      expectedImpact: 'Recover ~5–8 days in sales cycle; improve Negotiate-stage confidence.',
      affectedTeams: ['Enterprise AE', 'Strategic AE', 'Deal Desk'],
      owner: 'RevOps + Legal Ops',
      priority: 'P0',
      effort: 'Medium',
      effortAxis: 2,
      impactAxis: 5,
      confidence: 84,
      category: 'Internal support',
      evidenceSummary: `${getAllResponses().length} DemoTech responses; Support pillar lowest; Salesforce stage dwell + Gong approval trackers + calendar metadata confirm an internal bottleneck.`,
      followUpMetric: 'P95 approval time and Negotiate-stage conversion (deal velocity)',
      evidenceSources: DEAL_DESK_EVIDENCE,
      targetedQuestion: DEAL_DESK_QUESTION,
    },
    {
      id: 'rec-2',
      title: 'Ship CFO-ready ROI proof pack for mid-market & enterprise',
      issue: `Alignment at ${alignment.score}/100. Sellers rebuild ROI slides weekly; MQL quality is a recurring frustration.`,
      whyItMatters: 'Buyers stall when proof does not match the marketing promise.',
      expectedImpact: 'Improve Propose-stage progression and reduce no-decision losses.',
      affectedTeams: ['Product Marketing', 'Enterprise AE', 'Mid-Market AE'],
      owner: 'CRO / CMO',
      priority: 'P1',
      effort: 'Medium',
      effortAxis: 2,
      impactAxis: 4,
      confidence: 76,
      category: 'Marketing-sales alignment',
      evidenceSummary: 'Alignment + marketing question groups trail org average; ROI/MQL themes in 18% of open text.',
      followUpMetric: 'Stage 3→4 conversion + content attach rate',
    },
    {
      id: 'rec-3',
      title: 'Launch live objection labs (replace async enablement modules)',
      issue: `Enablement at ${enablement.score}/100 — playbooks land but live practice is under-indexed.`,
      whyItMatters: 'Manager coaching inconsistency shows up in Negotiate-stage scores.',
      expectedImpact: 'Lift manager confidence proxy +4–6 pts within one cycle.',
      affectedTeams: ['Commercial AE', 'Enterprise AE', 'Sales Managers'],
      owner: 'VP Sales + Enablement',
      priority: 'P1',
      effort: 'Low',
      effortAxis: 1,
      impactAxis: 4,
      confidence: 71,
      category: 'Manager coaching',
      evidenceSummary: 'Enablement open text requests role-play; J4 manager coaching below org median.',
      followUpMetric: 'Negotiate confidence + coaching coverage',
    },
  ]
}

export function buildInsights(pillars: PillarScore[]): Insight[] {
  const enterprise = getAllResponses().filter((r) => r.team_segment === 'Enterprise')
  const commercial = getAllResponses().filter((r) => r.team_segment === 'Commercial')
  const entSupport = likertToScore(pillarAvg(enterprise, 'support'))
  const comSupport = likertToScore(pillarAvg(commercial, 'support'))

  return [
    {
      id: 'in-0',
      type: 'Friction Detective',
      headline: 'Discount approval stall is internal — four systems plus one question, no named reps',
      body: 'Enterprise deals lose ~8 days in approval. Gong trackers, extra pricing meetings, and seller quotes point to the same bottleneck. Affected AEs were asked one question; leadership sees the aggregated cause, not individual calendars or transcripts.',
      severity: 'risk',
      sources: DEAL_DESK_EVIDENCE,
    },
    {
      id: 'in-1',
      type: 'Segment variance',
      headline: 'Enterprise support confidence trails Commercial by a widening margin',
      body: `Enterprise support scores ${entSupport}/100 vs Commercial ${comSupport}/100. Legal review and SE coverage dominate Enterprise open text.`,
      severity: 'risk',
    },
    {
      id: 'in-2',
      type: 'Trend',
      headline: 'Demo-stage confidence is a bright spot — reps dogfood the product',
      body: 'K3 (demo confidence) averages highest across stages. Internal demo environment stability remains a minor irony in open feedback.',
      severity: 'positive',
    },
    {
      id: 'in-3',
      type: 'Benchmark',
      headline: 'Tools & demo platform outperform peer benchmark',
      body: `Tools pillar at ${pillars.find((p) => p.key === 'tools')?.score}/100 — sellers rate DemoTech's own platform strongly in live selling.`,
      severity: 'positive',
    },
    {
      id: 'in-4',
      type: 'Risk',
      headline: 'Remote sellers report weaker GTM alignment than HQ cohorts',
      body: 'Remote locations score ~6 pts lower on org alignment questions; “last to know” shows up in open text.',
      severity: 'risk',
    },
  ]
}

export function buildDrivers(): DriverRow[] {
  return [
    {
      driver: 'Legal & deal desk turnaround',
      severity: 88,
      prevalence: '31% of sellers (open text)',
      ownerHint: 'RevOps / Legal Ops',
    },
    {
      driver: 'ROI / CFO proof gap',
      severity: 74,
      prevalence: '24% of AEs',
      ownerHint: 'Product Marketing',
    },
    {
      driver: 'SDR → AE handoff quality',
      severity: 68,
      prevalence: '19% of field',
      ownerHint: 'RevOps + Sales Dev',
    },
    {
      driver: 'Manager coaching inconsistency',
      severity: 61,
      prevalence: 'Cross-segment',
      ownerHint: 'Enablement + front-line managers',
    },
  ]
}

export function buildPrograms(): Program[] {
  const n = getAllResponses().length
  return [
    {
      id: 'pr-demotech-q2',
      name: 'DemoTech revenue org health — Q2 2025',
      status: 'closed',
      cohorts: 6,
      responseRate: Math.round((n / 520) * 100),
      targetRate: 85,
      closesOn: 'May 31, 2025',
    },
    {
      id: 'pr-demotech-ic-kits',
      name: 'IC enablement kit delivery — Q2 follow-up',
      status: 'active',
      cohorts: 4,
      responseRate: 62,
      targetRate: 90,
      closesOn: 'Jun 30, 2025',
    },
  ]
}

export function buildBenchmark() {
  const score = orgOverallScore()
  return {
    internalTopTeam: Math.min(92, score + 12),
    peerMedian: 72,
    yourScore: score,
    label: 'External peer set: B2B SaaS demo & sales-tech, 100–600 sellers (n=24 orgs, SellerUnblocked benchmark)',
  }
}

export function buildBenchmarkDimensions() {
  const score = orgOverallScore()
  const pillars = orgPillarScores()
  const ease = likertToScore(
    getAllResponses()
      .map((r) => avg([...QUESTION_GROUPS.process, ...QUESTION_GROUPS.tools], r))
      .reduce((a, b) => a + b, 0) / getAllResponses().length,
  )
  const mgr = likertToScore(
    getAllResponses()
      .map((r) => avg(['J4', 'D3'], r))
      .reduce((a, b) => a + b, 0) / getAllResponses().length,
  )
  return [
    { dimension: 'Overall health', you: score, peerP50: 72, peerP75: 81 },
    { dimension: 'Ease of selling', you: ease, peerP50: 74, peerP75: 82 },
    { dimension: 'Manager confidence', you: mgr, peerP50: 74, peerP75: 79 },
    { dimension: 'Tool efficiency', you: pillars.tools, peerP50: 71, peerP75: 78 },
    { dimension: 'Internal alignment', you: pillars.alignment, peerP50: 72, peerP75: 77 },
  ]
}
