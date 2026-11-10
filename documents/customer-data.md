# Customer data

The leadership app reads one published wave per customer. DemoTech is a customer in that same model. It is not the silent source for everyone else.

## What was already here

There was no database, login, or upload. `/app` imported `MOCK_*` from `lib/data/mock/platform.ts`, which builds every executive number from the DemoTech file `lib/data/demotech/responses.json` at module load. Settings was a static “Acme Revenue Co.” form. The seller portal (`/rep`) still reads that DemoTech file directly and is unchanged.

The old Likert conversion, `round(((average − 1) / 4) × 100)`, is the shared index for a 1–5 higher-is-better scale. A 4 is 75. Empty groups used to fall back to 3. They no longer do. A group with no valid answers is not scored.

DemoTech’s peer medians are still the hardcoded demo series. They are labeled a demo benchmark release and are not copied onto any other customer. New customers are `benchmarkEligible: false`.

## Records

Files live in `data/customers/` so a deploy can read them.

- `catalog.json` — users, organizations, memberships. No passwords.
- `<slug>/workspace.json` — one project, one dataset, the active revision, and the revision history.
- `<slug>/revisions/<id>.json` — normalized submissions for a baseline wave.
- DemoTech does not copy the 500-row file. Its revision points at `lib/data/demotech/responses.json`.

An organization has a name, slug, industry, optional region and seller-count band, `benchmarkEligible`, and `isDemo`. A membership is admin, analyst, or viewer. The local operator (`operator@sellerunblocked.local`) is a platform admin because this app has no auth provider yet. That record is not a login.

A project uses either `demotech-pulse` or `seller-baseline`. A dataset has one active published revision. Older revision files stay on disk when a new wave replaces them.

## Scoring

`lib/customers/metrics.ts` is the only index:

- Higher is better: `100 × (value − min) / (max − min)`, rounded.
- Lower is better: `100 × (max − value) / (max − min)`, rounded.
- Blank, `N/A`, `Don't know`, and the other tokens in the schema are missing. They are not zero and they are not a middle score.
- A pillar index is the rounded mean of its valid rating indexes.
- The organization index is the rounded mean of pillar indexes that have at least one valid rating. A pillar with no valid answers is left out, not averaged in as zero.
- The first wave has no cycle delta. A later published revision supplies the delta. DemoTech’s cycle deltas are the existing demo series, and the trend chart says so.

## Who can read what

`canReadOrganization` allows a platform admin or a member. `canAdminOrganization` allows a platform admin or an admin member. Creating a customer requires the platform admin. Publishing a CSV requires an admin of that customer. A viewer, and a member of another customer, cannot read or import the other account. Tests cover that split.

The executive UI still opens as the local operator, because there is no sign-in yet. The checks are in the read and import functions so a second user cannot be “fixed” by pointing the pages at another folder.

## Add a customer

1. Open **Settings** in the leadership app.
2. Enter the customer name, industry, and the customer admin’s name and email.
3. Optionally attach a CSV. Download the starter at `/templates/seller-baseline-responses.csv` (same file as `data/templates/seller-baseline-responses.csv`). The question contract is `data/templates/seller-baseline.schema.json`.
4. Submit. The app writes the account and, when the CSV is valid, the first published revision, then switches the workspace cookie to that customer.
5. To add a later file, stay on that customer and choose **Replace** (a new wave, prior revision kept) or **Append** (new `response_id`s only).
6. Commit the new `data/customers/<slug>/` folder and the catalog change. The next deploy then serves that customer.

Example rows in the starter CSV use `EX-` ids. Delete them before loading a real extract.

The hosted app on Vercel has a read-only disk. Settings will refuse the upload there rather than claim it saved. Add the customer on a writable copy, commit, and deploy.

## Import rules

- Required column: `response_id`, unique in the file, max 80 characters.
- Ratings: integers 1 through 5, or a missing token.
- `response_date`: blank or `YYYY-MM-DD`.
- Unknown columns are ignored and reported as warnings.
- A row error rejects the file. The active revision does not move.
- Publishing the same content again reuses the revision id (the id is the content hash). Appending a file whose ids are already in the active wave is also a no-op.
- Append refuses a mix of new ids and ids that are already published.
- Limits: 5,000 rows and 2,000,000 bytes. Open text max 4,000 characters.
- `respondent_id` should be an internal code. An email-shaped value is a warning.
- DemoTech rejects imports so the seeded pulse cannot be replaced from the form.

XLSX is not accepted. Export a CSV. There is no survey authoring screen, billing, or new model call in this layer.

## What the dashboards do

`/app` pages call `loadReport()`. The cookie `su-customer` picks the workspace. An empty customer renders an empty state on every executive page, including actions and benchmarks. A baseline wave fills the existing overview, diagnostics, insights, recommendations, responses, and programs from that revision. Stage charts stay empty because the baseline template has no stage questions. External peer numbers stay empty. Actions stay empty until they are actually assigned; the demo action list is DemoTech’s only.

The seller portal remains the DemoTech coaching demo.
