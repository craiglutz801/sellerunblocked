export const CAPABILITIES = [
  {
    title: 'Seller Insight Collection',
    description:
      'Structured programs capture what sellers experience across process, tools, enablement, support, alignment, and compensation.',
  },
  {
    title: 'Operational Diagnostics',
    description: 'Identify patterns, friction points, and gaps across the revenue organization.',
  },
  {
    title: 'Trend Analytics',
    description: 'Track seller experience, organizational health, and improvement over time.',
  },
  {
    title: 'Benchmarking',
    description:
      'Compare teams, segments, roles, and external benchmarks to understand where friction is abnormal.',
  },
  {
    title: 'AI Action Layer',
    description:
      'Find the friction, fix what AI can, and show leadership what must change — from root-cause briefs and approval packages to private kits and seller guidance.',
    badge: 'New' as const,
  },
  {
    title: 'IC Enablement Kits',
    description:
      'Turn each seller’s feedback into a private, personalized kit of resources, modules, and next steps.',
    featured: true,
  },
]

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Gather Seller Insight',
    body: 'Structured programs collect what sellers experience. Permitted operational metadata from CRM, calls, calendar, and content usage joins that signal — without treating any one source as truth.',
  },
  {
    title: 'Diagnose the Organization',
    body: 'SellerUnblocked identifies patterns, friction points, operating gaps, and areas of misalignment across roles, segments, and teams.',
  },
  {
    title: 'Deliver Leadership Intelligence',
    body: 'Executives receive dashboards, summaries, benchmark views, and AI-guided briefs that clarify what is helping or hurting sellers — and what deserves action first.',
  },
  {
    title: 'Generate Seller Kits',
    body: 'Each IC receives a private enablement kit based on their own feedback, scores, stage confidence, and context — with an AI guide that helps them apply the right support to real work.',
  },
  {
    title: 'Improve and Track Progress',
    body: 'Leaders address systemic friction while sellers use targeted support. SellerUnblocked tracks whether action is improving experience, confidence, and execution over time.',
  },
]

export const OPERATING_DIMENSIONS = [
  { label: 'Sales process effectiveness', desc: 'How well the sales process helps sellers move deals forward.' },
  { label: 'Technology and tool experience', desc: 'Whether tools and systems support selling rather than slow it down.' },
  { label: 'Sales enablement quality', desc: 'Training, content, and resources that help reps perform.' },
  { label: 'Marketing alignment', desc: 'How well marketing supports sellers with proof, campaigns, and customer stories.' },
  { label: 'Opportunity quality and coverage', desc: 'Whether work entering the funnel — inbound, partner, or field-generated — is set up to close.' },
  { label: 'Compensation clarity', desc: 'How clear and fair comp and incentives are to sellers.' },
  { label: 'Internal support systems', desc: 'Deal support, operations, and cross-functional help.' },
  { label: 'Organizational alignment', desc: 'Strategy, goals, and priorities understood across the org.' },
]

export const STAGE_CONFIDENCE = [
  'Prospecting',
  'Discovery',
  'Qualification',
  'Proof / Presentation',
  'Proposal',
  'Negotiation',
  'Closing',
  'Handoff / Implementation',
]

export const ROI_LEVERS = [
  { title: 'Retention', desc: 'Reduce preventable frustration that contributes to seller attrition.' },
  { title: 'Productivity', desc: 'Remove friction that reduces selling time and slows deal execution.' },
  {
    title: 'Enablement utilization',
    desc: 'Increase usage of existing resources by matching them to real seller needs. AI-guided support makes assets easier to find, apply, and use in the next customer conversation.',
  },
  { title: 'Time back to selling', desc: 'Reduce the time sellers spend hunting across disconnected content libraries, rebuilding materials, and asking around for the right internal support.' },
  { title: 'Ramp and consistency', desc: 'Help sellers strengthen weak stages with practical modules and templates.' },
  { title: 'Operational focus', desc: 'Prioritize the fixes most likely to improve performance across the organization.' },
]

export const ROLE_CARDS = [
  {
    role: 'CROs',
    desc: 'Understand whether the revenue organization is structurally helping sellers hit the number.',
  },
  {
    role: 'Sales leadership',
    desc: 'See whether the operating environment is helping sellers close — not just whether activity is high.',
  },
  {
    role: 'Sales Enablement',
    desc: 'Stop guessing what training sellers need. Use friction signals to target content and learning paths.',
  },
  {
    role: 'Sales Ops',
    desc: 'See where handoffs, tooling, processes, and internal support are breaking execution.',
  },
  {
    role: 'Finance & deal support',
    desc: 'Credit, legal, pricing, and specialist teams that sit in the path of the deal.',
  },
]

export const OBJECTIONS = [
  {
    quote: 'We already track performance metrics.',
    response: 'Performance metrics show outcomes. SellerUnblocked shows the operating conditions causing them.',
  },
  {
    quote: 'We already collect feedback.',
    response:
      'Most feedback programs are episodic, fragmented, and hard to act on. SellerUnblocked turns seller insight into continuous operational intelligence.',
  },
  {
    quote: 'This sounds like an HR or survey tool.',
    response:
      'SellerUnblocked is designed for CROs and revenue leaders. It measures the revenue organization, not employee engagement.',
  },
  {
    quote: 'We already know our biggest issues.',
    response:
      'Most leadership teams know some issues. Few can measure them systematically, prioritize them objectively, and track improvement over time.',
  },
  {
    quote: 'We already have enablement content.',
    response:
      'SellerUnblocked does not replace your content library. It makes it more useful by matching the right resource to the right seller based on actual friction signals.',
  },
  {
    quote: 'Will sellers trust this?',
    response:
      'SellerUnblocked separates leadership visibility from rep-owned personalization. Leadership sees patterns. Sellers receive private help.',
  },
  {
    quote: 'Is this a performance management tool?',
    response:
      'No. IC Kits are designed as support, not surveillance. The privacy model prevents rep-level scorecarding.',
  },
  {
    quote: 'Could this overwhelm sellers?',
    response:
      'Kits are intentionally capped at 3–5 modules and focused on the top 2–3 areas where help will matter most.',
  },
  {
    quote: 'Is this just another AI copilot?',
    response:
      'No. Generic copilots begin with a prompt. Seller Unblocked begins with a diagnostic of the seller environment, triangulates permitted system evidence, then uses that context to guide leadership action and provide private support for the seller’s real friction.',
  },
  {
    quote: 'Is this just CRM reporting?',
    response:
      'CRM shows what happened in the funnel. Seller Unblocked triangulates CRM, calls, calendar, content, and seller input to explain why selling is harder than it should be — then recommends the system change and the private help.',
  },
  {
    quote: 'Is this only for software sales?',
    response:
      'No. The product is built for any complex B2B motion: multiple approvers, specialists in the deal, and operational distance between leadership and the field. Software is one example, not the category.',
  },
]

export const KIT_MODULES = [
  { type: 'Playbook', title: 'Pricing Exception Packet', duration: '15 min', focus: 'Deal Support' },
  { type: 'Template', title: 'Customer-Reference Brief', duration: '15 min', focus: 'Proof' },
  { type: 'Checklist', title: 'Sales-to-Operations Handoff', duration: '10 min', focus: 'Handoff' },
]
