/**
 * TypeScript types matching backend Pydantic models exactly.
 *
 * These types are the FRONTEND SOURCE OF TRUTH for API contracts.
 * Any changes here MUST be mirrored in:
 *   - /backend/app/models/schemas.py (Pydantic models)
 *   - /backend/CONTRACTS.md & /frontend/CONTRACTS.md
 *   - /frontend/src/mocks/golden/ (golden fixtures)
 */

// --- Enums ---

export type BusinessType =
  | 'clinic'
  | 'dental'
  | 'healthcare_services'
  | 'ngo'
  | 'education'
  | 'construction'
  | 'logistics'
  | 'manufacturing'
  | 'professional_services'
  | 'other'

export type Intent = 'seo' | 'governance' | 'both'

export type JobStatus = 'queued' | 'processing' | 'complete' | 'failed'

export type Severity = 'high' | 'medium' | 'low'

export type Confidence = 'high' | 'medium' | 'low'

export type DetectedAs = 'observed' | 'inferred'

export type Effort = 'S' | 'M' | 'L'

export type Owner = 'business' | 'developer' | 'agency'

// --- Request Models ---

export interface Location {
  city: string
  region: string
  country: string
}

export interface GovernanceReportRequest {
  website_url: string
  location: Location
  business_type: BusinessType
  intent: Intent
}

export interface SEOReportRequest {
  website_url: string
  location: Location
  business_type: BusinessType
  intent: Intent
  competitors: string[] // 2-3 URLs
  governance_job_id?: string // CHG-013: reuse governance results
}

export interface FullReportRequest {
  website_url: string
  location: Location
  business_type: BusinessType
  intent: Intent
  competitors?: string[] // 0-3 URLs; omit for governance-only
}

// --- Response Models: Governance Report ---

export interface Evidence {
  description: string
  raw_value: string | null
}

export interface Issue {
  issue_id: string
  title: string
  severity: Severity
  confidence: Confidence
  detected_as: DetectedAs
  business_category: string
  evidence: Evidence[]
  why_it_matters: string
  what_happens_if_ignored: string
  what_to_do: string[]
  expected_impact: string
}

export interface MetricCard {
  name: string
  value: string
  meaning: string
  evidence: Evidence[]
  why_it_matters: string
}

export interface SummaryItem {
  title: string
  description: string
  detected_as: DetectedAs
  confidence: Confidence
}

export interface ExecutiveSummary {
  executive_narrative: string
  whats_working: SummaryItem[]
  needs_attention: SummaryItem[]
}

export interface ChecklistItem {
  action: string
  category: string
  frequency: string
  owner: Owner
  effort: Effort
  why_it_matters: string
}

export interface LimitationItem {
  title: string
  description: string
}

export interface TopImprovement {
  title: string
  description: string
  effort: Effort
  category: string
}

// CHG-018: Segment-Aware Personalized Business Overview
export type CustomerSegment = 'revenue_driven' | 'risk_aware' | 'oversight'
export type CategoryStatus = 'at_risk' | 'on_track' | 'good'

export interface CategoryInsight {
  category_id: string
  display_name: string
  headline: string
  detail: string
  icon: string
  status: CategoryStatus
  issue_count: number
  max_severity: Severity | null
}

export interface GovernanceReport {
  pages_analyzed: number
  summary: ExecutiveSummary
  metrics: MetricCard[]
  issues: Issue[]
  checklist_30d: ChecklistItem[]
  limitations: LimitationItem[]
  top_improvements: TopImprovement[]
  // CHG-018: Segment personalization
  customer_segment?: CustomerSegment | null
  category_insights?: CategoryInsight[]
}

// --- Response Models: SEO Report ---

export interface CompetitorRow {
  name: string
  url: string
  speed_band: string
  content_coverage: string
  service_breadth: number
  local_signals: string[]
  review_count: number | null
  review_rating: number | null
}

export interface GapItem {
  category: string
  your_value: string
  competitor_value: string
  significance: string
}

export interface StrengthItem {
  title: string
  description: string
  evidence: string[]
}

export interface WeekAction {
  action: string
  why: string
  signal_strengthened: string
  estimated_impact: string
  verification_method: string
}

export interface WeekPlan {
  week: number
  theme: string
  actions: WeekAction[]
}

export interface SEOReport {
  competitor_table: CompetitorRow[]
  competitor_advantages: StrengthItem[]
  user_strengths: StrengthItem[]
  gaps: GapItem[]
  plan_30d: WeekPlan[]
}

// --- Response Models: Job Status ---

export interface JobCreateResponse {
  job_id: string
  status: JobStatus
}

export interface JobStatusResponse {
  job_id: string
  status: JobStatus
  progress: number
  current_step: string | null
  steps_completed: string[]
  error: string | null
  governance_report: GovernanceReport | null
  seo_report: SEOReport | null
}

// --- Competitor Suggestions (Google Places) ---

export interface CompetitorSuggestion {
  name: string
  address: string
  rating: number | null
  review_count: number | null
  website_url: string | null
}

export interface SuggestCompetitorsResponse {
  suggestions: CompetitorSuggestion[]
  user_place: CompetitorSuggestion | null
}

// --- Transparency ---

export interface InferenceNote {
  signal_id: string
  note: string
  confidence: Confidence
}

export interface TransparencyInfo {
  inference_notes: InferenceNote[]
  disclaimer: string
}
