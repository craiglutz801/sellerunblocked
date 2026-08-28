export const FLOW_STAGES = [
  {
    label: 'Seller signals + system evidence',
    body: 'Feedback, stage confidence, and permitted CRM, call, calendar, and content metadata.',
    icon: 'signal' as const,
  },
  {
    label: 'Diagnostic spine',
    body: 'Patterns, root causes, benchmark gaps, enablement needs, and priorities.',
    icon: 'spine' as const,
  },
  {
    label: 'AI action layer',
    body: 'Finds likely friction, fixes what it can, and shows leaders what must change.',
    icon: 'action' as const,
  },
]

export const LEADERSHIP_BRANCH = {
  label: 'For leadership',
  headline: 'Move from dashboard to decision.',
  body: 'Agents investigate friction, assemble the evidence, propose actions, and help track whether interventions are working.',
  examples: [
    'Root-cause brief',
    'Policy change + approval pack',
    'Action plan and owner',
    'Intervention measurement',
  ],
}

export const SELLER_BRANCH = {
  label: 'For sellers',
  headline: 'Move from feedback to forward motion.',
  body: 'A private seller coach helps reps find approved resources, handle low-value admin, prepare for key moments, and use their kit in context — not a generic chat window.',
  examples: [
    'Prepare for a CFO call',
    'Prefill a CRM update',
    'Find the right playbook',
    'Use a proposal-stage checklist',
  ],
}

export const SELLER_COACH_USE_CASES = [
  {
    title: 'Prepare',
    description:
      'Build a focused plan for an upcoming discovery, proposal, pricing, or executive conversation.',
  },
  {
    title: 'Find',
    description:
      'Surface the approved playbook, deck, proof point, template, or checklist that fits the moment.',
  },
  {
    title: 'Practice',
    description: 'Run a private role-play for pricing, ROI, competitive, or executive objections.',
  },
  {
    title: 'Apply',
    description:
      'Turn a recommended module into an action for the next real deal — not generic training to complete later.',
  },
]

export const AI_GOVERNANCE_CHIPS = [
  'Approved content first',
  'Metadata first',
  'Content only with permission',
  'Aggregated findings for leaders',
  'No individual leadership reporting',
  'No automated performance decisions',
  'Not individual surveillance',
  'Seller-controlled sharing',
]

export const UNBLOCKING_JOBS = [
  {
    title: 'Find friction',
    body: 'Triangulate seller insight with CRM, calls, calendar, and content usage. Treat one comment as a clue, not the verdict.',
  },
  {
    title: 'Fix what AI can',
    body: 'Prepare approval packages, surface the right content, prefill CRM updates, and take low-value admin off the seller’s plate.',
  },
  {
    title: 'Show what must change',
    body: 'Give leadership a prioritized action with an owner, evidence, confidence, and a success metric — then measure whether it worked.',
  },
]

export const UNBLOCKING_INTEGRATIONS = [
  {
    name: 'Salesforce',
    use: 'Opportunity-change history and stage dwell — where deals actually stall.',
  },
  {
    name: 'Gong',
    use: 'Topics, trackers, and scorecards. Transcripts only with explicit permission.',
  },
  {
    name: 'Microsoft 365',
    use: 'Permitted calendar and usage metadata — selling time vs. internal time.',
  },
  {
    name: 'Seismic',
    use: 'Content-view and usage history — what sellers can find vs. what they actually use.',
  },
]

export const UNBLOCKING_EVIDENCE = [
  {
    source: 'Salesforce',
    finding: 'Enterprise deals lose ~8 days in discount approval.',
  },
  {
    source: 'Gong',
    finding: 'Calls repeatedly include “I need to get that approved.”',
  },
  {
    source: 'Microsoft 365',
    finding: 'Reps are sitting in extra pricing meetings each week.',
  },
  {
    source: 'Approvals',
    finding: 'Four approvers even when most discounts sit in a standard range.',
  },
]

export const UNBLOCKING_TARGETED_QUESTION =
  'Your quotes are taking four days longer than average — what happens after submission?'

export const UNBLOCKING_OUTCOMES = [
  {
    label: 'Leadership action',
    body: 'Recommend a simplified in-range approval policy, with RevOps + Legal Ops as owner.',
  },
  {
    label: 'What AI can fix now',
    body: 'Automatically prepare standard approval requests so in-policy deals do not wait in a queue.',
  },
  {
    label: 'Success metric',
    body: 'Measure whether deal velocity improves — P95 approval time and Negotiate-stage conversion.',
  },
]

export const UNBLOCKING_CAPABILITY_GROUPS = [
  {
    group: 'Detect',
    items: ['Shadow Work Detector', 'Deal Delay Investigator', 'Meeting Burden Agent', 'Handoff Quality Agent'],
  },
  {
    group: 'Unblock',
    items: ['Approval Bottleneck Agent', 'Knowledge Gap Agent', 'Seller Copilot'],
  },
  {
    group: 'Personal',
    items: ['Personalized Unblocking Kit'],
  },
  {
    group: 'Measure',
    items: ['Impact Measurement Agent'],
  },
]
