import { DEMOTECH_CYCLE } from '@/lib/data/demotech/config'
import { getAllResponses } from '@/lib/data/demotech/load'
import {
  buildBenchmark,
  buildBenchmarkDimensions,
  buildDimensions,
  buildDrivers,
  buildHealthIndex,
  buildHeatmap,
  buildInsights,
  buildMockPillars,
  buildPrograms,
  buildRecommendations,
  buildResponseRows,
  buildStageFriction,
  buildThemeClusters,
} from '@/lib/data/demotech/aggregates'
import { MOCK_ACTION_ITEMS } from '@/lib/data/mock/actions'
import type { CustomerSummary, OrganizationRecord, WorkspaceReport } from '@/lib/customers/types'

const DEMO_SUMMARY =
  'Revenue org health is improving modestly cycle-over-cycle, driven by enablement and process clarity. The dominant risk is late-stage confidence: enterprise sellers report inconsistent manager coaching and slower support on complex pricing. Addressing these two drivers should reduce negotiated-stage stall and improve forecast reliability.'

export function buildDemotechReport(organization: OrganizationRecord, customers: CustomerSummary[]): WorkspaceReport {
  const health = buildHealthIndex()
  const pillars = buildMockPillars()
  const benchmark = buildBenchmark()
  const external = buildBenchmarkDimensions()
  const responses = getAllResponses()

  return {
    slug: organization.slug,
    organizationName: organization.name,
    industry: organization.industry,
    isDemo: true,
    published: true,
    hasPriorWave: true,
    badge: 'DemoTech · Executive',
    customers,
    eyebrow: 'DemoTech · Revenue organization health',
    headline: 'Your revenue organization is healthy overall — but seller confidence is breaking down in key moments.',
    description:
      'This overview is a narrative-first executive view: overall health, where friction concentrates, what changed, how you compare, and what to do next.',
    cycle: {
      id: DEMOTECH_CYCLE.id,
      label: DEMOTECH_CYCLE.label,
      period: DEMOTECH_CYCLE.period,
    },
    health: {
      score: health.score,
      deltaCycle: health.deltaCycle,
      deltaBenchmark: health.deltaBenchmark,
      narrative: health.narrative,
      footnote: 'Normalized 0–100. In production, pair with sample size, confidence, and cycle context.',
    },
    sparkline: [
      { cycle: 'Q3 2024', y: 69 },
      { cycle: 'Q4 2024', y: 71 },
      { cycle: 'Q1 2025', y: 73 },
      { cycle: 'Q2 2025', y: health.score },
    ],
    sparklineNote:
      'Earlier points are the DemoTech demo series shipped with this workspace. They are not a prior published revision, and they are not used for any other customer.',
    pillars,
    heatmap: buildHeatmap(pillars),
    heatmapCaption:
      'Stage × dimension heatmap shows where the operating environment adds drag. Drill into diagnostics for cohort splits.',
    recommendations: buildRecommendations(pillars),
    benchmark: {
      available: true,
      release: 'demo',
      label:
        'Demo benchmark release. These peer figures exist only inside the DemoTech workspace and are not applied to any other customer.',
      yourScore: benchmark.yourScore,
      peerMedian: benchmark.peerMedian,
      internalTopTeam: benchmark.internalTopTeam,
      internalLabel: 'Highest internal cohort in the demo model',
    },
    benchmarkNote:
      'You outperform the demo benchmark on ease of selling, but trail it on manager confidence and support consistency — matching the qualitative themes below.',
    themes: buildThemeClusters(),
    insights: buildInsights(pillars),
    summary: DEMO_SUMMARY,
    riskFlags: [
      'Support pillar divergence: Enterprise −12 pts vs Commercial over 2 cycles.',
      'Emerging qualitative cluster: “forecast pressure → bad hygiene” (+18% volume WoW).',
    ],
    dimensions: buildDimensions(),
    drivers: buildDrivers(),
    driverCaption: '',
    stageFriction: buildStageFriction(),
    stageCaption: '',
    programs: buildPrograms(),
    responses: buildResponseRows(40),
    benchmarkDimensions: external,
    benchmarkInternal: external.map((row) => ({
      ...row,
      peerP50: row.peerP50 - 2,
      peerP75: row.peerP75 + 3,
    })),
    actions: MOCK_ACTION_ITEMS,
    submissionCount: responses.length,
    revisionId: 'rev_demotech_q2_2025',
    templateKey: 'demotech-pulse',
  }
}
