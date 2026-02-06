# Progress

## Completed
- [x] US-0.2: Frontend scaffold (Phase 0 bootstrap, 2026-02-06)
- [x] US-1.1: Landing page layout and hero (2026-02-06) — 8 tests
- [x] US-1.2: Input form with validation (2026-02-06) — 8 tests
  - Vite + React 18 + TypeScript
  - Tailwind CSS v4 configured
  - Vitest + React Testing Library configured
  - API client with base URL config
  - TypeScript types matching backend Pydantic models
  - Golden fixtures for governance + SEO reports
  - Makefile quality gate (`make check`)
  - All orientation documents created
- [x] US-1.3: Form submission and navigation (2026-02-06) — 4 tests
  - react-router-dom installed, BrowserRouter in App.tsx
  - LandingPage: POST /api/report/governance, navigate to /report?job={id}
  - API error handling with user-friendly messages
  - Network error handling with retry button
  - ReportPage placeholder (reads job param from URL)
- [x] US-5.1: Report page layout and polling (2026-02-06) — 6 tests
  - useJobPolling hook with useReducer state machine
  - ProgressBar component with pipeline step labels
  - ReportHeader component with URL, location, intent badge
  - ReportPage rewrite: polling → progress → error/complete states
  - Error state with "Try again" button that restarts polling
- [x] US-5.2: Executive summary section (2026-02-06) — 7 tests
  - ExecutiveSummary component with "What's Working" / "What Needs Attention"
  - Badge.tsx: DetectedAsBadge (Observed/Inferred) + ConfidenceChip (High/Med/Low)
  - Green card layout for positives, orange/red for risks
  - Integrated into ReportPage render flow
- [x] US-5.3: Metrics cards (2026-02-06) — 4 tests
  - MetricsCards component with responsive 2-col grid
  - EvidencePanel reusable expandable component with defaultOpen prop
  - Each card: name, value (large), meaning, "Why it matters", expandable evidence
  - Integrated into ReportPage after ExecutiveSummary
- [x] US-5.4: Issues list with expandable evidence (2026-02-06) — 4 tests
  - IssuesList component with severity filter buttons (All/High/Medium/Low)
  - Issues sorted by severity (High first)
  - Each issue: title, SeverityBadge (color-coded), ConfidenceChip, DetectedAsBadge
  - Expandable details: evidence, why_it_matters, what_happens_if_ignored, what_to_do, expected_impact
  - SeverityBadge: High (red), Medium (orange), Low (green)
  - Reuses EvidencePanel and Badge components
  - Integrated into ReportPage after MetricsCards

## In Progress
(none)

## Blocked
(none)

## Up Next
- US-5.5+: Remaining report sections (checklist, limitations)
