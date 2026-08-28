export type MeasurementCycle = {
  id: string
  label: string
  period: string
}

export type PillarKey =
  | 'process'
  | 'tools'
  | 'enablement'
  | 'alignment'
  | 'support'
  | 'compensation'

export type PillarScore = {
  key: PillarKey
  label: string
  score: number
  deltaCycle: number
  deltaBenchmark: number
  narrative: string
}

export type FrictionCell = {
  dimension: string
  stage: string
  intensity: number
}

export type EvidenceSourceKind = 'system' | 'seller' | 'question'

export type EvidenceSource = {
  kind: EvidenceSourceKind
  label: string
  detail: string
}

export type Recommendation = {
  id: string
  title: string
  issue: string
  whyItMatters: string
  expectedImpact: string
  affectedTeams: string[]
  owner: string
  priority: 'P0' | 'P1' | 'P2'
  effort: 'Low' | 'Medium' | 'High'
  /** 1 = low effort, 3 = high effort — for prioritization matrix */
  effortAxis: 1 | 2 | 3
  /** 1 = lower impact, 5 = higher impact */
  impactAxis: 1 | 2 | 3 | 4 | 5
  confidence: number
  category: string
  evidenceSummary: string
  followUpMetric: string
  evidenceSources?: EvidenceSource[]
  targetedQuestion?: string
}

export type Insight = {
  id: string
  type: string
  headline: string
  body: string
  severity: 'positive' | 'neutral' | 'risk'
  sources?: EvidenceSource[]
}

export type ThemeCluster = {
  id: string
  label: string
  prevalence: number
  sentiment: 'mixed' | 'negative' | 'positive'
  quotes: string[]
}

export type Program = {
  id: string
  name: string
  status: 'active' | 'scheduled' | 'closed'
  cohorts: number
  responseRate: number
  targetRate: number
  closesOn: string
}

export type ResponseRow = {
  id: string
  excerpt: string
  role: string
  region: string
  team: string
  themes: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

export type DimensionRow = {
  dimension: string
  score: number
  deltaCycle: number
  benchmarkGap: number
  confidence: 'high' | 'medium' | 'low'
}

export type DriverRow = {
  driver: string
  severity: number
  prevalence: string
  ownerHint: string
}


export type ActionItem = {
  id: string
  title: string
  recommendationId: string
  owner: string
  assignee: string
  dueDate: string
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  priority: 'P0' | 'P1' | 'P2'
  notesCount: number
  lastNote: string
  slackChannel: string
  lastSlackMessageAt: string
}
