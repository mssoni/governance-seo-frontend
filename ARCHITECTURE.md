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
│   ├── components/
│   │   ├── Hero.tsx               # Hero section (headline, subheadline, CTA)
│   │   ├── TrustIndicators.tsx    # Trust badges (no-login, fast, transparent)
│   │   ├── InputForm.tsx          # Governance report input form with validation
│   │   └── __tests__/
│   │       └── input-form.test.tsx  # InputForm tests (8 cases)
│   ├── pages/
│   │   ├── LandingPage.tsx        # Landing page (Hero + TrustIndicators + form section)
│   │   └── __tests__/
│   │       └── landing-page.test.tsx  # Landing page tests (8 cases)
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
└── LandingPage
    ├── Hero              # Headline, subheadline, CTA anchor to #report-form
    ├── TrustIndicators   # 3 trust badges in responsive grid
    └── <section #report-form>
        └── InputForm     # URL, location, business type, intent fields + validation
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

### src/components/Hero.tsx
- Default export: `Hero` component (no props)
- Renders `<h1>`, `<p>`, and `<a href="#report-form">Generate Governance Report</a>`

### src/components/TrustIndicators.tsx
- Default export: `TrustIndicators` component (no props)
- Renders three cards: "No login required", "Results in under 90 seconds", "100% transparent"

### src/components/InputForm.tsx
- Default export: `InputForm` component
- Props: `{ onSubmit: (data: GovernanceReportRequest) => Promise<void>; isLoading: boolean }`
- Fields: website_url, city, region, country, business_type (select), intent (select)
- Client-side validation on blur and submit
- URL validation: must start with http(s):// or be a valid domain
- Disabled submit button when form invalid or loading

### src/pages/LandingPage.tsx
- Default export: `LandingPage` component (no props)
- Composes Hero, TrustIndicators, and a form section with `id="report-form"`

### src/types/api.ts
- All TypeScript interfaces matching backend Pydantic models (see CONTRACTS.md)

## Change Log

- 2026-02-06 US-0.2: Initial scaffold. Vite + React + TS + Tailwind v4, Vitest + RTL, API client, TypeScript types, golden fixtures, Makefile.
- 2026-02-06 US-1.1: Landing page layout and hero. Hero, TrustIndicators, LandingPage. 8 tests.
- 2026-02-06 US-1.2: Input form with validation. InputForm component with all fields, client-side validation, loading state. 8 tests.
