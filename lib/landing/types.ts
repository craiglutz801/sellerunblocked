export type DemoPriority = {
  id: string
  rank: number
  title: string
  shortTitle: string
  priority: string
  whyNow: string
  signalCount: number
  segments: string[]
  affected: string
  trend: string
  trendLabel: string
  diagnosis: string
  recommendation: string
  owner: string
  status: 'Open' | 'Planned' | 'Investigating'
  confidence: string
  prevalence: string
  snippets: string[]
  measureNext: string
  businessConsequence: string
}

export type DemoAnswer = {
  id: string
  question: string
  chip: string
  lead: string
  evidenceCount: number
  segments: string[]
  trend: string
  nextStep: string
  owner: string
  snippets: string[]
}

export type FrictionZone = {
  id: string
  label: string
  examples: string[]
}

export type EngineStage = {
  id: string
  index: string
  name: string
  body: string
}
