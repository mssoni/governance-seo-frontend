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
- [x] US-5.5: 30-day checklist section (2026-02-06) — 5 tests
  - ChecklistSection component: items grouped by category
  - Collapsible category sections (expanded by default)
  - Interactive checkboxes with local state (Set-based toggle)
  - Effort badges: S=green, M=yellow, L=red
  - Frequency tag, owner badge, why_it_matters per item
  - Integrated into ReportPage after IssuesList
- [x] US-5.6: "What we can't control" section (2026-02-06) — 3 tests
  - LimitationsSection component: always visible, no collapse
  - All limitation items with title (bold) + description
  - Subtitle explaining scope context
  - "What we can detect quickly" sub-section
  - Integrated into ReportPage after ChecklistSection
- [x] US-5.7: Sticky side panel and CTAs (2026-02-06) — 6 tests
  - SidePanel component with top 5 actions from issues
  - Print button triggers window.print()
  - "Need help?" primary CTA button
  - "Connect GA/GSC" disabled button (Coming soon)
  - "Compare against competitors" link (href=#competitors)
  - Desktop: sticky right column (2-col grid layout)
  - @media print CSS hides .no-print elements
  - ReportPage updated to max-w-6xl with 2-column grid

- [x] US-6.2: Competitor input form UI (2026-02-07) — 7 tests
  - CompetitorForm component: 3 URL fields (2 required, 1 optional)
  - URL validation matching InputForm pattern
  - Submit disabled until 2+ valid competitor URLs
  - Builds SEOReportRequest payload with governance inputs + competitors array
  - Loading state and error display support
  - Section id="competitors" for SidePanel anchor link
- [x] US-8.1: Competitor overview table (2026-02-07) — 7 tests
  - CompetitorTable component: semantic table with color-coded cells
  - User row always first with indigo highlight (data-testid="user-row")
  - Columns: Site Speed, Content Coverage, Service Breadth, Local Signals, Review Posture
  - Color coding: green (user better), red (competitor better), yellow (tied)
  - Tooltips on all data cells with evidence details
  - Local signals displayed as count with tooltip listing signals
  - Responsive horizontal scroll on mobile
- [x] US-8.2: Strengths, weaknesses & gap breakdown (2026-02-07) — 4 tests
  - StrengthsGaps component: competitor advantages + user strengths + gap breakdown
  - "What They're Doing Better" section with min 3 items (red accent cards)
  - "What You're Doing Better" section with min 2 items (green accent cards)
  - Each item: title, description, evidence list
  - Gap breakdown table: Category, Your Value, Competitor Value, Significance
  - Color-coded significance badges (High=red, Medium=yellow, Low=green)
- [x] US-8.3: 30-day SEO action plan UI (2026-02-07) — 5 tests
  - SEOActionPlan component: 4 collapsible week sections
  - Disclaimer banner with role="alert": "We do not guarantee rankings"
  - Week 1 expanded by default, others collapsed
  - Each action: action text, why, signal_strengthened, estimated_impact, verification_method
  - aria-expanded on collapsible sections, aria-hidden on decorative icons
- [x] US-8.4: Tab navigation between reports (2026-02-07) — 12 tests
  - ReportTabs component: role="tablist" with Governance and SEO tabs
  - SEO tab disabled with lock icon + "Add competitors to unlock" tooltip when seoEnabled=false
  - Active tab has aria-selected=true, inactive has aria-selected=false
  - Keyboard navigation: ArrowLeft/ArrowRight to switch tabs
  - aria-controls linking tabs to tabpanel, id on tabpanel
  - ReportPage integration: tabs wrap governance + SEO content
  - CompetitorForm CTA shown below governance report when no SEO job
  - useSeoJobPolling hook: polls for SEO report with conditional activation
  - Auto-switch to SEO tab when SEO report completes
  - SEO tab content: CompetitorTable, StrengthsGaps, SEOActionPlan
  - SEO polling progress indicator shown below governance report during generation

## In Progress
(none)

## Blocked
(none)

## Phase Completion

| Phase | Status | Stories | Tests |
|-------|--------|---------|-------|
| Phase 0 (Bootstrap) | COMPLETE | US-0.2 | 2 |
| Phase 1 (Foundation) | COMPLETE | US-1.1 through US-1.3 | 20 |
| Phase 2 (Core Engine) | COMPLETE | US-5.1 through US-5.7 | 35 |
| Phase 3 (SEO Module) | IN PROGRESS | US-6.2, US-8.1, US-8.2, US-8.3, US-8.4 | 35 |
| **Total** | | **15 stories** | **92 tests** |

## Up Next (Phase 3 — SEO Module)
(none pending)
