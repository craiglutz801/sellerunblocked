# SellerUnblocked Product Blueprint
**Version:** v1  
**Purpose:** A build-ready product/framework spec for Cursor  
**Product direction:** Position SellerUnblocked as a premium **Revenue Organization Intelligence** platform, not a survey tool. Ground the product in seller experience, but elevate the narrative to diagnosing and improving the operating environment for revenue teams. fileciteturn0file0L1-L20 fileciteturn0file1L1-L18

---

## 1) Strategic Positioning

### Core category
SellerUnblocked should be built and presented as one of these category positions:

1. **Revenue Organization Intelligence**
2. **Sales Org Diagnostics**
3. **Revenue Team Operating System** *(internal product language, not necessarily homepage language)*

### Recommended market-facing positioning
**SellerUnblocked is a Revenue Organization Intelligence platform that helps leadership understand whether their sales organization is structurally designed to succeed.** It measures the operational environment of sellers, identifies friction, benchmarks performance, and recommends improvements. fileciteturn0file0L1-L20 fileciteturn0file1L19-L48

### Messaging guardrails
Do **not** position the product as:
- a survey platform
- an employee feedback tool
- a point solution for morale
- a consulting dashboard

Do position it as:
- strategic intelligence for CROs / RevOps
- organizational diagnostics for revenue teams
- a decision-support platform for improving sales productivity
- a measurable system for surfacing operational friction and converting it into action. fileciteturn0file0L21-L69 fileciteturn0file1L49-L84

---

## 2) Product Vision

### Product thesis
Most revenue teams measure outcomes:
- pipeline
- quota attainment
- win rates
- deal velocity

Very few measure the environment producing those outcomes:
- process friction
- tooling burden
- enablement quality
- internal support effectiveness
- marketing alignment
- compensation clarity
- sales-stage confidence

SellerUnblocked exists to make that operating environment visible, measurable, and improvable. fileciteturn0file0L7-L20 fileciteturn0file0L21-L69

### Product promise
**Reveal where the revenue organization is creating drag, quantify the impact, and guide leadership toward the highest-leverage fixes.**

---

## 3) Audience and Jobs-To-Be-Done

### Primary buyers
- CRO
- Head of Sales
- RevOps leader
- Sales Enablement leader
- GTM Strategy / COO
- Private equity operating partner *(phase 2 positioning)* fileciteturn0file0L150-L168 fileciteturn0file1L65-L84

### Primary user jobs
1. Understand where sellers are losing time, confidence, or momentum.
2. Identify which parts of the sales org are helping or hurting performance.
3. Compare performance dimensions by segment, team, region, and role.
4. Prioritize fixes by impact, urgency, and ownership.
5. Track whether operational changes improve seller experience over time. fileciteturn0file0L91-L120

---

## 4) Product Pillars

Build the product around four clear layers:

### Layer 1 — Diagnostics
Structured seller feedback and operating-environment assessment.

### Layer 2 — Intelligence
Dashboards, trends, segment analysis, scorecards, qualitative themes, and friction mapping.

### Layer 3 — Benchmarking
Compare teams, cohorts, or companies against internal and external baselines.

### Layer 4 — Recommendations
AI-generated and rules-based recommendations tied to business impact and ownership. fileciteturn0file1L31-L48

---

## 5) UX Direction

### Guiding UX principle
The product should feel like a **premium executive intelligence platform**, not a traditional BI tool and not a noisy HR survey portal.

### UX goals
- executive clarity in under 10 seconds
- action-oriented storytelling, not raw data dumping
- opinionated prioritization
- elegant and spacious interface
- light cognitive load
- trust through consistency, restraint, and hierarchy

### Reference for design direction
The old screenshot suggests a dashboard-first approach with KPIs, stage summaries, and structured analysis. Keep the high-level utility, but redesign the experience into a more modern, refined system that inherits the **landing page styling** as the source of truth. The old app structure is useful as a content reference, not a visual constraint.

---

## 6) Design System Direction

> **Critical instruction for Cursor:** Extract the visual language from the existing landing page implementation and use it as the canonical design system for the application. The app should feel like a natural extension of the landing page, not a separate product.

