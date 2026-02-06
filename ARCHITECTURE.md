# Frontend Architecture

> **LIVING SOURCE OF TRUTH** -- Updated after every user story.
> If a file/component is not listed here, it doesn't exist.

## File Tree

```
frontend/
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Root component (placeholder)
│   ├── App.css                    # App-specific styles
│   ├── App.test.tsx               # Smoke test (renders without crashing)
│   ├── index.css                  # Tailwind CSS v4 import
│   ├── test-setup.ts              # Vitest setup (jest-dom matchers)
│   ├── components/                # Shared UI components (empty)
│   ├── pages/                     # Page-level components (empty)
│   ├── lib/                       # Utility functions (empty)
│   ├── hooks/                     # Custom React hooks (empty)
│   ├── types/
│   │   └── api.ts                 # TypeScript types matching backend Pydantic models
│   ├── services/
│   │   ├── api-client.ts          # Fetch-based API client
│   │   └── api-client.test.ts     # API client tests
│   └── mocks/
│       └── golden/
│           ├── governance-report.json  # Golden governance report fixture
│           └── seo-report.json         # Golden SEO report fixture
├── public/
│   └── vite.svg
├── index.html                     # HTML entry point
├── vite.config.ts                 # Vite config (React + Tailwind + Vitest)
├── tsconfig.json                  # TypeScript project references
├── tsconfig.app.json              # App TypeScript config
├── tsconfig.node.json             # Node TypeScript config
├── eslint.config.js               # ESLint flat config
├── package.json
├── Makefile                       # Quality gate: `make check`
├── AGENT_PROMPT.md
├── ARCHITECTURE.md                # This file
├── CONTRACTS.md                   # Shared API schemas
├── PROGRESS.md
├── CURRENT_TASKS.md
├── BLOCKERS.md
├── MOCK_DATA.md
├── TEST_GUIDE.md
├── REVIEW_STRATEGY.md
└── REVIEW_LOG.md
```

## Component Tree

```
App
└── (placeholder -- to be expanded with pages and components)
```

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage (TBD) | Landing page with input form |
| `/report` | ReportPage (TBD) | Report display with polling |

## Data Flow

```
User Input (form)
  → API Client (services/api-client.ts)
  → POST /api/report/governance
  → Receive job_id
  → Poll GET /api/report/status/{job_id}
  → Render GovernanceReport when complete
  → User submits competitors
  → POST /api/report/seo
  → Poll for SEO report
  → Render SEOReport in second tab
```

## Interface Contracts

### src/services/api-client.ts
- `apiClient.get<T>(path)` → `Promise<T>`
- `apiClient.post<T>(path, body)` → `Promise<T>`
- `ApiError` class with `status` and `body`

### src/types/api.ts
- All TypeScript interfaces matching backend Pydantic models (see CONTRACTS.md)

## Change Log

- 2026-02-06 US-0.2: Initial scaffold. Vite + React + TS + Tailwind v4, Vitest + RTL, API client, TypeScript types, golden fixtures, Makefile.
