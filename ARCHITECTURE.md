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
│   │   ├── report/
│   │   │   ├── Badge.tsx          # Reusable DetectedAsBadge + ConfidenceChip components
│   │   │   ├── EvidencePanel.tsx  # Reusable expandable evidence panel (toggle show/hide)
│   │   │   ├── ExecutiveSummary.tsx # Executive summary with working/attention sections
│   │   │   ├── IssuesList.tsx     # Issues list with severity filter, expandable details, badges
│   │   │   ├── MetricsCards.tsx   # Metric cards grid with value, meaning, evidence, why_it_matters
│   │   │   ├── ChecklistSection.tsx  # 30-day checklist grouped by category, interactive checkboxes
│   │   │   ├── LimitationsSection.tsx # "What we can't control" always-visible section
│   │   │   ├── SidePanel.tsx     # Sticky side panel with top actions, print, CTAs
│   │   │   ├── CompetitorTable.tsx  # Competitor overview table with color coding, tooltips
│   │   │   ├── StrengthsGaps.tsx   # Strengths, weaknesses & gap breakdown section
│   │   │   ├── SEOActionPlan.tsx   # 30-day week-by-week action plan with collapsible weeks
│   │   │   └── __tests__/
│   │   │       ├── executive-summary.test.tsx  # ExecutiveSummary tests (7 cases)
│   │   │       ├── issues-list.test.tsx        # IssuesList tests (4 cases)
│   │   │       ├── metrics-cards.test.tsx      # MetricsCards tests (4 cases)
│   │   │       ├── checklist.test.tsx           # ChecklistSection tests (5 cases)
│   │   │       ├── limitations.test.tsx         # LimitationsSection tests (3 cases)
│   │   │       ├── side-panel.test.tsx          # SidePanel tests (6 cases)
│   │   │       ├── competitor-table.test.tsx    # CompetitorTable tests (7 cases)
│   │   │       ├── strengths-gaps.test.tsx      # StrengthsGaps tests (4 cases)
│   │   │       └── action-plan.test.tsx         # SEOActionPlan tests (5 cases)
│   │   ├── CompetitorForm.tsx     # Competitor input form (3 URL fields, validation, SEO submit)
│   │   └── __tests__/
│   │       ├── input-form.test.tsx  # InputForm tests (8 cases)
│   │       └── competitor-form.test.tsx  # CompetitorForm tests (7 cases)
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
        └── ReportContent
            ├── ExecutiveSummary   # Working items (green) + attention items (orange)
            │   └── SummaryCard    # Per-item card with Badge + ConfidenceChip
            ├── MetricsCards       # 2-col responsive grid of metric cards
            │   └── MetricCardItem # Name, value, meaning, why_it_matters, EvidencePanel
            ├── IssuesList         # Severity-filtered list of expandable issue cards
            │   └── IssueCard      # Title, badges, expandable details with EvidencePanel
            ├── ChecklistSection   # 30-day checklist grouped by category
            │   └── CategoryGroup  # Collapsible category with checkbox items
            └── LimitationsSection # Always-visible limitations list
        └── SidePanel (right col, sticky, desktop only, hidden on print)
            ├── Top Actions (first 5 issues)
            ├── Print Report button
            ├── Need help? CTA
            ├── Connect GA/GSC (disabled, Coming soon)
            └── Compare against competitors (link)
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

### src/components/report/ExecutiveSummary.tsx
- Default export: `ExecutiveSummary` component
- Props: `{ summary: ExecutiveSummary }` (from types/api.ts)
- "What's Working" section (green, data-testid="whats-working")
- "What Needs Attention" section (orange, data-testid="needs-attention")
- Each item rendered as SummaryCard with DetectedAsBadge + ConfidenceChip

### src/components/report/EvidencePanel.tsx
- Default export: `EvidencePanel` component
- Props: `{ evidence: Evidence[], label?: string, defaultOpen?: boolean }`
- Toggle button: "Show evidence" / "Hide evidence" (customizable via label)
- Lists evidence items with description + raw_value (mono badge)
- Chevron rotates on expand/collapse

