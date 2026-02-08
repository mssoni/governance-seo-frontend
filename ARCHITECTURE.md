# Frontend Architecture

> **LIVING SOURCE OF TRUTH** -- Updated after every user story.
> If a file/component is not listed here, it doesn't exist.

## File Tree

```
frontend/
├── src/
│   ├── main.tsx                   # React entry point
│   ├── App.tsx                    # Root component with ErrorBoundary + routing
│   ├── App.css                    # App-specific styles
│   ├── App.test.tsx               # Smoke test (renders without crashing)
│   ├── index.css                  # Tailwind CSS v4 import + comprehensive print styles
│   ├── test-setup.ts              # Vitest setup (jest-dom matchers)
│   ├── analytics/
│   │   ├── tracker.ts             # Analytics event tracker (console.info default, extensible) [Added in US-9.1]
│   │   └── __tests__/
│   │       └── tracker.test.ts    # Analytics tracker tests (7 cases) [Added in US-9.1]
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
│   │   │   ├── ReportTabs.tsx     # WCAG-compliant tab navigation (Business/Technical/SEO) [Added in US-8.4, Updated in CHG-005]
│   │   │   ├── ExecutiveStory.tsx  # Executive narrative with working/attention pills [Added in CHG-005]
│   │   │   ├── BusinessImpactCategories.tsx # Business impact category cards [Added in CHG-005]
│   │   │   ├── TopImprovements.tsx # Top 3 improvements with effort/category [Added in CHG-005]
│   │   │   └── __tests__/
│   │   │       ├── executive-summary.test.tsx  # ExecutiveSummary tests (7 cases)
│   │   │       ├── issues-list.test.tsx        # IssuesList tests (4 cases)
│   │   │       ├── metrics-cards.test.tsx      # MetricsCards tests (4 cases)
│   │   │       ├── checklist.test.tsx           # ChecklistSection tests (5 cases)
│   │   │       ├── limitations.test.tsx         # LimitationsSection tests (3 cases)
│   │   │       ├── side-panel.test.tsx          # SidePanel tests (6 cases)
│   │   │       ├── competitor-table.test.tsx    # CompetitorTable tests (7 cases)
│   │   │       ├── strengths-gaps.test.tsx      # StrengthsGaps tests (4 cases)
│   │   │       ├── action-plan.test.tsx         # SEOActionPlan tests (5 cases)
│   │   │       ├── report-tabs.test.tsx        # ReportTabs tests (11 cases) [Added in US-8.4, Updated in CHG-005]
│   │   │       ├── executive-story.test.tsx    # ExecutiveStory tests (4 cases) [Added in CHG-005]
│   │   │       ├── business-impact-categories.test.tsx # BusinessImpactCategories tests (5 cases) [Added in CHG-005]
│   │   │       └── top-improvements.test.tsx   # TopImprovements tests (5 cases) [Added in CHG-005]
│   │   ├── CompetitorForm.tsx     # Competitor input form (3 URL fields, validation, SEO submit)
│   │   ├── ErrorBoundary.tsx      # React error boundary with retry (role="alert") [Added in US-9.2]
│   │   └── __tests__/
│   │       ├── input-form.test.tsx  # InputForm tests (8 cases)
│   │       ├── competitor-form.test.tsx  # CompetitorForm tests (7 cases)
│   │       ├── competitor-suggestions.test.tsx  # Competitor suggestions tests (13 cases) [Added in CHG-008, Updated in CHG-012]
│   │       └── error-boundary.test.tsx  # ErrorBoundary tests (4 cases) [Added in US-9.2]
│   ├── hooks/
│   │   ├── useJobPolling.ts       # Custom hook: polls job status, returns state + retry
│   │   ├── useSeoJobPolling.ts    # Custom hook: polls SEO job status, conditional activation [Added in US-8.4]
│   │   ├── useCompetitorSuggestions.ts  # Custom hook: fetches competitor suggestions from Places API [Added in CHG-008]
│   │   └── __tests__/
│   │       └── useSeoJobPolling.test.ts  # SEO polling hook tests (7 cases) [Added in US-8.4]
│   ├── pages/
│   │   ├── LandingPage.tsx        # Landing page (Hero + TrustIndicators + form + error UI)
│   │   ├── ReportPage.tsx         # Report page with polling, progress, header, report content
│   │   ├── NotFoundPage.tsx       # 404 page with accessible heading + home link [Added in US-9.2]
│   │   └── __tests__/
│   │       ├── landing-page.test.tsx     # Landing page tests (8 cases)
│   │       ├── form-submission.test.tsx  # Form submission + navigation tests (4 cases)
│   │       ├── report-page.test.tsx     # Report page polling + display tests (6 cases)
│   │       └── not-found.test.tsx       # NotFoundPage tests (4 cases) [Added in US-9.2]
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
├── .env                           # Environment variables (VITE_API_BASE_URL) [Added in Story 4]
├── BLOCKERS.md
├── MOCK_DATA.md
├── TEST_GUIDE.md
├── REVIEW_STRATEGY.md
└── REVIEW_LOG.md
```

