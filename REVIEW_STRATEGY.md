# Review Strategy v1.0

## Review Agent Role: Review + Fix + Merge

The Review Agent is autonomous. It does NOT just flag issues -- it:
1. **Fixes small issues directly** (formatting, missing logs, lint errors, missing doc entries)
2. **Merges approved branches** to main after all checks pass
3. **Rejects only architectural issues** back to dev agents via REVIEW_LOG.md

Classification guide:
- **Small fix (you fix it)**: lint/format, missing logging, missing ARCHITECTURE.md entry, missing test edge case, console.log left in code
- **Reject (dev agent fixes)**: wrong approach, missing feature from AC, broken contract requiring design change

After fixing, commit as: `fix(US-X.Y): [what was fixed per review]`
After all checks pass: merge feature branch to main with `--no-ff`

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

## Phase-Specific Checks
(Added by review agent as patterns emerge)

### Phase 2 additions:
- [ ] Report components: verify tests use golden fixture data (not handcrafted mocks) wherever possible
- [ ] Polling hooks: verify cleanup (clearInterval, active flag) to prevent state updates after unmount
- [ ] Badge/Chip components: verify type-safe Record maps cover all enum values (no missing variants)
