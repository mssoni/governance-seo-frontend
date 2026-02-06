# Review Strategy v1.0

## Quality Gate (Must Pass First)
- [ ] `make check` passes (tests + types + lint in one command)

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

## Phase-Specific Checks
(Added by review agent as patterns emerge)
