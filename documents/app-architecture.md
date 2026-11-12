# SellerUnblocked app

This is the architecture of the product as it is built on this branch. It covers the leadership app, the seller center, and the line between those and the marketing site.

Production `main` does not have the customer workspace yet. That lands when [PR #4](https://github.com/craiglutz801/sellerunblocked/pull/4) and [PR #5](https://github.com/craiglutz801/sellerunblocked/pull/5) merge. Until then, the live leadership app still reads the DemoTech mock for every visitor.

Operational import rules live in [customer-data.md](./customer-data.md). This file is the map of the app.

## Three surfaces

| Surface | Path | What it is |
| --- | --- | --- |
| Marketing site | `/` | The public SellerUnblocked story, including UnblockedAI. Static sections and scripted demos. |
| Leadership app | `/app` | The product a customer admin uses. One workspace per customer. Scores come from that customer's published wave. |
| Seller center | `/rep` | A private coaching demo for one DemoTech seller. It does not read customer workspaces. |

`/app` redirects to `/app/overview`. `/rep` redirects to `/rep/home`. There is no login. The leadership app always opens as the local operator, `operator@sellerunblocked.local`. That user is a platform admin in `data/customers/catalog.json`. The record is not a password.

The active customer is the `su-customer` cookie. The switcher in the top bar sets it through `POST /api/workspace`.

## Leadership app

The shell is `components/app/AppShell.tsx`. The nav is `lib/nav/exec.ts`.

Every executive page calls `loadReport()` in `lib/customers/active.ts`. If the customer has no published wave, the page renders `EmptyWorkspace` and does not borrow DemoTech. If a wave is published, the same page components render that customer's report.

| Page | What a published baseline shows |
| --- | --- |
| Overview | Organization index, pillar cards, trend of published revisions, and theme cards from open text. |
| Diagnostics | One row per pillar that has a valid rating, the weakest pillars as drivers, and an empty stage chart. |
| Insights | A written summary, segment spread when a region or role differs by 8 points or more with at least 3 responses, and risk flags. |
| Recommendations | Up to three actions, one for each lowest pillar, with an owner and the count of valid ratings. |
| Actions | Empty. DemoTech is the only workspace with an assigned action list. |
| Benchmarks | The customer's own index, and no peer median. DemoTech is the only workspace with the demo peer series. |
| Responses | Up to 100 excerpts from the active revision. |
| Programs | One closed program for the published file. No response rate, because the file does not include how many people were invited. |
| Settings | The customer record, the form to add a customer, and the form to publish a later CSV. |

DemoTech keeps the richer demo: stage friction, peer benchmarks, program response rates, and the seeded action list. Those numbers stay inside the DemoTech workspace.

### How a page gets its numbers

```text
cookie su-customer
  → catalog.json
  → data/customers/<slug>/workspace.json
  → one report builder
```

`lib/customers/report.ts` chooses the builder:

- `demotech-pulse` with a published revision uses `buildDemotechReport`. That reads the seeded 500 responses in `lib/data/demotech/responses.json` and the existing DemoTech aggregates. It does not copy those rows into the customer folder.
- No active revision uses `buildEmptyReport`.
- Anything else uses `buildBaselineReport` on the published revision files.

A viewer of another customer cannot read that account. The UI does not exercise that split yet, because every visit is the platform admin. The checks are in `lib/customers/access.ts` so a later login cannot skip them by pointing a page at another folder.

## Records

There is no database. Files under `data/customers/` are the store, and they are committed so a deploy can read them.

```text
data/customers/catalog.json
data/customers/<slug>/workspace.json
data/customers/<slug>/mapping.json
data/customers/<slug>/revisions/<revisionId>.json
```

`catalog.json` holds users, organizations, and memberships. A membership is `admin`, `analyst`, or `viewer`. An organization has a name, slug, industry, optional region and seller-count band, `benchmarkEligible`, and `isDemo`. New customers are not benchmark-eligible.

`workspace.json` holds one project, one dataset, the active revision id, and the revision history. A project template is `seller-baseline` or `demotech-pulse`.

A revision file holds normalized submissions:

- `responseId`, `respondentId`, `responseDate`
- `region`, `role`
- six ratings, each a 1–5 integer or null
- `openFriction`

The revision id is the content hash. Publishing the same rows again does not create a second revision.

`mapping.json` exists only after a file with non-baseline headers has been confirmed. It stores the header signature and the chosen targets.

DemoTech's workspace points at the seed. It has no revision file of its own and it rejects CSV uploads.

## Scoring

`lib/customers/metrics.ts` is the only index.

A 1–5 rating becomes `100 × (value − 1) / 4`, rounded. A 4 is 75. A lower-is-better scale is supported by the function and is not used by the baseline template.

Blank, `N/A`, `Don't know`, and the other tokens in `lib/customers/schema.ts` are missing. They are not zero and they are not a middle score.

A pillar score is the rounded mean of its valid rating indexes. The organization score is the rounded mean of the pillar scores that exist. A pillar with no valid answers is left out. An empty set is null, and the UI shows that as no score.

The first wave has no cycle delta. A later published revision supplies the delta. DemoTech's cycle deltas are the existing demo series.

Open-text themes are keyword buckets in `buildBaselineReport` (deal desk, tools, coaching, compensation, handoffs, message). A comment that matches none of those stays on the response as uncoded. This is not UnblockedAI.

## The baseline template

`data/templates/seller-baseline.schema.json` is the question contract. The starter file is `data/templates/seller-baseline-responses.csv`, also served at `/templates/seller-baseline-responses.csv`.

| Column | Role |
| --- | --- |
| `response_id` | Required. Unique in the file. Max 80 characters. |
| `respondent_id` | Optional internal code. An email-shaped value is a warning. |
| `response_date` | Optional `YYYY-MM-DD`. |
| `region`, `role` | Optional attributes. Used for segment spread. |
| `process_clarity` | Process. "I can explain our stages and what good looks like at each one." |
| `tool_burden` | Tools. "The tools I use give selling time back more than they take it." |
| `enablement_readiness` | Enablement. "I have the practice and content I need before a live deal." |
| `message_alignment` | Alignment. "What marketing says matches what buyers ask me." |
| `support_speed` | Support. "Deal desk, legal, and specialists respond in time to keep deals moving." |
| `comp_clarity` | Compensation. "I can explain how I get paid, including accelerators and SPIFs." |
| `open_friction` | Optional comment. Max 4,000 characters. |

Each rating question maps to one pillar. The template has no stage questions, so stage charts stay empty for a real customer.

## Publishing a wave

Settings posts to `POST /api/customers`.

Add a customer with a name, industry, and an admin name and email. A CSV is optional. A valid baseline file publishes the first wave and switches the cookie to that customer. A file that needs a mapping does not create the account until the mapping is confirmed.

A later file is **Replace** or **Append**. Replace publishes the file as the next wave and keeps the prior revision on disk. Append adds rows whose `response_id`s are new. Append of ids that are already in the active wave is a no-op when every id overlaps, and a rejection when the file mixes new and existing ids. A row error rejects the file. The active revision does not move.

A file whose headers are baseline fields publishes immediately. Any other column stops. Each column must be mapped to a baseline field or ignored. The confirmed mapping is saved for that header set and reused when the same columns arrive again. A new column stops for review. Similarity of a header is not enough to publish a meaning.

Limits are 5,000 rows and 2,000,000 bytes. XLSX is not accepted.

The hosted disk on Vercel is read-only. Settings refuses the upload there instead of claiming it saved. Add the customer on a writable copy, commit `data/customers/<slug>/` and `catalog.json`, and deploy.

## Seller center

`/rep` is a second shell, `lib/nav/rep.ts`, still bound to DemoTech.

| Page | What it shows |
| --- | --- |
| My home | A private welcome, the seller's score next to the org score, and the next kit module. |
| Enablement kit | Modules chosen from the seller's weak pillars. Progress is local demo state. |
| My snapshot | That seller's pillar and stage scores. |
| Learning path | The ordered modules for that seller. |
| Resources | Static links for the kit. |

`components/rep/RepProvider.tsx` picks a DemoTech employee, defaulting to the seeded id in `lib/data/demotech/config.ts`. `lib/data/demotech/enablement.ts` builds the snapshot and the kit from `responses.json`. Leadership pages do not read kit activity. The seller center does not read `data/customers/`.

## Marketing site

`/` is a separate tree: `app/page.tsx` and `components/landing/`. UnblockedAI on that page is the analyst story: listen, understand, prioritize, act, and measure. "Ask UnblockedAI" answers from `lib/landing/demo-data.ts`. No leadership page calls it, and publishing a CSV does not send text to a model.

## Not in the app

- Sign-in, passwords, and a real user session.
- Survey authoring. The baseline template is the only question set.
- A model that writes themes, follow-up questions, or recommendations.
- External benchmarks for a real customer.
- Assigned actions for a real customer.
- Stage-level questions on the baseline.
- A response rate, because invited counts are not in the file.
- Spreadsheet upload, billing, or a database.
