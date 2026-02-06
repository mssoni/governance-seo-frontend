# Test Guide

## Running Tests

### Quick (default -- use this)
```bash
make check
```
Runs: vitest + eslint + tsc --noEmit. If this passes, you're good.

### Individual commands
```bash
# Tests only (minimal output)
npx vitest run --reporter=dot

# Tests with verbose output
npx vitest run --reporter=verbose 2>&1 | tee /tmp/test_full.log

# Lint only
npx eslint src/ --quiet

# Type check only
npx tsc --noEmit

# Single test file
npx vitest run src/App.test.tsx

# Watch mode (local dev only, not for agents)
npx vitest
```

## Test Structure

- `src/**/*.test.tsx` -- component tests (co-located with components)
- `src/**/*.test.ts` -- utility/service tests
- `src/test-setup.ts` -- jest-dom matchers setup
- `src/mocks/golden/` -- golden API response fixtures

## Conventions

1. Co-locate tests with components: `Button.tsx` → `Button.test.tsx`
2. Use React Testing Library -- test behavior, not implementation
3. Use golden fixtures from `src/mocks/golden/` for API response data
4. Keep output clean: `--reporter=dot` by default, verbose to file only
5. Never log full component trees or DOM dumps to stdout
6. Every component has at least: renders without crashing + 1 behavior test
