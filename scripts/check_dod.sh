#!/usr/bin/env bash
# Definition of Done — automated enforcement for frontend
# Usage: ./scripts/check_dod.sh  (or: make dod)
# Exit code 0 = all checks pass, non-zero = at least one failed.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

FAIL=0

echo "=== Frontend DoD Checks ==="

# ---------------------------------------------------------------
# 1. No console.log in production code (exclude tests, mocks, analytics)
# ---------------------------------------------------------------
echo -n "[1/6] No console.log in production code... "
CONSOLE_VIOLATIONS=$(grep -rn --include="*.ts" --include="*.tsx" \
  -E 'console\.(log|debug)\(' src/ \
  --exclude-dir="__tests__" --exclude-dir="mocks" --exclude-dir="analytics" \
  --exclude="*.test.*" --exclude="test-setup.ts" 2>/dev/null || true)
if [ -n "$CONSOLE_VIOLATIONS" ]; then
  echo -e "${RED}FAIL${NC} — console.log found in src/"
  echo "$CONSOLE_VIOLATIONS"
  FAIL=1
else
  echo -e "${GREEN}PASS${NC}"
fi

# ---------------------------------------------------------------
# 2. IO boundary — no fetch/axios in components
# ---------------------------------------------------------------
echo -n "[2/6] IO boundary (no fetch/axios in components)... "
VIOLATIONS=$(grep -rn --include="*.ts" --include="*.tsx" \
  -E '(^import.*from.*(axios)|^\s*fetch\(|^\s*axios\.)' \
  src/components/ src/pages/ 2>/dev/null \
  | grep -v '__tests__' | grep -v '\.test\.' | grep -v 'mock' || true)
if [ -n "$VIOLATIONS" ]; then
  echo -e "${RED}FAIL${NC}"
  echo "$VIOLATIONS"
  FAIL=1
else
  echo -e "${GREEN}PASS${NC}"
fi

# ---------------------------------------------------------------
# 3. Layering — components cannot import from services/
#    (Pages ARE allowed to import services — they are the orchestration layer)
# ---------------------------------------------------------------
echo -n "[3/6] Layering (components don't import services)... "
LAYER_VIOLATIONS=$(grep -rn --include="*.ts" --include="*.tsx" \
  -E "from.*['\"].*services/" \
  src/components/ 2>/dev/null \
  | grep -v '__tests__' | grep -v '\.test\.' || true)
if [ -n "$LAYER_VIOLATIONS" ]; then
  echo -e "${RED}FAIL${NC}"
  echo "$LAYER_VIOLATIONS"
  FAIL=1
else
  echo -e "${GREEN}PASS${NC}"
fi

# ---------------------------------------------------------------
# 4. No live API calls in tests
# ---------------------------------------------------------------
echo -n "[4/6] No live API calls in tests... "
LIVE_CALLS=$(grep -rn --include="*.ts" --include="*.tsx" \
  -E '^\s*(await\s+)?fetch\(' \
  src/**/__tests__/ src/**/*.test.* 2>/dev/null \
  | grep -v 'vi\.mock\|vi\.fn\|mock\|Mock\|jest' || true)
if [ -n "$LIVE_CALLS" ]; then
  echo -e "${RED}FAIL${NC}"
  echo "$LIVE_CALLS"
  FAIL=1
else
  echo -e "${GREEN}PASS${NC}"
fi

# ---------------------------------------------------------------
# 5. Component test coverage (heuristic: every component has a test)
#    Converts PascalCase to kebab-case for matching
# ---------------------------------------------------------------
echo -n "[5/6] Component test coverage (heuristic)... "
MISSING=0
for comp in src/components/*.tsx src/pages/*.tsx; do
  [ -f "$comp" ] || continue
  basename=$(basename "$comp" .tsx)
  # Skip index files
  if [ "$basename" = "index" ]; then continue; fi
  # Convert PascalCase to kebab-case for test file matching
  kebab=$(echo "$basename" | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')
  # Look for a test file
  dir=$(dirname "$comp")
  FOUND=0
  # Check __tests__ dir (both PascalCase and kebab-case)
  if ls "${dir}/__tests__/"*"${basename}"* 1>/dev/null 2>&1; then FOUND=1; fi
  if ls "${dir}/__tests__/"*"${kebab}"* 1>/dev/null 2>&1; then FOUND=1; fi
  # Check sibling test file
  if ls "${dir}/${basename}.test."* 1>/dev/null 2>&1; then FOUND=1; fi
  if ls "${dir}/${kebab}.test."* 1>/dev/null 2>&1; then FOUND=1; fi
  # Small presentation-only components (< 80 lines) don't require tests
  LINES=$(wc -l < "$comp" | tr -d ' ')
  if [ "$FOUND" -eq 0 ] && [ "$LINES" -gt 80 ]; then
    echo ""
    echo "  WARNING: No test file for $comp ($LINES lines)"
    MISSING=1
  fi
done
if [ "$MISSING" -eq 1 ]; then
  echo -e "${RED}FAIL${NC}"
  FAIL=1
else
  echo -e "${GREEN}PASS${NC}"
fi

# ---------------------------------------------------------------
# 6. Contract version sync (CONTRACTS.md vs CHANGE_MANIFEST.json)
# ---------------------------------------------------------------
echo -n "[6/6] Contract version sync... "
CONTRACTS_VER=$(grep -E 'Contract Version:\s*[0-9]+\.[0-9]+\.[0-9]+' CONTRACTS.md 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' || echo "MISSING")
MANIFEST_VER=$(node -e "console.log(require('../CHANGE_MANIFEST.json').contract_version)" 2>/dev/null || echo "MISSING")
if [ "$CONTRACTS_VER" = "$MANIFEST_VER" ]; then
  echo -e "${GREEN}PASS${NC} (v${CONTRACTS_VER})"
else
  echo -e "${RED}FAIL${NC} — CONTRACTS.md=${CONTRACTS_VER}, CHANGE_MANIFEST.json=${MANIFEST_VER}"
  FAIL=1
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}=== All DoD checks passed ===${NC}"
else
  echo -e "${RED}=== DoD checks FAILED ===${NC}"
  exit 1
fi
