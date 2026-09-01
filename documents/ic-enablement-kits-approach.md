# IC Enablement Kits — Personalized Learning from Seller Feedback

> **Product concept:** SellerUnblocked extends beyond executive intelligence with a **private seller center** that turns each IC’s survey responses into a tailored enablement and learning kit — empathetic in tone, direct in action, and curated with AI.

---

## The problem we’re solving

Most revenue organizations can **collect** seller feedback. Few can **close the loop** in a way that helps the individual rep who raised it.

Today, SellerUnblocked gives leadership a clear picture of org health — where friction lives, what changed, what to fix. That’s essential. But ICs often experience the survey as a one-way vent: leadership hears the themes; the rep who struggled doesn’t get targeted help.

The new approach adds a **second surface**: a private enablement portal where each rep receives a kit built from *their* scores, stage confidence, and open-text feedback — not a generic training assignment, and not a performance review.

**Design principle:** Hear them *and* help them. Empathy without action feels hollow; action without empathy feels punitive.

---

## Two portals, one diagnostic spine

The same structured assessment powers both experiences. Visibility splits by audience — not by data quality.

| Audience | Portal | What they see | What they never see |
|----------|--------|---------------|---------------------|
| **Leadership** | `/app/*` | Aggregated scores, themes, benchmarks, org-level recommendations | Individual attribution, verbatim quotes tied to a name, who got which kit |
| **IC sellers** | `/rep/*` | Personal snapshot, focus areas, enablement kit, learning path, curated resources | Other reps’ responses or identities |

```text
Structured assessment (Q2 pulse)
        │
        ├──► Aggregated org intelligence  →  Leadership dashboard
        │
        └──► Personal enablement kit      →  Seller center (private)
```

Anonymity for leadership stays intact. Personalization for the rep happens in a **rep-owned channel** only they can access.

---

## What an enablement kit is

An enablement kit is not a course catalog. It is a **3-part packet** generated per rep, per measurement cycle.

### 1. Acknowledgment (empathy)

AI-generated copy that mirrors the rep’s experience without exposing them to management:

- References their own open-text feedback where provided (e.g. *“You flagged that deal desk turnaround is unpredictable…”*)
- Externalizes cause — process, tools, enablement gap — not personal failure
- Sets expectation: *this kit is built to help, not to document the problem*

### 2. Focus areas (diagnosis)

Up to **three** operating dimensions where the rep scores lowest relative to org average:

- Process, tools, enablement, alignment, support, compensation
- Stage-level gaps (e.g. Propose/Negotiate confidence) when relevant
- Each area includes an **empathy line** — validation that the friction is real and often systemic

Example focus area:

| Dimension | Your score | Org avg | Gap |
|-----------|------------|---------|-----|
| Support | 42 | 48 | −6 |

> *Waiting on deal desk or legal is real drag; your frustration is valid.*

### 3. Direct help (modules)

**3–5 actionable modules**, ~45–90 minutes total:

| Module type | Purpose | Example |
|-------------|---------|---------|
| **Playbook** | How we sell here | Stage definitions cheat sheet |
| **Checklist** | Workflow fix | SDR → AE handoff required fields |
| **Template** | Stop rebuilding | CFO-ready ROI deck |
| **Video** | Quick skill-up | Demo environment quick-start |
| **Live drill** | Practice, not slides | CFO objection lab |

Each module is tagged to a focus area, shows estimated duration, and tracks progress (not started → in progress → completed).

Optional **manager prompt**: a one-line the rep can choose to share — never sent automatically.

---

## How kits are built from survey signals

Personalization inputs (per rep, per cycle):

1. **Dimension scores** — Likert responses grouped into operating pillars (process, tools, enablement, alignment, support, compensation)
2. **Stage confidence** — Discover through Close; weak stages add stage-specific modules (e.g. pricing negotiation framework)
3. **Open text** — L1 (biggest slowdown), L2 (one change requested), L3 (optional context)
4. **Context metadata** — Title, segment, tenure, location (for content selection, not leadership display)

**Selection logic:**

1. Rank pillars by personal score vs org average
2. Take top 2–3 gaps as focus areas
3. Map gaps to a **module catalog** (approved company content first)
4. AI writes acknowledgment and module ordering rationale in human, supportive tone
5. Cap at 5 modules to avoid overwhelm

**Strengths are preserved:** reps also see where they outperform the org — kits target gaps, not whole-person deficits.

---

## AI-curated content

AI is the **curation and composition layer**, not a replacement for enablement ownership.

### What AI does

| Step | AI role |
|------|---------|
| **Acknowledgment** | Paraphrase open text; validate frustration; connect to focus areas |
| **Module selection** | Match gap profile to catalog items; prioritize by impact and segment fit |
| **Copy & framing** | Tone: empathetic, direct, agency-restoring — never punitive or ranking language |
| **Resource highlighting** | Surface library assets relevant to this rep’s focus areas |
| **Learning path** | Sequence modules into a lightweight 4-week path (optional pace) |

### What AI does not do (guardrails)

- Expose individual feedback to leadership dashboards
- Generate performance ratings or quota commentary
- Recommend PIP-adjacent or HR-sensitive actions without human review
- Invent unapproved talk tracks, pricing, or legal guidance — **catalog first, AI second**

### Content sources (priority order)

