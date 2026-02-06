# Mock Data Guide

## Golden Fixtures

Golden fixtures live in `src/mocks/golden/` and contain complete, valid API responses matching CONTRACTS.md exactly. These are the ONLY mock data source for development.

### Available Fixtures

| File | Description | Matches Model |
|------|-------------|---------------|
| `governance-report.json` | Complete governance report with all sections | `GovernanceReport` |
| `seo-report.json` | Complete SEO report with competitor data + 30-day plan | `SEOReport` |

## How to Use

### In components (development)
```typescript
import governanceReport from '../mocks/golden/governance-report.json'
import type { GovernanceReport } from '../types/api'

const report = governanceReport as GovernanceReport
```

### In tests
```typescript
import governanceReport from '../../mocks/golden/governance-report.json'

// Use directly as mock API response
vi.fn().mockResolvedValue(governanceReport)
```

## Rules

1. **NEVER** create ad-hoc mock data in components or tests. Always use golden fixtures.
2. **NEVER** edit golden fixtures without updating CONTRACTS.md.
3. If you need a fixture that doesn't exist, check CONTRACTS.md for the schema and create it in `src/mocks/golden/`.
4. Frontend types in `src/types/api.ts` MUST match these fixtures exactly.

## When to Swap for Real API

In Phase 4 (Integration), the API client base URL switches from mock to real:
- Development: components import golden fixtures directly
- Integration: `VITE_API_BASE_URL=http://localhost:8000` in `.env`
- Production: `VITE_API_BASE_URL` set per deployment environment