### Design intent
- premium SaaS
- polished and editorial
- restrained color usage
- spacious layout
- strong typography hierarchy
- subtle motion
- highly legible analytics

### Recommended style characteristics
- **Backgrounds:** warm off-white or very light neutral, with soft contrast panels
- **Cards:** large radius, soft shadow, thin border, generous padding
- **Typography:** modern sans-serif, bold editorial headings, quiet secondary text
- **Color usage:** neutral-first with one primary brand accent and a small set of semantic states
- **Charts:** minimal gridlines, simple legends, restrained use of color
- **Icons:** thin, modern, rounded
- **Motion:** soft hover elevation, fade/slide transitions, count-up metrics, no flashy animation

### Suggested design tokens
Use landing-page tokens where they already exist. If missing, use these defaults:

```yaml
radius:
  card: 20px
  input: 14px
  button: 14px
  pill: 999px

spacing:
  section: 40-64px
  cardPadding: 24-32px
  gridGap: 20-24px

shadow:
  card: 0 8px 30px rgba(0,0,0,0.06)

border:
  subtle: 1px solid rgba(0,0,0,0.06)

type:
  display: 48-64px / 0.95
  h1: 36-44px / 1.05
  h2: 28-32px / 1.1
  h3: 20-24px / 1.2
  body: 15-17px / 1.6
  meta: 12-13px / 1.4

layout:
  maxWidth: 1280px
  contentWidth: 1440px
  sidebarWidth: 260px
  topbarHeight: 76px
```

### Semantic colors
Use landing-page palette first. Otherwise:
- **Primary:** brand blue or brand ink
- **Positive:** restrained green
- **Warning:** amber
- **Negative:** soft red
- **Info:** muted blue
- **Text primary:** dark neutral
- **Text secondary:** medium neutral
- **Surface alt:** slightly tinted neutral

### Product feel
Think:
- Vanta / Stripe / Linear polish
- Notion-like clarity
- modern enterprise without looking corporate
- an interface a CRO would trust in a board meeting

---

## 7) Information Architecture

## Primary navigation
1. **Overview**
2. **Diagnostics**
3. **Insights**
4. **Recommendations**
5. **Benchmarks**
6. **Responses** *(qualitative + raw feedback explorer)*
7. **Programs** *(survey / collection management)*
8. **Settings**

### Recommended nav labels
Use strategic, executive-friendly labels:
- Avoid: “Qualitative”, “Quadrant Report”, “Workflow”
- Prefer: “Insights”, “Themes”, “Recommendations”, “Programs”, “Benchmarks”

---

## 8) Page-by-Page Product Framework

## 8.1 Overview
**Purpose:** Instant understanding of revenue-org health.

### Core modules
- headline summary: current revenue org health score
- key health pillars: process, tools, enablement, alignment, support, compensation
- trend over time
- top friction drivers
- top positive drivers
- recommended actions this quarter
- benchmark vs peers
- “where to focus next” section

### Above-the-fold layout
- left: headline + summary narrative
- right: overall index score card and trend sparkline
- second row: 4–6 pillar cards
- third row: friction heatmap + top recommendations
- fourth row: benchmark comparison + qualitative themes

### Example summary copy
“Your revenue organization is strong in stage proficiency and seller ease-of-selling, but manager confidence and objection handling are creating measurable drag.”

### Components
- HeroSummary
- HealthIndexCard
- PillarScoreCards
- TrendSparkline
- FrictionHeatmap
- RecommendationPreviewList
- BenchmarkBand
- ThemeClusterCard

---

## 8.2 Diagnostics
**Purpose:** Show how the seller experience is measured and where operational friction exists.

### Sections
- diagnostic framework overview
- score breakdown by dimension
- score breakdown by cohort / team / segment
- funnel of friction by sales stage
- confidence metrics
- severity ranking
- driver analysis

### Key dimensions
- sales process effectiveness
- technology & tools
- sales enablement
- marketing alignment
- lead quality & pipeline support
- compensation & incentives
- internal support systems
- organizational alignment. fileciteturn0file0L70-L90