### src/components/report/MetricsCards.tsx
- Default export: `MetricsCards` component
- Props: `{ metrics: MetricCard[] }`
- Renders responsive grid (2 cols desktop, 1 col mobile)
- Each card: name (uppercase label), value (large bold), meaning, "Why it matters" (indigo box), EvidencePanel

### src/components/report/IssuesList.tsx
- Default export: `IssuesList` component
- Props: `{ issues: Issue[] }`
- Severity filter buttons at top: All, High, Medium, Low (active = indigo)
- Issues sorted by severity (High > Medium > Low)
- Each IssueCard: title, SeverityBadge, ConfidenceChip, DetectedAsBadge, expand button
- Expanded details: EvidencePanel (defaultOpen), why_it_matters, what_happens_if_ignored, what_to_do (list), expected_impact
- SeverityBadge: High (red), Medium (orange), Low (green)

### src/components/report/Badge.tsx
- Named exports: `DetectedAsBadge`, `ConfidenceChip`
- `DetectedAsBadge({ detectedAs })` — Observed (blue) / Inferred (yellow)
- `ConfidenceChip({ confidence })` — High (red) / Medium (orange) / Low (green)

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
- Complete state uses 2-column grid: main content (left, wider) + SidePanel (right, 280px, sticky, desktop only)
- Container max-w-6xl for 2-column layout

### src/components/report/ChecklistSection.tsx
- Default export: `ChecklistSection` component
- Props: `{ items: ChecklistItem[] }`
- Groups items by `category` field
- Each category is a collapsible section (expanded by default)
- Each item: checkbox (local state), action text, effort badge (S=green, M=yellow, L=red), frequency tag, owner badge, why_it_matters
- Checkboxes use `useState<Set<string>>` — local only, not persisted

### src/components/report/LimitationsSection.tsx
- Default export: `LimitationsSection` component
- Props: `{ limitations: LimitationItem[] }`
- Always visible (no collapse toggle)
- Title: "What We Can't Control"
- Subtitle: "These factors affect outcomes but are outside the scope of this report."
- Each item: title (bold) + description
- "What we can detect quickly" sub-section at bottom

### src/components/report/SidePanel.tsx
- Default export: `SidePanel` component
- Props: `{ issues: Issue[] }`
- Shows first 5 issues as numbered "Top Actions"
- Print button: calls `window.print()`
- "Need help?" — primary CTA button
- "Connect GA/GSC" — disabled button with "Coming soon"
- "Compare against competitors" — link with href="#competitors"
- Has `no-print` class (hidden via `@media print` in index.css)
- Sticky positioning: `sticky top-4` in desktop right column

### src/components/CompetitorForm.tsx
- Default export: `CompetitorForm` component
- Props: `{ websiteUrl: string, location: Location, businessType: BusinessType, intent: Intent, onSubmit: (data: SEOReportRequest) => Promise<void>, isLoading: boolean, error?: string }`
- 3 competitor URL fields (competitor 1 & 2 required, competitor 3 optional)
- URL validation matching InputForm pattern (same `isValidUrl` function)
- Submit disabled until at least 2 valid competitor URLs entered
- Builds `SEOReportRequest` payload with governance inputs + competitors array
- Loading state: "Generating…" button text, disabled
- Error state: alert banner above form
- Section id="competitors" for anchor link from SidePanel

### src/components/report/CompetitorTable.tsx
- Default export: `CompetitorTable` component
- Props: `{ userRow: CompetitorRow, competitors: CompetitorRow[] }`
- Semantic `<table>` with `<thead>` and `<tbody>`
- Columns: Name, Site Speed, Content Coverage, Service Breadth, Local Signals, Review Posture
- User row always first with `data-testid="user-row"`, indigo highlight
- Competitor rows with color coding per cell: green (user better), red (competitor better), yellow (tied)
- Tooltips on all data cells with evidence details
- Local signals displayed as count with tooltip listing signal names
- Review posture as "N reviews (R★)" format
- Responsive: horizontal scroll via `overflow-x-auto` container