1. **Approved enablement catalog** — playbooks, battlecards, templates, SOPs
2. **Org-specific assets** — DemoTech demo guides, ROI decks, handoff checklists
3. **AI-generated summaries & exercises** — role-play scenarios, manager conversation prompts
4. **Live sessions** — objection labs, ride-alongs (linked, not embedded)

Human review of AI-generated kit copy before delivery is recommended for production; demo uses rule-based + template generation with AI-ready structure.

---

## Seller center experience (`/rep/*`)

The rep portal is intentionally **not** the executive dashboard. Different audience, different promise.

| Route | Purpose |
|-------|---------|
| **My home** | Acknowledgment, focus areas, continue learning, optional manager share |
| **Enablement kit** | Full module list with progress |
| **My snapshot** | Personal scores vs org (pillars + stages); private view of their words |
| **Learning path** | 4-week suggested sequence — work at your pace |
| **Resources** | Curated library; items matching focus areas highlighted |

**Tone:** *“Here’s help for you”* — not *“Here’s what leadership should fix.”*

Privacy copy is visible throughout: leadership sees patterns; the rep owns their kit and progress.

---

## Privacy and trust model

| Rule | Implementation |
|------|----------------|
| Rep-owned identity | Rep authenticates (or token link) to see their kit |
| Leadership-blind rows | Individual survey rows used for kit generation; RLS blocks leadership from querying by seller |
| Aggregates only for execs | Themes, prevalence, pillar scores — minimum cohort sizes (e.g. n ≥ 5) for segment drill-down |
| No rep scorecards for managers | Managers get team-level play (“34% of Enterprise AEs struggle with CFO ROI”); not “Rep #7 needs coaching” |
| Consent-based sharing | Optional manager prompt; rep initiates any share |
| Open-text handling | Leadership sees clustered themes and paraphrased patterns; verbatim quotes anonymized in explorer |

---

## How this complements leadership intelligence

| Leadership gets | Rep gets |
|-----------------|----------|
| Org health score & trends | Personal snapshot vs org |
| Theme clusters & prevalence | “This is what you said — here’s what to do” |
| P0/P1 recommendations (owners, effort, impact) | Modules they can complete this week |
| Benchmark gaps | Focus areas with empathy + agency |
| Action items for RevOps, Enablement, Legal | Learning path + resource library |

**Same friction signal, two outcomes:**

- **Org level:** Fix the system (SLA, proof packs, objection labs at scale)
- **Individual level:** Help this rep win while the system catches up

---

## Measurement and improvement loop

Each cycle closes with a lightweight rep check-in (private):

- *Did these modules help?*
- *Which focus area moved most?*

Responses feed:

- **Kit quality** — which modules correlate with score improvement
- **Catalog gaps** — recurring requests AI can’t fill from approved content
- **Leadership priorities** — aggregate “did this help?” without individual attribution

---

## Example: Enterprise AE at DemoTech

**Survey signals:**

- Support pillar: 42/100 (org 48)
- Alignment pillar: 38/100 (org 57)
- Open text: *“Deal desk gives different pricing guidance depending on who is on shift.”*

**Kit delivered:**

1. **Acknowledgment** — Validates deal desk inconsistency; frames as ops issue
2. **Focus areas** — Support, Alignment, (optional) Negotiate stage
3. **Modules**
   - Deal desk escalation playbook (15 min)
   - CFO-ready ROI deck templates (15 min)
   - Pricing & commercial terms framework (25 min)
4. **Optional manager prompt** — 15-min ride-along on next enterprise opp

Leadership simultaneously sees: *Support pillar lowest org-wide; 22% of open text mentions legal/deal desk* — and a P0 recommendation to cap review SLA.

---

## Positioning summary

| Before | After |
|--------|-------|
| Survey → dashboard → leadership acts (maybe) | Survey → dashboard **+** personal kit → rep acts **now** |
| Feedback feels like venting | Feedback becomes a development contract |
| Enablement is one-size-fits-all | Enablement is gap-based, segment-aware, AI-curated |
| Anonymity OR personalization | Anonymity for org view; personalization for rep view |

**One-line pitch for ICs:**  
*Your feedback stays private. Your help is personal.*

**One-line pitch for leadership:**  
*Same diagnostic, dual outcome — org intelligence for you, enablement kits for the field.*

---

## Current implementation status (SellerUnblocked demo)

- **Data:** 500 DemoTech survey responses wired into aggregates and kit engine
- **Leadership portal:** `/app/*` — unchanged purpose, DemoTech-backed metrics
- **Seller center:** `/rep/*` — home, kit, snapshot, learning path, resources
- **Kit engine:** Rule-based module selection + template acknowledgment (AI-curation-ready)
- **Demo:** Rep switcher in top bar to preview different IC profiles

**Production next steps:** Auth + RLS, AI acknowledgment generation with human review, module completion tracking, LMS/Seismic integrations, cycle-over-cycle kit diff (“last time you focused on X — scores moved +8”).

---

## Related documents

- `SellerUnblocked_Product_Blueprint (1).md` — Core product pillars and data model
- `documents/demotech-survey/` — Survey instrument and sample response dataset
- Rep portal routes: `/rep/home`, `/rep/kit`, `/rep/snapshot`, `/rep/learn`, `/rep/resources`
