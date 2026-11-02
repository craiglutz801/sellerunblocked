import type { DemoAnswer, DemoPriority, EngineStage, FrictionZone } from '@/lib/landing/types'

/** Temporary demo-request inbox. Override with NEXT_PUBLIC_DEMO_EMAIL. */
export const DEMO_REQUEST_EMAIL =
  process.env.NEXT_PUBLIC_DEMO_EMAIL || 'craiglutz801@gmail.com'

export const DEMO_META = {
  period: 'Last 30 days',
  signalCount: 237,
}

export const DEMO_PRIORITIES: DemoPriority[] = [
  {
    id: 'pricing',
    rank: 1,
    title: 'Pricing approvals are slowing late-stage enterprise deals',
    shortTitle: 'Pricing approval friction',
    priority: 'High',
    whyNow: 'Worsening fastest',
    signalCount: 23,
    segments: ['Enterprise', 'North America'],
    affected: 'Enterprise',
    trend: '+38%',
    trendLabel: 'Mentions ↑ 38% vs prior cycle',
    diagnosis:
      'Approval paths vary by region and sellers are unclear when Deal Desk must engage.',
    recommendation: 'Standardize approval triggers and publish one enterprise pricing path.',
    owner: 'RevOps',
    status: 'Open',
    confidence: 'High',
    prevalence: '23 seller signals',
    snippets: [
      'I never know if a 12% discount needs Deal Desk or just my manager.',
      'Two regions, two approval paths. Late-stage deals sit.',
      'We lose a week when finance and Deal Desk both think the other owns it.',
    ],
    measureNext: 'Late-stage cycle time and how often sellers mention approval friction next cycle.',
    businessConsequence: 'Delay concentrates in late-stage enterprise deals, where waiting is most expensive.',
  },
  {
    id: 'healthcare',
    rank: 2,
    title: 'Healthcare proof points are missing at proposal stage',
    shortTitle: 'Missing healthcare proof',
    priority: 'High prevalence',
    whyNow: 'High prevalence',
    signalCount: 17,
    segments: ['Enterprise', 'Proposal stage'],
    affected: 'Enterprise',
    trend: 'Steady',
    trendLabel: 'Steady across the last two cycles',
    diagnosis: 'Sellers need quantified healthcare customer proof, not additional generic collateral.',
    recommendation: 'Create one quantified healthcare customer proof package.',
    owner: 'Product Marketing',
    status: 'Planned',
    confidence: 'High',
    prevalence: '17 seller signals',
    snippets: [
      'I do not have a healthcare customer number I can put in the proposal.',
      'Generic ROI slides are not enough for their clinical review.',
      'The proof we have is horizontal. This buyer wants their own industry.',
    ],
    measureNext: 'Proposal-stage confidence and issue prevalence after the proof package ships.',
    businessConsequence: 'Enterprise proposals stall when sellers cannot show industry-specific proof.',
  },
  {
    id: 'implementation',
    rank: 3,
    title: 'Implementation risk is appearing earlier in deals',
    shortTitle: 'Implementation concerns',
    priority: 'Emerging',
    whyNow: 'Emerging',
    signalCount: 11,
    segments: ['Mid-market', 'Enterprise'],
    affected: 'Enterprise + MM',
    trend: 'New',
    trendLabel: 'Detected 12 days ago',
    diagnosis: 'Sellers are raising implementation complexity before technical validation is complete.',
    recommendation: 'Give sellers a short implementation narrative they can use before an SE joins.',
    owner: 'Sales Engineering + Implementation',
    status: 'Investigating',
    confidence: 'Medium',
    prevalence: '11 seller signals',
    snippets: [
      'Buyers ask about implementation before we have scoped anything.',
      'I am describing delivery risk without an SE in the room.',
      'The concern shows up at discovery now, not at close.',
    ],
    measureNext: 'Whether implementation mentions move back to technical validation, and seller confidence at discovery.',
    businessConsequence: 'Early delivery anxiety is slowing discovery before the product has been evaluated.',
  },
  {
    id: 'crm',
    rank: 4,
    title: 'CRM duplicate entry is taxing every seller week',
    shortTitle: 'CRM duplicate entry',
    priority: 'Broad',
    whyNow: 'Broad time drain',
    signalCount: 41,
    segments: ['All sellers'],
    affected: 'All sellers',
    trend: 'Stable',
    trendLabel: 'Stable, widespread time drain',
    diagnosis: 'Sellers re-enter the same opportunity updates in the CRM and a second workflow tool.',
    recommendation: 'Collapse opportunity updates into one system of record.',
    owner: 'RevOps',
    status: 'Open',
    confidence: 'High',
    prevalence: '41 seller signals',
    snippets: [
      'I enter the same next step in two places.',
      'Admin time is the tax on every Friday.',
      'The second tool does not talk to the opportunity, so I copy it by hand.',
    ],
    measureNext: 'Seller-reported admin time and duplicate-entry mentions after the workflow change.',
    businessConsequence: 'The drag is broad rather than severe in any one deal, and it steals selling time every week.',
  },
  {
    id: 'partner',
    rank: 5,
    title: 'A partner integration gap is stalling strategic accounts',
    shortTitle: 'Partner integration gap',
    priority: 'Concentrated',
    whyNow: 'Concentrated revenue risk',
    signalCount: 9,
    segments: ['Strategic accounts'],
    affected: 'Strategic accounts',
    trend: 'Concentrated',
    trendLabel: 'Concentrated in a small set of accounts',
    diagnosis: 'A handful of strategic accounts are blocked on a missing partner integration story.',
    recommendation: 'Publish integration status and an interim workaround for those accounts.',
    owner: 'Partnerships',
    status: 'Open',
    confidence: 'Medium',
    prevalence: '9 seller signals',
    snippets: [
      'The integration they need is not on the slide and not on a roadmap I can share.',
      'Strategic accounts stall when the partner story is vague.',
      'I can name the ecosystem gap. I cannot tell the buyer when it changes.',
    ],
    measureNext: 'Whether those strategic accounts move past the integration objection.',
    businessConsequence: 'Low volume, high concentration: a few accounts carry the revenue risk.',
  },
]

