.PHONY: check test lint typecheck

check: test lint typecheck
	@echo "All checks passed."

test:
	npx vitest run --reporter=dot

lint:
	npx eslint src/ --quiet

typecheck:
	npx tsc --noEmit
