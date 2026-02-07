# Review Strategy v2.0

## Review Agent Role: Review + Fix + APPROVE (Not Merge)

The Review Agent is autonomous for review and small fixes. It does NOT merge — the orchestrator handles the merge gate.

1. **Fixes small issues directly** (formatting, missing logs, lint errors, missing doc entries)
2. **Reports APPROVED/REJECTED** status — does NOT merge
3. **Rejects architectural issues** back to dev agents via REVIEW_LOG.md
4. **Auto-rejects** if any auto-reject trigger fires (see below)

Classification guide:
- **Small fix (you fix it)**: lint/format, missing logging, missing ARCHITECTURE.md entry, missing test edge case, console.log left in code
- **Reject (dev agent fixes)**: wrong approach, missing feature from AC, broken contract requiring design change
- **Auto-reject (immediate, no fix attempt)**: see Auto-Reject Triggers below

After fixing, commit as: `fix(CHG-NNN): [what was fixed per review]`
After all checks pass: report APPROVED status to orchestrator.

## Quality Gate (Must Pass First)
- [ ] `make check` passes (tests + types + lint in one command)
- [ ] If it fails and fix is small: fix it yourself, re-run, continue
- [ ] If it fails and fix is architectural: REJECT to REVIEW_LOG.md

## Always Check (Every PR)
- [ ] Every new file has a corresponding test file
- [ ] Types match CONTRACTS.md exactly (field names, types, optionality)
- [ ] No secrets, API keys, or .env files committed
- [ ] ARCHITECTURE.md updated with any new files, components, or changed interfaces
- [ ] PROGRESS.md updated to reflect completed work
- [ ] CURRENT_TASKS.md lock released
- [ ] No console.log() left in production code
- [ ] All API calls have error handling (.catch or try/catch)

## Schema & Contract Integrity
- [ ] Golden fixtures in src/mocks/golden/ match CONTRACTS.md
- [ ] TypeScript types in src/types/api.ts match backend Pydantic models field-for-field
- [ ] No removal or renaming of existing JSON fields (additive only)
- [ ] If types changed: CONTRACTS.md checked, golden fixtures updated

## PR Scope Discipline
- [ ] PR contains ONLY changes for the claimed user story
- [ ] No drive-by refactors of unrelated code
- [ ] No unrelated file changes or "while I'm here" fixes
- [ ] Commit message follows format: "feat(US-X.Y): [description]"

## Copy Tone & Transparency (for UI stories with user-facing text)
- [ ] No salesy language ("boost", "skyrocket", "guaranteed results", "dominate")
- [ ] Uses transparent language ("we observed", "this suggests", "based on public signals")
- [ ] Disclaimers present where PRD requires them
- [ ] "What we can't control" content is honest and complete

## UI Quality
- [ ] Components are accessible (aria-labels on interactive elements, keyboard navigable)
- [ ] Responsive: works at 375px (mobile) and 1440px (desktop)
- [ ] Loading states present for async operations
- [ ] Error states present with user-friendly messages

## Code Quality
- [ ] No code duplication > 10 lines (extract to shared component/utility)
- [ ] Components are < 150 lines (split if longer)
- [ ] Files are < 300 lines (split if longer)
- [ ] Props have proper TypeScript types (no `any`)

## Test Quality
- [ ] Tests cover happy path AND at least 1 error/edge case per component
- [ ] Tests use golden fixtures from src/mocks/golden/
- [ ] Test names clearly describe what they verify
- [ ] No test interdependencies (each test runs independently)

## Auto-Reject Triggers (Immediate Rejection, No Fix Attempt)

If ANY of these are true, reject immediately and log to REVIEW_LOG.md:

1. Contract changed without `contract_version` bump + golden fixture updates
2. New dependency added without ARCHITECTURE.md update
3. New component/page added without tests
4. `git diff main` includes files outside the change's allowed scope
5. Any live API call found in test files (no mocks)
6. Any direct fetch/axios import in a component (IO boundary violation)
7. `make check` fails after review fixes
8. CHANGE_LOG.md entry missing for the Change ID
9. DEFINITION_OF_DONE.md checklist has failing items

## IO Boundary Enforcement

Only these modules may perform HTTP/API calls:
- `src/services/api-client.ts`
- `src/hooks/useJobPolling.ts` (via api-client)
- `src/hooks/useSeoJobPolling.ts` (via api-client)

All components receive data via props. No direct fetch/axios calls in components.
Reject if: `fetch(`, `axios.`, or direct HTTP imports appear in any component file.

## Flaky Test Protocol

- If a test fails on review but passes on retry: it is flaky
- Flaky tests must be quarantined in FLAKY_TESTS.md within 24 hours
- Reject merges that introduce new flaky tests without a fix plan
- See FLAKY_TESTS.md for full protocol

## Change Review Checklist (Post-V1 Changes)

When reviewing a change request (CHG-NNN):

- [ ] **No regressions**: all pre-existing tests still pass (test count >= baseline)
- [ ] **No breaking schema changes** without `[BREAKING SCHEMA CHANGE]` flag + major version bump
- [ ] **Contract version**: `contract_version` bumped if schema changed (in CONTRACTS.md + CHANGE_MANIFEST.json)
- [ ] **Scope discipline**: only files related to the change are modified
- [ ] **Backward compatibility**: TypeScript types in `src/types/api.ts` are additive-only
- [ ] **Branch hygiene**: work is on `change/CHG-NNN-*` branch (uppercase), not directly on main
- [ ] **Change log**: CHANGE_LOG.md entry exists with correct Change ID
- [ ] **Change manifest**: CHANGE_MANIFEST.json updated with commit SHAs
- [ ] **Rollback safety**: changes can be reverted with a single `git revert`
- [ ] **Accessibility preserved**: no removal of aria attributes, keyboard navigation, or semantic HTML
- [ ] **DoD passed**: all items in DEFINITION_OF_DONE.md are satisfied

## Phase-Specific Checks
(Added by review agent as patterns emerge)

### Phase 2 additions:
- [ ] Report components: verify tests use golden fixture data (not handcrafted mocks) wherever possible
- [ ] Polling hooks: verify cleanup (clearInterval, active flag) to prevent state updates after unmount
- [ ] Badge/Chip components: verify type-safe Record maps cover all enum values (no missing variants)
