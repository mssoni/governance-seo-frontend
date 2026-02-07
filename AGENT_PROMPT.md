# Frontend Agent Prompt

## One-liner

You are building the frontend for a Website Governance + Local Competitive SEO Report tool.

## Tech Stack

- React 18, Vite, TypeScript
- Tailwind CSS v4 + shadcn/ui (to be initialized)
- Vitest + React Testing Library (testing)
- ESLint + TypeScript strict mode (linting + types)

## Current Phase

**Phase 4 -- Integration & Polish** ✅ **COMPLETE**

**Project Status:** All phases complete. All user stories delivered.

Completed (Phase 4 — Integration & Polish):
- US-9.1: Analytics instrumentation (7 tests)
- US-9.2: Error handling & edge cases (8 tests)
- US-9.3: Print-friendly styling (0 tests, CSS-only)
- API wiring to real backend (6 tests)

Completed (Phase 3 — SEO Module):
- US-6.2, US-8.1, US-8.2, US-8.3, US-8.4

Completed (Phase 2 — Core Engine):
- US-5.1, US-5.2, US-5.3, US-5.4, US-5.5, US-5.6, US-5.7

Completed (Phase 1 — Foundation):
- US-0.2, US-1.1, US-1.2, US-1.3

## Mock-First Development

Build all components against mock data in `src/mocks/golden/`. The backend agent is building the real API in parallel. Match the types in CONTRACTS.md exactly.

Golden fixtures available:
- `src/mocks/golden/governance-report.json` -- complete governance report
- `src/mocks/golden/seo-report.json` -- complete SEO report

## ALL STEPS, EVERY TIME

Every story follows the full workflow below. No step is ever skipped — whether you are a spawned dev agent (STANDARD mode) or the orchestrator is executing directly (INLINE mode). The execution mode controls *who* runs the steps, not which steps run.

**Risk is determined by what you touch, not by how much you change.** A one-line change to an IO module is higher risk than a 50-line presentational component. INLINE mode is single-brain execution, not a quick hack — all gates still apply: TDD, `make check`, `make dod`, doc updates.

## TDD Workflow

Every story follows this EXACT sequence:

### Phase A: Preflight
1. Read the story's Acceptance Criteria and Test Cases from ENGINEERING_PLAN.md
2. Run `make check` -- baseline must be green before starting
3. If consuming API data: verify golden fixture exists in src/mocks/golden/

### Phase B: Claim + Branch
4. Update CURRENT_TASKS.md to claim the story
5. Create branch: `epic-X/us-X.Y/short-description`

### Phase C: Contract-First (if consuming new API data)
6. Read CONTRACTS.md for the latest schema
7. Update TypeScript types in src/types/api.ts if needed
8. Update/create golden fixture matching schema exactly
9. If CONTRACTS.md is missing fields, flag in PROGRESS.md

### Phase D: TDD Loop
10. Write test file FIRST
11. Run test → MUST FAIL
12. Implement component
13. Run test → MUST PASS

### Phase E: Quality Gate
14. Run `make check` -- must pass
    - vitest (full suite)
    - eslint (linting)
    - tsc --noEmit (type checking)

### Phase F: Visual Verification (UI components only)
15. Start dev server: `npm run dev` (background)
16. Wait for ready signal, use browser MCP to verify rendering
17. Kill dev server when done

### Phase G: Documentation + Commit
18. Update ARCHITECTURE.md
19. Update PROGRESS.md
20. Release lock in CURRENT_TASKS.md
21. PR scope check -- only story-related changes
22. Commit: `feat(US-X.Y): [what was built]`

## Change Mode (Post-V1)

After V1 completion, work arrives as **change requests** instead of phase-scoped user stories.

- Changes are identified by a Change ID: `CHG-NNN` (ALWAYS uppercase)
- Branch naming: `change/CHG-NNN-short-description` (uppercase CHG, not `epic-X/us-X.Y/...`)
- Commit format: `feat(CHG-NNN): <description>` or `fix(CHG-NNN): <description>`
- The full process is defined in `CHANGE_PROCESS.md` at the workspace root
- The Change Agent (orchestrator) provides you with stories and acceptance criteria
- You still follow the same TDD workflow (Phases A-G above)
- You still update ARCHITECTURE.md, PROGRESS.md, CURRENT_TASKS.md after each story
- Run `make dod` + `DEFINITION_OF_DONE.md` checklist before committing
- `make check` must pass before reporting completion
- If schema changes: bump `contract_version` in CONTRACTS.md + CHANGE_MANIFEST.json

## IO Boundary Rule (MANDATORY)

Only these modules may perform IO (API calls via `api-client`):
- `src/services/api-client.ts` — the ONLY module that calls `fetch()`
- `src/hooks/useJobPolling.ts` (via api-client)
- `src/hooks/useSeoJobPolling.ts` (via api-client)
- `src/pages/LandingPage.tsx` (via api-client — pages are the orchestration layer)
- `src/pages/ReportPage.tsx` (via api-client)

**Pages may NOT call `fetch()` directly** — always go through `api-client.ts`.

**All components** (`src/components/`) receive data via props. No `fetch()`, `axios`, or `api-client` imports in components.

**Layering rule:** Components (`src/components/`) cannot import from `src/services/`. Only pages and hooks may import `api-client.ts`.

Tests for components use golden fixtures from `src/mocks/golden/`. Tests for hooks mock the api-client.

## Kill Switch (Attempt Budget)

| Task Type | Max Approaches | Max Failed Test Cycles | Action |
|-----------|---------------|----------------------|--------|
| Pure logic (utility, type, formatter) | 3 distinct strategies | 2 consecutive failures | BLOCKERS.md + release lock |
| Integration (hook, page, API wiring) | 3 distinct strategies | 3 consecutive failures | BLOCKERS.md + release lock |
| External dependency failure (backend down) | 1 attempt | 1 failure | BLOCKERS.md + immediate fallback |

An "approach" = a distinct strategy, not repeated retries of the same thing.
A "failed test cycle" = `make check` with test failures for the current story.

When triggered: write to BLOCKERS.md, log attempt count in PROGRESS.md, release lock, commit WIP, report to orchestrator.

## What NOT To Do

- Don't modify types without checking CONTRACTS.md
- Don't skip tests or quality gate
- Don't use `console.log()` in production code (use console.warn for errors only)
- Don't make drive-by refactors of unrelated code
- Don't change golden fixtures without updating CONTRACTS.md

## ARCHITECTURE.md Update Rule (MANDATORY)

After completing EVERY user story, update ARCHITECTURE.md with:
1. Any new components/files -- add to file tree
2. Any new routes -- add to routing table
3. Any changed prop interfaces -- document
4. Change log entry: `[DATE] US-X.Y: [what changed]`

**If it's not in ARCHITECTURE.md, it doesn't exist.**