### Components
- DimensionScoreMatrix
- SegmentFilterBar
- StageJourneyDiagnostic
- DriverRankingTable
- ConfidenceBreakdown
- CohortComparisonChart

---

## 8.3 Insights
**Purpose:** Turn data into patterns and executive understanding.

### Sections
- major themes
- emerging issues
- strongest operational strengths
- highest-friction trends
- qualitative highlights
- sentiment by topic
- impact by role / segment

### Insight types
- trend insight
- segment variance insight
- benchmark insight
- theme insight
- anomaly / risk insight
- narrative summary

### Components
- InsightCards
- ThemeExplorer
- SentimentTrendChart
- SegmentVarianceTable
- AIExecutiveSummary
- RiskFlagList

---

## 8.4 Recommendations
**Purpose:** Convert intelligence into action.

### Structure
Each recommendation should include:
- title
- issue summary
- why it matters
- expected impact
- affected teams
- recommended owner
- priority
- effort
- confidence
- linked evidence
- follow-up metric

### Recommendation categories
- process redesign
- tooling simplification
- enablement improvements
- manager coaching
- compensation clarity
- lead quality improvements
- marketing-sales alignment
- internal support / handoff improvements. fileciteturn0file0L91-L120

### Components
- PriorityRecommendationBoard
- RecommendationCard
- ImpactVsEffortMatrix
- EvidenceDrawer
- ActionPlanTimeline
- OwnershipAssignmentTable

---

## 8.5 Benchmarks
**Purpose:** Contextualize scores.

### Sections
- internal benchmark vs last round
- internal benchmark vs top-performing teams
- external benchmark vs peer companies
- percentile views
- dimension-level benchmark bands

### Components
- BenchmarkBandChart
- PercentileCards
- PeerComparisonGrid
- InternalVsExternalToggle
- HistoricalBenchmarkTrend

### UX note
Benchmarks should feel high-trust and premium. Avoid overclaiming. Label source and confidence clearly.

---

## 8.6 Responses
**Purpose:** Explore raw and synthesized qualitative data without turning the product into a spreadsheet.

### Sections
- searchable response explorer
- theme tagging
- AI clustering
- keyword / topic drilldown
- quote highlights
- sentiment filters
- role / region / team filters

### Components
- ResponseExplorerTable
- QuoteCards
- ThemeChips
- TopicClusterSidebar
- EvidencePanel
- SearchAndFilterBar

### UX note
This page should feel controlled and readable. Use progressive disclosure so raw text does not overwhelm the interface.

---

## 8.7 Programs
**Purpose:** Manage data collection.

### Sections
- active programs
- response rate / participation tracking
- cohort setup
- question framework management
- schedule / cadence
- templates
- reminders / workflow status

### Components
- ProgramCards
- ResponseRateTracker
- CohortBuilder
- QuestionnaireBuilder
- ProgramTimeline
- TemplateGallery

### Product note
Keep this area operational, but visually consistent with the premium analytics product. Do not let the app feel like “survey software.”

---

## 8.8 Settings
**Purpose:** Administrative controls.

### Sections
- workspace
- team roles / permissions
- benchmark settings
- data imports / integrations
- brand settings
- notification settings
- AI / insight preferences

---

## 9) Suggested Homepage / App Narrative

The overview page should tell a story in this order:

1. **How healthy is the revenue organization overall?**
2. **Where is friction concentrated?**
3. **Which teams or stages are most affected?**
4. **What changed since last measurement?**
5. **How do we compare to benchmark?**
6. **What should we do next?**

This narrative is more important than any individual chart.

---

## 10) Core Data Model

### Entities
- Organization
- Workspace
- User
- Team
- Role
- Seller
- Program
- Survey / Assessment
- Question
- Response
- ResponseTheme
- Score
- Metric
- BenchmarkSet
- Recommendation
- RecommendationEvidence
- Initiative
- MeasurementCycle

