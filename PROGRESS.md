# Progress

## Completed
- [x] CHG-023: Pipeline Performance Optimization — Frontend (2026-02-10) — 3 tests [SCHEMA_CHANGE]
  - `src/types/api.ts`: Added `issue_insights?: string[]` to `GovernanceReport`
  - `src/components/report/ExecutiveStory.tsx`: Added `issueInsights` prop, renders "Key Findings" blue-bordered bulleted list between narrative and what's working
  - `src/pages/ReportPage.tsx`: Passes `report.issue_insights` to `ExecutiveStory`
  - `src/components/report/__tests__/executive-story.test.tsx`: 3 new tests (renders Key Findings, hides when empty, hides when undefined)
  - `src/mocks/golden/governance-report.json`: Added `issue_insights` array
  - Contract 1.7.0 → 1.8.0
- [x] CHG-020: Honest 5+5 Bulleted Lists in Business Overview (2026-02-10) — 0 net new tests (8 rewritten)
  - `src/components/report/ExecutiveStory.tsx`: Replaced green/amber pills (rounded-full span) with bulleted `<ul>/<li>` lists; each item shows bold title + description with green (checkmark) or amber (warning) left-border styling
  - `src/components/report/__tests__/executive-story.test.tsx`: Rewrote 8 tests verifying list items, descriptions, bold titles, no pills
  - `src/components/report/__tests__/executive-summary.test.tsx`: Fixed Inferred badge test for multiple inferred items
  - `src/mocks/golden/governance-report.json`: Expanded from 3 to 5 items in both whats_working and needs_attention
  - Contract unchanged (1.7.0)
- [x] CHG-018: Segment-Aware Personalized Business Overview (2026-02-09) — 5 tests
  - `src/types/api.ts`: CustomerSegment, CategoryStatus, CategoryInsight types, extended GovernanceReport
  - `src/components/report/BusinessImpactCategories.tsx`: PersonalizedCards + LegacyCards conditional rendering
  - `src/pages/ReportPage.tsx`: Pass categoryInsights prop to BusinessImpactCategories
  - `src/components/report/__tests__/business-impact-categories.test.tsx`: Legacy path + Personalized path tests
  - `src/mocks/golden/governance-report.json`: Added customer_segment + category_insights defaults
  - Contract 1.6.0→1.7.0
- [x] CHG-008: Suggest Competitors via Google Places API (2026-02-07) — 4 tests
  - `src/types/api.ts`: CompetitorSuggestion and SuggestCompetitorsResponse types
  - `src/services/api-client.ts`: fetchCompetitorSuggestions() function
  - `src/hooks/useCompetitorSuggestions.ts`: Custom hook for fetching suggestions
  - `src/components/CompetitorForm.tsx`: Updated to accept suggestions/suggestionsLoading as props (IO layering fix)
  - `src/pages/ReportPage.tsx`: Fetches suggestions at page level, passes as props
  - `src/components/__tests__/competitor-suggestions.test.tsx`: 4 test cases
  - Contract 1.2.0→1.3.0
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
- [x] US-8.4: Tab navigation between reports (2026-02-07) — 18 tests (11 ReportTabs + 7 useSeoJobPolling)
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

- [x] US-9.1: Analytics instrumentation (2026-02-07) — 7 tests
  - Created src/analytics/tracker.ts: track(), setHandler(), resetHandler()
  - Default console.info handler, extensible to GA/Mixpanel
  - EventName union type: 8 tracked events
  - Integrated into Hero, LandingPage, ReportPage, SidePanel, EvidencePanel
  - All events include timestamp in properties
- [x] US-9.2: Error handling & edge cases (2026-02-07) — 8 tests (4 + 4)
  - ErrorBoundary class component: catches rendering errors, shows fallback with role="alert", retry button
  - NotFoundPage: 404 page with accessible heading, descriptive text, home link
  - App.tsx: wrapped with ErrorBoundary, added catch-all `*` route
- [x] US-9.3: Print-friendly styling (2026-02-07) — 0 tests (CSS-only)
  - Comprehensive @media print styles in index.css
  - Hides: .no-print, tablist, #competitors section
  - Expands: all evidence panels (evidence-list visible via CSS override)
  - Page breaks between major sections (section > h2)
  - Print color adjust, shadow removal, URL display on links
  - Full-width layout (no 2-column grid)
  - EvidencePanel refactored: always renders evidence in DOM with hidden attribute
- [x] Story 4: Wire frontend to real backend API (2026-02-07) — 6 new tests (7 total)
  - API client already uses VITE_API_BASE_URL with http://localhost:8000 default
  - Created .env file with VITE_API_BASE_URL=http://localhost:8000
  - Expanded test coverage: base URL, headers, error handling, URL construction

- [x] CHG-001: Pages analyzed display + full report CTA (2026-02-07) — 2 tests
  - Added `pages_analyzed: number` field to GovernanceReport type (additive contract change)
  - Updated golden fixture with `pages_analyzed: 8`
  - ReportPage: "Based on analysis of {N} most important pages" text below header
  - ReportPage: Subtle blue info CTA banner for full-site audit
  - Contract version bumped: 1.0.0 → 1.1.0
  - Branch: change/CHG-001-increase-limits-cta

