import type {
  ActionItem,
  DimensionRow,
  DriverRow,
  FrictionCell,
  Insight,
  PillarScore,
  Program,
  Recommendation,
  ResponseRow,
  ThemeCluster,
} from '@/lib/types/platform'
import type { BASELINE_TEMPLATE, DEMO_TEMPLATE, RatingKey } from '@/lib/customers/schema'

export type TemplateKey = typeof BASELINE_TEMPLATE | typeof DEMO_TEMPLATE
export type OrgRole = 'admin' | 'analyst' | 'viewer'
export type ImportMode = 'replace' | 'append'

export type UserRecord = {
  id: string
  email: string
  name: string
  status: 'active' | 'disabled'
  platformAdmin?: boolean
}

export type OrganizationRecord = {
  id: string
  name: string
  slug: string
  status: 'active'
  industry: string
  sellerCountBand: string
  region: string
  benchmarkEligible: boolean
  isDemo: boolean
  createdAt: string
  createdBy: string
}

export type MembershipRecord = {
  id: string
  userId: string
  organizationId: string
  role: OrgRole
}

export type Catalog = {
  users: UserRecord[]
  organizations: OrganizationRecord[]
  memberships: MembershipRecord[]
}

export type RevisionMeta = {
  id: string
  templateKey: TemplateKey
  status: 'published'
  publishedAt: string
  publishedBy: string
  submissionCount: number
  contentHash: string
  mode: 'seed' | ImportMode
  sourceName: string
}

export type WorkspaceFile = {
  project: {
    id: string
    name: string
    templateKey: TemplateKey
    status: 'active'
  }
  dataset: {
    id: string
    name: string
    periodLabel: string
  }
  activeRevisionId: string | null
  revisions: RevisionMeta[]
}

export type StoredSubmission = {
  responseId: string
  respondentId: string
  responseDate: string | null
  region: string
  role: string
  ratings: Record<RatingKey, number | null>
  openFriction: string
}

export type RevisionPayload = {
  id: string
  submissions: StoredSubmission[]
}

export type ImportIssue = {
  row?: number
  column?: string
  message: string
}

export type CustomerSummary = {
  slug: string
  name: string
  isDemo: boolean
}

export type BenchmarkView = {
  available: boolean
  release: 'demo' | 'none'
  label: string
  yourScore: number | null
  peerMedian: number | null
  internalTopTeam: number | null
  internalLabel: string | null
}

export type WorkspaceReport = {
  slug: string
  organizationName: string
  industry: string
  isDemo: boolean
  published: boolean
  hasPriorWave: boolean
  badge: string
  customers: CustomerSummary[]
  eyebrow: string
  headline: string
  description: string
  cycle: { id: string; label: string; period: string }
  health: {
    score: number | null
    deltaCycle: number | null
    deltaBenchmark: number | null
    narrative: string
    footnote: string
  }
  sparkline: { cycle: string; y: number }[]
  sparklineNote: string
  pillars: PillarScore[]
  heatmap: FrictionCell[]
  heatmapCaption: string
  recommendations: Recommendation[]
  benchmark: BenchmarkView
  benchmarkNote: string
  themes: ThemeCluster[]
  insights: Insight[]
  summary: string
  riskFlags: string[]
  dimensions: DimensionRow[]
  drivers: DriverRow[]
  driverCaption: string
  stageFriction: { stage: string; score: number }[]
  stageCaption: string
  programs: Program[]
  responses: ResponseRow[]
  benchmarkDimensions: { dimension: string; you: number; peerP50: number; peerP75: number }[]
  benchmarkInternal: { dimension: string; you: number; peerP50: number; peerP75: number }[]
  actions: ActionItem[]
  submissionCount: number
  revisionId: string | null
  templateKey: TemplateKey | null
}