### Suggested relationships
- Organization has many Teams
- Program belongs to Organization
- Program has many Questions
- MeasurementCycle belongs to Program
- Response belongs to Seller + Question + MeasurementCycle
- Score belongs to Dimension + Team + MeasurementCycle
- Recommendation belongs to Organization + MeasurementCycle
- RecommendationEvidence links Recommendation to scores, quotes, trends, and segments

---

## 11) Analytics Model

### Primary score groups
- Overall Revenue Org Health
- Seller Satisfaction
- Ease of Selling
- Manager Confidence
- Sales Stage Proficiency
- Enablement Quality
- Tool Efficiency
- Internal Alignment
- Compensation Confidence

### Example derived metrics
- friction index
- confidence delta
- benchmark delta
- trend delta
- action urgency score
- recommendation confidence
- issue prevalence
- stage drop-off correlation

### Scoring guidance
Use normalized 0–100 scores for top-level cards.
Allow drilldown to question-level or stage-level scores.
Always pair scores with:
- direction of change
- benchmark comparison
- sample size / confidence where relevant

---

## 12) Dashboard Content Strategy

### KPI cards should always answer:
- what is the metric?
- is it improving or worsening?
- how does it compare to benchmark?
- should leadership care right now?

### Good card pattern
- large score
- small label
- delta vs last cycle
- delta vs benchmark
- short interpretive sentence

### Example
**Manager Confidence — 43**
Down 11 pts from last cycle.  
11 pts below benchmark.  
Biggest drag is coaching during objection handling.

This preserves the utility of the previous design while making it much more actionable.

---

## 13) Component System

### Foundation components
- AppShell
- SidebarNav
- Topbar
- SectionHeader
- FilterBar
- EmptyState
- SkeletonLoader
- CommandPalette

### Analytical components
- ScoreCard
- TrendCard
- BenchmarkCard
- Heatmap
- DistributionChart
- CohortComparisonTable
- ThemeCluster
- RecommendationCard
- QuoteCarousel
- EvidenceDrawer
- InsightNarrativePanel

### Interaction patterns
- sticky filter bar
- persistent date / measurement-cycle context
- hover states for evidence previews
- click-through drilldowns
- slide-over details panel instead of constant page jumps
- saved views for execs vs operators

---

## 14) Recommended Technical Architecture

## Frontend
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Recharts** for standard charting
- **Framer Motion** for subtle motion
- **Lucide** for icons

### Frontend principles
- server components for heavy page shells where useful
- client components for filters, drilldowns, animations
- reusable design tokens from landing page
- charts wrapped in consistent internal chart components
- dark mode optional, not phase 1 unless landing page already supports it

## Backend
Pick one of these:
1. **Next.js + Supabase** *(fastest to build)*
2. **Next.js + Postgres + Prisma** *(more control)*
3. **Next.js frontend + separate API service** *(only if you already have backend infra)*

### Recommendation
For fastest build with strong product velocity:
- Supabase Auth
- Postgres
- Prisma or Supabase client
- Row-level permissions if multi-tenant
- Vercel deployment

## AI / intelligence layer
- recommendation generation service
- qualitative clustering / summarization pipeline
- evidence linking layer
- prompt templates for executive summaries
- optional eval harness for recommendation quality

### AI output rules
AI recommendations must always cite evidence internally:
- score change
- benchmark gap
- relevant themes
- supporting quotes
- affected segments

---

## 15) Folder / Codebase Structure for Cursor

```txt
/apps/web
  /app
    /(marketing)
    /(app)
      /overview
      /diagnostics
      /insights
      /recommendations
      /benchmarks
      /responses
      /programs
      /settings
  /components
    /layout
    /navigation
    /cards
    /charts
    /insights
    /recommendations
    /responses
    /programs
    /ui
  /lib
    /design-tokens
    /formatters
    /scoring
    /benchmarks
    /ai
    /auth
  /data
    /mock
  /styles
  /types

/packages
  /design-system
  /eslint-config
  /tsconfig
```

### Page route recommendation
- `/overview`
- `/diagnostics`
- `/insights`
- `/recommendations`
- `/benchmarks`
- `/responses`
- `/programs`
- `/settings`

---

## 16) Build Order

