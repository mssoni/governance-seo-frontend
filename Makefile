.PHONY: check test lint typecheck dod io-boundary-check contract-check

check: test lint typecheck
	@echo "All checks passed."

test:
	npx vitest run --reporter=dot

lint:
	npx eslint src/ --quiet

typecheck:
	npx tsc --noEmit

# Definition of Done — automated enforcement
dod:
	@bash scripts/check_dod.sh

# IO boundary check (subset of dod, runnable standalone)
io-boundary-check:
	@echo "Checking IO boundary..."
	@! grep -rn --include="*.ts" --include="*.tsx" \
		-E '(^import.*from.*(axios)|^\s*fetch\()' \
		src/components/ 2>/dev/null \
		| grep -v '__tests__' | grep -v '\.test\.' | grep -v 'mock' || \
		(echo "FAIL: Direct fetch/axios found in components" && exit 1)
	@echo "✓ IO boundary clean."

# Contract version sync check
contract-check:
	@echo "Checking contract version sync..."
	@node -e "\
	const fs = require('fs'); \
	const contracts = fs.readFileSync('CONTRACTS.md', 'utf8'); \
	const m = contracts.match(/Contract Version:\s*(\d+\.\d+\.\d+)/); \
	const manifest = JSON.parse(fs.readFileSync('../CHANGE_MANIFEST.json', 'utf8')); \
	if (!m) { console.error('No contract version in CONTRACTS.md'); process.exit(1); } \
	if (m[1] !== manifest.contract_version) { \
	  console.error('Mismatch: CONTRACTS.md=' + m[1] + ', manifest=' + manifest.contract_version); \
	  process.exit(1); \
	} \
	console.log('✓ Contract version in sync: v' + manifest.contract_version);"
