# SellerUnblocked

**Revenue Organization Intelligence** — SellerUnblocked helps revenue leaders measure the health of their sales organization by revealing operational friction, misalignment, and support gaps that slow sellers down.

## Project structure

- **Landing page** (`/`) — Marketing site built from the landing page design doc. Goal: convert CROs, RevOps, and GTM leaders to book a demo.
- **Product app** (`/app/*`) — Revenue Organization Intelligence UI for licensed customers. Spec: `SellerUnblocked_Product_Blueprint (1).md`. Uses sample data until backend and auth are wired.

### Product routes

| Route | Purpose |
|--------|---------|
| `/app` | Redirects to `/app/overview` |
| `/app/overview` | Executive health story, pillars, friction heatmap, benchmarks, themes |
| `/app/diagnostics` | Dimensions, stage friction, driver ranking |
| `/app/insights` | Insight cards + executive summary panel |
| `/app/recommendations` | Evidence-linked priorities + impact vs. effort |
| `/app/actions` | Assigned execution items, notes, and Slack updates |
| `/app/benchmarks` | Internal / external benchmark explorer |
| `/app/responses` | Qualitative explorer (controlled layout) |
| `/app/programs` | Measurement programs and participation |
| `/app/settings` | Workspace admin placeholders |

## Tech stack

- **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**, **Lucide**, **Recharts**

## Quick start

From the repo root, the most reliable way to boot the stack (sets up PATH for the bundled Node under `.local/` when present, enables polling to avoid macOS file-watcher limits):

```bash
./dev.sh
```

Or, if `node` / `npm` are already on your PATH:

```bash
npm install
npm run dev
```

If `npm: command not found`, install [Node.js LTS](https://nodejs.org/) or run `brew install node`, then try again.

**Production mode** (no hot reload, fewer macOS watcher issues):

```bash
./start-prod.sh
```

Open [http://localhost:3001](http://localhost:3001) for the landing page.

### Two local URLs (landing + web app)

This repo is a single Next.js app with two routes:

- **Landing page**: [http://localhost:3001/](http://localhost:3001/)
- **Product app**: [http://localhost:3001/app/overview](http://localhost:3001/app/overview) (default landing inside the app)

If you prefer **two different ports** (still the same codebase), run these in two terminals:

```bash
npm run dev:landing
```

```bash
npm run dev:app
```

Then open:

- [http://localhost:3001/](http://localhost:3001/)
- [http://localhost:3002/app](http://localhost:3002/app)

#### macOS note (file watcher limits)

If `next dev` logs `EMFILE: too many open files`, either raise your open-file limit (recommended) or use production mode (no file watching):

```bash
npm run build
npm run start
```

## Build

```bash
npm run build
npm start
```

### Production URLs

After `npm run build`, you can run either:

```bash
npm run start:landing
```

```bash
npm run start:app
```

## Documents

- `documents/sellerunblocked-landing-page-design-content-doc.md` — Landing page design and content spec.