- [x] CHG-005: Two-View Report — Business Overview + Technical Details (2026-02-07) [SCHEMA CHANGE] — 17 tests
  - Added 3 new components: ExecutiveStory, BusinessImpactCategories, TopImprovements
  - ReportTabs: 2 tabs → 3 tabs (Business Overview default, Technical Details, SEO)
  - SidePanel: added topImprovements + activeTab props, conditional rendering
  - ReportPage: added BusinessContent, tab routing, default to 'business'
  - Types: added executive_narrative, business_category, TopImprovement, top_improvements
  - Updated golden fixture
  - Updated report-tabs tests for 3-tab navigation
  - Updated report-page tests for Business/Technical tab behavior
  - Contract version bumped: 1.1.0 → 1.2.0
  - Branch: change/CHG-005-two-view-report
  - Test count: 127→145

- [x] CHG-031: Extract ReportPage tab content + content map (2026-02-10) — 7 tests
  - `src/components/report/GovernanceContent.tsx`: New — extracted ExecutiveSummary + MetricsCards + IssuesList + ChecklistSection + LimitationsSection
  - `src/components/report/BusinessContent.tsx`: New — extracted ExecutiveStory + BusinessImpactCategories + TopImprovements (with high-confidence filter)
  - `src/components/report/SEOContent.tsx`: New — extracted CompetitorTable + StrengthsGaps + SEOActionPlan
  - `src/components/report/SEOPollingProgress.tsx`: New — extracted SEO polling progress indicator
  - `src/pages/ReportPage.tsx`: Removed inline component definitions, imports from new files (397→294 lines)
  - `src/components/report/__tests__/tab-content-extraction.test.tsx`: 7 tests (component rendering + line count enforcement)
  - No schema/contract change
- [x] CHG-032: Extract page API calls into hooks (2026-02-10) — 9 tests
  - `src/hooks/useGovernanceSubmit.ts`: New — submit + retry + isLoading + error state for POST /api/report/governance
  - `src/hooks/useSeoSubmit.ts`: New — submit + seoJobId + isSubmitting + error state for POST /api/report/seo
  - `src/pages/LandingPage.tsx`: Removed apiClient import, uses useGovernanceSubmit hook
  - `src/pages/ReportPage.tsx`: Removed apiClient import, uses useSeoSubmit hook; fixed react-hooks lint issues
  - `src/hooks/__tests__/useGovernanceSubmit.test.ts`: 5 tests
  - `src/hooks/__tests__/useSeoSubmit.test.ts`: 4 tests
  - No schema/contract change
- [x] CHG-033: Split BusinessImpactCategories dual rendering (2026-02-10) — 0 new tests
  - `src/components/report/PersonalizedCategoryCards.tsx`: New — category cards from CategoryInsight[] (all-required props)
  - `src/components/report/LegacyCategoryCards.tsx`: New — category cards from Issue[] (all-required props)
  - `src/components/report/BusinessImpactCategories.tsx`: Thin dispatcher (217→19 lines)
  - Existing 10 tests pass unchanged via dispatcher backward compat
  - No schema/contract change
- [x] CHG-034: Split SidePanel dual contract (2026-02-10) — 0 new tests
  - `src/components/report/BusinessSidePanel.tsx`: New — top improvements + Print + Need Help (required topImprovements prop)
  - `src/components/report/TechnicalSidePanel.tsx`: New — top actions + all CTAs (required issues prop)
  - `src/components/report/SidePanel.tsx`: Thin dispatcher (97→18 lines)
  - Existing 6 tests pass unchanged via dispatcher backward compat
  - No schema/contract change

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
| Phase 3 (SEO Module) | COMPLETE | US-6.2, US-8.1, US-8.2, US-8.3, US-8.4 | 42 |
| Phase 4 (Integration & Polish) | COMPLETE | US-9.1 analytics (7 tests), US-9.2 error handling (8 tests), US-9.3 print CSS (0 tests), API wiring (6 tests) | 21 |
| CHG-001 (Increase Limits CTA) | COMPLETE | 1 story | 2 |
| CHG-004 (Fix Progress %) | COMPLETE | 1 story | 5 |
| CHG-005 (Two-View Report) | COMPLETE | 3 stories | 17 |
| CHG-007 (Move Competitor Form) | COMPLETE | 1 story | 1 |
| CHG-008 (Suggest Competitors) | COMPLETE | 1 story | 4 |
| CHG-011 (Improve Suggestions) | COMPLETE | 1 story | 4 |
| CHG-012 (Click Suggestion Fill) | COMPLETE | 1 story | 5 |
| CHG-013 (SEO Reuse Governance) | COMPLETE | 1 story | 2 |
| CHG-018 (Segment Personalization) | COMPLETE | 1 story | 5 |
| CHG-020 (Honest 5+5 Lists) | COMPLETE | 1 story | 0 (8 rewritten) |
| CHG-023 (Pipeline Perf — Frontend) | COMPLETE | 1 story | 3 |
| CHG-031 (Tab Content Extraction) | COMPLETE | 1 story | 7 |
| CHG-032 (API Hook Extraction) | COMPLETE | 1 story | 9 |
| CHG-033 (BusinessImpact Split) | COMPLETE | 1 story | 0 |
| CHG-034 (SidePanel Split) | COMPLETE | 1 story | 0 |
| **Total** | **COMPLETE** | **21 stories + 15 changes** | **189 tests** |

## Up Next
(none pending)
