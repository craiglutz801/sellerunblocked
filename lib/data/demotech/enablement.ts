import type { PillarKey } from '@/lib/types/platform'
import type { EnablementKit, KitModule, RepFocusArea, RepSnapshot, SurveyResponse } from '@/lib/types/rep'
import { DEMOTECH_CYCLE } from '@/lib/data/demotech/config'
import {
  likertToScore,
  orgPillarScores,
  orgOverallScore,
  repPillarScores,
  repStageScores,
  pillarAvg,
} from '@/lib/data/demotech/aggregates'
import { PILLAR_LABELS, PILLAR_QUESTION_MAP, QUESTION_GROUPS } from '@/lib/data/demotech/config'
import { getAllResponses, getResponseByEmployeeId } from '@/lib/data/demotech/load'

const EMPATHY: Record<PillarKey, string> = {
  process: 'Process friction is an org design problem — not a reflection of how you sell.',
  tools: 'When tools slow you down, that is lost selling time the company should fix.',
  enablement: 'Wanting better coaching and practice is professional, not a complaint.',
  alignment: 'Misaligned marketing creates rework — you should not have to rebuild the story alone.',
  support: 'Waiting on deal desk or legal is real drag; your frustration is valid.',
  compensation: 'Comp confusion creates anxiety that has nothing to do with your effort.',
}

const MODULE_CATALOG: Record<
  PillarKey | 'stage_negotiate' | 'stage_close',
  Omit<KitModule, 'id' | 'status' | 'progress'>[]
> = {
  process: [
    {
      title: 'Stage definitions — single source of truth',
      description: 'One-page cheat sheet aligned with RevOps. Know exactly what “Qualified” and “Propose” mean at DemoTech.',
      type: 'playbook',
      durationMinutes: 10,
      pillar: 'process',
    },
    {
      title: 'SDR → AE handoff checklist',
      description: 'Required context fields before you accept an opp. Use this to stop re-discovering pain on call one.',
      type: 'checklist',
      durationMinutes: 8,
      pillar: 'process',
    },
  ],
  tools: [
    {
      title: 'Demo environment quick-start',
      description: 'Stable setup for live demos — templates, fallbacks, and offline mode when the network fails.',
      type: 'video',
      durationMinutes: 15,
      pillar: 'tools',
    },
    {
      title: 'CRM fields that actually matter',
      description: 'Minimum viable hygiene: the five fields that unlock forecasting and stop admin busywork.',
      type: 'playbook',
      durationMinutes: 12,
      pillar: 'tools',
    },
  ],
  enablement: [
    {
      title: 'CFO objection lab — live role-play',
      description: '45-minute session: budget frozen, ROI challenge, and multi-year TCO. Practice with peers, not slides.',
      type: 'drill',
      durationMinutes: 45,
      pillar: 'enablement',
    },
    {
      title: 'Competitive battlecard refresh — Q2',
      description: 'Updated talk tracks for the three competitors showing up most in your segment.',
      type: 'playbook',
      durationMinutes: 20,
      pillar: 'enablement',
    },
  ],
  alignment: [
    {
      title: 'CFO-ready ROI deck templates',
      description: 'Stop rebuilding slides weekly. Segment-specific ROI models with customer proof baked in.',
      type: 'template',
      durationMinutes: 15,
      pillar: 'alignment',
    },
    {
      title: 'Marketing ↔ field messaging alignment guide',
      description: 'What we promise vs. what buyers expect — and how to reset when marketing overshoots.',
      type: 'playbook',
      durationMinutes: 12,
      pillar: 'alignment',
    },
  ],
  support: [
    {
      title: 'Deal desk escalation playbook',
      description: 'When to escalate, what to include, and how to set buyer expectations on legal and security reviews.',
      type: 'playbook',
      durationMinutes: 15,
      pillar: 'support',
    },
    {
      title: 'SE request best practices',
      description: 'Get technical wins faster: briefing template, competitive bake-off prep, and SLA expectations.',
      type: 'checklist',
      durationMinutes: 10,
      pillar: 'support',
    },
  ],
  compensation: [
    {
      title: 'Comp plan one-pager walkthrough',
      description: 'Plain-language explainer with worked examples for your segment — accelerators, SPIFFs, and splits.',
      type: 'video',
      durationMinutes: 18,
      pillar: 'compensation',
    },
  ],
  stage_negotiate: [
    {
      title: 'Pricing & commercial terms framework',
      description: 'Negotiate with confidence: discount guardrails, multi-year trade-offs, and when to pull deal desk in.',
      type: 'drill',
      durationMinutes: 25,
      pillar: 'process',
    },
  ],
  stage_close: [
    {
      title: 'Closing timeline & mutual action plan',
      description: 'Template to keep champions warm through legal, security, and procurement.',
      type: 'template',
      durationMinutes: 12,
      pillar: 'process',
    },
  ],
}

function avg(ids: readonly string[], row: SurveyResponse): number {
  return ids.map((id) => Number(row[id])).reduce((a, b) => a + b, 0) / ids.length
}

function pickWeakestAreas(row: SurveyResponse, org: Record<PillarKey, number>): RepFocusArea[] {
  const yours = repPillarScores(row)
  return (Object.keys(yours) as PillarKey[])
    .map((key) => ({
      key,
      label: PILLAR_LABELS[key],
      score: yours[key],
      orgAverage: org[key],
      gap: org[key] - yours[key],
      empathyLine: EMPATHY[key],
    }))
    .sort((a, b) => a.score - b.score || b.gap - a.gap)
    .slice(0, 3)
}

