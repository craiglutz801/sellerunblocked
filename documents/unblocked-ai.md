# UnblockedAI

UnblockedAI is the leadership readout at `/app/unblocked-ai`. It answers from the published wave the rest of the leadership app already shows. Numbers are computed with `lib/customers/metrics.ts`. The page renders that report immediately. A model, when configured, may add a hypothesis, a first step, or a follow-up question. It cannot change a score.

## Route and data flow

The leadership layout resolves the workspace with `selectWorkspace` in `lib/customers/report.ts`, the same choice as `loadReport`. The `su-customer` cookie is the selected account. The active revision on that workspace is the only wave UnblockedAI reads.

`POST /api/unblocked-ai/ask` accepts a question and the scope the page is showing. If the slug or revision does not match the workspace the server resolved, the response is `stale_context` and includes no other customer's evidence. A missing or unauthorized actor is rejected. Guided questions are answered from the report. Free-form questions are mapped to a small set of intents. A configured model may propose an intent, and the server checks that the pillar and filter exist on this wave.

`POST /api/unblocked-ai/analyze` asks for a short synthesis of the same priority readout. `POST /api/unblocked-ai/actions` saves a draft the user submitted. Evidence inside the drawer is the packet from that request. There is no separate evidence URL.

Baseline rows come from the published revision file. DemoTech rows come from the seeded pulse. Only the active revision and one earlier revision are read during an ask.

## What an answer can use

Ranked priorities are the lowest pillar indexes with at least **5 valid ratings**. Ties break toward more valid ratings, then the pillar key. A region or role is shown only when both sides have at least **5 distinct contributors**. The contributor is the respondent id when the row has one, otherwise the submission id. A direct filter under that floor returns no scores and no comments. These floors are `MIN_VALID_RATINGS` and `MIN_COHORT_CONTRIBUTORS` in `lib/unblocked-ai/policy.ts`.

A 1–5 rating becomes `100 × (rating − 1) / 4`. Missing values are left out. A score of 0 is a real score. The first wave has no change. An overlapping or appended revision is labeled a revision comparison and shows both samples. A distinct later period is a wave-to-wave change. DemoTech's earlier points and peer median are labeled demo data.

Seller text is redacted before it is shown or sent to a model. Comments are evidence, not instructions. A workspace can set `settings.textProcessing` to `false` in `workspace.json`. When that is set, answers use scores only. Omitted means text can be read, which is the preview default.

## Model configuration

With no provider, every guided answer is labeled **From your report**. The readout, evidence, and draft still work.

| Variable | Purpose |
| --- | --- |
| `UNBLOCKED_AI_PROVIDER` | `report` (default), `test`, or `openai` |
| `OPENAI_API_KEY` | Required for `openai`. Never committed. |
| `UNBLOCKED_AI_MODEL` | Defaults to `gpt-4o-mini` |
| `UNBLOCKED_AI_BASE_URL` | Defaults to `https://api.openai.com/v1` |
| `UNBLOCKED_AI_REQUESTS_PER_MINUTE` | Per-workspace budget. Default 30. |
| `UNBLOCKED_AI_WORKSPACES` | Optional allowlist. Set to `demotech` for a public demo. |

The model returns JSON. The server keeps the measured sentence, checks every number against the evidence packet, checks evidence ids, and retries once. If that fails, the report answer remains and the status says analysis is temporarily unavailable.

## Actions

**Copy draft** always works. **Save to Actions** is shown when `data/customers` is writable. The record is `data/customers/<slug>/actions.json`, which is gitignored. Saving is idempotent on the draft key. Admins and analysts can save. The current operator is a platform admin, so local preview can save. A hosted disk that cannot be written keeps copy only. A saved action shows **Awaiting comparable wave** until a later baseline revision can score the same pillar. The original baseline stays on the record.

This is the preview store. A customer pilot still needs a private writable store and a real signed-in member. That is not this slice.

## Synthetic fixture

Fieldline is a committed synthetic account: 24 submissions, support 40/100 from 20 valid ratings, three comments about quote-exception delays, and no earlier wave. Switch to Fieldline in the leadership app, open Overview, then UnblockedAI. The finding, the evidence, and the draft all come from that file.

DemoTech remains the demo workspace. Its benchmark and earlier series stay labeled demo data.

## Tests

```bash
npm test
npx tsc --noEmit
npm run build
```

`npm test` runs the customer-data suite and `lib/unblocked-ai/unblocked-ai.test.ts`.

## Not in this slice

Sign-in is still the local operator. Customer files are still the committed catalog, not private object storage. Generated analyses are not cached. A viewer of one account is enforced on the ask and save functions, and the product UI still signs everyone in as the operator.
