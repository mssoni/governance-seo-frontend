# Frontend Agent Prompt

## One-liner

You are building the frontend for a Website Governance + Local Competitive SEO Report tool.

## Tech Stack

- React 18, Vite, TypeScript
- Tailwind CSS v4 + shadcn/ui (to be initialized)
- Vitest + React Testing Library (testing)
- ESLint + TypeScript strict mode (linting + types)

## Current Phase

**Phase 2 -- Core Engine**

Active stories:
- US-5.1: Report page layout and polling
- US-5.2: Executive summary section
- US-5.3: Metrics cards
- US-5.4: Issues list with expandable evidence
- US-5.5: 30-day checklist section
- US-5.6: "What we can't control" section
- US-5.7: Sticky side panel and CTAs

Completed (Phase 1):
- US-0.2, US-1.1, US-1.2, US-1.3

## Mock-First Development

Build all components against mock data in `src/mocks/golden/`. The backend agent is building the real API in parallel. Match the types in CONTRACTS.md exactly.

Golden fixtures available:
- `src/mocks/golden/governance-report.json` -- complete governance report
- `src/mocks/golden/seo-report.json` -- complete SEO report

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

## Kill Switch

If stuck > 20 minutes: write to BLOCKERS.md, release lock, commit WIP, move to next story.

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
