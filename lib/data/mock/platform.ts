import type { MeasurementCycle } from '@/lib/types/platform'
import { DEMOTECH_CYCLE } from '@/lib/data/demotech/config'
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

export const MOCK_CYCLE: MeasurementCycle = {
  id: DEMOTECH_CYCLE.id,
  label: DEMOTECH_CYCLE.label,
  period: DEMOTECH_CYCLE.period,
}

const PILLARS = buildMockPillars()

export const MOCK_HEALTH_INDEX = buildHealthIndex()

export const MOCK_SPARKLINE = [
  { cycle: 'Q3 2024', y: 69 },
  { cycle: 'Q4 2024', y: 71 },
  { cycle: 'Q1 2025', y: 73 },
  { cycle: 'Q2 2025', y: MOCK_HEALTH_INDEX.score },
]

export const MOCK_PILLARS = PILLARS

export const MOCK_HEATMAP = buildHeatmap(PILLARS)

export const MOCK_RECOMMENDATIONS = buildRecommendations(PILLARS)

export const MOCK_BENCHMARK = buildBenchmark()

export const MOCK_THEMES = buildThemeClusters()

export const MOCK_INSIGHTS = buildInsights(PILLARS)

export { DEAL_DESK_EVIDENCE, DEAL_DESK_QUESTION, FRICTION_DETECTIVE_CASE } from '@/lib/data/demotech/aggregates'

export const MOCK_DIMENSIONS = buildDimensions()

export const MOCK_DRIVERS = buildDrivers()

export const MOCK_STAGE_FRICTION = buildStageFriction()

export const MOCK_PROGRAMS = buildPrograms()

export const MOCK_RESPONSES = buildResponseRows(40)

export const MOCK_BENCHMARK_DIMENSIONS = buildBenchmarkDimensions()

export const MOCK_BENCHMARK_INTERNAL = buildBenchmarkDimensions().map((d) => ({
  ...d,
  peerP50: d.peerP50 - 2,
  peerP75: d.peerP75 + 3,
}))

export { MOCK_ACTION_ITEMS } from '@/lib/data/mock/actions'