### src/components/report/StrengthsGaps.tsx
- Default export: `StrengthsGaps` component
- Props: `{ competitorAdvantages: StrengthItem[], userStrengths: StrengthItem[], gaps: GapItem[] }`
- "What They're Doing Better" section (data-testid="competitor-advantages")
  - Responsive card grid (3 cols desktop), red left border accent
  - Each card: title, description, evidence list with arrow icons
- "What You're Doing Better" section (data-testid="user-strengths")
  - Responsive card grid (2 cols desktop), green left border accent
  - Each card: title, description, evidence list with arrow icons
- "Gap Breakdown by Category" section (data-testid="gap-breakdown")
  - Semantic `<table>` with columns: Category, Your Value, Competitor Value, Significance
  - Color-coded significance badges: High (red), Medium (yellow), Low (green)

### src/components/report/SEOActionPlan.tsx
- Default export: `SEOActionPlan` component
- Props: `{ plan: WeekPlan[] }`
- Disclaimer banner at top with `role="alert"`: "We do not guarantee rankings"
- 4 collapsible week sections, each with:
  - Header button with week number badge, "Week N", and theme name
  - `aria-expanded` attribute for accessibility
  - Chevron icon that rotates on expand/collapse
- Week 1 expanded by default, others collapsed
- Each action rendered as ActionCard with:
  - action text (title), why, signal_strengthened (indigo badge), estimated_impact, verification_method
  - Uses `<dl>` definition list for structured field display

### src/types/api.ts
- All TypeScript interfaces matching backend Pydantic models (see CONTRACTS.md)

## Change Log

- 2026-02-06 US-0.2: Initial scaffold. Vite + React + TS + Tailwind v4, Vitest + RTL, API client, TypeScript types, golden fixtures, Makefile.
- 2026-02-06 US-1.1: Landing page layout and hero. Hero, TrustIndicators, LandingPage. 8 tests.
- 2026-02-06 US-1.2: Input form with validation. InputForm component with all fields, client-side validation, loading state. 8 tests.
- 2026-02-06 US-1.3: Form submission and navigation. react-router-dom, BrowserRouter in App, LandingPage POSTs to API and navigates on success, error handling with retry, ReportPage placeholder. 4 tests.
- 2026-02-06 US-5.1: Report page layout and polling. useJobPolling hook (useReducer-based), ProgressBar with pipeline steps, ReportHeader, ReportPage rewrite with 3 states (loading/error/complete). 6 tests.
- 2026-02-06 US-5.2: Executive summary section. ExecutiveSummary component with working/attention sections, Badge components (DetectedAsBadge, ConfidenceChip), integrated into ReportPage. 7 tests.
- 2026-02-06 US-5.3: Metrics cards. MetricsCards component with responsive grid, EvidencePanel reusable component, integrated into ReportPage. 4 tests.
- 2026-02-06 US-5.4: Issues list with expandable evidence. IssuesList with severity filter, expandable issue cards, SeverityBadge, reuses Badge.tsx + EvidencePanel, integrated into ReportPage. 4 tests.
- 2026-02-06 US-5.5: 30-day checklist section. ChecklistSection grouped by category, collapsible sections, interactive checkboxes (local state), effort badges (S/M/L), frequency/owner/why_it_matters. 5 tests.
- 2026-02-06 US-5.6: Limitations section. LimitationsSection always visible, title+description per item, "What we can detect quickly" sub-section. 3 tests.
- 2026-02-06 US-5.7: Sticky side panel. SidePanel with top 5 actions, print button, CTAs (Need help, Connect GA/GSC disabled, Compare competitors link). 2-column grid layout in ReportPage, @media print CSS. 6 tests.
- 2026-02-07 US-6.2: Competitor input form UI. CompetitorForm component with 3 URL fields, validation, SEOReportRequest payload. 7 tests.
- 2026-02-07 US-8.1: Competitor overview table. CompetitorTable with color-coded comparison, tooltips, responsive horizontal scroll. 7 tests.
- 2026-02-07 US-8.2: Strengths, weaknesses & gap breakdown. StrengthsGaps component with competitor advantages, user strengths, gap breakdown table with color-coded significance. 4 tests.
- 2026-02-07 US-8.3: 30-day SEO action plan. SEOActionPlan component with collapsible week sections, disclaimer banner, action cards with all required fields. 5 tests.