function buildAcknowledgment(row: SurveyResponse, focus: RepFocusArea[]): string {
  const l1 = row.L1?.trim()
  const top = focus[0]
  if (l1) {
    return `You shared that “${l1.replace(/^["']|["']$/g, '')}” — that kind of friction matters. Based on your Q2 pulse, your biggest growth edge is ${top.label.toLowerCase()} (${top.score}/100 vs ${top.orgAverage} org avg). This kit is built to help directly — not just document the problem.`
  }
  return `Your Q2 pulse shows ${top.label.toLowerCase()} as your top development area (${top.score}/100). This kit picks up where the survey left off — practical modules, not another feedback loop.`
}

function moduleKeyForFocus(key: string, row: SurveyResponse): (PillarKey | 'stage_negotiate' | 'stage_close')[] {
  const keys: (PillarKey | 'stage_negotiate' | 'stage_close')[] = [key as PillarKey]
  const stages = repStageScores(row)
  if (stages['Propose / Negotiate'] < 65) keys.push('stage_negotiate')
  if (stages.Close < 65) keys.push('stage_close')
  return Array.from(new Set(keys))
}

export function buildEnablementKit(row: SurveyResponse): EnablementKit {
  const org = orgPillarScores()
  const focusAreas = pickWeakestAreas(row, org)
  const moduleKeys = focusAreas.flatMap((f) => moduleKeyForFocus(f.key, row))
  const seen = new Set<string>()
  const modules: KitModule[] = []

  for (const mk of moduleKeys) {
    for (const mod of MODULE_CATALOG[mk] ?? []) {
      if (seen.has(mod.title)) continue
      seen.add(mod.title)
      const hash = seen.size
      const status =
        hash === 1 ? 'in_progress' : hash === 2 ? 'not_started' : ('not_started' as const)
      modules.push({
        ...mod,
        id: `mod-${row.employee_id}-${hash}`,
        status,
        progress: status === 'in_progress' ? 35 : 0,
      })
      if (modules.length >= 5) break
    }
    if (modules.length >= 5) break
  }

  const completedModules = modules.filter((m) => m.status === 'completed').length
  const totalMinutes = modules.reduce((a, m) => a + m.durationMinutes, 0)

  const managerPrompt =
    focusAreas[0].gap > 8
      ? `Optional 1-line for your manager: “I'm working through the ${focusAreas[0].label.toLowerCase()} modules in my SellerUnblocked kit — would value a 15-min ride-along on my next ${focusAreas[0].key === 'support' ? 'enterprise' : 'late-stage'} opp.”`
      : undefined

  return {
    employeeId: row.employee_id,
    cycleLabel: DEMOTECH_CYCLE.label,
    acknowledgment: buildAcknowledgment(row, focusAreas),
    focusAreas,
    modules,
    managerPrompt,
    totalMinutes,
    completedModules,
  }
}

export function buildRepSnapshot(row: SurveyResponse): RepSnapshot {
  const org = orgPillarScores()
  const yours = repPillarScores(row)
  const stages = repStageScores(row)
  const orgResponses = getAllResponses()

  const orgStage = Object.fromEntries(
    Object.entries(stages).map(([stage]) => {
      const qid = stage === 'Propose / Negotiate' ? 'K4' : stage === 'Discover' ? 'K1' : stage === 'Qualify' ? 'K2' : stage === 'Demo' ? 'K3' : 'K5'
      const mean =
        orgResponses.map((r) => Number(r[qid])).reduce((a, b) => a + b, 0) / orgResponses.length
      return [stage, likertToScore(mean)]
    }),
  )

  const strengths: string[] = []
  for (const key of Object.keys(yours) as PillarKey[]) {
    if (yours[key] >= org[key] + 5) strengths.push(`Strong ${PILLAR_LABELS[key].toLowerCase()} (${yours[key]}/100)`)
  }
  const stageEntries = Object.entries(stages)
  const bestStage = stageEntries.sort((a, b) => b[1] - a[1])[0]
  if (bestStage) strengths.push(`${bestStage[0]} confidence (${bestStage[1]}/100)`)
  if (!strengths.length) strengths.push('Balanced profile — kit targets your highest-leverage gaps')

  const overall = likertToScore(avg(QUESTION_GROUPS.overall, row))

  return {
    employeeId: row.employee_id,
    title: row.title,
    teamSegment: row.team_segment,
    location: row.location,
    tenureBand: row.tenure_band,
    overallScore: overall,
    orgOverallScore: orgOverallScore(),
    pillarScores: (Object.keys(yours) as PillarKey[]).map((key) => ({
      key,
      label: PILLAR_LABELS[key],
      yours: yours[key],
      org: org[key],
    })),
    stageScores: Object.entries(stages).map(([stage, yoursScore]) => ({
      stage,
      yours: yoursScore,
      org: orgStage[stage] ?? 0,
    })),
    strengths,
  }
}

export function getRepData(employeeId: string) {
  const row = getResponseByEmployeeId(employeeId)
  if (!row) return null
  return {
    response: row,
    snapshot: buildRepSnapshot(row),
    kit: buildEnablementKit(row),
  }
}