export const DEMO_ANSWERS: DemoAnswer[] = [
  {
    id: 'fix-first',
    chip: 'What should I fix first?',
    question: 'What should I fix first?',
    lead: 'Start with enterprise pricing approvals. It is the highest-severity recurring issue, it is worsening fastest, and it affects late-stage deals where delay is most expensive. 23 seller signals point to inconsistent Deal Desk triggers across regions.',
    evidenceCount: 23,
    segments: ['Enterprise', 'North America', 'Late stage'],
    trend: 'Mentions up 38% vs the prior cycle',
    nextStep: 'Standardize approval triggers and publish one enterprise pricing path.',
    owner: 'RevOps',
    snippets: DEMO_PRIORITIES[0].snippets,
  },
  {
    id: 'changed-month',
    chip: 'What changed this month?',
    question: 'What changed this month?',
    lead: 'Pricing-approval mentions are up 38% versus the prior cycle. Implementation risk appeared 12 days ago in mid-market and enterprise. Healthcare proof remains steady and high at proposal stage.',
    evidenceCount: 51,
    segments: ['Enterprise', 'Mid-market'],
    trend: 'One worsening issue, one emerging issue',
    nextStep: 'Treat pricing approvals as the active intervention and keep implementation on a watchlist.',
    owner: 'RevOps',
    snippets: [DEMO_PRIORITIES[0].snippets[1], DEMO_PRIORITIES[2].snippets[2], DEMO_PRIORITIES[1].snippets[0]],
  },
  {
    id: 'product',
    chip: 'What does Product need to know?',
    question: 'What does Product need to know?',
    lead: 'Two field patterns are product-adjacent. Sellers lack quantified healthcare proof at proposal stage, and buyers are raising implementation complexity before technical validation. Neither is a request for more generic collateral.',
    evidenceCount: 28,
    segments: ['Enterprise', 'Proposal stage', 'Discovery'],
    trend: 'Healthcare proof is steady. Implementation risk is new.',
    nextStep: 'Product Marketing ships one healthcare proof package. Sales Engineering reviews the early implementation narrative.',
    owner: 'Product Marketing',
    snippets: [DEMO_PRIORITIES[1].snippets[0], DEMO_PRIORITIES[1].snippets[2], DEMO_PRIORITIES[2].snippets[0]],
  },
  {
    id: 'enterprise',
    chip: 'Why are enterprise deals harder?',
    question: 'What are the biggest things making Enterprise deals harder right now?',
    lead: 'Three issues concentrate in enterprise: pricing approvals (23 signals), missing healthcare proof (17), and implementation risk showing up before technical validation (11). The shared consequence is delay, especially late in the cycle.',
    evidenceCount: 51,
    segments: ['Enterprise'],
    trend: 'Pricing friction is worsening. Implementation risk is emerging.',
    nextStep: 'Assign the pricing path to RevOps, the proof package to Product Marketing, and the implementation narrative to Sales Engineering.',
    owner: 'GTM leadership',
    snippets: [DEMO_PRIORITIES[0].snippets[0], DEMO_PRIORITIES[1].snippets[1], DEMO_PRIORITIES[2].snippets[1]],
  },
  {
    id: 'changed-quarter',
    chip: 'What changed since last quarter?',
    question: 'What changed since last quarter?',
    lead: 'Against the prior quarter, pricing-approval friction is the fastest-worsening theme. Implementation concerns are new in the last 12 days. CRM duplicate entry is still a broad, stable drain across all sellers.',
    evidenceCount: 75,
    segments: ['Enterprise', 'All sellers'],
    trend: '+38% pricing mentions vs prior cycle',
    nextStep: 'Do not open a new CRM program before the pricing path is published. Track both.',
    owner: 'RevOps',
    snippets: [DEMO_PRIORITIES[0].snippets[1], DEMO_PRIORITIES[3].snippets[0], DEMO_PRIORITIES[2].snippets[2]],
  },
  {
    id: 'pricing-say',
    chip: 'What are sellers saying about our pricing?',
    question: 'What are sellers saying about our pricing?',
    lead: 'Sellers describe pricing approvals as slow and inconsistent. The sharpest root cause in this sample is not the discount level. It is uncertainty about when Deal Desk must engage, especially in North American enterprise deals.',
    evidenceCount: 23,
    segments: ['Enterprise', 'North America'],
    trend: 'Mentions up 38% vs the prior cycle',
    nextStep: 'Publish one enterprise pricing path with explicit Deal Desk triggers.',
    owner: 'RevOps',
    snippets: DEMO_PRIORITIES[0].snippets,
  },
  {
    id: 'top-teams',
    chip: 'What friction is unique to our top-performing teams?',
    question: 'What friction is unique to our top-performing teams?',
    lead: 'Higher-performing teams in this sample still feel pricing-approval drag and healthcare proof gaps. They mention the partner integration gap less often. CRM duplicate entry is the time drain they share with everyone else. This is an organizational cut, not a rep ranking.',
    evidenceCount: 34,
    segments: ['Top-quartile teams'],
    trend: 'Same systemic issues, less partner friction',
    nextStep: 'Fix the shared system issues. Do not treat this cut as a performance scorecard.',
    owner: 'Sales leadership',
    snippets: [DEMO_PRIORITIES[0].snippets[0], DEMO_PRIORITIES[3].snippets[1], DEMO_PRIORITIES[1].snippets[0]],
  },
  {
    id: 'cro-staff',
    chip: 'What should my CRO staff focus on this month?',
    question: 'What should my CRO staff focus on this month?',
    lead: 'Three owners, three moves. RevOps publishes one enterprise pricing path. Product Marketing ships a quantified healthcare proof package. Sales Engineering and Implementation explain why delivery risk is appearing before technical validation.',
    evidenceCount: 51,
    segments: ['Enterprise', 'Mid-market'],
    trend: 'Pricing is worsening. Implementation is new.',
    nextStep: 'Review those three briefs in staff and assign a measure for each.',
    owner: 'CRO staff',
    snippets: [DEMO_PRIORITIES[0].snippets[2], DEMO_PRIORITIES[1].snippets[2], DEMO_PRIORITIES[2].snippets[0]],
  },
  {
    id: 'deal-desk',
    chip: 'Why are sellers frustrated with Deal Desk?',
    question: 'Why are sellers frustrated with Deal Desk?',
    lead: 'The frustration clusters on trigger clarity, not on Deal Desk as a team. 23 signals describe sellers who do not know when approval is required, on paths that vary by region.',
    evidenceCount: 23,
    segments: ['Enterprise', 'North America'],
    trend: 'Mentions up 38% vs the prior cycle',
    nextStep: 'RevOps, with Deal Desk, publishes the triggers. Do not frame this as a team-performance issue.',
    owner: 'RevOps',
    snippets: DEMO_PRIORITIES[0].snippets,
  },
]

