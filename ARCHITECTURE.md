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
│   │   ├── ProgressBar.tsx        # Progress bar with step labels for report generation
│   │   ├── ReportHeader.tsx       # Report header with URL, location, intent badge
│   │   └── __tests__/
│   │       └── input-form.test.tsx  # InputForm tests (8 cases)
│   ├── hooks/
│   │   └── useJobPolling.ts       # Custom hook: polls job status, returns state + retry
│   ├── pages/
│   │   ├── LandingPage.tsx        # Landing page (Hero + TrustIndicators + form + error UI)
│   │   ├── ReportPage.tsx         # Report page with polling, progress, header, report content
│   │   └── __tests__/
│   │       ├── landing-page.test.tsx     # Landing page tests (8 cases)
│   │       ├── form-submission.test.tsx  # Form submission + navigation tests (4 cases)
│   │       └── report-page.test.tsx     # Report page polling + display tests (6 cases)
│   ├── lib/                       # Utility functions (empty)
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
App (BrowserRouter + Routes)
├── / → LandingPage
│   ├── Hero              # Headline, subheadline, CTA anchor to #report-form
│   ├── TrustIndicators   # 3 trust badges in responsive grid
│   ├── <section #report-form>
│   │   └── InputForm     # URL, location, business type, intent fields + validation
│   └── Error display     # API/network error alert with optional retry button
└── /report → ReportPage  # Reads ?job= param, polls for status
    ├── [loading] ProgressBar      # Progress bar + step labels
    ├── [error] Error display      # Error message + "Try again" button
    └── [complete]
        ├── ReportHeader           # Website URL, location, intent badge
        └── ReportContent          # Executive summary (working + attention items)
```

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Landing page with input form, API submission, error handling |
| `/report` | ReportPage | Report display with job polling, progress, error, report rendering |

## Data Flow

```
User Input (form)
  → API Client (services/api-client.ts)
  → POST /api/report/governance
  → Receive job_id
  → Navigate to /report?job={job_id}&url=...&location=...&intent=...
  → useJobPolling hook polls GET /api/report/status/{job_id}
  → Show ProgressBar while processing
  → On error: show error + "Try again" button (retry resets polling)
  → On complete: render ReportHeader + ReportContent
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

### src/hooks/useJobPolling.ts
- `useJobPolling(jobId: string)` → `{ status, progress, currentStep, stepsCompleted, report, error, retry }`
- Polls `GET /api/report/status/{jobId}` every 2.5 seconds
- Uses `useReducer` for state management (RESET, POLL_SUCCESS, POLL_ERROR, RETRY actions)
- Stops polling on `complete` or `failed` status
- `retry()` resets state and restarts polling

### src/components/ProgressBar.tsx
- Default export: `ProgressBar` component
- Props: `{ progress: number, currentStep: string | null, stepsCompleted: string[] }`
- Renders percentage bar + list of pipeline steps with status icons
- Pipeline steps: url_normalize, fetch_homepage, parse_sitemap, sample_pages, run_detectors, run_psi, build_issues, generate_checklist, build_report

### src/components/ReportHeader.tsx
- Default export: `ReportHeader` component
- Props: `{ websiteUrl: string, location: string, intent: string }`
- Renders website URL link, location, and intent badge

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
- Uses `useNavigate` from react-router-dom
- `handleSubmit`: POSTs to `/api/report/governance`, navigates to `/report?job={job_id}` on success
- Error handling: `ApiError` → user-friendly message; network error → message + retry button
- State: `isLoading`, `error: { message, isNetworkError }`, `lastPayload` (for retry)

### src/pages/ReportPage.tsx
- Default export: `ReportPage` component (no props)
- Reads `job`, `url`, `location`, `intent` from URL search params
- Uses `useJobPolling(jobId)` for polling logic
- Three states: loading (ProgressBar), error (message + Try again), complete (ReportHeader + ReportContent)

### src/types/api.ts
- All TypeScript interfaces matching backend Pydantic models (see CONTRACTS.md)

## Change Log

- 2026-02-06 US-0.2: Initial scaffold. Vite + React + TS + Tailwind v4, Vitest + RTL, API client, TypeScript types, golden fixtures, Makefile.
- 2026-02-06 US-1.1: Landing page layout and hero. Hero, TrustIndicators, LandingPage. 8 tests.
- 2026-02-06 US-1.2: Input form with validation. InputForm component with all fields, client-side validation, loading state. 8 tests.
- 2026-02-06 US-1.3: Form submission and navigation. react-router-dom, BrowserRouter in App, LandingPage POSTs to API and navigates on success, error handling with retry, ReportPage placeholder. 4 tests.
- 2026-02-06 US-5.1: Report page layout and polling. useJobPolling hook (useReducer-based), ProgressBar with pipeline steps, ReportHeader, ReportPage rewrite with 3 states (loading/error/complete). 6 tests.