## Phase 1 — Foundation
- import landing page styling / tokens
- app shell
- sidebar + topbar
- overview page
- reusable score cards
- charts + tables
- mock data model

## Phase 2 — Core intelligence
- diagnostics page
- insights page
- recommendation page
- evidence drawer
- filtering system
- role / team / measurement cycle filters

## Phase 3 — Depth
- benchmarks page
- responses explorer
- programs page
- settings
- AI-generated summaries and recommendations

## Phase 4 — Production hardening
- auth / roles
- tenant model
- data import flows
- saved views
- PDF export / board-ready reporting
- performance optimization
- analytics instrumentation

---

## 17) MVP Scope Recommendation

If building fast, the MVP should include only:

1. **Overview**
2. **Diagnostics**
3. **Recommendations**
4. **Benchmarks**
5. **App shell + filters + mock data system**

That is enough to demonstrate the category and product value.

Do **not** start with:
- advanced survey builder
- heavy admin systems
- excessive workflow tooling
- too many raw data views

Lead with intelligence, not collection mechanics.

---

## 18) Sample Copy System

### Product headline
**Revenue Organization Intelligence for high-performing sales teams**

### Supporting copy
Measure the seller experience, diagnose operational friction, and improve the environment that drives revenue performance. fileciteturn0file0L1-L20

### Overview page headline
**Your revenue organization is healthy overall — but seller confidence is breaking down in key moments.**

### Recommendation headline
**Prioritize manager coaching and objection-handling enablement**

### Benchmark note
**You outperform benchmark on ease of selling, but trail peers on manager confidence and support consistency.**

---

## 19) Cursor Build Instructions

Paste this section into Cursor as the implementation brief.

### Build brief
Build SellerUnblocked as a premium multi-page web application using the design language from the existing marketing landing page as the single source of truth for colors, spacing, typography, surfaces, and motion.

Position the application as a **Revenue Organization Intelligence** platform, not a survey dashboard.

The UI should feel executive-grade, elegant, modern, and highly readable. Use a spacious layout, large-radius cards, restrained color, subtle shadows, and strong typography hierarchy. Avoid clutter, dense BI tables, and generic enterprise styling.

Implement these routes:
- overview
- diagnostics
- insights
- recommendations
- benchmarks
- responses
- programs
- settings

Start with mock data and a robust component system. Prioritize reusable cards, charts, benchmark displays, recommendation cards, evidence drawers, and theme clusters.

The overview page should tell a clear story:
1. overall health
2. top friction areas
3. what changed
4. comparison to benchmark
5. what leadership should do next

Use:
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Recharts
- Framer Motion
- Lucide

Extract or recreate design tokens from the landing page and share them across the marketing and app surfaces.

Do not design the app like a survey tool. Design it like a strategic intelligence platform for CROs and RevOps leaders.

---

## 20) Non-Negotiables

- landing page styling is the canonical visual reference
- product positioning is strategic intelligence, not surveys
- overview must tell a story, not dump widgets
- every major metric must connect to action
- recommendations must feel evidence-based
- dashboard density should stay low
- typography and spacing must do the heavy lifting
- phase 1 should optimize for visual coherence and category clarity

---

## 21) Open Questions / Assumptions

These should be resolved before production implementation:

1. What exact landing-page tokens already exist?
2. Is there already a brand palette and type scale?
3. Are benchmarks internal-only at first, or external too?
4. Will recommendations be AI-generated, analyst-authored, or hybrid?
5. What roles exist in the system?
6. What is the first real data source?
7. Is the “Programs” section in MVP or phase 2?

### Current assumption
Because the landing page itself was not included here, this blueprint assumes its visual language should be mirrored throughout the app, and that Cursor should inspect the landing page implementation directly to reuse tokens and patterns exactly where possible.

---

## 22) Final Recommendation

The winning version of SellerUnblocked is not “a better survey dashboard.”

It is a visually premium, strategically positioned **Revenue Organization Intelligence** platform that gives sales leadership a clear answer to one essential question:

**Is our sales organization structurally designed to help sellers win?**

That is the product to build. fileciteturn0file1L49-L84