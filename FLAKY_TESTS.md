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

### Quarantine (within 24 hours)
1. Add `{ retry: 2 }` to the flaky test's options
2. Add entry to this file under "Quarantined Tests"
3. Replace non-deterministic dependency with deterministic mock/fixture
4. Remove retry once root cause is fixed

### Prevention
- All API calls MUST be mocked in tests (no live backend calls)
- Use `vi.useFakeTimers()` for timer-dependent tests
- Polling hooks must use `vi.advanceTimersByTime()`, not real waits
- React state updates must be wrapped in `act()`

### Review Agent Enforcement
- Review Agent MUST reject merges that introduce new flaky tests
- A test that requires retry without a companion fix PR is a code smell

## Quarantined Tests

| Test | File | Reason | Date | Status |
|------|------|--------|------|--------|
| _none_ | | | | |

## Resolved Flaky Tests

| Test | File | Root Cause | Fix | Date |
|------|------|-----------|-----|------|
| _none_ | | | | |