## Component Tree

```
App
├── ErrorBoundary (catches rendering errors, shows fallback with retry)
├── BrowserRouter + Routes
├── / → LandingPage
│   ├── Hero              # Headline, subheadline, CTA anchor to #report-form
│   ├── TrustIndicators   # 3 trust badges in responsive grid
│   ├── <section #report-form>
│   │   └── InputForm     # URL, location, business type, intent fields + validation
│   └── Error display     # API/network error alert with optional retry button
├── /report → ReportPage  # Reads ?job= param, polls for status
    ├── [loading] ProgressBar      # Progress bar + step labels
    ├── [error] Error display      # Error message + "Try again" button
    └── [complete]
        ├── ReportHeader           # Website URL, location, intent badge
        ├── PagesAnalyzedText      # "Based on analysis of {N} most important pages" [Added in CHG-001]
        ├── FullReportCTA          # Subtle blue info banner for full-site audit CTA [Added in CHG-001]
        └── ReportTabs             # WCAG tab navigation (Business / Technical / SEO) [Updated in CHG-005]
            ├── [business tab — default] [Added in CHG-005]
            │   └── BusinessContent
            │       ├── ExecutiveStory      # Narrative text + working/attention pills
            │       ├── BusinessImpactCategories  # 4 category cards with severity indicators
            │       └── TopImprovements     # Top 3 improvements with effort/category badges
            ├── [technical tab] [Renamed from governance in CHG-005]
            │   ├── GovernanceContent
            │   │   ├── ExecutiveSummary   # Working items (green) + attention items (orange)
            │   │   │   └── SummaryCard    # Per-item card with Badge + ConfidenceChip
            │   │   ├── MetricsCards       # 2-col responsive grid of metric cards
            │   │   │   └── MetricCardItem # Name, value, meaning, why_it_matters, EvidencePanel
            │   │   ├── IssuesList         # Severity-filtered list of expandable issue cards
            │   │   │   └── IssueCard      # Title, badges, expandable details with EvidencePanel
            │   │   ├── ChecklistSection   # 30-day checklist grouped by category
            │   │   │   └── CategoryGroup  # Collapsible category with checkbox items
            │   │   └── LimitationsSection # Always-visible limitations list
            │   ├── [if SEO polling] SEOPollingProgress  # Progress indicator during SEO generation
            │   ├── [if SEO error] Error alert
            │   └── [if no SEO job] CompetitorForm  # CTA to start SEO analysis
            ├── [seo tab — enabled when SEO report ready]
            │   └── SEOContent
            │       ├── CompetitorTable     # Color-coded comparison table
            │       ├── StrengthsGaps       # Advantages, strengths, gap breakdown
            │       └── SEOActionPlan       # 4-week plan with disclaimer
            └── SidePanel (right col, sticky, desktop only, hidden on print)
                ├── Top Improvements (business tab) / Top Actions (other tabs) [Updated in CHG-005]
                ├── Print Report button (tracks cta_click)
                ├── Need help? CTA (tracks cta_click)
                ├── Connect GA/GSC (disabled, Coming soon — hidden on business tab)
                └── Compare against competitors (link, tracks cta_click — hidden on business tab)
└── * → NotFoundPage  # 404 catch-all with home link
```

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Landing page with input form, API submission, error handling |
| `/report` | ReportPage | Report display with job polling, progress, error, report rendering |
| `*` | NotFoundPage | 404 catch-all with accessible heading and home link |

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
  → On complete: render ReportHeader + ReportTabs (Governance tab active)
  → Governance tab shows: GovernanceContent + CompetitorForm CTA
  → User submits competitors via CompetitorForm
  → POST /api/report/seo → receive seo_job_id
  → useSeoJobPolling(seo_job_id) starts polling
  → SEO progress indicator shown below governance content
  → On SEO complete: auto-switch to SEO tab, render SEOContent
