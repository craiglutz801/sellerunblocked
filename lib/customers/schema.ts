import type { PillarKey } from '@/lib/types/platform'

export const BASELINE_TEMPLATE = 'seller-baseline' as const
export const DEMO_TEMPLATE = 'demotech-pulse' as const

export const MAX_IMPORT_ROWS = 5000
export const MAX_IMPORT_BYTES = 2_000_000

export const MISSING_RATING_TOKENS = ['', 'n/a', 'na', 'dont know', "don't know", 'dk', '—', '-', 'not applicable']

export type BaselineColumn =
  | { key: 'response_id'; kind: 'key'; required: true }
  | { key: 'respondent_id'; kind: 'respondent'; required: false }
  | { key: 'response_date'; kind: 'date'; required: false }
  | { key: 'region' | 'role'; kind: 'attribute'; required: false }
  | { key: RatingKey; kind: 'rating'; pillar: PillarKey; prompt: string; required: false }
  | { key: 'open_friction'; kind: 'text'; required: false }

export type RatingKey =
  | 'process_clarity'
  | 'tool_burden'
  | 'enablement_readiness'
  | 'message_alignment'
  | 'support_speed'
  | 'comp_clarity'

export const BASELINE_COLUMNS: BaselineColumn[] = [
  { key: 'response_id', kind: 'key', required: true },
  { key: 'respondent_id', kind: 'respondent', required: false },
  { key: 'response_date', kind: 'date', required: false },
  { key: 'region', kind: 'attribute', required: false },
  { key: 'role', kind: 'attribute', required: false },
  {
    key: 'process_clarity',
    kind: 'rating',
    pillar: 'process',
    prompt: 'I can explain our stages and what good looks like at each one.',
    required: false,
  },
  {
    key: 'tool_burden',
    kind: 'rating',
    pillar: 'tools',
    prompt: 'The tools I use give selling time back more than they take it.',
    required: false,
  },
  {
    key: 'enablement_readiness',
    kind: 'rating',
    pillar: 'enablement',
    prompt: 'I have the practice and content I need before a live deal.',
    required: false,
  },
  {
    key: 'message_alignment',
    kind: 'rating',
    pillar: 'alignment',
    prompt: 'What marketing says matches what buyers ask me.',
    required: false,
  },
  {
    key: 'support_speed',
    kind: 'rating',
    pillar: 'support',
    prompt: 'Deal desk, legal, and specialists respond in time to keep deals moving.',
    required: false,
  },
  {
    key: 'comp_clarity',
    kind: 'rating',
    pillar: 'compensation',
    prompt: 'I can explain how I get paid, including accelerators and SPIFs.',
    required: false,
  },
  { key: 'open_friction', kind: 'text', required: false },
]

export const RATING_COLUMNS = BASELINE_COLUMNS.filter((column) => column.kind === 'rating')

export const PILLAR_LABELS: Record<PillarKey, string> = {
  process: 'Process',
  tools: 'Tools',
  enablement: 'Enablement',
  alignment: 'Alignment',
  support: 'Support',
  compensation: 'Compensation',
}

export function ratingsForPillar(pillar: PillarKey): RatingKey[] {
  return RATING_COLUMNS.filter((column) => column.pillar === pillar).map((column) => column.key)
}