export const HERO_ANSWER_IDS = ['fix-first', 'changed-month', 'product', 'enterprise'] as const

export const ASK_ANSWER_IDS = [
  'enterprise',
  'changed-quarter',
  'product',
  'pricing-say',
  'top-teams',
  'cro-staff',
  'deal-desk',
] as const

export function answerById(id: string) {
  const answer = DEMO_ANSWERS.find((item) => item.id === id)
  if (!answer) throw new Error(`Missing demo answer: ${id}`)
  return answer
}

export const FRICTION_ZONES: FrictionZone[] = [
  {
    id: 'revops',
    label: 'RevOps',
    examples: ['CRM friction', 'Approvals', 'Territories', 'Quoting', 'Lead routing'],
  },
  {
    id: 'product',
    label: 'Product',
    examples: ['Missing functionality', 'Integrations', 'Roadmap gaps', 'Implementation concerns'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    examples: ['Missing collateral', 'Weak proof points', 'Messaging', 'Competitive materials'],
  },
  {
    id: 'pricing',
    label: 'Pricing & Packaging',
    examples: ['Packaging confusion', 'Discounting', 'Approval paths', 'Recurring objections'],
  },
  {
    id: 'partnerships',
    label: 'Partnerships',
    examples: ['Integration gaps', 'Channel needs', 'Ecosystem blockers'],
  },
  {
    id: 'enablement',
    label: 'Enablement',
    examples: ['Knowledge gaps', 'Content discoverability', 'Stage confidence'],
  },
  {
    id: 'support',
    label: 'Internal Support',
    examples: ['Deal Desk', 'SE availability', 'Legal', 'Implementation', 'Handoffs'],
  },
  {
    id: 'tools',
    label: 'Tools & Admin',
    examples: ['CRM burden', 'Duplicate workflows', 'Manual tasks', 'Tool sprawl'],
  },
]

export const ENGINE_STAGES: EngineStage[] = [
  {
    id: 'listen',
    index: '01',
    name: 'Listen',
    body: 'Ask focused questions and intelligent follow-ups that get beneath the score and uncover why friction is happening.',
  },
  {
    id: 'understand',
    index: '02',
    name: 'Understand',
    body: 'Synthesize quantitative and qualitative feedback into themes, subthemes, root causes, sentiment, and affected segments.',
  },
  {
    id: 'prioritize',
    index: '03',
    name: 'Prioritize',
    body: 'Determine what is widespread, worsening, high-impact, isolated, or emerging — and rank what deserves attention first.',
  },
  {
    id: 'act',
    index: '04',
    name: 'Act',
    body: 'Recommend actions, owners, evidence, and next steps so a signal becomes an operating decision instead of another dashboard tile.',
  },
  {
    id: 'measure',
    index: '05',
    name: 'Measure',
    body: 'Track whether the intervention reduced friction and whether seller experience actually improved.',
  },
]

export const MEASURE_SERIES = [
  { label: 'Cycle 1', value: 31, detail: 'Pricing-approval friction among enterprise sellers' },
  { label: 'Cycle 2', value: 19, detail: 'After a new approval path was published' },
  { label: 'Cycle 3', value: 12, detail: 'Same issue, same segment, two cycles later' },
]

export const MEASURE_SEGMENTS = [
  { label: 'Enterprise', before: 31, after: 12 },
  { label: 'Mid-market', before: 14, after: 11 },
  { label: 'SMB', before: 6, after: 5 },
]

export const LISTENING_OPTIONS = [
  { id: 'unknown', label: 'I don’t know when approval is required' },
  { id: 'approvers', label: 'Too many approvers' },
  { id: 'response', label: 'Deal Desk response time' },
  { id: 'rules', label: 'Discount rules are unclear' },
  { id: 'other', label: 'Other' },
] as const

export const LISTENING_FOLLOWUPS: Record<(typeof LISTENING_OPTIONS)[number]['id'], string> = {
  unknown: 'Is this mostly happening in Enterprise, Mid-Market, or across segments?',
  approvers: 'Where do the extra approvers show up most — Enterprise, Mid-Market, or both?',
  response: 'Is the wait concentrated in Enterprise, Mid-Market, or across segments?',
  rules: 'Which segment runs into unclear discount rules most often?',
  other: 'Which segment should we look at first so the follow-up stays specific?',
}

export const ROLE_QUESTIONS = [
  {
    role: 'CRO',
    question: 'What are the five organizational issues most likely to be slowing revenue?',
  },
  {
    role: 'RevOps',
    question: 'Which processes, tools, handoffs, and policies create the most seller drag?',
  },
  {
    role: 'Enablement',
    question: 'Where do sellers actually need help — and which resources are not reaching the right people?',
  },
  {
    role: 'Product / Product Marketing',
    question: 'Which product gaps, objections, and missing proof points repeatedly surface in the field?',
  },
  {
    role: 'Partnerships',
    question: 'Which ecosystem or integration gaps are creating real selling friction?',
  },
  {
    role: 'GTM leadership',
    question: 'What changed, where is it concentrated, who should own it, and did our fix work?',
  },
]

export const FAQ_ITEMS = [
  {
    id: 'gong',
    question: 'Isn’t this what Gong / call intelligence already tells us?',
    answer:
      'Conversation intelligence is excellent for understanding customer calls and seller behavior in those conversations. SellerUnblocked focuses on the internal operating environment around the seller — process, tools, product, marketing, pricing, support, partnerships, handoffs, and other friction that may never be visible in a call transcript.',
  },
  {
    id: 'survey',
    question: 'Is this just another seller survey?',
    answer:
      'No. Collection is one input. The value is the intelligence loop: AI-guided follow-up, qualitative synthesis, root-cause detection, prioritization, evidence-backed recommended actions, ownership, and measurement over time.',
  },
  {
    id: 'monitoring',
    question: 'Will sellers think this is performance monitoring?',
    answer:
      'The product should be designed around aggregated organizational intelligence and private seller support, not individual ranking. Clear privacy rules, minimum cohort sizes, and transparent data use are part of the product experience.',
  },
  {
    id: 'ai-value',
    question: 'Where does AI actually add value?',
    answer:
      'AI helps ask better follow-up questions, synthesize open text, detect themes and emerging issues, compare segments, summarize evidence, recommend next steps, and let leaders ask natural-language questions about the sales organization.',
  },
  {
    id: 'decisions',
    question: 'Does AI make the decisions?',
    answer:
      'No. UnblockedAI should accelerate diagnosis and recommend evidence-backed action. Leadership retains judgment and ownership.',
  },
]

export const PIPELINE = [
  'Seller signal',
  'UnblockedAI diagnosis',
  'Priority',
  'Owner brief',
  'Intervention',
  'Measurement',
]

export const OWNERS = ['RevOps', 'Product', 'Product Marketing', 'Enablement', 'Partnerships', 'Sales Leadership']
