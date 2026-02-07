# Flaky Tests Protocol

> Rules for identifying, quarantining, and fixing flaky tests.

## What Is a Flaky Test

A test that passes and fails on the same code without changes. Common causes:
- Timer/polling-based assertions
- Non-deterministic rendering order
- Async state updates after unmount
- Browser MCP timing in visual verification

## Rules

### Detection
- If a test fails during review but passes on retry: it is flaky
- If `make check` fails intermittently on the same branch: investigate flakiness first

### Quarantine (within 24 hours — HARD RULE)
1. Add `{ retry: 2 }` to the flaky test's options
2. Add entry to this file under "Quarantined Tests" with a **fix deadline** (24h from detection)
3. Replace non-deterministic dependency with deterministic mock/fixture
4. Remove retry once root cause is fixed
5. **If not fixed within 24 hours**: the retry must be replaced with `it.skip('FLAKY: [reason] — fix by [date]')` and a companion fix story must be created

### Prevention
- All API calls MUST be mocked in tests (no live backend calls)
- Use `vi.useFakeTimers()` for timer-dependent tests
- Polling hooks must use `vi.advanceTimersByTime()`, not real waits
- React state updates must be wrapped in `act()`

### Review Agent Enforcement
- Review Agent MUST reject merges that introduce new flaky tests
- A test that requires retry without a companion fix PR is a code smell
- Any `{ retry: N }` that has been in quarantine for > 24h without a fix PR → auto-reject

### Weekly Sweep (Enforced on main)
- Every Monday: scan for `{ retry: N }` and `it.skip` with FLAKY reason
- Any test quarantined for > 7 days: escalate to BLOCKERS.md or remove the test entirely
- Target: zero flaky tests on main at all times

## Quarantined Tests

| Test | File | Reason | Date | Status |
|------|------|--------|------|--------|
| _none_ | | | | |

## Resolved Flaky Tests

| Test | File | Root Cause | Fix | Date |
|------|------|-----------|-----|------|
| _none_ | | | | |
