/** Synthetic baseline wave used to review UnblockedAI. Scores are computed, not hard-coded in the UI. */
export const FIELDLINE_NAME = 'Fieldline'

const COMMENTS = [
  'Quote exceptions sit with deal desk for days before anyone answers.',
  'When a quote needs an exception, legal and the specialist queue both wait.',
  'The delay starts after the quote exception, not during the first pricing pass.',
]

function roleFor(index: number): string {
  if (index < 10) return 'Account Executive'
  if (index < 18) return 'Sales Manager'
  if (index < 21) return 'Solutions Consultant'
  return 'Partner Manager'
}

function supportFor(index: number): string {
  if (index < 8) return '2'
  if (index < 20) return '3'
  return ''
}

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function fieldlineCsv(): string {
  const header = [
    'response_id',
    'respondent_id',
    'response_date',
    'region',
    'role',
    'process_clarity',
    'tool_burden',
    'enablement_readiness',
    'message_alignment',
    'support_speed',
    'comp_clarity',
    'open_friction',
  ]
  const lines = [header.join(',')]
  for (let index = 0; index < 24; index += 1) {
    const day = String(index + 1).padStart(2, '0')
    const row = [
      `FL-${String(index + 1).padStart(2, '0')}`,
      `r${String(index + 1).padStart(2, '0')}`,
      `2026-03-${day}`,
      index < 12 ? 'East' : 'West',
      roleFor(index),
      '4',
      '4',
      '5',
      '4',
      supportFor(index),
      '4',
      COMMENTS[index] ?? '',
    ]
    lines.push(row.map(csvCell).join(','))
  }
  return `${lines.join('\n')}\n`
}

export function fieldlineLaterCsv(): string {
  const header = 'response_id,respondent_id,response_date,region,role,process_clarity,tool_burden,enablement_readiness,message_alignment,support_speed,comp_clarity,open_friction'
  const lines = [header]
  for (let index = 0; index < 10; index += 1) {
    const day = String(index + 1).padStart(2, '0')
    lines.push(
      [
        `FL2-${day}`,
        `s${day}`,
        `2026-06-${day}`,
        'East',
        'Account Executive',
        '4',
        '4',
        '5',
        '4',
        '5',
        '4',
        '',
      ].join(','),
    )
  }
  return `${lines.join('\n')}\n`
}