```

## Interface Contracts

### src/services/api-client.ts [Updated in CHG-008, CHG-011]
- `apiClient.get<T>(path)` → `Promise<T>`
- `apiClient.post<T>(path, body)` → `Promise<T>`
- `ApiError` class with `status` and `body`
- `fetchCompetitorSuggestions(params: SuggestCompetitorsParams)` → `Promise<SuggestCompetitorsResponse>` — calls `GET /api/report/suggest-competitors` [Added in CHG-008, Updated in CHG-011 to pass website_url]

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

### src/pages/ReportPage.tsx [Updated in CHG-008]
- Default export: `ReportPage` component (no props)
- Reads `job`, `url`, `location`, `intent`, `business_type` from URL search params
- Uses `useJobPolling(jobId)` for governance polling
- Uses `useSeoJobPolling(seoJobId)` for SEO polling (conditional, only when seoJobId set)
- Uses `useCompetitorSuggestions({ businessType, city, region, country })` — fetches at page level, passes as props to CompetitorForm [Added in CHG-008]
- Three states: loading (ProgressBar), error (message + Try again), complete (ReportHeader + ReportTabs)
- Complete state: ReportTabs wrapping GovernanceContent + SEOContent
  - Governance tab: GovernanceContent + CompetitorForm CTA (when no SEO job) + SEO polling progress
  - SEO tab: SEOContent (CompetitorTable, StrengthsGaps, SEOActionPlan) — enabled when SEO report ready
  - Auto-switch to SEO tab when SEO report completes (via useEffect + useRef tracking)
- `handleCompetitorSubmit`: POST /api/report/seo, sets seoJobId on success
- 2-column grid: main content (left, wider) + SidePanel (right, 280px, sticky, desktop only)
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

### src/components/report/SidePanel.tsx [Updated in CHG-005]
- Default export: `SidePanel` component
- Props: `{ issues: Issue[], topImprovements?: TopImprovement[], activeTab?: TabId }`
- Business tab: shows "Top Improvements" (up to 3 from topImprovements prop), hides GA/GSC and Compare links
- Other tabs: shows first 5 issues as numbered "Top Actions", full CTA set
- Print button: calls `window.print()`
- "Need help?" — primary CTA button
- "Connect GA/GSC" — disabled button with "Coming soon" (hidden on business tab)
- "Compare against competitors" — link with href="#competitors" (hidden on business tab)
- Has `no-print` class (hidden via `@media print` in index.css)
- Sticky positioning: `sticky top-4` in desktop right column

### src/components/report/ExecutiveStory.tsx [Added in CHG-005]
- Default export: `ExecutiveStory` component
- Props: `{ narrative: string, whatsWorking: SummaryItem[], needsAttention: SummaryItem[] }`
- Renders narrative text paragraph (no technical jargon)
- "What's working" pills (green) and "Needs attention" pills (amber)
- Does NOT show DetectedAs badges or Confidence chips (business-friendly)

### src/components/report/BusinessImpactCategories.tsx [Added in CHG-005]
- Default export: `BusinessImpactCategories` component
- Props: `{ issues: Issue[] }`
- Groups issues by `business_category` into 4 cards: "Trust & Credibility", "Search Visibility", "User Experience", "Operational Risk"
- Each card shows: icon, category name, finding count badge, severity-based status text ("Looking good" / "Minor improvements available" / "Needs attention"), summary text
- Color-coded left border: green (no issues), amber (low/medium), red (high)

### src/components/report/TopImprovements.tsx [Added in CHG-005]
- Default export: `TopImprovements` component
- Props: `{ improvements: TopImprovement[], onSwitchToTechnical?: () => void }`
- Renders up to 3 improvement cards with numbered circles, title, description, effort badge (Small/Medium/Large), category pill
- "We can help with this" CTA link per card
- "View full 30-day checklist in Technical Details" button at bottom

### src/components/CompetitorForm.tsx [Updated in CHG-008, CHG-011, CHG-012]
- Default export: `CompetitorForm` component
- Props: `{ websiteUrl: string, location: Location, businessType: BusinessType, intent: Intent, onSubmit: (data: SEOReportRequest) => Promise<void>, isLoading: boolean, error?: string, suggestions?: CompetitorSuggestion[], suggestionsLoading?: boolean, userPlace?: CompetitorSuggestion | null }`
- `suggestions`, `suggestionsLoading`, and `userPlace` received as props from page layer (not fetched internally) — IO layering compliant
- When `userPlace` is provided, renders a Google Business Profile review card (data-testid="user-review-card") showing name, address, rating, review count
- **Clickable suggestion cards** (CHG-012): clicking a suggestion with `website_url` fills the next empty competitor URL input; clicking one without `website_url` shows "has no website listed" message; selected cards show visual indicator (indigo border + checkmark + `data-selected="true"`)
- Suggestion cards rendered as `<button>` elements with `data-testid="suggestion-card-{idx}"`
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

### src/components/report/ReportTabs.tsx [Updated in CHG-005]
- Default export: `ReportTabs` component
- Exported type: `TabId = 'business' | 'technical' | 'seo'`
- Props: `{ activeTab: TabId, onTabChange: (tab: TabId) => void, seoEnabled: boolean, children: React.ReactNode }`
- 3 tabs: Business Overview (default), Technical Details, Competitive SEO Report
- WCAG-compliant tab pattern: `role="tablist"`, `role="tab"`, `role="tabpanel"`
- `aria-selected`, `aria-controls`, `aria-disabled` attributes
- `tabIndex={0}` for active tab, `tabIndex={-1}` for inactive
- Keyboard navigation: ArrowLeft/ArrowRight to switch tabs (skips disabled SEO)
- SEO tab disabled with lock icon + "Add competitors to unlock" tooltip when `seoEnabled=false`
- Tab IDs: `tab-business`, `tab-technical`, `tab-seo`; Panel IDs: `tabpanel-business`, `tabpanel-technical`, `tabpanel-seo`

### src/hooks/useCompetitorSuggestions.ts [Added in CHG-008, Updated in CHG-011]
- `useCompetitorSuggestions({ businessType, city, region, country, websiteUrl? })` → `{ suggestions: CompetitorSuggestion[], userPlace: CompetitorSuggestion | null, loading: boolean }`
- Calls `fetchCompetitorSuggestions()` from api-client, passes websiteUrl for two-step search
- Manages `suggestions`, `userPlace`, and `loading` state via `useState`
- Returns empty suggestions and null userPlace on error (graceful degradation)
- Used at page level (ReportPage) — not imported by components directly (IO layering)

### src/hooks/useSeoJobPolling.ts
- `useSeoJobPolling(jobId: string | null)` → `{ status, progress, currentStep, stepsCompleted, seoReport, error, retry }`
- Polls `GET /api/report/status/{jobId}` every 2.5 seconds
- Only active when `jobId` is non-null
- Uses `useReducer` for state management (RESET, POLL_SUCCESS, POLL_ERROR, RETRY actions)
- Stops polling on `complete` or `failed` status, or on network error
- Proper cleanup: `active` flag prevents state updates after unmount, `clearInterval` in effect cleanup
- `retry()` increments `retryCount` to re-trigger the polling effect

### src/types/api.ts [Updated in CHG-008, CHG-011]
- All TypeScript interfaces matching backend Pydantic models (see CONTRACTS.md)
- `CompetitorSuggestion` interface: name, address, rating, review_count, website_url — added in CHG-008
- `SuggestCompetitorsResponse` interface: suggestions, user_place — added in CHG-008, updated in CHG-011

### src/analytics/tracker.ts
- `track(event: EventName, properties?: Record<string, unknown>)` — logs analytics event
- `setHandler(handler: AnalyticsHandler)` — register custom handler (e.g. GA)
- `resetHandler()` — revert to default console.info handler
- EventName: `report_generation_start` | `report_generation_complete` | `report_generation_failed` | `cta_click` | `tab_switch` | `evidence_expand` | `seo_report_start` | `seo_report_complete`
- Default: `console.info('[analytics]', event, { ...properties, timestamp })` 

### src/components/ErrorBoundary.tsx
- Default export: `ErrorBoundary` (class component)
- Props: `{ children: ReactNode }`
- Catches React rendering errors, shows fallback with `role="alert"`
- Fallback: heading "Something went wrong", retry button that resets error state
- Logs errors via `console.warn('[ErrorBoundary]', ...)`

### src/pages/NotFoundPage.tsx
- Default export: `NotFoundPage` component (no props)
- Shows 404 text, "Page not found" heading, descriptive text, "Go back home" link to `/`
- Uses `<Link>` from react-router-dom

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
- 2026-02-07 US-8.4: Tab navigation + SEO polling integration. ReportTabs component with WCAG-compliant tab pattern (role="tablist"/"tab"/"tabpanel", aria-selected, aria-controls, keyboard navigation). SEO tab disabled with lock icon + tooltip when no SEO report. useSeoJobPolling hook: conditional polling with useReducer state, proper cleanup (active flag, clearInterval). ReportPage updated: CompetitorForm CTA, SEO polling progress, auto-switch to SEO tab on completion. 18 tests (11 ReportTabs + 7 useSeoJobPolling).
- 2026-02-07 US-9.1: Analytics instrumentation. Created src/analytics/tracker.ts with track(), setHandler(), resetHandler(). Default console.info handler, extensible to GA. Integrated tracking into Hero (cta_click), LandingPage (report_generation_start/failed), ReportPage (report_generation_complete/failed, tab_switch, seo_report_start/complete), SidePanel (cta_click for Print/Need help/GA/GSC/Compare), EvidencePanel (evidence_expand). 7 tests.
- 2026-02-07 US-9.2: Error handling & edge cases. ErrorBoundary class component wrapping App (catches rendering errors, shows fallback UI with role="alert" and retry button). NotFoundPage for 404 catch-all route. App.tsx updated with ErrorBoundary wrapper and `*` route. 8 tests (4 ErrorBoundary + 4 NotFoundPage).
- 2026-02-07 US-9.3: Print-friendly styling. Comprehensive @media print CSS in index.css: hides .no-print, tablist, #competitors; expands all evidence panels (evidence-list always visible); page breaks between major sections; print color adjust; URL printing on links; removes shadows; full-width layout. EvidencePanel updated to always render evidence in DOM (hidden attribute when collapsed) for print CSS override.
- 2026-02-07 Story 4: Wire frontend to real backend API. API client already uses VITE_API_BASE_URL with http://localhost:8000 default. Created .env file. Expanded api-client tests: verifies base URL config, Content-Type headers on GET/POST, error handling, URL construction. 7 tests (up from 1).
- 2026-02-07 CHG-001: Pages analyzed display + full report CTA. Added `pages_analyzed: number` field to GovernanceReport type and golden fixture. ReportPage shows "Based on analysis of {N} most important pages" text and a subtle blue CTA banner ("For a comprehensive full-site audit, reach out to us."). Contract version bumped to 1.1.0. 2 tests.
- 2026-02-07 CHG-011: Improve competitor suggestions. Updated SuggestCompetitorsResponse type with user_place field. Updated api-client.ts to pass website_url param. Updated useCompetitorSuggestions hook to accept websiteUrl and return userPlace. Updated ReportPage to pass websiteUrl to hook and userPlace to CompetitorForm. Added Google Business Profile review card to CompetitorForm (data-testid="user-review-card"). 8 tests (4 new for review card). Contract 1.3.0→1.4.0.
- 2026-02-07 CHG-008: Suggest Competitors via Google Places API. Added CompetitorSuggestion and SuggestCompetitorsResponse types to api.ts. Added fetchCompetitorSuggestions() to api-client.ts. Added useCompetitorSuggestions hook (hooks/useCompetitorSuggestions.ts). Updated CompetitorForm to accept suggestions/suggestionsLoading as props (IO layering fix — hook called at page level in ReportPage, not in component). Updated ReportPage to fetch suggestions and pass as props. 4 tests (competitor-suggestions.test.tsx). Contract 1.2.0→1.3.0.
- 2026-02-08 CHG-012: Click suggestion to fill URL. Suggestion cards now clickable `<button>` elements. Clicking fills next empty competitor URL input with website_url. Cards without website show "no website" message. Selected cards show indigo border + checkmark. 5 new tests (159 total). No schema/contract change.
- 2026-02-07 CHG-005: Two-View Report — Business Overview + Technical Details. Added 3 new components: ExecutiveStory (narrative + pills), BusinessImpactCategories (4 category cards), TopImprovements (top 3 with effort/category). ReportTabs updated to 3 tabs (Business Overview default, Technical Details, SEO). SidePanel updated with topImprovements + activeTab props. ReportPage updated with BusinessContent + tab routing. Types updated: executive_narrative on ExecutiveSummary, business_category on Issue, TopImprovement interface, top_improvements on GovernanceReport. Golden fixture updated. Contract 1.1.0→1.2.0. 17 new tests (4 ExecutiveStory + 5 BusinessImpactCategories + 5 TopImprovements + 3 ReportPage).
